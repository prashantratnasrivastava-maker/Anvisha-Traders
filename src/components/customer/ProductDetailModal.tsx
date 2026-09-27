import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductForDetail,
    setSelectedProductForDetail,
    addToCart,
    setCustomerTab,
    wishlist,
    toggleWishlist,
    businessInfo,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!selectedProductForDetail) return null;

  const product = selectedProductForDetail;
  const isWishlisted = wishlist.includes(product.id);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setSelectedProductForDetail(null);
    }, 600);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setSelectedProductForDetail(null);
    setCustomerTab('cart');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-6 duration-200">
        {/* Sticky modal header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-neutral-100 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
            {product.category}
          </span>
          <button
            onClick={() => setSelectedProductForDetail(null)}
            className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product image */}
        <div className="relative aspect-square w-full bg-neutral-50 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => toggleWishlist(product.id)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-600 hover:text-red-500 shadow-md transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                isWishlisted ? 'fill-red-500 text-red-500' : ''
              }`}
            />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#ff5722] uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span className="text-neutral-500">Unit: {product.unit}</span>
            </div>
            <h3 className="text-lg font-bold text-neutral-900 leading-snug font-display">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-neutral-500">
              <span className="flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {product.rating}
              </span>
              <span>·</span>
              <span className="tabular-nums">{(product.reviewsCount / 1000).toFixed(1)}k ratings</span>
              <span>·</span>
              <span className="text-neutral-700 font-medium">HSN: {product.hsnCode || 'N/A'}</span>
            </div>
          </div>

          {/* Product Specifications & Inventory Details (No Rate / No MRP) */}
          <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Item Specifications
              </span>
              <div className="mt-1 space-y-0.5">
                <p className="text-xs font-semibold text-neutral-800">
                  Unit Pack: <span className="font-bold text-neutral-900">{product.unit}</span>
                </p>
                <p className="text-[11px] text-neutral-500">
                  Tax / HSN: <span className="font-mono text-neutral-700">{product.hsnCode || 'Standard'}</span>
                </p>
              </div>
            </div>

            {/* Stock status indicator */}
            <div className="text-right">
              <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider block">
                Availability
              </span>
              {product.stock > 5 ? (
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1 justify-end mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> In Stock ({product.stock} {product.unit})
                </span>
              ) : product.stock > 0 ? (
                <span className="text-xs font-bold text-amber-600 mt-1 block">
                  Only {product.stock} {product.unit} left!
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 mt-1 block">Out of Stock</span>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-wider mb-1">
              Product Overview &amp; Specifications
            </h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-neutral-100 text-[11px] text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[#ff5722]" />
              <span>Fast Local Delivery in Pachrukhi / Siwan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Genuine Anvisha Quality</span>
            </div>
          </div>

          {/* Quantity selector & Actions */}
          <div className="pt-2 border-t border-neutral-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700">Select Quantity:</span>
              <div className="flex items-center gap-2 bg-neutral-100 rounded-xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center shadow-xs"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs font-bold text-neutral-900 tabular-nums w-6 text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-7 h-7 rounded-lg bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center shadow-xs disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
                className="py-3 px-4 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Zap className="w-4 h-4" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
