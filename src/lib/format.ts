export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);
}
