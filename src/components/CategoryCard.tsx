import Link from "next/link";
import type { Category } from "@/lib/db";
import { formatPrice } from "@/lib/format";

type Props = {
  category: Category;
  index: number;
};

export function CategoryCard({ category, index }: Props) {
  return (
    <Link
      href={`/category/${category.slug}`}
      className="group relative overflow-hidden rounded-[28px] border border-[color:var(--line)] bg-white/75 p-[1px] shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[var(--shadow-strong)] active:scale-[0.99] flex flex-col justify-between"
    >
      <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(250,246,239,0.9)_100%)]">
        <div className={`h-1.5 w-full bg-gradient-to-r ${category.accent} opacity-90`} />

        <div className="flex flex-col flex-1 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--primary-soft)] text-2xl shadow-inner ring-1 ring-white/80">
              {category.icon}
            </div>
            <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[color:var(--muted)]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-bold text-[color:var(--text)] transition-colors group-hover:text-[color:var(--primary-strong)]">
              {category.name}
            </h3>
            <p className="mt-1 text-xs font-medium text-[color:var(--text-soft)]">
              {category.item_count} items available
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[color:var(--line)] pt-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                Range
              </p>
              <p className="text-xs font-bold text-[color:var(--accent)]">
                {formatPrice(category.min_price)} – {formatPrice(category.max_price)}
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-[color:var(--primary-strong)] ring-1 ring-[color:var(--line)] transition-all group-hover:bg-[color:var(--primary)] group-hover:text-white">
              <svg
                className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
