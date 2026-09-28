import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin,
  Minus,
  Phone,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  Truck,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerCart: React.FC = () => {
  const {
    cart,
    cartTotal,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    placeOrder,
    setCustomerTab,
    setSelectedOrderForTracking,
    businessInfo,
    currentCustomer,
    setShowCustomerLoginModal,
  } = useStore();

  const [customerName, setCustomerName] = useState(currentCustomer.name || 'Prashant Ratna Srivastava');
  const [customerPhone, setCustomerPhone] = useState(currentCustomer.phone || '7000455037');
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentCustomer.address || 'Deepak Complex Bahawani More Pachrukhi, Siwan Bihar (841241)'
  );
  const [landmark, setLandmark] = useState('Near Bahawani Mandir Chowk');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi'>('upi');
  const [notes, setNotes] = useState('');
  const [isPlacing, setIsPlacing] = useState(false);
  const [showUpiModal, setShowUpiModal] = useState(false);

  const deliveryFee = cartTotal > 499 ? 0 : 40;
  const taxRate = 5;
  const taxAmount = Number(((cartTotal * taxRate) / 100).toFixed(2));
  const grandTotal = Number((cartTotal + deliveryFee + taxAmount).toFixed(2));

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // Check if customer is approved
    if (!currentCustomer.isLoggedIn || currentCustomer.status !== 'approved') {
      setShowCustomerLoginModal(true);
      return;
    }

    setIsPlacing(true);
    setTimeout(() => {
      const order = placeOrder({
        customerName,
        customerPhone,
        deliveryAddress,
        landmark,
        paymentMethod,
        notes,
      });
      setIsPlacing(false);
      setSelectedOrderForTracking(order);
      setCustomerTab('orders');
    }, 600);
  };

  if (cart.length === 0) {
    return (
      <div className="pb-24 max-w-xl mx-auto px-4 pt-12 text-center">
        <div className="w-20 h-20 bg-orange-50 text-[#ff5722] rounded-3xl mx-auto flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900 font-display">Your Cart is Empty</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
          Explore Anvisha Traders catalog for stylish clothing, grocery essentials, and dry fruits.
        </p>
        <button
          onClick={() => setCustomerTab('home')}
          className="mt-6 px-6 py-2.5 bg-[#ff5722] hover:bg-[#f4511e] text-white text-xs font-bold rounded-xl shadow-md shadow-orange-500/30 transition-all"
        >
          Explore Catalog Now
        </button>
      </div>
    );
  }

  return (
    <div className="pb-28 max-w-2xl mx-auto px-4 pt-3">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 font-display">
            Shopping Cart ({cart.reduce((s, i) => s + i.quantity, 0)} items)
          </h2>
          <p className="text-xs text-neutral-500">Direct doorstep delivery across Pachrukhi &amp; Siwan</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-red-500 hover:text-red-700 font-semibold"
        >
          Clear All
        </button>
      </div>

      {/* Cart Items List */}
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div
            key={item.product.id}
            className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-xs flex items-center gap-3"
          >
            <img
              src={item.product.image}
              alt={item.product.name}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover bg-neutral-50 shrink-0"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                {item.product.category}
              </span>
              <h4 className="text-xs font-semibold text-neutral-900 truncate">
                {item.product.name}
              </h4>
              <p className="text-[11px] font-bold text-[#ff5722] mt-0.5">
                Pack: {item.product.unit} (Qty: {item.quantity})
              </p>
            </div>

            {/* Stepper */}
            <div className="flex items-center gap-2 bg-neutral-100 rounded-lg p-1">
              <button
                onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                className="w-6 h-6 rounded-md bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center shadow-xs transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-xs font-bold text-neutral-900 tabular-nums w-4 text-center">
                {item.quantity}
              </span>
              <button
                onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                disabled={item.quantity >= item.product.stock}
                className="w-6 h-6 rounded-md bg-white hover:bg-neutral-200 text-neutral-700 flex items-center justify-center shadow-xs transition-colors disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>

            <button
              onClick={() => removeFromCart(item.product.id)}
              className="text-neutral-400 hover:text-red-500 p-1.5 transition-colors"
              title="Remove"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleCheckout} className="space-y-4">
        {/* Delivery Address Card */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-neutral-900">
            <Truck className="w-4 h-4 text-[#ff5722]" />
            <span>Delivery &amp; Customer Information</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
                Contact Phone
              </label>
              <input
                type="tel"
                required
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
              Delivery Address (Pachrukhi / Siwan Area)
            </label>
            <textarea
              required
              rows={2}
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none resize-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-neutral-600 block mb-1">
              Landmark / Delivery Note (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Bahawani Mandir / Beside Shop"
              className="w-full px-3 py-2 text-xs rounded-xl border border-neutral-300 focus:border-[#ff5722] focus:ring-1 focus:ring-[#ff5722] outline-none"
            />
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-900">Payment Option</span>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Safe &amp; Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label
              className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'upi'
                  ? 'border-[#ff5722] bg-orange-50/40 text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'upi'}
                  onChange={() => setPaymentMethod('upi')}
                  className="accent-[#ff5722]"
                />
                <QrCode className="w-4 h-4 text-[#ff5722]" />
              </div>
              <div>
                <span className="text-xs font-bold block">Instant UPI / QR</span>
                <span className="text-[10px] text-neutral-500">PhonePe, GPay, Paytm</span>
              </div>
            </label>

            <label
              className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                paymentMethod === 'cod'
                  ? 'border-[#ff5722] bg-orange-50/40 text-neutral-900'
                  : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-[#ff5722]"
                />
                <ShoppingBag className="w-4 h-4 text-emerald-600" />
              </div>
              <div>
                <span className="text-xs font-bold block">Cash on Delivery</span>
                <span className="text-[10px] text-neutral-500">Pay cash upon delivery</span>
              </div>
            </label>
          </div>

          {paymentMethod === 'upi' && (
            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-semibold text-neutral-800">Store UPI ID:</span>
                <p className="text-neutral-600 tabular-nums">{businessInfo.upiId}</p>
              </div>
              <button
                type="button"
                onClick={() => setShowUpiModal(true)}
                className="px-2.5 py-1 bg-white border border-neutral-300 rounded-lg text-[11px] font-semibold text-neutral-700 hover:bg-neutral-100"
              >
                Scan Store QR
              </button>
            </div>
          )}
        </div>

        {/* Order Summary without prices (Prices managed exclusively by Admin) */}
        <div className="bg-white rounded-2xl p-4 border border-neutral-200 shadow-xs space-y-2.5">
          <span className="text-sm font-bold text-neutral-900 block mb-1">Order Items Summary</span>
          <div className="flex justify-between text-xs text-neutral-600">
            <span>Total Distinct Items</span>
            <span className="tabular-nums font-semibold text-neutral-800">
              {cart.length} {cart.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600">
            <span>Total Units / Quantity</span>
            <span className="tabular-nums font-semibold text-neutral-800">
              {cart.reduce((s, i) => s + i.quantity, 0)} Units
            </span>
          </div>
          <div className="flex justify-between text-xs text-neutral-600">
            <span>Doorstep Delivery</span>
            <span className="text-emerald-700 font-semibold">Available (Pachrukhi / Siwan)</span>
          </div>
          <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 leading-relaxed">
            💡 Official billing, rates, and tax invoice will be prepared and confirmed by Store Admin upon order dispatch.
          </div>
        </div>

        {/* Submit Order Button */}
        {(!currentCustomer.isLoggedIn || currentCustomer.status !== 'approved') ? (
          <div className="space-y-2">
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
              <div>
                <span className="font-bold block">Account Approval Required</span>
                <span className="text-[11px] text-amber-800">
                  {currentCustomer.status === 'pending'
                    ? 'Aapki request dukan admin ke paas pending hai.'
                    : 'Order place karne ke liye apna Name aur Mobile verify karein.'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setShowCustomerLoginModal(true)}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-xs shrink-0"
              >
                {currentCustomer.status === 'pending' ? 'Check Status' : 'Sign In'}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowCustomerLoginModal(true)}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Verify / Sign In to Place Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="submit"
            disabled={isPlacing}
            className="w-full py-3.5 bg-[#ff5722] hover:bg-[#f4511e] active:scale-[0.99] text-white text-sm font-bold rounded-2xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isPlacing ? (
              <span>Placing Order with Anvisha Traders...</span>
            ) : (
              <>
                <span>Confirm &amp; Place Order Request</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </form>

      {/* QR Code Popup */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-bold text-neutral-900">Anvisha Traders UPI QR</h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Scan with any UPI App (GPay, PhonePe, Paytm)
            </p>
            <div className="my-5 p-4 bg-orange-50/50 border border-orange-200 rounded-2xl inline-block">
              {/* Clean SVG QR mockup */}
              <svg className="w-44 h-44 mx-auto" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="white" />
                <rect x="5" y="5" width="25" height="25" fill="#1e293b" />
                <rect x="9" y="9" width="17" height="17" fill="white" />
                <rect x="13" y="13" width="9" height="9" fill="#ff5722" />

                <rect x="70" y="5" width="25" height="25" fill="#1e293b" />
                <rect x="74" y="9" width="17" height="17" fill="white" />
                <rect x="78" y="13" width="9" height="9" fill="#ff5722" />

                <rect x="5" y="70" width="25" height="25" fill="#1e293b" />
                <rect x="9" y="74" width="17" height="17" fill="white" />
                <rect x="13" y="78" width="9" height="9" fill="#ff5722" />

                {/* Random QR clusters */}
                <rect x="36" y="10" width="8" height="8" fill="#1e293b" />
                <rect x="50" y="12" width="6" height="6" fill="#1e293b" />
                <rect x="38" y="24" width="16" height="6" fill="#1e293b" />
                <rect x="15" y="38" width="18" height="8" fill="#1e293b" />
                <rect x="42" y="38" width="12" height="12" fill="#ff5722" />
                <rect x="62" y="38" width="16" height="8" fill="#1e293b" />
                <rect x="38" y="56" width="24" height="6" fill="#1e293b" />
                <rect x="70" y="60" width="14" height="14" fill="#1e293b" />
                <rect x="38" y="74" width="12" height="12" fill="#1e293b" />
                <rect x="58" y="78" width="10" height="10" fill="#ff5722" />
              </svg>
            </div>
            <p className="text-xs font-semibold text-neutral-800">{businessInfo.upiId}</p>
            <p className="text-[11px] text-neutral-500 mt-1">
              Contact: {businessInfo.contact} · Anvisha Traders
            </p>
            <button
              type="button"
              onClick={() => setShowUpiModal(false)}
              className="mt-5 w-full py-2 bg-neutral-900 text-white text-xs font-semibold rounded-xl"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
