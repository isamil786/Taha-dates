"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { PriceDisplay } from "@/components/PriceDisplay";

type Item = {
  id: number;
  name: string;
  category: string;
  uom: string;
  price: number;
  mrp: number;
};

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const checkAuth = useCallback(async () => {
    const res = await fetch("/api/auth");
    const data = await res.json();
    setAuthenticated(data.authenticated);
  }, []);

  const loadItems = useCallback(async () => {
    const res = await fetch("/api/admin/items");
    if (res.ok) {
      const data = await res.json();
      setItems(data.items);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (authenticated) {
      loadItems();
    }
  }, [authenticated, loadItems]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthenticated(true);
      setPassword("");
    } else {
      setLoginError("Invalid password");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth", { method: "DELETE" });
    setAuthenticated(false);
    setItems([]);
  }

  async function savePrice(id: number) {
    const price = parseFloat(editPrice);
    if (isNaN(price) || price < 0) return;

    setSaving(true);
    const res = await fetch("/api/admin/items", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, price }),
    });

    if (res.ok) {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, price } : item))
      );
      setMessage("Price updated!");
      setTimeout(() => setMessage(""), 2000);
      try {
        if (typeof window !== "undefined" && "BroadcastChannel" in window) {
          const bc = new BroadcastChannel("items-updates");
          bc.postMessage({ id, price });
          bc.close();
        }
      } catch (err) {
        // ignore
      }
    }
    setSaving(false);
    setEditingId(null);
    setEditPrice("");
  }

  const categories = [...new Set(items.map((i) => i.category))].sort();

  const filtered = items.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  if (authenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-tan border-t-brand-orange" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl border border-brand-tan/20 bg-white p-6 shadow-lg">
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-cream text-2xl">
              🔐
            </div>
            <h1 className="font-display text-xl font-bold text-brand-brown">
              Admin Login
            </h1>
            <p className="mt-1 text-sm text-brand-brown/50">
              Taha Dates & Nuts
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-brand-brown"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-tan/30 px-4 py-2.5 text-brand-brown outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Enter admin password"
                required
              />
            </div>
            {loginError && (
              <p className="text-sm text-red-600">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-brand-orange py-2.5 font-semibold text-white transition hover:bg-brand-red"
            >
              Sign In
            </button>
          </form>

          <Link
            href="/"
            className="mt-4 block text-center text-sm text-brand-brown/50 hover:text-brand-orange"
          >
            ← Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="sticky top-0 z-10 border-b border-brand-tan/20 bg-white shadow-sm">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <div>
            <h1 className="font-display text-lg font-bold text-brand-brown">
              Price Manager
            </h1>
            <p className="text-xs text-brand-brown/50">
              {items.length} total items
            </p>
          </div>
          <div className="flex items-center gap-2">
            {message && (
              <span className="text-sm font-medium text-green-600">
                {message}
              </span>
            )}
            <Link
              href="/"
              className="rounded-lg px-3 py-1.5 text-sm text-brand-brown/60 hover:bg-brand-cream"
            >
              Menu
            </Link>
            <button
              onClick={handleLogout}
              className="rounded-lg bg-brand-brown/10 px-3 py-1.5 text-sm text-brand-brown hover:bg-brand-brown/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-4 safe-bottom">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <input
            type="search"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-brand-tan/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-xl border border-brand-tan/30 bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-orange"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-tan/20 bg-white shadow-sm">
          <div className="hidden border-b border-brand-cream bg-brand-cream/50 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-brand-brown/50 sm:grid sm:grid-cols-12">
            <div className="col-span-5">Item</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Unit</div>
            <div className="col-span-3 text-right">Price</div>
          </div>

          {filtered.map((item) => (
            <div
              key={item.id}
              className="border-b border-brand-cream px-4 py-3 last:border-0 sm:grid sm:grid-cols-12 sm:items-center"
            >
              <div className="col-span-5 font-medium text-brand-brown">
                {item.name}
              </div>
              <div className="col-span-2 mt-1 text-xs text-brand-brown/50 sm:mt-0">
                {item.category}
              </div>
              <div className="col-span-2 text-xs text-brand-brown/40">
                {item.uom}
              </div>
              <div className="col-span-3 mt-2 flex items-center justify-end gap-2 sm:mt-0">
                {editingId === item.id ? (
                  <>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 rounded-lg border border-brand-orange px-2 py-1 text-right text-sm outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") savePrice(item.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                    <button
                      onClick={() => savePrice(item.id)}
                      disabled={saving}
                      className="rounded-lg bg-brand-green px-2 py-1 text-xs font-semibold text-white hover:bg-brand-green/90 disabled:opacity-50"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="rounded-lg px-2 py-1 text-xs text-brand-brown/50 hover:bg-brand-cream"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <PriceDisplay price={item.price} />
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditPrice(String(item.price));
                      }}
                      className="rounded-lg bg-brand-orange/10 px-2.5 py-1 text-xs font-semibold text-brand-orange hover:bg-brand-orange/20"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-brand-brown/40">
              No items found
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
