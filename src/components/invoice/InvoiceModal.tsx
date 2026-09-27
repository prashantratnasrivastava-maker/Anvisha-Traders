import React from 'react';
import {
  Download,
  MapPin,
  Phone,
  Printer,
  ShieldCheck,
  Store,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

// Helper to convert Indian numbers to words
const numberToIndianWords = (num: number): string => {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const wholeNumber = Math.floor(num);
  const paise = Math.round((num - wholeNumber) * 100);

  const convertGroup = (n: number): string => {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
    return a[Math.floor(n / 100)] + ' Hundred ' + convertGroup(n % 100);
  };

  const convertIndian = (n: number): string => {
    if (n === 0) return 'Zero';
    let str = '';
    const crore = Math.floor(n / 10000000);
    const lakh = Math.floor((n % 10000000) / 100000);
    const thousand = Math.floor((n % 100000) / 1000);
    const remainder = n % 1000;

    if (crore > 0) str += convertGroup(crore) + 'Crore ';
    if (lakh > 0) str += convertGroup(lakh) + 'Lakh ';
    if (thousand > 0) str += convertGroup(thousand) + 'Thousand ';
    if (remainder > 0) str += convertGroup(remainder);

    return str.trim();
  };

  const words = convertIndian(wholeNumber);
  const paiseStr = paise > 0 ? ` and ${convertGroup(paise).trim()} Paise` : '';
  return `INR ${words}${paiseStr} Only`;
};

export const InvoiceModal: React.FC = () => {
  const {
    selectedOrderForInvoice,
    setSelectedOrderForInvoice,
    businessInfo,
  } = useStore();

  if (!selectedOrderForInvoice) return null;

  const order = selectedOrderForInvoice;
  const invoiceNumber = order.invoiceNumber || `AT/INV/2026/0${order.id.slice(-3)}`;
  const invoiceDate = order.invoiceGeneratedAt
    ? new Date(order.invoiceGeneratedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const cgstAmount = Number((order.taxAmount / 2).toFixed(2));
  const sgstAmount = Number((order.taxAmount / 2).toFixed(2));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full my-auto shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal actions bar (hidden during print) */}
        <div className="no-print bg-neutral-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#ff7043]">Tax Invoice</span>
            <span className="text-neutral-500">|</span>
            <span className="text-xs font-mono text-neutral-300">{invoiceNumber}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#ff5722] hover:bg-[#f4511e] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={() => setSelectedOrderForInvoice(null)}
              className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Body */}
        <div id="printable-invoice" className="p-6 sm:p-8 bg-white text-neutral-900 font-sans">
          {/* Header Block */}
          <div className="border-b-2 border-neutral-900 pb-5">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-neutral-900 font-display">
                  {businessInfo.name}
                </h1>
                <p className="text-xs font-semibold text-neutral-600 mt-0.5">
                  {businessInfo.tagline}
                </p>
                <div className="mt-2 text-xs text-neutral-700 leading-relaxed max-w-md">
                  <p className="font-medium">{businessInfo.address}</p>
                  <p>
                    <span className="font-bold">Contact: </span>
                    <span className="tabular-nums font-semibold">{businessInfo.contact}</span>
                    <span className="mx-2">·</span>
                    <span className="font-bold">GSTIN: </span>
                    <span className="font-mono font-bold text-neutral-900">{businessInfo.gstin}</span>
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    State: Bihar (Code 10) · Pachrukhi, Siwan
                  </p>
                </div>
              </div>

              <div className="sm:text-right bg-neutral-50 sm:bg-transparent p-3 sm:p-0 rounded-xl sm:rounded-none w-full sm:w-auto">
                <span className="text-xs font-black uppercase tracking-widest text-[#ff5722] block">
                  TAX INVOICE
                </span>
                <p className="text-sm font-mono font-bold text-neutral-900 mt-1">
                  {invoiceNumber}
                </p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  <span className="font-semibold">Date:</span> {invoiceDate}
                </p>
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold">Order Ref:</span> #{order.id}
                </p>
                <p className="text-xs text-neutral-600">
                  <span className="font-semibold">Payment:</span>{' '}
                  <span className="font-bold uppercase text-neutral-900">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Billed To / Consignee */}
          <div className="py-4 border-b border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Billed To (Customer Details):
              </span>
              <p className="text-sm font-bold text-neutral-900">{order.customerName}</p>
              <p className="text-neutral-700 font-semibold tabular-nums mt-0.5">
                Phone: {order.customerPhone}
              </p>
              <p className="text-neutral-600 mt-1 leading-relaxed">
                {order.deliveryAddress}
              </p>
              {order.landmark && (
                <p className="text-neutral-500 text-[11px]">Landmark: {order.landmark}</p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="font-bold text-neutral-500 uppercase tracking-wider block mb-1">
                Place of Supply:
              </span>
              <p className="text-neutral-900 font-semibold">Pachrukhi, Siwan (Bihar)</p>
              <p className="text-neutral-600">State Code: 10</p>
              <p className="text-neutral-600 mt-1">
                <span className="font-semibold">Delivery Mode:</span> Local Express Store Delivery
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="py-4">
            <table className="w-full text-left text-xs border border-neutral-200">
              <thead className="bg-neutral-100 border-b border-neutral-200 text-neutral-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5 w-8">#</th>
                  <th className="p-2.5">Item Description</th>
                  <th className="p-2.5">HSN</th>
                  <th className="p-2.5 text-center">Qty</th>
                  <th className="p-2.5 text-right">Unit Rate</th>
                  <th className="p-2.5 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {order.items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-neutral-50/50">
                    <td className="p-2.5 text-neutral-500 tabular-nums">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-neutral-900">
                      {item.name}
                      <span className="text-[10px] text-neutral-500 block font-normal">
                        Packaging: {item.unit}
                      </span>
                    </td>
                    <td className="p-2.5 font-mono text-neutral-600">{item.hsnCode || '6204'}</td>
                    <td className="p-2.5 text-center font-bold text-neutral-800 tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="p-2.5 text-right tabular-nums text-neutral-700">
                      ₹{item.price.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-right font-bold text-neutral-900 tabular-nums">
                      ₹{item.total.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Calculation */}
          <div className="pt-2 border-t border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-neutral-600 block mb-1">
                Amount Chargeable (in words):
              </span>
              <p className="font-bold text-neutral-900 italic bg-neutral-50 p-2.5 rounded-xl border border-neutral-200/80 leading-relaxed">
                {numberToIndianWords(order.grandTotal)}
              </p>

              <div className="mt-3 text-[11px] text-neutral-500 space-y-0.5">
                <p>• Goods once sold can be returned/exchanged within 7 days at store.</p>
                <p>• Subject to Siwan jurisdiction only.</p>
                <p>• Computer generated invoice from Anvisha Traders, Pachrukhi.</p>
              </div>
            </div>

            <div className="space-y-1.5 bg-neutral-50/60 p-3 rounded-xl border border-neutral-200">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal (Taxable Value):</span>
                <span className="tabular-nums font-semibold text-neutral-900">
                  ₹{order.subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>CGST (2.5%):</span>
                <span className="tabular-nums font-semibold text-neutral-900">
                  ₹{cgstAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>SGST (2.5%):</span>
                <span className="tabular-nums font-semibold text-neutral-900">
                  ₹{sgstAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping / Delivery Charges:</span>
                <span className="tabular-nums font-semibold text-neutral-900">
                  {order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-neutral-300 flex justify-between text-sm font-black text-neutral-900">
                <span>Grand Total:</span>
                <span className="text-base text-[#ff5722] tabular-nums font-display">
                  ₹{order.grandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Signature & Seal Footer */}
          <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-300 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs">
            <div className="text-center sm:text-left">
              <p className="font-bold text-neutral-900">{businessInfo.name}</p>
              <p className="text-neutral-500 text-[11px]">
                Deepak Complex Bahawani More, Pachrukhi, Siwan Bihar
              </p>
              <p className="text-neutral-500 text-[11px]">Helpline: {businessInfo.contact}</p>
            </div>

            <div className="text-center">
              <div className="w-40 h-16 border-2 border-dashed border-neutral-300 rounded-xl flex items-center justify-center text-neutral-400 text-[10px] uppercase font-bold tracking-wider mb-1">
                Authorized Seal &amp; Sign
              </div>
              <p className="font-bold text-neutral-900 text-xs">For Anvisha Traders</p>
              <p className="text-[10px] text-neutral-500">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
