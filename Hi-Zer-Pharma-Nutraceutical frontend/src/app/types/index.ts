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

<<<<<<< HEAD
export type OrderStatus = "Processing" | "Shipped" | "Received" | "Delivered" | "Cancelled";
=======
export type OrderStatus =
  | "Payment Verification Pending"
  | "Processing"
  | "Shipped"
  | "Received"
  | "Delivered"
  | "Cancelled"
  | "Payment Rejected";

export type PaymentStatus = "pending" | "approved" | "rejected";

export interface PaymentDetails {
  transactionId: string;
  screenshotUrl?: string;
  screenshotPublicId?: string;
  screenshotDeletedAt?: string;
}
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7

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
<<<<<<< HEAD
  paymentMethod: "cod";
=======
  paymentMethod: "bank_transfer" | "cod";
  paymentDetails?: PaymentDetails;
  paymentStatus: PaymentStatus;
  paymentApprovedAt?: string;
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
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

<<<<<<< HEAD
=======
export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
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
<<<<<<< HEAD
=======

export interface Settings {
  _id: string;
  bankName: string;
  accountTitle: string;
  accountNumber: string;
  iban: string;
  qrCodeImage?: { url: string; publicId: string };
  deliveryFee: number;
}
>>>>>>> 44ea1d68271f7ef405d789f92d0c1b7eaceeb8b7
