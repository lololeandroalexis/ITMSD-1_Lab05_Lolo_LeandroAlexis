import React, { createContext, useContext, useMemo, useState } from 'react';

export type CartItem = { key: string; name: string; sub: string; price: number; qty: number; img: any };
export type Restaurant = { id: string; name: string; tags: string; rating: string; time: string; fee: string; dist: string; img: any; cat: string };
export type MenuItem = { id: string; name: string; desc: string; price: number; img: any; cat: string };

type AppState = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'key'>) => void;
  inc: (key: string) => void;
  dec: (key: string) => void;
  clearCart: () => void;
  subtotal: number;
  count: number;
  favs: Set<string>;
  toggleFav: (id: string) => void;
};

const Ctx = createContext<AppState | null>(null);

const INITIAL_CART: CartItem[] = [
  { key: 'smash-0', name: 'Classic Smash Burger', sub: 'Double • House sauce', price: 13.9, qty: 1, img: require('../../assets/images/cart-burger.png') },
  { key: 'fries-0', name: 'Truffle Fries', sub: 'Parmesan • Truffle aioli', price: 5.9, qty: 1, img: require('../../assets/images/cart-fries.png') },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(INITIAL_CART);
  const [favs, setFavs] = useState<Set<string>>(new Set(['urban']));

  const value = useMemo<AppState>(() => ({
    cart,
    addToCart: (item) => setCart((c) => [...c, { ...item, key: `${item.name}-${Date.now()}` }]),
    inc: (key) => setCart((c) => c.map((i) => (i.key === key ? { ...i, qty: i.qty + 1 } : i))),
    dec: (key) => setCart((c) => c.flatMap((i) => (i.key === key ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))),
    clearCart: () => setCart([]),
    subtotal: cart.reduce((a, c) => a + c.price * c.qty, 0),
    count: cart.reduce((a, c) => a + c.qty, 0),
    favs,
    toggleFav: (id) => setFavs((f) => {
      const n = new Set(f);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    }),
  }), [cart, favs]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useApp must be used inside AppProvider');
  return v;
}
