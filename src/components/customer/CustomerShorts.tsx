import React, { useState } from 'react';
import { Eye, Heart, Play, ShoppingBag, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const CustomerShorts: React.FC = () => {
  const { products, addToCart, setSelectedProductForDetail } = useStore();
  const [activeSegment, setActiveSegment] = useState<'foryou' | 'popular'>('foryou');

  const showcaseProducts = activeSegment === 'foryou'
    ? products
    : [...products].sort((a, b) => b.reviewsCount - a.reviewsCount);

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3">
      {/* Segmented control matching screen 2 in the screenshot */}
      <div className="flex items-center justify-center mb-5">
        <div className="p-1 bg-neutral-200/80 rounded-full flex items-center gap-1 w-full max-w-xs shadow-inner">
          <button
            onClick={() => setActiveSegment('foryou')}
            className={`flex-1 py-1.5 px-4 text-xs font-bold rounded-full transition-all text-center ${
              activeSegment === 'foryou'
                ? 'bg-[#ff5722] text-white shadow-md shadow-orange-500/30'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            For you
          </button>
          <button
            onClick={() => setActiveSegment('popular')}
            className={`flex-1 py-1.5 px-4 text-xs font-bold rounded-full transition-all text-center ${
              activeSegment === 'popular'
                ? 'bg-[#ff5722] text-white shadow-md shadow-orange-500/30'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            Popular
          </button>
        </div>
      </div>

      {/* 2-column reel cards matching the reference image */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {showcaseProducts.map((product, idx) => (
          <div
            key={product.id}
            onClick={() => setSelectedProductForDetail(product)}
            className="group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200/50 shadow-sm cursor-pointer aspect-[3/4] flex flex-col justify-between p-3"
          >
            {/* Background image preview */}
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
            />

            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

            {/* Top row with Play button icon */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-200 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full">
                {product.category}
              </span>
              <div className="w-8 h-8 rounded-full bg-[#ff5722] text-white flex items-center justify-center shadow-md">
                <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom details with view count and buy button */}
            <div className="relative z-10">
              <div className="flex items-center gap-1 text-[11px] font-medium text-white/90 mb-1">
                <Eye className="w-3.5 h-3.5 text-neutral-300" />
                <span className="tabular-nums">{(product.reviewsCount / 1000).toFixed(1)}k views</span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1 leading-snug drop-shadow-sm">
                {product.name}
              </h4>

              <div className="mt-1 flex items-center justify-between">
                <span className="text-xs font-semibold text-white/90">
                  {product.unit} · {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(product, 1);
                  }}
                  className="px-2.5 py-1 bg-white text-neutral-900 hover:bg-[#ff5722] hover:text-white rounded-lg text-[11px] font-bold transition-colors shadow-xs"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
