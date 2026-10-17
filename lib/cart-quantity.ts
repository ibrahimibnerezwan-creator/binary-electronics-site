// Quantity a cart line should hold after "Buy now": at least what the shopper chose,
// never more than stock, and never added on top of what they already put in the cart.
// Returns 0 when the request cannot be honoured.
export function orderNowQuantity(inCart: number, requested: number, stock?: number) {
  if (!Number.isSafeInteger(requested) || requested < 1 || stock === 0) return 0
  return Math.min(999, stock ?? 999, Math.max(inCart, requested))
}
