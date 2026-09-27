import { BusinessInfo, Category, Order, Product, AppNotification } from '../types';

export const initialBusinessInfo: BusinessInfo = {
  name: 'Anvisha Traders',
  contact: '7000455037',
  address: 'Deepak Complex Bahawani More Pachrukhi, Siwan Bihar (841241)',
  pincode: '841241',
  city: 'Pachrukhi, Siwan',
  state: 'Bihar',
  gstin: '10BHPAR7000A1Z2',
  upiId: '7000455037@ybl',
  tagline: 'Wholesale & Retail General Store, Quality Clothing & Daily Essentials',
  bannerNotice: 'Special Offer: Free delivery across Pachrukhi & Siwan on orders above ₹499!',
};

export const initialCategories: Category[] = [
  {
    id: 'cat-women',
    name: "Women's Wear",
    slug: 'womens-wear',
    icon: 'Sparkles',
    description: 'Designer kurtis, suits, tops and sarees',
    productCount: 4,
  },
  {
    id: 'cat-men',
    name: "Men's Apparel",
    slug: 'mens-apparel',
    icon: 'Shirt',
    description: 'Shirts, polo tees, trousers and sweatshirts',
    productCount: 4,
  },
  {
    id: 'cat-grocery',
    name: 'Grocery & Spices',
    slug: 'grocery-spices',
    icon: 'ShoppingBag',
    description: 'Fresh spices, pulses, cooking oils and grains',
    productCount: 3,
  },
  {
    id: 'cat-dryfruits',
    name: 'Dry Fruits & Nuts',
    slug: 'dry-fruits',
    icon: 'Package',
    description: 'Premium almonds, cashews, raisins and walnuts',
    productCount: 3,
  },
  {
    id: 'cat-home',
    name: 'General & Home',
    slug: 'general-home',
    icon: 'Layers',
    description: 'Daily household essentials and storage goods',
    productCount: 2,
  },
];

// High-fidelity SVG product graphics with rich colors matching the reference screenshot style
const createProductSvg = (title: string, sub: string, bgGradient: string, iconType: string) => {
  const encoded = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          ${bgGradient}
        </linearGradient>
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.15"/>
        </filter>
      </defs>
      <rect width="400" height="400" fill="url(#bg)"/>
      <circle cx="200" cy="180" r="110" fill="white" opacity="0.4" filter="url(#shadow)"/>
      
      <!-- Render visual shape based on iconType -->
      ${iconType === 'kurti' ? `
        <path d="M150 110 L250 110 L270 240 L240 270 L220 180 L200 280 L180 180 L160 270 L130 240 Z" fill="#e65100" opacity="0.9"/>
        <path d="M185 110 Q200 135 215 110" fill="none" stroke="#fff" stroke-width="4"/>
        <circle cx="200" cy="145" r="4" fill="#fff"/>
        <circle cx="200" cy="160" r="4" fill="#fff"/>
      ` : iconType === 'shirt' ? `
        <path d="M140 120 L170 120 L200 145 L230 120 L260 120 L280 190 L245 200 L245 280 L155 280 L155 200 L120 190 Z" fill="#37474f" opacity="0.85"/>
        <polygon points="170,120 200,150 200,280 196,280 196,150" fill="#cfd8dc"/>
        <circle cx="198" cy="170" r="3" fill="#fff"/>
        <circle cx="198" cy="195" r="3" fill="#fff"/>
      ` : iconType === 'sweatshirt' ? `
        <rect x="145" y="130" width="110" height="130" rx="16" fill="#bf360c" opacity="0.9"/>
        <path d="M145 140 L110 200 L130 210 L150 170" fill="#d84315"/>
        <path d="M255 140 L290 200 L270 210 L250 170" fill="#d84315"/>
        <path d="M180 130 Q200 150 220 130" fill="none" stroke="#fff" stroke-width="4"/>
      ` : iconType === 'spice' ? `
        <rect x="150" y="130" width="100" height="130" rx="10" fill="#ff6f00"/>
        <rect x="160" y="150" width="80" height="70" rx="6" fill="#fff9c4"/>
        <text x="200" y="190" font-family="sans-serif" font-size="16" font-weight="bold" fill="#e65100" text-anchor="middle">SPICE</text>
        <ellipse cx="200" cy="130" rx="35" ry="12" fill="#e65100"/>
      ` : iconType === 'almonds' ? `
        <ellipse cx="180" cy="180" rx="40" ry="25" fill="#8d6e63" transform="rotate(-30 180 180)"/>
        <ellipse cx="220" cy="180" rx="40" ry="25" fill="#a1887f" transform="rotate(30 220 180)"/>
        <ellipse cx="200" cy="205" rx="35" ry="22" fill="#6d4c41"/>
      ` : `
        <rect x="140" y="140" width="120" height="120" rx="20" fill="#00838f"/>
        <circle cx="200" cy="200" r="30" fill="#e0f7fa"/>
      `}
      
      <rect x="30" y="320" width="340" height="60" rx="12" fill="white" opacity="0.95" filter="url(#shadow)"/>
      <text x="200" y="345" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b" text-anchor="middle">${title}</text>
      <text x="200" y="365" font-family="sans-serif" font-size="12" font-weight="600" fill="#ea580c" text-anchor="middle">${sub}</text>
    </svg>
  `.trim());
  return `data:image/svg+xml;utf8,${encoded}`;
};

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Collar Top & Shorts Casual Set',
    category: "Women's Wear",
    price: 699,
    mrp: 1299,
    stock: 24,
    unit: 'Set',
    description: 'Comfortable summer cotton blend co-ord set with spread collar and elasticated waist shorts. Perfect for casual day outings.',
    image: createProductSvg('Collar Top & Shorts', 'Trending Collection', '<stop offset="0%" stop-color="#ffedd5"/><stop offset="100%" stop-color="#fed7aa"/>', 'kurti'),
    rating: 4.8,
    reviewsCount: 4120,
    isPopular: true,
    isTrending: true,
    tags: ['Co-ord', 'Summer', 'Cotton'],
    hsnCode: '6204',
  },
  {
    id: 'prod-2',
    name: 'Button Layering Silk Blend Shirt',
    category: "Women's Wear",
    price: 849,
    mrp: 1499,
    stock: 18,
    unit: 'Piece',
    description: 'Chic pleat detailed neutral blouse with elegant buttons. Lightweight and versatile for festive or office styling.',
    image: createProductSvg('Button Layering Shirt', 'Premium Silk Blend', '<stop offset="0%" stop-color="#f5f5f4"/><stop offset="100%" stop-color="#e7e5e4"/>', 'kurti'),
    rating: 4.7,
    reviewsCount: 3950,
    isPopular: true,
    tags: ['Blouse', 'Workwear'],
    hsnCode: '6206',
  },
  {
    id: 'prod-3',
    name: 'Unisex Oversized Autumn Sweatshirt',
    category: "Men's Apparel",
    price: 899,
    mrp: 1799,
    stock: 35,
    unit: 'Piece',
    description: 'Heavyweight 320 GSM fleece fleece sweatshirt with ribbed cuffs and drop shoulder cut. Warm, durable and trendy.',
    image: createProductSvg('Unisex Sweatshirt', 'Warm Fleece 320 GSM', '<stop offset="0%" stop-color="#ffedd5"/><stop offset="100%" stop-color="#fdba74"/>', 'sweatshirt'),
    rating: 4.9,
    reviewsCount: 5200,
    isPopular: true,
    isTrending: true,
    tags: ['Winterwear', 'Fleece'],
    hsnCode: '6110',
  },
  {
    id: 'prod-4',
    name: 'Pure Linen Textured Men Casual Shirt',
    category: "Men's Apparel",
    price: 749,
    mrp: 1399,
    stock: 15,
    unit: 'Piece',
    description: '100% breathable organic linen shirt in classic regular fit with mandarin collar. Designed for hot weather comfort.',
    image: createProductSvg('Men Linen Casual Shirt', '100% Breathable Linen', '<stop offset="0%" stop-color="#e0e7ff"/><stop offset="100%" stop-color="#c7d2fe"/>', 'shirt'),
    rating: 4.6,
    reviewsCount: 1840,
    isPopular: true,
    tags: ['Linen', 'Mandarin'],
    hsnCode: '6205',
  },
  {
    id: 'prod-5',
    name: 'Shahi Royal Biryani Masala & Spices',
    category: 'Grocery & Spices',
    price: 180,
    mrp: 240,
    stock: 50,
    unit: 'Packet (200g)',
    description: 'Aromatic whole & ground spice blend with star anise, mace, green cardamom, and clove for authentic Awadhi flavour.',
    image: createProductSvg('Shahi Royal Biryani Masala', 'Aromatic Hand-Ground Spices', '<stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fde68a"/>', 'spice'),
    rating: 4.9,
    reviewsCount: 2900,
    isPopular: true,
    tags: ['Spices', 'Pure Ground'],
    hsnCode: '0910',
  },
  {
    id: 'prod-6',
    name: 'California Jumbo Almonds (Badam Giri)',
    category: 'Dry Fruits & Nuts',
    price: 490,
    mrp: 650,
    stock: 42,
    unit: 'Packet (500g)',
    description: 'Crisp, natural California nonpareil almonds. Rich in vitamin E, protein and healthy fats. Vacuum sealed freshness.',
    image: createProductSvg('California Jumbo Badam', 'Nutrient Rich & Vacuum Sealed', '<stop offset="0%" stop-color="#fae8ff"/><stop offset="100%" stop-color="#f5d0fe"/>', 'almonds'),
    rating: 4.9,
    reviewsCount: 4600,
    isPopular: true,
    isTrending: true,
    tags: ['Dryfruits', 'Healthy'],
    hsnCode: '0802',
  },
  {
    id: 'prod-7',
    name: 'W180 King Size Roasted Salted Cashews',
    category: 'Dry Fruits & Nuts',
    price: 540,
    mrp: 720,
    stock: 28,
    unit: 'Packet (500g)',
    description: 'Grade W180 jumbo cashew nuts lightly roasted with pink Himalayan rock salt. Fresh and crunchy snack.',
    image: createProductSvg('King Roasted Cashews', 'W180 Jumbo Himalayan Salt', '<stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#fef08a"/>', 'almonds'),
    rating: 4.8,
    reviewsCount: 3120,
    tags: ['Kaju', 'Dryfruits'],
    hsnCode: '0801',
  },
  {
    id: 'prod-8',
    name: 'Pure Desi Kacchi Ghani Mustard Oil',
    category: 'Grocery & Spices',
    price: 195,
    mrp: 235,
    stock: 60,
    unit: 'Bottle (1L)',
    description: 'Cold-pressed traditional mustard oil with rich pungent aroma. Ideal for Bihar traditional cooking and pickles.',
    image: createProductSvg('Kacchi Ghani Mustard Oil', 'Cold-Pressed Traditional 1L', '<stop offset="0%" stop-color="#ffedd5"/><stop offset="100%" stop-color="#fed7aa"/>', 'spice'),
    rating: 4.9,
    reviewsCount: 5400,
    isPopular: true,
    tags: ['Cold-pressed', 'Oil'],
    hsnCode: '1514',
  },
  {
    id: 'prod-9',
    name: 'Handcrafted Festive Anarkali Kurta Set',
    category: "Women's Wear",
    price: 1499,
    mrp: 2799,
    stock: 8,
    unit: 'Set',
    description: 'Elegant flair anarkali kurta paired with matching pant and organza dupatta with gota patti borders.',
    image: createProductSvg('Festive Anarkali Kurta Set', 'Gota Patti Work with Dupatta', '<stop offset="0%" stop-color="#ffe4e6"/><stop offset="100%" stop-color="#fecdd3"/>', 'kurti'),
    rating: 4.9,
    reviewsCount: 1620,
    tags: ['Ethnic', 'Festival'],
    hsnCode: '6204',
  },
  {
    id: 'prod-10',
    name: 'Heavy Duty Stainless Steel Kitchen Storage Set',
    category: 'General & Home',
    price: 890,
    mrp: 1450,
    stock: 12,
    unit: 'Set (3 Pcs)',
    description: 'Airtight food-grade stainless steel storage dabbas with see-through acrylic tops. Rust resistant.',
    image: createProductSvg('Steel Storage Canisters', 'Airtight Food Grade Set', '<stop offset="0%" stop-color="#e2e8f0"/><stop offset="100%" stop-color="#cbd5e1"/>', 'general'),
    rating: 4.7,
    reviewsCount: 980,
    tags: ['Kitchen', 'Steel'],
    hsnCode: '7323',
  },
];

export const initialOrders: Order[] = [
  {
    id: 'ORD-2026-9041',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    customerName: 'Prashant Ratna Srivastava',
    customerPhone: '7000455037',
    customerEmail: 'prashantratnasrivastava@gmail.com',
    deliveryAddress: 'Deepak Complex Bahawani More, Pachrukhi, Siwan Bihar',
    landmark: 'Near Bahawani More Temple',
    items: [
      {
        productId: 'prod-1',
        name: 'Collar Top & Shorts Casual Set',
        price: 699,
        mrp: 1299,
        quantity: 1,
        unit: 'Set',
        image: initialProducts[0].image,
        total: 699,
        hsnCode: '6204',
      },
      {
        productId: 'prod-6',
        name: 'California Jumbo Almonds (Badam Giri)',
        price: 490,
        mrp: 650,
        quantity: 2,
        unit: 'Packet (500g)',
        image: initialProducts[5].image,
        total: 980,
        hsnCode: '0802',
      },
    ],
    subtotal: 1679,
    deliveryFee: 0,
    taxRate: 5,
    taxAmount: 83.95,
    grandTotal: 1762.95,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'dispatched',
    statusTimeline: [
      {
        status: 'pending',
        label: 'Order Placed',
        timestamp: new Date(Date.now() - 3600000 * 5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        note: 'Order received at Anvisha Traders.',
      },
      {
        status: 'confirmed',
        label: 'Order Confirmed',
        timestamp: new Date(Date.now() - 3600000 * 4).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        note: 'Verified stock & packed with quality seal.',
      },
      {
        status: 'dispatched',
        label: 'Out for Delivery',
        timestamp: new Date(Date.now() - 3600000 * 1.5).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', Today',
        note: 'Assigned to local delivery associate for Pachrukhi.',
      },
    ],
    invoiceNumber: 'AT/INV/2026/089',
    invoiceGeneratedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    notes: 'Please call before arriving.',
  },
  {
    id: 'ORD-2026-8910',
    createdAt: new Date(Date.now() - 86400000 * 1.5).toISOString(),
    customerName: 'Anil Kumar Yadav',
    customerPhone: '9835214002',
    deliveryAddress: 'Station Road, Pachrukhi Bazaar, Siwan Bihar',
    items: [
      {
        productId: 'prod-3',
        name: 'Unisex Oversized Autumn Sweatshirt',
        price: 899,
        mrp: 1799,
        quantity: 1,
        unit: 'Piece',
        image: initialProducts[2].image,
        total: 899,
        hsnCode: '6110',
      },
      {
        productId: 'prod-5',
        name: 'Shahi Royal Biryani Masala & Spices',
        price: 180,
        mrp: 240,
        quantity: 1,
        unit: 'Packet (200g)',
        image: initialProducts[4].image,
        total: 180,
        hsnCode: '0910',
      },
    ],
    subtotal: 1079,
    deliveryFee: 0,
    taxRate: 5,
    taxAmount: 53.95,
    grandTotal: 1132.95,
    paymentMethod: 'cod',
    paymentStatus: 'paid',
    status: 'delivered',
    statusTimeline: [
      {
        status: 'pending',
        label: 'Order Placed',
        timestamp: 'Yesterday, 10:30 AM',
        note: 'Received via mobile app.',
      },
      {
        status: 'confirmed',
        label: 'Confirmed',
        timestamp: 'Yesterday, 11:00 AM',
        note: 'Packaging done.',
      },
      {
        status: 'dispatched',
        label: 'Dispatched',
        timestamp: 'Yesterday, 02:15 PM',
        note: 'Rider dispatched.',
      },
      {
        status: 'delivered',
        label: 'Delivered',
        timestamp: 'Yesterday, 04:45 PM',
        note: 'Delivered and cash collected.',
      },
    ],
    invoiceNumber: 'AT/INV/2026/088',
    invoiceGeneratedAt: new Date(Date.now() - 86400000 * 1.4).toISOString(),
  },
  {
    id: 'ORD-2026-8802',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    customerName: 'Pooja Kumari',
    customerPhone: '9470123456',
    deliveryAddress: 'Main Chowk near Block Office, Pachrukhi, Siwan',
    items: [
      {
        productId: 'prod-9',
        name: 'Handcrafted Festive Anarkali Kurta Set',
        price: 1499,
        mrp: 2799,
        quantity: 1,
        unit: 'Set',
        image: initialProducts[8].image,
        total: 1499,
        hsnCode: '6204',
      },
    ],
    subtotal: 1499,
    deliveryFee: 0,
    taxRate: 5,
    taxAmount: 74.95,
    grandTotal: 1573.95,
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    status: 'delivered',
    statusTimeline: [
      {
        status: 'delivered',
        label: 'Delivered',
        timestamp: '3 days ago',
        note: 'Order successfully delivered.',
      },
    ],
    invoiceNumber: 'AT/INV/2026/085',
    invoiceGeneratedAt: new Date(Date.now() - 86400000 * 2.8).toISOString(),
  },
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-1',
    recipient: 'customer',
    title: 'Order Out for Delivery! 🚚',
    message: 'Your order #ORD-2026-9041 is on its way to Deepak Complex, Pachrukhi!',
    type: 'order_status',
    timestamp: '1 hour ago',
    read: false,
    orderId: 'ORD-2026-9041',
  },
  {
    id: 'notif-2',
    recipient: 'both',
    title: 'Order Confirmed: #ORD-2026-9041',
    message: 'Anvisha Traders has confirmed order of ₹1,762.95 from Prashant Srivastava.',
    type: 'order_placed',
    timestamp: '4 hours ago',
    read: true,
    orderId: 'ORD-2026-9041',
  },
  {
    id: 'notif-3',
    recipient: 'admin',
    title: 'Low Stock Alert: Handcrafted Festive Kurta ⚠️',
    message: 'Only 8 sets left in stock! Consider restocking soon.',
    type: 'stock_alert',
    timestamp: '5 hours ago',
    read: false,
  },
];
