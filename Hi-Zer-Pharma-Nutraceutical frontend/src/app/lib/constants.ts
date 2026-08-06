export const FREE_DELIVERY_THRESHOLD = 5000;
export const STANDARD_DELIVERY_FEE = 200;
export const LOW_STOCK_THRESHOLD = 30;

export const ff = { fontFamily: "Manrope, sans-serif" };
export const fs = { fontFamily: "Fraunces, serif" };

export function fmt(n: number) {
  return `Rs. ${n.toLocaleString()}`;
}
