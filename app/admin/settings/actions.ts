'use server'
import { db, writeTransaction } from '@/db'
import { storeSettings } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { deliverySettings, normalizePhone, PUBLIC_SETTING_KEYS, userFacingError, ValidationError } from '@/lib/commerce'

export async function updateSettings(_previous:{success:boolean;message:string}, formData:FormData) {
  try { await requireAdmin() } catch { return {success:false,message:'Session expired. Please log in again.'} }
  try {
    const keys = [...PUBLIC_SETTING_KEYS,'steadfast_api_key','steadfast_secret_key']
    const values:Record<string,string>={}
    for (const key of keys) {
      const value=formData.get(key)
      if (typeof value === 'string') {
        if (value.length > 5000) throw new ValidationError('A setting is too long.')
        values[key]=value.trim()
      }
    }
    if (!values.storeName) throw new ValidationError('Store name is required.')
    deliverySettings(values)
    for (const key of ['phone','whatsapp','bkash_number','nagad_number']) if (values[key]) normalizePhone(values[key])
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) throw new ValidationError('Enter a valid support email.')
    for (const key of ['facebook','instagram','youtube','tiktok','twitter','linkedin']) if(values[key]) {
      try { const u=new URL(values[key]); if(u.protocol !== 'https:' || u.username || u.password) throw new Error() }
      catch { throw new ValidationError(`${key} must be a complete https:// URL.`) }
    }
    await writeTransaction(async tx=>{
      for (const [key,value] of Object.entries(values)) await tx.insert(storeSettings).values({key,value,updatedAt:new Date()})
        .onConflictDoUpdate({target:storeSettings.key,set:{value,updatedAt:new Date()}})
    })
    revalidatePath('/', 'layout')
    return {success:true,message:'Settings saved. Storefront and checkout now use these values.'}
  } catch(e) {return {success:false,message:userFacingError(e,'Settings could not be saved. Your previous configuration is unchanged.')}}
}
