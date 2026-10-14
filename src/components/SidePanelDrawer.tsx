import React from 'react';
import { CITIES, CityName, PHONEO_LOGO_URL } from '../data';

interface SidePanelDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'home' | 'auctions' | 'stores' | 'account' | 'catalog' | 'device-detail';
  rolePerspective: 'seller' | 'retailer';
  activeCity: CityName;
  onSelectCity: (city: CityName) => void;
  onOpenLocationModal: () => void;
  onNavigate: (
    tab: 'home' | 'auctions' | 'stores' | 'account' | 'catalog' | 'device-detail',
    subMode?: 'seller' | 'retailer'
  ) => void;
}

export const SidePanelDrawer: React.FC<SidePanelDrawerProps> = ({
  isOpen,
  onClose,
  activeTab,
  rolePerspective,
  activeCity,
  onSelectCity,
  onOpenLocationModal,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const handleNavClick = (
    tab: 'home' | 'auctions' | 'stores' | 'account' | 'catalog' | 'device-detail',
    subMode?: 'seller' | 'retailer'
  ) => {
    onNavigate(tab, subMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out Drawer Panel */}
      <aside
        className="relative z-10 w-80 sm:w-96 max-w-[85vw] h-full bg-surface-container-lowest shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300 border-r border-outline-variant/30"
        role="dialog"
        aria-label="Navigation Menu"
      >
        <div className="p-6 space-y-6">
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className="flex items-center"
            >
              <img
                alt="Phoneo Logo"
                className="h-9 w-auto object-contain"
                src={PHONEO_LOGO_URL}
              />
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User & City Status Card */}
          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">account_circle</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-on-surface">Phoneo Verified Member</div>
                  <div className="text-[10px] text-on-surface-variant">KYC Verified Consumer</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-bold">
                Active
              </span>
            </div>

            <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-on-surface-variant">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                <span>Active Hub:</span>
                <strong className="text-on-surface">{activeCity}, CG</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLocationModal();
                }}
                className="text-primary font-bold text-xs hover:underline"
              >
                Change
              </button>
            </div>
          </div>

          {/* Main Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-3 pb-1">
              Explore Phoneo
            </div>

            <button
              type="button"
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'home'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>Marketplace / Home</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('catalog')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'catalog' || activeTab === 'device-detail'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">smartphone</span>
              <span>All Certified Phones</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('stores')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'stores'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">apartment</span>
              <span>Verified Partner Stores</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('auctions', 'retailer')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'auctions' && rolePerspective === 'retailer'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">gavel</span>
              <div className="flex-1 flex items-center justify-between">
                <span>Live Shopkeeper Auctions</span>
                <span className="px-1.5 py-0.2 rounded bg-error/10 text-error text-[10px] font-bold">
                  LIVE
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('auctions', 'seller')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'auctions' && rolePerspective === 'seller'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
              <span>Sell Used Phone (Instant Bids)</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('account')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'account'
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span>My Account &amp; Held Devices</span>
            </button>
          </nav>

          {/* Become a Seller Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-surface-container-low border border-primary/20 space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
              <span className="font-bold text-xs uppercase tracking-wider text-primary">
                Phoneo Partner CRM
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you an offline smartphone retailer? Register your shop on Phoneo Seller CRM to bid on customer buybacks &amp; manage GST inventory.
            </p>
            <a
              href="https://seller.phoneo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:brightness-105 transition-all"
            >
              <span>Become a Seller Portal</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>

          {/* City Network Quick Switcher */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider px-1">
              Select City Network
            </div>
            <div className="grid grid-cols-2 gap-2">
              {CITIES.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => {
                    onSelectCity(c.name);
                    onClose();
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-all border ${
                    c.name === activeCity
                      ? 'border-primary bg-primary/10 text-primary font-bold'
                      : 'border-outline-variant/30 bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                  }`}
                >
                  <div className="truncate">{c.name}</div>
                  <div className="text-[10px] text-on-surface-variant">{c.stores} Stores</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Drawer Footer */}
        <div className="p-6 border-t border-outline-variant/20 bg-surface-container-low/50 space-y-2">
          <div className="flex items-center justify-between text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
              32-Point Inspected
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px] text-primary">shield</span>
              6M Warranty
            </span>
          </div>
          <div className="text-[11px] text-on-surface-variant text-center pt-1">
            © 2026 Phoneo Technologies • seller.phoneo.in
          </div>
        </div>
      </aside>
    </div>
  );
};
