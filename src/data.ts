export type CityName = 'Raipur' | 'Bhilai' | 'Durg' | 'Indore' | 'Bilaspur' | 'Rajnandgaon';

export interface CityHub {
  name: CityName;
  state: string;
  stores: number;
  icon: string;
  clusterName: string;
}

export interface AuctionItem {
  id: string;
  listingCode: string;
  model: string;
  brand: string;
  specs: string;
  conditionBadge: string;
  batteryHealth: string;
  accessories: string[];
  sellerName: string;
  sellerRole: string;
  location: string;
  city: CityName;
  distance: string;
  image: string;
  highestBid: number;
  leadingStore: string;
  leadingStoreArea: string;
  totalBids: number;
  secondsLeft: number;
  statusTag: 'ENDING SOON' | 'ACTIVE' | 'FLAGSHIP';
  recentBids: { store: string; area: string; amount: number; timeAgo: string }[];
}

export interface ProductItem {
  id: string;
  name: string;
  brand: 'Apple' | 'Samsung' | 'OnePlus' | 'Google Pixel' | 'Vivo' | 'Xiaomi' | 'Realme' | 'Motorola' | string;
  categoryTag: string;
  specs: string;
  grade: 'Pristine' | 'Grade A+' | 'Mint Grade' | 'Good Grade' | 'Like New';
  batteryOrFeature: string;
  featureIcon: string;
  warranty: string;
  inspectionNote: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  storeName: string;
  storeArea: string;
  city: CityName;
  distance: string;
  rating: number;
  storage: '64 GB' | '128 GB' | '256 GB' | '512 GB';
  image: string;
  images?: string[];
  color?: string;
  ram?: string;
  listingId?: string;
  highlights?: string[];
  /** Optional direct seller contact (E.164, e.g. +919876543210). Falls back to the store's number. */
  sellerPhone?: string;
}

export interface PartnerStore {
  id: string;
  name: string;
  badge: string;
  gstin: string;
  since: string;
  rating: number;
  reviewsCount: number;
  address: string;
  shortArea: string;
  city: CityName;
  distance: string;
  phonesSold: string;
  warrantyHub: string;
  activeStock: number;
  tradesCompleted: string;
  coverImage: string;
  logoImage: string;
  mapImage: string;
  phone: string;
}

export const CITIES: CityHub[] = [
  { name: 'Raipur', state: 'CG', stores: 58, icon: 'location_city', clusterName: 'Primary Cluster' },
  { name: 'Bhilai', state: 'CG', stores: 32, icon: 'apartment', clusterName: 'Civic Centre Hub' },
  { name: 'Durg', state: 'CG', stores: 24, icon: 'account_balance', clusterName: 'Station Road' },
  { name: 'Indore', state: 'MP', stores: 55, icon: 'domain', clusterName: 'Silver Mall Hub' },
  { name: 'Bilaspur', state: 'CG', stores: 19, icon: 'temple_hindu', clusterName: 'Link Road Market' },
  { name: 'Rajnandgaon', state: 'CG', stores: 14, icon: 'villa', clusterName: 'Ganj Mandi Cluster' },
];

export const BRANDS = [
  { name: 'Apple', icon: 'phone_iphone', stock: 114, colorClass: 'text-on-surface' },
  { name: 'Samsung', icon: 'smartphone', stock: 98, colorClass: 'text-primary' },
  { name: 'OnePlus', icon: 'add_circle', stock: 64, colorClass: 'text-error' },
  { name: 'Google Pixel', icon: 'camera_alt', stock: 32, colorClass: 'text-primary' },
  { name: 'Xiaomi', icon: 'mobile_friendly', stock: 58, colorClass: 'text-tertiary-container' },
  { name: 'Vivo', icon: 'electric_bolt', stock: 41, colorClass: 'text-primary-container' },
  { name: 'Realme', icon: 'flash_on', stock: 36, colorClass: 'text-tertiary' },
  { name: 'Motorola', icon: 'radio_button_checked', stock: 22, colorClass: 'text-primary' },
];

export const INITIAL_AUCTIONS: AuctionItem[] = [
  {
    id: 'auc-1',
    listingCode: '#PH-8902',
    model: 'Apple iPhone 13 (128GB)',
    brand: 'Apple',
    specs: 'Midnight • Battery 88% • Minor hairline scratches',
    conditionBadge: 'Grade A+',
    batteryHealth: 'Battery 88%',
    accessories: ['Bill & Box', 'IMEI Clean', 'OEM Cable'],
    sellerName: 'Rohit K.',
    sellerRole: 'Govt Officer, First Owner',
    location: 'Civil Lines, Raipur',
    city: 'Raipur',
    distance: '2.4 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBz3IPXR206Vl3RccmxnAulBjaRaxHHXuUiqxFD_Rb0utwVvGLIWvDWb8n0Jeb817Z8EwrF3Hj4wud1hNhkxDsJNSU88xFmFfS8YtivAknDy97_snmx7510-zsXWPtDnnJ3aOB7Gs3QtXXimM524LZGWLV0vncb9vGuFUYNcMKGmSFz37LVAk1k_84jqJfDtgVCx7achuYFa4Cy8jBu9L9IVXUCFS2njbeX6U7veQ1wSGJNZUr2O0VV',
    highestBid: 34500,
    leadingStore: 'Shree Balaji Telecom',
    leadingStoreArea: 'Pandri, Raipur',
    totalBids: 14,
    secondsLeft: 252, // 04m 12s
    statusTag: 'ENDING SOON',
    recentBids: [
      { store: 'Shree Balaji Telecom', area: 'Pandri', amount: 34500, timeAgo: '18s ago' },
      { store: 'Sai Mobile Care', area: 'Civil Lines', amount: 33800, timeAgo: '42s ago' },
      { store: 'Apex Gadgets', area: 'Bhilai Sec 6', amount: 33100, timeAgo: '2m ago' },
    ],
  },
  {
    id: 'auc-2',
    listingCode: '#PH-8919',
    model: 'OnePlus 10 Pro 5G (256GB)',
    brand: 'OnePlus',
    specs: 'Volcanic Black • 12GB RAM • 80W Charger included',
    conditionBadge: 'Grade A',
    batteryHealth: 'Battery 91%',
    accessories: ['80W SuperVOOC', 'Original Box', 'Bill Verified'],
    sellerName: 'Priya S.',
    sellerRole: 'Self Employed',
    location: 'Station Road, Durg',
    city: 'Durg',
    distance: '11.2 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1XVfj8olHVtX75Lk6ZmYb7kLP503SZIqHGeZbjZE5jEidKgxEnmPOeJfQq_RMcwRxojhLN0qEf5mZ-7nWfV7XAcjuNvhUIUB3KVs1rVfMayc1woTgGuCuG3aXOnfdTzvXGb-QNEzFfBGEaAmGSsLGqvBFSMt3HHbDhGV5hI4w1yiI8A3OpI1HrjVUJ_U40MNonl-Q-fhSw-9ViYpqsxZcQxZPn1GZXgAZ3hMO976lEqfJcw996WJz',
    highestBid: 24200,
    leadingStore: 'Central Electronics',
    leadingStoreArea: 'Station Rd, Durg',
    totalBids: 11,
    secondsLeft: 1120, // 18m 40s
    statusTag: 'ACTIVE',
    recentBids: [
      { store: 'Central Electronics', area: 'Station Rd', amount: 24200, timeAgo: '1m ago' },
      { store: 'City Phone Point', area: 'Supela', amount: 23700, timeAgo: '3m ago' },
    ],
  },
  {
    id: 'auc-3',
    listingCode: '#PH-8930',
    model: 'Samsung Galaxy S23 Ultra (256GB)',
    brand: 'Samsung',
    specs: 'Green • Snapdragon 8 Gen 2 • S-Pen & Original Box',
    conditionBadge: 'Pristine Mint',
    batteryHealth: 'Battery 95%',
    accessories: ['Original S-Pen', 'Samsung Care+ Active', 'GST Bill'],
    sellerName: 'Pooja Verma',
    sellerRole: 'Doctor, upgrading to S24',
    location: 'Telibandha, Raipur',
    city: 'Raipur',
    distance: '1.8 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCf4ugjYOPjwwWQFg08FfwJkdEe0eARdEVfZXJ13SLno8Y8pbYBUPoEf4b2Sm7th53wtC2-fpiR8layGscFnOHnR3fGpqmghBFis9Aw24usqpwpcmXmDUg_GGMf1_EYyJjPAY-t6rcCgpEZJoXiccoFwScRMXshhVK2ZrS7dvqVEoSeTfJyUBn_fsRKjV5v3tObfYjhXI9Vqfn6FfKhfXjzBoVgBZ76-QUS_O1v4cMa092cTmgRzTBB',
    highestBid: 56500,
    leadingStore: 'Raipur Digital Mall',
    leadingStoreArea: 'Telibandha, Raipur',
    totalBids: 9,
    secondsLeft: 662, // 11m 02s
    statusTag: 'FLAGSHIP',
    recentBids: [
      { store: 'Raipur Digital Mall', area: 'Telibandha', amount: 56500, timeAgo: '50s ago' },
      { store: 'Apex Gadgets Durg', area: 'Durg', amount: 55500, timeAgo: '4m ago' },
    ],
  },
  {
    id: 'auc-4',
    listingCode: '#PH-8941',
    model: 'Samsung Galaxy Z Flip 4 (128GB)',
    brand: 'Samsung',
    specs: 'Bora Purple • 8GB / 128GB • Hinge A+ Grade',
    conditionBadge: 'Hinge A+ Grade',
    batteryHealth: 'Battery 90%',
    accessories: ['Bill Included', 'Original Box'],
    sellerName: 'Aman V.',
    sellerRole: 'Architect',
    location: 'Devendra Nagar, Raipur',
    city: 'Raipur',
    distance: '4.1 km',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAxhD8T6jpp55f1QGb2AtrTSpwHq_yebj6N1kjbup3GGhXMCZnLUeu-He4beiPIgQP6twgIKFHKBN5VIc1sVdkn16vr2IidprEqNhFaYh_NePOz6dQUFNZHoiMPgp9ygXu4LO4NYEoF38zBnrgGdVXUzjUYqI3UYmEvn358iA8yQaP5dj-hYtUOOmu5F33Hpm13tc1Zdgaloa2zy_CYjmm9F0OyvVeAIxSZa-EDJMFnZmYq5MELZ0dJ',
    highestBid: 31500,
    leadingStore: 'Steel City Mobile Care',
    leadingStoreArea: 'Civic Centre, Bhilai',
    totalBids: 9,
    secondsLeft: 2410, // 40m 10s
    statusTag: 'ACTIVE',
    recentBids: [
      { store: 'Steel City Mobile Care', area: 'Bhilai', amount: 31500, timeAgo: '2m ago' },
      { store: 'Jai Hind Cellular', area: 'Raipur', amount: 30500, timeAgo: '5m ago' },
    ],
  },
];

export const HERO_SHOWCASE_AUCTION = {
  model: 'iPhone 15 Pro • 128GB',
  seller: 'Rahul S. • Telibandha, Raipur Hub',
  badges: ['Pristine Grade', 'Battery 96%', 'Bill & Box'],
  highestBid: 63800,
  leadingStore: 'Shree Sai Mobile (Pandri)',
  jumpAmount: '₹1,200',
  retailersBidding: 14,
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBEiyOlsqPhJnWkxdxpfwe7WVfLH2K5L8wYD5cWOWD_aGFJN7AuwzmW1-AkLCJnyZ5CC_BvbDaoZadO-fqleRMRCeBCvjsSVph6uCM9WYEUVlw_u2WS9t92mxdGgSiVGOese4B2LGvlrlNaoXg78BjbXAhTJZ6osjGSovJlUwNZggA-6VemKAuyM6s_UUerxSLdVC3vds4RnnHYr1fxse8PDhvtpK0BxyB7_-XzvKxOHNmv65TN4c01',
  recentStream: [
    { store: 'Ravi Telecom (Civil Lines)', amount: '₹62,600', time: '35s ago' },
    { store: 'Apex Gadgets (Bhilai Sec 6)', amount: '₹61,900', time: '1m ago' },
  ],
};

export const PRODUCTS: ProductItem[] = [
  {
    id: '88782',
    listingId: '88782',
    name: 'Vivo Y19 (4GB/64GB)',
    brand: 'Vivo',
    categoryTag: 'Vivo Budget Champion',
    specs: 'Magnetic Black • 5000 mAh • 16MP AI Triple Camera',
    grade: 'Grade A+',
    batteryOrFeature: '5000 mAh • 18W Dual-Engine',
    featureIcon: 'battery_charging_full',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Point Inspected • Dual-Engine Fast Charge Tested',
    price: 8499,
    originalPrice: 15990,
    discountPercent: 47,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.2 km',
    rating: 4.9,
    storage: '64 GB',
    ram: '4 GB',
    color: 'Magnetic Black',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    images: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    ],
    highlights: [
      '5000 mAh massive battery with 18W Dual-Engine Fast Charging',
      '6.53-inch FHD+ Halo FullView Display with eye protection',
      '16MP AI Triple Camera with super wide-angle and macro lens',
      'Dual SIM 4G VoLTE + Dedicated microSD card slot up to 256GB',
    ],
  },
  {
    id: 'prod-1',
    listingId: '91024',
    name: 'iPhone 14 Pro 128GB',
    brand: 'Apple',
    categoryTag: 'Apple Flagship',
    specs: 'Deep Purple • 94% Battery • Original Bill',
    grade: 'Pristine',
    batteryOrFeature: 'Battery 91%',
    featureIcon: 'battery_charging_full',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Point Inspected • 6 Mo Warranty',
    price: 62000,
    originalPrice: 119900,
    discountPercent: 48,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.2 km',
    rating: 4.9,
    storage: '128 GB',
    ram: '6 GB',
    color: 'Deep Purple',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCunFGLWrMXs7EQffeKGUZTOxlKCfB3oxDuiQNt67vB_wkHhn31i20lRmeEYGAgsYjVIVvoTn3yLQXrcU0V3y70HBIFIlO2cJQYiVnJt2B-AMm5JSmsufF5SPXRulFKSfZ6zrP0hn9S5Vd219A_AVrfGBX5xzG2NufruS8SG-iph-r29nZffNeO4Y-YRzweRP5PLwokukMd7zBDF-sPGLfwu5DdWNH0VZjpqybemabOGBd_6IOTm1ab',
  },
  {
    id: 'prod-2',
    name: 'Samsung S23 Ultra 256GB',
    brand: 'Samsung',
    categoryTag: 'Samsung Galaxy 5G',
    specs: 'Phantom Black • 12GB RAM • S-Pen Included',
    grade: 'Mint Grade',
    batteryOrFeature: 'Stylus S-Pen OK',
    featureIcon: 'edit',
    warranty: '1-Yr Store Hub',
    inspectionNote: 'Zero Scratches • 3M Shop Warranty',
    price: 58500,
    originalPrice: 124999,
    discountPercent: 53,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.8 km',
    rating: 4.9,
    storage: '256 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByS0Qu_DYHp9I-F1kYVQG0nfvxrZw1GJuUlxAo-AcrJ7gRmC1E2FMRFHJ9N8HD3ElFdPnUAfPt3nTAUMO8kllq8_ZbQRGoDRyVepNc47q-jHGD1OL6AqiubGYPT7ruOLhHVnqUvHUS6KXGu7RCI4e9wWQE4Ssi7AY0q2c0EPXQwQN0aX9v_zJu592hlK6KHRYMs4KbYgn5yQWEuxEDWHpn6PV7avhc_ze2LitC9Wi6-5ylAAIZEpFu',
  },
  {
    id: 'prod-3',
    name: 'OnePlus 11 5G 128GB',
    brand: 'OnePlus',
    categoryTag: 'OnePlus Hasselblad',
    specs: 'Eternal Green • 8GB RAM • 100W Pack',
    grade: 'Pristine',
    batteryOrFeature: '100W SuperVOOC',
    featureIcon: 'bolt',
    warranty: '6M Phoneo Cover',
    inspectionNote: 'Genuine 100W Charger • Official Bill',
    price: 31000,
    originalPrice: 56999,
    discountPercent: 46,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.8 km',
    rating: 4.8,
    storage: '128 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB6T9_oxYOmWL6o6SOSHxZKJzcaPbINYAXhMHBeYUlnxiJ1NnMcewpO9i64lSsbVjSqUalCzgngQSErmLMex9CRbmakm9oZzWqrp2-om4rjfn1MYmIkr0otrY7jK0sAa27o_05WMpfHJxT60gafenFUMe_RyH2VCnOdTssRkr7j-Pm3B4hJ8Im9eiL4E1QOukVNEifLo7kMUBIP_WeH_fpEkZExNH90yPYo5tC3lqXF9yvxP28bH57x',
  },
  {
    id: 'prod-4',
    name: 'Pixel 8 Pro 128GB',
    brand: 'Google Pixel',
    categoryTag: 'Google Tensor G3',
    specs: 'Bay Blue • Google Tensor G3 • Bill & Box',
    grade: 'Mint Grade',
    batteryOrFeature: 'Pixel AI Camera',
    featureIcon: 'camera',
    warranty: '6M Phoneo Cover',
    inspectionNote: 'All Parts Original • Invoice Ready',
    price: 52499,
    originalPrice: 106999,
    discountPercent: 51,
    storeName: 'Mahalaxmi Telecom',
    storeArea: 'Civic Centre',
    city: 'Bhilai',
    distance: '3.1 km',
    rating: 4.8,
    storage: '128 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8r1qB-CMangDl9m-vanliGYS5csMFLyuE5hpGTAtzKjnz3vHL7a-VGH-sEGQwRkpFBv-U1D0_CdrD7fD4l4AEU26pophFfCH37rvVVarP9mZdMpOkn6sqx_viq98eMCpSkhNZKse3ndvS_Ye97BFNL-7lDtnTPN5zNUoSrjy9F_L8us1uvVFn1W5ZZQ0qr-6VPatFSqNqigoTCAkVRvLpFyrbrcav_-hLpayZINiqMhyB1TkjUCxG',
  },
  {
    id: 'prod-5',
    name: 'OnePlus Nord CE 3 (8/128)',
    brand: 'OnePlus',
    categoryTag: 'Mid-Range Value',
    specs: 'Pastel Lime • Under Brand Warranty',
    grade: 'Grade A+',
    batteryOrFeature: '80W Fast Charge',
    featureIcon: 'bolt',
    warranty: '7-Day Replacement',
    inspectionNote: 'Genuine Charger • 7-Day Replacement',
    price: 14499,
    originalPrice: 24999,
    discountPercent: 42,
    storeName: 'Shree Balaji Telecom',
    storeArea: 'Telibandha',
    city: 'Raipur',
    distance: '2.0 km',
    rating: 4.9,
    storage: '128 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtWIy7LL0iVfDMg_RcNbzzLlomm2vVOvDAvQ7wnVpPSz-J1aSRkfTeFRMeTaWjTWPK4-77FWpH1bcy2x6t0ZKiCPUM1fEJEti8WrNafi1R11B7fT-0zO9FcYl_fKpiQJ_k5XAEFq2JAelDZrx755-XUrU4jhwwINvQ2b5Go2N2mD6BeSHPuTWNkUBXrarXRWBTbK5Hmc0VdoRaQBtM4a-sCsxU6xxuqxt1RF_65MW9HcwSFqAVhPMc',
  },
  {
    id: 'prod-6',
    name: 'Galaxy S23 5G (128 GB)',
    brand: 'Samsung',
    categoryTag: 'Samsung Flagship',
    specs: 'Lavender • 10/10 Condition • Box Pack',
    grade: 'Grade A+',
    batteryOrFeature: 'Battery 96%',
    featureIcon: 'battery_charging_full',
    warranty: '6M Warranty',
    inspectionNote: 'All Parts Original • Invoice Ready',
    price: 39500,
    originalPrice: 74999,
    discountPercent: 47,
    storeName: 'Gadget Zone',
    storeArea: 'Shankar Nagar',
    city: 'Raipur',
    distance: '2.5 km',
    rating: 4.7,
    storage: '128 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzC9AfYcZXegC2-M31nRsehMPOadynIMbZ2Z1gHhMbVG8AV1q5CV0AGCQe6W7qd-4nnUpdD0OFfNbw_DZnsuDb8CJsKUbgZ-q89_cOW25tED5sAg1x2YxHlveQLKoRGFk9tApB4qxYDpWYEO9AML1agPyR2063XrR5_FdzsQo201uGM3nh_MO9ErcIQr6k3fiEFn7t6kXDTMIu_3yZ26cZlLH4BvCL0kx4smL8yNXvV6PMiSWB531B',
  },
  {
    id: 'prod-7',
    name: 'Vivo X90 Pro 256GB',
    brand: 'Vivo',
    categoryTag: 'Vivo Photography Hub',
    specs: 'Legendary Black • 12GB RAM • Full Box Pack',
    grade: 'Like New',
    batteryOrFeature: '1" Zeiss Optics',
    featureIcon: 'lens',
    warranty: '6M Phoneo Cover',
    inspectionNote: '6M Warranty • Like New',
    price: 36500,
    originalPrice: 84999,
    discountPercent: 57,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.8 km',
    rating: 4.9,
    storage: '256 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCBJWJZstcEVXwkleaftXITq1gC98u4WbjOQSQh7Ki2lkRgcjBlVqhhEb9Q7f-YawGnjS_jvgiW3VJFPs7fY8ncrijQVCh6X1yuqI3WZQoYiCoz790mWA8FNfbAb8lBpzqGpF-mvaaITre9p6GM16TFWIWodiJ8UBK85gLf-xAerL7YAzWdW0wJpww-3BdKt0bVEbmWNdzmvS3PhKhc7zxxKgGwPgO8gO0mHRmna4-TdGVSHa-onpZV',
  },
  {
    id: 'prod-8',
    name: 'iPhone 12 64GB',
    brand: 'Apple',
    categoryTag: 'Value Apple',
    specs: 'Pacific Blue • Battery 88% • Under Warranty',
    grade: 'Good Grade',
    batteryOrFeature: 'Battery 88%',
    featureIcon: 'battery_charging_full',
    warranty: 'Under Brand War.',
    inspectionNote: '32-Point Inspected • Original Box',
    price: 23499,
    originalPrice: 59900,
    discountPercent: 60,
    storeName: 'Sai Baba Electronics',
    storeArea: 'Station Rd',
    city: 'Durg',
    distance: '9.4 km',
    rating: 4.8,
    storage: '64 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_ZIyXxDop__FmSZCS06latf8eMQcC2AtD0IegetC89SxRMphNfUzadbLg__VdgTAmYzoo24rSbPkB1kh02lnHwOP3IvLo3wox9vVh2wUCLOTCXdagccOXr-M0K5wxCyNJEB4J55mqD-d9GB5vpjsyKl4mM_k_Co0JrfkWiLyc9V4zyQNtEzolsz3n4JC6ahLGOfeQgy86pcO-YLGG5KA7pCabge0tP90chPuMeP1UqQQQfYsCois5',
  },
  {
    id: 'prod-9',
    name: 'Google Pixel 7 128GB',
    brand: 'Google Pixel',
    categoryTag: 'Google Tensor G2',
    specs: 'Lemongrass • 8GB RAM • Scratchless',
    grade: 'Pristine',
    batteryOrFeature: 'Pixel Cinematic',
    featureIcon: 'camera',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Pt Passed • 6M Warranty',
    price: 28999,
    originalPrice: 59999,
    discountPercent: 52,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.8 km',
    rating: 4.9,
    storage: '128 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvlFMGMI07FQKleshbADsMS-bEJ5mWd1Jjoky-6-h2srCG5dPT6B_RP3liAbSOjhdzblU1xrpvrBV8b7QgK6-rUBdQX9dfUZP2uZ47wPPGIm6l0GflyQ9OErxW71DdGIU_JHEBkPWSDQbnAjg_qjW-Ct6ys_688t6DjoppgIkRkc0pwqdrmT9lKyTf2wcfjiYDAZK-RrKjKO1xnTN2vGEQyZHRFXY-3m_uaMInQCIoNagI8itPEXzU',
  },
  {
    id: 'prod-10',
    name: 'Xiaomi 13 Pro 256GB',
    brand: 'Xiaomi',
    categoryTag: 'Xiaomi Flagship',
    specs: 'Ceramic Black • 12GB RAM • Complete Kit',
    grade: 'Pristine',
    batteryOrFeature: 'Leica Master Lens',
    featureIcon: 'photo_camera',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Pt Passed • 120W HyperCharge',
    price: 39000,
    originalPrice: 79999,
    discountPercent: 51,
    storeName: 'Shree Balaji Mobile Hub',
    storeArea: 'Pandri',
    city: 'Raipur',
    distance: '1.8 km',
    rating: 4.9,
    storage: '256 GB',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFixHYBKy0njdQseMMc_hFRXKlYPg5wBnRa-ovimxZXxdNm1ufLVgc4y8JqbIbXq8ErSK6yVnJ9LuvYD2q1Tp9p_gGvFRoO6OF2lSUsmUYcxeN5PKVGef7ARnDT2HDo-g9w03_zGzwZwli4NR7Jdwmm_R1jfB3Bqmdz0_gscvXpTrcjpCokmCP2C0YmoxeX7VKtC7hNsfQou5IKF-ID7o4m4wE-29q9L2LyfJmeSONa8DYaQOt8XSk',
  },
  {
    id: 'prod-11',
    listingId: '77291',
    name: 'Realme GT 2 5G (128GB)',
    brand: 'Realme',
    categoryTag: 'Paper White Edition',
    specs: 'Paper White • Snapdragon 888 • 65W SuperDart',
    grade: 'Pristine',
    batteryOrFeature: '65W SuperDart • 50MP Sony',
    featureIcon: 'bolt',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Pt Passed • Original Bill & Box',
    price: 18999,
    originalPrice: 39999,
    discountPercent: 52,
    storeName: 'Central Electronics',
    storeArea: 'Station Rd',
    city: 'Durg',
    distance: '8.4 km',
    rating: 4.8,
    storage: '128 GB',
    ram: '8 GB',
    color: 'Paper White',
    image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'prod-12',
    listingId: '66104',
    name: 'Motorola Edge 40 Neo (128GB)',
    brand: 'Motorola',
    categoryTag: 'Curved pOLED 144Hz',
    specs: 'Caneel Bay • IP68 Water Proof • Dimensity 7030',
    grade: 'Mint Grade',
    batteryOrFeature: '144Hz pOLED • 68W Turbo',
    featureIcon: 'water_drop',
    warranty: '6M Phoneo Cover',
    inspectionNote: '32-Pt Passed • IP68 Intact',
    price: 17499,
    originalPrice: 27999,
    discountPercent: 37,
    storeName: 'Mahalaxmi Telecom',
    storeArea: 'Civic Centre',
    city: 'Bhilai',
    distance: '3.6 km',
    rating: 4.8,
    storage: '128 GB',
    ram: '8 GB',
    color: 'Caneel Bay',
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&auto=format&fit=crop&q=80',
  },
];

export interface InspectionCheckItem {
  name: string;
  category: 'Display & Touch' | 'Battery & Power' | 'Cameras' | 'Sensors & Security' | 'Motherboard' | 'Network';
  status: 'PASSED' | 'VERIFIED';
  details: string;
  icon: string;
}

export const VIVO_Y19_LISTING_DETAILS = {
  listingId: '88782',
  urlPath: '/store/Vivo/Y19/88782',
  fullUrl: 'https://phoneo.in/store/Vivo/Y19/88782',
  brand: 'Vivo',
  model: 'Y19',
  edition: 'Halo FullView FHD+ Triple Camera Edition',
  condition: 'Grade A+ (Phoneo Pristine Certified)',
  conditionScore: 9.2,
  price: 8499,
  mrp: 15990,
  savingsPercent: 47,
  savingsAmount: 7491,
  emiStarting: 799,
  availableColors: [
    { name: 'Magnetic Black', hex: '#1C202B', inStock: true },
    { name: 'Spring White', hex: '#F0F4F8', inStock: true },
  ],
  availableVariants: [
    { ram: '4 GB', storage: '64 GB', price: 8499, mrp: 15990, inStock: true },
    { ram: '6 GB', storage: '128 GB', price: 9499, mrp: 17990, inStock: true },
  ],
  gallery: [
    {
      title: 'Front View (6.53" FHD+ Halo Display)',
      url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Magnetic Black Curved Back',
      url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: '16MP AI Triple Camera Array',
      url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Physical In-Hand Inspection',
      url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80',
    },
  ],
  keySpecs: [
    { label: 'Display', value: '6.53" FHD+ (2340x1080) IPS Halo FullView', icon: 'smartphone' },
    { label: 'Battery', value: '5,000 mAh Massive • 18W Dual-Engine Fast Charge', icon: 'battery_charging_full' },
    { label: 'Cameras', value: '16MP Main + 8MP Wide + 2MP Macro / 16MP Selfie', icon: 'photo_camera' },
    { label: 'Processor', value: 'MediaTek Helio P65 Octa-Core (2.0 GHz)', icon: 'memory' },
    { label: 'Security', value: '0.2s Rear Fingerprint + AI Face Access', icon: 'fingerprint' },
    { label: 'SIM & Storage', value: 'Dual 4G VoLTE + Dedicated microSD slot (up to 256GB)', icon: 'sd_card' },
  ],
  inspectionChecks: [
    { name: 'Display & Touch Digitizer', category: 'Display & Touch', status: 'PASSED', details: 'Zero dead pixels, flawless multi-touch sampling across 10 finger points', icon: 'touch_app' },
    { name: '5000 mAh Battery Life Test', category: 'Battery & Power', status: 'PASSED', details: '92% real capacity retained, zero swelling, 18W charging verified', icon: 'battery_std' },
    { name: '16MP AI Triple Camera System', category: 'Cameras', status: 'PASSED', details: 'Main sensor autofocus sharp, wide angle lens distortion-free, flash active', icon: 'camera_alt' },
    { name: 'Biometric Fingerprint & Face Access', category: 'Sensors & Security', status: 'PASSED', details: 'Fingerprint unlock clocked at 0.22s, front infrared/RGB face scan active', icon: 'fingerprint' },
    { name: 'IMEI & Blacklist Scrutiny', category: 'Network', status: 'PASSED', details: 'Government CEIR clean verified, 0 active police complaints, 0 financial EMI locks', icon: 'verified_user' },
    { name: 'Motherboard & Liquid Damage Strip', category: 'Motherboard', status: 'PASSED', details: 'White moisture indicator intact, original factory thermal paste & shield', icon: 'memory' },
  ] as InspectionCheckItem[],
  verifiedStoresOfferingThisModel: [
    {
      storeId: 'store-balaji',
      storeName: 'Shree Balaji Mobile Hub',
      badge: 'Phoneo Gold Partner (Best Offer)',
      location: 'Shop 14, City Center Mall, Pandri, Raipur',
      distance: '1.2 km away',
      price: 8499,
      mrp: 15990,
      stockCount: '2 Units in Store',
      freebies: ['Free Tempered Glass Applied', 'Original 18W Vivo Charger in Box', '6-Month Warranty Card'],
      contactPhone: '+91 98765 43210',
    },
    {
      storeId: 'store-steel-city',
      storeName: 'Steel City Mobile Point',
      badge: 'GST Verified Partner',
      location: 'Block 8, Civic Centre Market, Bhilai',
      distance: '4.8 km away',
      price: 8650,
      mrp: 15990,
      stockCount: '1 Unit (Spring White)',
      freebies: ['Free TPU Bumper Case', '6-Month Warranty Card'],
      contactPhone: '+91 98765 43211',
    },
    {
      storeId: 'store-mahamaya',
      storeName: 'Mahamaya Cellular Hub',
      badge: 'GST Verified Partner',
      location: 'Near Railway Crossing, Station Rd, Durg',
      distance: '8.5 km away',
      price: 8599,
      mrp: 15990,
      stockCount: '1 Unit (Magnetic Black)',
      freebies: ['Original Box & Bill', '6-Month Warranty Card'],
      contactPhone: '+91 98765 43212',
    },
  ],
};

export const PARTNER_STORES: PartnerStore[] = [
  {
    id: 'store-balaji',
    name: 'Shree Balaji Mobile Hub',
    badge: 'Phoneo Gold Partner',
    gstin: '22AAAAA0000A1Z5',
    since: '2017',
    rating: 4.9,
    reviewsCount: 142,
    address: 'Shop 14, Ground Floor, City Center Mall, Pandri, Raipur, CG - 492004',
    shortArea: 'Shop 14, City Center Mall, Pandri, Raipur',
    city: 'Raipur',
    distance: '1.8 km',
    phonesSold: '350+',
    warrantyHub: '6M - 1Y',
    activeStock: 28,
    tradesCompleted: '1,240+ Trades Completed',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKQSUfFIvHD6JDe9cyGHJhcluNX1MPRQDCOrNEEWCgVgO_hq15ZvuvbMHMuMmOmT16N5lKKEfd7zwh6F0fr3WDcw7JX95NDyHsV50zLoOt1SgHpc9F3heE33oX8d-JD5PLzo9zoJvVZFmcFNU9VuXz25NK7BrYyoR1MRW3_bUaNVkaWXHS3ucAduF63tYwWuQctyoRejcJxdZ8jpJUTKaAvJg11BUCWqO4ZIv8WKQsEj2zuilYHTBn',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnmgLZXs2hM89JnQj-cn41wdL7OlwYobhCfsy0M8Lehu-g96OHK1Pv5SB_mjGo8ckO8OM4UUi7VUI7ljNWMUimALW-v4mufaff-ryyiAd_vO3PSRYs7nWgllRW9vMyJPapiTieQAhxmWpgn9YK7Re1M1H_WwyqsHdNugq7PBsplsk7uO2lOvo_N4ZoOvA9GmEjNnhcQS5XA5cpGqDRW1YITkzVK8MnfMbJTf4V9PV9Ary4xwsl8yE',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQ3JCeIMDImo5E8lerwgT4giHdQP-N4bY1FzYwqNHNbfVNPn-7Zba5SCC0DFBF06jIIGLGkA-H9uqa-Svr-NEGBv8fZinh7RiriV0DabXYT4Wy91-OByO-MTE2XVFsQt5iHCwWooywNTiDTo-e4tugH7M9Ncrm2s00DOv9lLCyq2UYN68QZEq-Sh8jUNPfTVYmEvQ-m_9E62d-i26dsMAzI3Y-OCaksNkRGcUrh0h0-lkKbfsfPKR',
    phone: '+919876543210',
  },
  {
    id: 'store-steel-city',
    name: 'Steel City Mobile Point',
    badge: 'GST Verified Partner',
    gstin: '22BBBBB1111B1Z2',
    since: '2019',
    rating: 4.8,
    reviewsCount: 194,
    address: 'Block 8, Civic Centre Market, Bhilai, CG - 490006',
    shortArea: 'Block 8, Civic Centre Market, Bhilai',
    city: 'Bhilai',
    distance: '4.2 km',
    phonesSold: '290+',
    warrantyHub: '6 Months',
    activeStock: 22,
    tradesCompleted: '890+ Trades Completed',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5U09-vyIOGTYV-9X4yyoBTQxWkoJkCKbYVxRfCLgoQYn0Dqaf2q15vZmERaDcxwljKy4l7mbkLR-o76HN0IBGzvHzloRe3qaThnh8htRRmfz4BAdkggQbUvy_afTCd_iDvoGEAXL6YmxKeKYvOnYGlRYlsgw5NtGt_rrXJfLNWoX1TmYSCY8G8newxOsJi2QMv8HGrLgOChYnHbUPOlSKtNiPH4pIUsBI_E5tWKerWENkvM7iusCm',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnmgLZXs2hM89JnQj-cn41wdL7OlwYobhCfsy0M8Lehu-g96OHK1Pv5SB_mjGo8ckO8OM4UUi7VUI7ljNWMUimALW-v4mufaff-ryyiAd_vO3PSRYs7nWgllRW9vMyJPapiTieQAhxmWpgn9YK7Re1M1H_WwyqsHdNugq7PBsplsk7uO2lOvo_N4ZoOvA9GmEjNnhcQS5XA5cpGqDRW1YITkzVK8MnfMbJTf4V9PV9Ary4xwsl8yE',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQ3JCeIMDImo5E8lerwgT4giHdQP-N4bY1FzYwqNHNbfVNPn-7Zba5SCC0DFBF06jIIGLGkA-H9uqa-Svr-NEGBv8fZinh7RiriV0DabXYT4Wy91-OByO-MTE2XVFsQt5iHCwWooywNTiDTo-e4tugH7M9Ncrm2s00DOv9lLCyq2UYN68QZEq-Sh8jUNPfTVYmEvQ-m_9E62d-i26dsMAzI3Y-OCaksNkRGcUrh0h0-lkKbfsfPKR',
    phone: '+919876543211',
  },
  {
    id: 'store-mahamaya',
    name: 'Mahamaya Cellular Hub',
    badge: 'GST Verified Partner',
    gstin: '22CCCCC2222C1Z9',
    since: '2018',
    rating: 4.9,
    reviewsCount: 148,
    address: 'Near Railway Crossing, Station Rd, Durg, CG - 491001',
    shortArea: 'Near Railway Crossing, Station Rd, Durg',
    city: 'Durg',
    distance: '8.5 km',
    phonesSold: '210+',
    warrantyHub: '6 Months',
    activeStock: 19,
    tradesCompleted: '610+ Trades Completed',
    coverImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCL65eXaEtBjQAG_tIft6-o_MW38NreSYyvDM0n57k35yCBxviMVvBn9H5tUOgg1u8EcaxXRRk8E3FRodJb63Eed3xmtpI0vzSPmLR3EsGyVpI8M_ECMtpQM7QI1w7CyZ8LcNHMBClU_WSgLQauEUS403kJI2uZz0ODtWUI3GebI5Pdmx7KJdtE2NqKBUjEGJE8ScJwc2JcuZwmckqkjCjaYx6OgTFMMQ8keHxNoJJjIZ2eLWCGWR1j',
    logoImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWnmgLZXs2hM89JnQj-cn41wdL7OlwYobhCfsy0M8Lehu-g96OHK1Pv5SB_mjGo8ckO8OM4UUi7VUI7ljNWMUimALW-v4mufaff-ryyiAd_vO3PSRYs7nWgllRW9vMyJPapiTieQAhxmWpgn9YK7Re1M1H_WwyqsHdNugq7PBsplsk7uO2lOvo_N4ZoOvA9GmEjNnhcQS5XA5cpGqDRW1YITkzVK8MnfMbJTf4V9PV9Ary4xwsl8yE',
    mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuArQ3JCeIMDImo5E8lerwgT4giHdQP-N4bY1FzYwqNHNbfVNPn-7Zba5SCC0DFBF06jIIGLGkA-H9uqa-Svr-NEGBv8fZinh7RiriV0DabXYT4Wy91-OByO-MTE2XVFsQt5iHCwWooywNTiDTo-e4tugH7M9Ncrm2s00DOv9lLCyq2UYN68QZEq-Sh8jUNPfTVYmEvQ-m_9E62d-i26dsMAzI3Y-OCaksNkRGcUrh0h0-lkKbfsfPKR',
    phone: '+919876543212',
  },
];

/** Contact numbers for every seller store that lists phones on Phoneo (E.164 format). */
export const STORE_CONTACTS: Record<string, string> = {
  'Shree Balaji Mobile Hub': '+919876543210',
  'Steel City Mobile Point': '+919876543211',
  'Mahamaya Cellular Hub': '+919876543212',
  'Mahalaxmi Telecom': '+919876543213',
  'Shree Balaji Telecom': '+919876543214',
  'Gadget Zone': '+919876543215',
  'Sai Baba Electronics': '+919876543216',
  'Central Electronics': '+919876543217',
};

/** Default Phoneo helpline used when a seller's number is unknown. */
export const PHONEO_HELPLINE = '+919876543210';

/** Resolve the seller's contact number for a listing. */
export const getSellerPhone = (product: Pick<ProductItem, 'storeName' | 'sellerPhone'>): string =>
  product.sellerPhone ||
  STORE_CONTACTS[product.storeName] ||
  PARTNER_STORES.find((s) => s.name === product.storeName)?.phone ||
  PHONEO_HELPLINE;

export const STORE_REVIEWS = [
  {
    id: 'rev-1',
    initials: 'AK',
    name: 'Aman Khemka',
    badge: 'Purchased iPhone 14 Pro',
    timeAgo: '3 days ago',
    rating: 5,
    comment:
      '"Bought an iPhone 14 Pro from Balaji Mobile. They checked all 32 parameters on their software screen right before handing it over. Battery was 92% real capacity. Completely transparent service."',
    avatarBg: 'bg-secondary-container text-on-secondary-container',
  },
  {
    id: 'rev-2',
    initials: 'PT',
    name: 'Pooja Tiwari',
    badge: 'Exchanged Device',
    timeAgo: '1 week ago',
    rating: 5,
    comment:
      '"Exchanged my old OnePlus 9RT for Samsung Galaxy S23 Ultra here. Walk-in diagnostic took only 8 minutes and I got ₹16,500 instant store discount. Super easy experience."',
    avatarBg: 'bg-primary-container text-on-primary-container',
  },
  {
    id: 'rev-3',
    initials: 'RS',
    name: 'Ritesh Shrivastava',
    badge: 'Purchased Pixel 7',
    timeAgo: '2 weeks ago',
    rating: 4.5,
    comment:
      '"GST bill provided with exact IMEI matching the box. Best local phone store in Pandri. Highly recommend Phoneo escrow pickup option where you only pay when satisfied at the counter."',
    avatarBg: 'bg-surface-container text-on-surface',
  },
];

export const FAQS = [
  {
    q: 'Buy & Sell Second-Hand Phones on Phoneo - Quick & Easy!',
    a: 'Looking to buy a certified pre-owned smartphone at the best price? Or want to sell your used phone for instant cash? Phoneo bridges individual mobile users with local, verified mobile retailers in Raipur, Bhilai, Durg, and Bilaspur. Every device listed goes through rigorous physical and diagnostics scrutiny.',
  },
  {
    q: "Sell Your Phone Easily with Phoneo's Free Auction Feature",
    a: 'When you create an auction on Phoneo, it is broadcasted live to over 50 registered mobile shops within your district. Retailers bid against each other during a fast 30-minute auction. You receive the absolute highest real-world cash value, paid via instant UPI or cash at your doorstep.',
  },
  {
    q: 'Exchange Offers & Easy EMI on Pre-Owned Flagships',
    a: 'Upgrade to iPhone 14 Pro, Samsung Galaxy S23 Ultra, or OnePlus flagships without paying upfront in full. Phoneo partner retail stores offer spot exchange adjustments for your old smartphone, complemented with zero-cost card and cardless EMI facilities.',
  },
  {
    q: 'Find Verified Sellers and Physical Stores in Your City',
    a: 'Unlike anonymous classified apps where meetups can be risky, all Phoneo seller shops are verified with permanent trade licenses, GST numbers, and physical shops you can visit. You receive genuine tax invoices, verified IMEI certificates, and store warranties.',
  },
];

export const VALUATION_PRICE_MATRIX: Record<
  string,
  Record<'flawless' | 'good' | 'fair', { range: string; baseMin: number; baseMax: number }>
> = {
  'ip15pro': {
    flawless: { range: '₹62,000 – ₹66,500', baseMin: 62000, baseMax: 66500 },
    good: { range: '₹56,000 – ₹60,500', baseMin: 56000, baseMax: 60500 },
    fair: { range: '₹48,000 – ₹52,000', baseMin: 48000, baseMax: 52000 },
  },
  'ip14': {
    flawless: { range: '₹39,000 – ₹42,500', baseMin: 39000, baseMax: 42500 },
    good: { range: '₹34,000 – ₹37,500', baseMin: 34000, baseMax: 37500 },
    fair: { range: '₹28,000 – ₹31,000', baseMin: 28000, baseMax: 31000 },
  },
  'ip13': {
    flawless: { range: '₹33,800 – ₹36,200', baseMin: 33800, baseMax: 36200 },
    good: { range: '₹31,500 – ₹34,200', baseMin: 31500, baseMax: 34200 },
    fair: { range: '₹26,500 – ₹29,000', baseMin: 26500, baseMax: 29000 },
  },
  's24ultra': {
    flawless: { range: '₹76,000 – ₹82,000', baseMin: 76000, baseMax: 82000 },
    good: { range: '₹70,000 – ₹74,500', baseMin: 70000, baseMax: 74500 },
    fair: { range: '₹60,000 – ₹64,000', baseMin: 60000, baseMax: 64000 },
  },
  's23': {
    flawless: { range: '₹54,000 – ₹58,500', baseMin: 54000, baseMax: 58500 },
    good: { range: '₹48,000 – ₹52,000', baseMin: 48000, baseMax: 52000 },
    fair: { range: '₹41,000 – ₹45,000', baseMin: 41000, baseMax: 45000 },
  },
  'op12': {
    flawless: { range: '₹43,000 – ₹46,500', baseMin: 43000, baseMax: 46500 },
    good: { range: '₹38,000 – ₹41,000', baseMin: 38000, baseMax: 41000 },
    fair: { range: '₹32,000 – ₹35,000', baseMin: 32000, baseMax: 35000 },
  },
  'op11': {
    flawless: { range: '₹29,500 – ₹32,800', baseMin: 29500, baseMax: 32800 },
    good: { range: '₹26,000 – ₹29,000', baseMin: 26000, baseMax: 29000 },
    fair: { range: '₹21,500 – ₹24,000', baseMin: 21500, baseMax: 24000 },
  },
};

export const PHONEO_LOGO_URL = '/phoneo-logo.png';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCE3RB6gpqrgiF7qj9sucqIF_hFzddtLWrVe6KX5x_YVfgIQhmGlFwEfmjdimg11A3-fqvFChB6TMCtJyuldQ2oddzSHmZWgpaVP54tvzAcky1GnSLpveiOYJx8_gX8SjzSngI4YPiaxuQTinoDbiZMxEw9YMeqVx4ZUyhGdFJwNZ8z8RCDOgl2xeDEqFXjhTcvBnLsU6n8oZE1zD_VDOsfgP4QSEhS15BXkrP2hfawiqMjjRDQDNnQ';

export function formatTimeLeft(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m >= 60) {
    const h = Math.floor(m / 60);
    const remM = m % 60;
    return `${String(h).padStart(2, '0')}h ${String(remM).padStart(2, '0')}m left`;
  }
  return `${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
}

export function formatRupee(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}
