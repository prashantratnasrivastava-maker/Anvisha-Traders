import React, { useState } from 'react';
import {
  Boxes,
  Check,
  ChevronDown,
  Edit2,
  Filter,
  Flame,
  Image as ImageIcon,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingDown,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Rate Off / Discount Single Product Modal
  const [rateOffProduct, setRateOffProduct] = useState<Product | null>(null);
  const [rateOffMrp, setRateOffMrp] = useState<number>(0);
  const [rateOffPrice, setRateOffPrice] = useState<number>(0);
  const [rateOffPercent, setRateOffPercent] = useState<number>(0);
  const [rateOffFlatAmount, setRateOffFlatAmount] = useState<number>(0);
  const [rateOffSuccessMsg, setRateOffSuccessMsg] = useState<string | null>(null);

  // Bulk Rate Off Modal
  const [isBulkRateOffOpen, setIsBulkRateOffOpen] = useState(false);
  const [bulkCategory, setBulkCategory] = useState<string>('all');
  const [bulkPercent, setBulkPercent] = useState<number>(15);
  const [bulkSuccessMsg, setBulkSuccessMsg] = useState<string | null>(null);

  // Form states for Add / Edit
  const [name, setName] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || "Women's Wear");
  const [price, setPrice] = useState<number>(499);
  const [mrp, setMrp] = useState<number>(899);
  const [discountPercentOff, setDiscountPercentOff] = useState<number>(44);
  const [stock, setStock] = useState<number>(20);
  const [unit, setUnit] = useState('Piece');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [hsnCode, setHsnCode] = useState('6204');
  const [isTrending, setIsTrending] = useState(false);
  const [isPopular, setIsPopular] = useState(true);

  const resetForm = () => {
    setName('');
    setCategory(categories[0]?.name || "Women's Wear");
    setMrp(899);
    setPrice(499);
    setDiscountPercentOff(44);
    setStock(20);
    setUnit('Piece');
    setDescription('');
    setImage('');
    setHsnCode('6204');
    setIsTrending(false);
    setIsPopular(true);
    setEditingProduct(null);
  };

  // Helper when changing Rate Off % in Add/Edit modal
  const handleDiscountPercentChange = (percent: number, baseMrp = mrp) => {
    setDiscountPercentOff(percent);
    if (baseMrp > 0) {
      const calculatedPrice = Math.max(1, Math.round(baseMrp * (1 - percent / 100)));
      setPrice(calculatedPrice);
    }
  };

  const handlePriceChange = (newPrice: number, baseMrp = mrp) => {
    setPrice(newPrice);
    if (baseMrp > 0 && baseMrp >= newPrice) {
      const calculatedPercent = Math.round(((baseMrp - newPrice) / baseMrp) * 100);
      setDiscountPercentOff(calculatedPercent);
    } else if (newPrice > baseMrp) {
      setDiscountPercentOff(0);
    }
  };

  const handleMrpChange = (newMrp: number) => {
    setMrp(newMrp);
    if (newMrp > 0) {
      const calculatedPrice = Math.max(1, Math.round(newMrp * (1 - discountPercentOff / 100)));
      setPrice(calculatedPrice);
    }
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setCategory(p.category);
    setPrice(p.price);
    setMrp(p.mrp);
    const disc = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    setDiscountPercentOff(disc);
    setStock(p.stock);
    setUnit(p.unit);
    setDescription(p.description);
    setImage(p.image);
    setHsnCode(p.hsnCode || '6204');
    setIsTrending(!!p.isTrending);
    setIsPopular(!!p.isPopular);
    setIsAddModalOpen(true);
  };

  // Open Rate Off modal for a specific product
  const handleOpenRateOffModal = (p: Product) => {
    setRateOffProduct(p);
    setRateOffMrp(p.mrp);
    setRateOffPrice(p.price);
    const calculatedPercent = p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;
    const flatOff = Math.max(0, p.mrp - p.price);
    setRateOffPercent(calculatedPercent);
    setRateOffFlatAmount(flatOff);
    setRateOffSuccessMsg(null);
  };

  // Sync helpers inside Rate Off modal
  const handleRateOffPercentUpdate = (percent: number) => {
    const clamped = Math.max(0, Math.min(95, percent));
    setRateOffPercent(clamped);
    const newPrice = Math.max(1, Math.round(rateOffMrp * (1 - clamped / 100)));
    setRateOffPrice(newPrice);
    setRateOffFlatAmount(Math.max(0, rateOffMrp - newPrice));
  };

  const handleRateOffPriceUpdate = (newPrice: number) => {
    const validPrice = Math.max(1, newPrice);
    setRateOffPrice(validPrice);
    if (rateOffMrp > 0 && rateOffMrp >= validPrice) {
      const calculated = Math.round(((rateOffMrp - validPrice) / rateOffMrp) * 100);
      setRateOffPercent(calculated);
      setRateOffFlatAmount(rateOffMrp - validPrice);
    } else {
      setRateOffPercent(0);
      setRateOffFlatAmount(0);
    }
  };

  const handleRateOffFlatUpdate = (flatAmt: number) => {
    const validFlat = Math.max(0, flatAmt);
    setRateOffFlatAmount(validFlat);
    const newPrice = Math.max(1, rateOffMrp - validFlat);
    setRateOffPrice(newPrice);
    if (rateOffMrp > 0) {
      const calculated = Math.round((validFlat / rateOffMrp) * 100);
      setRateOffPercent(calculated);
    }
  };

  const handleRateOffMrpUpdate = (newMrp: number) => {
    const validMrp = Math.max(1, newMrp);
    setRateOffMrp(validMrp);
    const newPrice = Math.max(1, Math.round(validMrp * (1 - rateOffPercent / 100)));
    setRateOffPrice(newPrice);
    setRateOffFlatAmount(Math.max(0, validMrp - newPrice));
  };

  // Apply single product Rate Off
  const handleApplyRateOff = () => {
    if (!rateOffProduct) return;
    updateProduct(rateOffProduct.id, {
      price: rateOffPrice,
      mrp: rateOffMrp,
    });
    setRateOffSuccessMsg(`Rate Off applied! Now ₹${rateOffPrice} (${rateOffPercent}% OFF)`);
    setTimeout(() => {
      setRateOffProduct(null);
      setRateOffSuccessMsg(null);
    }, 1200);
  };

  // Apply Bulk Rate Off
  const handleApplyBulkRateOff = () => {
    const targetProducts = products.filter(
      (p) => bulkCategory === 'all' || p.category.toLowerCase() === bulkCategory.toLowerCase()
    );

    targetProducts.forEach((p) => {
      const newPrice = Math.max(1, Math.round(p.mrp * (1 - bulkPercent / 100)));
      updateProduct(p.id, {
        price: newPrice,
      });
    });

    setBulkSuccessMsg(`Successfully applied ${bulkPercent}% OFF to ${targetProducts.length} products!`);
    setTimeout(() => {
      setIsBulkRateOffOpen(false);
      setBulkSuccessMsg(null);
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalImage =
      image ||
      `data:image/svg+xml;utf8,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
          <rect width="400" height="400" fill="#fed7aa"/>
          <circle cx="200" cy="180" r="100" fill="#fff" opacity="0.6"/>
          <text x="200" y="260" font-family="sans-serif" font-size="20" font-weight="bold" fill="#c2410c" text-anchor="middle">${name.slice(0, 20)}</text>
        </svg>
      `.trim())}`;

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        name,
        category,
        price: Number(price),
        mrp: Number(mrp),
        stock: Number(stock),
        unit,
        description,
        image: finalImage,
        hsnCode,
        isTrending,
        isPopular,
      });
    } else {
      addProduct({
        name,
        category,
        price: Number(price),
        mrp: Number(mrp),
        stock: Number(stock),
        unit,
        description,
        image: finalImage,
        hsnCode,
        isTrending,
        isPopular,
      });
    }

    setIsAddModalOpen(false);
    resetForm();
  };

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCat === 'all' || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      {/* Header row with Title and Action buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-black text-neutral-900 font-display">
              Manage Products &amp; Catalog
            </h2>
            <span className="px-2 py-0.5 bg-orange-100 text-[#ff5722] text-[10px] font-extrabold rounded-full">
              Rate Off Enabled
            </span>
          </div>
          <p className="text-xs text-neutral-500">
            Add or edit products, apply discounts &amp; rate off, manage stock and inventory
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Bulk Rate Off Button */}
          <button
            onClick={() => setIsBulkRateOffOpen(true)}
            className="flex-1 sm:flex-initial px-3.5 py-2.5 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 border border-neutral-700/60"
            title="Apply Festive / Store-Wide Rate Off"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Bulk Rate Off (% छूट)</span>
          </button>

          {/* Add New Product Button */}
          <button
            onClick={handleOpenAdd}
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or category..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-[#ff5722] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-neutral-400" />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs font-semibold px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Product Details</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price &amp; Rate Off</th>
                <th className="p-3.5">Stock Level</th>
                <th className="p-3.5">Unit</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((product) => {
                const discount =
                  product.mrp > product.price
                    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
                    : 0;
                const savings = Math.max(0, product.mrp - product.price);

                return (
                  <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0 border border-neutral-200/60"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-neutral-900 block truncate max-w-xs">
                            {product.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[11px] text-neutral-400">
                              HSN: {product.hsnCode || 'N/A'}
                            </span>
                            {product.isTrending && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-purple-100 text-purple-700 rounded-md">
                                Reel
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-neutral-700 font-semibold">{product.category}</span>
                    </td>
                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="font-extrabold text-neutral-900 text-sm tabular-nums">
                            ₹{product.price}
                          </span>
                          {product.mrp > product.price && (
                            <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                              ₹{product.mrp}
                            </span>
                          )}
                        </div>
                        {discount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                              <Percent className="w-2.5 h-2.5 stroke-[2.5]" />
                              {discount}% OFF
                            </span>
                            <span className="text-[10px] text-neutral-500 font-medium">
                              (Save ₹{savings})
                            </span>
                          </div>
                        ) : (
                          <span className="inline-block text-[10px] font-bold text-neutral-400 bg-neutral-100 px-1.5 py-0.5 rounded">
                            No Discount (MRP)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-xs ${
                          product.stock > 5
                            ? 'text-emerald-700'
                            : product.stock > 0
                            ? 'text-amber-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.stock} {product.unit}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-600 font-medium">{product.unit}</td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Dedicated Rate Off Button */}
                        <button
                          onClick={() => handleOpenRateOffModal(product)}
                          className="px-2.5 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#ff5722] hover:text-[#f4511e] border border-orange-200 rounded-xl font-bold text-[11px] flex items-center gap-1 transition-all shadow-2xs group"
                          title="Rate Off / Set Discount"
                        >
                          <Tag className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
                          <span>Rate Off</span>
                        </button>

                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                              deleteProduct(product.id);
                            }
                          }}
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 🏷️ DEDICATED RATE OFF / DISCOUNT MODAL                                     */}
      {/* ========================================================================= */}
      {rateOffProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-neutral-100">
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-orange-500 to-[#ff7043] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display leading-tight">
                    Product Rate Off (छूट) Manager
                  </h3>
                  <p className="text-[11px] text-orange-100">
                    Set discount rate, offer price, or percentage off for customers
                  </p>
                </div>
              </div>
              <button
                onClick={() => setRateOffProduct(null)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5">
              {/* Product Info Strip */}
              <div className="flex items-center gap-3.5 p-3 bg-neutral-50 rounded-2xl border border-neutral-200/80">
                <img
                  src={rateOffProduct.image}
                  alt={rateOffProduct.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover bg-white shrink-0 border border-neutral-200"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#ff5722] block">
                    {rateOffProduct.category}
                  </span>
                  <h4 className="text-xs font-bold text-neutral-900 truncate">
                    {rateOffProduct.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-neutral-500">
                    <span>Stock: <strong className="text-neutral-800">{rateOffProduct.stock} {rateOffProduct.unit}</strong></span>
                    <span>•</span>
                    <span>Unit: <strong className="text-neutral-800">{rateOffProduct.unit}</strong></span>
                  </div>
                </div>
              </div>

              {/* Success alert feedback */}
              {rateOffSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>{rateOffSuccessMsg}</span>
                </div>
              )}

              {/* Synchronized Pricing & Rate Off Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Base MRP */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Base MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rateOffMrp}
                    onChange={(e) => handleRateOffMrpUpdate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none bg-neutral-50 focus:bg-white"
                  />
                  <span className="text-[10px] text-neutral-400">Printed price</span>
                </div>

                {/* 2. Rate Off % */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 block text-orange-600">
                    Rate Off (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={95}
                      value={rateOffPercent}
                      onChange={(e) => handleRateOffPercentUpdate(Number(e.target.value))}
                      className="w-full pl-3 pr-7 py-2 text-xs font-black text-orange-600 rounded-xl border border-orange-300 focus:border-[#ff5722] outline-none bg-orange-50/50 focus:bg-white"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-bold text-orange-400">
                      %
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400">Discount %</span>
                </div>

                {/* 3. Flat ₹ Off */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-neutral-700 block">
                    Flat Off (₹)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={rateOffFlatAmount}
                    onChange={(e) => handleRateOffFlatUpdate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none bg-neutral-50 focus:bg-white"
                  />
                  <span className="text-[10px] text-neutral-400">₹ Savings</span>
                </div>

                {/* 4. Final Selling Price */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-700 block">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={rateOffPrice}
                    onChange={(e) => handleRateOffPriceUpdate(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs font-black text-emerald-800 rounded-xl border border-emerald-300 focus:border-emerald-500 outline-none bg-emerald-50/50 focus:bg-white"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold">Offer price</span>
                </div>
              </div>

              {/* Percentage Slider */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-neutral-700 flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5 text-[#ff5722]" />
                    Interactive Discount Slider:
                  </span>
                  <span className="text-sm font-black text-[#ff5722]">
                    {rateOffPercent}% OFF
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80}
                  step={5}
                  value={rateOffPercent}
                  onChange={(e) => handleRateOffPercentUpdate(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ff5722]"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 font-semibold">
                  <span>0% (MRP)</span>
                  <span>20%</span>
                  <span>40%</span>
                  <span>60%</span>
                  <span>80% Max</span>
                </div>
              </div>

              {/* Quick Discount Shortcut Chips */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-neutral-700 block">
                  Quick Rate Off Presets (1-Click Apply):
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {[5, 10, 15, 20, 25, 30, 40, 50, 60].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleRateOffPercentUpdate(pct)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        rateOffPercent === pct
                          ? 'bg-[#ff5722] text-white border-[#ff5722] shadow-xs'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {pct}% OFF
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleRateOffFlatUpdate(50)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
                  >
                    Flat ₹50 OFF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateOffFlatUpdate(100)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
                  >
                    Flat ₹100 OFF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRateOffPercentUpdate(0)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg border bg-neutral-100 hover:bg-neutral-200 text-neutral-600 border-neutral-300"
                  >
                    No Off (Full MRP)
                  </button>
                </div>
              </div>

              {/* Live Customer Storefront Preview Card */}
              <div className="p-3.5 bg-gradient-to-br from-orange-50/70 to-amber-50/70 rounded-2xl border border-orange-200/80 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-orange-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-orange-600" />
                  Live Customer Storefront Preview:
                </span>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-black text-neutral-900 tabular-nums">
                      ₹{rateOffPrice}
                    </span>
                    {rateOffMrp > rateOffPrice && (
                      <span className="text-xs text-neutral-400 line-through tabular-nums">
                        ₹{rateOffMrp}
                      </span>
                    )}
                  </div>
                  {rateOffPercent > 0 ? (
                    <span className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-black rounded-lg shadow-2xs">
                      🎉 {rateOffPercent}% OFF
                    </span>
                  ) : (
                    <span className="text-xs text-neutral-500 font-bold">Regular Price</span>
                  )}
                </div>
                {rateOffPercent > 0 && (
                  <p className="text-[11px] font-bold text-emerald-800">
                    Customer saves ₹{Math.max(0, rateOffMrp - rateOffPrice)} on every purchase!
                  </p>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setRateOffProduct(null)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyRateOff}
                className="px-6 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-black rounded-xl shadow-md shadow-orange-500/25 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Apply Rate Off to Store</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚡ BULK RATE OFF / STORE CLEARANCE MODAL                                   */}
      {/* ========================================================================= */}
      {isBulkRateOffOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden animate-in zoom-in-95 border border-neutral-100">
            <div className="p-5 bg-gradient-to-r from-neutral-900 to-neutral-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-display leading-tight">
                    Bulk Store Rate Off (सामूहिक छूट)
                  </h3>
                  <p className="text-[11px] text-neutral-300">
                    Apply seasonal discount or clearance sale to multiple products
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkRateOffOpen(false)}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {bulkSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  <span>{bulkSuccessMsg}</span>
                </div>
              )}

              {/* Target Category */}
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Apply Discount To:
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                >
                  <option value="all">Entire Store (All {products.length} Products)</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      Category: {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Discount Percent */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-neutral-700">
                    Bulk Discount Percentage (% Off):
                  </label>
                  <span className="text-sm font-black text-[#ff5722]">{bulkPercent}% OFF</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={70}
                  step={5}
                  value={bulkPercent}
                  onChange={(e) => setBulkPercent(Number(e.target.value))}
                  className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#ff5722]"
                />
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {[10, 15, 20, 25, 30, 40, 50].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBulkPercent(pct)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
                        bulkPercent === pct
                          ? 'bg-[#ff5722] text-white border-[#ff5722]'
                          : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 font-medium">
                💡 <strong>Notice:</strong> This will update the selling price for all products in the selected category based on each product's MRP. Customers will immediately see the updated rate and discount badges.
              </div>
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsBulkRateOffOpen(false)}
                className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 text-xs font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApplyBulkRateOff}
                className="px-5 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Apply {bulkPercent}% Off Store-wide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✏️ ADD / EDIT PRODUCT MODAL (WITH INTEGRATED RATE OFF CALCULATOR)           */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-neutral-900 font-display">
                  {editingProduct ? 'Edit Product & Pricing' : 'Add New Product to Store'}
                </h3>
                <p className="text-[11px] text-neutral-500">
                  Fill in title, image, MRP, rate off discount, and inventory stock
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-600 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Product Title / Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cotton Embroidered Kurti Set"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Unit Type *
                  </label>
                  <select
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                  >
                    <option value="Piece">Piece</option>
                    <option value="Set">Set</option>
                    <option value="Packet (200g)">Packet (200g)</option>
                    <option value="Packet (500g)">Packet (500g)</option>
                    <option value="Bottle (1L)">Bottle (1L)</option>
                    <option value="Kg">Kg</option>
                  </select>
                </div>
              </div>

              {/* Pricing & Rate Off Box */}
              <div className="p-3.5 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-700 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5 text-[#ff5722]" />
                  Pricing &amp; Rate Off (% छूट):
                </span>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">
                      MRP (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={mrp}
                      onChange={(e) => handleMrpChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-orange-600 block mb-1">
                      Rate Off (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={95}
                      value={discountPercentOff}
                      onChange={(e) => handleDiscountPercentChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-black text-orange-600 rounded-xl border border-orange-300 focus:border-[#ff5722] outline-none bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-emerald-700 block mb-1">
                      Selling Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={price}
                      onChange={(e) => handlePriceChange(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs font-black text-emerald-800 rounded-xl border border-emerald-300 focus:border-emerald-500 outline-none bg-white"
                    />
                  </div>
                </div>

                {/* Quick % Off Chips */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {[10, 20, 30, 40, 50].map((pct) => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => handleDiscountPercentChange(pct)}
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-md border ${
                          discountPercentOff === pct
                            ? 'bg-[#ff5722] text-white border-[#ff5722]'
                            : 'bg-white hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                        }`}
                      >
                        {pct}% Off
                      </button>
                    ))}
                  </div>

                  {mrp > price && (
                    <span className="text-[11px] font-black text-emerald-700">
                      Customer Saves: ₹{mrp - price} ({discountPercentOff}% OFF)
                    </span>
                  )}
                </div>
              </div>

              {/* Stock and HSN */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    Stock Available *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">
                    HSN / Tax Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={hsnCode}
                    onChange={(e) => setHsnCode(e.target.value)}
                    placeholder="e.g. 6204, 0910"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isTrending}
                    onChange={(e) => setIsTrending(e.target.checked)}
                    className="accent-[#ff5722]"
                  />
                  <span>Featured in Reels (Shorts)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="accent-[#ff5722]"
                  />
                  <span>Popular Deal Badge</span>
                </label>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Product Image (Paste Image URL or Data URI)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... or leave empty for auto graphic"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 block mb-1">
                  Product Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe material, quality, benefits, sizing..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] outline-none resize-none"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/20"
                >
                  {editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
