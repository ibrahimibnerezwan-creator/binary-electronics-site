import { getAllProducts } from '@/lib/data'
import { Wishlist } from './wishlist'
export const dynamic='force-dynamic'
export const metadata={title:'Saved products',robots:{index:false}}
export default async function WishlistPage(){return <Wishlist products={await getAllProducts()}/>}
