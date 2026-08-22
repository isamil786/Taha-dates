"use client";

import { useState, useEffect } from "react";
import { type Category, type Item } from "@/lib/db";
import { CategoryCard } from "@/components/CategoryCard";
import { WhatsAppCart } from "@/components/WhatsAppCart";
import { cartStore } from "@/lib/cartStore";
import { formatPrice } from "@/lib/format";

type Props = {
  initialCategories: Category[];
  initialItems: Item[];
};

export function HomePageClient({ initialCategories, initialItems }: Props) {
  const [search, setSearch] = useState("");
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!search.trim()) {
      setFilteredItems([]);
      return;
    }

    const query = search.toLowerCase();
    const matches = initialItems.filter(
      (item) =>
        item.price > 0 &&
        (item.name.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query))
    );
    matches.sort((a, b) => a.price - b.price);
    setFilteredItems(matches);
  }, [search, initialItems]);

  const handleAddToOrder = (item: Item) => {
    cartStore.addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      uom: item.uom,
      category: item.category,
    });
    
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 1000);
  };

  const totalItems = initialItems.filter(i => i.price > 0).length;

  return (
    <div className="min-h-screen pb-24 text-[color:var(--text)]">
      <header className="relative overflow-hidden border-b border-[color:var(--line)] px-6 py-12 md:py-20 shadow-[0_12px_28px_rgba(31,43,36,0.04)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(140,166,127,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(201,140,96,0.14),transparent_30%)]" />
        <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(95,108,99,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(95,108,99,0.05)_1px,transparent_1px)] [background-size:28px_28px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-3xl shadow-[var(--shadow-soft)] ring-1 ring-white/80">
                🌴
              </div>
              <div>
                <h1 className="text-3xl font-black tracking-[-0.05em] text-[color:var(--text)] md:text-5xl">
                  Taha Dates & Nuts
                </h1>
                <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-[color:var(--primary-strong)]">
                  Premium Taste, Thoughtfully Curated
                </p>
              </div>
            </div>
            <p className="max-w-xl text-sm leading-relaxed text-[color:var(--text-soft)] md:text-base">
              Discover a refined selection of premium dates, wholesome nuts, artisanal sweets, and signature pantry essentials designed for everyday luxury.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-white/75 px-4 py-2 text-xs font-semibold text-[color:var(--text)] shadow-[var(--shadow-soft)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--primary)] animate-pulse" />
              <span>{totalItems} Premium Products</span>
            </div>
            <a
              href="https://instagram.com/tahadatesandnuts"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-[color:var(--line)] bg-[color:var(--accent-soft)] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--accent)] transition-colors hover:bg-white"
            >
              Instagram
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-20 mx-auto -mt-7 max-w-3xl px-4">
        <div className="glass-panel relative flex items-center rounded-[26px] p-1.5">
          <span className="pl-3 text-lg text-[color:var(--muted)]">🔍</span>
          <input
            type="text"
            placeholder="Search premium dates, nuts, chocolates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent px-2 py-3 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)] md:text-base"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="mr-1 flex h-8 w-8 items-center justify-center rounded-xl bg-[color:var(--primary-soft)] text-[color:var(--text-soft)] hover:bg-[color:var(--primary)] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {search ? (
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-[color:var(--line)] pb-3">
              <h2 className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
                Search Results ({filteredItems.length})
              </h2>
              <button
                onClick={() => setSearch("")}
                className="text-xs font-bold text-[color:var(--primary-strong)] hover:underline"
              >
                Clear Search
              </button>
            </div>

            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-[26px] border border-[color:var(--line)] bg-white/75 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
                  >
                    <div>
                      <div className="mb-2">
                        <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--primary-soft)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--primary-strong)]">
                          {item.category}
                        </span>
                      </div>
                      <h4 className="text-base font-bold leading-snug text-[color:var(--text)]">
                        {item.name}
                      </h4>
                      {item.uom && (
                        <p className="mt-1 text-xs text-[color:var(--text-soft)]">
                          per {item.uom}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--muted)]">
                          Price
                        </p>
                        <p className="text-lg font-extrabold text-[color:var(--accent)]">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleAddToOrder(item)}
                        className={`flex h-10 items-center justify-center rounded-xl px-4 text-xs font-bold text-white transition-all active:scale-95 ${
                          addedItemIds[item.id]
                            ? "bg-emerald-600 shadow-emerald-600/10"
                            : "bg-[color:var(--primary)] hover:bg-[color:var(--primary-strong)] shadow-[color:var(--primary)]/10"
                        }`}
                      >
                        {addedItemIds[item.id] ? "✓ Added" : "+ Add to Order"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mx-auto max-w-lg rounded-[30px] border border-dashed border-[color:var(--line)] bg-white/60 py-16 text-center shadow-[var(--shadow-soft)]">
                <span className="mb-2 block text-4xl">📦</span>
                <p className="text-sm font-semibold text-[color:var(--text-soft)]">
                  No items found matching &quot;{search}&quot;
                </p>
                <p className="mt-1 text-xs text-[color:var(--muted)]">
                  Try another keyword like &quot;Saffron&quot; or &quot;Dates&quot;
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--text-soft)]">
              Browse Categories
            </h2>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {initialCategories.map((category, index) => (
                <CategoryCard
                  key={category.slug}
                  category={category}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <WhatsAppCart />
    </div>
  );
}
