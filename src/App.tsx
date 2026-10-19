import React, { useState, useEffect } from 'react';
import {
  AuctionItem,
  CityName,
  formatRupee,
  INITIAL_AUCTIONS,
  PARTNER_STORES,
  PHONEO_LOGO_URL,
  PRODUCTS,
  ProductItem,
  USER_AVATAR_URL,
} from './data';
import { HomeMarketplaceView } from './components/HomeMarketplaceView';
import { SellAuctionsView } from './components/SellAuctionsView';
import { StoreProfileView } from './components/StoreProfileView';
import {
  AccountDashboardView,
  DeviceInspectionModal,
  LocationSheetModal,
  ReservationModal,
  StartAuctionModal,
} from './components/ModalsAndAccount';
import { PhoneDetailCatalogView } from './components/PhoneDetailCatalogView';
import { SidePanelDrawer } from './components/SidePanelDrawer';
import { AuthModal } from './components/AuthModal';
import { SplashLoader } from './components/SplashLoader';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  // Active Navigation
  const [activeTab, setActiveTab] = useState<
    'home' | 'auctions' | 'stores' | 'account' | 'catalog' | 'device-detail'
  >('home');
  const [selectedPhoneDetail, setSelectedPhoneDetail] = useState<ProductItem | null>(null);
  const [rolePerspective, setRolePerspective] = useState<'seller' | 'retailer'>('seller');
  const [activeCity, setActiveCity] = useState<CityName>('Raipur');
  const [selectedStoreId, setSelectedStoreId] = useState<string>('store-balaji');

  // Interactive Live Data State
  const [auctions, setAuctions] = useState<AuctionItem[]>(INITIAL_AUCTIONS);
  const [heroSecondsLeft, setHeroSecondsLeft] = useState(222);
  const [products] = useState<ProductItem[]>(PRODUCTS);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'auc-1']);
  const [reservations, setReservations] = useState<
    { product: ProductItem; phone: string; time: string }[]
  >([]);

  // Modals state
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isStartAuctionModalOpen, setIsStartAuctionModalOpen] = useState(false);
  const [startAuctionPrefill, setStartAuctionPrefill] = useState<string>('');
  const [inspectProduct, setInspectProduct] = useState<ProductItem | null>(null);
  const [reserveProduct, setReserveProduct] = useState<ProductItem | null>(null);

  // Authentication & Login Modal state
  const [currentUser, setCurrentUser] = useState<{ name: string; phoneOrEmail?: string } | null>(() => {
    try {
      const saved = localStorage.getItem('phoneo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Auto-prompt login window after 10 seconds if user is not already logged in
  useEffect(() => {
    if (currentUser) return;
    const timer = setTimeout(() => {
      setIsLoginModalOpen(true);
    }, 10000);
    return () => clearTimeout(timer);
  }, [currentUser]);

  const handleLogin = (user: { name: string; phoneOrEmail?: string }) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('phoneo_user', JSON.stringify(user));
    } catch {}
    showToast(`Welcome, ${user.name}!`, 'You are now signed in to Phoneo.');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('phoneo_user');
    } catch {}
    showToast('Signed Out', 'You have been successfully logged out.');
  };

  // Toast Notification state
  const [toast, setToast] = useState<{ title: string; desc: string; show: boolean }>({
    title: '',
    desc: '',
    show: false,
  });

  // Track window resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobileLayout = windowWidth < 768;

  // Real-time ticking countdown timers
  useEffect(() => {
    const interval = setInterval(() => {
      setAuctions((prev) =>
        prev.map((auc) => ({
          ...auc,
          secondsLeft: auc.secondsLeft > 0 ? auc.secondsLeft - 1 : 1800, // loop or reset
        }))
      );
      setHeroSecondsLeft((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (title: string, desc: string) => {
    setToast({ title, desc, show: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  const handleToggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((i) => i !== id) : [...prev, id];
      showToast(
        exists ? 'Removed from Wishlist' : 'Saved to Wishlist',
        'Updated in your account items'
      );
      return next;
    });
  };

  const handleRaiseBid = (auctionId: string, amount: number) => {
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          const newBid = auc.highestBid + amount;
          return {
            ...auc,
            highestBid: newBid,
            totalBids: auc.totalBids + 1,
            leadingStore: 'Your Shop (Leading)',
            leadingStoreArea: `${activeCity} Hub`,
            recentBids: [
              {
                store: 'Your Shop (Leading)',
                area: activeCity,
                amount: newBid,
                timeAgo: 'Just now',
              },
              ...auc.recentBids,
            ],
          };
        }
        return auc;
      })
    );
    showToast('Quick Bid Placed!', `Your bid was placed successfully.`);
  };

  const handleSubmitCustomBid = (auctionId: string, amount: number) => {
    setAuctions((prev) =>
      prev.map((auc) => {
        if (auc.id === auctionId) {
          return {
            ...auc,
            highestBid: amount,
            totalBids: auc.totalBids + 1,
            leadingStore: 'Your Shop (Leading)',
            leadingStoreArea: `${activeCity} Hub`,
            recentBids: [
              {
                store: 'Your Shop (Leading)',
                area: activeCity,
                amount,
                timeAgo: 'Just now',
              },
              ...auc.recentBids,
            ],
          };
        }
        return auc;
      })
    );
    showToast('Bid Submitted!', `Leading bid set to ${formatRupee(amount)}.`);
  };

  const handleLaunchAuction = (newAucData: {
    model: string;
    condition: string;
    accessories: string[];
    startingBid: number;
  }) => {
    const newAuction: AuctionItem = {
      id: `auc-${Date.now()}`,
      listingCode: `#PH-${Math.floor(1000 + Math.random() * 9000)}`,
      model: newAucData.model,
      brand: newAucData.model.includes('iPhone')
        ? 'Apple'
        : newAucData.model.includes('Galaxy')
        ? 'Samsung'
        : 'OnePlus',
      specs: `${newAucData.condition} • Battery 90% • Verified IMEI`,
      conditionBadge: newAucData.condition.includes('Flawless') ? 'Grade A+' : 'Grade A',
      batteryHealth: 'Battery 90%',
      accessories: newAucData.accessories,
      sellerName: 'Phoneo Verified Member',
      sellerRole: 'Verified Individual Seller',
      location: `Civil Lines, ${activeCity}`,
      city: activeCity,
      distance: '1.5 km',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBT6for8leFC0HzoCMA1Zb5Ke2UvNxBfBEiPNERZROMYB2bNZi7NrTMpCzAXmtIBBkx88nmepmCfvy2leZ4E6h98oI7iyP9PkDMGU5eczDl5z7yv3Dm0JIRWg8rJn0iwpgmnxpahkwjq0qCrwRx5T_7CI14uqsok4SiAmvwujpz4YntKiVkSB0rONICHh16L-SWOT63DWlWXmwqP2LoQsEOPxfznIJikX7JsT3J67X48wsNofKVFRaO',
      highestBid: newAucData.startingBid,
      leadingStore: 'Shree Balaji Mobile Hub',
      leadingStoreArea: `${activeCity} Hub`,
      totalBids: 1,
      secondsLeft: 1800, // 30 minutes
      statusTag: 'ACTIVE',
      recentBids: [
        {
          store: 'Shree Balaji Mobile Hub',
          area: activeCity,
          amount: newAucData.startingBid,
          timeAgo: 'Just now',
        },
      ],
    };

    setAuctions((prev) => [newAuction, ...prev]);
    setActiveTab('auctions');
    setRolePerspective('retailer');
    showToast('Auction Broadcast Live!', `Beamed to 42 stores in ${activeCity}. Ending in 30 mins.`);
  };

  const handleConfirmReservation = (prod: ProductItem, phone: string) => {
    setReservations((prev) => [
      { product: prod, phone, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
      ...prev,
    ]);
    showToast(
      'Device Reserved!',
      `Held at ${prod.storeName} for 3 hours. Confirmation sent to ${phone}`
    );
  };

  const handleNavigate = (
    tab: 'home' | 'auctions' | 'stores' | 'account' | 'catalog' | 'device-detail',
    subMode?: 'seller' | 'retailer'
  ) => {
    setActiveTab(tab);
    if (subMode) setRolePerspective(subMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col w-full">
      {/* Initial Loading Screen with Animated Phoneo Logo (Auto-skips after 1.25s) */}
      {showSplash && <SplashLoader durationMs={1250} onFinished={() => setShowSplash(false)} />}

      {/* Main Responsive Wrapper */}
      <div className="w-full flex flex-col flex-1">
        {/* ========================================================== */}
        {/* HEADER: MOBILE vs DESKTOP                                  */}
        {/* ========================================================== */}
        {isMobileLayout ? (
          /* Mobile Fixed Header */
          <header className="sticky top-0 inset-x-0 z-40 bg-white/90 backdrop-blur-xl border-b border-teal-100/70 shadow-[0_2px_16px_rgba(13,148,136,0.06)] pt-safe">
            <div className="h-16 px-margin-mobile flex items-center justify-between gap-gutter-mobile">
              <div className="flex items-center gap-space-sm min-w-0">
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(true)}
                  aria-label="Open Navigation Menu"
                  className="p-1.5 -ml-1 rounded-xl text-on-surface hover:bg-teal-50/80 transition-colors"
                >
                  <span className="material-symbols-outlined text-[24px]">menu</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="flex items-center"
                >
                  <img
                    alt="Phoneo Logo"
                    className="h-8 w-auto object-contain flex-shrink-0"
                    src={PHONEO_LOGO_URL}
                  />
                </button>
                <button
                  aria-label="Select Location"
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-1 bg-teal-50/80 hover:bg-teal-100/80 border border-teal-200/60 px-2.5 py-1 rounded-full text-on-surface transition-colors min-h-[34px]"
                  type="button"
                >
                  <span className="material-symbols-outlined text-primary text-[17px]">
                    location_on
                  </span>
                  <span className="font-label-md text-label-md font-bold truncate max-w-[85px] text-slate-800">
                    {activeCity}
                  </span>
                  <span className="material-symbols-outlined text-slate-400 text-[15px]">
                    keyboard_arrow_down
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-space-xs flex-shrink-0">
                <a
                  href="https://seller.phoneo.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-full border border-teal-200 bg-teal-50/90 text-teal-700 font-bold text-[11px] flex items-center gap-1 shrink-0 hover:bg-teal-100 hover:border-teal-300 transition-all shadow-xs"
                  title="Phoneo Seller CRM (seller.phoneo.in)"
                >
                  <span className="material-symbols-outlined text-[13px]">storefront</span>
                  <span>Seller</span>
                  <span className="material-symbols-outlined text-[10px] opacity-70">open_in_new</span>
                </a>
                <button
                  aria-label="Search"
                  onClick={() => handleNavigate('catalog')}
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-primary hover:bg-teal-50/80 transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">search</span>
                </button>
                <button
                  aria-label="Notifications"
                  onClick={() =>
                    showToast('Notifications', 'No unread alerts in your active hub.')
                  }
                  className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:text-primary hover:bg-teal-50/80 transition-all relative"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[20px]">notifications</span>
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                </button>
                {!currentUser ? (
                  <button
                    aria-label="Register or Login"
                    onClick={() => setIsLoginModalOpen(true)}
                    className="px-3 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 hover:brightness-105 text-white font-bold text-[11px] flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-[0_4px_12px_rgba(13,148,136,0.25)]"
                    type="button"
                  >
                    <span className="material-symbols-outlined text-[15px]">account_circle</span>
                    <span>Login</span>
                  </button>
                ) : (
                  <button
                    aria-label="User Profile"
                    onClick={() => handleNavigate('account')}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-xs flex items-center justify-center uppercase shadow-[0_3px_10px_rgba(13,148,136,0.25)] ring-2 ring-white"
                    type="button"
                  >
                    {currentUser.name.charAt(0)}
                  </button>
                )}
              </div>
            </div>
          </header>
        ) : (
          /* Desktop Sticky Header with Frosted Glassmorphism & Box Shadow */
          <header className="sticky top-0 w-full z-40 bg-white/90 backdrop-blur-2xl border-b border-teal-100/80 shadow-[0_4px_24px_rgba(13,148,136,0.06)]">
            <div className="w-full max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex items-center justify-between gap-4 lg:gap-8 py-3">
              {/* Left Branding & Hub */}
              <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(true)}
                  className="p-2 rounded-xl bg-white hover:bg-teal-50/80 backdrop-blur-md border border-teal-100 shadow-[0_2px_8px_rgba(13,148,136,0.06)] text-on-surface flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Open Side Navigation Menu"
                  title="Menu & Hubs"
                >
                  <span className="material-symbols-outlined text-[24px]">menu</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleNavigate('home')}
                  className="flex items-center group shrink-0"
                >
                  <img
                    alt="Phoneo Logo"
                    className="h-9 w-auto object-contain transition-transform group-hover:scale-105 drop-shadow-xs"
                    src={PHONEO_LOGO_URL}
                  />
                </button>
                <button
                  onClick={() => setIsLocationModalOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50/80 hover:bg-teal-100/80 backdrop-blur-md border border-teal-200/80 shadow-[0_2px_8px_rgba(13,148,136,0.06)] hover:shadow-[0_4px_12px_rgba(13,148,136,0.12)] transition-all text-left shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] text-teal-600">
                    location_on
                  </span>
                  <div className="flex flex-col leading-none">
                    <span className="font-label-sm text-label-sm text-slate-500 uppercase tracking-wider text-[10px]">
                      City Hub
                    </span>
                    <span className="font-title-sm text-title-sm text-slate-900 flex items-center gap-0.5 text-xs font-bold">
                      {activeCity}, CG{' '}
                      <span className="material-symbols-outlined text-[14px]">expand_more</span>
                    </span>
                  </div>
                </button>
              </div>

              {/* Responsive Center Search Bar */}
              <div className="flex-1 max-w-xl xl:max-w-2xl min-w-[200px] hidden md:block">
                <div className="relative flex items-center">
                  <span className="material-symbols-outlined absolute left-3.5 text-slate-400 text-[20px] pointer-events-none">
                    search
                  </span>
                  <input
                    className="w-full pl-10 pr-12 lg:pr-24 py-2 rounded-full bg-white/90 backdrop-blur-md text-on-surface placeholder:text-slate-400 font-body-md text-body-md focus:outline-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02),0_2px_8px_rgba(13,148,136,0.05)] focus:ring-2 focus:ring-teal-400/50 focus:border-teal-500 border border-teal-200/80 transition-all"
                    placeholder="Search iPhone, Samsung, Vivo, OnePlus in your city..."
                    type="text"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleNavigate('catalog');
                    }}
                  />
                  <button
                    onClick={() => handleNavigate('catalog')}
                    className="absolute right-1 px-2.5 lg:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-label-md text-label-md hover:brightness-105 shadow-[0_3px_10px_rgba(13,148,136,0.25)] transition-all flex items-center justify-center gap-1 text-xs font-bold shrink-0"
                    aria-label="Search"
                    title="Search Phones"
                  >
                    <span className="material-symbols-outlined text-[16px]">search</span>
                    <span className="hidden lg:inline">Search</span>
                  </button>
                </div>
              </div>

              {/* Right Action Elements */}
              <div className="flex items-center gap-2.5 lg:gap-3 shrink-0">
                <a
                  href="https://seller.phoneo.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-teal-200 bg-teal-50/80 hover:bg-teal-100 text-teal-700 font-label-md text-xs font-bold transition-all shadow-xs shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">storefront</span>
                  <span>Become a Seller</span>
                  <span className="material-symbols-outlined text-[13px] opacity-70">open_in_new</span>
                </a>
                <button
                  onClick={() => {
                    setStartAuctionPrefill('');
                    setIsStartAuctionModalOpen(true);
                  }}
                  className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white text-xs font-bold hover:brightness-105 transition-all shadow-[0_4px_12px_rgba(13,148,136,0.25)] hover:shadow-[0_6px_16px_rgba(13,148,136,0.35)] hover:-translate-y-0.5 active:scale-95 shrink-0"
                >
                  <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
                  <span>Sell Old Phone</span>
                </button>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    aria-label="Notifications"
                    onClick={() =>
                      showToast('Notifications', `All partner stores in ${activeCity} verified.`)
                    }
                    className="w-9 h-9 rounded-full bg-white hover:bg-teal-50/80 backdrop-blur-md border border-teal-100 flex items-center justify-center text-slate-600 hover:text-teal-600 shadow-[0_2px_6px_rgba(13,148,136,0.06)] transition-all relative"
                  >
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"></span>
                  </button>
                  <button
                    aria-label="Saved Items"
                    onClick={() => handleNavigate('account')}
                    className="w-9 h-9 rounded-full bg-white hover:bg-teal-50/80 backdrop-blur-md border border-teal-100 flex items-center justify-center text-slate-600 hover:text-teal-600 shadow-[0_2px_6px_rgba(13,148,136,0.06)] transition-all relative"
                  >
                    <span className="material-symbols-outlined text-[20px]">favorite</span>
                    {wishlist.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                        {wishlist.length}
                      </span>
                    )}
                  </button>
                  {!currentUser ? (
                    <button
                      type="button"
                      onClick={() => setIsLoginModalOpen(true)}
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 hover:brightness-105 text-white font-bold text-xs shadow-[0_4px_14px_rgba(13,148,136,0.25)] hover:shadow-[0_8px_20px_rgba(13,148,136,0.35)] hover:-translate-y-0.5 transition-all active:scale-95 ml-1 shrink-0"
                    >
                      <span className="material-symbols-outlined text-[17px]">account_circle</span>
                      <span>Register / Login</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 ml-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleNavigate('account')}
                        className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-white hover:bg-teal-50/80 backdrop-blur-md text-slate-800 text-xs font-bold transition-all border border-teal-200/80 shadow-[0_2px_8px_rgba(13,148,136,0.08)] ring-1 ring-teal-500/20"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-teal-600 to-teal-500 text-white font-bold text-[11px] flex items-center justify-center uppercase shadow-xs">
                          {currentUser.name.charAt(0)}
                        </div>
                        <span className="max-w-[100px] truncate">{currentUser.name}</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleLogout}
                        title="Sign Out"
                        className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high text-outline hover:text-error flex items-center justify-center transition-colors"
                      >
                        <span className="material-symbols-outlined text-[17px]">logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* ========================================================== */}
        {/* MAIN BODY                                                  */}
        {/* ========================================================== */}
        <main className="flex-1 w-full bg-transparent relative">
          {activeTab === 'home' && (
            <HomeMarketplaceView
              isMobileMode={isMobileLayout}
              activeCity={activeCity}
              onSelectCity={(city) => {
                setActiveCity(city);
                showToast('Active Hub Changed', `Switched to ${city} smartphone marketplace.`);
              }}
              onOpenLocationSheet={() => setIsLocationModalOpen(true)}
              onNavigate={handleNavigate}
              onSelectStore={(storeId) => {
                setSelectedStoreId(storeId);
                setActiveTab('stores');
              }}
              onOpenStartAuctionModal={(prefill) => {
                setStartAuctionPrefill(prefill || '');
                setIsStartAuctionModalOpen(true);
              }}
              onOpenReserveModal={(prod) => setReserveProduct(prod)}
              onOpenInspectModal={(prod) => setInspectProduct(prod)}
              onOpenCatalog={() => {
                setSelectedPhoneDetail(null);
                handleNavigate('catalog');
              }}
              onOpenPhoneDetail={(prod) => {
                setSelectedPhoneDetail(prod);
                handleNavigate('device-detail');
              }}
              auctions={auctions}
              products={products}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
              heroSecondsLeft={heroSecondsLeft}
            />
          )}

          {(activeTab === 'catalog' || activeTab === 'device-detail') && (
            <PhoneDetailCatalogView
              activeCity={activeCity}
              selectedProduct={selectedPhoneDetail}
              initialMode={activeTab === 'device-detail' ? 'detail' : 'catalog'}
              onSelectProduct={(prod) => {
                setSelectedPhoneDetail(prod);
                if (prod) handleNavigate('device-detail');
                else handleNavigate('catalog');
              }}
              onOpenReserveModal={(prod) => setReserveProduct(prod)}
              onNavigateHome={() => handleNavigate('home')}
              onOpenStore={(storeId) => {
                setSelectedStoreId(storeId);
                handleNavigate('stores');
              }}
            />
          )}

          {activeTab === 'auctions' && (
            <SellAuctionsView
              isMobileMode={isMobileLayout}
              activeCity={activeCity}
              auctions={auctions}
              rolePerspective={rolePerspective}
              onSwitchPerspective={(role) => setRolePerspective(role)}
              onRaiseBid={handleRaiseBid}
              onSubmitCustomBid={handleSubmitCustomBid}
              onOpenStartAuctionModal={(prefill) => {
                setStartAuctionPrefill(prefill || '');
                setIsStartAuctionModalOpen(true);
              }}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              showToast={showToast}
            />
          )}

          {activeTab === 'stores' && (
            <StoreProfileView
              isMobileMode={isMobileLayout}
              activeCity={activeCity}
              selectedStoreId={selectedStoreId}
              onSelectStore={(id) => setSelectedStoreId(id)}
              products={products}
              wishlist={wishlist}
              onToggleWishlist={handleToggleWishlist}
              onOpenReserveModal={(prod) => setReserveProduct(prod)}
              onOpenInspectModal={(prod) => setInspectProduct(prod)}
              onOpenStartAuctionModal={(prefill) => {
                setStartAuctionPrefill(prefill || '');
                setIsStartAuctionModalOpen(true);
              }}
              showToast={showToast}
            />
          )}

          {activeTab === 'account' && (
            <AccountDashboardView
              activeCity={activeCity}
              reservations={reservations}
              wishlistIds={wishlist}
              products={products}
              auctions={auctions}
              onNavigate={handleNavigate}
              onOpenStartAuctionModal={() => setIsStartAuctionModalOpen(true)}
              onOpenReserveModal={(prod) => setReserveProduct(prod)}
              currentUser={currentUser}
              onOpenLoginModal={() => setIsLoginModalOpen(true)}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* ========================================================== */}
        {/* SCRAPED PHONEO.IN FOOTER                                   */}
        {/* ========================================================== */}
        <Footer
          onNavigate={handleNavigate}
          onSelectBrand={() => {
            handleNavigate('catalog');
          }}
          onOpenStartAuctionModal={(prefill) => {
            setStartAuctionPrefill(prefill || '');
            setIsStartAuctionModalOpen(true);
          }}
          showToast={showToast}
        />

        {/* ========================================================== */}
        {/* MOBILE STICKY BOTTOM NAVIGATION BAR                        */}
        {/* ========================================================== */}
        {isMobileLayout && (
          <nav className="fixed bottom-0 inset-x-0 z-40 pb-safe bg-white/95 backdrop-blur-xl shadow-[0_-4px_24px_rgba(13,148,136,0.08)] border-t border-teal-100/80">
            <div className="flex justify-around items-center h-16 px-gutter-mobile">
              <button
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all relative ${
                  activeTab === 'home' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => handleNavigate('home')}
                type="button"
              >
                {activeTab === 'home' && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(13,148,136,0.6)]"></span>
                )}
                <span className="material-symbols-outlined text-[24px]">explore</span>
                <span className="font-label-sm text-[11px]">Explore</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all relative ${
                  activeTab === 'catalog' || activeTab === 'device-detail' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => {
                  setSelectedPhoneDetail(null);
                  handleNavigate('catalog');
                }}
                type="button"
              >
                {(activeTab === 'catalog' || activeTab === 'device-detail') && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(13,148,136,0.6)]"></span>
                )}
                <span className="material-symbols-outlined text-[24px]">smartphone</span>
                <span className="font-label-sm text-[11px]">Phones</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all relative ${
                  activeTab === 'stores' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => handleNavigate('stores')}
                type="button"
              >
                {activeTab === 'stores' && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(13,148,136,0.6)]"></span>
                )}
                <span className="material-symbols-outlined text-[24px]">storefront</span>
                <span className="font-label-sm text-[11px]">Stores</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all relative ${
                  activeTab === 'auctions' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => handleNavigate('auctions', 'retailer')}
                type="button"
              >
                {activeTab === 'auctions' && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(13,148,136,0.6)]"></span>
                )}
                <span className="material-symbols-outlined text-[24px]">gavel</span>
                <span className="font-label-sm text-[11px]">Auctions</span>
              </button>
              <button
                className={`flex flex-col items-center justify-center gap-0.5 min-w-[48px] min-h-[48px] transition-all relative ${
                  activeTab === 'account' ? 'text-teal-600 font-bold scale-105' : 'text-slate-500 hover:text-slate-800'
                }`}
                onClick={() => handleNavigate('account')}
                type="button"
              >
                {activeTab === 'account' && (
                  <span className="absolute -top-1.5 w-6 h-1 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(13,148,136,0.6)]"></span>
                )}
                <span className="material-symbols-outlined text-[24px]">account_circle</span>
                <span className="font-label-sm text-[11px]">Account</span>
              </button>
            </div>
          </nav>
        )}
      </div>

      {/* ========================================================== */}
      {/* INTERACTIVE MODALS & DRAWERS                               */}
      {/* ========================================================== */}
      <LocationSheetModal
        isOpen={isLocationModalOpen}
        activeCity={activeCity}
        onClose={() => setIsLocationModalOpen(false)}
        onSelectCity={(city) => {
          setActiveCity(city);
          showToast('City Hub Selected', `Local stores & live auctions focused on ${city}`);
        }}
      />

      <StartAuctionModal
        isOpen={isStartAuctionModalOpen}
        activeCity={activeCity}
        initialModel={startAuctionPrefill}
        onClose={() => setIsStartAuctionModalOpen(false)}
        onLaunchAuction={handleLaunchAuction}
      />

      <ReservationModal
        product={reserveProduct}
        onClose={() => setReserveProduct(null)}
        onConfirmReserve={handleConfirmReservation}
      />

      <DeviceInspectionModal
        product={inspectProduct}
        onClose={() => setInspectProduct(null)}
        onReserve={(prod) => setReserveProduct(prod)}
      />

      {/* Authentication / Login & Register Modal with background blur */}
      <AuthModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {/* Slide-out Side Navigation Drawer (like phoneo.in) */}
      <SidePanelDrawer
        isOpen={isSidePanelOpen}
        onClose={() => setIsSidePanelOpen(false)}
        activeTab={activeTab}
        rolePerspective={rolePerspective}
        activeCity={activeCity}
        onSelectCity={setActiveCity}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onNavigate={handleNavigate}
      />

      {/* Interactive Toast Notification Popup */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom duration-300 pointer-events-none">
          <div className="px-5 py-3 rounded-2xl bg-inverse-surface text-inverse-on-surface shadow-2xl flex items-center gap-3 border border-surface-container-high/20">
            <span className="material-symbols-outlined text-primary-fixed text-[22px]">
              check_circle
            </span>
            <div>
              <div className="font-title-sm text-title-sm text-inverse-on-surface font-bold">
                {toast.title}
              </div>
              <div className="font-body-sm text-body-sm text-surface-container-highest">
                {toast.desc}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
