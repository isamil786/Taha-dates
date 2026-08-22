"use client";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  uom: string;
  quantity: number;
  category: string;
};

type Listener = (items: CartItem[]) => void;
const listeners = new Set<Listener>();

let cartItems: CartItem[] = [];

// Initialize on client side
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("taha_cart");
    if (saved) {
      cartItems = JSON.parse(saved);
    }
  } catch (e) {
    console.error("Failed to load cart", e);
  }
}

function notify() {
  if (typeof window !== "undefined") {
    localStorage.setItem("taha_cart", JSON.stringify(cartItems));
  }
  listeners.forEach((listener) => listener([...cartItems]));
}

export const cartStore = {
  subscribe(listener: Listener) {
    listeners.add(listener);
    // Initial emission
    listener([...cartItems]);
    return () => {
      listeners.delete(listener);
    };
  },

  getItems() {
    return [...cartItems];
  },

  addItem(item: Omit<CartItem, "quantity">) {
    const existing = cartItems.find((i) => i.id === item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cartItems.push({ ...item, quantity: 1 });
    }
    notify();
  },

  removeItem(id: number) {
    cartItems = cartItems.filter((i) => i.id !== id);
    notify();
  },

  updateQuantity(id: number, delta: number) {
    const item = cartItems.find((i) => i.id === id);
    if (item) {
      item.quantity += delta;
      if (item.quantity <= 0) {
        cartItems = cartItems.filter((i) => i.id !== id);
      }
      notify();
    }
  },

  clear() {
    cartItems = [];
    notify();
  },
};
