"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, ReactNode } from "react";
import { Product } from "./types";

interface CartLine {
  product: Product;
  qty: number;
  unitPrice: number;
  packLabel: string;
}

interface StoredLine {
  productId: string;
  qty: number;
  unitPrice: number;
  packLabel: string;
}

interface CartContextValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (product: Product, qty: number, unitPrice: number, packLabel: string, opts?: { silent?: boolean }) => void;
  removeLine: (productId: string, packLabel: string) => void;
  updateQty: (productId: string, packLabel: string, qty: number) => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "altr-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  // Hydrate from localStorage once on mount, resolving stored productIds
  // against the live catalog (lazy import avoids a circular/heavy import at module scope).
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const stored: StoredLine[] = JSON.parse(raw);
      if (!Array.isArray(stored) || stored.length === 0) return;
      import("./products").then(({ getProducts }) => {
        const catalog = getProducts();
        const restored: CartLine[] = stored
          .map((s) => {
            const product = catalog.find((p) => p.id === s.productId);
            if (!product) return null;
            return { product, qty: s.qty, unitPrice: s.unitPrice, packLabel: s.packLabel };
          })
          .filter((l): l is CartLine => l !== null);
        if (restored.length) setLines(restored);
      });
    } catch {
      // corrupted storage — ignore and start fresh
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    const toStore: StoredLine[] = lines.map((l) => ({
      productId: l.product.id,
      qty: l.qty,
      unitPrice: l.unitPrice,
      packLabel: l.packLabel,
    }));
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  }, [lines]);

  const addToCart = useCallback((product: Product, qty: number, unitPrice: number, packLabel: string, opts?: { silent?: boolean }) => {
    setLines((prev) => {
      const existingIndex = prev.findIndex((l) => l.product.id === product.id && l.packLabel === packLabel);
      if (existingIndex >= 0) {
        const next = [...prev];
        next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + qty };
        return next;
      }
      return [...prev, { product, qty, unitPrice, packLabel }];
    });

    if (!opts?.silent) setIsOpen(true);
  }, []);

  const removeLine = useCallback((productId: string, packLabel: string) => {
    setLines((prev) => prev.filter((l) => !(l.product.id === productId && l.packLabel === packLabel)));
  }, []);

  const updateQty = useCallback((productId: string, packLabel: string, qty: number) => {
    setLines((prev) =>
      prev
        .map((l) => (l.product.id === productId && l.packLabel === packLabel ? { ...l, qty: Math.max(1, qty) } : l))
        .filter((l) => l.qty > 0)
    );
  }, []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines]);
  const subtotal = useMemo(() => lines.reduce((sum, l) => sum + l.qty * l.unitPrice, 0), [lines]);

  const value = useMemo(
    () => ({ lines, count, subtotal, isOpen, openCart, closeCart, addToCart, removeLine, updateQty }),
    [lines, count, subtotal, isOpen, openCart, closeCart, addToCart, removeLine, updateQty]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
