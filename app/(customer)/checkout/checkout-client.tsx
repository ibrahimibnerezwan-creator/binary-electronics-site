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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-4 md:mt-8">
            {/* Main Checkout Area */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
                
                {/* Step Indicators */}
                <div className="flex items-center justify-between bg-white/5 p-4 md:p-6 rounded-2xl border border-primary-500/10">
                    <div className={`flex flex-col items-center transition-colors ${step >= 1 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 1 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <Truck className="w-[18px] h-[18px] md:w-5 md:h-5" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                    </div>
                    <div className={`h-0.5 md:h-1 flex-1 mx-2 md:mx-6 rounded-full transition-colors ${step >= 2 ? 'bg-primary-500' : 'bg-gray-800'}`} />
                    <div className={`flex flex-col items-center transition-colors ${step >= 2 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 2 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <CreditCard className="w-[18px] h-[18px] md:w-5 md:h-5" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Payment</span>
                    </div>
                    <div className={`h-0.5 md:h-1 flex-1 mx-2 md:mx-6 rounded-full transition-colors ${step >= 3 ? 'bg-primary-500' : 'bg-gray-800'}`} />
                    <div className={`flex flex-col items-center transition-colors ${step >= 3 ? 'text-primary-500' : 'text-text-muted'}`}>
                        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center border-2 mb-2 transition-all ${step >= 3 ? 'border-primary-500 bg-primary-500/10 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]' : 'border-gray-700'}`}>
                            <Receipt className="w-[18px] h-[18px] md:w-5 md:h-5" />
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Review</span>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs md:text-sm font-bold animate-shake">
                        {error}
                    </div>
                )}

                {/* STEP 1: SHIPPING */}
                {step === 1 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tight">Shipping Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                            <div className="space-y-2 md:space-y-3">
                                <Label htmlFor="customerName" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted">Full Name</Label>
                                <Input id="customerName" name="customerName" value={formData.customerName} onChange={handleInputChange} className="h-12 md:h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30 text-sm" placeholder="e.g. John Doe" />
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <Label htmlFor="customerPhone" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted">Phone Number</Label>
                                <Input id="customerPhone" name="customerPhone" type="tel" value={formData.customerPhone} onChange={handleInputChange} className="h-12 md:h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30 text-sm" placeholder="017xxxxxxxx" />
                            </div>
                            <div className="space-y-2 md:space-y-3 md:col-span-2">
                                <Label htmlFor="address" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted">Detailed Address</Label>
                                <Input id="address" name="address" value={formData.address} onChange={handleInputChange} className="h-12 md:h-14 bg-bg-void/40 border-primary-500/10 text-white focus:ring-primary-500/30 text-sm" placeholder="House, Road, Apartment, Area" />
                            </div>
                            <div className="space-y-2 md:space-y-3">
                                <Label htmlFor="shippingCity" className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-text-muted">City / Region</Label>
                                <select 
                                    id="shippingCity" 
                                    name="shippingCity" 
                                    value={formData.shippingCity} 
                                    onChange={handleInputChange} 
                                    className="w-full h-12 md:h-14 px-4 md:px-6 bg-bg-void/40 border-primary-500/10 text-white border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/30 transition-all font-bold appearance-none cursor-pointer text-sm"
                                >
                                    <option value="Dhaka">Dhaka City (৳{sInside})</option>
                                    <option value="Outside Dhaka">Outside Dhaka (৳{sOutside})</option>
                                </select>
                            </div>
                        </div>
                        <div className="mt-8 md:mt-12 flex justify-end">
                            <Button onClick={nextStep} className="h-14 md:h-16 px-8 md:px-10 rounded-2xl font-black uppercase tracking-widest group shadow-2xl shadow-primary-500/20 text-sm md:text-base">
                                Continue to Payment <ArrowRight className="w-5 h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 2: PAYMENT */}
                {step === 2 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tight">Payment Method</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-10">
                            {['bkash', 'nagad', 'cod'].map((method) => (
                                <label 
                                    key={method}
                                    className={`relative cursor-pointer border-2 rounded-2xl p-4 md:p-6 flex flex-row md:flex-col items-center gap-4 transition-all duration-300 overflow-hidden group ${formData.paymentMethod === method ? 'border-primary-500 bg-primary-500/5' : 'border-primary-500/5 bg-bg-void/40 hover:border-primary-500/20'}`}
                                >
                                    <input type="radio" name="paymentMethod" value={method} checked={formData.paymentMethod === method} onChange={handleInputChange} className="sr-only" />
                                    <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl flex items-center justify-center font-black text-[10px] md:text-xs transition-all duration-300 shrink-0 ${method === 'bkash' ? 'bg-[#e2136e] shadow-[0_0_15px_rgba(226,19,110,0.3)]' : method === 'nagad' ? 'bg-[#f37021] shadow-[0_0_15px_rgba(243,112,33,0.3)]' : 'bg-primary-500 shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]'}`}>
                                        {method === 'cod' ? <Truck className="w-5 h-5 md:w-6 md:h-6 text-white" /> : method.toUpperCase()}
                                    </div>
                                    <span className="text-white font-black uppercase text-[10px] md:text-xs tracking-widest">{method === 'cod' ? 'Cash on Delivery' : method}</span>
                                    {formData.paymentMethod === method && (
                                        <div className="absolute top-2 right-2">
                                            <CheckCircle2 size={16} className="text-primary-500" />
                                        </div>
                                    )}
                                </label>
                            ))}
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-bg-void/60 border border-primary-500/10 rounded-2xl p-5 md:p-8 mb-8 md:mb-10">
                            {formData.paymentMethod === 'bkash' && (
                                <div className="space-y-4 md:space-y-5">
                                    <h3 className="text-[#e2136e] font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-2 md:gap-3"><CheckCircle2 className="w-[18px] h-[18px] md:w-5 md:h-5" /> bkash Instructions</h3>
                                    <div className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-text-secondary leading-relaxed">
                                        <p>1. Open bKash app and select <strong className="text-white">Send Money</strong>.</p>
                                        <div className="flex flex-col">
                                            <span>2. To:</span>
                                            {settings.bkash_number ? (
                                                <strong className="text-white text-base md:text-xl font-mono px-4 py-2 bg-white/5 rounded-xl border border-white/10 mt-2 block w-fit">{settings.bkash_number}</strong>
                                            ) : (
                                                <span className="text-red-500 font-bold block mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] md:text-xs">⚠️ bKash payment is currently unavailable (Number not configured).</span>
                                            )}
                                        </div>
                                        <p>3. Amount: <strong className="text-white text-base md:text-lg font-mono">{formatPrice(finalTotal)}</strong></p>
                                        <p>4. Enter your TrxID below to confirm.</p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/5">
                                        <Label htmlFor="transactionId" className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${settings.bkash_number ? 'text-[#e2136e]' : 'text-gray-600'}`}>bKash TrxID</Label>
                                        <Input id="transactionId" name="transactionId" placeholder={settings.bkash_number ? "e.g. 9J2A4HRXZ" : "PAYMENT UNAVAILABLE"} disabled={!settings.bkash_number} value={formData.transactionId} onChange={handleInputChange} className="h-12 md:h-14 mt-2 bg-bg-void border-[#e2136e]/30 text-white focus:ring-[#e2136e]/50 font-mono uppercase tracking-[0.2em] disabled:opacity-50 text-sm" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'nagad' && (
                                <div className="space-y-4 md:space-y-5">
                                    <h3 className="text-[#f37021] font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-2 md:gap-3"><CheckCircle2 className="w-[18px] h-[18px] md:w-5 md:h-5" /> Nagad Instructions</h3>
                                    <div className="flex flex-col gap-3 md:gap-4 text-xs md:text-sm text-text-secondary leading-relaxed">
                                        <p>1. Open Nagad app and select <strong className="text-white">Send Money</strong>.</p>
                                        <div className="flex flex-col">
                                            <span>2. To:</span>
                                            {settings.nagad_number ? (
                                                <strong className="text-white text-base md:text-xl font-mono px-4 py-2 bg-white/5 rounded-xl border border-white/10 mt-2 block w-fit">{settings.nagad_number}</strong>
                                            ) : (
                                                <span className="text-red-500 font-bold block mt-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] md:text-xs">⚠️ Nagad payment is currently unavailable (Number not configured).</span>
                                            )}
                                        </div>
                                        <p>3. Amount: <strong className="text-white text-base md:text-lg font-mono">{formatPrice(finalTotal)}</strong></p>
                                        <p>4. Enter your TrxID below to confirm.</p>
                                    </div>
                                    
                                    <div className="pt-4 border-t border-white/5">
                                        <Label htmlFor="transactionId" className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest ${settings.nagad_number ? 'text-[#f37021]' : 'text-gray-600'}`}>Nagad TrxID</Label>
                                        <Input id="transactionId" name="transactionId" placeholder={settings.nagad_number ? "e.g. ABC123XYZ" : "PAYMENT UNAVAILABLE"} disabled={!settings.nagad_number} value={formData.transactionId} onChange={handleInputChange} className="h-12 md:h-14 mt-2 bg-bg-void border-[#f37021]/30 text-white focus:ring-[#f37021]/50 font-mono uppercase tracking-[0.2em] disabled:opacity-50 text-sm" />
                                    </div>
                                </div>
                            )}

                            {formData.paymentMethod === 'cod' && (
                                <div className="text-center py-6 md:py-10 space-y-3 md:space-y-4">
                                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary-500/10 flex items-center justify-center text-primary-500 mx-auto mb-4 md:mb-6">
                                        <Truck className="w-8 h-8 md:w-10 md:h-10" />
                                    </div>
                                    <h3 className="text-lg md:text-xl font-black text-white uppercase tracking-tight">CASH ON DELIVERY</h3>
                                    <p className="text-text-secondary text-xs md:text-sm max-w-sm mx-auto leading-relaxed">
                                        Pay <strong className="text-primary-500">{formatPrice(finalTotal)}</strong> at your doorstep. We use <strong className="text-white">Steadfast Courier</strong> for secure nationwide delivery.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-8 md:mt-12 flex flex-row justify-between gap-4">
                            <Button variant="outline" onClick={prevStep} className="h-14 md:h-16 px-5 md:px-8 rounded-2xl border-primary-500/10 hover:bg-white/5 font-bold uppercase tracking-widest gap-2 md:gap-3 text-xs md:text-sm shrink-0">
                                <ArrowLeft className="w-4 h-4 md:w-[18px] md:h-[18px]" /> Back
                            </Button>
                            <Button onClick={nextStep} className="h-14 md:h-16 flex-1 md:flex-none md:px-10 rounded-2xl font-black uppercase tracking-widest group shadow-2xl shadow-primary-500/20 text-xs md:text-sm">
                                Review Order <ArrowRight className="w-[18px] h-[18px] md:w-5 md:h-5 ml-2 md:ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* STEP 3: REVIEW */}
                {step === 3 && (
                    <div className="glass border border-primary-500/5 rounded-2xl p-5 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-lg md:text-xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tight">Final Verification</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-10">
                            <div className="p-4 md:p-6 bg-bg-void/40 rounded-2xl border border-primary-500/10">
                                <h3 className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-3 md:mb-4">Shipping To</h3>
                                <p className="text-white font-black text-base md:text-lg mb-1">{formData.customerName}</p>
                                <p className="text-text-secondary font-bold mb-2 text-sm">{formData.customerPhone}</p>
                                <p className="text-text-muted text-xs leading-relaxed">{formData.address}, {formData.shippingCity}</p>
                            </div>
                            <div className="p-4 md:p-6 bg-bg-void/40 rounded-2xl border border-primary-500/10">
                                <h3 className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] mb-3 md:mb-4">Payment Info</h3>
                                <div className="flex items-center gap-4 mb-3 md:mb-4">
                                    <div className={`px-3 md:px-4 py-1.5 md:py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest ${formData.paymentMethod === 'bkash' ? 'bg-[#e2136e]/10 text-[#e2136e]' : formData.paymentMethod === 'nagad' ? 'bg-[#f37021]/10 text-[#f37021]' : 'bg-primary-500/10 text-primary-500'}`}>
                                        {formData.paymentMethod}
                                    </div>
                                </div>
                                {formData.transactionId && (
                                    <div className="pt-3 md:pt-4 border-t border-white/5">
                                        <span className="text-[9px] md:text-[10px] font-bold text-text-muted uppercase tracking-widest block mb-1">Transaction ID</span>
                                        <span className="font-mono text-white tracking-[0.1em] text-xs md:text-sm">{formData.transactionId.toUpperCase()}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="mt-8 md:mt-12 flex flex-row justify-between gap-4">
                            <Button variant="outline" onClick={prevStep} disabled={isLoading} className="h-14 md:h-16 px-5 md:px-8 rounded-2xl border-primary-500/10 hover:bg-white/5 font-bold uppercase tracking-widest gap-2 md:gap-3 text-xs md:text-sm shrink-0">
                                <ArrowLeft className="w-4 h-4 md:w-[18px] md:h-[18px]" /> Back
                            </Button>
                            <Button onClick={handleSubmit} disabled={isLoading} className="h-14 md:h-16 flex-grow rounded-2xl font-black uppercase tracking-[0.1em] md:tracking-[0.2em] shadow-2xl shadow-primary-500/20 text-sm md:text-base">
                                {isLoading ? <><Loader2 className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 animate-spin" /> Finalizing...</> : "Confirm Placement"}
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Summary Sidebar */}
            <div className="flex flex-col gap-6 md:gap-8 h-fit lg:sticky lg:top-32">
                <div className="glass border border-primary-500/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                    <h3 className="text-xs md:text-sm font-black text-white uppercase tracking-[0.2em] mb-6 md:mb-8 border-b border-primary-500/10 pb-4 md:pb-6">Summary</h3>
                    
                    <div className="space-y-4 md:space-y-6 mb-8 md:mb-10 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 md:pr-4 custom-scrollbar">
                        {cart.map(item => (
                            <div key={item.id} className="flex gap-3 md:gap-4">
                                <div className="relative w-12 h-12 md:w-16 md:h-16 glass border border-primary-500/5 rounded-lg md:rounded-xl p-1.5 md:p-2 shrink-0">
                                    <Image src={item.image} alt={item.name} fill className="object-contain" />
                                    <span className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 w-5 h-5 md:w-6 md:h-6 bg-primary-500 text-white text-[8px] md:text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">{item.quantity}</span>
                                </div>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <p className="text-white text-[10px] md:text-xs font-bold truncate uppercase tracking-tight">{item.name}</p>
                                    <p className="text-primary-500 font-bold text-xs md:text-sm mt-0.5 md:mt-1">{formatPrice(item.price)}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-3 md:space-y-4 pt-4 md:pt-6 border-t border-primary-500/10 text-xs md:text-sm">
                        <div className="flex justify-between items-center text-text-muted">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                            <span className="font-bold text-white">{formatPrice(cartTotal)}</span>
                        </div>
                        <div className="flex justify-between items-center text-text-muted">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                            <span className="font-bold text-primary-500">+{formatPrice(shippingCost)}</span>
                        </div>
                        <div className="flex justify-between items-center text-text-muted">
                            <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest">VAT ({settings.vat_percentage || '0'}%)</span>
                            <span className="font-bold text-text-secondary">+{formatPrice(tax)}</span>
                        </div>
                        <div className="pt-4 md:pt-6 border-t border-primary-500/10 mt-2 flex justify-between items-center">
                            <span className="font-black uppercase tracking-widest text-white text-xs md:text-sm">Total</span>
                            <span className="text-xl md:text-2xl font-black text-primary-500 tracking-tight">{formatPrice(finalTotal)}</span>
                        </div>
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="flex flex-col gap-4 mb-4 md:mb-0">
                    <div className="flex items-center gap-4 p-4 md:p-5 rounded-2xl glass border border-primary-500/5">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary-500/10 flex items-center justify-center text-primary-500 shadow-inner">
                            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-white uppercase tracking-tight">Premium Support</span>
                            <span className="text-[8px] md:text-[10px] text-text-muted uppercase tracking-widest mt-0.5">24/7 Tech Assistance</span>
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
