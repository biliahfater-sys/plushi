import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CartItemRef, Product } from "@/lib/types";

const STORAGE_KEY = "plushi.cart.v1";
const MAX_QTY = 20;

interface CartValue {
  items: CartItemRef[];
  catalog: Map<string, Product>;
  isOpen: boolean;
  count: number;
  total: number;
  setCatalog: (products: Product[]) => void;
  add: (id: string) => void;
  changeQty: (id: string, delta: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
}

const CartContext = createContext<CartValue | null>(null);

function load(): CartItemRef[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartItemRef[]) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemRef[]>(load);
  const [catalog, setCatalogState] = useState<Map<string, Product>>(new Map());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const setCatalog = useCallback((products: Product[]) => {
    setCatalogState(new Map(products.map((p) => [p.id, p])));
  }, []);

  const add = useCallback((id: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === id);
      if (existing) {
        return prev.map((i) =>
          i.id === id ? { ...i, qty: Math.min(i.qty + 1, MAX_QTY) } : i,
        );
      }
      return [...prev, { id, qty: 1 }];
    });
  }, []);

  const changeQty = useCallback((id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.min(i.qty + delta, MAX_QTY) } : i,
        )
        .filter((i) => i.qty > 0),
    );
  }, []);

  const remove = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items]);
  const total = useMemo(
    () =>
      items.reduce((s, i) => {
        const p = catalog.get(i.id);
        return s + (p ? p.price * i.qty : 0);
      }, 0),
    [items, catalog],
  );

  const value = useMemo<CartValue>(
    () => ({
      items,
      catalog,
      isOpen,
      count,
      total,
      setCatalog,
      add,
      changeQty,
      remove,
      clear,
      open,
      close,
    }),
    [items, catalog, isOpen, count, total, setCatalog, add, changeQty, remove, clear, open, close],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
