export interface Category {
  _id: string;
  name: string;
  icon: string;
  subcategories: { name: string }[];
}

export interface ProductImage {
  url: string;
  publicId: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  category: { _id: string; name: string } | string;
  subcategory: string;
  price: number;
  discountPrice?: number;
  rx: boolean;
  stock: number;
  inStock: boolean;
  images: ProductImage[];
  dosage: string;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = "Processing" | "Shipped" | "Received" | "Delivered" | "Cancelled";

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  province: string;
}

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  rx: boolean;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  changedAt: string;
  note?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: "cod";
  subtotal: number;
  deliveryFee: number;
  total: number;
  requiresPrescription: boolean;
  prescriptionUrl?: string;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
}

export interface Customer {
  _id: string; // email, used as the aggregation key
  name: string;
  email: string;
  phone: string;
  orders: number;
  spent: number;
  lastOrderAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin";
}

export interface DashboardStats {
  totalOrders: number;
  revenue: number;
  totalProducts: number;
  lowStockCount: number;
  lowStockProducts: Product[];
  recentOrders: Order[];
}
