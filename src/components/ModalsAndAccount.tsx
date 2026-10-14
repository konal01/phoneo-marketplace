import React, { useState } from 'react';
import {
  AuctionItem,
  CITIES,
  CityName,
  formatRupee,
  formatTimeLeft,
  ProductItem,
  USER_AVATAR_URL,
} from '../data';

// 1. City Picker Bottom Sheet / Modal
export const LocationSheetModal: React.FC<{
  isOpen: boolean;
  activeCity: CityName;
  onClose: () => void;
  onSelectCity: (city: CityName) => void;
}> = ({ isOpen, activeCity, onClose, onSelectCity }) => {
  const [cityQuery, setCityQuery] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter((c) =>
    c.name.toLowerCase().includes(cityQuery.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xl flex flex-col justify-end md:justify-center md:items-center transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-2xl rounded-t-3xl md:rounded-[32px] p-space-lg w-full md:max-w-lg max-h-[85vh] overflow-y-auto shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-error text-[24px]">location_on</span>
            <span className="font-title-md text-title-md text-on-surface">Select Your City</span>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-surface-container-low flex items-center justify-center text-outline hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-4">
          Providing your city tailors second-hand listings, certified local shop warranties, and
          live shopkeeper auction pools near you.
        </p>

        {/* Auto Detect Button */}
        <button
          className="w-full bg-surface-container-low hover:bg-surface-container text-primary font-label-md text-label-md py-3 rounded-2xl flex items-center justify-center gap-2 mb-4 active:scale-95 transition-transform"
          onClick={() => {
            onSelectCity('Raipur');
            onClose();
          }}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">near_me</span>
          <span>Detect My Current Location (GPS)</span>
        </button>

        {/* Search Input */}
        <div className="relative mb-4">
          <span className="material-symbols-outlined text-outline absolute left-3 top-3 text-[18px]">
            search
          </span>
          <input
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
            className="w-full bg-surface-container-low rounded-xl pl-9 pr-3 py-2.5 font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none"
            placeholder="Search city or pincode..."
            type="text"
          />
        </div>

        {/* City Tiles */}
        <div className="grid grid-cols-3 gap-2 pb-4">
          {filteredCities.map((c) => {
            const isCurrent = c.name === activeCity;
            return (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  onSelectCity(c.name);
                  onClose();
                }}
                className={`p-3 rounded-2xl flex flex-col items-center gap-1 active:scale-95 transition-transform ${
                  isCurrent
                    ? 'bg-primary/15 text-primary ring-1 ring-primary'
                    : 'bg-surface-container-low text-on-surface hover:bg-surface-container'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[24px] ${
                    isCurrent ? 'text-primary' : 'text-outline'
                  }`}
                >
                  {c.icon}
                </span>
                <span className="font-label-md text-label-md">{c.name}</span>
                {isCurrent ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider text-primary">
                    Active
                  </span>
                ) : (
                  <span className="text-[9px] text-outline">{c.stores} Stores</span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 2. Start Free Phone Auction Modal / Drawer
export const StartAuctionModal: React.FC<{
  isOpen: boolean;
  activeCity: CityName;
  initialModel?: string;
  onClose: () => void;
  onLaunchAuction: (newAuction: {
    model: string;
    condition: string;
    accessories: string[];
    startingBid: number;
  }) => void;
}> = ({ isOpen, activeCity, initialModel, onClose, onLaunchAuction }) => {
  const [modelName, setModelName] = useState(
    initialModel || 'Apple iPhone 13 (128GB Midnight)'
  );
  const [condition, setCondition] = useState<'Flawless (No Scratch)' | 'Minor Scratches' | 'Dented / Cracked'>(
    'Flawless (No Scratch)'
  );
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([
    'Original Box',
    'Original Bill',
    'Fast Cable',
  ]);

  if (!isOpen) return null;

  const toggleAccessory = (acc: string) => {
    setSelectedAccessories((prev) =>
      prev.includes(acc) ? prev.filter((a) => a !== acc) : [...prev, acc]
    );
  };

  const handleConfirm = () => {
    const baseBid =
      condition === 'Flawless (No Scratch)'
        ? 34000
        : condition === 'Minor Scratches'
        ? 30500
        : 25500;
    onLaunchAuction({
      model: modelName || 'Apple iPhone 13 (128GB)',
      condition,
      accessories: selectedAccessories.length ? selectedAccessories : ['IMEI Verified'],
      startingBid: baseBid,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xl flex flex-col justify-end md:justify-center md:items-center transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full md:max-w-lg bg-white/90 backdrop-blur-2xl rounded-t-3xl md:rounded-[32px] p-6 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Start Free Phone Auction
            </h3>
          </div>
          <button
            aria-label="Close modal"
            className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1">
              Select Phone Model
            </label>
            <input
              className="w-full bg-surface-container-low rounded-xl px-3.5 py-2.5 font-body-md text-body-md text-on-surface outline-none focus:ring-2 focus:ring-primary"
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              Cosmetic Condition
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(
                ['Flawless (No Scratch)', 'Minor Scratches', 'Dented / Cracked'] as const
              ).map((cond) => {
                const isSel = condition === cond;
                return (
                  <button
                    key={cond}
                    onClick={() => setCondition(cond)}
                    className={`py-2 px-1 rounded-xl font-label-sm text-label-sm text-center transition-all ${
                      isSel
                        ? 'bg-primary-fixed text-on-primary-fixed ring-1 ring-primary font-bold'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                    type="button"
                  >
                    {cond}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="font-label-md text-label-md text-on-surface block mb-1.5">
              Accessories Available
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {['Original Box', 'Original Bill', 'Fast Cable'].map((acc) => {
                const isSel = selectedAccessories.includes(acc);
                return (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => toggleAccessory(acc)}
                    className={`px-3 py-1.5 rounded-full font-label-sm text-label-sm flex items-center gap-1 transition-all ${
                      isSel
                        ? 'bg-surface-container-high text-on-surface ring-1 ring-primary'
                        : 'bg-surface-container-low text-on-surface-variant'
                    }`}
                  >
                    <span
                      className={`material-symbols-outlined text-[15px] ${
                        isSel ? 'text-primary' : 'text-outline'
                      }`}
                    >
                      {isSel ? 'check' : 'add'}
                    </span>{' '}
                    {acc}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-secondary-container text-on-secondary-fixed flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[22px]">notifications_active</span>
            <p className="font-body-sm text-body-sm">
              42 shopkeepers in {activeCity} are notified as soon as you launch this live pool.
            </p>
          </div>

          <button
            className="w-full py-3.5 rounded-full bg-primary text-on-primary font-label-lg text-label-lg shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
            onClick={handleConfirm}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
            <span>Launch 30-Min Live Auction</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// 3. Reserve at Store Modal
export const ReservationModal: React.FC<{
  product: ProductItem | null;
  onClose: () => void;
  onConfirmReserve: (product: ProductItem, phone: string) => void;
}> = ({ product, onClose, onConfirmReserve }) => {
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xl flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-2xl rounded-[32px] max-w-md w-full p-6 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary-container"></span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              Reserve at Store
            </h3>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          This phone will be kept on hold exclusively for you at{' '}
          <strong className="text-on-surface">
            {product.storeName} ({product.storeArea})
          </strong>{' '}
          for up to 3 hours without any advance payment.
        </p>
        <div className="p-3 bg-surface-container-low rounded-xl flex items-center gap-3">
          <img
            alt={product.name}
            src={product.image}
            className="w-14 h-14 rounded-lg object-cover bg-surface-container-lowest"
          />
          <div>
            <p className="font-title-sm text-title-sm text-on-surface font-semibold">
              {product.name}
            </p>
            <p className="font-label-md text-label-md text-primary font-bold">
              {formatRupee(product.price)}{' '}
              <span className="text-outline line-through font-normal text-xs">
                {formatRupee(product.originalPrice)}
              </span>
            </p>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="block font-label-md text-label-md text-on-surface mb-1">
              Your Mobile Number (for SMS confirmation)
            </label>
            <input
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary font-body-md text-body-md"
              placeholder="+91 98765 43210"
              type="tel"
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            onConfirmReserve(product, phoneInput);
            onClose();
          }}
          className="w-full py-3 rounded-full bg-primary text-on-primary font-title-sm text-title-sm font-bold hover:bg-primary-container hover:text-on-primary-container transition-all shadow-md"
        >
          Confirm Free Reservation
        </button>
      </div>
    </div>
  );
};

// 4. 32-Point Device Inspection Report Modal
export const DeviceInspectionModal: React.FC<{
  product: ProductItem | null;
  onClose: () => void;
  onReserve: (product: ProductItem) => void;
}> = ({ product, onClose, onReserve }) => {
  if (!product) return null;

  const checkpoints = [
    { label: 'Original OLED / Display Panel', status: 'Passed (TrueTone OK)' },
    { label: 'Battery Health & Cycle Count', status: product.batteryOrFeature },
    { label: 'Motherboard & Repair History', status: '100% Unopened Original' },
    { label: 'FaceID / Biometric Sensors', status: 'Verified Responsive' },
    { label: 'Rear & Front Camera Optics', status: 'Zero Dust / Crisp Focus' },
    { label: 'IMEI & CEIR Police Blacklist Check', status: 'Clean & GST Billed' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-xl flex items-center justify-center p-4 transition-all animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white/90 backdrop-blur-2xl rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-[0_25px_70px_-15px_rgba(0,0,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.95)] border border-white/80 space-y-4 max-h-[88vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-md text-label-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            32-Point Certified Report
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex gap-4 items-center bg-surface-container-low p-3.5 rounded-2xl">
          <img
            alt={product.name}
            src={product.image}
            className="w-20 h-20 rounded-xl object-contain bg-surface-container-lowest p-1"
          />
          <div>
            <span className="font-label-sm text-label-sm text-primary uppercase">
              {product.grade} • {product.warranty}
            </span>
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
              {product.name}
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">{product.specs}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-headline-sm text-headline-sm text-primary font-extrabold">
                {formatRupee(product.price)}
              </span>
              <span className="text-xs line-through text-outline">
                {formatRupee(product.originalPrice)}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-title-sm text-title-sm text-on-surface">
            Hardware Diagnostic Checklist
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {checkpoints.map((cp) => (
              <div
                key={cp.label}
                className="p-2.5 rounded-xl bg-surface-container-low flex items-start gap-2"
              >
                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">
                  check_circle
                </span>
                <div>
                  <p className="font-label-sm text-label-sm text-on-surface">{cp.label}</p>
                  <p className="font-body-sm text-[11px] text-primary">{cp.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">storefront</span>
            <div>
              <p className="font-label-md text-label-md text-on-surface">{product.storeName}</p>
              <p className="font-body-sm text-[11px] text-on-surface-variant">
                {product.storeArea}, {product.city} • {product.distance}
              </p>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-tertiary font-bold">
            ★ {product.rating}
          </span>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-full bg-surface-container text-on-surface font-title-sm text-title-sm"
          >
            Close
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onReserve(product);
            }}
            className="flex-1 py-3 rounded-full bg-primary text-on-primary font-title-sm text-title-sm font-bold shadow-md flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[18px]">lock_clock</span>
            Hold Free at Store
          </button>
        </div>
      </div>
    </div>
  );
};

// 5. Account / My Bids & Reservations View
export const AccountDashboardView: React.FC<{
  activeCity: CityName;
  reservations: { product: ProductItem; phone: string; time: string }[];
  wishlistIds: string[];
  products: ProductItem[];
  auctions: AuctionItem[];
  onNavigate: (tab: 'home' | 'auctions' | 'stores' | 'account') => void;
  onOpenStartAuctionModal: () => void;
  onOpenReserveModal: (product: ProductItem) => void;
  currentUser?: { name: string; phoneOrEmail?: string } | null;
  onOpenLoginModal?: () => void;
  onLogout?: () => void;
}> = ({
  activeCity,
  reservations,
  wishlistIds,
  products,
  auctions,
  onNavigate,
  onOpenStartAuctionModal,
  onOpenReserveModal,
  currentUser,
  onOpenLoginModal,
  onLogout,
}) => {
  const savedProducts = products.filter((p) => wishlistIds.includes(p.id));
  const savedAuctions = auctions.filter((a) => wishlistIds.includes(a.id));

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 space-y-6 pb-20">
      {/* User Profile Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 text-primary font-black text-2xl flex items-center justify-center ring-2 ring-primary uppercase shadow-sm">
            {currentUser ? currentUser.name.charAt(0) : 'P'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
                {currentUser?.name || 'Phoneo Verified Member'}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                {currentUser ? 'Verified Account' : 'KYC Verified'}
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {currentUser?.phoneOrEmail || '+91 98XXX XXXXX'} • Active Hub: <strong>{activeCity}, CG</strong>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {currentUser ? (
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">logout</span>
              Sign Out
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-title-sm text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Sign In / Register
            </button>
          )}
          <button
            type="button"
            onClick={onOpenStartAuctionModal}
            className="px-5 py-2.5 rounded-full bg-primary text-on-primary font-title-sm text-title-sm flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            Sell Old Phone
          </button>
        </div>
      </div>

      {/* Active Store Reservations */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">lock_clock</span>
            Active Store Reservations ({reservations.length})
          </h3>
          <button
            type="button"
            onClick={() => onNavigate('stores')}
            className="font-label-md text-label-md text-primary"
          >
            Browse Stores →
          </button>
        </div>
        {reservations.length === 0 ? (
          <div className="p-6 rounded-xl bg-surface-container-low text-center space-y-2">
            <p className="font-body-md text-body-md text-on-surface-variant">
              No phones currently held at local stores. Reserve any certified phone for 3 hours free!
            </p>
            <button
              type="button"
              onClick={() => onNavigate('home')}
              className="px-4 py-2 rounded-full bg-primary text-on-primary font-label-md text-label-md"
            >
              Explore Verified Deals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reservations.map((res, idx) => (
              <div
                key={`${res.product.id}-${idx}`}
                className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={res.product.name}
                    src={res.product.image}
                    className="w-14 h-14 rounded-lg object-cover bg-surface-container-lowest"
                  />
                  <div>
                    <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-[10px]">
                      Held for 3 Hrs
                    </span>
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold mt-0.5">
                      {res.product.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {res.product.storeName} • {formatRupee(res.product.price)}
                    </p>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-primary">{res.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Saved Wishlist Items */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-error filled">favorite</span>
          Saved Wishlist &amp; Watched Auctions ({savedProducts.length + savedAuctions.length})
        </h3>
        {savedProducts.length === 0 && savedAuctions.length === 0 ? (
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Tap the heart or bookmark icon on any smartphone or live auction to save it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {savedProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={p.name}
                    src={p.image}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container-lowest"
                  />
                  <div>
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold">
                      {p.name}
                    </h4>
                    <p className="font-body-sm text-body-sm text-primary font-bold">
                      {formatRupee(p.price)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenReserveModal(p)}
                  className="px-3 py-1.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm"
                >
                  Reserve
                </button>
              </div>
            ))}
            {savedAuctions.map((a) => (
              <div
                key={a.id}
                className="p-3.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    alt={a.model}
                    src={a.image}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container-lowest"
                  />
                  <div>
                    <h4 className="font-title-sm text-title-sm text-on-surface font-bold">
                      {a.model}
                    </h4>
                    <p className="font-body-sm text-body-sm text-primary font-bold">
                      Bid: {formatRupee(a.highestBid)} • {formatTimeLeft(a.secondsLeft)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('auctions')}
                  className="px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm"
                >
                  Bid Deck
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
