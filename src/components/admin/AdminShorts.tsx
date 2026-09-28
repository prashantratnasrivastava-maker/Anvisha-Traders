import React, { useState } from 'react';
import {
  Clapperboard,
  Plus,
  Trash2,
  Play,
  UploadCloud,
  Link,
  Eye,
  Heart,
  ShoppingBag,
  Film,
  Check,
  AlertCircle,
  Video,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductShort } from '../../types';

export const AdminShorts: React.FC = () => {
  const { shorts, addShort, deleteShort, products } = useStore();

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [fileLoading, setFileLoading] = useState(false);
  const [previewVideo, setPreviewVideo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sample quick video templates for admin testing
  const sampleVideos = [
    {
      title: 'Fashion Kurta & Dress Material Demo',
      url: '/videos/kurta-short.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Desi Mustard Oil Purity & Taste',
      url: '/videos/mustard-oil-short.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Fresh Dry Fruits & Nuts Crispness',
      url: '/videos/almonds-short.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&w=600&q=80',
    },
    {
      title: 'Kitchen Spices & Grocery Stock',
      url: '/videos/spices-short.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
    },
  ];


  // Handle local video file upload via HTML5 FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit: keep within reasonable browser limits (e.g., < 25MB for smooth local rendering)
    if (file.size > 30 * 1024 * 1024) {
      alert('File size 30MB se kam honi chahiye.');
      return;
    }

    setFileLoading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setVideoUrl(result);
      setFileLoading(false);
    };
    reader.onerror = () => {
      alert('Video file read karne me samasya aayi.');
      setFileLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleCreateShort = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      alert('Kripya video ka title aur video URL/file provide karein.');
      return;
    }

    setIsSubmitting(true);

    const linkedProduct = products.find((p) => p.id === selectedProductId);

    await addShort({
      title: title.trim(),
      description: description.trim(),
      videoUrl: videoUrl.trim(),
      thumbnail: thumbnail.trim() || linkedProduct?.image || '',
      productId: linkedProduct?.id,
      productName: linkedProduct?.name,
      productPrice: linkedProduct?.price,
      productUnit: linkedProduct?.unit,
      productImage: linkedProduct?.image,
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setVideoUrl('');
    setThumbnail('');
    setSelectedProductId('');
    setShowUploadModal(false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#ff5722] flex items-center justify-center font-bold">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-neutral-900 font-display">
                Product Video Shorts Management
              </h2>
              <p className="text-xs text-neutral-500">
                Customer portal ke "Shorts" tab ke liye chote reels/videos upload aur manage karein
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-orange-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Naya Short Video</span>
        </button>
      </div>

      {/* Info notice bar */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3 text-xs text-amber-900">
        <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Kaise Kaam Karta Hai: </span>
          Admin yahan dukan ke kisi bhi product (Kurta, Masala, Tel, Kaju/Badam) ka 10-30 second ka video link ya direct phone se video upload kar sakta hai. Yeh video direct customer ke bottom navigation ke **"Shorts"** tab par live play hoga jahan customer reel dekhte dekhte direct **"Add to Cart"** kar sakta hai!
        </div>
      </div>

      {/* Existing Shorts Grid */}
      {shorts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-neutral-200 max-w-lg mx-auto">
          <Film className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-neutral-800">Abhi tak koi short video nahi hai</h3>
          <p className="text-xs text-neutral-500 mt-1 mb-4">
            Apni dukan ke top products ka short video upload karein aur grahakon ko aakarshit karein.
          </p>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-[#ff5722] text-white rounded-xl text-xs font-bold"
          >
            Pehla Short Upload Karein
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shorts.map((short) => (
            <div
              key={short.id}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-200 shadow-sm flex flex-col justify-between group hover:shadow-md transition-all"
            >
              {/* Video Player / Thumbnail Preview */}
              <div className="relative aspect-[9/16] max-h-80 bg-black overflow-hidden flex items-center justify-center">
                <video
                  src={short.videoUrl}
                  poster={short.thumbnail}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />

                {/* Top Badge */}
                <div className="absolute top-2 left-2 pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    Shorts Reel
                  </span>
                </div>
              </div>

              {/* Video Info Details */}
              <div className="p-3.5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 line-clamp-2 leading-snug">
                    {short.title}
                  </h4>
                  {short.description && (
                    <p className="text-[11px] text-neutral-500 mt-1 line-clamp-2">
                      {short.description}
                    </p>
                  )}

                  {/* Linked Product Pill */}
                  {short.productName && (
                    <div className="mt-2.5 p-2 bg-orange-50/70 rounded-xl border border-orange-100 flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#ff5722] shrink-0" />
                        <span className="font-bold text-neutral-800 truncate">
                          {short.productName}
                        </span>
                      </div>
                      {short.productPrice && (
                        <span className="font-black text-[#ff5722] shrink-0">
                          ₹{short.productPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Footer Metrics & Actions */}
                <div className="mt-3 pt-2.5 border-t border-neutral-100 flex items-center justify-between">
                  <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{short.viewsCount} views</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-500" />
                      <span>{short.likesCount}</span>
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Kya aap "${short.title}" short video ko delete karna chahte hain?`)) {
                        deleteShort(short.id);
                      }
                    }}
                    className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Video"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Short Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full my-auto shadow-2xl p-6 border border-neutral-200 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-100 text-[#ff5722] flex items-center justify-center">
                  <Clapperboard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 font-display">
                    Naya Short Product Video Upload Karein
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Video grahakon ko Shorts tab me auto-play aur loop me dikhega
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateShort} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Video Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Royal Silk Kurta Unboxing & Quality Test"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>

              {/* Linked Product (Optional) */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Link with Store Product (Grahak direct order kar sakega)
                </label>
                <select
                  value={selectedProductId}
                  onChange={(e) => {
                    setSelectedProductId(e.target.value);
                    const prod = products.find((p) => p.id === e.target.value);
                    if (prod && !thumbnail) {
                      setThumbnail(prod.image);
                    }
                  }}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none bg-white"
                >
                  <option value="">-- Kisi Product Se Link Karein (Optional) --</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (₹{p.price}/{p.unit})
                    </option>
                  ))}
                </select>
              </div>

              {/* Upload Type Switcher */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1.5">
                  Video Source Method:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUploadType('url')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      uploadType === 'url'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <Link className="w-3.5 h-3.5" />
                    <span>Direct Video URL (MP4)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUploadType('file')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                      uploadType === 'file'
                        ? 'bg-neutral-900 text-white border-neutral-900'
                        : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Mobile / Device Se File</span>
                  </button>
                </div>
              </div>

              {/* Video URL or File input */}
              {uploadType === 'url' ? (
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Direct MP4 / WebM Video URL *
                  </label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://example.com/my-product-reel.mp4"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none font-mono"
                  />

                  {/* Sample Video Suggestions */}
                  <div className="mt-2">
                    <span className="text-[10px] font-bold text-neutral-500 block mb-1">
                      Ya fir in sample videos me se select karein:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {sampleVideos.map((sample, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setVideoUrl(sample.url);
                            setThumbnail(sample.thumbnail);
                            if (!title) setTitle(sample.title);
                          }}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[11px] rounded-lg border border-neutral-200"
                        >
                          {sample.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Apne Mobile / Computer Se Video Chunein (MP4 / WebM) *
                  </label>
                  <input
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    onChange={handleFileUpload}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-700"
                  />
                  {fileLoading && (
                    <p className="text-[11px] text-amber-600 mt-1">Video load ho raha hai...</p>
                  )}
                  {videoUrl && uploadType === 'file' && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-bold">
                      ✓ Video file ready to upload!
                    </p>
                  )}
                </div>
              )}

              {/* Video Thumbnail (Optional) */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Cover Image / Thumbnail URL (Optional)
                </label>
                <input
                  type="url"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Description / Video Ke Bare Me (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 100% pure kacchi ghani mustard oil test direct at store."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none resize-none"
                />
              </div>

              {/* Video Live Preview */}
              {videoUrl && (
                <div className="p-3 bg-neutral-100 rounded-xl">
                  <span className="text-[11px] font-bold text-neutral-600 block mb-1">
                    Live Video Preview:
                  </span>
                  <div className="relative aspect-[9/16] max-h-48 mx-auto rounded-lg overflow-hidden bg-black">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-xl text-xs font-bold hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || fileLoading}
                  className="px-5 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-orange-500/20 disabled:opacity-50"
                >
                  {isSubmitting ? 'Uploading...' : 'Publish to Customer Shorts'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
