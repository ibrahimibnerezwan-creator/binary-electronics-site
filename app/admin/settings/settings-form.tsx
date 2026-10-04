'use client'
import { useActionState } from 'react'
import { updateSettings } from './actions'
export function SettingsForm({children}:{children:React.ReactNode}) {
  const [state,action,pending]=useActionState(updateSettings,{success:false,message:''})
  return <form action={action} className="flex flex-col gap-8">
    {state.message&&<p role={state.success?'status':'alert'} className={state.success?'text-primary-500':'text-red-400'}>{state.message}</p>}
    <fieldset disabled={pending} className="contents">{children}</fieldset>
    {pending&&<p role="status">Saving settings…</p>}
  </form>
}
