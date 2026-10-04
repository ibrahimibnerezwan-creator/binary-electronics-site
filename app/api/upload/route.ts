import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { uploadToR2 } from '@/lib/r2'
export const dynamic='force-dynamic'
export const maxDuration=30
const extensions:Record<string,string>={'image/jpeg':'jpg','image/png':'png','image/webp':'webp','image/gif':'gif'}
function validImage(bytes:Buffer,type:string) {
  if(type==='image/jpeg')return bytes[0]===255&&bytes[1]===216&&bytes[2]===255
  if(type==='image/png')return bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]))
  if(type==='image/webp')return bytes.toString('ascii',0,4)==='RIFF'&&bytes.toString('ascii',8,12)==='WEBP'
  if(type==='image/gif')return ['GIF87a','GIF89a'].includes(bytes.toString('ascii',0,6))
  return false
}
export async function POST(req:Request) {
  try {await requireAdmin()}catch{return NextResponse.json({error:'Unauthorized'},{status:401})}
  try {
    const files=(await req.formData()).getAll('file')
    if(files.length!==1 || !(files[0] instanceof File))return NextResponse.json({error:'Upload one photo at a time.'},{status:400})
    const file=files[0]
    if(!extensions[file.type]||file.size<12||file.size>3*1024*1024)return NextResponse.json({error:'Choose a JPEG, PNG, WebP or GIF image under 3 MB.'},{status:400})
    const bytes=Buffer.from(await file.arrayBuffer())
    if(!validImage(bytes,file.type))return NextResponse.json({error:'The file is not a valid supported image.'},{status:400})
    const url=await uploadToR2(bytes,`products/${crypto.randomUUID()}.${extensions[file.type]}`,file.type)
    return NextResponse.json({success:true,files:[{url,name:file.name}]})
  }catch{return NextResponse.json({error:'Photo storage is unavailable. Please check the media settings or retry.'},{status:503})}
}
