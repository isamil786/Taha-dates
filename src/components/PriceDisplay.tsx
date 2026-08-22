type Props = {
  price: number;
  uom?: string;
};

export function PriceDisplay({ price, uom }: Props) {
  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: price % 1 === 0 ? 0 : 2,
  }).format(price);

  return (
    <span className="whitespace-nowrap font-extrabold text-lg text-[#C48B47]">
      {formatted}
    </span>
  );
}
