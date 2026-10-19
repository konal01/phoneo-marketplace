# Phoneo Marketplace Redesign

A high-fidelity, responsive React + TypeScript + Tailwind CSS application built faithfully from the [Stitch Design System](https://stitch.withgoogle.com/projects/7145556672694038565) (*Teal Pulse Commerce* theme).

##  Highlights & Features

### 1. Unified Responsive & Multi-View Architecture
- **Auto Mode**: Adapts fluidly between Mobile Layout (`< 768px`) and Desktop Layout (`≥ 768px`).
- **Interactive Viewport Switcher**: Floating top-right toggle (`Auto` | `Desktop` | `Mobile App`) allowing instant inspection of the 390px mobile app shell (with status bar & bottom navigation bar) or full desktop widescreen layout on any screen size.

### 2. Full Stitch Screens Implemented
- **Home / Marketplace**:
  - Top Broadcast ticker with active regional shopkeeper count
  - Instant Resale Value Estimator with live dynamic quote updates
  - Asymmetric Hero with live ticking countdown & real-time bid streams
  - Popular Brands reel with interactive filtering
  - Dual primary action hub (*Sell Old Mobile* & *Buy Certified*)
  - Live shopkeeper auction horizontal ticker
  - Certified pre-owned device grid with *Inspect* and *Hold / Reserve* modals
  - Value proposition comparison matrix (Phoneo vs Algorithmic Scrap Platforms vs Classifieds)
  - Verified local partner store showcase
  - Interactive City Skyline Landmarks selector (Raipur, Bhilai, Durg, Indore, Bilaspur, Rajnandgaon)
  - Interactive FAQ accordions
- **Sell & Live Auction Hub**:
  - Role segment switcher (*I Want to Sell* vs *Shopkeeper Bidding Deck*)
  - 2-Minute Diagnostic Valuation Engine with progress visualizer & battery health slider
  - Shopkeeper Bidding Room HUD with real-time wallet escrow balance & refill action
  - Escalating live auction cards with countdown timers (`04m 12s left`, etc.)
  - Quick Raise buttons (`+₹500`, `+₹1,000`, `+₹2,000`) and custom bid inputs
  - Real-time bid logs and binding escrow protections
- **Store Profile / Showrooms**:
  - Verified retailer storefront banner with Gold Partner & GSTIN badges
  - Trust telemetry (350+ Phones Sold, 1-Year Warranty Hub, Spot Cash Buyout, 32-Point Test Bench)
  - Direct connect actions: *Call Store*, *WhatsApp*, *Driving Directions*
  - Trade-in walk-in upgrade banner
  - Multi-tab navigation (*Inventory*, *Offers & Deals*, *Reviews*, *About & Services*)
  - Multi-attribute filter sidebar (Brand, Condition Grade, Storage, Budget Range)
  - Interactive *Hold / Reserve* action with instant 3-hour store hold confirmation
  - Interactive physical test-bench location map card and verified customer reviews

### 3. Interactive Modals
- **City Picker Bottom Sheet / Modal**: Filter regional hubs or simulate GPS location detection.
- **Start Free Auction Modal**: Launch a 30-minute auction that immediately broadcasts into the live auction pool.
- **Store Reservation Modal**: Hold phones exclusively at the physical store for 3 hours.
- **32-Point Certified Inspection Modal**: Hardware diagnostic report with camera, display, battery, and CEIR blacklist verification.
- **My Bids & Account Dashboard**: View active store reservations, live created auctions, and saved wishlist items.

---

## Running Locally

```bash
cd phoneo-marketplace
npm install
npm run dev
```

