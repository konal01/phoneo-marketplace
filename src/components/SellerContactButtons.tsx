import React from 'react';
import { ProductItem, formatRupee, getSellerPhone } from '../data';

type Size = 'sm' | 'md' | 'lg';

interface SellerContactButtonsProps {
  product: Pick<ProductItem, 'name' | 'storeName' | 'price' | 'sellerPhone'> &
    Partial<Pick<ProductItem, 'storage' | 'listingId' | 'id'>>;
  size?: Size;
  className?: string;
}

/** Official WhatsApp glyph (inline so it inherits `currentColor`). */
export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.75-.72 2-1.41.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.04 21.5h-.01a9.45 9.45 0 0 1-4.82-1.32l-.35-.21-3.58.94.96-3.49-.23-.36a9.43 9.43 0 0 1-1.45-5.03c0-5.22 4.25-9.47 9.48-9.47 2.53 0 4.91.99 6.7 2.78a9.41 9.41 0 0 1 2.77 6.7c0 5.22-4.25 9.46-9.47 9.46zm8.06-17.53A11.33 11.33 0 0 0 12.04.63C5.76.63.65 5.74.65 12.02c0 2.01.52 3.97 1.52 5.69L.55 23.6l6.03-1.58a11.36 11.36 0 0 0 5.45 1.39h.01c6.28 0 11.39-5.11 11.39-11.39 0-3.04-1.18-5.9-3.33-8.05z" />
  </svg>
);

const SIZE_STYLES: Record<Size, { btn: string; icon: string; text: string }> = {
  sm: { btn: 'py-1.5 px-2.5 rounded-full gap-1', icon: 'w-3.5 h-3.5 text-[15px]', text: 'text-[11px]' },
  md: { btn: 'py-2 px-3 rounded-xl gap-1.5', icon: 'w-4 h-4 text-[17px]', text: 'text-xs' },
  lg: { btn: 'py-3.5 px-4 rounded-2xl gap-2', icon: 'w-5 h-5 text-[20px]', text: 'text-sm' },
};

/**
 * "Call Seller" + "WhatsApp" quick-contact buttons for a specific phone listing.
 * Uses the listing's seller number (or the store's number as fallback).
 */
export const SellerContactButtons: React.FC<SellerContactButtonsProps> = ({
  product,
  size = 'md',
  className = '',
}) => {
  const phone = getSellerPhone(product);
  const waNumber = phone.replace(/\D/g, '');
  const ref = product.listingId || product.id;
  const message = [
    `Hi ${product.storeName}, I saw your listing on Phoneo.`,
    `I'm interested in the ${product.name}${product.storage ? ` (${product.storage})` : ''} listed at ${formatRupee(product.price)}.`,
    ref ? `Listing ref: ${ref}.` : '',
    'Is it still available?',
  ]
    .filter(Boolean)
    .join(' ');
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
  const s = SIZE_STYLES[size];
  const base = `flex-1 min-w-0 inline-flex items-center justify-center font-bold whitespace-nowrap transition-all active:scale-95 ${s.btn} ${s.text}`;

  return (
    <div className={`flex items-stretch gap-2 ${className}`} onClick={(e) => e.stopPropagation()}>
      <a
        href={`tel:${phone}`}
        aria-label={`Call ${product.storeName}`}
        className={`${base} bg-gradient-to-r from-primary to-teal-700 text-on-primary shadow-[0_4px_14px_rgba(0,106,97,0.28)] hover:shadow-[0_6px_18px_rgba(0,106,97,0.38)] hover:-translate-y-0.5 hover:brightness-105`}
      >
        <span className={`material-symbols-outlined leading-none ${s.icon}`}>call</span>
        <span className="truncate">Call Seller</span>
      </a>
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`WhatsApp ${product.storeName}`}
        className={`${base} bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-white shadow-[0_4px_14px_rgba(34,197,94,0.3)] hover:shadow-[0_6px_18px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 hover:brightness-105`}
      >
        <WhatsAppIcon className={s.icon} />
        <span className="truncate">WhatsApp</span>
      </a>
    </div>
  );
};

export default SellerContactButtons;
