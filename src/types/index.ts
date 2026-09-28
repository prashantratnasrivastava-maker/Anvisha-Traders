export type OrderStatus = 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled';

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  unit: string; // e.g. 'Piece', 'Kg', 'Packet', 'Set'
  description: string;
  image: string;
  rating: number;
  reviewsCount: number;
  isPopular?: boolean;
  isTrending?: boolean;
  tags?: string[];
  hsnCode?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  productCount?: number;
}

export interface ProductShort {
  id: string;
  title: string;
  description?: string;
  videoUrl: string; // Direct mp4/webm link or data URL or YouTube/Cloud URL
  thumbnail?: string;
  productId?: string;
  productName?: string;
  productPrice?: number;
  productUnit?: string;
  productImage?: string;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  uploadedBy?: string;
}

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'shorts'
  | 'categories'
  | 'inventory'
  | 'orders'
  | 'customers'
  | 'reports'
  | 'settings';


export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  mrp: number;
  quantity: number;
  unit: string;
  image: string;
  total: number;
  hsnCode?: string;
}

export interface StatusTimelineEntry {
  status: OrderStatus;
  label: string;
  timestamp: string;
  note: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  landmark?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  taxRate: number; // e.g. 5%
  taxAmount: number;
  grandTotal: number;
  paymentMethod: 'cod' | 'upi';
  paymentStatus: 'pending' | 'paid';
  status: OrderStatus;
  statusTimeline: StatusTimelineEntry[];
  invoiceNumber?: string;
  invoiceGeneratedAt?: string;
  notes?: string;
}

export interface AppNotification {
  id: string;
  recipient: 'customer' | 'admin' | 'both';
  title: string;
  message: string;
  type: 'order_placed' | 'order_status' | 'stock_alert' | 'system';
  timestamp: string;
  read: boolean;
  orderId?: string;
}

export interface BusinessInfo {
  name: string;
  contact: string;
  phone?: string;
  address: string;
  pincode: string;
  city: string;
  state: string;
  gstin: string;
  upiId: string;
  tagline: string;
  bannerNotice: string;
  // Offer & Promotional Banner settings
  offersEnabled?: boolean;
  offerTag?: string;
  offerHeading?: string;
  offerSubheading?: string;
  offerBadgeText?: string;
  offerButtonText?: string;
  offerDiscountPercent?: number;
  fast2SmsApiKey?: string;
  smsGatewayEnabled?: boolean;
  whatsappCloudApiEnabled?: boolean;
  whatsappPhoneNumberId?: string;
  whatsappAccessToken?: string;
  whatsappBusinessAccountId?: string;
  whatsappTemplateName?: string;
}

export interface CustomerUser {
  id?: string;
  name: string;
  phone: string;
  address: string;
  isLoggedIn: boolean;
  status?: 'approved' | 'pending' | 'rejected' | 'blocked';
  requestedAt?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

export interface CustomerApprovalRequest {
  id: string;
  phone: string;
  name: string;
  address: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
  requestedAt: string;
  approvedAt?: string;
  rejectionReason?: string;
  deviceInfo?: string;
}

export interface DailySalesReport {
  date: string;
  totalOrders: number;
  totalRevenue: number;
  totalUnitsSold: number;
  completedOrders: number;
  cancelledOrders: number;
  orders: Order[];
}
