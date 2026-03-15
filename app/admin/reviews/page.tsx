import { getAllReviews } from '@/lib/data'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, MessageSquare, Clock, User, Package, Reply } from 'lucide-react'
import { ReviewActionButtons } from './review-actions'
import { format } from 'date-fns'

export default async function AdminReviewsPage() {
    const reviews = await getAllReviews()

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-display font-black uppercase tracking-tight">REVIEWS</h1>
                <p className="text-text-secondary text-lg">Moderate customer feedback and respond to inquiries.</p>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="p-6 bg-primary-500/5 border-primary-500/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl glass text-primary-500"><MessageSquare size={24}/></div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Total Reviews</p>
                        <p className="text-2xl font-black text-white">{reviews.length}</p>
                    </div>
                </Card>
                <Card className="p-6 bg-orange-500/5 border-orange-500/10 flex items-center gap-4">
                    <div className="p-3 rounded-xl glass text-orange-500"><Clock size={24}/></div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Pending Moderation</p>
                        <p className="text-2xl font-black text-white">{reviews.filter(r => r.status === 'pending').length}</p>
                    </div>
                </Card>
            </div>

            {/* Reviews List */}
            <div className="flex flex-col gap-6">
                {reviews.length === 0 ? (
                    <Card className="p-20 text-center border-dashed border-primary-500/20 bg-transparent">
                        <div className="flex flex-col items-center gap-4 opacity-30">
                            <Star size={64} className="text-primary-500" />
                            <p className="font-display font-black uppercase tracking-widest text-sm text-text-muted">No reviews recorded yet</p>
                        </div>
                    </Card>
                ) : (
                    reviews.map((review) => (
                        <Card key={review.id} className="p-8 border-primary-500/10 bg-bg-elevated/30 relative overflow-hidden group">
                           <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 rounded-full blur-[40px] -mr-16 -mt-16 group-hover:bg-primary-500/10 transition-colors" />

                           <div className="flex flex-col lg:flex-row gap-8 relative">
                               {/* Left: Review Info */}
                               <div className="flex-grow flex flex-col gap-4">
                                   <div className="flex items-center justify-between">
                                       <div className="flex items-center gap-4">
                                           <div className="w-12 h-12 rounded-full glass border border-primary-500/10 flex items-center justify-center text-primary-500">
                                               <User size={20} />
                                           </div>
                                           <div className="flex flex-col">
                                               <span className="font-black text-lg tracking-tight">{review.reviewerName}</span>
                                               <div className="flex items-center gap-2 text-[10px] text-text-muted uppercase tracking-widest font-bold">
                                                  <Clock size={12} />
                                                  {format(review.createdAt, 'MMM dd, yyyy')}
                                               </div>
                                           </div>
                                       </div>
                                       <div className="flex gap-1">
                                           {[...Array(5)].map((_, i) => (
                                               <Star 
                                                   key={i} 
                                                   size={16} 
                                                   className={i < review.rating ? "fill-gold-500 text-gold-500" : "text-text-muted opacity-20"} 
                                               />
                                           ))}
                                       </div>
                                   </div>

                                   <div className="p-6 rounded-2xl bg-bg-void/40 border border-primary-500/5">
                                       <p className="text-text-secondary leading-relaxed italic italic font-serif text-lg">
                                           "{review.comment}"
                                       </p>
                                   </div>

                                   <div className="flex items-center gap-3 text-primary-500/60 font-bold text-[10px] uppercase tracking-widest">
                                       <Package size={14} />
                                       Purchased: <span className="text-white">{review.productName}</span>
                                   </div>
                               </div>

                               {/* Right: Actions */}
                               <div className="lg:w-72 flex flex-col gap-4 justify-between border-l border-primary-500/10 pl-0 lg:pl-8">
                                   <div className="flex flex-col gap-2">
                                       <label className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</label>
                                       {review.status === 'pending' && <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20 w-fit">Pending</Badge>}
                                       {review.status === 'approved' && <Badge className="bg-green-500/10 text-green-500 border-green-500/20 w-fit">Approved</Badge>}
                                       {review.status === 'rejected' && <Badge className="bg-red-500/10 text-red-500 border-red-500/20 w-fit">Rejected</Badge>}
                                   </div>

                                   <ReviewActionButtons reviewId={review.id} status={review.status} />

                                   {review.adminReply && (
                                       <div className="mt-4 p-4 rounded-xl bg-primary-500/5 border border-primary-500/10 flex flex-col gap-2">
                                           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary-500">
                                               <Reply size={12} /> Admin Reply
                                           </div>
                                           <p className="text-xs text-text-muted leading-relaxed">
                                               {review.adminReply}
                                           </p>
                                       </div>
                                   )}
                               </div>
                           </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
