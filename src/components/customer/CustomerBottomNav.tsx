import React from 'react';
import {
  Heart,
  Home,
  Package,
  PlaySquare,
  ShoppingBag,
  Sparkles,
  Store,
  User,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CustomerBottomNav: React.FC = () => {
  const {
    customerTab,
    setCustomerTab,
    cartItemCount,
    setActiveRole,
    unreadCountForCustomer,
  } = useStore();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'cart', label: 'Cart', icon: ShoppingBag, badge: cartItemCount },
    { id: 'shorts', label: 'Shorts', icon: PlaySquare },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'profile', label: 'Profile', icon: User, badge: unreadCountForCustomer },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-lg px-2 py-1 max-w-lg mx-auto sm:rounded-t-3xl">
      <div className="flex items-center justify-around h-14">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = customerTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() =>
                setCustomerTab(item.id as 'home' | 'shorts' | 'cart' | 'profile' | 'orders')
              }
              className={`relative flex flex-col items-center justify-center transition-all ${
                isActive
                  ? 'bg-[#ff5722] text-white px-3.5 py-1.5 rounded-2xl shadow-md shadow-orange-500/30'
                  : 'text-neutral-500 hover:text-neutral-900 px-2 py-1'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5 stroke-[2.2]" />
                {item.badge && item.badge > 0 ? (
                  <span
                    className={`absolute -top-1.5 -right-2 text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center ${
                      isActive ? 'bg-white text-[#ff5722]' : 'bg-[#ff5722] text-white'
                    }`}
                  >
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span
                className={`text-[10px] font-semibold mt-0.5 leading-none ${
                  isActive ? 'text-white' : 'text-neutral-600'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
