import React, { useState } from 'react';
import { PHONEO_LOGO_URL } from '../data';

interface FooterProps {
  onNavigate: (tab: any, role?: any) => void;
  onSelectBrand?: (brand: string) => void;
  onOpenStartAuctionModal?: (prefill?: string) => void;
  showToast?: (title: string, desc: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onSelectBrand,
  onOpenStartAuctionModal,
  showToast,
}) => {
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (text: string, action?: () => void) => {
    if (action) {
      action();
    } else if (showToast) {
      showToast(text, `Navigating to ${text} on Phoneo.`);
    }
  };

  const PRE_OWNED_LINKS = [
    { label: 'buy 2nd hand Apple phones', brand: 'Apple', type: 'buy' },
    { label: 'buy 2nd hand Samsung phones', brand: 'Samsung', type: 'buy' },
    { label: 'buy 2nd hand OnePlus phones', brand: 'OnePlus', type: 'buy' },
    { label: 'buy 2nd hand Realme phones', brand: 'Realme', type: 'buy' },
    { label: 'buy 2nd hand Xiaomi phones', brand: 'Xiaomi', type: 'buy' },
    { label: 'buy 2nd hand Vivo phones', brand: 'Vivo', type: 'buy' },
    { label: 'buy 2nd hand Oppo phones', brand: 'Oppo', type: 'buy' },
    { label: 'buy 2nd hand Motorola phones', brand: 'Motorola', type: 'buy' },
    { label: 'buy 2nd hand Google phones', brand: 'Google Pixel', type: 'buy' },
    { label: 'sell used Apple phone', brand: 'Apple iPhone', type: 'sell' },
    { label: 'sell used Samsung phone', brand: 'Samsung Galaxy', type: 'sell' },
    { label: 'sell used OnePlus phone', brand: 'OnePlus', type: 'sell' },
    { label: 'sell used Realme phone', brand: 'Realme', type: 'sell' },
    { label: 'sell used Xiaomi phone', brand: 'Xiaomi', type: 'sell' },
    { label: 'sell used Vivo phone', brand: 'Vivo', type: 'sell' },
    { label: 'sell used Oppo phone', brand: 'Oppo', type: 'sell' },
  ];

  return (
    <footer className="w-full bg-white/95 backdrop-blur-xl border-t border-teal-100/90 shadow-[0_-4px_24px_rgba(13,148,136,0.03)] text-slate-800 transition-colors relative pb-28 md:pb-12">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* SEO Highlights & Expandable Read More */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <ul className="text-xs sm:text-[13px] text-slate-600 space-y-1.5 leading-relaxed font-normal">
            <li>
              <strong className="text-slate-800 font-semibold">Direct buyer-seller connection</strong> - No hidden charges or commissions.
            </li>
            <li>
              <strong className="text-slate-800 font-semibold">Best market prices &amp; exclusive deals</strong> - Save more on every purchase.
            </li>
            {isReadMoreExpanded && (
              <>
                <li>
                  <strong className="text-slate-800 font-semibold">City-wise shop listings</strong> - Find second-hand phones near you easily.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Free auction feature</strong> - Sell your old phone at the highest price.
                </li>
                <li>
                  <strong className="text-slate-800 font-semibold">Exchange &amp; EMI options</strong> - Upgrade your phone affordably.
                </li>
              </>
            )}
          </ul>
          <button
            type="button"
            onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-800 transition-colors"
          >
            <span>{isReadMoreExpanded ? 'Read Less' : 'Read More'}</span>
            <span className="material-symbols-outlined text-[16px]">
              {isReadMoreExpanded ? 'expand_less' : 'expand_more'}
            </span>
          </button>
        </div>

        {/* Pre Owned Mobiles SEO Links Bar */}
        <div className="border-t border-slate-200/80 pt-6 pb-6 text-center">
          <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-3 tracking-tight">
            Pre Owned Mobiles
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-1 text-[11px] sm:text-xs text-blue-600/90 max-w-4xl mx-auto leading-relaxed">
            {PRE_OWNED_LINKS.map((item, idx) => (
              <React.Fragment key={item.label}>
                <button
                  type="button"
                  onClick={() => {
                    if (item.type === 'buy') {
                      if (onSelectBrand) onSelectBrand(item.brand);
                      onNavigate('catalog');
                    } else {
                      if (onOpenStartAuctionModal) {
                        onOpenStartAuctionModal(item.brand);
                      } else {
                        onNavigate('auctions', 'seller');
                      }
                    }
                  }}
                  className="hover:underline hover:text-teal-700 transition-colors cursor-pointer text-left"
                >
                  {item.label}
                </button>
                {idx < PRE_OWNED_LINKS.length - 1 && (
                  <span className="text-slate-300 select-none">|</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Main Footer Split: Logo + Social Media & About Links */}
        <div className="border-t border-slate-200/80 pt-8 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Brand & Social */}
            <div className="md:col-span-5 space-y-4">
              <div
                onClick={() => onNavigate('home')}
                className="cursor-pointer inline-block"
              >
                <img
                  src={PHONEO_LOGO_URL}
                  alt="Phoneo"
                  className="h-10 w-auto object-contain drop-shadow-xs"
                />
              </div>

              <p className="font-medium text-slate-700 text-sm sm:text-base tracking-tight">
                Don&apos;t compromise on quality
              </p>

              <div>
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2.5">
                  Social Media
                </h4>
                {/* Social pill button matching phoneo.in with frosted glassmorphism */}
                <div className="inline-flex items-center bg-slate-900/85 hover:bg-slate-900/95 backdrop-blur-xl rounded-full px-4 py-2 gap-4 text-white border border-white/20 shadow-sm transition-colors">
                  {/* Facebook */}
                  <a
                    href="https://www.facebook.com/people/Phoneoin/61559868725835/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Phoneo on Facebook"
                    className="text-white hover:text-teal-300 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>

                  {/* X / Twitter */}
                  <a
                    href="https://x.com/phoneo_in"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Phoneo on X (Twitter)"
                    className="text-white hover:text-teal-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/phoneo.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Phoneo on Instagram"
                    className="text-white hover:text-teal-300 transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="https://www.linkedin.com/company/phoneo/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Phoneo on LinkedIn"
                    className="text-white hover:text-teal-300 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right About Grid */}
            <div className="md:col-span-7">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-3">
                About
              </h4>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs sm:text-sm text-slate-700">
                {/* Column 1 */}
                <div className="space-y-2.5">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('About Us')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      About Us
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Privacy & policy')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Privacy &amp; policy
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Terms & Condition')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Terms &amp; Condition
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Contact us')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Contact us
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('NewsLetter')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      NewsLetter
                    </button>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-2.5">
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Blogs')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Blogs
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Career')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Career
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick("FAQ's")}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      FAQ&apos;s
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => handleLinkClick('Health')}
                      className="hover:text-teal-700 transition-colors text-left"
                    >
                      Health
                    </button>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => onNavigate('auctions', 'seller')}
                      className="hover:text-teal-700 font-semibold text-teal-800 transition-colors text-left"
                    >
                      Auction
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-slate-200/80 pt-6 text-center text-xs text-slate-700 space-y-1">
          <p className="font-normal">
            Copyright &copy; 2026 PHONEO All Rights Reserved
          </p>
          <p className="text-[11px] text-slate-500 font-mono">
            V: 1.0.591
          </p>
        </div>
      </div>

      {/* Floating Scroll-to-Top Button with Glassmorphism */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className="fixed bottom-20 md:bottom-6 right-5 z-40 w-11 h-11 rounded-full bg-teal-600/90 hover:bg-teal-600 text-white backdrop-blur-xl flex items-center justify-center border border-white/40 shadow-[0_8px_24px_rgba(13,148,136,0.35)] hover:shadow-[0_12px_28px_rgba(13,148,136,0.45)] transition-all duration-300 hover:scale-110 active:scale-95"
      >
        <span className="material-symbols-outlined text-[22px]">arrow_upward</span>
      </button>
    </footer>
  );
};
