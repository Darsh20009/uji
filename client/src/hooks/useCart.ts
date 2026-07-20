import { create } from "zustand";
interface CartItem { _id: string; name: string; price: number; image: string; qty: number; }
interface CartStore {
  items: CartItem[]; add: (item: Omit<CartItem, "qty">) => void;
  remove: (id: string) => void; update: (id: string, qty: number) => void; clear: () => void;
}
export const useCart = create<CartStore>((set) => ({
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
  add: (item) => set((s) => {
    const exists = s.items.find((i) => i._id === item._id);
    const items = exists ? s.items.map((i) => i._id === item._id ? { ...i, qty: i.qty + 1 } : i) : [...s.items, { ...item, qty: 1 }];
    localStorage.setItem("cart", JSON.stringify(items)); return { items };
  }),
  remove: (id) => set((s) => { const items = s.items.filter((i) => i._id !== id); localStorage.setItem("cart", JSON.stringify(items)); return { items }; }),
  update: (id, qty) => set((s) => { const items = qty < 1 ? s.items.filter((i) => i._id !== id) : s.items.map((i) => i._id === id ? { ...i, qty } : i); localStorage.setItem("cart", JSON.stringify(items)); return { items }; }),
  clear: () => { localStorage.removeItem("cart"); set({ items: [] }); },
}));