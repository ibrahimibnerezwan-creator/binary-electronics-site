import { requireAdmin } from '@/lib/auth'
import { getUsers } from '@/lib/data'
export async function GET(){
 try{await requireAdmin()}catch{return new Response('Unauthorized',{status:401})}
 const users=await getUsers()
 const cell=(s:string)=>'"'+s.replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"'
 const csv=['Name,Email,Phone,Joined',...users.map(u=>[u.name,u.email,u.phone,u.createdAt.toISOString()].map(cell).join(','))].join('\r\n')
 return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="binary-customers.csv"','Cache-Control':'no-store'}})
}
