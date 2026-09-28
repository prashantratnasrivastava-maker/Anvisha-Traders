import React from 'react';
import {
  Heart,
  Plus,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const CustomerHome: React.FC = () => {
  const {
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setCustomerTab,
    addToCart,
    wishlist,
    toggleWishlist,
    setSelectedProductForDetail,
    businessInfo,
    currentCustomer,
    setShowCustomerLoginModal,
  } = useStore();

  // Filter products by search and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.tags && product.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesCategory =
      !selectedCategorySlug ||
      categories.find((c) => c.slug === selectedCategorySlug)?.name.toLowerCase() ===
        product.category.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3">
      {/* Hero Promotional Banner - Controlled by Admin with ON/OFF switch & custom offer copy */}
      {(businessInfo.offersEnabled ?? true) && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#ffe0cc] via-[#ffd2be] to-[#ffb396] p-6 shadow-sm border border-orange-200/60 mb-5 animate-in fade-in duration-200">
          <div className="relative z-10 max-w-[65%]">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-neutral-800 text-[11px] font-bold mb-2 shadow-xs">
              <span className="text-[#ff5722]">★</span>
              <span>{businessInfo.offerTag || `${businessInfo.name} Special Offer`}</span>
              {businessInfo.offerDiscountPercent ? (
                <span className="bg-[#ff5722] text-white text-[10px] px-1.5 py-0.2 rounded-full font-black ml-0.5">
                  {businessInfo.offerDiscountPercent}% OFF
                </span>
              ) : null}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight font-display text-balance">
              {businessInfo.offerHeading || 'Explore Complete Catalog & Collections'}
            </h2>
            <p className="text-xs text-neutral-700 mt-1 line-clamp-2">
              {businessInfo.offerSubheading || 'Quality clothing, fresh grocery & authentic spices delivered right in Pachrukhi & Siwan.'}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedCategorySlug(null);
                  const el = document.getElementById('product-catalog');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/30 transition-transform active:scale-95 whitespace-nowrap"
              >
                {businessInfo.offerButtonText || 'Explore Catalog'}
              </button>
              <span className="text-[11px] font-semibold text-neutral-700 hidden sm:inline">
                Fast Doorstep Delivery in Pachrukhi &amp; Siwan
              </span>
            </div>
          </div>

          {/* Decorative 3D Cart / Gift graphic inspired by reference screenshot */}
          <div className="absolute right-2 -bottom-2 sm:right-6 sm:bottom-2 w-32 h-32 sm:w-44 sm:h-44 pointer-events-none flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Soft decorative background circles */}
              <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-xs scale-90" />
              <svg
                viewBox="0 0 100 100"
                className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Basket */}
                <rect x="25" y="38" width="50" height="35" rx="6" fill="#ffffff" opacity="0.9" />
                <path
                  d="M30 42 H70 M30 50 H70 M30 58 H70 M30 66 H70 M38 38 V73 M48 38 V73 M58 38 V73 M68 38 V73"
                  stroke="#ff7043"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M20 32 L27 38 H75 L82 25"
                  stroke="#d84315"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="35" cy="78" r="5" fill="#37474f" />
                <circle cx="65" cy="78" r="5" fill="#37474f" />
                {/* Floating gifts */}
                <rect x="35" y="24" width="16" height="16" rx="2" fill="#ff5722" transform="rotate(-8 43 32)" />
                <rect x="52" y="20" width="18" height="18" rx="2" fill="#ffd54f" transform="rotate(12 61 29)" />
                <circle cx="48" cy="18" r="4" fill="#ffab91" />
                <circle cx="28" cy="22" r="3" fill="#ffecb3" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Quick Action Pill Tags - Exact match to the reference screenshot row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none no-scrollbar">
        {/* Customer Login Pill button */}
        <button
          onClick={() => setShowCustomerLoginModal(true)}
          className="px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap bg-orange-100 hover:bg-orange-200 text-[#d84315] border border-orange-300/80 transition-all shrink-0 flex items-center gap-1.5 shadow-2xs"
          title="Customer Login with Mobile & OTP"
        >
          <User className="w-3.5 h-3.5" />
          <span>{currentCustomer.isLoggedIn ? `Logged in: ${currentCustomer.name.split(' ')[0]}` : 'Customer Login'}</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategorySlug(null);
          }}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
            selectedCategorySlug === null
              ? 'bg-[#ff5722] text-white shadow-sm shadow-orange-500/20'
              : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
          }`}
        >
          Keep Shopping
        </button>

        <button
          onClick={() => setCustomerTab('cart')}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-all shrink-0"
        >
          Cart
        </button>

        <button
          onClick={() => setCustomerTab('orders')}
          className="px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200 transition-all shrink-0"
        >
          Buy Again
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() =>
              setSelectedCategorySlug(selectedCategorySlug === cat.slug ? null : cat.slug)
            }
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
              selectedCategorySlug === cat.slug
                ? 'bg-[#ff5722] text-white shadow-sm shadow-orange-500/20'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Catalog Title & Section Header */}
      <div id="product-catalog" className="flex items-center justify-between mt-5 mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-neutral-900 tracking-tight font-display">
            {selectedCategorySlug
              ? categories.find((c) => c.slug === selectedCategorySlug)?.name
              : "Featured Products & Deals"}
          </h3>
          <p className="text-[11px] text-neutral-500">
            {filteredProducts.length} items available in store
          </p>
        </div>
        <button
          onClick={() => setSelectedCategorySlug(null)}
          className="text-xs font-semibold text-[#ff5722] hover:underline"
        >
          See all
        </button>
      </div>

      {/* 2-Column Product Grid - Exactly matching the reference screenshot cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {filteredProducts.map((product) => {
          const isWishlisted = wishlist.includes(product.id);

          return (
            <div
              key={product.id}
              className="group bg-white rounded-2xl p-2.5 border border-neutral-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative"
            >
              {/* Image Container with Wishlist Heart */}
              <div
                className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-50 cursor-pointer"
                onClick={() => setSelectedProductForDetail(product)}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />

                {/* Wishlist button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-xs transition-colors"
                  title="Add to Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isWishlisted ? 'fill-red-500 text-red-500' : ''
                    }`}
                  />
                </button>

                {/* Floating Orange Add to Cart Button (matches reference image circle) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                  disabled={product.stock <= 0}
                  className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-[#ff5722] hover:bg-[#f4511e] text-white flex items-center justify-center shadow-md shadow-orange-500/30 transition-transform active:scale-90 disabled:opacity-50"
                  title="Add to Cart / Order List"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Stock alert pill if low */}
                {product.stock <= 5 && product.stock > 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                    {product.stock} left
                  </span>
                )}
                {product.stock <= 0 && (
                  <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-neutral-900 text-white px-2 py-0.5 rounded-full shadow-xs">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="pt-2 flex flex-col flex-1 justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                    <span>{product.category}</span>
                    <span>{product.unit}</span>
                  </div>
                  <h4
                    onClick={() => setSelectedProductForDetail(product)}
                    className="text-xs sm:text-sm font-semibold text-neutral-900 line-clamp-2 leading-snug cursor-pointer hover:text-[#ff5722] transition-colors"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-neutral-500">
                    <span className="flex items-center gap-0.5 font-medium text-amber-600">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {product.rating}
                    </span>
                    <span>·</span>
                    <span className="tabular-nums">{(product.reviewsCount / 1000).toFixed(1)}k ratings</span>
                  </div>
                </div>

                {/* Product Details & Action Link (No Rate, No MRP, No Discount) */}
                <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-neutral-500 truncate">
                    {product.stock > 0 ? (
                      <span className="text-emerald-700 font-semibold">Available In Stock</span>
                    ) : (
                      <span className="text-neutral-400">Out of Stock</span>
                    )}
                  </span>
                  <button
                    onClick={() => setSelectedProductForDetail(product)}
                    className="text-[11px] font-bold text-[#ff5722] hover:text-[#f4511e] flex items-center gap-0.5 shrink-0"
                  >
                    <span>Details</span>
                    <span aria-hidden="true">&rarr;</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200 mt-4 p-8">
          <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-neutral-800">No products found</h4>
          <p className="text-xs text-neutral-500 mt-1">
            Try adjusting your search query or browse all categories.
          </p>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
            }}
            className="mt-4 px-4 py-2 bg-[#ff5722] text-white text-xs font-semibold rounded-xl"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
