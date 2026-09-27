import React, { createContext, useContext, useEffect, useState } from 'react';
import { db, testFirestoreConnection } from '../lib/firebase';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  initialBusinessInfo,
  initialCategories,
  initialNotifications,
  initialOrders,
  initialProducts,
} from '../data/initialData';
import {
  AppNotification,
  BusinessInfo,
  CartItem,
  Category,
  CustomerUser,
  Order,
  OrderItem,
  OrderStatus,
  Product,
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

  // Navigation & View
  activeRole: 'customer' | 'admin';
  setActiveRole: (role: 'customer' | 'admin') => void;
  customerTab: 'home' | 'shorts' | 'cart' | 'profile' | 'orders';
  setCustomerTab: (tab: 'home' | 'shorts' | 'cart' | 'profile' | 'orders') => void;
  adminTab: 'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'reports' | 'settings';
  setAdminTab: (tab: 'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'reports' | 'settings') => void;

  // Authentication & Protection
  isAdminAuthenticated: boolean;
  adminPassword?: string;
  changeAdminPassword: (oldPass: string, newPass: string) => { success: boolean; message: string };
  loginAdmin: (phone: string, pass: string) => boolean;
  logoutAdmin: () => void;
  showAdminLoginModal: boolean;
  setShowAdminLoginModal: (show: boolean) => void;

  currentCustomer: CustomerUser;
  loginCustomer: (name: string, phone: string, address: string) => void;
  logoutCustomer: () => void;
  showCustomerLoginModal: boolean;
  setShowCustomerLoginModal: (show: boolean) => void;
  sendCustomerOtp: (phone: string) => Promise<{ success: boolean; otp?: string; message: string }>;
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
    return saved ? JSON.parse(saved) : initialBusinessInfo;
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
        };
  });
  const [showCustomerLoginModal, setShowCustomerLoginModal] = useState(false);

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

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('anvisha_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  // UI state
  const [activeRole, setActiveRole] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<'home' | 'shorts' | 'cart' | 'profile' | 'orders'>('home');
  const [adminTab, setAdminTab] = useState<'dashboard' | 'products' | 'categories' | 'inventory' | 'orders' | 'reports' | 'settings'>('dashboard');

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
    localStorage.setItem('anvisha_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('anvisha_admin_auth', isAdminAuthenticated ? 'true' : 'false');
  }, [isAdminAuthenticated]);

  useEffect(() => {
    localStorage.setItem('anvisha_customer_user', JSON.stringify(currentCustomer));
  }, [currentCustomer]);

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

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      unsubscribeOrders();
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
  const sendCustomerOtp = async (phone: string): Promise<{ success: boolean; otp?: string; message: string }> => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      return { success: false, message: 'Kripya sahi 10-digit mobile number enter karein.' };
    }

    // Generate authentic 6-digit random verification code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // valid for 5 mins

    setActiveGeneratedOtps((prev) => ({
      ...prev,
      [cleanPhone]: { otp: generatedOtp, expiresAt },
    }));

    // Trigger instant on-screen notification & chime
    playNotificationChime();
    triggerToast({
      id: `notif-otp-${Date.now()}`,
      recipient: 'customer',
      title: `📩 OTP Sent to +91 ${cleanPhone}`,
      message: `Anvisha Traders verification code is ${generatedOtp}. Do not share it with anyone.`,
      type: 'system',
      timestamp: 'Just now',
      read: false,
    });

    return {
      success: true,
      otp: generatedOtp,
      message: `OTP safaltapoorvak mobile number +91 ${cleanPhone} par bhej diya gaya hai!`,
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

    // Master OTP bypass for owner number or valid generated code
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

  // Customer authentication handlers
  const loginCustomer = (name: string, phone: string, address: string) => {
    const updated = {
      name,
      phone,
      address,
      isLoggedIn: true,
    };
    setCurrentCustomer(updated);
    triggerToast({
      id: `notif-cust-${Date.now()}`,
      recipient: 'customer',
      title: `Welcome, ${name}!`,
      message: 'Aapka customer profile login ho gaya hai.',
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
