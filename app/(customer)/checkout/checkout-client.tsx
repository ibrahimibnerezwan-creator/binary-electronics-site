"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'
import { placeOrder } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatPrice } from '@/lib/utils'
import { CreditCard, Truck, Receipt, ArrowRight, ArrowLeft, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

interface Settings {
    [key: string]: string
}

interface User {
    id: string
    name: string
}

export default function CheckoutClient({ settings, user }: { settings: Settings, user?: User | null }) {
    const { cart, cartTotal, clearCart } = useCart()
    const router = useRouter()

    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        customerName: user?.name || '',
        customerPhone: '',
        address: '',
        shippingCity: 'Dhaka',
        paymentMethod: 'bkash', // bkash, nagad, cod
        transactionId: '',
    })

    const sInside = parseFloat(settings.shipping_inside_dhaka || '60')
    const sOutside = parseFloat(settings.shipping_outside_dhaka || '120')
    const vatRate = parseFloat(settings.vat_percentage || '0') / 100

    const shippingCost = formData.shippingCity.toLowerCase() === 'dhaka' ? sInside : sOutside
    const tax = cartTotal * vatRate
    const finalTotal = cartTotal + shippingCost + tax

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setError(null)
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.customerName || !formData.customerPhone || !formData.address) {
                setError("Please fill out all shipping fields.")
                return
            }
        }
        if (step === 2) {
            if (formData.paymentMethod !== 'cod' && !formData.transactionId) {
                setError("Please provide the Transaction ID for your payment.")
                return
            }
        }
        setStep(prev => (prev + 1) as 1 | 2 | 3)
        setError(null)
    }

    const prevStep = () => {
        setStep(prev => (prev - 1) as 1 | 2 | 3)
        setError(null)
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        setError(null)

        const result = await placeOrder({
            ...formData,
            items: cart.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
            total: finalTotal
        })

        if (result.error) {
            setError(result.error)
            setIsLoading(false)
        } else {
            clearCart()
            router.push(`/order-confirmation/${result.orderId}`)
        }
    }

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 glass border border-primary-500/10 rounded-2xl">
                <ShoppingBag size={48} className="text-primary-500 mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2 uppercase">Your bag is empty</h2>
                <Button onClick={() => router.push('/products')} className="mt-8 h-14 px-10 rounded-2xl font-black uppercase tracking-widest">
                    Return to Shop
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
            {/* Main Checkout Area */}
            <div className="lg:col-span-2 space-y-8">
                
                {/* Step Indicators */}
                <div className="flex items-center justify-between bg-white/5 p-6 rounded-2xl border border-primary-500/10">
                    <div className={`flex flex-col items-center transition-colors ${step >= 1 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 1 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <Truck size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                    </div>
                    <div className={`h-1 flex-1 mx-6 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-gray-800'}`} />
                    <div className={`flex flex-col items-center transition-colors ${step >= 2 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 2 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <CreditCard size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Payment</span>
                    </div>
                    <div className={`h-1 flex-1 mx-6 rounded-full transition-colors ${step >= 3 ? 'bg-primary-500' : 'bg-gray-800'}`} />
                    <div className={`flex flex-col items-center transition-colors ${step >= 3 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 3 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <Receipt size={20} />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest">Review</span>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                {/* STEP 1: SHIPPING */}
                {step === 1 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label htmlFor="customerName" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Full Name</Label>
                                <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} className="h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30" placeholder="e.g. John Doe" />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="customerPhone" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Phone Number</Label>
                                <Input id="customerPhone" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleInputChange} className="h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30" placeholder="017xxxxxxxx" />
                            </div>
                            <div className="space-y-3 md:col-span-2">
                                <Label htmlFor="address" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Detailed Address</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30" placeholder="House, Road, Apartment, Area" />
                            </div>
                            <div className="space-y-3">
                                <Label htmlFor="shippingCity" className="text-[10px] font-bold uppercase tracking-widest text-text-muted">City / Region</Label>
                                <select 
                                    id="shippingCity" 
                                    name="shippingCity" 
                                    value={formData.shippingCity} 
                                    onChange={handleInputChange} 
                                    className="w-full h-14 px-6 bg-bg-void/40 border-primary-500/10 text-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-bold appearance-none cursor-pointer"
                                >
                                    <option value="Dhaka">Dhaka City (৳{sInside})</option>
                                    <option value="Outside Dhaka">Outside Dhaka (৳{sOutside})</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-12 flex justify-end">
                            <Button onClick={nextStep} className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest group shadow-2xl shadow-primary-500/20">
                                Continue to Payment <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PAYMENT */}
                {step === 2 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Payment Method</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {['bkash', 'nagad', 'cod'].map((method) => (
                                <label 
                                    key={method}
                                    className={`relative cursor-pointer border-2 rounded-2xl p-6 flex flex-col items-center gap-4 transition-all duration-300 overflow-hidden group ${formData.paymentMethod === method ? 'border-primary-500 bg-primary-500/5' : 'border-primary-500/5 bg-bg-void/40 hover:border-primary-500/20'}`}
                                >
                                    <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleInputChange} className="sr-only" />
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-xs transition-all duration-300 ${method === 'bkash' ? 'bg-[#e2136e] shadow-[0_0_15px_rgba(226,19,110,0.3)]' : method === 'nagad' ? 'bg-[#f37021] shadow-[0_0_15px_rgba(243,112,33,0.3)]' : 'bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'}`}>
                                        {method === 'cod' ? <Truck size={24} className="text-white" /> : method.toUpperCase()}
                                    </div>
                                    <span className="text-white font-black uppercase text-xs tracking-widest">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                                    {formData.paymentMethod === method && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 size={16} className="text-primary-500" />
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-bg-void/60 border border-primary-500/10 rounded-2xl p-8 mb-10">
                            {formData.paymentMethod === 'bkash' && (
                                <div className="space-y-5">
                                    <h3 className="text-[#e2136e] font-black uppercase text-sm tracking-widest flex items-center gap-3"><CheckCircle2 size={20} /> bkash Instructions</h3>
                                    <div className="flex flex-col gap-4 text-sm text-text-secondary leading-relaxed">
                                        <p>1. Open bKash app and select <strong className="text-white">Send Money</strong>.</p>
                                        <p>
                                            2. To: {settings.bkash_number ? (
                                                <strong className="text-white text-xl font-mono px-4 py-2 bg-white/5 rounded-xl border border-white/10 mt-2 block w-fit">{settings.bkash_number}</strong>
                                            ) : (
                                                <span className="text-red-500 font-bold block mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">⚠️ bKash payment is currently unavailable (Number not configured).</span>
                                            )}
                                        </p>
                                        <p>3. Amount: <strong className="text-white text-lg font-mono">{formatPrice(finalTotal)}</strong></p>
                                        <p>4. Enter your TrxID below to confirm.</p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/5">
                                        <Label htmlFor="transactionId" className={`text-[10px] font-bold uppercase tracking-widest ${settings.bkash_number ? 'text-[#e2136e]' : 'text-gray-600'}`}>bKash TrxID</Label>
                                        <Input id="transactionId" name="transactionId" placeholder={settings.bkash_number ? "e.g. 9J2A4HRXZ" : "PAYMENT UNAVAILABLE"} disabled={!settings.bkash_number} value={formData.transactionId} onChange={handleInputChange} className="h-14 mt-2 bg-bg-void border-[#e2136e]/30 text-white focus:ring-[#e2136e]/50 font-mono uppercase tracking-[0.2em] disabled:opacity-50" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'nagad' && (
                                <div className="space-y-5">
                                    <h3 className="text-[#f37021] font-black uppercase text-sm tracking-widest flex items-center gap-3"><CheckCircle2 size={20} /> Nagad Instructions</h3>
                                    <div className="flex flex-col gap-4 text-sm text-text-secondary leading-relaxed">
                                        <p>1. Open Nagad app and select <strong className="text-white">Send Money</strong>.</p>
                                        <p>
                                            2. To: {settings.nagad_number ? (
                                                <strong className="text-white text-xl font-mono px-4 py-2 bg-white/5 rounded-xl border border-white/10 mt-2 block w-fit">{settings.nagad_number}</strong>
                                            ) : (
                                                <span className="text-red-500 font-bold block mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">⚠️ Nagad payment is currently unavailable (Number not configured).</span>
                                            )}
                                        </p>
                                        <p>3. Amount: <strong className="text-white text-lg font-mono">{formatPrice(finalTotal)}</strong></p>
                                        <p>4. Enter your TrxID below to confirm.</p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/5">
                                        <Label htmlFor="transactionId" className={`text-[10px] font-bold uppercase tracking-widest ${settings.nagad_number ? 'text-[#f37021]' : 'text-gray-600'}`}>Nagad TrxID</Label>
                                        <Input id="transactionId" name="transactionId" placeholder={settings.nagad_number ? "e.g. ABC123XYZ" : "PAYMENT UNAVAILABLE"} disabled={!settings.nagad_number} value={formData.transactionId} onChange={handleInputChange} className="h-14 mt-2 bg-bg-void border-[#f37021]/30 text-white focus:ring-[#f37021]/50 font-mono uppercase tracking-[0.2em] disabled:opacity-50" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'cod' && (
                                <div className="text-center py-10 space-y-4">
                                    <div className="w-20 h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-6">
                                        <Truck size={40} />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase tracking-tight">CASH ON DELIVERY</h3>
                                    <p className="text-text-secondary text-sm max-w-sm mx-auto leading-relaxed">
                                        Pay <strong className="text-primary-500">{formatPrice(finalTotal)}</strong> at your doorstep. We use <strong className="text-white">Steadfast Courier</strong> for secure nationwide delivery.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-12 flex justify-between">
                            <Button variant="outline" onClick={prevStep} className="h-16 px-8 rounded-2xl border-primary-500/10 hover:bg-white/5 font-bold uppercase tracking-widest gap-3">
                                <ArrowLeft size={18} /> Back
                            </Button>
                            <Button onClick={nextStep} className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest group shadow-2xl shadow-primary-500/20">
                                Review Order <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white mb-8 uppercase tracking-tight">Final Verification</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="p-6 bg-bg-void/40 rounded-2xl border border-primary-500/10">
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-4">Shipping To</h3>
                                <p className="text-white font-black text-lg mb-1">{formData.customerName}</p>
                                <p className="text-text-secondary font-bold mb-2">{formData.customerPhone}</p>
                                <p className="text-text-muted text-sm leading-relaxed">{formData.address}, {formData.shippingCity}</p>
                            </div>
                            <div className="p-6 bg-bg-void/40 rounded-2xl border border-primary-500/10">
                                <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-4">Payment Info</h3>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${formData.paymentMethod === 'bkash' ? 'bg-[#e2136e]/10 text-[#e2136e]' : formData.paymentMethod === 'nagad' ? 'bg-[#f37021]/10 text-[#f37021]' : 'bg-primary-500/10 text-primary-500'}`}>
                                        {formData.paymentMethod}
                                    </div>
                                </div>
                                {formData.transactionId && (
                                    <div className="pt-4 border-t border-white/5">
                                        <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Transaction ID</span>
                                        <span className="font-mono text-white tracking-[0.1em]">{formData.transactionId.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-12 flex justify-between gap-6">
                            <Button variant="outline" onClick={prevStep} disabled={isLoading} className="h-16 px-8 rounded-2xl border-primary-500/10 hover:bg-white/5 font-bold uppercase tracking-widest gap-3">
                                <ArrowLeft size={18} /> Back
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading} className="h-16 flex-grow rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary-500/20">
                                {isLoading ? <><Loader2 size={24} className="mr-3 animate-spin" /> Finalizing...</> : "Confirm Placement"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Summary Sidebar */}
            <div className="flex flex-col gap-8 h-fit lg:sticky lg:top-32">
                <div className="glass border border-primary-500/10 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 border-b border-primary-500/10 pb-6">Summary</h3>
                    
                    <div className="space-y-6 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="relative w-16 h-16 glass border border-primary-500/5 rounded-xl p-2 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{item.quantity}</span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-white text-xs font-bold truncate uppercase tracking-tight">{item.name}</p>
                                    <p className="text-primary-500 font-bold text-sm mt-1">{formatPrice(item.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-4 pt-6 border-t border-primary-500/10">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Subtotal</span>
                            <span className="text-sm font-bold text-white">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Shipping</span>
                            <span className="text-xs font-bold text-primary-500">+{formatPrice(shippingCost)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">VAT (5%)</span>
                            <span className="text-xs font-bold text-text-secondary">+{formatPrice(tax)}</span>
                        </div>
                        <div className="pt-6 border-t border-primary-500/10 mt-2 flex justify-between items-center">
                            <span className="font-black uppercase tracking-widest text-white">Total</span>
                            <span className="text-2xl font-black text-primary-500 tracking-tight">{formatPrice(finalTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4 p-5 rounded-2xl glass border border-primary-500/5">
                        <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-inner">
                            <ShieldCheck size={24} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-white uppercase tracking-tight">Premium Support</span>
                            <span className="text-[10px] text-text-muted uppercase tracking-widest mt-0.5">24/7 Tech Assistance</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ShoppingBag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
      <path d="M3 6h18" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
