"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { type Item } from "@/lib/db";
import { PriceDisplay } from "@/components/PriceDisplay";
import { WhatsAppCart } from "@/components/WhatsAppCart";
import { cartStore } from "@/lib/cartStore";

type Props = {
  categoryName: string;
  categoryIcon: string;
  initialItems: Item[];
};

type SortOption = "price-asc" | "price-desc" | "name-asc";

export function CategoryPageClient({ categoryName, categoryIcon, initialItems }: Props) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("price-asc");
  const [baseItems, setBaseItems] = useState<Item[]>(initialItems);
  const [items, setItems] = useState<Item[]>(initialItems);
  const [addedItemIds, setAddedItemIds] = useState<Record<number, boolean>>({});

  useEffect(() => {
    let result = [...baseItems];

    if (search.trim()) {
      const query = search.toLowerCase();
      result = result.filter((item) =>
        item.name.toLowerCase().includes(query)
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price || a.name.localeCompare(b.name));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price || a.name.localeCompare(b.name));
    } else if (sortBy === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    setItems(result);
  }, [search, sortBy, baseItems]);

  useEffect(() => {
    setBaseItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const bc = new BroadcastChannel("items-updates");
      bc.onmessage = (e) => {
        const { id, price } = e.data as { id: number; price: number };
        setBaseItems((prev) => prev.map((it) => (it.id === id ? { ...it, price } : it)));
      };
      return () => bc.close();
    } catch (err) {
      // ignore
    }
  }, []);

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

  return (
    <div className="min-h-screen pb-28 text-[color:var(--text)]">
      <header className="sticky top-0 z-30 border-b border-[color:var(--line)] bg-[rgba(245,241,232,0.82)] backdrop-blur-md shadow-[0_8px_30px_rgba(31,43,36,0.04)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[color:var(--line)] bg-white/80 shadow-[var(--shadow-soft)] transition active:scale-95 hover:bg-white"
              aria-label="Back to categories"
            >
              <svg
                className="h-5 w-5 text-[color:var(--text-soft)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <div className="flex items-center gap-2.5">
              <span className="text-3xl">{categoryIcon}</span>
              <div>
                <h1 className="text-xl font-black leading-tight text-[color:var(--text)]">
                  {categoryName}
                </h1>
                <p className="text-xs font-semibold text-[color:var(--text-soft)]">
                  {baseItems.length} items total
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="hidden items-center text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--primary-strong)] hover:underline sm:inline-flex"
          >
            Back to Categories
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 rounded-[30px] border border-[color:var(--line)] bg-white/75 p-4 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between">
          <div className="relative flex max-w-md flex-1 items-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-0.5">
            <span className="pl-3 text-sm text-[color:var(--muted)]">🔍</span>
            <input
              type="text"
              placeholder={`Search in ${categoryName}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent px-2 py-2.5 text-sm text-[color:var(--text)] outline-none placeholder:text-[color:var(--muted)]"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="mr-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white text-[color:var(--text-soft)] hover:bg-[color:var(--primary-soft)]"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--muted)]">
              Sort By
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setSortBy("price-asc")}
                className={`sort-pill ${
                  sortBy === "price-asc" ? "sort-pill-active" : "sort-pill-inactive"
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => setSortBy("price-desc")}
                className={`sort-pill ${
                  sortBy === "price-desc" ? "sort-pill-active" : "sort-pill-inactive"
                }`}
              >
                High to Low
              </button>
              <button
                onClick={() => setSortBy("name-asc")}
                className={`sort-pill ${
                  sortBy === "name-asc" ? "sort-pill-active" : "sort-pill-inactive"
                }`}
              >
                Name A-Z
              </button>
            </div>
          </div>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-[26px] border border-[color:var(--line)] bg-white/75 p-5 shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-strong)]"
              >
                <div>
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
                      <PriceDisplay price={item.price} />
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
            <span className="mb-2 block text-4xl">🌾</span>
            <p className="text-sm font-semibold text-[color:var(--text-soft)]">
              No items found matching &quot;{search}&quot;
            </p>
            <p className="mt-1 text-xs text-[color:var(--muted)]">Try typing a different name</p>
          </div>
        )}
      </main>

      <WhatsAppCart />
    </div>
  );
}
