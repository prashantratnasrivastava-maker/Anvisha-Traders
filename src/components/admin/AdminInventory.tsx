import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  DollarSign,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminInventory: React.FC = () => {
  const { products, adjustStock } = useStore();
  const [search, setSearch] = useState('');
  const [filterStock, setFilterStock] = useState<'all' | 'low' | 'out'>('all');

  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalStockValue = products.reduce(
    (sum, p) => sum + p.price * p.stock,
    0
  );
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  const filtered = products.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    if (filterStock === 'low') {
      return matchesSearch && p.stock > 0 && p.stock <= 5;
    }
    if (filterStock === 'out') {
      return matchesSearch && p.stock === 0;
    }
    return matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900 font-display">
          Inventory &amp; Stock Manager
        </h2>
        <p className="text-xs text-neutral-500">
          Monitor physical store stock levels, receive low stock alerts, and quick-restock items
        </p>
      </div>

      {/* Stock summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Total Inventory Units
          </span>
          <span className="text-2xl font-black text-neutral-900 tabular-nums font-display mt-2 block">
            {totalUnits.toLocaleString('en-IN')} Units
          </span>
          <span className="text-[11px] text-neutral-500">Across {products.length} product SKUs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Inventory Asset Value
          </span>
          <span className="text-2xl font-black text-[#ff5722] tabular-nums font-display mt-2 block">
            ₹{totalStockValue.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-neutral-500">At current selling prices</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Low Stock (&le; 5 units)
          </span>
          <span className="text-2xl font-black text-amber-600 tabular-nums font-display mt-2 block">
            {lowStockCount} SKUs
          </span>
          <span className="text-[11px] text-amber-700">Needs restock attention</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
          <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block">
            Out of Stock
          </span>
          <span className="text-2xl font-black text-red-600 tabular-nums font-display mt-2 block">
            {outOfStockCount} SKUs
          </span>
          <span className="text-[11px] text-red-600">Currently unavailable</span>
        </div>
      </div>

      {/* Search & Filter pills */}
      <div className="bg-white p-3 rounded-2xl border border-neutral-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search inventory items..."
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-[#ff5722] outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStock('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStock === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            All Stock ({products.length})
          </button>
          <button
            onClick={() => setFilterStock('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStock === 'low'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
            }`}
          >
            Low Stock ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterStock('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filterStock === 'out'
                ? 'bg-red-600 text-white'
                : 'bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            Out of Stock ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="p-3.5">Product SKU</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">In Stock</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Total Valuation</th>
                <th className="p-3.5 text-right">Quick Restock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.map((product) => {
                const isLow = product.stock > 0 && product.stock <= 5;
                const isOut = product.stock === 0;

                return (
                  <tr key={product.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded-xl object-cover bg-neutral-100 shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-neutral-900 block truncate max-w-xs">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            Unit: {product.unit}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3.5 text-neutral-600 font-semibold">{product.category}</td>
                    <td className="p-3.5 tabular-nums">
                      <div className="font-bold text-neutral-900 text-xs">₹{product.price}</div>
                      {product.mrp > product.price ? (
                        <div className="flex items-center gap-1 text-[10px]">
                          <span className="text-neutral-400 line-through">₹{product.mrp}</span>
                          <span className="text-emerald-700 font-extrabold">
                            {Math.round(((product.mrp - product.price) / product.mrp) * 100)}% off
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400">Regular</span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span className="text-sm font-black text-neutral-900 tabular-nums">
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-3.5">
                      {isOut ? (
                        <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <AlertCircle className="w-3 h-3" /> Out of Stock
                        </span>
                      ) : isLow ? (
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <AlertTriangle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" /> Healthy
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-extrabold text-neutral-800 tabular-nums">
                      ₹{(product.price * product.stock).toLocaleString('en-IN')}
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => adjustStock(product.id, -1)}
                        disabled={product.stock <= 0}
                        className="p-1 px-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-bold disabled:opacity-30"
                        title="Reduce 1 unit"
                      >
                        -1
                      </button>
                      <button
                        onClick={() => adjustStock(product.id, 5)}
                        className="p-1 px-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded-lg text-xs font-bold"
                        title="Add 5 units"
                      >
                        +5
                      </button>
                      <button
                        onClick={() => adjustStock(product.id, 10)}
                        className="p-1 px-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-lg text-xs font-bold shadow-2xs"
                        title="Add 10 units"
                      >
                        +10
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
