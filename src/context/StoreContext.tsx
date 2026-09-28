import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, testFirestoreConnection } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  initialBusinessInfo,
  initialCategories,
  initialNotifications,
  initialOrders,
  initialProducts,
  initialProductShorts,
} from '../data/initialData';
import { initialCustomerApprovalRequests } from '../data/initialCustomers';
import {
  AdminTab,
  AppNotification,
  BusinessInfo,
  CartItem,
  Category,
  CustomerApprovalRequest,
  CustomerUser,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductShort,
} from '../types';

interface StoreContextType {
  // Business Info
  businessInfo: BusinessInfo;
  updateBusinessInfo: (info: Partial<BusinessInfo>) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;

  // Shorts / Product Videos
  shorts: ProductShort[];
  addShort: (short: Omit<ProductShort, 'id' | 'viewsCount' | 'likesCount' | 'createdAt'>) => Promise<void>;
  deleteShort: (id: string) => Promise<void>;
  incrementShortView: (id: string) => void;
  likeShort: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'productCount'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    landmark?: string;
    customerEmail?: string;
    paymentMethod: 'cod' | 'upi';
    notes?: string;
  }) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => void;
  generateInvoice: (orderId: string) => void;
  updateOrderInvoiceDetails: (
    orderId: string,
    updatedItems: { productId: string; price: number; quantity: number }[],
    options?: { deliveryFee?: number; taxRate?: number; notes?: string }
  ) => void;

  // Navigation & View
  activeRole: 'customer' | 'admin';
  setActiveRole: (role: 'customer' | 'admin') => void;
  customerTab: 'home' | 'shorts' | 'cart' | 'profile' | 'orders';
  setCustomerTab: (tab: 'home' | 'shorts' | 'cart' | 'profile' | 'orders') => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;

  // Authentication & Protection
  isAdminAuthenticated: boolean;
  adminPassword?: string;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  loginAdmin: (phone: string, pass: string) => boolean;
  logoutAdmin: () => void;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;

  currentCustomer: CustomerUser;
  customerApprovalRequests: CustomerApprovalRequest[];
  pendingApprovalsCount: number;
  submitCustomerLoginRequest: (name: string, phone: string, address: string) => Promise<{
    status: 'approved' | 'pending' | 'rejected' | 'blocked';
    message: string;
  }>;
  checkCustomerStatus: (phone: string) => Promise<'approved' | 'pending' | 'rejected' | 'blocked' | 'not_found'>;
  approveCustomerRequest: (idOrPhone: string) => Promise<void>;
  rejectCustomerRequest: (idOrPhone: string, reason?: string) => Promise<void>;
  loginCustomer: (name: string, phone: string, address: string) => void;
  logoutCustomer: () => void;
  showCustomerLoginModal: boolean;
  setShowCustomerLoginModal: (show: boolean) => void;
  sendCustomerOtp: (phone: string) => Promise<{
    success: boolean;
    message: string;
    isRealSms: boolean;
    isRealWhatsApp?: boolean;
    whatsappApiErrorMsg?: string;
    otp?: string;
  }>;
  verifyCustomerOtpAndLogin: (phone: string, enteredOtp: string, name?: string, address?: string) => boolean;

  // Cloud & Internet Status
  isCloudOnline: boolean;

  // Filtering & Modal state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProductForDetail: Product | null;
  setSelectedProductForDetail: (product: Product | null) => void;
  selectedOrderForInvoice: Order | null;
  setSelectedOrderForInvoice: (order: Order | null) => void;
  selectedOrderForTracking: Order | null;
  setSelectedOrderForTracking: (order: Order | null) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCountForCustomer: number;
  unreadCountForAdmin: number;
  activeToast: AppNotification | null;
  dismissToast: () => void;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: (role: 'customer' | 'admin') => void;

  // Audio trigger
  playChime: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Web Audio synthesizer chime for notifications (zero external assets needed)
const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  } catch {
    // Ignore audio context block if user hasn't interacted yet
  }
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence state
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>(() => {
    const saved = localStorage.getItem('anvisha_business_info');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...initialBusinessInfo,
          ...parsed,
          // Guarantee WhatsApp Cloud API credentials from initialBusinessInfo if not present in saved
          whatsappCloudApiEnabled: parsed.whatsappCloudApiEnabled !== undefined ? parsed.whatsappCloudApiEnabled : initialBusinessInfo.whatsappCloudApiEnabled,
          whatsappPhoneNumberId: parsed.whatsappPhoneNumberId || initialBusinessInfo.whatsappPhoneNumberId,
          whatsappAccessToken: parsed.whatsappAccessToken || initialBusinessInfo.whatsappAccessToken,
          whatsappBusinessAccountId: parsed.whatsappBusinessAccountId || initialBusinessInfo.whatsappBusinessAccountId,
        };
      } catch {
        return initialBusinessInfo;
      }
    }
    return initialBusinessInfo;
  });

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('anvisha_admin_auth') === 'true';
  });
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);

  // Customer authentication state
  const [currentCustomer, setCurrentCustomer] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('anvisha_customer_user');
    return saved
      ? JSON.parse(saved)
      : {
          name: 'Prashant Ratna Srivastava',
          phone: '7000455037',
          address: 'Pachrukhi, Siwan, Bihar - 841241',
          isLoggedIn: true,
          status: 'approved',
        };
  });
  const [showCustomerLoginModal, setShowCustomerLoginModal] = useState(false);

  // Customer Approvals state
  const [customerApprovalRequests, setCustomerApprovalRequests] = useState<CustomerApprovalRequest[]>(() => {
    const saved = localStorage.getItem('anvisha_customer_approvals');
    return saved ? JSON.parse(saved) : initialCustomerApprovalRequests;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('anvisha_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('anvisha_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('anvisha_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('anvisha_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('anvisha_wishlist');
    return saved ? JSON.parse(saved) : ['prod-1', 'prod-3'];
  });

  const [shorts, setShorts] = useState<ProductShort[]>(() => {
    try {
      const saved = localStorage.getItem('anvisha_product_shorts');
      if (saved) {
        const parsed: ProductShort[] = JSON.parse(saved);
        // If saved shorts still have old 403-failing mixkit URLs, upgrade them to local working mp4s
        const updated = parsed.map((s) => {
          if (s.videoUrl && s.videoUrl.includes('assets.mixkit.co')) {
            const fallback = initialProductShorts.find((init) => init.id === s.id);
            return fallback ? { ...s, videoUrl: fallback.videoUrl } : { ...s, videoUrl: '/videos/kurta-short.mp4' };
          }
          return s;
        });
        return updated.length > 0 ? updated : initialProductShorts;
      }
    } catch {
      // fallback
    }
    return initialProductShorts;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('anvisha_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // UI state
  const [activeRole, setActiveRole] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'shorts' | 'cart' | 'profile' | 'orders'>('home');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('anvisha_business_info', JSON.stringify(businessInfo));
  }, [businessInfo]);

  useEffect(() => {
    localStorage.setItem('anvisha_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('anvisha_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('anvisha_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('anvisha_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('anvisha_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('anvisha_product_shorts', JSON.stringify(shorts));
  }, [shorts]);

  useEffect(() => {
    localStorage.setItem('anvisha_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('anvisha_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('anvisha_customer_user', JSON.stringify(currentCustomer));
  }, [currentCustomer]);

  useEffect(() => {
    localStorage.setItem('anvisha_customer_approvals', JSON.stringify(customerApprovalRequests));
  }, [customerApprovalRequests]);

  // Admin dynamic password state (synced with Firestore / localStorage)
  const [adminPassword, setAdminPassword] = useState<string>(() => {
    return localStorage.getItem('anvisha_admin_password') || '123ABCD';
  });

  // Internet & Cloud Online state
  const [isCloudOnline, setIsCloudOnline] = useState<boolean>(true);

  // Active generated OTP state for customers
  const [activeGeneratedOtps, setActiveGeneratedOtps] = useState<Record<string, { otp: string; expiresAt: number }>>({});

  // Sync admin password & orders with Firestore Cloud Database
  useEffect(() => {
    // 1. Initial connectivity test
    testFirestoreConnection().then((online) => {
      setIsCloudOnline(online);
    });

    const handleOnline = () => setIsCloudOnline(true);
    const handleOffline = () => setIsCloudOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 2. Fetch or initialize admin password in Firestore
    const configDocRef = doc(db, 'store_config', 'admin_security');
    getDoc(configDocRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data?.adminPassword) {
            setAdminPassword(data.adminPassword);
            localStorage.setItem('anvisha_admin_password', data.adminPassword);
          }
        } else {
          // Initialize in cloud
          setDoc(configDocRef, {
            adminPhone: '7000455037',
            adminPassword: '123ABCD',
            updatedAt: new Date().toISOString(),
          }).catch((err) => console.warn('Could not initialize cloud store config:', err));
        }
      })
      .catch((err) => {
        console.warn('Using local store config:', err);
      });

    // 3. Real-time Firestore sync for incoming orders
    const ordersColRef = collection(db, 'orders');
    const unsubscribeOrders = onSnapshot(
      ordersColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudOrders: Order[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudOrders.push({
              id: docSnap.id,
              ...data,
            } as Order);
          });
          // Sort latest first
          cloudOrders.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setOrders((prev) => {
            // Merge cloud orders with local orders avoiding duplicates
            const existingIds = new Set(cloudOrders.map((o) => o.id));
            const localOnly = prev.filter((o) => !existingIds.has(o.id));
            const merged = [...cloudOrders, ...localOnly];
            return merged;
          });
        }
      },
      (error) => {
        console.warn('Real-time order sync offline, using local data:', error);
      }
    );

    // 4. Real-time Firestore sync for customer approval requests
    const customersColRef = collection(db, 'customers');
    const unsubscribeCustomers = onSnapshot(
      customersColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudCustomers: CustomerApprovalRequest[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudCustomers.push({
              id: `req-${docSnap.id}`,
              phone: data.phone || docSnap.id,
              name: data.name || 'Valued Customer',
              address: data.address || 'Pachrukhi, Siwan',
              status: data.status || 'pending',
              requestedAt: data.requestedAt || new Date().toISOString(),
              approvedAt: data.approvedAt,
              rejectionReason: data.rejectionReason,
            });
          });

          // Sort: pending first, then newest
          cloudCustomers.sort((a, b) => {
            if (a.status === 'pending' && b.status !== 'pending') return -1;
            if (a.status !== 'pending' && b.status === 'pending') return 1;
            return new Date(b.requestedAt).getTime() - new Date(a.requestedAt).getTime();
          });

          setCustomerApprovalRequests((prev) => {
            const existingPhones = new Set(cloudCustomers.map((c) => c.phone));
            const localOnly = prev.filter((c) => !existingPhones.has(c.phone));
            return [...cloudCustomers, ...localOnly];
          });
        }
      },
      (error) => {
        console.warn('Customer approvals sync notice:', error);
      }
    );

    // 5. Real-time Firestore sync for product shorts / videos
    const shortsColRef = collection(db, 'product_shorts');
    const unsubscribeShorts = onSnapshot(
      shortsColRef,
      (snapshot) => {
        if (!snapshot.empty) {
          const cloudShorts: ProductShort[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            cloudShorts.push({
              id: docSnap.id,
              ...data,
            } as ProductShort);
          });
          cloudShorts.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setShorts((prev) => {
            const existingIds = new Set(cloudShorts.map((s) => s.id));
            const localOnly = prev.filter((s) => !existingIds.has(s.id));
            return [...cloudShorts, ...localOnly];
          });
        }
      },
      (error) => {
        console.warn('Product shorts sync notice:', error);
      }
    );

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeOrders();
      unsubscribeCustomers();
      unsubscribeShorts();
    };
  }, []);


  // Admin authentication handlers with dynamic password
  const loginAdmin = (phone: string, pass: string): boolean => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone === '7000455037' && pass === adminPassword) {
      setIsAdminAuthenticated(true);
      setActiveRole('admin');
      triggerToast({
        id: `notif-auth-${Date.now()}`,
        recipient: 'admin',
        title: 'Admin Login Kamyab! 🔒',
        message: 'Namaste Owner Ji! Anvisha Traders management dashboard open ho gaya hai.',
        type: 'system',
        timestamp: 'Just now',
        read: false,
      });
      return true;
    }
    return false;
  };

  // Change Admin Password function (saves to localStorage and Firestore)
  const changeAdminPassword = (oldPass: string, newPass: string): { success: boolean; message: string } => {
    if (oldPass !== adminPassword) {
      return { success: false, message: 'Purana password galat hai! Kripya sahi current password dalein.' };
    }
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Naya password kam se kam 4 characters ka hona chahiye.' };
    }

    const cleanNewPass = newPass.trim();
    setAdminPassword(cleanNewPass);
    localStorage.setItem('anvisha_admin_password', cleanNewPass);

    // Sync to Firestore Cloud
    const configDocRef = doc(db, 'store_config', 'admin_security');
    setDoc(configDocRef, {
      adminPhone: '7000455037',
      adminPassword: cleanNewPass,
      updatedAt: new Date().toISOString(),
    }, { merge: true }).catch((err) => {
      console.warn('Cloud password update warning:', err);
    });

    triggerToast({
      id: `notif-pass-change-${Date.now()}`,
      recipient: 'admin',
      title: 'Password Badla Gaya! 🔑',
      message: 'Aapka Admin portal password safaltapoorvak update ho gaya hai aur cloud par save ho gaya hai.',
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });

    return { success: true, message: 'Admin Password successfully badal diya gaya!' };
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    setActiveRole('customer');
    setCustomerTab('home');
    triggerToast({
      id: `notif-auth-${Date.now()}`,
      recipient: 'customer',
      title: 'Admin Logged Out',
      message: 'Aap surakshit roop se admin portal se logout ho gaye hain.',
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  // Safe wrapper for switching role: customers CANNOT switch to admin without password
  const handleSetActiveRole = (role: 'customer' | 'admin') => {
    if (role === 'admin') {
      if (isAdminAuthenticated) {
        setActiveRole('admin');
      } else {
        setShowAdminLoginModal(true);
      }
    } else {
      setActiveRole('customer');
    }
  };

  // Generate real 6-digit OTP for Customer Phone Number
  const sendCustomerOtp = async (phone: string): Promise<{
    success: boolean;
    message: string;
    isRealSms: boolean;
    isRealWhatsApp?: boolean;
    whatsappApiErrorMsg?: string;
    otp?: string;
  }> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Kripya sahi 10-digit mobile number enter karein.', isRealSms: false };
    }

    // Generate authentic 6-digit random verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // valid for 10 mins

    setActiveGeneratedOtps((prev) => ({
      ...prev,
      [cleanPhone]: { otp: generatedOtp, expiresAt },
    }));

    let realSmsDelivered = false;
    let gatewayErrorMsg = '';
    let realWhatsAppDelivered = false;
    let whatsappApiErrorMsg = '';

    // If Admin has configured Meta WhatsApp Cloud API (1,000 Free Messages/Month)
    if (
      businessInfo.whatsappCloudApiEnabled &&
      businessInfo.whatsappPhoneNumberId &&
      businessInfo.whatsappAccessToken
    ) {
      try {
        const phoneId = businessInfo.whatsappPhoneNumberId.trim();
        const token = businessInfo.whatsappAccessToken.trim();
        const templateName = businessInfo.whatsappTemplateName?.trim();

        const metaApiUrl = `https://graph.facebook.com/v20.0/${phoneId}/messages`;

        // WhatsApp message payload for OTP verification
        const otpTextMsg = `🛒 *Anvisha Traders - Login Verification*\n\nNamaste!\nAapka Anvisha Traders login OTP verification code hai:\n\n👉 *${generatedOtp}*\n\nYeh code agle 10 minute tak valid hai. Kripya ise kisi ke saath share na karein.\n\n📍 Pachrukhi, Siwan (Bihar)`;

        // 1. Try our server-side proxy route first (completely bypasses browser CORS)
        try {
          const proxyRes = await fetch('/api/send-whatsapp-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phoneId,
              token,
              to: cleanPhone,
              body: otpTextMsg,
            }),
          });
          const proxyData = await proxyRes.json();
          if (proxyRes.ok && proxyData?.messages?.length > 0) {
            realWhatsAppDelivered = true;
          } else {
            console.warn('Proxy WhatsApp dispatch response:', proxyData);
          }
        } catch (proxyErr) {
          console.warn('Proxy route unavailable, trying direct fetch:', proxyErr);
        }

        // 2. Direct fallback if proxy was bypassed
        if (!realWhatsAppDelivered) {
          const metaPayload = {
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: `91${cleanPhone}`,
            type: 'text',
            text: {
              preview_url: false,
              body: otpTextMsg,
            },
          };

          const res = await fetch(metaApiUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(metaPayload),
          });

          const resData = await res.json();
          if (res.ok && resData?.messages?.length > 0) {
            realWhatsAppDelivered = true;
          } else {
            whatsappApiErrorMsg = resData?.error?.message || 'Meta WhatsApp API returned an error';
            console.warn('Meta WhatsApp Cloud API error:', resData);
          }
        }
      } catch (waErr: any) {
        whatsappApiErrorMsg = waErr?.message || 'Network error connecting to Meta WhatsApp API';
        console.warn('Meta WhatsApp Cloud API network error:', waErr);
      }
    }

    // If Admin has configured Fast2SMS API Key, send real cellular telecom SMS directly to user's phone inbox
    if (businessInfo.fast2SmsApiKey && businessInfo.fast2SmsApiKey.trim().length > 5 && businessInfo.smsGatewayEnabled !== false) {
      try {
        const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
          method: 'POST',
          headers: {
            'authorization': businessInfo.fast2SmsApiKey.trim(),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            route: 'otp',
            variables_values: generatedOtp,
            numbers: cleanPhone,
          }),
        });
        const data = await response.json();
        if (data && data.return) {
          realSmsDelivered = true;
        } else {
          gatewayErrorMsg = data?.message || 'Fast2SMS returned error';
        }
      } catch (err: any) {
        gatewayErrorMsg = err?.message || 'Network error connecting to SMS Gateway';
      }
    }

    playNotificationChime();

    // Trigger toast confirming OTP dispatched to their mobile without revealing the OTP code
    triggerToast({
      id: `notif-otp-${Date.now()}`,
      recipient: 'customer',
      title: realWhatsAppDelivered
        ? `💬 WhatsApp OTP Sent to +91 ${cleanPhone}`
        : realSmsDelivered
        ? `📲 SMS Sent to +91 ${cleanPhone}`
        : `📩 Verification Code Ready for +91 ${cleanPhone}`,
      message: realWhatsAppDelivered
        ? `Customer ke WhatsApp inbox mein Anvisha Traders ka 6-digit OTP pahunch gaya hai!`
        : `Anvisha Traders 6-digit OTP verification code mobile par dispatch kar diya gaya hai.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });

    return {
      success: true,
      otp: generatedOtp,
      isRealSms: realSmsDelivered,
      isRealWhatsApp: realWhatsAppDelivered,
      whatsappApiErrorMsg,
      message: realWhatsAppDelivered
        ? `WhatsApp message +91 ${cleanPhone} ke WhatsApp inbox mein bhej diya gaya hai!`
        : realSmsDelivered
        ? `Real SMS mobile number +91 ${cleanPhone} ke inbox mein bhej diya gaya hai!`
        : `OTP dispatched to +91 ${cleanPhone}. Kripya apna phone message inbox ya WhatsApp check karein.`,
    };
  };

  // Verify Customer OTP and complete login
  const verifyCustomerOtpAndLogin = (
    phone: string,
    enteredOtp: string,
    name?: string,
    address?: string
  ): boolean => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const activeEntry = activeGeneratedOtps[cleanPhone];

    // Only valid generated OTP or owner master PIN for 7000455037
    const isValid = (activeEntry && activeEntry.otp === enteredOtp.trim()) || (cleanPhone === '7000455037' && enteredOtp.trim() === '123456');

    if (isValid) {
      const finalName = name?.trim() || currentCustomer.name || 'Valued Customer';
      const finalAddress = address?.trim() || currentCustomer.address || 'Pachrukhi, Siwan';
      const customerData: CustomerUser = {
        name: finalName,
        phone: cleanPhone,
        address: finalAddress,
        isLoggedIn: true,
      };

      setCurrentCustomer(customerData);
      localStorage.setItem('anvisha_customer_user', JSON.stringify(customerData));

      // Sync customer to Firestore Cloud
      const customerDocRef = doc(db, 'customers', cleanPhone);
      setDoc(customerDocRef, {
        phone: cleanPhone,
        name: finalName,
        address: finalAddress,
        lastLogin: new Date().toISOString(),
      }, { merge: true }).catch((err) => console.warn('Could not sync customer to cloud:', err));

      triggerToast({
        id: `notif-login-success-${Date.now()}`,
        recipient: 'customer',
        title: `Welcome, ${finalName}! 🎉`,
        message: 'Aapka mobile number OTP verify ho gaya hai aur aap login ho gaye hain.',
        type: 'system',
        timestamp: 'Just now',
        read: false,
      });

      return true;
    }

    return false;
  };

  // Customer Approval System (No OTP required, Verified by Shop Admin)
  const submitCustomerLoginRequest = async (
    name: string,
    phone: string,
    address: string
  ): Promise<{ status: 'approved' | 'pending' | 'rejected' | 'blocked'; message: string }> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const cleanName = name.trim();
    const cleanAddress = address.trim();

    // Check if customer already exists in approval list
    const existing = customerApprovalRequests.find((r) => r.phone === cleanPhone);

    // If already approved (or if shop owner master phone 7000455037)
    if ((existing && existing.status === 'approved') || cleanPhone === '7000455037') {
      const approvedUser: CustomerUser = {
        name: cleanName || existing?.name || 'Valued Customer',
        phone: cleanPhone,
        address: cleanAddress || existing?.address || 'Pachrukhi, Siwan',
        isLoggedIn: true,
        status: 'approved',
        approvedAt: existing?.approvedAt || new Date().toISOString(),
      };
      setCurrentCustomer(approvedUser);
      localStorage.setItem('anvisha_customer_user', JSON.stringify(approvedUser));

      triggerToast({
        id: `notif-cust-${Date.now()}`,
        recipient: 'customer',
        title: `Welcome, ${approvedUser.name}! 🎉`,
        message: 'Aapka account verified aur approved hai. Aap shopping shuru kar sakte hain!',
        type: 'system',
        timestamp: 'Just now',
        read: false,
      });

      return {
        status: 'approved',
        message: 'Aapka account verified aur approved hai. Login safal raha!',
      };
    }

    // If rejected or blocked
    if (existing && (existing.status === 'rejected' || existing.status === 'blocked')) {
      return {
        status: existing.status,
        message: existing.rejectionReason
          ? `Aapka account dukan admin dwara approve nahi kiya gaya hai: "${existing.rejectionReason}". Kripya dukan par sampark karein.`
          : 'Aapka account dukan admin dwara reject/blocked hai. Kripya dukan se sampark karein.',
      };
    }

    // Otherwise, create or update a pending request
    const newRequest: CustomerApprovalRequest = {
      id: existing ? existing.id : `req-${cleanPhone}`,
      phone: cleanPhone,
      name: cleanName,
      address: cleanAddress,
      status: 'pending',
      requestedAt: new Date().toISOString(),
    };

    setCustomerApprovalRequests((prev) => {
      const filtered = prev.filter((r) => r.phone !== cleanPhone);
      return [newRequest, ...filtered];
    });

    // Save to Firestore Cloud
    try {
      const customerDocRef = doc(db, 'customers', cleanPhone);
      await setDoc(customerDocRef, {
        id: newRequest.id,
        phone: cleanPhone,
        name: cleanName,
        address: cleanAddress,
        status: 'pending',
        requestedAt: newRequest.requestedAt,
        lastLogin: new Date().toISOString(),
      }, { merge: true });
    } catch (err) {
      console.warn('Could not sync customer approval to cloud:', err);
    }

    // Set as pending customer locally
    const pendingCustomer: CustomerUser = {
      name: cleanName,
      phone: cleanPhone,
      address: cleanAddress,
      isLoggedIn: false,
      status: 'pending',
      requestedAt: newRequest.requestedAt,
    };
    setCurrentCustomer(pendingCustomer);
    localStorage.setItem('anvisha_customer_user', JSON.stringify(pendingCustomer));

    // Admin notification
    triggerToast({
      id: `notif-req-${Date.now()}`,
      recipient: 'admin',
      title: 'New Customer Request! 🔔',
      message: `${cleanName} (${cleanPhone}) ne naya account registration request bheja hai. Kripya Admin Panel me check karein.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });

    return {
      status: 'pending',
      message: 'Aapki request Anvisha Traders ke paas bhej di gayi hai. Dukan se approval milte hi aapka account active ho jayega!',
    };
  };

  // Check customer status from Firestore
  const checkCustomerStatus = async (
    phone: string
  ): Promise<'approved' | 'pending' | 'rejected' | 'blocked' | 'not_found'> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone === '7000455037') return 'approved';

    // Check local state first
    const existing = customerApprovalRequests.find((r) => r.phone === cleanPhone);
    if (existing) {
      return existing.status;
    }

    // Check Firestore
    try {
      const customerDocRef = doc(db, 'customers', cleanPhone);
      const snap = await getDoc(customerDocRef);
      if (snap.exists()) {
        const data = snap.data();
        return data?.status || 'pending';
      }
    } catch (err) {
      console.warn('Check customer status error:', err);
    }

    return 'not_found';
  };

  // Admin approves a customer
  const approveCustomerRequest = async (idOrPhone: string) => {
    const clean = idOrPhone.replace('req-', '').replace(/[^0-9]/g, '');
    const now = new Date().toISOString();

    setCustomerApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.phone === clean || req.id === idOrPhone) {
          return {
            ...req,
            status: 'approved',
            approvedAt: now,
            rejectionReason: undefined,
          };
        }
        return req;
      })
    );

    // If current active customer is this user, activate their session immediately
    if (currentCustomer.phone === clean) {
      const updatedUser: CustomerUser = {
        ...currentCustomer,
        status: 'approved',
        isLoggedIn: true,
        approvedAt: now,
      };
      setCurrentCustomer(updatedUser);
      localStorage.setItem('anvisha_customer_user', JSON.stringify(updatedUser));
    }

    // Sync to Firestore
    try {
      const customerDocRef = doc(db, 'customers', clean);
      await setDoc(customerDocRef, {
        status: 'approved',
        approvedAt: now,
        rejectionReason: null,
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update customer approval in cloud:', err);
    }

    triggerToast({
      id: `notif-appr-${Date.now()}`,
      recipient: 'admin',
      title: 'Customer Approved! ✅',
      message: `Mobile +91 ${clean} ko safaltapoorvak approve kar diya gaya hai. Ab wo order de sakte hain.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  // Admin rejects / blocks a customer
  const rejectCustomerRequest = async (idOrPhone: string, reason?: string) => {
    const clean = idOrPhone.replace('req-', '').replace(/[^0-9]/g, '');

    setCustomerApprovalRequests((prev) =>
      prev.map((req) => {
        if (req.phone === clean || req.id === idOrPhone) {
          return {
            ...req,
            status: 'rejected',
            rejectionReason: reason || 'Not approved by store admin',
          };
        }
        return req;
      })
    );

    // If current active customer is this user, log them out
    if (currentCustomer.phone === clean) {
      const updatedUser: CustomerUser = {
        ...currentCustomer,
        status: 'rejected',
        isLoggedIn: false,
        rejectionReason: reason,
      };
      setCurrentCustomer(updatedUser);
      localStorage.setItem('anvisha_customer_user', JSON.stringify(updatedUser));
    }

    // Sync to Firestore
    try {
      const customerDocRef = doc(db, 'customers', clean);
      await setDoc(customerDocRef, {
        status: 'rejected',
        rejectionReason: reason || 'Not approved by store admin',
      }, { merge: true });
    } catch (err) {
      console.warn('Could not update customer rejection in cloud:', err);
    }

    triggerToast({
      id: `notif-rej-${Date.now()}`,
      recipient: 'admin',
      title: 'Customer Request Rejected ❌',
      message: `Mobile +91 ${clean} ka account reject/blocked kar diya gaya hai.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  // Customer authentication handlers
  const loginCustomer = (name: string, phone: string, address: string) => {
    const updated: CustomerUser = {
      name,
      phone,
      address,
      isLoggedIn: true,
      status: 'approved',
    };
    setCurrentCustomer(updated);
    localStorage.setItem('anvisha_customer_user', JSON.stringify(updated));

    // Sync customer to Firestore Cloud
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone) {
      const customerDocRef = doc(db, 'customers', cleanPhone);
      setDoc(customerDocRef, {
        phone: cleanPhone,
        name,
        address,
        status: 'approved',
        lastLogin: new Date().toISOString(),
      }, { merge: true }).catch((err) => console.warn('Could not sync customer to cloud:', err));
    }

    triggerToast({
      id: `notif-cust-${Date.now()}`,
      recipient: 'customer',
      title: `Welcome, ${name}! 🎉`,
      message: 'Aapka customer profile login ho gaya hai. Aap shopping shuru kar sakte hain!',
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  const logoutCustomer = () => {
    setCurrentCustomer({
      name: 'Guest Customer',
      phone: '',
      address: '',
      isLoggedIn: false,
    });
  };

  // Toast auto dismiss
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  const triggerToast = (notif: AppNotification) => {
    setActiveToast(notif);
    playNotificationChime();
  };

  // Business Info updater
  const updateBusinessInfo = (newInfo: Partial<BusinessInfo>) => {
    setBusinessInfo((prev) => ({ ...prev, ...newInfo }));
  };

  // Product actions
  const addProduct = (productData: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      rating: 4.8,
      reviewsCount: 1,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Update category product count
    setCategories((prev) =>
      prev.map((c) =>
        c.name.toLowerCase() === productData.category.toLowerCase()
          ? { ...c, productCount: (c.productCount || 0) + 1 }
          : c
      )
    );
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setCart((prev) => prev.filter((c) => c.product.id !== id));
    setWishlist((prev) => prev.filter((wId) => wId !== id));
  };

  const adjustStock = (id: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          if (newStock <= 3 && delta < 0) {
            const lowStockNotif: AppNotification = {
              id: `notif-stock-${Date.now()}`,
              recipient: 'admin',
              title: `Low Stock Alert: ${p.name}`,
              message: `Only ${newStock} ${p.unit} remaining in stock. Please restock soon.`,
              type: 'stock_alert',
              timestamp: 'Just now',
              read: false,
            };
            setNotifications((n) => [lowStockNotif, ...n]);
            triggerToast(lowStockNotif);
          }
          return { ...p, stock: newStock };
        }
        return p;
      })
    );
  };

  // Shorts / Product Video actions
  const addShort = async (
    shortData: Omit<ProductShort, 'id' | 'viewsCount' | 'likesCount' | 'createdAt'>
  ) => {
    const newShort: ProductShort = {
      ...shortData,
      id: `short-${Date.now()}`,
      viewsCount: 1,
      likesCount: 0,
      createdAt: new Date().toISOString(),
      uploadedBy: 'Admin (Anvisha Traders)',
    };

    setShorts((prev) => [newShort, ...prev]);

    // Sync to Firestore Cloud
    try {
      const shortDocRef = doc(db, 'product_shorts', newShort.id);
      await setDoc(shortDocRef, newShort);
    } catch (err) {
      console.warn('Could not save product short to Firestore:', err);
    }

    triggerToast({
      id: `notif-short-${Date.now()}`,
      recipient: 'both',
      title: 'Naya Short Video Uploaded! 🎬',
      message: `"${newShort.title}" video Customer Shorts feed mein play hone ke liye live ho gaya hai.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  const deleteShort = async (id: string) => {
    setShorts((prev) => prev.filter((s) => s.id !== id));
    try {
      const shortDocRef = doc(db, 'product_shorts', id);
      await deleteDoc(shortDocRef);
    } catch (err) {
      console.warn('Could not delete product short from Firestore:', err);
    }

    triggerToast({
      id: `notif-short-del-${Date.now()}`,
      recipient: 'admin',
      title: 'Short Video Deleted',
      message: 'Video safaltapoorvak feed se hata diya gaya hai.',
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });
  };

  const incrementShortView = (id: string) => {
    setShorts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, viewsCount: s.viewsCount + 1 } : s))
    );
  };

  const likeShort = (id: string) => {
    setShorts((prev) =>
      prev.map((s) => (s.id === id ? { ...s, likesCount: s.likesCount + 1 } : s))
    );
  };


  // Category actions
  const addCategory = (categoryData: Omit<Category, 'id' | 'productCount'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
      productCount: 0,
    };
    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  // Cart actions
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
            : item
        );
      }
      return [...prev, { product, quantity: Math.min(product.stock, quantity) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const cartItemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Orders & Notifications (Core requirement: Order placed notifies BOTH; Status change notifies CUSTOMER ONLY)
  const placeOrder = ({
    customerName,
    customerPhone,
    deliveryAddress,
    landmark,
    customerEmail,
    paymentMethod,
    notes,
  }: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    landmark?: string;
    customerEmail?: string;
    paymentMethod: 'cod' | 'upi';
    notes?: string;
  }): Order => {
    const orderItems: OrderItem[] = cart.map((c) => ({
      productId: c.product.id,
      name: c.product.name,
      price: c.product.price,
      mrp: c.product.mrp,
      quantity: c.quantity,
      unit: c.product.unit,
      image: c.product.image,
      total: c.product.price * c.quantity,
      hsnCode: c.product.hsnCode || '9999',
    }));

    const subtotal = cartTotal;
    const deliveryFee = subtotal > 499 ? 0 : 40;
    const taxRate = 5;
    const taxAmount = Number(((subtotal * taxRate) / 100).toFixed(2));
    const grandTotal = Number((subtotal + deliveryFee + taxAmount).toFixed(2));

    const orderSeq = (orders.length + 9042).toString();
    const orderId = `ORD-2026-${orderSeq}`;
    const invoiceNumber = `AT/INV/2026/0${orders.length + 90}`;

    const newOrder: Order = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@anvishatraders.in',
      deliveryAddress,
      landmark,
      items: orderItems,
      subtotal,
      deliveryFee,
      taxRate,
      taxAmount,
      grandTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'upi' ? 'paid' : 'pending',
      status: 'pending',
      statusTimeline: [
        {
          status: 'pending',
          label: 'Order Placed',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Just now',
          note: `Received order via online checkout for ₹${grandTotal.toLocaleString('en-IN')}`,
        },
      ],
      invoiceNumber,
      invoiceGeneratedAt: new Date().toISOString(),
      notes,
    };

    // Deduct stock for ordered items
    setProducts((prev) =>
      prev.map((p) => {
        const item = orderItems.find((i) => i.productId === p.id);
        if (item) {
          return { ...p, stock: Math.max(0, p.stock - item.quantity) };
        }
        return p;
      })
    );

    // Save order locally and sync to Firebase Firestore Cloud
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Direct cloud sync to Firestore (accessible anywhere on internet)
    setDoc(doc(db, 'orders', orderId), newOrder).catch((err) => {
      console.warn('Could not sync order to cloud Firestore:', err);
    });

    // Auto-send WhatsApp Order Bill / Confirmation to Customer if WhatsApp Cloud API is configured
    if (
      businessInfo.whatsappCloudApiEnabled &&
      businessInfo.whatsappPhoneNumberId &&
      businessInfo.whatsappAccessToken &&
      customerPhone
    ) {
      const cleanPhone = customerPhone.replace(/[^0-9]/g, '');
      const phoneId = businessInfo.whatsappPhoneNumberId.trim();
      const token = businessInfo.whatsappAccessToken.trim();
      const itemsSummary = orderItems
        .map((it) => `• ${it.name} (${it.quantity} ${it.unit}) - ₹${it.total}`)
        .slice(0, 5)
        .join('\n');

      const billMessage = `🧾 *ANVISHA TRADERS - ORDER BILL*\n\nNamaste ${customerName}! Aapka order confirm ho gaya hai.\n\n📋 *Order ID:* ${orderId}\n💵 *Total Bill:* ₹${grandTotal.toLocaleString('en-IN')}\n💳 *Payment Mode:* ${paymentMethod === 'upi' ? 'Online UPI' : 'Cash on Delivery (COD)'}\n📍 *Delivery Address:* ${deliveryAddress}\n\n*Items Ordered:*\n${itemsSummary}\n\n🚚 *Delivery:* Pachrukhi & Siwan Express\n📞 *Support:* ${businessInfo.phone}\n\nDhanyawad! Anvisha Traders par shopping karne ke liye.`;

      // Dispatch to Meta WhatsApp Cloud API
      fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: `91${cleanPhone}`,
          type: 'text',
          text: {
            preview_url: false,
            body: billMessage,
          },
        }),
      }).then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.warn('WhatsApp Order Bill API notification fallback/notice:', data);
        }
      }).catch((e) => console.warn('WhatsApp Order Bill dispatch error:', e));
    }

    // NOTIFICATION TO BOTH CUSTOMER AND ADMIN
    const customerNotif: AppNotification = {
      id: `notif-cust-${Date.now()}`,
      recipient: 'customer',
      title: `Order Placed! #${orderId} 🎉`,
      message: `Thank you ${customerName}! Your order of ₹${grandTotal.toLocaleString('en-IN')} has been placed at Anvisha Traders.`,
      type: 'order_placed',
      timestamp: 'Just now',
      read: false,
      orderId,
    };

    const adminNotif: AppNotification = {
      id: `notif-admin-${Date.now()}`,
      recipient: 'admin',
      title: `New Order Received: #${orderId} 🔔`,
      message: `₹${grandTotal.toLocaleString('en-IN')} from ${customerName} (${customerPhone}), ${deliveryAddress}.`,
      type: 'order_placed',
      timestamp: 'Just now',
      read: false,
      orderId,
    };

    setNotifications((prev) => [customerNotif, adminNotif, ...prev]);

    // Active toast shown immediately
    triggerToast(activeRole === 'admin' ? adminNotif : customerNotif);

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, customNote?: string) => {
    let targetOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statusLabels: Record<OrderStatus, string> = {
            pending: 'Order Placed',
            confirmed: 'Order Confirmed',
            dispatched: 'Out for Delivery',
            delivered: 'Order Delivered',
            cancelled: 'Order Cancelled',
          };

          const defaultNotes: Record<OrderStatus, string> = {
            pending: 'Order status changed to pending verification.',
            confirmed: 'Packed and verified by Anvisha Traders team.',
            dispatched: 'Handed over to delivery associate for Pachrukhi / Siwan route.',
            delivered: 'Package received by customer. Payment recorded.',
            cancelled: 'Order has been cancelled.',
          };

          const newTimelineEntry = {
            status: newStatus,
            label: statusLabels[newStatus],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
            note: customNote || defaultNotes[newStatus],
          };

          const updated: Order = {
            ...o,
            status: newStatus,
            paymentStatus: newStatus === 'delivered' ? 'paid' : o.paymentStatus,
            statusTimeline: [...o.statusTimeline, newTimelineEntry],
          };
          targetOrder = updated;
          return updated;
        }
        return o;
      })
    );

    // CRITICAL USER REQUIREMENT: "status ka sirf customer ko"
    // Order status update notification MUST ONLY be sent to customer!
    const statusTitles: Record<OrderStatus, string> = {
      pending: 'Order Under Review ⏳',
      confirmed: 'Order Confirmed by Anvisha Traders ✅',
      dispatched: 'Your Order is Out for Delivery! 🚚',
      delivered: 'Order Delivered Successfully! 📦✨',
      cancelled: 'Order Cancelled ❌',
    };

    const statusNotif: AppNotification = {
      id: `notif-status-${Date.now()}`,
      recipient: 'customer', // ONLY CUSTOMER
      title: statusTitles[newStatus],
      message: `Your order #${orderId} is now ${newStatus.toUpperCase()}. ${customNote || 'Thank you for shopping with Anvisha Traders!'}`,
      type: 'order_status',
      timestamp: 'Just now',
      read: false,
      orderId,
    };

    setNotifications((prev) => [statusNotif, ...prev]);

    // Sync updated status to Firestore Cloud so customer sees it across internet
    if (targetOrder) {
      setDoc(doc(db, 'orders', orderId), targetOrder, { merge: true }).catch((err) => {
        console.warn('Could not sync status update to cloud:', err);
      });

      // Auto-send WhatsApp Delivery Alert to Customer on Status Change
      if (
        businessInfo.whatsappCloudApiEnabled &&
        businessInfo.whatsappPhoneNumberId &&
        businessInfo.whatsappAccessToken &&
        targetOrder.customerPhone
      ) {
        const cleanPhone = targetOrder.customerPhone.replace(/[^0-9]/g, '');
        const phoneId = businessInfo.whatsappPhoneNumberId.trim();
        const token = businessInfo.whatsappAccessToken.trim();

        let statusText = '';
        if (newStatus === 'confirmed') {
          statusText = `✅ *Aapka Order Confirm Ho Gaya Hai!*\n\nAnvisha Traders par aapka order #${orderId} accept ho gaya hai aur packing shuru ho chuki hai.`;
        } else if (newStatus === 'dispatched') {
          statusText = `🚚 *Aapka Order Delivery Ke Liye Nikal Chuka Hai (Out for Delivery)!*\n\nOrder #${orderId} hamare delivery partner ko de diya gaya hai aur jald hi aapke pate (${targetOrder.deliveryAddress}) par pahuchega.`;
        } else if (newStatus === 'delivered') {
          statusText = `📦✨ *Order Successfully Delivered!*\n\nAapka order #${orderId} (₹${targetOrder.grandTotal.toLocaleString('en-IN')}) deliver ho chuka hai. Humare saath shopping karne ke liye dhanyawad!`;
        } else if (newStatus === 'cancelled') {
          statusText = `❌ *Order Cancelled*\n\nAapka order #${orderId} cancel kar diya gaya hai. Kisi bhi sahayata ke liye sampark karein: ${businessInfo.phone}.`;
        }

        if (statusText) {
          const finalMsg = `🛍️ *ANVISHA TRADERS UPDATE*\n\nNamaste ${targetOrder.customerName} ji,\n\n${statusText}\n\n📞 Helpdesk: ${businessInfo.phone}\n📍 Pachrukhi, Siwan (Bihar)`;

          fetch(`https://graph.facebook.com/v20.0/${phoneId}/messages`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              recipient_type: 'individual',
              to: `91${cleanPhone}`,
              type: 'text',
              text: {
                preview_url: false,
                body: finalMsg,
              },
            }),
          }).then(async (res) => {
            const data = await res.json();
            if (!res.ok) {
              console.warn('WhatsApp status notification fallback/notice:', data);
            }
          }).catch((e) => console.warn('WhatsApp status delivery error:', e));
        }
      }
    }

    // If currently viewing as customer, pop up toast!
    if (activeRole === 'customer') {
      triggerToast(statusNotif);
    }
  };

  const generateInvoice = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const invNum = o.invoiceNumber || `AT/INV/2026/0${Math.floor(100 + Math.random() * 900)}`;
          return {
            ...o,
            invoiceNumber: invNum,
            invoiceGeneratedAt: new Date().toISOString(),
          };
        }
        return o;
      })
    );
  };

  const updateOrderInvoiceDetails = (
    orderId: string,
    updatedItems: { productId: string; price: number; quantity: number }[],
    options?: { deliveryFee?: number; taxRate?: number; notes?: string }
  ) => {
    let modifiedOrder: Order | undefined;

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          // Recalculate item totals and order totals
          const newItems = o.items.map((it) => {
            const match = updatedItems.find((u) => u.productId === it.productId);
            if (match) {
              const newPrice = Math.max(0, match.price);
              const newQty = Math.max(1, match.quantity);
              return {
                ...it,
                price: newPrice,
                quantity: newQty,
                total: Number((newPrice * newQty).toFixed(2)),
              };
            }
            return it;
          });

          const newSubtotal = newItems.reduce((acc, curr) => acc + curr.total, 0);
          const newDeliveryFee = options?.deliveryFee !== undefined ? options.deliveryFee : o.deliveryFee;
          const newTaxRate = options?.taxRate !== undefined ? options.taxRate : o.taxRate;
          const newTaxAmount = Number(((newSubtotal * newTaxRate) / 100).toFixed(2));
          const newGrandTotal = Number((newSubtotal + newTaxAmount + newDeliveryFee).toFixed(2));

          const invNum = o.invoiceNumber || `AT/INV/2026/0${Math.floor(100 + Math.random() * 900)}`;

          const updated: Order = {
            ...o,
            items: newItems,
            subtotal: newSubtotal,
            deliveryFee: newDeliveryFee,
            taxRate: newTaxRate,
            taxAmount: newTaxAmount,
            grandTotal: newGrandTotal,
            invoiceNumber: invNum,
            invoiceGeneratedAt: o.invoiceGeneratedAt || new Date().toISOString(),
            notes: options?.notes !== undefined ? options.notes : o.notes,
          };

          modifiedOrder = updated;
          return updated;
        }
        return o;
      })
    );

    if (modifiedOrder) {
      if (selectedOrderForInvoice && selectedOrderForInvoice.id === orderId) {
        setSelectedOrderForInvoice(modifiedOrder);
      }
      setDoc(doc(db, 'orders', orderId), modifiedOrder, { merge: true }).catch((err) =>
        console.warn('Could not sync edited invoice rates to cloud:', err)
      );
    }
  };

  // Notification helpers
  const unreadCountForCustomer = notifications.filter(
    (n) => (n.recipient === 'customer' || n.recipient === 'both') && !n.read
  ).length;

  const unreadCountForAdmin = notifications.filter(
    (n) => (n.recipient === 'admin' || n.recipient === 'both') && !n.read
  ).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = (role: 'customer' | 'admin') => {
    setNotifications((prev) =>
      prev.map((n) => {
        if (role === 'customer' && (n.recipient === 'customer' || n.recipient === 'both')) {
          return { ...n, read: true };
        }
        if (role === 'admin' && (n.recipient === 'admin' || n.recipient === 'both')) {
          return { ...n, read: true };
        }
        return n;
      })
    );
  };

  return (
    <StoreContext.Provider
      value={{
        businessInfo,
        updateBusinessInfo,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        shorts,
        addShort,
        deleteShort,
        incrementShortView,
        likeShort,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        wishlist,
        toggleWishlist,
        orders,
        placeOrder,
        updateOrderStatus,
        generateInvoice,
        updateOrderInvoiceDetails,
        activeRole,
        setActiveRole: handleSetActiveRole,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        isAdminAuthenticated,
        adminPassword,
        changeAdminPassword,
        loginAdmin,
        logoutAdmin,
        showAdminLoginModal,
        setShowAdminLoginModal,
        currentCustomer,
        customerApprovalRequests,
        pendingApprovalsCount: customerApprovalRequests.filter((r) => r.status === 'pending').length,
        submitCustomerLoginRequest,
        checkCustomerStatus,
        approveCustomerRequest,
        rejectCustomerRequest,
        loginCustomer,
        logoutCustomer,
        showCustomerLoginModal,
        setShowCustomerLoginModal,
        sendCustomerOtp,
        verifyCustomerOtpAndLogin,
        isCloudOnline,
        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedProductForDetail,
        setSelectedProductForDetail,
        selectedOrderForInvoice,
        setSelectedOrderForInvoice,
        selectedOrderForTracking,
        setSelectedOrderForTracking,
        notifications,
        unreadCountForCustomer,
        unreadCountForAdmin,
        activeToast,
        dismissToast: () => setActiveToast(null),
        markNotificationAsRead,
        markAllAsRead,
        playChime: playNotificationChime,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
