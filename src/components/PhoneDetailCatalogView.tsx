import React, { useState } from 'react';
import {
  CityName,
  ProductItem,
  PRODUCTS,
  VIVO_Y19_LISTING_DETAILS,
  formatRupee,
} from '../data';
import { BrandLogo } from './BrandLogos';
import { SellerContactButtons, WhatsAppIcon } from './SellerContactButtons';
import { getSellerPhone } from '../data';

interface PhoneDetailCatalogViewProps {
  activeCity: CityName;
  selectedProduct: ProductItem | null;
  initialMode?: 'catalog' | 'detail';
  onSelectProduct: (product: ProductItem | null) => void;
  onOpenReserveModal: (product: ProductItem) => void;
  onNavigateHome: () => void;
  onOpenStore: (storeId: string) => void;
}

export const PhoneDetailCatalogView: React.FC<PhoneDetailCatalogViewProps> = ({
  activeCity,
  selectedProduct,
  initialMode = 'catalog',
  onSelectProduct,
  onOpenReserveModal,
  onNavigateHome,
  onOpenStore,
}) => {
  // Mode state: 'catalog' | 'detail'
  const [viewMode, setViewMode] = useState<'catalog' | 'detail'>(
    selectedProduct ? 'detail' : initialMode
  );

  // Active phone being viewed in detail
  const currentPhone =
    selectedProduct ||
    PRODUCTS.find((p) => p.id === '88782' || p.listingId === '88782') ||
    PRODUCTS[0];

  // Detail view interactive state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedStorage, setSelectedStorage] = useState<'64 GB' | '128 GB' | '256 GB'>('64 GB');
  const [selectedColor, setSelectedColor] = useState('Magnetic Black');
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState<'inspection' | 'specs' | 'stores'>('inspection');

  // Catalog filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedGrade, setSelectedGrade] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<'All' | 'under15k' | '15k-30k' | '30k-60k' | 'above60k'>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'priceLow' | 'priceHigh' | 'rating'>('recommended');

  const brandsList = [
    'All',
    'Vivo',
    'Apple',
    'Samsung',
    'OnePlus',
    'Google Pixel',
    'Xiaomi',
    'Realme',
    'Motorola',
  ];

  // Filter products
  const filteredProducts = PRODUCTS.filter((prod) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = prod.name.toLowerCase().includes(q);
      const matchBrand = prod.brand.toLowerCase().includes(q);
      const matchSpecs = prod.specs.toLowerCase().includes(q);
      const matchStore = prod.storeName.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchSpecs && !matchStore) return false;
    }
    if (selectedBrand !== 'All' && prod.brand !== selectedBrand) {
      return false;
    }
    if (selectedGrade !== 'All' && prod.grade !== selectedGrade) {
      return false;
    }
    if (priceRange === 'under15k' && prod.price >= 15000) return false;
    if (priceRange === '15k-30k' && (prod.price < 15000 || prod.price > 30000)) return false;
    if (priceRange === '30k-60k' && (prod.price < 30000 || prod.price > 60000)) return false;
    if (priceRange === 'above60k' && prod.price <= 60000) return false;

    return true;
  }).sort((a, b) => {
    if (sortBy === 'priceLow') return a.price - b.price;
    if (sortBy === 'priceHigh') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // recommended
  });

  const handleCopyLink = () => {
    const url = currentPhone.id === '88782'
      ? 'https://phoneo.in/store/Vivo/Y19/88782'
      : `https://phoneo.in/store/${encodeURIComponent(currentPhone.brand)}/${encodeURIComponent(
          currentPhone.name.replace(/\s+/g, '_')
        )}/${currentPhone.id}`;
    
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(url);
    }
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2400);
  };

  // ==========================================
  // DETAIL VIEW (e.g. https://phoneo.in/store/Vivo/Y19/88782)
  // ==========================================
  if (viewMode === 'detail') {
    const isVivoY19 = currentPhone.id === '88782' || currentPhone.name.includes('Vivo Y19');
    const vivoDetails = VIVO_Y19_LISTING_DETAILS;
    const galleryImages = isVivoY19
      ? vivoDetails.gallery
      : [
          { title: 'Main View', url: currentPhone.image },
          { title: 'Angled View', url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80' },
          { title: 'Rear Module', url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80' },
        ];

    const currentUrlDisplay = isVivoY19
      ? 'https://phoneo.in/store/Vivo/Y19/88782'
      : `https://phoneo.in/store/${currentPhone.brand}/${currentPhone.name.split(' ')[0]}/${currentPhone.id}`;

    return (
      <div className="space-y-6 pb-20">
        {/* Simulated Phoneo Route Address Bar */}
        <div className="bg-surface-container-low border-b border-outline-variant/30 px-4 md:px-8 py-3">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs md:text-sm font-mono text-on-surface-variant overflow-x-auto py-1">
              <span className="material-symbols-outlined text-[18px] text-primary">lock</span>
              <span className="font-semibold text-primary">phoneo.in</span>
              <span className="text-outline">/</span>
              <span>store</span>
              <span className="text-outline">/</span>
              <span className="text-on-surface font-semibold">{currentPhone.brand}</span>
              <span className="text-outline">/</span>
              <span className="text-on-surface font-semibold">{isVivoY19 ? 'Y19' : currentPhone.name.split(' ')[0]}</span>
              <span className="text-outline">/</span>
              <span className="px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                #{isVivoY19 ? '88782' : currentPhone.id}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant/50"
              >
                <span className="material-symbols-outlined text-[15px] text-primary">
                  {copiedUrl ? 'check_circle' : 'content_copy'}
                </span>
                {copiedUrl ? 'Copied URL!' : 'Copy Page URL'}
              </button>

              <button
                type="button"
                onClick={() => setViewMode('catalog')}
                className="px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                View All Phones
              </button>
            </div>
          </div>
        </div>

        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 text-xs font-label-md text-on-surface-variant">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-primary transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[14px]">home</span>
              Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => setViewMode('catalog')}
              className="hover:text-primary transition-colors"
            >
              Store Phones
            </button>
            <span>/</span>
            <span className="hover:text-primary transition-colors">{currentPhone.brand}</span>
            <span>/</span>
            <span className="text-on-surface font-semibold">
              {currentPhone.name} (#{isVivoY19 ? '88782' : currentPhone.id})
            </span>
          </div>
        </div>

        {/* Main Product Showcase Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Gallery & Angles */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/30 shadow-sm relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-primary text-on-primary text-xs font-bold shadow-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">verified</span>
                    Phoneo Certified {currentPhone.grade}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold">
                    32-Point Inspected
                  </span>
                </div>

                <div className="absolute top-4 right-4 z-10">
                  <span className="px-2.5 py-1 rounded-full bg-error/10 text-error text-xs font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
                    Only 2 Units Left in {activeCity}
                  </span>
                </div>

                {/* Primary Large Image */}
                <div className="h-[340px] md:h-[420px] flex items-center justify-center p-4">
                  <img
                    src={galleryImages[activeImageIndex]?.url || currentPhone.image}
                    alt={currentPhone.name}
                    className="max-h-full max-w-full object-contain rounded-2xl drop-shadow-xl transition-all duration-300 transform group-hover:scale-105"
                  />
                </div>

                <div className="text-center font-label-sm text-xs text-on-surface-variant mt-2">
                  {galleryImages[activeImageIndex]?.title || 'Device Inspection View'}
                </div>
              </div>

              {/* Thumbnail Selector */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`p-2 rounded-2xl border transition-all bg-surface-container-lowest flex flex-col items-center gap-1 ${
                      activeImageIndex === idx
                        ? 'border-primary ring-2 ring-primary/20 shadow-sm'
                        : 'border-outline-variant/30 hover:border-primary/50'
                    }`}
                  >
                    <div className="w-full h-16 flex items-center justify-center">
                      <img
                        src={img.url}
                        alt={img.title}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-on-surface truncate w-full text-center">
                      {img.title.split(' ')[0]}
                    </span>
                  </button>
                ))}
              </div>

              {/* Showroom Pickup Assurance Banner */}
              <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary/20 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-on-surface flex items-center gap-2">
                    Verified Store Counter Pickup Available
                    <span className="px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[10px] font-bold">
                      Zero Risk
                    </span>
                  </div>
                  <p className="text-on-surface-variant leading-relaxed">
                    Test this phone in person at <strong>{currentPhone.storeName}</strong> ({currentPhone.storeArea}, {currentPhone.city}). Pay only when completely satisfied at the showroom counter.
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Details, Pricing, Variants & CTAs */}
            <div className="lg:col-span-6 space-y-6">
              {/* Header Info */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-surface-container-high flex items-center justify-center">
                    <BrandLogo brand={currentPhone.brand} className="w-6 h-6" />
                  </div>
                  <span className="font-label-md text-sm text-primary font-bold uppercase tracking-wider">
                    {currentPhone.brand} Official Store Listing
                  </span>
                  <span className="text-outline">•</span>
                  <span className="font-mono text-xs text-on-surface-variant">ID: #{isVivoY19 ? '88782' : currentPhone.id}</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-extrabold text-on-surface tracking-tight font-headline-md">
                  {currentPhone.name}
                </h1>
                <p className="text-sm text-on-surface-variant font-body-md">
                  {currentPhone.specs}
                </p>

                {/* Star rating & sales */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-[14px]">star</span>
                    {currentPhone.rating} / 5.0
                  </div>
                  <span className="text-xs text-on-surface-variant">
                    (142 Verified Store Diagnostic Checks)
                  </span>
                  <span className="text-outline">•</span>
                  <span className="text-xs text-primary font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">shield</span>
                    6 Months Warranty
                  </span>
                </div>
              </div>

              {/* Price Card */}
              <div className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl md:text-4xl font-extrabold text-primary font-headline-lg">
                    {formatRupee(currentPhone.price)}
                  </span>
                  <span className="text-lg text-on-surface-variant/60 line-through">
                    {formatRupee(currentPhone.originalPrice)}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold">
                    {currentPhone.discountPercent}% OFF • Save {formatRupee(currentPhone.originalPrice - currentPhone.price)}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-tertiary">credit_card</span>
                  <span>
                    No-Cost EMI available from <strong>₹799/month</strong> on major banks & Bajaj Finserv.
                  </span>
                </div>

                <div className="pt-2 border-t border-outline-variant/20 flex flex-wrap items-center justify-between text-xs text-on-surface-variant gap-2">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">local_shipping</span>
                    Free Same-Day Delivery in {activeCity}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] text-primary">published_with_changes</span>
                    7 Days Spot Replacement
                  </span>
                </div>
              </div>

              {/* Storage Variants */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                    Select RAM & Storage
                  </label>
                  <span className="text-xs text-on-surface-variant font-medium">
                    Expandable via MicroSD slot
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedStorage('64 GB')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStorage === '64 GB'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-on-surface">4GB RAM + 64GB ROM</span>
                      {selectedStorage === '64 GB' && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      )}
                    </div>
                    <div className="text-xs text-primary font-bold mt-1">₹8,499</div>
                    <div className="text-[10px] text-on-surface-variant">Best Value • Available</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStorage('128 GB')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedStorage === '128 GB'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/40 bg-surface-container-lowest hover:border-primary/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-on-surface">6GB RAM + 128GB ROM</span>
                      {selectedStorage === '128 GB' && (
                        <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                      )}
                    </div>
                    <div className="text-xs text-primary font-bold mt-1">₹9,499</div>
                    <div className="text-[10px] text-on-surface-variant">High Performance (+₹1,000)</div>
                  </button>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
                  Select Color: <span className="text-primary font-semibold">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedColor('Magnetic Black')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                      selectedColor === 'Magnetic Black'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/30 bg-surface-container-lowest'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#1C202B] border border-white/20 shadow-inner"></span>
                    <span className="text-xs font-bold text-on-surface">Magnetic Black</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedColor('Spring White')}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition-all ${
                      selectedColor === 'Spring White'
                        ? 'border-primary bg-primary/5 ring-1 ring-primary'
                        : 'border-outline-variant/30 bg-surface-container-lowest'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-[#F0F4F8] border border-slate-300 shadow-inner"></span>
                    <span className="text-xs font-bold text-on-surface">Spring White</span>
                  </button>
                </div>
              </div>

              {/* Key Features Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">battery_charging_full</span>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-on-surface">5,000 mAh</div>
                    <div className="text-[10px] text-on-surface-variant">18W Fast Charge</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">photo_camera</span>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-on-surface">16MP AI Triple</div>
                    <div className="text-[10px] text-on-surface-variant">Wide + Macro</div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">memory</span>
                  <div className="text-left">
                    <div className="text-[11px] font-bold text-on-surface">Helio P65</div>
                    <div className="text-[10px] text-on-surface-variant">Octa-Core 2.0GHz</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenReserveModal(currentPhone)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-primary text-on-primary font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:brightness-105 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined text-[20px]">lock_clock</span>
                    Hold for 3 Hours (Free)
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenReserveModal(currentPhone)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-secondary-container text-on-secondary-container font-bold text-sm flex items-center justify-center gap-2 hover:bg-secondary-container/80 active:scale-95 transition-all border border-secondary/20"
                  >
                    <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
                    Buy Now / Doorstep COD
                  </button>
                </div>

                {/* Direct Seller Contact */}
                <SellerContactButtons product={currentPhone} size="lg" />

                {/* Showroom Contact Direct Link */}
                <div className="p-3.5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <span className="material-symbols-outlined text-[20px]">store</span>
                    </div>
                    <div>
                      <div className="text-xs font-bold text-on-surface flex items-center gap-1.5">
                        {currentPhone.storeName}
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary/10 text-primary">
                          Verified Shop
                        </span>
                      </div>
                      <div className="text-[11px] text-on-surface-variant">
                        {currentPhone.storeArea}, {currentPhone.city} • {currentPhone.distance} away
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${getSellerPhone(currentPhone)}`}
                      aria-label="Call shop"
                      className="w-9 h-9 rounded-xl bg-surface-container hover:bg-surface-container-high text-primary flex items-center justify-center transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">call</span>
                    </a>
                    <a
                      href={`https://wa.me/${getSellerPhone(currentPhone).replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="WhatsApp shop"
                      className="w-9 h-9 rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#1a9e4b] flex items-center justify-center transition-colors"
                    >
                      <WhatsAppIcon className="w-[18px] h-[18px]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagnostic, Specs and Local Stores Tabbed Section */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
          <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm space-y-6">
            
            {/* Tabs Bar */}
            <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-4 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveSpecTab('inspection')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSpecTab === 'inspection'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">verified</span>
                32-Point Quality Report
              </button>

              <button
                type="button"
                onClick={() => setActiveSpecTab('specs')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSpecTab === 'specs'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">tune</span>
                Full Technical Specifications
              </button>

              <button
                type="button"
                onClick={() => setActiveSpecTab('stores')}
                className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex items-center gap-2 whitespace-nowrap ${
                  activeSpecTab === 'stores'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">store</span>
                Compare Nearby Stores Stock ({isVivoY19 ? '3 Shops' : 'Local Stores'})
              </button>
            </div>

            {/* TAB 1: 32-POINT INSPECTION */}
            {activeSpecTab === 'inspection' && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-black text-lg shadow-sm">
                      32
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">
                        Phoneo Certified Diagnostics Complete
                      </h3>
                      <p className="text-xs text-on-surface-variant">
                        Every hardware, battery, and regulatory metric verified by certified technicians.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span>
                      100% Passed OEM Specs
                    </span>
                    <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface text-xs font-bold">
                      IMEI CEIR Clean
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(isVivoY19 ? vivoDetails.inspectionChecks : [
                    { name: 'Display & Touchscreen', category: 'Display & Touch', status: 'PASSED', details: 'Zero dead pixels, responsive multi-touch sampling rate intact', icon: 'touch_app' },
                    { name: 'Battery Health & Charge Cycle', category: 'Battery & Power', status: 'PASSED', details: 'Holds charge reliably, thermal dissipation tested', icon: 'battery_std' },
                    { name: 'Camera Optics & Focus', category: 'Cameras', status: 'PASSED', details: 'Auto-focus, optical/digital stabilization and flash working', icon: 'camera_alt' },
                    { name: 'Biometrics & Security', category: 'Sensors & Security', status: 'PASSED', details: 'Fast sensor responsiveness, secure enclave clear', icon: 'fingerprint' },
                    { name: 'Network & Signal Strength', category: 'Network', status: 'PASSED', details: 'Dual SIM VoLTE and dual-band Wi-Fi speed test passed', icon: 'verified_user' },
                    { name: 'Motherboard & Internal Shield', category: 'Motherboard', status: 'PASSED', details: 'No corrosion, liquid indicators pristine white', icon: 'memory' },
                  ]).map((check, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-2 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            {check.icon}
                          </span>
                          <span className="text-xs font-bold text-on-surface">{check.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[10px] flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[12px]">check</span>
                          PASSED
                        </span>
                      </div>
                      <p className="text-[11px] text-on-surface-variant leading-relaxed">
                        {check.details}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: TECHNICAL SPECS */}
            {activeSpecTab === 'specs' && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-on-surface">
                  Detailed Hardware Specifications ({currentPhone.name})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                      Performance & Display
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">Display Size & Type</span>
                        <span className="font-semibold text-on-surface text-right">
                          6.53-inch FHD+ (2340 × 1080) Halo FullView
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">Processor</span>
                        <span className="font-semibold text-on-surface text-right">
                          MediaTek Helio P65 Octa-Core (2.0 GHz)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">RAM & Storage</span>
                        <span className="font-semibold text-on-surface text-right">
                          4GB RAM + 64GB ROM (Dedicated MicroSD up to 256GB)
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-on-surface-variant">Operating System</span>
                        <span className="font-semibold text-on-surface text-right">
                          Funtouch OS 9.2 (based on Android 9)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 space-y-3">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider">
                      Battery, Camera & Build
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">Battery Capacity</span>
                        <span className="font-semibold text-on-surface text-right">
                          5,000 mAh Li-Po with 18W Dual-Engine Fast Charge
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">Rear Camera</span>
                        <span className="font-semibold text-on-surface text-right">
                          16MP (f/1.78) + 8MP Super Wide + 2MP Macro
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-outline-variant/20">
                        <span className="text-on-surface-variant">Front Selfie</span>
                        <span className="font-semibold text-on-surface text-right">
                          16MP (f/2.0) AI Face Beauty
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-on-surface-variant">Sensors & Security</span>
                        <span className="font-semibold text-on-surface text-right">
                          Rear Fingerprint Scanner + AI Face Access
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NEARBY STORE OFFERS */}
            {activeSpecTab === 'stores' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-on-surface">
                    Verified Phoneo Showrooms with Stock for this Model
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    All prices include Phoneo Escrow & 6-Month Warranty
                  </span>
                </div>

                <div className="space-y-3">
                  {(isVivoY19
                    ? vivoDetails.verifiedStoresOfferingThisModel
                    : [
                        {
                          storeId: 'store-balaji',
                          storeName: 'Shree Balaji Mobile Hub',
                          badge: 'Phoneo Gold Partner',
                          location: 'Shop 14, Pandri, Raipur',
                          distance: '1.2 km away',
                          price: currentPhone.price,
                          stockCount: 'In Stock',
                          freebies: ['Free Tempered Glass', 'Original Charger'],
                          contactPhone: '+91 98765 43210',
                        },
                        {
                          storeId: 'store-steel-city',
                          storeName: 'Steel City Mobile Point',
                          badge: 'GST Verified Partner',
                          location: 'Civic Centre, Bhilai',
                          distance: '4.8 km away',
                          price: currentPhone.price + 150,
                          stockCount: '1 Unit Left',
                          freebies: ['TPU Case Included'],
                          contactPhone: '+91 98765 43211',
                        },
                      ]
                  ).map((st, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-on-surface">{st.storeName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                            {st.badge}
                          </span>
                        </div>
                        <p className="text-xs text-on-surface-variant">
                          {st.location} • <strong className="text-on-surface">{st.distance}</strong>
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {st.freebies.map((fb, fidx) => (
                            <span
                              key={fidx}
                              className="text-[10px] px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-medium flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[11px] text-emerald-600">check</span>
                              {fb}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                        <div className="text-right">
                          <div className="text-base font-extrabold text-primary">
                            {formatRupee(st.price)}
                          </div>
                          <div className="text-[10px] text-emerald-600 font-bold">{st.stockCount}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => onOpenReserveModal(currentPhone)}
                          className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold hover:brightness-105 transition-all shadow-sm flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[15px]">lock_clock</span>
                          Hold at Store
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // CATALOG VIEW: "VIEW ALL PHONES"
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-20">
      {/* Top Header Banner */}
      <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-8 border border-outline-variant/30 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-label-sm text-xs font-bold">
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            Verified Local Inventory • {activeCity} Hub
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold text-on-surface font-headline-lg tracking-tight">
            All Certified Pre-Owned Phones
          </h1>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Browse phones tested with Phoneo’s 32-point inspection across verified local retail shops in {activeCity}. Pay in person upon inspection or hold for free.
          </p>
        </div>
      </div>

      {/* Search and Filter Controls */}
      <div className="space-y-4">
        {/* Search Bar & Sorting */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by brand, model or store (e.g. Vivo Y19, iPhone 14 Pro, Balaji Mobile)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-surface-container-lowest border border-outline-variant/40 text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-on-surface-variant">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/40 text-xs font-semibold text-on-surface focus:outline-none"
            >
              <option value="recommended">Recommended</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated Shops</option>
            </select>
          </div>
        </div>

        {/* Brand Logos Reel / Pills */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              Filter by Official Brand
            </span>
            {selectedBrand !== 'All' && (
              <button
                type="button"
                onClick={() => setSelectedBrand('All')}
                className="text-xs text-primary font-semibold hover:underline"
              >
                Reset Brand
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {brandsList.map((brandName) => {
              const isSelected = selectedBrand === brandName;
              return (
                <button
                  key={brandName}
                  type="button"
                  onClick={() => setSelectedBrand(brandName)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    isSelected
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-lowest text-on-surface border border-outline-variant/30 hover:border-primary/40'
                  }`}
                >
                  {brandName !== 'All' ? (
                    <BrandLogo
                      brand={brandName}
                      className="w-4 h-4 shrink-0"
                      mono={isSelected}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-[16px]">apps</span>
                  )}
                  <span>{brandName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Filter Chips: Price & Condition Grade */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-on-surface-variant font-semibold">Budget:</span>
          {(['All', 'under15k', '15k-30k', '30k-60k', 'above60k'] as const).map((pr) => (
            <button
              key={pr}
              type="button"
              onClick={() => setPriceRange(pr)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                priceRange === pr
                  ? 'bg-secondary-container text-on-secondary-container ring-1 ring-secondary'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {pr === 'All'
                ? 'All Prices'
                : pr === 'under15k'
                ? '< ₹15,000'
                : pr === '15k-30k'
                ? '₹15k – ₹30k'
                : pr === '30k-60k'
                ? '₹30k – ₹60k'
                : '₹60,000+'}
            </button>
          ))}

          <span className="text-outline mx-1">|</span>

          <span className="text-on-surface-variant font-semibold">Grade:</span>
          {(['All', 'Pristine', 'Grade A+', 'Mint Grade'] as const).map((gr) => (
            <button
              key={gr}
              type="button"
              onClick={() => setSelectedGrade(gr)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                selectedGrade === gr
                  ? 'bg-primary/10 text-primary ring-1 ring-primary/30'
                  : 'bg-surface-container-low text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {gr}
            </button>
          ))}
        </div>
      </div>

      {/* Phone Catalog Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-on-surface">
            Showing {filteredProducts.length} certified smartphones
          </span>
          <span className="text-xs text-on-surface-variant">
            All units backed by Phoneo Escrow & Store Pickup
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 rounded-3xl bg-surface-container-lowest text-center space-y-3 border border-outline-variant/30">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant">
              search_off
            </span>
            <h3 className="text-base font-bold text-on-surface">
              No smartphones found matching these filters
            </h3>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
              Try resetting your search query or selecting "All Brands" to see all verified phones in {activeCity}.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedBrand('All');
                setSelectedGrade('All');
                setPriceRange('All');
              }}
              className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-bold"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((prod) => {
              const isVivoY19 = prod.id === '88782' || prod.name.includes('Vivo Y19');
              return (
                <div
                  key={prod.id}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl border border-teal-900/10 hover:border-teal-700/40 shadow-[0_12px_32px_-4px_rgba(0,106,97,0.18)] hover:shadow-[0_22px_45px_-6px_rgba(0,106,97,0.3)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
                >
                  {/* Card Header & Image */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <BrandLogo brand={prod.brand} className="w-5 h-5" />
                        <span className="text-xs font-bold text-on-surface uppercase">
                          {prod.brand}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                        {prod.grade}
                      </span>
                    </div>

                    {/* Phone Image Container */}
                    <div
                      onClick={() => {
                        onSelectProduct(prod);
                        setViewMode('detail');
                      }}
                      className="h-44 flex items-center justify-center p-2 cursor-pointer bg-surface-container-low/50 rounded-xl relative group-hover:bg-surface-container-low transition-colors"
                    >
                      <img
                        src={prod.image}
                        alt={prod.name}
                        className="max-h-full max-w-full object-contain drop-shadow transition-transform duration-300 group-hover:scale-105"
                      />

                      {isVivoY19 && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-primary text-on-primary text-[9px] font-bold shadow-sm">
                          ID #88782
                        </span>
                      )}
                    </div>

                    {/* Phone Title & Specs */}
                    <div className="space-y-1">
                      <h3
                        onClick={() => {
                          onSelectProduct(prod);
                          setViewMode('detail');
                        }}
                        className="text-sm font-bold text-on-surface line-clamp-1 hover:text-primary transition-colors cursor-pointer"
                      >
                        {prod.name}
                      </h3>
                      <p className="text-[11px] text-on-surface-variant line-clamp-1">
                        {prod.specs}
                      </p>
                    </div>

                    {/* Feature Pill */}
                    <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant bg-surface-container-low px-2 py-1 rounded-lg">
                      <span className="material-symbols-outlined text-[13px] text-primary">
                        {prod.featureIcon || 'verified'}
                      </span>
                      <span className="truncate">{prod.batteryOrFeature}</span>
                    </div>

                    {/* Store Name & Distance */}
                    <div className="text-[11px] text-on-surface-variant flex items-center justify-between pt-1 border-t border-outline-variant/20">
                      <span className="truncate font-medium">{prod.storeName}</span>
                      <span className="font-bold text-primary shrink-0">{prod.distance}</span>
                    </div>
                  </div>

                  {/* Card Bottom / Price & CTA */}
                  <div className="p-4 pt-0 space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-base font-extrabold text-on-surface">
                          {formatRupee(prod.price)}
                        </div>
                        <div className="text-[10px] text-on-surface-variant/70 line-through">
                          {formatRupee(prod.originalPrice)}
                        </div>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600">
                        {prod.discountPercent}% OFF
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(prod);
                        setViewMode('detail');
                      }}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-primary to-teal-700 hover:brightness-105 text-on-primary text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-[0_4px_12px_rgba(0,106,97,0.3)] hover:shadow-[0_6px_18px_rgba(0,106,97,0.4)] hover:-translate-y-0.5 active:scale-95"
                    >
                      <span>View Deal</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                    <SellerContactButtons product={prod} size="sm" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
