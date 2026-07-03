import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Russian ruble price formatter, e.g. 1890 -> "1 890 ₽" */
export function formatPrice(n: number): string {
  return new Intl.NumberFormat("ru-RU").format(n) + " ₽";
}
