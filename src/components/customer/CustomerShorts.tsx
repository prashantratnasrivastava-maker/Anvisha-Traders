import React, { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Heart,
  Play,
  Pause,
  ShoppingBag,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Share2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductShort, Product } from '../../types';

export const CustomerShorts: React.FC = () => {
  const {
    shorts,
    products,
    addToCart,
    setSelectedProductForDetail,
    incrementShortView,
    likeShort,
  } = useStore();

  const [activeSegment, setActiveSegment] = useState<'foryou' | 'popular'>('foryou');
  const [playingShort, setPlayingShort] = useState<ProductShort | null>(null);
  const [isMuted, setIsMuted] = useState(true); // Browsers allow autoplay when muted
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const displayShorts =
    activeSegment === 'foryou'
      ? shorts
      : [...shorts].sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));

  const handleOpenPlayer = (short: ProductShort) => {
    setPlayingShort(short);
    setIsPlaying(true);
    setVideoError(false);
    incrementShortView(short.id);
  };

  useEffect(() => {
    if (playingShort && modalVideoRef.current) {
      modalVideoRef.current.currentTime = 0;
      const playPromise = modalVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Autoplay prevented or video issue:', err);
            setIsPlaying(false);
          });
      }
    }
  }, [playingShort]);

  const handleTogglePlay = () => {
    if (!modalVideoRef.current) return;
    if (modalVideoRef.current.paused) {
      modalVideoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      modalVideoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleLike = (shortId: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (likedMap[shortId]) return;
    setLikedMap((prev) => ({ ...prev, [shortId]: true }));
    likeShort(shortId);
  };

  return (
    <div className="pb-24 max-w-4xl mx-auto px-4 pt-3">
      {/* Segmented control matching screen 2 in the design */}
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

      {/* Shorts Video Feed Grid */}
      {displayShorts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-6">
          <Sparkles className="w-12 h-12 text-[#ff5722] mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">Video Shorts Jaldi Aa Rahe Hain!</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Admin store panel se naye product demo aur unboxing videos upload kar rahe hain.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {displayShorts.map((short) => {
            const linkedProduct = products.find((p) => p.id === short.productId);
            const isLiked = !!likedMap[short.id];

            return (
              <div
                key={short.id}
                onClick={() => handleOpenPlayer(short)}
                className="group relative rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200/50 shadow-sm cursor-pointer aspect-[9/16] flex flex-col justify-between p-3 select-none"
              >
                {/* Background Video Preview or Poster */}
                <video
                  src={short.videoUrl}
                  poster={short.thumbnail}
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/30 pointer-events-none" />

                {/* Top row with Play button icon */}
                <div className="relative z-10 flex items-center justify-between pointer-events-none">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-100 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    Shorts
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#ff5722] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom details with view count and buy button */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between text-[11px] font-medium text-white/90 mb-1">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-300" />
                      <span className="tabular-nums">
                        {short.viewsCount > 999
                          ? `${(short.viewsCount / 1000).toFixed(1)}k`
                          : short.viewsCount}{' '}
                        views
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleLike(short.id, e)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-xs transition-colors ${
                        isLiked
                          ? 'bg-red-500/80 text-white'
                          : 'bg-black/40 text-neutral-300 hover:text-white'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${isLiked ? 'fill-white text-white' : ''}`}
                      />
                      <span>{short.likesCount + (isLiked ? 1 : 0)}</span>
                    </button>
                  </div>

                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 leading-snug drop-shadow-sm">
                    {short.title}
                  </h4>

                  {/* Linked Product Info Bar (Rate hidden in reels as requested) */}
                  {linkedProduct && (
                    <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-between">
                      <div className="min-w-0 pr-1">
                        <span className="text-[11px] text-orange-200 block truncate font-medium">
                          {linkedProduct.name}
                        </span>
                        <span className="text-[10px] text-white/80">
                          {linkedProduct.unit}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(linkedProduct, 1);
                        }}
                        className="px-2.5 py-1 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-[11px] font-bold transition-all shadow-md shrink-0 flex items-center gap-1 active:scale-95"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fullscreen Interactive Video Shorts Player Modal */}
      {playingShort && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-sm h-full max-h-[85vh] bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-neutral-800 animate-in zoom-in-95 duration-150">
            {/* Video Element */}
            <video
              ref={modalVideoRef}
              src={playingShort.videoUrl}
              poster={playingShort.thumbnail}
              autoPlay
              playsInline
              loop
              muted={isMuted}
              onClick={handleTogglePlay}
              onError={(e) => {
                console.warn('Video failed to load:', playingShort.videoUrl, e);
                setVideoError(true);
              }}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            />

            {/* Error or static fallback banner if video link failed */}
            {videoError && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 p-6 text-center z-10">
                <img
                  src={playingShort.thumbnail}
                  alt={playingShort.title}
                  className="w-24 h-24 rounded-2xl object-cover mb-3 border border-white/20 shadow-lg"
                />
                <p className="text-xs text-white/90 font-bold mb-1">Preview Video Unavailable</p>
                <p className="text-[11px] text-neutral-400 max-w-xs mb-3">
                  Aap niche diye button se direct is product ko cart me add kar sakte hain.
                </p>
              </div>
            )}

            {/* Tap to Play / Pause Overlay Icon */}
            {!isPlaying && !videoError && (
              <div
                onClick={handleTogglePlay}
                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer z-10"
              >
                <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
              </div>
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none z-10" />

            {/* Top Navigation & Controls */}
            <div className="relative z-20 p-4 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-bold font-display uppercase tracking-wider text-orange-300">
                  Anvisha Shorts Reel
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setPlayingShort(null)}
                  className="p-2 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Side Floating Interaction Actions (Like, Share, etc.) */}
            <div className="relative z-20 self-end pr-4 pb-24 flex flex-col items-center gap-4">
              <button
                type="button"
                onClick={() => handleLike(playingShort.id)}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div
                  className={`w-11 h-11 rounded-full backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-90 ${
                    likedMap[playingShort.id]
                      ? 'bg-red-500 text-white'
                      : 'bg-black/50 text-white hover:bg-black/70'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      likedMap[playingShort.id] ? 'fill-white text-white' : ''
                    }`}
                  />
                </div>
                <span className="text-[11px] font-bold tabular-nums">
                  {playingShort.likesCount + (likedMap[playingShort.id] ? 1 : 0)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: playingShort.title,
                        text: `Check out this product video from Anvisha Traders, Pachrukhi!`,
                        url: window.location.href,
                      })
                      .catch(() => {});
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Video link copied to clipboard!');
                  }
                }}
                className="flex flex-col items-center gap-1 text-white group"
              >
                <div className="w-11 h-11 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-md flex items-center justify-center transition-transform group-active:scale-90">
                  <Share2 className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-bold">Share</span>
              </button>
            </div>

            {/* Bottom Content & Linked Product Callout */}
            <div className="relative z-20 p-4 space-y-3 text-white">
              <div>
                <h3 className="text-sm font-bold leading-tight font-display">
                  {playingShort.title}
                </h3>
                {playingShort.description && (
                  <p className="text-xs text-neutral-300 mt-1 line-clamp-2">
                    {playingShort.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1.5 text-[11px] text-neutral-400">
                  <span>Anvisha Traders · Pachrukhi, Siwan</span>
                </div>
              </div>

              {/* Linked Product Bar with 1-Click Buy */}
              {playingShort.productId && (
                (() => {
                  const product = products.find((p) => p.id === playingShort.productId);
                  if (!product) return null;

                  return (
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center justify-between gap-3">
                      <div
                        onClick={() => {
                          setPlayingShort(null);
                          setSelectedProductForDetail(product);
                        }}
                        className="flex items-center gap-2.5 min-w-0 cursor-pointer group/item"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-xl object-cover bg-white shrink-0 group-hover/item:scale-105 transition-transform"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate group-hover/item:text-[#ff7043] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-orange-200 font-medium">
                            {product.unit} · Premium Quality
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          addToCart(product, 1);
                        }}
                        className="px-3 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shrink-0 transition-transform active:scale-95"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add To Cart</span>
                      </button>
                    </div>
                  );
                })()
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
