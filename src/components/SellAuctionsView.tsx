import React, { useState } from 'react';
import {
  AuctionItem,
  CityName,
  formatRupee,
  formatTimeLeft,
  VALUATION_PRICE_MATRIX,
} from '../data';

interface SellAuctionsViewProps {
  isMobileMode: boolean;
  activeCity: CityName;
  auctions: AuctionItem[];
  rolePerspective: 'seller' | 'retailer';
  onSwitchPerspective: (role: 'seller' | 'retailer') => void;
  onRaiseBid: (auctionId: string, amount: number) => void;
  onSubmitCustomBid: (auctionId: string, amount: number) => void;
  onOpenStartAuctionModal: (prefillModel?: string) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  showToast: (title: string, desc: string) => void;
}

export const SellAuctionsView: React.FC<SellAuctionsViewProps> = ({
  isMobileMode,
  activeCity,
  auctions,
  rolePerspective,
  onSwitchPerspective,
  onRaiseBid,
  onSubmitCustomBid,
  onOpenStartAuctionModal,
  wishlist,
  onToggleWishlist,
  showToast,
}) => {
  // Valuation calculator in Sell view
  const [calcBrand, setCalcBrand] = useState('apple');
  const [calcModel, setCalcModel] = useState('ip13');
  const [calcCondition, setCalcCondition] = useState<'flawless' | 'good' | 'fair'>('flawless');
  const [batteryValue, setBatteryValue] = useState(88);
  const [customBidValues, setCustomBidValues] = useState<Record<string, string>>({});
  const [walletBalance, setWalletBalance] = useState(75000);

  const estimatedQuote =
    VALUATION_PRICE_MATRIX[calcModel]?.[calcCondition]?.range || '₹31,500 – ₹35,200';

  const handleCustomBidChange = (id: string, val: string) => {
    setCustomBidValues((prev) => ({ ...prev, [id]: val }));
  };

  const handlePlaceCustomBid = (auc: AuctionItem) => {
    const rawVal = customBidValues[auc.id];
    const val = parseInt(rawVal, 10);
    if (!val || isNaN(val)) {
      onRaiseBid(auc.id, 500);
      return;
    }
    if (val <= auc.highestBid) {
      showToast('Bid Too Low', `Your bid must exceed ${formatRupee(auc.highestBid)}`);
      return;
    }
    onSubmitCustomBid(auc.id, val);
    setCustomBidValues((prev) => ({ ...prev, [auc.id]: '' }));
  };

  const handleRefillWallet = () => {
    setWalletBalance((prev) => prev + 25000);
    showToast('Escrow Refilled', '₹25,000 added to your shopkeeper bidding wallet');
  };

  // ==================== MOBILE VIEW (Matches Stitch Screen bc242e4d80a04b02bdd92d4239dc699e) ====================
  if (isMobileMode) {
    return (
      <div className="flex flex-col w-full pb-8">
        {/* Role Segment Selector */}
        <section className="px-margin-mobile pt-3 pb-2">
          <div className="p-1 rounded-full bg-surface-container-high flex items-center shadow-sm">
            <button
              className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                rolePerspective === 'seller'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => onSwitchPerspective('seller')}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">smartphone</span>
              <span>I Want to Sell</span>
            </button>
            <button
              className={`flex-1 py-2 rounded-full font-label-md text-label-md transition-all flex items-center justify-center gap-1.5 ${
                rolePerspective === 'retailer'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => onSwitchPerspective('retailer')}
              type="button"
            >
              <span className="material-symbols-outlined text-[17px]">gavel</span>
              <span>Shopkeeper Deck</span>
              <span className="px-1.5 py-0.5 rounded-full bg-primary-container text-on-primary font-label-sm text-[10px] leading-none">
                LIVE
              </span>
            </button>
          </div>
          {/* Become a Seller CRM Quick Action */}
          <div className="pt-2">
            <a
              href="https://seller.phoneo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 px-3 rounded-xl bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-between text-xs text-primary font-bold shadow-xs hover:bg-surface-container transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">storefront</span>
                <span>Mobile Shop Owner? Open Seller Portal</span>
              </span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </a>
          </div>
        </section>

        {/* VIEW 1: SELLER FUNNEL */}
        {rolePerspective === 'seller' ? (
          <div className="flex flex-col w-full gap-5">
            {/* Hero Valuation & Live Demand Banner */}
            <section className="px-margin-mobile">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-container-lowest via-surface-container to-surface-container-high p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></span>
                    42 Shopkeepers Active in {activeCity}
                  </span>
                  <span className="text-tertiary font-label-sm text-label-sm flex items-center gap-1">
                    <span className="material-symbols-outlined text-[15px] filled">bolt</span>
                    Avg 4 min close
                  </span>
                </div>
                <h2 className="font-headline-xl-mobile text-headline-xl-mobile text-on-surface tracking-tight">
                  Sell Your Phone at Highest Local Bid
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-1.5">
                  No bargaining or stranger meetups. Local verified stores compete live for your
                  smartphone.
                </p>

                {/* Dynamic Value Estimator Mini-Widget */}
                <div className="mt-4 p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-label-md text-on-surface font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-primary text-[18px]">
                        price_check
                      </span>
                      Instant Resale Calculator
                    </span>
                    <span className="font-label-sm text-label-sm text-outline">
                      {activeCity} &amp; Bhilai Avg
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                        Brand
                      </label>
                      <select
                        className="w-full bg-surface-container-low rounded-lg px-2.5 py-2 font-body-sm text-body-sm text-on-surface outline-none cursor-pointer"
                        value={calcBrand}
                        onChange={(e) => {
                          const b = e.target.value;
                          setCalcBrand(b);
                          if (b === 'apple') setCalcModel('ip13');
                          else if (b === 'samsung') setCalcModel('s23');
                          else if (b === 'oneplus') setCalcModel('op11');
                          else setCalcModel('ip14');
                        }}
                      >
                        <option value="apple">Apple</option>
                        <option value="samsung">Samsung</option>
                        <option value="oneplus">OnePlus</option>
                        <option value="iqoo">iQOO / Vivo</option>
                      </select>
                    </div>
                    <div>
                      <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1">
                        Model &amp; Spec
                      </label>
                      <select
                        className="w-full bg-surface-container-low rounded-lg px-2.5 py-2 font-body-sm text-body-sm text-on-surface outline-none cursor-pointer"
                        value={calcModel}
                        onChange={(e) => setCalcModel(e.target.value)}
                      >
                        <option value="ip13">iPhone 13 (128GB)</option>
                        <option value="ip14">iPhone 14 (128GB)</option>
                        <option value="s23">Galaxy S23 (256GB)</option>
                        <option value="op11">OnePlus 11 (256GB)</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Live Market Range:
                    </span>
                    <span className="font-headline-sm text-headline-sm text-primary font-bold">
                      {estimatedQuote}
                    </span>
                  </div>
                  <button
                    className="w-full py-3 rounded-full bg-primary text-on-primary font-label-lg text-label-lg flex items-center justify-center gap-2 shadow-md active:scale-95 transition-transform"
                    onClick={() => onOpenStartAuctionModal(calcModel)}
                    type="button"
                  >
                    <span>Start Free Auction (Takes 2 Mins)</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 3 Easy Steps Flow */}
            <section className="px-margin-mobile">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  Sell in 3 Easy Steps
                </h3>
                <span className="font-label-sm text-label-sm text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  100% Zero Fee
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2.5">
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-fixed flex items-center justify-center font-headline-sm text-headline-sm shrink-0 font-bold">
                    1
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title-sm text-title-sm text-on-surface">
                      Describe Device &amp; Condition
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Tap cosmetic health, battery life &amp; box/bill availability. Takes under 90
                      seconds.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-headline-sm text-headline-sm shrink-0 font-bold">
                    2
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title-sm text-title-sm text-on-surface">
                      30-Min Live Shopkeeper Auction
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Your phone is beamed to 40+ verified physical stores in {activeCity} &amp;
                      Durg competing on price.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-surface-container-low flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center font-headline-sm text-headline-sm shrink-0 font-bold">
                    3
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-title-sm text-title-sm text-on-surface">
                      Doorstep Cash or Store Walk-in
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Accept the highest offer. Choose instant UPI on pickup or collect cash
                      directly at shop.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Completed Auctions Social Proof */}
            <section className="px-margin-mobile">
              <div className="p-4 rounded-xl bg-surface-container-lowest shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-label-md text-on-surface font-bold">
                    Sold Today via Phoneo Auction
                  </span>
                  <span className="font-label-sm text-label-sm text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                    Live Updates
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface truncate">
                          iPhone 12 (64GB) • Pandri
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Closed by Shree Telecom in 14 mins
                        </p>
                      </div>
                    </div>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold shrink-0">
                      ₹23,800
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-primary text-[20px]">
                        check_circle
                      </span>
                      <div className="min-w-0">
                        <p className="font-label-md text-label-md text-on-surface truncate">
                          OnePlus 9RT (128GB) • Supela
                        </p>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">
                          Closed by Balaji Cell in 22 mins
                        </p>
                      </div>
                    </div>
                    <span className="font-title-sm text-title-sm text-on-surface font-bold shrink-0">
                      ₹18,400
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        ) : (
          /* VIEW 2: SHOPKEEPER BIDDING DECK */
          <div className="flex flex-col w-full gap-4">
            {/* Live Deck Stat Header */}
            <section className="px-margin-mobile">
              <div className="p-4 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-md flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-container animate-ping"></span>
                    <span className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-wider">
                      Verified Shopkeeper Room
                    </span>
                  </div>
                  <h2 className="font-headline-md text-headline-md text-surface-container-lowest mt-0.5">
                    Live Auctions in {activeCity} &amp; Durg
                  </h2>
                  <p className="font-body-sm text-body-sm text-surface-variant mt-0.5">
                    18 stores actively bidding • {auctions.length} auctions ending soon
                  </p>
                </div>
                <div
                  onClick={handleRefillWallet}
                  className="p-2.5 rounded-xl bg-surface-container-highest/20 text-center shrink-0 cursor-pointer hover:bg-surface-container-highest/30 transition-colors"
                >
                  <span className="font-label-sm text-label-sm text-surface-variant block">
                    Your Wallet
                  </span>
                  <span className="font-title-sm text-title-sm text-primary-fixed font-bold">
                    {formatRupee(walletBalance)}
                  </span>
                </div>
              </div>
            </section>

            {/* Auction Cards */}
            {auctions.map((auc) => {
              const isSaved = wishlist.includes(auc.id);
              const customVal = customBidValues[auc.id] || '';
              return (
                <article key={auc.id} className="px-margin-mobile">
                  <div className="rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/80 shadow-[0_8px_24px_-4px_rgba(13,148,136,0.12),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_16px_32px_-4px_rgba(13,148,136,0.22)] hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 p-4 flex flex-col gap-3 relative overflow-hidden">
                    {/* Top bar: live countdown & condition badges */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 border border-teal-200 text-teal-700 font-label-sm text-label-sm flex items-center gap-1 font-bold">
                          <span className="material-symbols-outlined text-[13px]">verified_user</span>
                          32-Pt Inspected
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
                          {auc.batteryHealth}
                        </span>
                      </div>
                      {/* Pulsing Countdown */}
                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-error-container text-on-error-container font-label-md text-label-md font-bold shrink-0">
                        <span className="material-symbols-outlined text-[15px] animate-spin">
                          timelapse
                        </span>
                        <span>{formatTimeLeft(auc.secondsLeft)}</span>
                      </div>
                    </div>

                    {/* Phone Spec row */}
                    <div className="flex items-center gap-3">
                      <div className="w-20 h-20 rounded-xl bg-surface-container-low overflow-hidden shrink-0 relative">
                        <img
                          alt={auc.model}
                          className="w-full h-full object-cover"
                          src={auc.image}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate">
                            {auc.model}
                          </h3>
                          <button
                            aria-label="Favorite"
                            onClick={() => onToggleWishlist(auc.id)}
                            className={`transition-colors ${
                              isSaved ? 'text-error' : 'text-outline hover:text-error'
                            }`}
                            type="button"
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isSaved ? 'filled' : ''
                              }`}
                            >
                              bookmark
                            </span>
                          </button>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant truncate">
                          {auc.specs}
                        </p>
                        <div className="flex items-center gap-1 mt-1 text-on-surface-variant font-body-sm text-body-sm">
                          <span className="material-symbols-outlined text-primary text-[15px]">
                            location_on
                          </span>
                          <span className="truncate">
                            {auc.sellerName} ({auc.location} • {auc.distance})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bidding Stats Row */}
                    <div className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between">
                      <div>
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">
                          Highest Bid by {auc.leadingStore}
                        </span>
                        <span className="font-headline-md text-headline-md text-primary font-extrabold">
                          {formatRupee(auc.highestBid)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-body-sm text-body-sm text-on-surface-variant block">
                          Total Bids
                        </span>
                        <span className="font-title-sm text-title-sm text-on-surface font-bold">
                          {auc.totalBids} shop bids
                        </span>
                      </div>
                    </div>

                    {/* Shopkeeper Action Controls */}
                    <div className="flex flex-col gap-2 pt-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                        Quick Raise
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          className="py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors text-center active:scale-95"
                          onClick={() => onRaiseBid(auc.id, 500)}
                          type="button"
                        >
                          + ₹500
                        </button>
                        <button
                          className="py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors text-center active:scale-95"
                          onClick={() => onRaiseBid(auc.id, 1000)}
                          type="button"
                        >
                          + ₹1,000
                        </button>
                        <button
                          className="py-2 rounded-lg bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors text-center active:scale-95"
                          onClick={() => onRaiseBid(auc.id, 2000)}
                          type="button"
                        >
                          + ₹2,000
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant font-title-sm text-title-sm">
                            ₹
                          </span>
                          <input
                            className="w-full bg-surface-container-low rounded-xl pl-7 pr-3 py-2.5 font-title-sm text-title-sm text-on-surface outline-none"
                            placeholder={String(auc.highestBid + 500)}
                            type="number"
                            value={customVal}
                            onChange={(e) => handleCustomBidChange(auc.id, e.target.value)}
                          />
                        </div>
                        <button
                          className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 shrink-0"
                          onClick={() => handlePlaceCustomBid(auc)}
                          type="button"
                        >
                          <span className="material-symbols-outlined text-[18px]">gavel</span>
                          <span>Place Bid</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

            {/* Trust & Transparency */}
            <section className="px-margin-mobile mt-4">
              <div className="rounded-2xl bg-surface-container-low p-4 flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[24px]">
                    shield_person
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">
                    Why Phoneo Live Auctions Win
                  </h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Instead of getting undervalued by standard scrap platforms or dealing with unknown
                  OLX callers, your device receives transparent real-time bids from established
                  mobile retailers near you.
                </p>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div className="p-3 rounded-xl bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-primary text-[20px]">store</span>
                    <h4 className="font-title-sm text-title-sm text-on-surface mt-1">
                      Verified Shops Only
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Every bidder is GST-registered with physical retail footprint.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-surface-container-lowest">
                    <span className="material-symbols-outlined text-primary text-[20px]">
                      payments
                    </span>
                    <h4 className="font-title-sm text-title-sm text-on-surface mt-1">
                      Direct Instant UPI
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Zero payout delay. Amount is credited immediately on handover.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    );
  }

  // ==================== DESKTOP VIEW (Matches Stitch Screen 29017274079741dabdc32f7754b79724) ====================
  return (
    <div className="flex flex-col w-full">
      {/* Top Real-time Ticker / Market Bar */}
      <div className="w-full bg-surface-container py-2.5 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 overflow-hidden text-body-sm">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span> Live Floor
            </span>
            <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap text-on-surface-variant">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  check_circle
                </span>
                Sold 4m ago: <strong className="text-on-surface font-title-sm">iPhone 13 128GB</strong>{' '}
                to <span className="text-primary font-title-sm">Shree Sai Mobiles (Raipur)</span>{' '}
                for <span className="text-primary font-bold">₹34,100</span>
              </span>
              <span className="text-outline-variant">•</span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">
                  check_circle
                </span>
                Sold 11m ago:{' '}
                <strong className="text-on-surface font-title-sm">S23 Ultra 256GB</strong> to{' '}
                <span className="text-primary font-title-sm">National Telecom (Bhilai)</span> for{' '}
                <span className="text-primary font-bold">₹58,400</span>
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-body-sm font-label-md shrink-0">
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-primary">storefront</span>
              <span className="text-on-surface font-bold">48 Retailers</span> Online in {activeCity} Hub
            </div>
            <div className="h-3 w-px bg-outline-variant"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-[16px] text-tertiary">lock</span>
              Escrow Locked: <span className="text-on-surface font-bold">₹8.4 Lakh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Switcher & Segment Control */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 pt-8 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container font-label-md text-label-md mb-2">
              <span className="material-symbols-outlined text-[16px] text-primary">gavel</span>
              Hyper-Local Re-Commerce Auction Engine
            </div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
              Sell in 30 Mins or Join the <span className="text-primary">Live Shopkeeper War</span>
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              Forget rigid scrap algorithms or unsafe buyer meetups. Certified retail stores bid
              openly for your smartphone right now.
            </p>
          </div>
          {/* Mode Switcher Pill */}
          <div className="inline-flex p-1.5 rounded-full bg-surface-container-high self-start md:self-center shadow-sm">
            <button
              className={`px-5 py-2 rounded-full font-title-sm text-title-sm transition-all duration-200 flex items-center gap-2 ${
                rolePerspective === 'seller'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => onSwitchPerspective('seller')}
            >
              <span className="material-symbols-outlined text-[18px]">phone_iphone</span>
              I am a Phone Seller
            </button>
            <button
              className={`px-5 py-2 rounded-full font-title-sm text-title-sm transition-all duration-200 flex items-center gap-2 ${
                rolePerspective === 'retailer'
                  ? 'bg-surface-container-lowest text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              onClick={() => onSwitchPerspective('retailer')}
            >
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              Retailer Auction Floor
              <span className="px-2 py-0.5 rounded-full bg-primary text-on-primary font-label-sm text-label-sm">
                {auctions.length} Live
              </span>
            </button>
            <a
              href="https://seller.phoneo.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full font-title-sm text-title-sm text-primary hover:bg-surface-container-lowest transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[17px]">storefront</span>
              <span>Become a Seller</span>
              <span className="material-symbols-outlined text-[13px] opacity-70">open_in_new</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Asymmetric Workspace */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Instant Valuation Console & Comparison */}
          <div className="lg:col-span-6 flex flex-col gap-6" id="seller-panel">
            {/* Interactive Step-by-Step Device Valuation Form */}
            <div className="p-6 md:p-8 rounded-xl bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(15,23,42,0.05)] flex flex-col gap-6">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-sm text-label-sm tracking-widest text-primary uppercase font-bold">
                    2-Minute Valuation Engine
                  </span>
                  <h2 className="font-headline-lg text-headline-lg text-on-surface mt-1">
                    Configure Device for Live Bidding
                  </h2>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    42 stores in {activeCity}-Bhilai cluster are waiting for fresh device drops.
                  </p>
                </div>
                <span className="p-3 rounded-full bg-surface-container text-primary">
                  <span className="material-symbols-outlined text-[24px]">instant_mix</span>
                </span>
              </div>
              {/* Step Progress Visualizer */}
              <div className="grid grid-cols-4 gap-2">
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-primary"></div>
                <div className="h-1.5 rounded-full bg-surface-container-high"></div>
              </div>
              <form
                className="flex flex-col gap-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  onOpenStartAuctionModal(calcModel);
                }}
              >
                {/* Brand & Model Quick Pick */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-2 font-bold">
                    1. Select Smartphone Brand &amp; Model
                  </label>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      { name: 'Apple', icon: 'phone_iphone' },
                      { name: 'Samsung', icon: 'smartphone' },
                      { name: 'OnePlus', icon: 'devices' },
                      { name: 'Xiaomi', icon: 'mobile_friendly' },
                    ].map((b) => {
                      const isSel = calcBrand === b.name.toLowerCase();
                      return (
                        <button
                          key={b.name}
                          type="button"
                          onClick={() => {
                            setCalcBrand(b.name.toLowerCase());
                            if (b.name === 'Apple') setCalcModel('ip13');
                            else if (b.name === 'Samsung') setCalcModel('s23');
                            else if (b.name === 'OnePlus') setCalcModel('op11');
                          }}
                          className={`p-2 rounded-lg font-label-lg flex flex-col items-center gap-1 transition-all ${
                            isSel
                              ? 'bg-surface-container-high text-primary ring-1 ring-primary shadow-sm font-bold'
                              : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                          }`}
                        >
                          <span className="material-symbols-outlined text-[20px]">{b.icon}</span>
                          {b.name}
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 rounded-lg bg-surface-container text-on-surface font-body-md focus:outline-none appearance-none cursor-pointer"
                      value={calcModel}
                      onChange={(e) => setCalcModel(e.target.value)}
                    >
                      <option value="ip13">Apple iPhone 13 (128 GB)</option>
                      <option value="ip14">Apple iPhone 14 (128 GB)</option>
                      <option value="ip15pro">Apple iPhone 15 Pro (128 GB)</option>
                      <option value="s23">Samsung Galaxy S23 Ultra (256 GB)</option>
                      <option value="op11">OnePlus 11 5G (256 GB)</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 pointer-events-none text-on-surface-variant">
                      unfold_more
                    </span>
                  </div>
                </div>

                {/* Condition Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Screen Condition */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-bold">
                      2. Screen Condition
                    </label>
                    <div className="space-y-1.5">
                      <label
                        onClick={() => setCalcCondition('flawless')}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          calcCondition === 'flawless'
                            ? 'bg-surface-container-high ring-1 ring-primary'
                            : 'bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <input
                          checked={calcCondition === 'flawless'}
                          onChange={() => setCalcCondition('flawless')}
                          type="radio"
                          name="screen_grade"
                          className="text-primary focus:ring-0"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface">
                          Flawless (No scratches)
                        </span>
                      </label>
                      <label
                        onClick={() => setCalcCondition('good')}
                        className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                          calcCondition === 'good'
                            ? 'bg-surface-container-high ring-1 ring-primary'
                            : 'bg-surface-container hover:bg-surface-container-high'
                        }`}
                      >
                        <input
                          checked={calcCondition === 'good'}
                          onChange={() => setCalcCondition('good')}
                          type="radio"
                          name="screen_grade"
                          className="text-primary focus:ring-0"
                        />
                        <span className="font-body-sm text-body-sm text-on-surface">
                          Minor Hairlines only
                        </span>
                      </label>
                    </div>
                  </div>
                  {/* Battery Health */}
                  <div>
                    <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-bold">
                      3. Battery Health Status
                    </label>
                    <div className="flex items-center gap-2 mb-2">
                      <input
                        className="w-full accent-primary"
                        max="100"
                        min="70"
                        type="range"
                        value={batteryValue}
                        onChange={(e) => setBatteryValue(parseInt(e.target.value, 10))}
                      />
                      <span className="font-title-sm text-title-sm text-primary font-bold shrink-0">
                        {batteryValue}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between font-label-sm text-label-sm text-on-surface-variant">
                      <span>Normal (80%+)</span>
                      <span>Peak &amp; Original</span>
                    </div>
                  </div>
                </div>

                {/* Accessories & Bill Verification */}
                <div>
                  <label className="block font-label-md text-label-md text-on-surface mb-1.5 font-bold">
                    4. Original Accessories Accompanying Device
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer text-body-sm text-on-surface">
                      <input defaultChecked className="rounded text-primary focus:ring-0" type="checkbox" />
                      <span>Retail Box</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer text-body-sm text-on-surface">
                      <input defaultChecked className="rounded text-primary focus:ring-0" type="checkbox" />
                      <span>Original Bill</span>
                    </label>
                    <label className="flex items-center gap-2 p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high cursor-pointer text-body-sm text-on-surface">
                      <input defaultChecked className="rounded text-primary focus:ring-0" type="checkbox" />
                      <span>OEM Cable</span>
                    </label>
                  </div>
                </div>

                {/* Instant Valuation Display */}
                <div className="p-5 rounded-xl bg-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4">
                  <div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                      Predicted Live Auction Reserve
                    </div>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="font-headline-xl text-headline-xl text-primary font-extrabold">
                        {estimatedQuote}
                      </span>
                      <span className="font-label-sm text-label-sm text-primary-fixed-dim bg-on-primary-fixed px-2 py-0.5 rounded-full">
                        Guaranteed High
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                      Based on 14 recent purchases in {activeCity} Central &amp; Pandri market.
                    </p>
                  </div>
                  <button
                    className="w-full md:w-auto px-6 py-3 rounded-full bg-primary text-on-primary font-title-md text-title-md hover:bg-primary-container hover:text-on-primary-container transition-all shadow-[0_4px_14px_rgba(0,106,97,0.3)] shrink-0 flex items-center justify-center gap-2"
                    type="submit"
                  >
                    <span className="material-symbols-outlined text-[20px]">podium</span>
                    Launch 30-Min Auction
                  </button>
                </div>
              </form>
            </div>

            {/* Price Reality Check */}
            <div className="p-6 rounded-xl bg-surface-container-low shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
              <h3 className="font-title-md text-title-md text-on-surface mb-3 flex items-center gap-2 font-bold">
                <span className="material-symbols-outlined text-primary text-[20px]">insights</span>
                The Payout Difference on iPhone 13 128GB
              </h3>
              <div className="space-y-3 font-body-sm text-body-sm">
                <div className="p-3.5 rounded-lg bg-surface-container-lowest flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary font-bold text-label-sm">
                      P
                    </span>
                    <div>
                      <div className="font-title-sm text-title-sm text-on-surface font-bold">
                        Phoneo Live Local Auction
                      </div>
                      <div className="text-on-surface-variant text-[12px]">
                        Local retailers bid live for counter stock
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-headline-sm text-headline-sm text-primary font-extrabold">
                      ₹34,500
                    </div>
                    <span className="font-label-sm text-label-sm text-primary">
                      Direct UPI + Handover
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-label-sm">
                      C
                    </span>
                    <div>
                      <div className="font-title-sm text-title-sm text-on-surface">
                        Algorithmic Scrap Platforms
                      </div>
                      <div className="text-[12px]">Heavy automated cuts for scratches</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-title-md text-title-md text-on-surface">₹27,800</div>
                    <span className="font-label-sm text-label-sm text-error">- ₹6,700 Loss</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-surface-container flex items-center justify-between text-on-surface-variant">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-surface-dim text-on-surface flex items-center justify-center font-bold text-label-sm">
                      O
                    </span>
                    <div>
                      <div className="font-title-sm text-title-sm text-on-surface">
                        Classifieds / OLX P2P Meetups
                      </div>
                      <div className="text-[12px]">Strangers haggling at cafes, scam risks</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-title-md text-title-md text-on-surface">Uncertain</div>
                    <span className="font-label-sm text-label-sm text-tertiary">Takes 7-14 Days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Step Simple Seller Timeline */}
            <div className="p-6 rounded-xl bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(15,23,42,0.05)]">
              <h3 className="font-title-md text-title-md text-on-surface mb-4 font-bold">
                How Phoneo Live Bidding Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    1
                  </div>
                  <h4 className="font-title-sm text-title-sm text-on-surface">
                    Enter Spec &amp; Photos
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Fill the 2-minute diagnostic checklist. No physical shipping needed upfront.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    2
                  </div>
                  <h4 className="font-title-sm text-title-sm text-on-surface">
                    30-Min Live Auction
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Stores in {activeCity}, Bhilai &amp; Durg place live escalating bids to outbid
                    each other.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-headline-sm font-bold">
                    3
                  </div>
                  <h4 className="font-title-sm text-title-sm text-on-surface">
                    Cash / UPI Instant Handover
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Accept the winning offer. Pick doorstep pickup or walk into the winning store.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Shopkeeper Bidding Room / Deck */}
          <div className="lg:col-span-6 flex flex-col gap-6" id="retailer-panel">
            {/* Merchant Live Deck HUD Header */}
            <div className="p-5 rounded-xl bg-inverse-surface text-inverse-on-surface shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="relative">
                  <span className="w-3.5 h-3.5 rounded-full bg-primary-container animate-ping absolute"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-primary-container relative block"></span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-title-md text-title-md text-inverse-on-surface font-bold">
                      {activeCity} &amp; Durg Live Trading Room
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-label-sm">
                      Active Floor
                    </span>
                  </div>
                  <p className="font-body-sm text-body-sm text-surface-container-highest opacity-80">
                    19 Verified retailers in this room • Instant escrow lock enabled
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-3 py-1.5 rounded-lg bg-surface-container-lowest/10 text-left">
                  <div className="font-label-sm text-label-sm text-surface-container-highest uppercase">
                    Shopkeeper Escrow
                  </div>
                  <div className="font-title-sm text-title-sm text-primary-container font-extrabold">
                    {formatRupee(walletBalance)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRefillWallet}
                  className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary font-label-md text-label-md transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add_card</span> Refill
                </button>
              </div>
            </div>

            {/* Auction Cards */}
            {auctions.map((auc) => {
              const customVal = customBidValues[auc.id] || '';
              const isSaved = wishlist.includes(auc.id);
              return (
                <div
                  key={auc.id}
                  className="rounded-2xl bg-white/95 backdrop-blur-xl border border-teal-200/80 shadow-[0_10px_28px_-4px_rgba(13,148,136,0.12),0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_18px_38px_-4px_rgba(13,148,136,0.22)] hover:border-teal-400 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                >
                  {/* Card Header & Timer Banner */}
                  <div className="bg-teal-50/80 border-b border-teal-100/70 px-5 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-error text-on-error font-label-sm text-label-sm font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-on-error animate-ping"></span>{' '}
                        {auc.statusTag}
                      </span>
                      <span className="font-label-md text-label-md text-on-surface-variant">
                        Listing {auc.listingCode}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-error font-title-sm text-title-sm font-bold">
                      <span className="material-symbols-outlined text-[18px]">timer</span>
                      <span>{formatTimeLeft(auc.secondsLeft)}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-5">
                      <div className="w-full sm:w-32 h-32 rounded-lg bg-surface-container-low shrink-0 relative overflow-hidden flex items-center justify-center">
                        <img
                          alt={auc.model}
                          className="w-full h-full object-cover"
                          src={auc.image}
                        />
                        <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded bg-surface-container-lowest/90 font-label-sm text-label-sm text-primary font-bold">
                          {auc.conditionBadge}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-title-md text-title-md text-on-surface font-extrabold">
                              {auc.model}
                            </h3>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {auc.specs}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onToggleWishlist(auc.id)}
                            className={`transition-colors ${
                              isSaved ? 'text-error' : 'text-on-surface-variant hover:text-primary'
                            }`}
                          >
                            <span
                              className={`material-symbols-outlined text-[20px] ${
                                isSaved ? 'filled' : ''
                              }`}
                            >
                              bookmark
                            </span>
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {auc.accessories.map((acc) => (
                            <span
                              key={acc}
                              className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5"
                            >
                              <span className="material-symbols-outlined text-[12px] text-primary">
                                verified
                              </span>{' '}
                              {acc}
                            </span>
                          ))}
                          <span className="px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px] text-primary">
                              pin_drop
                            </span>{' '}
                            {auc.location} ({auc.distance})
                          </span>
                        </div>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-2">
                          Seller:{' '}
                          <span className="text-on-surface font-semibold">{auc.sellerName}</span> (
                          {auc.sellerRole})
                        </div>
                      </div>
                    </div>

                    {/* Current Bid Status and Action */}
                    <div className="mt-5 pt-4 bg-surface-container-low p-4 rounded-xl">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                        <div>
                          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase font-bold">
                            Current Leading Bid
                          </span>
                          <div className="flex items-baseline gap-2">
                            <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">
                              {formatRupee(auc.highestBid)}
                            </span>
                            <span className="font-body-sm text-body-sm text-primary font-bold">
                              by {auc.leadingStore}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-label-sm text-label-sm text-on-surface-variant">
                            Total Bids Placed
                          </span>
                          <div className="font-title-sm text-title-sm text-on-surface">
                            {auc.totalBids} competitive bids
                          </div>
                        </div>
                      </div>

                      {/* Quick Bid Buttons & Custom Input */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onRaiseBid(auc.id, 500)}
                            className="flex-1 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-all shadow-sm"
                          >
                            + ₹500
                          </button>
                          <button
                            type="button"
                            onClick={() => onRaiseBid(auc.id, 1000)}
                            className="flex-1 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-all shadow-sm"
                          >
                            + ₹1,000
                          </button>
                          <button
                            type="button"
                            onClick={() => onRaiseBid(auc.id, 2000)}
                            className="flex-1 py-1.5 rounded-lg bg-surface-container-lowest hover:bg-primary hover:text-on-primary text-on-surface font-label-md text-label-md transition-all shadow-sm"
                          >
                            + ₹2,000
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-2.5 font-title-sm text-title-sm text-on-surface-variant">
                              ₹
                            </span>
                            <input
                              className="w-full pl-7 pr-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface font-title-sm text-title-sm focus:outline-none shadow-sm"
                              placeholder={String(auc.highestBid + 500)}
                              type="number"
                              value={customVal}
                              onChange={(e) => handleCustomBidChange(auc.id, e.target.value)}
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handlePlaceCustomBid(auc)}
                            className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary font-title-sm text-title-sm font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0"
                          >
                            <span className="material-symbols-outlined text-[18px]">gavel</span>{' '}
                            Place Bid
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Real-time Bid Log Snippet */}
                    <div className="mt-3 flex items-center justify-between text-[12px] text-on-surface-variant">
                      <span>
                        Last bid: {auc.leadingStore} {formatRupee(auc.highestBid)} (
                        {auc.recentBids[0]?.timeAgo || 'just now'})
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          showToast(
                            `Bid Log for ${auc.model}`,
                            auc.recentBids.map((b) => `${b.store}: ₹${b.amount}`).join(' • ')
                          )
                        }
                        className="text-primary hover:underline font-label-sm"
                      >
                        View full log ({auc.totalBids})
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Trust, Protection & Retailer Safeguards Section */}
      <div className="max-w-7xl mx-auto w-full px-6 lg:px-12 py-12">
        <div className="rounded-xl bg-primary text-on-primary p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary-container/20 blur-3xl pointer-events-none"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-on-primary/10 text-on-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px] text-primary-fixed">
                  verified
                </span>
                Zero Haggling • 100% Escrow Protection
              </div>
              <h2 className="font-headline-xl text-headline-xl text-on-primary font-extrabold tracking-tight">
                Why Both Sellers and Local Retailers Win on Phoneo
              </h2>
              <p className="font-body-lg text-body-lg text-on-primary/90 max-w-2xl">
                Sellers get 15-25% more than online automated scrap services because physical shops
                need ready inventory for counter resale. Retailers bypass broker markups and procure
                clean, GST-verified customer devices in real-time.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg bg-on-primary/10 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary-fixed text-[24px] mb-1">
                    payments
                  </span>
                  <h4 className="font-title-sm text-title-sm text-on-primary font-bold">
                    Instant UPI Handover
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
                    Money hits your account immediately upon physical handover.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-on-primary/10 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary-fixed text-[24px] mb-1">
                    verified_user
                  </span>
                  <h4 className="font-title-sm text-title-sm text-on-primary font-bold">
                    Anti-Theft Check
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
                    Automated national police blacklist &amp; IMEI clearing before auction goes live.
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-on-primary/10 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-primary-fixed text-[24px] mb-1">
                    balance
                  </span>
                  <h4 className="font-title-sm text-title-sm text-on-primary font-bold">
                    Binding Bids Only
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-primary/80 mt-0.5">
                    Stores lock bids via deposited security escrow. No lowball backouts.
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-4 flex flex-col gap-4 text-center p-6 rounded-xl bg-surface-container-lowest text-on-surface shadow-lg">
              <span className="material-symbols-outlined text-primary text-[40px] mx-auto">store</span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">
                Are You a Mobile Shopkeeper?
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Register your shop with GSTIN &amp; trade license to access live customer auctions
                across {activeCity}, Durg, Bhilai &amp; Bilaspur.
              </p>
              <button
                type="button"
                onClick={() =>
                  showToast(
                    'Partner Registration Form',
                    'KYC onboarding link dispatched to partner desk.'
                  )
                }
                className="w-full py-3 rounded-full bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-title-sm text-title-sm transition-all shadow-md"
              >
                Register As Verified Retailer
              </button>
              <span className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-primary">verified</span>{' '}
                Free onboarding this month
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
