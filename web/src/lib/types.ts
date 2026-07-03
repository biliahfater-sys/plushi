export type Category = "rabbits" | "bears" | "cats";

export interface Product {
  id: string;
  category: Category;
  name: string;
  description: string;
  price: number;
  image: string;
}

export type BadgeType = "hit" | "new" | "soft";

/** Front-end-only display meta (badges, ratings, strike-through prices). */
export interface ProductMeta {
  badge?: BadgeType;
  rating?: number;
  oldPrice?: number;
}

export interface CartLine {
  product: Product;
  qty: number;
}

export interface CartItemRef {
  id: string;
  qty: number;
}

export interface Customer {
  name: string;
  email: string;
  phone?: string;
  note?: string;
}

export interface CheckoutPayload {
  customer: Customer;
  items: CartItemRef[];
  consent: boolean;
}

export interface OrderLine {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Order {
  lines: OrderLine[];
  total: number;
  itemsCount: number;
}
