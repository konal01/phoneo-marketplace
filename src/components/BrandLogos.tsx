import React, { useEffect, useState } from 'react';

import appleLogo from '../assets/brand-logo/Apple_logo_black.svg';
import googlePixelLogo from '../assets/brand-logo/google-pixel-logo-png_seeklogo-329420.png';
import iqooLogo from '../assets/brand-logo/iqoo-logo-png_seeklogo-469682.png';
import motorolaLogo from '../assets/brand-logo/Motorola_Mobility-Logo.wine.png';
import nothingLogo from '../assets/brand-logo/nothing-mobile-company-brand-official-logo-icon-and-symbol-high-quality-digital-download-free-vector.jpg';
import onePlusLogo from '../assets/brand-logo/OnePlus-Logo.png';
import oppoLogo from '../assets/brand-logo/Oppo-Logo.wine.png';
import realmeLogo from '../assets/brand-logo/Realme-realme-_logo_box-RGB-01.png';
import samsungLogo from '../assets/brand-logo/Samsung-Logo.png';
import vivoLogo from '../assets/brand-logo/vivo-communication-technology-logo-png_seeklogo-527673.png';
import xiaomiLogo from '../assets/brand-logo/Xiaomi_logo_(2021-).svg.webp';

export type SupportedBrand =
  | 'Apple'
  | 'Samsung'
  | 'OnePlus'
  | 'Google Pixel'
  | 'Google'
  | 'Xiaomi'
  | 'Vivo'
  | 'Realme'
  | 'Motorola'
  | 'Oppo'
  | 'iQOO'
  | 'Nothing';

interface BrandLogoProps {
  brand: string;
  className?: string;
  size?: number | string;
  mono?: boolean;
}

/**
 * Official brand logo image files imported directly from `src/assets/brand-logo/`.
 */
export const BRAND_LOGOS: { match: string[]; src: string; label: string }[] = [
  { match: ['apple', 'iphone'], src: appleLogo, label: 'Apple' },
  { match: ['samsung', 'galaxy'], src: samsungLogo, label: 'Samsung' },
  { match: ['oneplus'], src: onePlusLogo, label: 'OnePlus' },
  { match: ['google', 'pixel'], src: googlePixelLogo, label: 'Google Pixel' },
  { match: ['xiaomi', 'redmi', 'mi'], src: xiaomiLogo, label: 'Xiaomi' },
  { match: ['vivo'], src: vivoLogo, label: 'Vivo' },
  { match: ['realme'], src: realmeLogo, label: 'Realme' },
  { match: ['motorola', 'moto'], src: motorolaLogo, label: 'Motorola' },
  { match: ['oppo'], src: oppoLogo, label: 'Oppo' },
  { match: ['iqoo'], src: iqooLogo, label: 'iQOO' },
  { match: ['nothing'], src: nothingLogo, label: 'Nothing' },
];

export const getBrandLogoSrc = (brand: string): { src: string; label: string } | null => {
  const norm = (brand || '').trim().toLowerCase();
  const entry = BRAND_LOGOS.find((b) => b.match.some((m) => norm.includes(m)));
  return entry ? { src: entry.src, label: entry.label } : null;
};

export const BrandLogo: React.FC<BrandLogoProps> = (props) => {
  const { brand, className = 'w-6 h-6', size, mono = false } = props;
  const [failed, setFailed] = useState(false);
  const logo = getBrandLogoSrc(brand);

  useEffect(() => setFailed(false), [brand]);

  if (logo && !failed) {
    const style = size ? { width: size, height: size } : undefined;
    const img = (
      <img
        src={logo.src}
        alt={`${logo.label} logo`}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className={`${mono ? 'w-full h-full max-h-full' : className} object-contain select-none`}
        style={mono ? undefined : style}
      />
    );
    // On coloured (selected) tiles, show the logo inside a clean white chip so it stays legible.
    return mono ? (
      <span
        className={`${className} inline-flex items-center justify-center bg-white rounded-xl p-1 shadow-xs overflow-hidden`}
        style={style}
      >
        {img}
      </span>
    ) : (
      img
    );
  }

  return <SvgBrandLogo {...props} />;
};

/** Inline SVG fallbacks used when no image file is available. */
const SvgBrandLogo: React.FC<BrandLogoProps> = ({
  brand,
  className = 'w-6 h-6',
  size,
  mono = false,
}) => {
  const norm = brand.trim().toLowerCase();
  const style = size ? { width: size, height: size } : undefined;

  // Apple
  if (norm.includes('apple') || norm.includes('iphone')) {
    return (
      <svg
        viewBox="0 0 170 170"
        className={`${className} fill-current`}
        style={style}
        aria-label="Apple logo"
      >
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.33-6.52-9.98-11.83-21.2-15.93-33.65-4.1-12.46-6.15-24.31-6.15-35.54 0-14.78 3.82-26.69 11.46-35.73 7.64-9.04 16.99-13.67 28.05-13.9 4.35 0 9.24 1.16 14.68 3.48 5.43 2.32 9.24 3.48 11.43 3.48 1.96 0 5.91-1.23 11.86-3.7 5.94-2.46 11.13-3.62 15.55-3.48 13.04.65 23.36 5.36 30.98 14.13-11.3 6.96-16.81 16.3-16.52 28.04.22 9.57 3.99 17.54 11.3 23.91 7.32 6.38 16.09 10.07 26.31 11.09-2.39 7.4-5.36 14.85-8.91 22.36zM119.22 33.6c0-7.61 2.76-14.78 8.26-21.52 5.51-6.74 12.32-11.23 20.44-13.48.43 1.96.65 3.84.65 5.65 0 7.61-2.83 14.85-8.48 21.74-5.65 6.88-12.61 11.3-20.87 13.26v-5.65z" />
      </svg>
    );
  }

  // Samsung
  if (norm.includes('samsung')) {
    return (
      <svg
        viewBox="0 0 256 90"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#1428A0]'}`}
        style={style}
        aria-label="Samsung logo"
      >
        <path d="M25.7 32.3c-7.9-1.9-12.8-4.2-12.8-8.8 0-4.6 4.6-7.7 12-7.7 7 0 11.8 2.8 13.7 7.5l9.2-3.8C44.4 11.7 36 6 24.8 6 11 6 2 13.8 2 24.5c0 11.5 9.7 15.5 19.3 17.8 8.6 2.1 13.7 4.7 13.7 9.5 0 5.2-5 8.5-13.4 8.5-8.1 0-14-3.5-15.6-9.1l-9.4 3.9C-1 63.8 8.3 71.4 21.6 71.4c14.6 0 24.4-8 24.4-19.3 0-11.7-10.4-16.1-20.3-19.8zm48.8-24.9h-9.9l-20.4 62.4h11l4.8-15.4h18.8l4.8 15.4h11.2L74.5 7.4zm-11.3 38.6 6.3-20.4 6.3 20.4H63.2zm64.8-38.6h-11.5l-14 36.8-14-36.8h-11.5v62.4h10.2V30.1l11.4 30.3h7.6l11.4-30.3v39.7h10.4V7.4zm44.2 24.9c-7.9-1.9-12.8-4.2-12.8-8.8 0-4.6 4.6-7.7 12-7.7 7 0 11.8 2.8 13.7 7.5l9.2-3.8c-3.4-7.8-11.8-13.5-23-13.5-13.8 0-22.8 7.8-22.8 18.5 0 11.5 9.7 15.5 19.3 17.8 8.6 2.1 13.7 4.7 13.7 9.5 0 5.2-5 8.5-13.4 8.5-8.1 0-14-3.5-15.6-9.1l-9.4 3.9c2.4 8.6 11.7 16.2 25 16.2 14.6 0 24.4-8 24.4-19.3 0-11.7-10.4-16.1-20.3-19.8zm23.6-24.9v41.3c0 9.8 6.5 13.9 15.5 13.9 9 0 15.5-4.1 15.5-13.9V7.4h-10.4v40.3c0 4.2-2.1 6.3-5.1 6.3-3 0-5.1-2.1-5.1-6.3V7.4h-10.4zm74.7 0h-9.9l-22.1 38.8V7.4h-10.4v62.4h9.9l22.1-38.8v38.8h10.4V7.4z" />
      </svg>
    );
  }

  // OnePlus
  if (norm.includes('oneplus')) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#EB0029]'}`}
        style={style}
        aria-label="OnePlus logo"
      >
        <rect x="5" y="5" width="90" height="90" rx="20" stroke="currentColor" strokeWidth="0" />
        <path
          fill="#FFFFFF"
          d="M51 28h-8v44h8V28zm14 17h-9v8h9v9h8v-9h9v-8h-9v-9h-8v9zM39 28v-9h-8v9h-9v8h9v-8h8z"
        />
        <text
          x="34"
          y="68"
          fill="#FFFFFF"
          fontSize="48"
          fontWeight="900"
          fontFamily="system-ui, sans-serif"
          textAnchor="middle"
        >
          1
        </text>
      </svg>
    );
  }

  // Google Pixel / Google
  if (norm.includes('google') || norm.includes('pixel')) {
    return (
      <svg
        viewBox="0 0 48 48"
        className={className}
        style={style}
        aria-label="Google Pixel logo"
      >
        {mono ? (
          <path
            fill="currentColor"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
        ) : (
          <>
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
          </>
        )}
      </svg>
    );
  }

  // Vivo
  if (norm.includes('vivo')) {
    return (
      <svg
        viewBox="0 0 180 60"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#0066FF]'}`}
        style={style}
        aria-label="Vivo logo"
      >
        {/* Stylized vivo brandmark */}
        <path d="M12.5 13.2h8.9l12.4 25.1 12.4-25.1h8.9L37.9 46.8h-7.8L12.5 13.2z" />
        <circle cx="67" cy="18" r="4.8" />
        <rect x="62.5" y="26" width="9" height="20.8" rx="2" />
        <path d="M84.5 13.2h8.9l12.4 25.1 12.4-25.1h8.9L109.9 46.8h-7.8L84.5 13.2z" />
        <path d="M152 23.5c-7.8 0-14 6.2-14 14s6.2 14 14 14 14-6.2 14-14-6.2-14-14-14zm0 20.8c-3.8 0-6.8-3-6.8-6.8s3-6.8 6.8-6.8 6.8 3 6.8 6.8-3 6.8-6.8 6.8z" />
      </svg>
    );
  }

  // Xiaomi
  if (norm.includes('xiaomi') || norm.includes('mi')) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#FF6900]'}`}
        style={style}
        aria-label="Xiaomi logo"
      >
        <rect width="100" height="100" rx="32" />
        <path
          fill="#FFFFFF"
          d="M24 30h14v16.5h10.5V30h14v40h-14V57.5H38V70H24V30zm43.5 0h8.5v40h-8.5V30z"
        />
      </svg>
    );
  }

  // Realme
  if (norm.includes('realme')) {
    return (
      <svg
        viewBox="0 0 120 120"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#FFC800]'}`}
        style={style}
        aria-label="Realme logo"
      >
        <rect width="120" height="120" rx="28" />
        <path
          fill="#1C1B1F"
          d="M32 34h26c13.3 0 24 10.7 24 24 0 11.2-7.6 20.6-18 23.2L77 92H63L52 82h-8v10H32V34zm12 36h14c6.6 0 12-5.4 12-12s-5.4-12-12-12H44v24z"
        />
      </svg>
    );
  }

  // Motorola
  if (norm.includes('motorola') || norm.includes('moto')) {
    return (
      <svg
        viewBox="0 0 100 100"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#00142E]'}`}
        style={style}
        aria-label="Motorola logo"
      >
        <circle cx="50" cy="50" r="48" fill={mono ? 'currentColor' : '#00142E'} />
        <path
          fill="#FFFFFF"
          d="M50 20c-16.6 0-30 13.4-30 30 0 16.6 13.4 30 30 30s30-13.4 30-30c0-16.6-13.4-30-30-30zm0 4.8c13.9 0 25.2 11.3 25.2 25.2 0 13.9-11.3 25.2-25.2 25.2-13.9 0-25.2-11.3-25.2-25.2 0-13.9 11.3-25.2 25.2-25.2zm-12.8 33.6c-1.8 0-3.4-.8-4.5-2.2l-3.2-4.1 6.5-12.2c.8-1.5 2.4-2.5 4.2-2.5 2.1 0 3.9 1.4 4.5 3.4l5.3 17.6-12.8 0zm25.6 0l5.3-17.6c.6-2 2.4-3.4 4.5-3.4 1.8 0 3.4 1 4.2 2.5l6.5 12.2-3.2 4.1c-1.1 1.4-2.7 2.2-4.5 2.2l-12.8 0zm-8.8-14.8l-4 13.6-4-13.6 4-6 4 6z"
        />
      </svg>
    );
  }

  // Oppo
  if (norm.includes('oppo')) {
    return (
      <svg
        viewBox="0 0 180 60"
        className={`${className} ${mono ? 'fill-current' : 'fill-[#0F7547]'}`}
        style={style}
        aria-label="Oppo logo"
      >
        <ellipse cx="28" cy="30" rx="18" ry="14" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="68" cy="30" rx="18" ry="14" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="108" cy="30" rx="18" ry="14" fill="none" stroke="currentColor" strokeWidth="6" />
        <ellipse cx="148" cy="30" rx="18" ry="14" fill="none" stroke="currentColor" strokeWidth="6" />
      </svg>
    );
  }

  // Fallback smartphone icon
  return (
    <span className={`material-symbols-outlined ${className}`} style={style}>
      smartphone
    </span>
  );
};
