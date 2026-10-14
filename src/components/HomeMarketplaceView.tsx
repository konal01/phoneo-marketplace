import React, { useState, useMemo } from 'react';
import {
  AuctionItem,
  BRANDS,
  CITIES,
  CityName,
  FAQS,
  formatRupee,
  formatTimeLeft,
  PARTNER_STORES,
  ProductItem,
} from '../data';
import { BrandLogo } from './BrandLogos';
import { SellerContactButtons } from './SellerContactButtons';

interface HomeMarketplaceViewProps {
  isMobileMode: boolean;
  activeCity: CityName;
  onSelectCity: (city: CityName) => void;
  onOpenLocationSheet: () => void;
  onNavigate: (tab: 'home' | 'auctions' | 'stores' | 'account', subMode?: 'seller' | 'retailer') => void;
  onSelectStore: (storeId: string) => void;
  onOpenStartAuctionModal: (prefillModel?: string) => void;
  onOpenReserveModal: (product: ProductItem) => void;
  onOpenInspectModal: (product: ProductItem) => void;
  onOpenCatalog?: () => void;
  onOpenPhoneDetail?: (product: ProductItem) => void;
  auctions: AuctionItem[];
  products: ProductItem[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  showToast: (title: string, desc: string) => void;
  heroSecondsLeft: number;
}

export const HomeMarketplaceView: React.FC<HomeMarketplaceViewProps> = ({
  isMobileMode,
  activeCity,
  onSelectCity,
  onOpenLocationSheet,
  onNavigate,
  onSelectStore,
  onOpenStartAuctionModal,
  onOpenReserveModal,
  onOpenInspectModal,
  onOpenCatalog,
  onOpenPhoneDetail,
  auctions,
  products,
  wishlist,
  onToggleWishlist,
  showToast,
  heroSecondsLeft,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  const [selectedQuickFilter, setSelectedQuickFilter] = useState<string>('All Inventory');
  const [openFaqIndices, setOpenFaqIndices] = useState<number[]>([0]);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // Filtered products
  const filteredProducts = products.filter((p) => {
    if (selectedBrandFilter !== 'All' && p.brand !== selectedBrandFilter) return false;
    if (selectedQuickFilter === 'Flagship iPhones' && p.brand !== 'Apple') return false;
    if (selectedQuickFilter === 'Under ₹25,000' && p.price > 25000) return false;
    if (selectedQuickFilter === 'Under 6 Mo. Old' && p.grade !== 'Pristine' && p.grade !== 'Mint Grade') return false;
    if (
      searchQuery.trim() &&
      !p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.brand.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.specs.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Featured spotlight products for Hero showcase
  const spotlightProducts = useMemo(() => {
    const picks = [
      products.find((p) => p.brand === 'Apple' && (p.grade === 'Pristine' || p.grade === 'Mint Grade')) ||
        products.find((p) => p.brand === 'Apple'),
      products.find((p) => p.brand === 'Samsung' && p.price > 40000) ||
        products.find((p) => p.brand === 'Samsung'),
      products.find((p) => p.brand === 'OnePlus') ||
        products.find((p) => p.brand === 'Google Pixel'),
    ].filter(Boolean) as ProductItem[];

    return picks.length > 0 ? picks : products.slice(0, 3);
  }, [products]);

  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const activeSpotlight = spotlightProducts[spotlightIndex] || products[0];

  // ==================== MOBILE VIEW (Matches Stitch Screen 86eb2dcdc2f64d94941a7b61ff468fdd) ====================
  if (isMobileMode) {
    return (
      <div className="flex flex-col w-full pb-8">
        {/* Search & Location Bar */}
        <section className="px-margin-mobile pt-space-xs pb-space-sm">
          <div className="relative flex items-center bg-white/85 backdrop-blur-xl rounded-full shadow-[0_8px_24px_rgba(0,106,97,0.1),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/90 p-1.5 transition-all focus-within:shadow-[0_12px_32px_rgba(0,106,97,0.18)] focus-within:ring-2 focus-within:ring-primary/25">
            <span className="material-symbols-outlined text-outline ml-3 mr-2 text-[22px]">search</span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none min-w-0"
              placeholder="Search iPhone 14, S23, OnePlus, 5G..."
              type="text"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-outline mr-1 p-1 hover:text-on-surface transition-colors"
                type="button"
                aria-label="Clear search"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
            <button
              aria-label="Submit search"
              onClick={() =>
                showToast('Inventory Filtered', `Showing matches in ${activeCity} hub`)
              }
              className="bg-gradient-to-r from-primary to-teal-700 text-on-primary w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_4px_12px_rgba(0,106,97,0.35)] active:scale-95 transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          {/* Active City Micro Bar with Quick Filter Tags */}
          <div className="flex items-center justify-between gap-space-xs mt-2.5 px-1">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <button
                type="button"
                onClick={() =>
                  setSelectedQuickFilter((prev) =>
                    prev === 'Under ₹25,000' ? 'All Inventory' : 'Under ₹25,000'
                  )
                }
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm flex-shrink-0 transition-all ${
                  selectedQuickFilter === 'Under ₹25,000'
                    ? 'bg-gradient-to-r from-primary to-teal-700 text-on-primary shadow-[0_3px_10px_rgba(0,106,97,0.3)]'
                    : 'bg-white/80 hover:bg-white backdrop-blur-md text-on-surface-variant border border-slate-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.03)]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    selectedQuickFilter === 'Under ₹25,000' ? 'text-on-primary' : 'text-primary'
                  }`}
                >
                  bolt
                </span>{' '}
                Under ₹25,000
              </button>
              <button
                type="button"
                onClick={() =>
                  setSelectedQuickFilter((prev) =>
                    prev === 'Under 6 Mo. Old' ? 'All Inventory' : 'Under 6 Mo. Old'
                  )
                }
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full font-label-sm text-label-sm flex-shrink-0 transition-all ${
                  selectedQuickFilter === 'Under 6 Mo. Old'
                    ? 'bg-gradient-to-r from-primary to-teal-700 text-on-primary shadow-[0_3px_10px_rgba(0,106,97,0.3)]'
                    : 'bg-white/80 hover:bg-white backdrop-blur-md text-on-surface-variant border border-slate-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.03)]'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[14px] ${
                    selectedQuickFilter === 'Under 6 Mo. Old' ? 'text-on-primary' : 'text-tertiary'
                  }`}
                >
                  verified
                </span>{' '}
                100% Battery
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auctions', 'seller')}
                className="inline-flex items-center gap-1 bg-white/80 hover:bg-white backdrop-blur-md px-3 py-1 rounded-full text-on-surface-variant font-label-sm text-label-sm flex-shrink-0 border border-slate-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.03)]"
              >
                <span className="material-symbols-outlined text-primary text-[14px]">sync_alt</span>{' '}
                Exchange Deal
              </button>
            </div>
            <button
              className="flex items-center gap-1 text-primary font-label-md text-label-md flex-shrink-0 pl-1"
              onClick={onOpenLocationSheet}
              type="button"
            >
              <span>{activeCity}</span>
              <span className="material-symbols-outlined text-[16px]">expand_more</span>
            </button>
          </div>
        </section>

        {/* Popular Brands Reel */}
        <section className="mt-space-xs mb-space-sm">
          <div className="px-margin-mobile flex items-center justify-between mb-2">
            <span className="font-title-sm text-title-sm text-on-surface">Popular Brands</span>
            <button
              onClick={() => {
                if (onOpenCatalog) {
                  onOpenCatalog();
                } else {
                  setSelectedBrandFilter('All');
                  setSelectedQuickFilter('All Inventory');
                }
              }}
              className="font-label-sm text-label-sm text-primary flex items-center font-bold"
              type="button"
            >
              View All Phones{' '}
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            </button>
          </div>
          <div className="flex gap-space-sm overflow-x-auto px-margin-mobile no-scrollbar pb-1">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrandFilter === brand.name;
              return (
                <button
                  key={brand.name}
                  type="button"
                  onClick={() =>
                    setSelectedBrandFilter((prev) => (prev === brand.name ? 'All' : brand.name))
                  }
                  className="flex flex-col items-center gap-1.5 flex-shrink-0 group"
                >
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center p-2.5 group-active:scale-95 transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-primary to-teal-700 text-on-primary ring-2 ring-primary/30 shadow-[0_6px_16px_rgba(0,106,97,0.3)]'
                        : 'bg-white/90 hover:bg-white backdrop-blur-md border border-slate-200/60 shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)]'
                    }`}
                  >
                    <BrandLogo
                      brand={brand.name}
                      className="w-8 h-8"
                      mono={isSelected}
                    />
                  </div>
                  <span
                    className={`font-label-sm text-label-sm ${
                      isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {brand.name === 'Google Pixel' ? 'Pixel' : brand.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Become a Seller CTA Banner (leads to seller.phoneo.in) */}
        <section className="px-margin-mobile mb-space-sm">
          <div className="p-3.5 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/90 flex items-center justify-between gap-2 shadow-[0_6px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[18px]">storefront</span>
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-on-surface truncate">Are you a mobile retailer?</div>
                <div className="text-[10px] text-on-surface-variant truncate">Register your shop on Phoneo Seller CRM</div>
              </div>
            </div>
            <a
              href="https://seller.phoneo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-primary to-teal-700 text-on-primary font-bold text-[11px] shrink-0 flex items-center gap-1 hover:brightness-105 transition-all shadow-[0_3px_10px_rgba(0,106,97,0.3)] active:scale-95"
            >
              <span>Become a Seller</span>
              <span className="material-symbols-outlined text-[12px]">open_in_new</span>
            </a>
          </div>
        </section>

        {/* Mobile Hero Feature: Certified Flagship Deals Showcase with Glassmorphism */}
        <section className="px-margin-mobile mb-space-md">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#004d46] via-[#006a61] to-[#0f2438] backdrop-blur-2xl p-5 text-white shadow-[0_20px_50px_rgba(0,106,97,0.35),inset_0_1px_1px_rgba(255,255,255,0.2)] border border-white/20">
            {/* Ambient glows */}
            <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-primary-container/25 blur-3xl pointer-events-none"></div>
            <div className="absolute -left-10 -top-10 w-40 h-40 rounded-full bg-teal-400/15 blur-2xl pointer-events-none"></div>

            <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
              <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-teal-200 font-bold text-[11px] shadow-[0_2px_8px_rgba(0,0,0,0.15)] border border-white/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Certified Deals in {activeCity}
              </span>
              <span className="text-[11px] font-semibold text-teal-200/95 flex items-center gap-1 bg-white/10 backdrop-blur-sm px-2.5 py-0.5 rounded-full border border-white/10 shadow-xs">
                <span className="material-symbols-outlined text-[13px]">verified</span>
                32-Pt Tested
              </span>
            </div>

            <h2 className="text-2xl font-black text-white leading-tight mb-1.5 relative z-10 tracking-tight">
              Buy Second-Hand Phones.
            </h2>
            <p className="text-xs text-teal-100/90 max-w-[280px] mb-3.5 relative z-10 leading-relaxed">
              Tested phones with 6-month warranty from trusted local shops in {activeCity}. Try before you pay.
            </p>

            {/* Spotlight Mini Deal Card with Frosted Glass */}
            {activeSpotlight && (
              <div
                onClick={() => {
                  if (onOpenPhoneDetail) {
                    onOpenPhoneDetail(activeSpotlight);
                  } else {
                    onOpenInspectModal(activeSpotlight);
                  }
                }}
                className="bg-white/15 hover:bg-white/25 backdrop-blur-xl rounded-2xl p-3 mb-3.5 flex items-center justify-between gap-3 border border-white/25 shadow-[0_10px_25px_rgba(0,0,0,0.18),inset_0_1px_1px_rgba(255,255,255,0.25)] cursor-pointer active:scale-[0.99] transition-all relative z-10"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md p-1 flex items-center justify-center shrink-0 shadow-xs border border-white/20">
                    <img
                      alt={activeSpotlight.name}
                      src={activeSpotlight.image}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-xs text-white truncate">{activeSpotlight.name}</div>
                    <div className="text-[10px] text-teal-200/95 truncate">
                      {activeSpotlight.storeName} • {activeSpotlight.grade}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-extrabold text-sm text-white drop-shadow-sm">{formatRupee(activeSpotlight.price)}</div>
                  <div className="text-[10px] text-emerald-300 font-extrabold">-{activeSpotlight.discountPercent}% OFF</div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5 relative z-10">
              <button
                onClick={() => {
                  if (onOpenCatalog) {
                    onOpenCatalog();
                  } else {
                    setSelectedBrandFilter('All');
                    setSelectedQuickFilter('All Inventory');
                  }
                }}
                className="flex-1 bg-gradient-to-r from-primary-container to-teal-400 text-on-primary-container font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-[0_8px_20px_rgba(0,196,180,0.35)] active:scale-95 transition-transform flex items-center justify-center gap-1.5"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                <span>Browse All Phones</span>
              </button>
              <button
                onClick={() => onNavigate('stores')}
                className="bg-white/15 hover:bg-white/25 text-white font-bold text-xs py-2.5 px-3.5 rounded-xl backdrop-blur-md border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:scale-95 transition-transform flex items-center justify-center gap-1 shrink-0"
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>50+ Shops</span>
              </button>
            </div>
          </div>
        </section>

        {/* Dual Primary Action Hub */}
        <section className="px-margin-mobile mb-space-md grid grid-cols-2 gap-gutter-mobile">
          {/* Sell Action Card */}
          <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="w-8 h-8 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-[20px]">currency_rupee</span>
            </div>
            <div>
              <span className="font-title-sm text-title-sm text-on-surface block leading-tight">
                Sell Old Mobile
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                Instant valuation &amp; 2-hr shopkeeper bidding
              </span>
            </div>
            <button
              onClick={() => onNavigate('auctions', 'seller')}
              type="button"
              className="mt-3 w-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-sm text-label-sm py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span>Get Price</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>

          {/* Buy Action Card */}
          <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="relative -mx-space-sm -mt-space-sm mb-2 h-24 overflow-hidden">
              <img
                src="/second-hand-phones.png"
                alt="Certified pre-owned smartphones: Pixel, Galaxy, OnePlus and iPhone"
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute top-2 left-2 w-7 h-7 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-[16px]">verified_user</span>
              </div>
            </div>
            <div>
              <span className="font-title-sm text-title-sm text-on-surface block leading-tight">
                Buy Certified
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">
                32-point check, 6mo warranty &amp; bill
              </span>
            </div>
            <button
              onClick={() => onNavigate('stores')}
              type="button"
              className="mt-3 w-full bg-surface-container-high hover:bg-surface-container text-on-surface font-label-sm text-label-sm py-2 rounded-xl flex items-center justify-center gap-1 active:scale-95 transition-transform"
            >
              <span>Explore Stock</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Live Auction Ticker Widget */}
        <section className="mb-space-md">
          <div className="px-margin-mobile flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
              <span className="font-title-sm text-title-sm text-on-surface">
                Live Shopkeeper Auctions
              </span>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('auctions', 'retailer')}
              className="font-label-sm text-label-sm text-primary"
            >
              {activeCity} &amp; Durg →
            </button>
          </div>
          {/* Horizontal Auction Reels */}
          <div className="flex gap-space-sm overflow-x-auto px-margin-mobile no-scrollbar pb-1">
            {auctions.map((auc) => (
              <div
                key={auc.id}
                onClick={() => onNavigate('auctions', 'retailer')}
                className="min-w-[270px] max-w-[270px] bg-surface-container-lowest rounded-2xl p-space-sm shadow-sm flex flex-col justify-between flex-shrink-0 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-error/10 text-error font-label-sm text-[11px] px-2 py-0.5 rounded-full flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">timer</span>{' '}
                      {formatTimeLeft(auc.secondsLeft)}
                    </span>
                    <span className="text-on-surface-variant font-label-sm text-label-sm">
                      {auc.totalBids} Bids
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <img
                      alt={auc.model}
                      className="w-14 h-14 rounded-xl object-cover bg-surface-container-low flex-shrink-0"
                      src={auc.image}
                    />
                    <div className="min-w-0">
                      <h3 className="font-title-sm text-title-sm text-on-surface truncate">
                        {auc.model}
                      </h3>
                      <p className="font-body-sm text-body-sm text-outline truncate">{auc.specs}</p>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="font-headline-sm text-headline-sm text-primary">
                          {formatRupee(auc.highestBid)}
                        </span>
                        <span className="font-label-sm text-[10px] text-on-surface-variant">
                          Highest Bid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3 pt-2.5 bg-surface-container-low rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-tertiary text-[16px]">
                      storefront
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface truncate">
                      {auc.leadingStore}
                    </span>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5">
                    View <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Verified Deals Near You (Product Cards) */}
        <section className="px-margin-mobile mb-space-md">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-title-md text-title-md text-on-surface">
                Verified Deals Near You
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Inspected second-hand devices ready for pickup
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('stores')}
              className="font-label-sm text-label-sm text-primary flex items-center gap-1"
            >
              Filter <span className="material-symbols-outlined text-[16px]">tune</span>
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            {filteredProducts.slice(0, 6).map((item) => {
              const isSaved = wishlist.includes(item.id);
              return (
                <div
                  key={item.id}
                  className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm flex flex-col gap-2 relative"
                >
                  <div className="flex gap-3">
                    <div
                      onClick={() => {
                        if (onOpenPhoneDetail) onOpenPhoneDetail(item);
                        else onOpenInspectModal(item);
                      }}
                      className="relative w-24 h-24 rounded-xl overflow-hidden bg-surface-container-low flex-shrink-0 cursor-pointer"
                    >
                      <img
                        alt={item.name}
                        className="w-full h-full object-cover"
                        src={item.image}
                      />
                      <span className="absolute top-1 left-1 bg-primary text-on-primary font-label-sm text-[9px] px-1.5 py-0.5 rounded-full">
                        {item.grade}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between">
                          <h3
                            onClick={() => {
                              if (onOpenPhoneDetail) onOpenPhoneDetail(item);
                              else onOpenInspectModal(item);
                            }}
                            className="font-title-sm text-title-sm text-on-surface truncate cursor-pointer hover:text-primary"
                          >
                            {item.name}
                          </h3>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(item.id)}
                            aria-label="Add to wishlist"
                            className={`transition-colors ${
                              isSaved ? 'text-error' : 'text-outline hover:text-error'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isSaved ? 'filled' : ''
                              }`}
                            >
                              favorite
                            </span>
                          </button>
                        </div>
                        <p className="font-body-sm text-body-sm text-outline mt-0.5 truncate">
                          {item.specs}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-headline-sm text-headline-sm text-on-surface">
                            {formatRupee(item.price)}
                          </span>
                          <span className="font-body-sm text-body-sm text-outline line-through">
                            {formatRupee(item.originalPrice)}
                          </span>
                          <span className="font-label-sm text-label-sm text-primary">
                            {item.discountPercent}% off
                          </span>
                        </div>
                      </div>
                      {/* Seller Tag */}
                      <div
                        onClick={() => onNavigate('stores')}
                        className="flex items-center gap-1.5 text-on-surface-variant text-[11px] font-label-sm mt-1 cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-primary text-[14px]">
                          storefront
                        </span>
                        <span className="truncate">
                          {item.storeName} • {item.storeArea} • {item.distance}
                        </span>
                        <span className="flex items-center text-tertiary ml-auto flex-shrink-0 font-bold">
                          ★ {item.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 pt-2 bg-surface-container-low/50 -mx-space-sm -mb-space-sm p-space-sm rounded-b-2xl">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 text-[11px] font-label-sm text-primary flex-1 min-w-0">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        <span className="truncate">{item.inspectionNote}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenReserveModal(item)}
                        className="bg-surface-container-high text-on-surface font-label-sm text-label-sm px-3 py-1.5 rounded-full active:scale-95 transition-transform flex-shrink-0"
                      >
                        Chat / Buy
                      </button>
                    </div>
                    <SellerContactButtons product={item} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Exchange & Instant Upgrade Callout */}
        <section className="px-margin-mobile mb-space-md">
          <div className="bg-surface-container-low p-space-md rounded-2xl flex items-center justify-between gap-space-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">
                  published_with_changes
                </span>
              </div>
              <div>
                <h4 className="font-title-sm text-title-sm text-on-surface">
                  Exchange Old for New
                </h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Top-up exchange deals with nearby verified stores
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('auctions', 'seller')}
              className="bg-surface-container-lowest text-primary font-label-sm text-label-sm px-3 py-2 rounded-xl shadow-sm flex items-center gap-1 flex-shrink-0"
            >
              Calculate <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </section>

        {/* Why Choose Phoneo? Value Props */}
        <section className="px-margin-mobile mb-space-md">
          <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm">
            <div className="text-center mb-4">
              <span className="text-primary font-label-sm text-label-sm uppercase tracking-wider">
                The Recommerce Standard
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface mt-0.5">
                Why Choose Phoneo?
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                <span className="material-symbols-outlined text-primary text-[24px]">verified</span>
                <span className="font-label-md text-label-md text-on-surface">
                  100% Verified Sellers
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                  Zero fake profiles or scam listings. Only KYC-certified local shops.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[24px]">
                  handshake
                </span>
                <span className="font-label-md text-label-md text-on-surface">0% Commission</span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                  Direct customer to shopkeeper deal. No middleman charges.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                <span className="material-symbols-outlined text-primary text-[24px]">gavel</span>
                <span className="font-label-md text-label-md text-on-surface">
                  Live Shop Bidding
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                  Multiple local vendors bid for your old smartphone in 30 mins.
                </p>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-1.5">
                <span className="material-symbols-outlined text-tertiary text-[24px]">
                  location_city
                </span>
                <span className="font-label-md text-label-md text-on-surface">
                  City-Wide Network
                </span>
                <p className="font-body-sm text-body-sm text-on-surface-variant text-[11px] leading-tight">
                  Explore nearby shops in Raipur, Bhilai, Durg, Bilaspur &amp; more.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* City Coverage Grid Section */}
        <section className="px-margin-mobile mb-space-md">
          <div className="flex items-center justify-between mb-2">
            <span className="font-title-sm text-title-sm text-on-surface">
              Live in Central India
            </span>
            <span className="font-label-sm text-label-sm text-outline">6 Cities</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {CITIES.map((c) => {
              const isCurrent = c.name === activeCity;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onSelectCity(c.name)}
                  className={`p-2 rounded-xl text-center shadow-sm transition-all ${
                    isCurrent
                      ? 'bg-primary/15 ring-1 ring-primary'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-primary text-[20px] mb-1">
                    {c.icon}
                  </span>
                  <span className="font-label-md text-label-md text-on-surface block truncate">
                    {c.name}
                  </span>
                  <span className="font-body-sm text-[10px] text-outline">{c.stores} Stores</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Interactive Accordion SEO / Info Modules */}
        <section className="px-margin-mobile mb-space-lg flex flex-col gap-2">
          {FAQS.slice(0, 2).map((faq, idx) => {
            const isOpen = openFaqIndices.includes(idx);
            return (
              <div
                key={faq.q}
                className="bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden"
              >
                <button
                  className="w-full p-space-sm flex items-center justify-between text-left"
                  onClick={() => toggleFaq(idx)}
                  type="button"
                >
                  <span className="font-title-sm text-title-sm text-on-surface">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-outline transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="px-space-sm pb-space-sm text-on-surface-variant font-body-sm text-body-sm">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      </div>
    );
  }

  // ==================== DESKTOP VIEW (Matches Stitch Screen 72cec821e88a47598cb96bf17ce44918) ====================
  return (
    <div className="flex flex-col w-full">
      {/* Top Broadcast Bar */}
      <section className="w-full bg-surface-container-high py-2.5 px-6 border-b border-surface-container">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-container text-on-primary-container">
              <span className="material-symbols-outlined text-[14px]">bolt</span>
            </span>
            <span className="font-label-md text-label-md text-on-surface">
              <strong>{activeCity} &amp; Bhilai Hub:</strong> 52 verified mobile retailers with 180+
              certified smartphones ready for in-store trial today.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 font-label-sm text-label-sm text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span>Save 40% – 60% vs. Brand New MRP</span>
            </div>
            <span className="text-outline-variant hidden sm:inline">•</span>
            <button
              type="button"
              onClick={onOpenLocationSheet}
              className="font-label-sm text-label-sm text-on-surface-variant hover:text-primary transition-colors flex items-center gap-0.5"
            >
              <span>Change Hub ({activeCity})</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </section>

      {/* Hero Section: Modern Verified Flagship Marketplace Hero */}
      <section className="relative w-full py-12 px-6 lg:px-12 bg-gradient-to-b from-surface via-surface to-surface-container-low/40 overflow-hidden">
        {/* Ambient atmospheric glows */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full bg-primary/5 blur-3xl pointer-events-none -z-0"></div>
        <div className="absolute top-10 right-20 w-80 h-80 rounded-full bg-primary-container/10 blur-3xl pointer-events-none -z-0"></div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
          {/* Left Column: Proposition, Instant Search & Trust Signals */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-bold text-xs uppercase tracking-wider shadow-xs">
                <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
                <span>Verified Pre-Owned Phones in {activeCity}</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-on-surface tracking-tight leading-[1.12]">
                Buy Second-Hand Phones.{' '}
                <span className="bg-gradient-to-r from-primary via-teal-600 to-teal-500 bg-clip-text text-transparent">
                  From Trusted Local Stores.
                </span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl leading-relaxed text-base sm:text-lg">
                Fully tested phones with 6-month warranty. Walk into top-rated shops in {activeCity} to test in-store before you pay.
              </p>
            </div>

            {/* Interactive Hero Search & Instant Filter Bar with Glassmorphism */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-3 shadow-[0_20px_50px_-15px_rgba(0,106,97,0.14),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 max-w-2xl">
              <div className="flex items-center gap-2">
                <div className="flex items-center flex-1 px-3.5 py-2.5 bg-slate-50/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] focus-within:bg-white focus-within:border-primary/50 transition-all">
                  <span className="material-symbols-outlined text-outline text-[22px] mr-2">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const el = document.getElementById('marketplace');
                        el?.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    placeholder={`Search iPhone 14 Pro, S23, OnePlus, under ₹25k in ${activeCity}...`}
                    className="w-full bg-transparent text-on-surface placeholder:text-outline text-sm font-medium focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-outline hover:text-on-surface ml-1"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('marketplace');
                    el?.scrollIntoView({ behavior: 'smooth' });
                    showToast('Searching Devices', `Browsing inventory in ${activeCity}`);
                  }}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-primary to-teal-700 hover:brightness-105 text-on-primary font-bold text-sm shadow-[0_8px_20px_rgba(0,106,97,0.35)] hover:shadow-[0_12px_28px_rgba(0,106,97,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Explore Phones</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>

              {/* Quick Filter Pills */}
              <div className="flex items-center gap-2 mt-2.5 px-1 pt-1 overflow-x-auto no-scrollbar">
                <span className="text-[11px] font-bold text-outline uppercase tracking-wider shrink-0">Popular:</span>
                {[
                  { label: 'iPhone 14 Pro', brand: 'Apple', filter: 'Flagship iPhones' },
                  { label: 'Under ₹25,000', brand: 'All', filter: 'Under ₹25,000' },
                  { label: '100% Battery', brand: 'All', filter: 'Under 6 Mo. Old' },
                  { label: 'Samsung S23', brand: 'Samsung', filter: 'All Inventory' },
                  { label: 'OnePlus 5G', brand: 'OnePlus', filter: 'All Inventory' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSelectedBrandFilter(item.brand);
                      setSelectedQuickFilter(item.filter);
                      const el = document.getElementById('marketplace');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3 py-1 rounded-full bg-white/80 hover:bg-white backdrop-blur-sm border border-slate-200/60 shadow-[0_2px_6px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,106,97,0.1)] hover:-translate-y-0.5 text-on-surface-variant hover:text-on-surface text-[11px] font-semibold transition-all shrink-0 flex items-center gap-1"
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (onOpenCatalog) {
                    onOpenCatalog();
                  } else {
                    const el = document.getElementById('marketplace');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary via-[#00766c] to-teal-700 text-on-primary font-bold text-sm shadow-[0_10px_25px_rgba(0,106,97,0.35),inset_0_1px_1px_rgba(255,255,255,0.25)] hover:shadow-[0_14px_32px_rgba(0,106,97,0.45)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                <span>Browse All Inventory</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('stores')}
                className="px-6 py-3.5 rounded-2xl bg-white/85 hover:bg-white backdrop-blur-xl border border-white/90 text-on-surface font-bold text-sm shadow-[0_6px_20px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px] text-primary">storefront</span>
                <span>View 50+ Local Shops</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('auctions', 'seller')}
                className="px-4 py-3.5 rounded-2xl bg-white/70 hover:bg-white backdrop-blur-md border border-white/70 text-on-surface-variant font-semibold text-sm shadow-[0_4px_14px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                <span>Sell / Exchange Old Phone</span>
              </button>
            </div>

            {/* Trust Mini Strips (4-Column) with Frosted Glass & Box Shadows */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_16px_36px_rgba(0,106,97,0.12)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
                <div>
                  <p className="font-title-sm text-title-sm text-on-surface leading-tight font-bold">32-Point Check</p>
                  <p className="text-[11px] text-on-surface-variant">Diagnostics verified</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_16px_36px_rgba(0,106,97,0.12)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-[22px]">security</span>
                <div>
                  <p className="font-title-sm text-title-sm text-on-surface leading-tight font-bold">6-Mo. Warranty</p>
                  <p className="text-[11px] text-on-surface-variant">Store backed claim</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_16px_36px_rgba(0,106,97,0.12)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-[22px]">receipt_long</span>
                <div>
                  <p className="font-title-sm text-title-sm text-on-surface leading-tight font-bold">GST Bill &amp; Box</p>
                  <p className="text-[11px] text-on-surface-variant">Legit safe resale</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 hover:bg-white backdrop-blur-xl border border-white/90 shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_16px_36px_rgba(0,106,97,0.12)] hover:-translate-y-1 transition-all duration-300">
                <span className="material-symbols-outlined text-primary text-[22px]">store</span>
                <div>
                  <p className="font-title-sm text-title-sm text-on-surface leading-tight font-bold">Test In-Store</p>
                  <p className="text-[11px] text-on-surface-variant">Zero advance fee</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Featured Deal Spotlight with Glassmorphism & High-Depth Box Shadows */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="relative bg-white/85 backdrop-blur-2xl rounded-[32px] p-6 sm:p-7 shadow-[0_28px_75px_-12px_rgba(0,106,97,0.28),0_10px_25px_rgba(0,106,97,0.15),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-teal-900/10 flex flex-col justify-between flex-1 overflow-hidden transition-all duration-300 group hover:shadow-[0_35px_90px_-10px_rgba(0,106,97,0.36),0_12px_30px_rgba(0,106,97,0.22)]">
              {/* Backlight glowing ambient halos */}
              <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-gradient-to-br from-primary-container/25 to-primary/20 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full bg-teal-400/15 blur-3xl pointer-events-none"></div>

              {/* Top Bar: Live Status & Model Switcher */}
              <div className="space-y-3 z-10">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50/90 backdrop-blur-sm text-emerald-800 border border-emerald-200/80 font-bold text-xs shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    FEATURED VERIFIED DEAL
                  </span>
                  <span className="text-xs font-bold text-on-surface-variant flex items-center gap-1 bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/80 shadow-xs">
                    <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                    {activeSpotlight.storeArea}, {activeCity}
                  </span>
                </div>

                {/* Model switcher tabs with frosted bevel */}
                <div className="flex items-center gap-1 p-1 bg-slate-100/70 backdrop-blur-md rounded-2xl shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] border border-slate-200/50">
                  {spotlightProducts.map((item, idx) => {
                    const isSelected = idx === spotlightIndex;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSpotlightIndex(idx)}
                        className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all truncate text-center ${
                          isSelected
                            ? 'bg-white text-primary shadow-[0_4px_12px_rgba(0,0,0,0.08)] ring-1 ring-primary/20'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {item.name.replace(/(\(|\d+GB|5G).*/g, '').trim()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Product Visual & Badges with Glassmorphic Inset */}
              <div className="my-5 flex flex-col items-center text-center z-10 relative">
                <div className="w-52 h-52 rounded-3xl overflow-hidden mb-3 bg-gradient-to-b from-white/95 to-slate-50/80 backdrop-blur-md flex items-center justify-center p-3 relative shadow-[0_12px_32px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/90">
                  <img
                    alt={activeSpotlight.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    src={activeSpotlight.image}
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between px-2.5 py-1 rounded-xl bg-white/90 backdrop-blur-md text-[10px] font-bold text-on-surface shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-white/80">
                    <span className="flex items-center gap-1 text-primary">
                      <span className="material-symbols-outlined text-[12px]">verified</span>
                      32-Pt Passed
                    </span>
                    <span className="text-emerald-700 font-extrabold">Save {activeSpotlight.discountPercent}%</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-secondary-container font-bold text-[11px] text-on-secondary-container shadow-xs">
                    {activeSpotlight.grade}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 font-semibold text-[11px] text-on-surface-variant shadow-xs">
                    {activeSpotlight.batteryOrFeature}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200/60 font-semibold text-[11px] text-on-surface-variant shadow-xs">
                    {activeSpotlight.storage}
                  </span>
                </div>

                <h2 className="font-headline-md text-headline-md text-on-surface font-extrabold tracking-tight">
                  {activeSpotlight.name}
                </h2>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-on-surface-variant">
                  <span className="font-semibold text-on-surface">{activeSpotlight.storeName}</span>
                  <span>•</span>
                  <span className="text-amber-600 font-bold flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[13px] filled">star</span>
                    {activeSpotlight.rating} (Verified Shop)
                  </span>
                </div>
              </div>

              {/* Price & Guarantee Card with Frosted Glass Layer */}
              <div className="bg-white/75 backdrop-blur-xl rounded-2xl p-4 border border-white/80 shadow-[0_8px_25px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] space-y-2.5 z-10">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                      {formatRupee(activeSpotlight.price)}
                    </span>
                    <span className="font-body-sm text-body-sm text-outline line-through ml-2">
                      {formatRupee(activeSpotlight.originalPrice)}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs shadow-xs border border-primary/20">
                    Save {formatRupee(activeSpotlight.originalPrice - activeSpotlight.price)}
                  </span>
                </div>
                <div className="text-[11px] text-on-surface-variant flex items-center justify-between border-t border-slate-200/60 pt-2">
                  <span className="flex items-center gap-1 text-primary font-semibold">
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    Same-day pickup / delivery
                  </span>
                  <span className="flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[14px] text-tertiary">verified_user</span>
                    {activeSpotlight.warranty}
                  </span>
                </div>
              </div>

              {/* Interactive Contact & Details CTA with Elevated Shadows */}
              <div className="mt-4 space-y-2.5 z-10">
                <SellerContactButtons product={activeSpotlight} size="md" className="w-full shadow-sm" />
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenPhoneDetail) {
                      onOpenPhoneDetail(activeSpotlight);
                    } else {
                      onOpenInspectModal(activeSpotlight);
                    }
                  }}
                  className="w-full py-2.5 rounded-xl bg-white/90 hover:bg-white backdrop-blur-md text-on-surface font-bold text-xs border border-white/90 shadow-[0_4px_14px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px] text-primary">verified</span>
                  <span>View Full Specs &amp; Inspection Report</span>
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Brands Strip */}
      <section className="w-full py-8 px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
                Catalogue
              </span>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Browse by Trusted Brands
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                if (onOpenCatalog) {
                  onOpenCatalog();
                } else {
                  setSelectedBrandFilter('All');
                  setSelectedQuickFilter('All Inventory');
                  document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="font-title-sm text-title-sm text-primary hover:text-on-primary-container transition-colors flex items-center gap-1 font-bold"
            >
              <span>View all 450+ phones</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {BRANDS.map((brand) => {
              const isSelected = selectedBrandFilter === brand.name;
              return (
                <button
                  key={brand.name}
                  type="button"
                  onClick={() => {
                    setSelectedBrandFilter((prev) => (prev === brand.name ? 'All' : brand.name));
                    document.getElementById('marketplace')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`group p-3.5 rounded-2xl transition-all flex flex-col items-center text-center ${
                    isSelected
                      ? 'bg-gradient-to-br from-primary/15 to-teal-700/10 ring-2 ring-primary shadow-[0_8px_20px_rgba(0,106,97,0.18)]'
                      : 'bg-white/85 hover:bg-white backdrop-blur-md border border-slate-200/60 shadow-[0_4px_14px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.9)] hover:shadow-[0_12px_28px_rgba(0,106,97,0.1)] hover:-translate-y-1'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-white/95 group-hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] border border-slate-100 flex items-center justify-center mb-2.5 transition-all p-2.5">
                    <BrandLogo
                      brand={brand.name}
                      className="w-7 h-7"
                      mono={isSelected}
                    />
                  </div>
                  <span className="font-title-sm text-title-sm text-on-surface group-hover:text-primary transition-colors font-bold">
                    {brand.name}
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px] mt-0.5">
                    {brand.stock} in stock
                  </span>
                </button>
              );
            })}
          </div>

          {/* Become a Seller Banner (leads to seller.phoneo.in) with Frosted Glass & Box Shadows */}
          <div className="mt-6 p-6 rounded-3xl bg-white/85 backdrop-blur-xl border border-white/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_8px_28px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/15 to-teal-500/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[26px]">storefront</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      Phoneo Partner CRM
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-on-surface-variant border border-slate-200/50">
                      seller.phoneo.in
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-on-surface">
                    Grow Your Offline Mobile Shop
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Access live customer trade-ins &amp; GST billing tools with zero commission fees
                  </p>
                </div>
              </div>
              <a
                href="https://seller.phoneo.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-primary to-teal-700 text-on-primary hover:brightness-105 font-bold text-xs shrink-0 shadow-[0_4px_14px_rgba(0,106,97,0.3)] hover:shadow-[0_6px_20px_rgba(0,106,97,0.4)] hover:-translate-y-0.5 flex items-center gap-1.5 transition-all active:scale-95"
              >
                <span>Become a Seller</span>
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </a>
            </div>
          </div>
        </section>

      {/* Live Shopkeeper Auction Ticker Grid */}
      <section className="w-full py-10 px-6 lg:px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
                <span className="font-label-sm text-label-sm text-tertiary uppercase tracking-wider font-bold">
                  Real-Time Bidding
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Active Shopkeeper Auctions in {activeCity} &amp; Durg
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Local retail partners submit competitive bids every 45 seconds. Sellers receive
                instant cash upon selection.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate('auctions', 'retailer')}
                className="px-3.5 py-1.5 rounded-full bg-surface-container-lowest font-label-md text-label-md text-on-surface shadow-sm hover:bg-surface-container transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">
                  filter_list
                </span>
                <span>All Live ({auctions.length + 15})</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenStartAuctionModal()}
                className="px-4 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors"
              >
                Start Auction For My Phone
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {auctions.slice(0, 3).map((auc) => (
              <div
                key={auc.id}
                className="bg-white/85 hover:bg-white backdrop-blur-xl rounded-3xl p-5 shadow-[0_14px_36px_-6px_rgba(0,106,97,0.2),0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_24px_50px_-6px_rgba(0,106,97,0.32),0_8px_20px_rgba(0,106,97,0.18)] border border-teal-900/10 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-800 border border-amber-300/50 font-label-sm text-label-sm font-bold flex items-center gap-1.5 shadow-xs">
                      <span className="material-symbols-outlined text-[13px] text-amber-600">schedule</span>{' '}
                      {formatTimeLeft(auc.secondsLeft)}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                      {auc.totalBids} shop bids
                    </span>
                  </div>
                  <div className="flex gap-4 items-center mb-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-white to-slate-50 flex items-center justify-center p-1.5 flex-shrink-0 overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] border border-slate-100">
                      <img
                        alt={auc.model}
                        className="w-full h-full object-cover rounded-xl"
                        src={auc.image}
                      />
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-extrabold leading-snug">
                        {auc.model}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant text-xs">
                        {auc.specs}
                      </p>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-slate-100 font-label-sm text-label-sm text-on-surface font-semibold text-[11px] border border-slate-200/50">
                        {auc.conditionBadge} • {auc.accessories[0]}
                      </span>
                    </div>
                  </div>
                  <div className="bg-slate-50/80 backdrop-blur-md p-4 rounded-2xl space-y-1 mb-4 border border-slate-200/60 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)]">
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-[10px] uppercase font-bold tracking-wider">
                      HIGHEST LIVE BID
                    </span>
                    <div className="flex items-baseline justify-between">
                      <span className="font-headline-md text-headline-md text-primary font-black">
                        {formatRupee(auc.highestBid)}
                      </span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                        {auc.leadingStoreArea}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant truncate text-xs">
                      Leading bidder: <span className="font-semibold text-on-surface">{auc.leadingStore}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
                  <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center gap-1 font-semibold">
                    <span className="material-symbols-outlined text-[15px] text-primary">
                      verified
                    </span>{' '}
                    Verified Seller
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate('auctions', 'retailer')}
                    className="font-title-sm text-title-sm text-primary hover:text-teal-700 font-bold transition-colors flex items-center gap-1 group"
                  >
                    <span>View Bids</span>
                    <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">north_east</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Verified Pre-Owned Deals Grid (4-Column Desktop) */}
      <section className="w-full py-12 px-6 lg:px-12 bg-surface" id="marketplace">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
                Local Verified Inventory
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Featured Certified Phones Ready in Store
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Pick up immediately in {activeCity}/Bhilai or get safe 2-hour doorstep delivery
                with return guarantee.
              </p>
            </div>
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {['All Inventory', 'Flagship iPhones', 'Under ₹25,000', 'Under 6 Mo. Old'].map(
                (pill) => {
                  const isActive = selectedQuickFilter === pill;
                  return (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => setSelectedQuickFilter(pill)}
                      className={`px-4 py-2 rounded-full font-label-md text-label-md whitespace-nowrap transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-teal-700 text-on-primary font-bold shadow-[0_4px_12px_rgba(0,106,97,0.3)]'
                          : 'bg-white/80 hover:bg-white backdrop-blur-md text-on-surface border border-slate-200/60 shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)]'
                      }`}
                    >
                      {pill}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.slice(0, 8).map((prod) => {
              const isSaved = wishlist.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="group bg-white/95 hover:bg-white backdrop-blur-xl rounded-3xl p-4 shadow-[0_14px_36px_-6px_rgba(0,106,97,0.22),0_4px_12px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_26px_55px_-6px_rgba(0,106,97,0.36),0_8px_22px_rgba(0,106,97,0.22)] border border-teal-900/15 hover:border-teal-700/50 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between relative"
                >
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1 items-start">
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-label-sm text-label-sm font-bold shadow-xs ${
                        prod.grade === 'Pristine' || prod.grade === 'Grade A+'
                          ? 'bg-gradient-to-r from-primary to-teal-700 text-on-primary'
                          : 'bg-slate-800 text-white'
                      }`}
                    >
                      {prod.grade}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/85 backdrop-blur-md border border-slate-200/60 font-label-sm text-label-sm text-on-surface font-semibold shadow-xs">
                      {prod.warranty}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleWishlist(prod.id)}
                    className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/85 hover:bg-white backdrop-blur-md shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/80 flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                      isSaved ? 'text-error' : 'text-on-surface-variant hover:text-error'
                    }`}
                    title="Save phone"
                  >
                    <span
                      className={`material-symbols-outlined text-[18px] ${
                        isSaved ? 'filled' : ''
                      }`}
                    >
                      favorite
                    </span>
                  </button>
                  <div>
                    <div
                      onClick={() => {
                        if (onOpenPhoneDetail) onOpenPhoneDetail(prod);
                        else onOpenInspectModal(prod);
                      }}
                      className="w-full h-48 bg-gradient-to-b from-white to-slate-50/80 rounded-2xl flex items-center justify-center p-3 mb-3.5 group-hover:scale-105 transition-transform cursor-pointer overflow-hidden shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)] border border-slate-100"
                    >
                      <img
                        alt={prod.name}
                        className="w-full h-full object-contain rounded drop-shadow-xs"
                        src={prod.image}
                      />
                    </div>
                    <h3
                      onClick={() => {
                        if (onOpenPhoneDetail) onOpenPhoneDetail(prod);
                        else onOpenInspectModal(prod);
                      }}
                      className="font-title-md text-title-md text-on-surface font-extrabold cursor-pointer hover:text-primary transition-colors leading-snug"
                    >
                      {prod.name}
                    </h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2 text-xs">
                      {prod.specs}
                    </p>
                    <div
                      onClick={() => onNavigate('stores')}
                      className="flex items-center gap-1.5 text-body-sm font-body-sm text-on-surface-variant mb-3 cursor-pointer hover:text-primary transition-colors"
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary">
                        storefront
                      </span>
                      <span className="truncate text-xs font-semibold">
                        {prod.storeName} ({prod.storeArea})
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="font-headline-md text-headline-md text-on-surface font-black">
                        {formatRupee(prod.price)}
                      </span>
                      <span className="font-body-sm text-body-sm text-on-surface-variant line-through text-xs">
                        {formatRupee(prod.originalPrice)}
                      </span>
                      <span className="font-label-sm text-label-sm text-primary font-bold">
                        {prod.discountPercent}% OFF
                      </span>
                    </div>
                    {/* View Deal Button (Reserve button removed) */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenPhoneDetail) onOpenPhoneDetail(prod);
                        else onOpenInspectModal(prod);
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-teal-700 hover:brightness-105 text-on-primary font-bold text-xs shadow-[0_4px_14px_rgba(0,106,97,0.3)] hover:shadow-[0_6px_20px_rgba(0,106,97,0.4)] hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[15px]">visibility</span>
                      <span>View Deal &amp; Inspection Specs</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                    <SellerContactButtons product={prod} size="md" className="mt-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How Phoneo Beats Resale Platforms (Comparison Table) */}
      <section className="w-full py-12 px-6 lg:px-12 bg-surface-container-low">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
              Transparent Re-Commerce
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Why Local Retailer Auctions Beat Traditional Portals
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              See how Phoneo removes middleman corporate markdowns and peer-to-peer safety risks.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full bg-surface-container-lowest rounded-xl shadow-sm text-left">
              <thead>
                <tr className="bg-surface-container">
                  <th className="p-4 font-title-sm text-title-sm text-on-surface">
                    Feature / Guarantee
                  </th>
                  <th className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
                      Phoneo Live Auctions
                    </span>
                  </th>
                  <th className="p-4 font-title-sm text-title-sm text-on-surface-variant">
                    Classified Portals (e.g. OLX)
                  </th>
                  <th className="p-4 font-title-sm text-title-sm text-on-surface-variant">
                    Corporate Buybacks (e.g. Cashify)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-container">
                <tr>
                  <td className="p-4 font-title-sm text-title-sm text-on-surface">
                    Sale Payout Model
                  </td>
                  <td className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high/40">
                    Multi-dealer competitive bidding (Maximum cash)
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Random chat bargain hunters
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Single fixed corporate offer (Heavy cut)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-title-sm text-title-sm text-on-surface">
                    Speed of Completion
                  </td>
                  <td className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high/40">
                    30 minutes auction + instant local handover
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Days to weeks of chatting &amp; no-shows
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    2-4 days delayed agent home visits
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-title-sm text-title-sm text-on-surface">
                    Last-Minute Price Drop Tricks
                  </td>
                  <td className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high/40">
                    Zero. Bound by auction policy
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Frequent renegotiation on meetup
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Agent chips off ₹3,000–₹6,000 at doorstep
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-title-sm text-title-sm text-on-surface">
                    Physical Store Verification
                  </td>
                  <td className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high/40">
                    100% GST-registered local stores you can visit
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Unknown strangers &amp; high theft risk
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Faceless warehouse routing
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-title-sm text-title-sm text-on-surface">
                    Buyer Warranty Coverage
                  </td>
                  <td className="p-4 font-title-sm text-title-sm text-primary bg-surface-container-high/40">
                    6 Months Phoneo Warranty + Local Store Claim
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    0 Days (As-is condition)
                  </td>
                  <td className="p-4 font-body-md text-body-md text-on-surface-variant">
                    Limited 3-6 months via postal service
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Explore Verified Partner Stores Across Central India */}
      <section className="w-full py-12 px-6 lg:px-12 bg-surface">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div>
              <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider font-bold">
                Local Community Hub
              </span>
              <h2 className="font-headline-lg text-headline-lg text-on-surface">
                Explore Verified Stores in Your Neighborhood
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Walk into trusted stores with GST billing or request Phoneo agent verification.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('stores')}
              className="font-title-sm text-title-sm text-primary hover:text-on-primary-container transition-colors flex items-center gap-1"
            >
              <span>Find 120+ Partner Stores</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PARTNER_STORES.map((store) => (
              <div
                key={store.id}
                onClick={() => {
                  onSelectStore(store.id);
                  onNavigate('stores');
                }}
                className="bg-white/85 hover:bg-white backdrop-blur-xl rounded-3xl p-5 shadow-[0_8px_25px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:shadow-[0_18px_45px_rgba(0,106,97,0.14)] border border-slate-200/60 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 space-y-4 cursor-pointer"
              >
                <div className="h-44 rounded-2xl overflow-hidden bg-slate-100 relative shadow-[inset_0_1px_3px_rgba(0,0,0,0.05)]">
                  <img
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    src={store.coverImage}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md font-label-sm text-label-sm text-primary font-bold flex items-center gap-1 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-white/80">
                    <span className="material-symbols-outlined text-[14px]">verified</span> GST
                    Verified
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-title-md text-title-md text-on-surface font-extrabold">
                      {store.name}
                    </h3>
                    <span className="font-label-md text-label-md text-on-surface flex items-center gap-0.5 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 text-xs font-bold text-amber-800">
                      <span className="material-symbols-outlined text-amber-500 text-[15px] filled">
                        star
                      </span>{' '}
                      {store.rating} ({store.reviewsCount})
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1 text-xs">
                    <span className="material-symbols-outlined text-[15px] text-primary">location_on</span>
                    {store.shortArea}
                  </p>
                </div>
                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-body-sm font-body-sm text-xs">
                  <span className="text-on-surface-variant">
                    Active Stock:{' '}
                    <strong className="text-on-surface font-bold">{store.activeStock} Devices</strong>
                  </span>
                  <span className="text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">{store.tradesCompleted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* City Network Selector Architecture */}
      <section className="w-full py-12 px-6 lg:px-12 bg-surface-container-low" id="city-grid">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-surface-container-lowest rounded-xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-surface-container">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-error-container text-on-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-[24px]">location_on</span>
                </div>
                <div>
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                    Choose Your City for a Personalized Experience
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Providing your address helps us tailor shopkeeper auctions and physical store
                    pickup networks.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  onSelectCity('Raipur');
                  showToast('Location Detected', 'GPS set your active hub to Raipur, CG');
                }}
                className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-primary font-title-sm text-title-sm flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">near_me</span>
                <span>Detect my Location</span>
              </button>
            </div>
            {/* City Skyline Landmarks Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-6 text-center">
              {CITIES.map((city) => {
                const isSelected = city.name === activeCity;
                return (
                  <button
                    key={city.name}
                    type="button"
                    onClick={() => onSelectCity(city.name)}
                    className={`group p-4 rounded-xl transition-all flex flex-col items-center ${
                      isSelected
                        ? 'bg-surface-container-high text-primary ring-2 ring-primary shadow-sm'
                        : 'bg-surface hover:bg-surface-container-high'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center mb-2 ${
                        isSelected
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-low group-hover:bg-surface-container'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[32px] ${
                          isSelected ? '' : 'text-primary'
                        }`}
                      >
                        {city.icon}
                      </span>
                    </div>
                    <span
                      className={`font-title-sm text-title-sm capitalize ${
                        isSelected
                          ? 'font-bold text-primary'
                          : 'text-on-surface group-hover:text-primary'
                      }`}
                    >
                      {city.name} {isSelected ? '(Active)' : ''}
                    </span>
                    <span
                      className={`font-label-sm text-label-sm ${
                        isSelected ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {city.stores} Shops Active
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Editorial SEO & Explainer Guides Accordion */}
      <section className="w-full py-12 px-6 lg:px-12 bg-surface">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">
              Hyper-Local Re-Commerce Explained
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Everything you need to know about certified grading, live retailer bidding, and
              doorstep safety.
            </p>
          </div>
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndices.includes(idx);
            return (
              <div
                key={faq.q}
                className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-title-md text-title-md text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="text-primary font-bold">{faq.q}</span>
                  <span
                    className={`material-symbols-outlined text-[20px] text-on-surface-variant transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    expand_more
                  </span>
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 text-body-md font-body-md text-on-surface-variant space-y-2">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Sticky Bottom Quick-Bid Micro Bar with Glassmorphic Grey/Black Tint & Dark Cyan Shadow */}
      <div className="sticky bottom-4 z-40 max-w-4xl mx-auto w-full px-6 pointer-events-none">
        <div className="pointer-events-auto bg-slate-900/90 hover:bg-slate-900/95 backdrop-blur-2xl rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,0.5),0_0_35px_rgba(0,106,97,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] p-2.5 flex items-center justify-between gap-4 border border-slate-700/70 transition-all">
          <div className="flex items-center gap-3 pl-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-400"></span>
            </span>
            <div className="flex flex-col sm:flex-row sm:items-baseline gap-1.5">
              <span className="font-title-sm text-title-sm text-white font-extrabold tracking-tight">
                Sell your phone in {activeCity} today?
              </span>
              <span className="font-body-sm text-body-sm text-slate-300 hidden sm:inline text-xs font-medium">
                Get 50+ local store bids in 30 mins
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onOpenStartAuctionModal()}
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary via-teal-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs shadow-[0_6px_20px_rgba(0,106,97,0.45)] hover:shadow-[0_8px_25px_rgba(0,196,180,0.45)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5 active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">currency_rupee</span>
              <span>Start Live Auction</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
