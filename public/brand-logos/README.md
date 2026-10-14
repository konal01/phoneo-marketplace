# Brand Logos

Official phone brand logos used across the Phoneo website via the
`BrandLogo` component (`src/components/BrandLogos.tsx`).

Save the logo images in this folder with these exact filenames:

| Brand        | Filename      |
| ------------ | ------------- |
| Apple        | `apple.png`   |
| Samsung      | `samsung.png` |
| Google Pixel | `pixel.png`   |
| Nothing      | `nothing.png` |
| OnePlus      | `oneplus.png` |

If a file is missing, the site automatically falls back to the built-in SVG logo.
To add another brand, drop its image here and add an entry to
`BRAND_LOGO_FILES` in `BrandLogos.tsx`.
