"use client";

import { useState, useEffect } from "react";
import { cartStore, type CartItem } from "@/lib/cartStore";
import { formatPrice } from "@/lib/format";

export function WhatsAppCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    return cartStore.subscribe((newItems) => {
      setItems(newItems);
    });
  }, []);

  if (items.length === 0) return null;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleWhatsAppSend = () => {
    const phoneNumber = "919550897780";

    let text = `*New Order from Taha Dates & Nuts*\n`;
    text += `=========================\n\n`;
    
    items.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      text += `• *${item.name}*\n`;
      text += `  Qty: ${item.quantity} x ${formatPrice(item.price)} (${item.uom ? `per ${item.uom}` : ""}) = *${formatPrice(itemTotal)}*\n\n`;
    });
    
    text += `=========================\n`;
    text += `*Total Order Value:* ${formatPrice(totalPrice)}\n\n`;
    text += `Please confirm my order. Thank you!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank");
  };

  return (
    <>
      <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in">
        <button
          onClick={() => setIsOpen(true)}
          className="flex w-full max-w-md items-center justify-between rounded-[24px] bg-[linear-gradient(135deg,#7f9a72_0%,#5f7f60_100%)] px-6 py-4 text-white shadow-[0_20px_40px_rgba(95,127,96,0.25)] transition-all hover:scale-[1.02] active:scale-95"
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-lg">
              🛒
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] font-black text-[color:var(--primary-strong)] ring-2 ring-[rgba(95,127,96,0.9)]">
                {totalItems}
              </span>
            </span>
            <div className="text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/80">Order Sheet</p>
              <p className="text-sm font-bold text-white">View Items</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-extrabold text-white">{formatPrice(totalPrice)}</span>
            <svg
              className="h-5 w-5 text-white animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[rgba(31,43,36,0.5)] backdrop-blur-sm animate-fade-in">
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />
          <div className="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col rounded-t-[30px] border-t border-[color:var(--line)] bg-[color:var(--bg)] p-6 shadow-[0_-24px_60px_rgba(31,43,36,0.14)]">
            <div className="mx-auto mb-4 h-1 w-12 rounded-full bg-[color:var(--line)]" />

            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-[color:var(--text)]">Your Order Sheet</h3>
                <p className="text-xs text-[color:var(--text-soft)]">Confirm items to inquire or order directly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-[color:var(--line)] bg-white text-[color:var(--text-soft)] shadow-sm transition hover:bg-[color:var(--primary-soft)]"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto py-2 pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--line)] bg-white/80 p-3.5 shadow-[var(--shadow-soft)]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold leading-snug text-[color:var(--text)]">
                      {item.name}
                    </p>
                    <p className="mt-0.5 text-xs font-semibold text-[color:var(--primary-strong)]">
                      {formatPrice(item.price)} {item.uom ? `per ${item.uom}` : ""}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-xl border border-[color:var(--line)] bg-[color:var(--bg-soft)] p-1">
                      <button
                        onClick={() => cartStore.updateQuantity(item.id, -1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-[color:var(--text-soft)] hover:bg-white font-bold"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-[color:var(--text)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => cartStore.updateQuantity(item.id, 1)}
                        className="flex h-6 w-6 items-center justify-center rounded text-[color:var(--text-soft)] hover:bg-white font-bold"
                      >
                        +
                      </button>
                    </div>
                    <div className="min-w-[65px] text-right text-sm font-extrabold text-[color:var(--text)]">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 border-t border-[color:var(--line)] pt-4">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-bold text-[color:var(--text-soft)]">Subtotal:</span>
                <span className="text-xl font-extrabold text-[color:var(--primary-strong)]">
                  {formatPrice(totalPrice)}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to clear your order?")) {
                      cartStore.clear();
                      setIsOpen(false);
                    }
                  }}
                  className="rounded-xl border border-[color:var(--line)] bg-white px-4 py-3 text-xs font-bold text-[color:var(--text-soft)] shadow-sm transition hover:bg-[color:var(--bg-soft)]"
                >
                  Clear All
                </button>
                <button
                  onClick={handleWhatsAppSend}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[linear-gradient(135deg,#22c55e_0%,#16a34a_100%)] py-3 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:brightness-105"
                >
                  <span className="text-base">💬</span>
                  Send on WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
