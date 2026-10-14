import React, { useState } from 'react';
import {
  CityName,
  formatRupee,
  PARTNER_STORES,
  PartnerStore,
  ProductItem,
  STORE_REVIEWS,
} from '../data';
import { SellerContactButtons } from './SellerContactButtons';

interface StoreProfileViewProps {
  isMobileMode: boolean;
  activeCity: CityName;
  selectedStoreId: string;
  onSelectStore: (storeId: string) => void;
  products: ProductItem[];
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  onOpenReserveModal: (product: ProductItem) => void;
  onOpenInspectModal: (product: ProductItem) => void;
  onOpenStartAuctionModal: (prefillModel?: string) => void;
  showToast: (title: string, desc: string) => void;
}

export const StoreProfileView: React.FC<StoreProfileViewProps> = ({
  isMobileMode,
  activeCity,
  selectedStoreId,
  onSelectStore,
  products,
  wishlist,
  onToggleWishlist,
  onOpenReserveModal,
  onOpenInspectModal,
  onOpenStartAuctionModal,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'deals' | 'reviews' | 'about'>('inventory');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [selectedStorage, setSelectedStorage] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(75000);
  const [isStoreFavorite, setIsStoreFavorite] = useState(false);
  const [reservedProductIds, setReservedProductIds] = useState<string[]>([]);

  const currentStore: PartnerStore =
    PARTNER_STORES.find((s) => s.id === selectedStoreId) || PARTNER_STORES[0];

  const handleQuickReserve = (product: ProductItem) => {
    setReservedProductIds((prev) => [...prev, product.id]);
    onOpenReserveModal(product);
  };

  const handleShareStore = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link Copied', `${currentStore.name} profile link copied to clipboard.`);
    } else {
      showToast('Store Link', `Sharing ${currentStore.name}`);
    }
  };

  // Filter store products
  const storeProducts = products.filter((p) => {
    if (selectedBrand !== 'All' && p.brand !== selectedBrand) return false;
    if (selectedGrade !== 'All') {
      if (selectedGrade === 'Pristine' && p.grade !== 'Pristine' && p.grade !== 'Grade A+') return false;
      if (selectedGrade === 'Mint' && p.grade !== 'Mint Grade') return false;
      if (selectedGrade === 'Good' && p.grade !== 'Good Grade' && p.grade !== 'Like New') return false;
    }
    if (selectedStorage !== 'All' && p.storage !== selectedStorage) return false;
    if (p.price > maxPrice) return false;
    return true;
  });

  // ==================== MOBILE VIEW (Matches Stitch Screen 514a93d37c994a4cb75684aa2300ff1a) ====================
  if (isMobileMode) {
    return (
      <div className="flex flex-col w-full pb-8">
        {/* Storefront Header & Hero Spotlight */}
        <section className="relative w-full">
          {/* Store Cover Backdrop */}
          <div className="relative w-full h-44 bg-surface-container-high overflow-hidden">
            <img
              alt={currentStore.name}
              className="w-full h-full object-cover"
              src={currentStore.coverImage}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/30 to-transparent"></div>
            {/* Top Quick Badges on Cover */}
            <div className="absolute top-3 left-margin-mobile right-margin-mobile flex items-center justify-between pointer-events-none">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md text-primary font-label-md text-label-md shadow-sm">
                <span className="material-symbols-outlined text-[15px] filled">verified</span>
                {currentStore.badge}
              </span>
              <div className="flex items-center gap-1.5 pointer-events-auto">
                <button
                  aria-label="Share Store"
                  onClick={handleShareStore}
                  className="w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center text-on-surface shadow-sm active:scale-95 transition-transform"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px]">share</span>
                </button>
                <button
                  aria-label="Favorite Store"
                  onClick={() => {
                    setIsStoreFavorite(!isStoreFavorite);
                    showToast(
                      isStoreFavorite ? 'Removed from Favorites' : 'Saved to Favorites',
                      currentStore.name
                    );
                  }}
                  className={`w-8 h-8 rounded-full bg-surface-container-lowest/90 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-95 transition-transform ${
                    isStoreFavorite ? 'text-error' : 'text-on-surface-variant'
                  }`}
                  type="button"
                >
                  <span className={`material-symbols-outlined text-[17px] ${isStoreFavorite ? 'filled' : ''}`}>
                    favorite
                  </span>
                </button>
              </div>
            </div>
            <div className="absolute bottom-3 left-margin-mobile flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-fixed animate-ping"></span>
                Open Now • Closes 9:30 PM
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-lowest/90 text-on-surface font-label-sm text-label-sm">
                GSTIN Verified
              </span>
            </div>
          </div>

          {/* Store Profile Identity Card */}
          <div className="px-margin-mobile -mt-4 relative z-10">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-md">
              <div className="flex items-start gap-3">
                <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-surface-container-low shrink-0 shadow-sm">
                  <img
                    alt={currentStore.name}
                    className="w-full h-full object-cover"
                    src={currentStore.logoImage}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h2 className="font-headline-sm text-headline-sm text-on-surface truncate">
                      {currentStore.name}
                    </h2>
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                    {currentStore.shortArea}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="inline-flex items-center gap-1 bg-tertiary-container/20 text-on-tertiary-container px-1.5 py-0.5 rounded font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[13px] text-tertiary-container filled">
                        star
                      </span>
                      <span className="font-bold">{currentStore.rating}</span>
                      <span className="text-on-surface-variant">({currentStore.reviewsCount})</span>
                    </div>
                    <span className="font-body-sm text-body-sm text-primary font-medium flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">near_me</span>
                      {currentStore.distance} away
                    </span>
                  </div>
                </div>
              </div>

              {/* Metric highlights */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 bg-surface-container-low/50 rounded-lg p-2 text-center">
                <div>
                  <p className="font-label-lg text-label-lg text-on-surface font-bold">
                    {currentStore.phonesSold}
                  </p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">Phones Sold</p>
                </div>
                <div className="bg-surface-container-high/40 rounded">
                  <p className="font-label-lg text-label-lg text-primary font-bold">1 Year</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">Warranty Hub</p>
                </div>
                <div>
                  <p className="font-label-lg text-label-lg text-tertiary font-bold">Instant</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant">Cash Exchange</p>
                </div>
              </div>

              {/* Direct Connect Buttons */}
              <div className="grid grid-cols-3 gap-2 mt-3">
                <a
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-95 transition-all"
                  href={`tel:${currentStore.phone}`}
                >
                  <span className="material-symbols-outlined text-[17px] text-primary">call</span>
                  Call Shop
                </a>
                <a
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md hover:opacity-90 active:scale-95 transition-all"
                  href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(currentStore.name)},%20I%20am%20interested%20in%20a%20phone`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="material-symbols-outlined text-[17px]">chat</span>
                  WhatsApp
                </a>
                <button
                  className="flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high active:scale-95 transition-all"
                  onClick={() =>
                    showToast('Opening Google Maps', `${currentStore.address}`)
                  }
                  type="button"
                >
                  <span className="material-symbols-outlined text-[17px] text-secondary">
                    directions
                  </span>
                  Directions
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Buyback Trade-in Mini Banner */}
        <section className="px-margin-mobile mt-3">
          <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-container text-on-primary p-3 rounded-xl shadow-sm flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container-lowest/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px] text-surface-container-lowest">
                  currency_rupee
                </span>
              </div>
              <div className="min-w-0">
                <p className="font-title-sm text-title-sm text-surface-container-lowest font-bold truncate">
                  Sell Your Old Phone Here
                </p>
                <p className="font-body-sm text-[11px] text-surface-container-low truncate">
                  Walk-in instant cash inspection or live shop bid
                </p>
              </div>
            </div>
            <button
              onClick={() => onOpenStartAuctionModal()}
              className="shrink-0 px-3 py-1.5 rounded-full bg-surface-container-lowest text-primary font-label-md text-label-md shadow-sm active:scale-95 transition-transform"
              type="button"
            >
              Get Value
            </button>
          </div>
        </section>

        {/* Store Navigation Tabs */}
        <section className="mt-3 bg-surface-container-lowest shadow-sm sticky top-16 z-20">
          <div className="flex items-center overflow-x-auto px-margin-mobile gap-4 no-scrollbar">
            <button
              className={`py-3 font-label-md text-label-md shrink-0 relative flex items-center gap-1.5 ${
                activeTab === 'inventory' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('inventory')}
              type="button"
            >
              Inventory ({storeProducts.length})
              {activeTab === 'inventory' && (
                <span className="absolute bottom-0 inset-x-0 h-0.5 bg-primary rounded-full"></span>
              )}
            </button>
            <button
              className={`py-3 font-label-md text-label-md shrink-0 flex items-center gap-1.5 ${
                activeTab === 'deals' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('deals')}
              type="button"
            >
              Offers &amp; Deals
              <span className="px-1.5 py-0.2 rounded-full bg-tertiary-container/30 text-tertiary font-label-sm text-[10px]">
                6
              </span>
            </button>
            <button
              className={`py-3 font-label-md text-label-md shrink-0 ${
                activeTab === 'reviews' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('reviews')}
              type="button"
            >
              Reviews ({currentStore.reviewsCount})
            </button>
            <button
              className={`py-3 font-label-md text-label-md shrink-0 ${
                activeTab === 'about' ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => setActiveTab('about')}
              type="button"
            >
              About &amp; Services
            </button>
          </div>
        </section>

        {activeTab === 'inventory' && (
          <>
            {/* Brand Filter Chips & Quick Condition Badges */}
            <section className="px-margin-mobile mt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {['All', 'Apple', 'OnePlus', 'Samsung', 'Vivo'].map((b) => {
                  const isSel = selectedBrand === b;
                  return (
                    <button
                      key={b}
                      onClick={() => setSelectedBrand(b)}
                      className={`px-3.5 py-1.5 rounded-full font-label-md text-label-md shrink-0 shadow-sm transition-colors ${
                        isSel
                          ? 'bg-primary text-on-primary'
                          : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      {b === 'All' ? 'All Brands' : b}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                    Grade:
                  </span>
                  {['All', 'Pristine', 'Mint', 'Good'].map((g) => {
                    const isSel = selectedGrade === g;
                    return (
                      <button
                        key={g}
                        onClick={() => setSelectedGrade(g)}
                        className={`px-2 py-0.5 rounded-full font-label-sm text-label-sm transition-colors ${
                          isSel
                            ? 'bg-surface-container text-primary font-semibold'
                            : 'bg-surface-container-low text-on-surface-variant'
                        }`}
                        type="button"
                      >
                        {g === 'All' ? 'All' : g}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => {
                    setSelectedBrand('All');
                    setSelectedGrade('All');
                  }}
                  className="flex items-center gap-0.5 text-primary font-label-sm text-label-sm pl-2 shrink-0"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                  <span>Reset</span>
                </button>
              </div>
            </section>

            {/* Inventory Grid */}
            <section className="px-margin-mobile mt-3 pb-6 flex flex-col gap-3">
              {storeProducts.map((item) => {
                const isSaved = wishlist.includes(item.id);
                const isReserved = reservedProductIds.includes(item.id);
                return (
                  <article
                    key={item.id}
                    className="bg-surface-container-lowest rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow relative"
                  >
                    <div className="flex gap-3">
                      {/* Thumbnail & Badges */}
                      <div
                        onClick={() => onOpenInspectModal(item)}
                        className="relative w-28 h-32 bg-surface-container-low rounded-lg overflow-hidden shrink-0 cursor-pointer"
                      >
                        <img
                          alt={item.name}
                          className="w-full h-full object-cover"
                          src={item.image}
                        />
                        <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px] font-bold shadow-sm">
                          {item.grade}
                        </span>
                        <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.2 rounded bg-surface-container-lowest/90 text-on-surface font-label-sm text-[9px] backdrop-blur-sm">
                          {item.batteryOrFeature}
                        </span>
                      </div>
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between gap-1">
                            <h3
                              onClick={() => onOpenInspectModal(item)}
                              className="font-title-sm text-title-sm text-on-surface font-bold truncate cursor-pointer hover:text-primary"
                            >
                              {item.name}
                            </h3>
                            <button
                              aria-label="Save to wishlist"
                              onClick={() => onToggleWishlist(item.id)}
                              className={`transition-colors p-0.5 ${
                                isSaved ? 'text-error' : 'text-on-surface-variant hover:text-error'
                              }`}
                              type="button"
                            >
                              <span
                                className={`material-symbols-outlined text-[18px] ${
                                  isSaved ? 'filled' : ''
                                }`}
                              >
                                favorite
                              </span>
                            </button>
                          </div>
                          <p className="font-body-sm text-[11px] text-on-surface-variant mt-0.5 truncate">
                            {item.specs}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-container-low text-primary font-label-sm text-[10px]">
                              <span className="material-symbols-outlined text-[11px]">verified</span>
                              6M Shop Warranty
                            </span>
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-[10px]">
                              32-Pt Check
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 flex items-end justify-between">
                          <div>
                            <p className="font-body-sm text-[11px] text-on-surface-variant line-through">
                              {formatRupee(item.originalPrice)}
                            </p>
                            <p className="font-headline-sm text-headline-sm text-primary font-bold leading-none">
                              {formatRupee(item.price)}
                            </p>
                          </div>
                          <button
                            className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm font-semibold active:scale-95 transition-all flex items-center gap-1 shadow-sm ${
                              isReserved
                                ? 'bg-primary text-on-primary'
                                : 'bg-primary-container text-on-primary-container'
                            }`}
                            onClick={() => handleQuickReserve(item)}
                            type="button"
                          >
                            <span className="material-symbols-outlined text-[14px]">
                              {isReserved ? 'check' : 'lock_clock'}
                            </span>
                            {isReserved ? 'Reserved' : 'Hold / Reserve'}
                          </button>
                        </div>
                        <SellerContactButtons product={item} size="sm" className="mt-2" />
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          </>
        )}

        {activeTab === 'reviews' && (
          <section className="px-margin-mobile mt-3 flex flex-col gap-3">
            {STORE_REVIEWS.map((rev) => (
              <div key={rev.id} className="p-4 rounded-xl bg-surface-container-lowest shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${rev.avatarBg}`}>
                      {rev.initials}
                    </div>
                    <div>
                      <p className="font-title-sm text-title-sm text-on-surface font-bold leading-tight">
                        {rev.name}
                      </p>
                      <p className="font-body-sm text-[11px] text-on-surface-variant">{rev.badge}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-tertiary">
                    <span className="material-symbols-outlined text-[16px] filled">star</span>
                    <span className="text-xs font-bold ml-0.5">{rev.rating}</span>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">{rev.comment}</p>
                <span className="text-[10px] text-outline block">{rev.timeAgo}</span>
              </div>
            ))}
          </section>
        )}

        {/* Store Location & Certified Assurance Map Card */}
        <section className="px-margin-mobile mb-6 mt-3">
          <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
                Visit In Store
              </h3>
              <span className="font-body-sm text-body-sm text-primary font-semibold">
                {currentStore.shortArea.split(',')[1] || currentStore.city}
              </span>
            </div>
            <div
              className="w-full h-32 rounded-lg bg-surface-container-high bg-cover bg-center overflow-hidden relative shadow-inner"
              style={{ backgroundImage: `url(${currentStore.mapImage})` }}
            >
              <div className="absolute inset-0 bg-on-surface/10"></div>
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/95 backdrop-blur-md px-2.5 py-1 rounded-md text-on-surface text-label-sm font-label-sm flex items-center gap-1 shadow-sm">
                <span className="material-symbols-outlined text-primary text-[14px]">pin_drop</span>
                {currentStore.address}
              </div>
            </div>
            {/* Trust Badges Checklist */}
            <div className="grid grid-cols-2 gap-2 mt-3 text-on-surface-variant">
              <div className="flex items-center gap-1.5 text-body-sm font-body-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>Physical Test Bench</span>
              </div>
              <div className="flex items-center gap-1.5 text-body-sm font-body-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>Instant UPI / Cash Payout</span>
              </div>
              <div className="flex items-center gap-1.5 text-body-sm font-body-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>Printed Invoice &amp; IMEI Bill</span>
              </div>
              <div className="flex items-center gap-1.5 text-body-sm font-body-sm">
                <span className="material-symbols-outlined text-primary text-[16px]">check_circle</span>
                <span>7-Day Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </section>

        {/* Floating Sticky Action Dock for Store Shoppers */}
        <aside className="sticky bottom-0 inset-x-0 z-30 px-margin-mobile pb-3 pt-2 bg-surface/90 backdrop-blur-md">
          <div className="max-w-md mx-auto bg-inverse-surface text-inverse-on-surface p-2.5 rounded-full shadow-xl flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 pl-2">
              <span className="w-2.5 h-2.5 rounded-full bg-primary-fixed animate-pulse"></span>
              <div className="min-w-0">
                <p className="font-label-sm text-label-sm font-bold text-inverse-on-surface truncate">
                  {currentStore.name}
                </p>
                <p className="font-body-sm text-[10px] text-secondary-fixed-dim">
                  Reserves held for 4 hrs max
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                className="px-3.5 py-2 rounded-full bg-surface-container-lowest/15 text-inverse-on-surface font-label-md text-label-md hover:bg-surface-container-lowest/25 active:scale-95 transition-all flex items-center gap-1"
                href={`tel:${currentStore.phone}`}
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                Inquire
              </a>
              <button
                className="px-4 py-2 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md font-bold shadow-md active:scale-95 transition-all flex items-center gap-1"
                onClick={() => {
                  if (storeProducts[0]) onOpenReserveModal(storeProducts[0]);
                }}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                Reserve Phone
              </button>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  // ==================== DESKTOP VIEW (Matches Stitch Screen f448508769ff45b6bf28804e1c4b2b80) ====================
  return (
    <div className="flex flex-col w-full">
      {/* Retailer Hero Showcase Banner */}
      <div className="relative w-full overflow-hidden bg-inverse-surface text-surface-container-lowest">
        <div
          className="absolute inset-0 opacity-40 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentStore.coverImage})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/80 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-10 pb-8 flex flex-col justify-end">
          {/* Breadcrumb Bar */}
          <div className="flex items-center gap-2 font-label-md text-label-md text-surface-variant mb-6">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">home</span>Home
            </span>
            <span>/</span>
            <span>{currentStore.city} Retailers</span>
            <span>/</span>
            <span>Pandri Hub</span>
            <span>/</span>
            <span className="text-surface-container-lowest font-semibold">{currentStore.name}</span>
          </div>

          {/* Main Store Info Meta Card */}
          <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 pb-2">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md flex items-center gap-1 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  {currentStore.badge}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                    receipt_long
                  </span>
                  GSTIN {currentStore.gstin}
                </span>
                <span className="px-3 py-1 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest font-label-md text-label-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">
                    storefront
                  </span>
                  Retail Footprint Since {currentStore.since}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h1 className="font-headline-xl text-headline-xl font-extrabold tracking-tight text-surface-container-lowest">
                  {currentStore.name}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-tertiary text-on-tertiary font-title-sm text-title-sm shadow-sm">
                  <span className="material-symbols-outlined text-[16px] text-tertiary-fixed filled">
                    star
                  </span>
                  {currentStore.rating}
                  <span className="text-xs opacity-90 font-normal">
                    ({currentStore.reviewsCount} verified)
                  </span>
                </span>
              </div>
              <p className="font-body-md text-body-md text-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-primary-fixed">
                  place
                </span>
                {currentStore.address}
                <span className="px-2 py-0.5 rounded-full bg-primary/30 text-primary-fixed font-label-sm text-label-sm">
                  {currentStore.distance} from your location
                </span>
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
              <a
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-primary text-on-primary font-title-sm text-title-sm hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md"
                href={`tel:${currentStore.phone}`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span> Call Store
              </a>
              <a
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-surface-container-lowest text-on-surface font-title-sm text-title-sm hover:bg-surface-container-high transition-all shadow-md"
                href={`https://wa.me/919876543210?text=Hi%20${encodeURIComponent(currentStore.name)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
                WhatsApp
              </a>
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest hover:bg-surface-container-lowest hover:text-on-surface transition-all"
                onClick={handleShareStore}
                title="Share Storefront"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">share</span>
              </button>
              <button
                className="flex items-center justify-center w-11 h-11 rounded-full bg-surface-container-lowest/20 backdrop-blur-md text-surface-container-lowest hover:bg-surface-container-lowest hover:text-on-surface transition-all"
                onClick={() => showToast('Directions', currentStore.address)}
                title="Driving Directions"
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">directions</span>
              </button>
            </div>
          </div>

          {/* Trust Telemetry Strip */}
          <div className="mt-8 pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-surface-container-lowest/10 backdrop-blur-md rounded-2xl p-4 text-surface-container-lowest">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[22px]">sell</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm font-bold leading-none">
                  {currentStore.phonesSold}
                </p>
                <p className="font-label-sm text-label-sm text-surface-variant">
                  Phones Sold Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[22px]">security_update_good</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm font-bold leading-none">6M - 1Y</p>
                <p className="font-label-sm text-label-sm text-surface-variant">
                  Phoneo Warranty Hub
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm font-bold leading-none">Instant</p>
                <p className="font-label-sm text-label-sm text-surface-variant">Spot Cash Buyout</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary-fixed">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div>
                <p className="font-headline-sm text-headline-sm font-bold leading-none">32-Point</p>
                <p className="font-label-sm text-label-sm text-surface-variant">
                  On-Site Test Bench
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trade-In & Sell Old Device Banner */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-8 w-full">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-container to-surface-tint p-6 lg:p-8 text-on-primary shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest/20 font-label-md text-label-md tracking-wide uppercase">
                <span className="material-symbols-outlined text-[16px]">sync_alt</span> Walk-in
                Upgrade Station
              </div>
              <h2 className="font-headline-lg text-headline-lg font-bold">
                Sell or Exchange Your Phone at {currentStore.name}
              </h2>
              <p className="font-body-md text-body-md text-surface-container-lowest/90">
                Get your smartphone diagnosed in 10 minutes on the digital test bench. Walk away
                with spot UPI payout or use it as an exchange credit against any flagship pre-owned
                phone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                type="button"
                onClick={() => onOpenStartAuctionModal()}
                className="px-6 py-3 rounded-full bg-surface-container-lowest text-primary font-title-sm text-title-sm font-bold hover:bg-surface-container-low transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">calculate</span> Instant
                Online Valuation
              </button>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Store Visit Booked',
                    `Free inspection reservation confirmed at ${currentStore.name}`
                  )
                }
                className="px-5 py-3 rounded-full bg-on-primary-container text-surface-container-lowest font-title-sm text-title-sm hover:bg-on-primary-container/80 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[20px]">calendar_month</span> Book
                Store Visit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Store Inventory Explorer Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
        <div className="flex items-center justify-between mb-8 pb-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-extrabold text-on-surface">
              Store Verified Inventory
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Currently {storeProducts.length} certified devices in stock at{' '}
              {currentStore.shortArea.split(',')[1] || currentStore.city} showroom
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Store switcher dropdown */}
            <span className="font-label-md text-label-md text-on-surface-variant">Store:</span>
            <select
              value={selectedStoreId}
              onChange={(e) => onSelectStore(e.target.value)}
              className="px-4 py-2 rounded-full bg-surface-container-lowest text-on-surface font-title-sm text-title-sm shadow-sm focus:outline-none border border-surface-container"
            >
              {PARTNER_STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Filter Sidebar */}
          <aside className="space-y-6 bg-surface-container-lowest p-6 rounded-2xl shadow-sm">
            <div className="flex items-center justify-between pb-3">
              <h3 className="font-title-md text-title-md font-bold text-on-surface flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-primary">tune</span>{' '}
                Filters
              </h3>
              <button
                type="button"
                onClick={() => {
                  setSelectedBrand('All');
                  setSelectedGrade('All');
                  setSelectedStorage('All');
                  setMaxPrice(75000);
                }}
                className="font-label-sm text-label-sm text-primary hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Brand Filter */}
            <div className="space-y-3">
              <label className="font-title-sm text-title-sm font-semibold text-on-surface block">
                Brand Manufacturer
              </label>
              <div className="space-y-2">
                {['All', 'Apple', 'Samsung', 'OnePlus', 'Google Pixel', 'Vivo'].map((b) => (
                  <label
                    key={b}
                    className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <input
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                        className="rounded text-primary focus:ring-primary w-4 h-4"
                        type="radio"
                        name="desktop_brand"
                      />
                      {b}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition Grade Filter */}
            <div className="space-y-3 pt-3">
              <label className="font-title-sm text-title-sm font-semibold text-on-surface block">
                Condition Grade
              </label>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Pristine / Like New', val: 'Pristine', color: 'bg-primary' },
                  { label: 'Mint (Minor Wear)', val: 'Mint', color: 'bg-tertiary-container' },
                  { label: 'Good (Certified Value)', val: 'Good', color: 'bg-secondary' },
                  { label: 'All Grades', val: 'All', color: 'bg-outline' },
                ].map((g) => (
                  <span
                    key={g.val}
                    onClick={() => setSelectedGrade(g.val)}
                    className={`flex items-center justify-between p-2 rounded-xl text-on-surface font-body-sm text-body-sm cursor-pointer transition-colors ${
                      selectedGrade === g.val
                        ? 'bg-surface-container ring-1 ring-primary'
                        : 'bg-surface-container-low hover:bg-surface-container'
                    }`}
                  >
                    <span className="flex items-center gap-1.5 font-medium">
                      <span className={`w-2.5 h-2.5 rounded-full ${g.color}`}></span> {g.label}
                    </span>
                  </span>
                ))}
              </div>
            </div>

            {/* Storage Chips */}
            <div className="space-y-3 pt-3">
              <label className="font-title-sm text-title-sm font-semibold text-on-surface block">
                Storage Capacity
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['All', '64 GB', '128 GB', '256 GB', '512 GB'].map((st) => {
                  const isSel = selectedStorage === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setSelectedStorage(st)}
                      className={`py-1.5 text-center rounded-lg font-label-md text-label-md transition-colors ${
                        isSel
                          ? 'bg-primary text-on-primary font-bold'
                          : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center justify-between">
                <label className="font-title-sm text-title-sm font-semibold text-on-surface">
                  Max Budget
                </label>
                <span className="font-label-sm text-label-sm text-primary font-bold">
                  {formatRupee(maxPrice)}
                </span>
              </div>
              <input
                className="w-full accent-primary h-1.5 bg-surface-container-high rounded-lg cursor-pointer"
                max={100000}
                min={15000}
                step={5000}
                type="range"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
              />
            </div>
          </aside>

          {/* Main Product Listing Grid (3 Columns Desktop) */}
          <main className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {storeProducts.map((prod) => {
              const isSaved = wishlist.includes(prod.id);
              const isReserved = reservedProductIds.includes(prod.id);
              return (
                <div
                  key={prod.id}
                  className="flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative w-full h-56 bg-surface-container-low p-4 flex items-center justify-center overflow-hidden">
                    <img
                      alt={prod.name}
                      className="h-44 object-contain group-hover:scale-105 transition-transform duration-300"
                      src={prod.image}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold flex items-center gap-1 shadow-sm">
                      <span className="material-symbols-outlined text-[13px]">verified</span>{' '}
                      {prod.grade}
                    </span>
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(prod.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full bg-surface-container-lowest/80 backdrop-blur-md flex items-center justify-center transition-colors ${
                        isSaved ? 'text-error' : 'text-on-surface-variant hover:text-error'
                      }`}
                      title="Save phone"
                    >
                      <span className={`material-symbols-outlined text-[18px] ${isSaved ? 'filled' : ''}`}>
                        favorite
                      </span>
                    </button>
                    <div className="absolute bottom-2 left-3 flex items-center gap-1 text-[11px] font-semibold bg-surface-container-lowest/90 px-2 py-0.5 rounded-md text-on-surface">
                      <span className="material-symbols-outlined text-[13px] text-primary">
                        {prod.featureIcon}
                      </span>{' '}
                      {prod.batteryOrFeature}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs text-on-surface-variant">
                        <span>{prod.categoryTag}</span>
                        <span className="text-primary font-medium">32-Pt Passed</span>
                      </div>
                      <h3
                        onClick={() => onOpenInspectModal(prod)}
                        className="font-title-md text-title-md font-bold text-on-surface group-hover:text-primary transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {prod.specs}
                      </p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="font-headline-md text-headline-md font-extrabold text-on-surface">
                            {formatRupee(prod.price)}
                          </span>
                          <span className="text-xs line-through text-outline ml-1.5">
                            {formatRupee(prod.originalPrice)}
                          </span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface-variant">
                          {prod.warranty}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenInspectModal(prod)}
                          className="py-2.5 px-3 rounded-full bg-surface-container-low text-on-surface hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>{' '}
                          Inspect
                        </button>
                        <button
                          type="button"
                          onClick={() => handleQuickReserve(prod)}
                          className={`py-2.5 px-3 rounded-full font-label-md text-label-md font-semibold transition-colors flex items-center justify-center gap-1 shadow-sm ${
                            isReserved
                              ? 'bg-primary text-on-primary'
                              : 'bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            {isReserved ? 'check' : 'storefront'}
                          </span>{' '}
                          {isReserved ? 'Reserved' : 'Reserve'}
                        </button>
                      </div>
                      <SellerContactButtons product={prod} size="md" className="mt-2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </main>
        </div>
      </section>

      {/* Physical Visit & Location Details */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
        <div className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Map and Directions Info */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                  Store Visit &amp; Test Drive
                </span>
                <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                  Experience &amp; Inspect Before You Pay
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Every phone listed here is physically available in the showcase. Visit during
                  mall hours to hold the phone, test cameras, and verify IMEI with store staff.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold font-title-sm text-title-sm">
                    <span className="material-symbols-outlined text-[20px]">schedule</span>{' '}
                    Operating Hours
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    Monday – Sunday (All 7 Days)
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    10:30 AM to 09:30 PM
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-surface-container-low space-y-2">
                  <div className="flex items-center gap-2 text-primary font-semibold font-title-sm text-title-sm">
                    <span className="material-symbols-outlined text-[20px]">verified</span> Payment
                    &amp; Handover
                  </div>
                  <p className="font-body-sm text-body-sm text-on-surface font-medium">
                    Zero-Cost Store Pickup
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    UPI, Debit/Credit Card &amp; Cash accepted
                  </p>
                </div>
              </div>
              {/* Store Amenities Checklist */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Hardware Bench
                </div>
                <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Instant UPI Cashout
                </div>
                <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  Tax Invoice (GST)
                </div>
                <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md">
                  <span className="material-symbols-outlined text-[16px] text-primary">
                    check_circle
                  </span>{' '}
                  7-Day Exchange
                </div>
              </div>
            </div>
            {/* Interactive Map Preview Block */}
            <div className="lg:col-span-5 h-80 rounded-xl overflow-hidden relative shadow-md">
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${currentStore.mapImage})` }}
              ></div>
              <div className="absolute bottom-4 left-4 right-4 bg-surface-container-lowest/95 backdrop-blur-md p-3.5 rounded-xl shadow-lg flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-title-sm text-title-sm font-bold text-on-surface">
                    {currentStore.shortArea}
                  </p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Main Commercial Corridor, {currentStore.city}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Directions', currentStore.address)}
                  className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md flex items-center gap-1"
                >
                  Directions{' '}
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Customer Reviews Strip */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 pb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              Verified {currentStore.city} Customer Reviews
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              All reviews verified via Phoneo digital OTP purchase receipts
            </p>
          </div>
          <button
            type="button"
            onClick={() => showToast('Write a Review', 'Review submission dialog unlocked.')}
            className="px-4 py-2 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
          >
            Write a Review
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORE_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-tertiary">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined text-[16px] filled">
                        star
                      </span>
                    ))}
                  </div>
                  <span className="text-xs text-on-surface-variant">{rev.timeAgo}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface">{rev.comment}</p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <div
                  className={`w-9 h-9 rounded-full font-title-sm text-title-sm flex items-center justify-center font-bold ${rev.avatarBg}`}
                >
                  {rev.initials}
                </div>
                <div>
                  <p className="font-title-sm text-title-sm font-bold text-on-surface">{rev.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px] text-primary">
                      verified
                    </span>{' '}
                    {rev.badge}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
