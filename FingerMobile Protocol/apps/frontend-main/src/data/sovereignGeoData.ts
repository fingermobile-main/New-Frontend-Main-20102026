/**
 * FINGERMOBILE PROTOCOL - UNIVERSAL SOVEREIGN GEOGRAPHIC & PERIMETER DEFENSE DATA
 *
 * Official Catalog of 7 Continents, 195 Recognized Sovereign Nations (193 UN + 2 Observers),
 * Sub-national Jurisdictions (States, Districts, LGAs), Platform Microservices, Curated ISPs,
 * and VPN/Proxy Threat Signatures.
 *
 * Copyright © 2026 FingerMobile Protocol™. All rights reserved.
 */

export interface ContinentItem {
  id: string;
  name: string;
  countriesCount: number;
  description: string;
}

export interface CountryItem {
  code: string;
  name: string;
  continentId: string;
  dialCode?: string;
}

export interface PlatformServiceItem {
  key: string;
  label: string;
  category: 'media_ugc' | 'commerce' | 'social_identity' | 'infrastructure';
  description: string;
  tier: 'core' | 'extended' | 'ecosystem';
}

export interface NetworkProviderItem {
  asn: string;
  name: string;
  country: string;
  subnets: string[];
  isSatellite?: boolean;
  category: 'mobile_isp' | 'fiber_broadband' | 'satellite' | 'transit_backbone';
  notes?: string;
}

export interface VpnProviderItem {
  id: string;
  name: string;
  category: 'commercial_vpn' | 'tor_node' | 'datacenter_proxy' | 'cloud_relay';
  sampleSubnets: string[];
}

// ==========================================
// 1. THE 7 CONTINENTS
// ==========================================
export const CONTINENTS_DATA: ContinentItem[] = [
  { id: 'africa', name: 'Africa', countriesCount: 54, description: '54 recognized sovereign nations spanning North, West, East, Central & Southern Africa' },
  { id: 'asia', name: 'Asia', countriesCount: 49, description: '49 recognized sovereign nations spanning East, South, Southeast, Central & West Asia' },
  { id: 'europe', name: 'Europe', countriesCount: 44, description: '44 recognized sovereign nations spanning Western, Eastern, Northern & Southern Europe' },
  { id: 'north_america', name: 'North America', countriesCount: 23, description: '23 sovereign nations spanning Canada, USA, Mexico, Central America & Caribbean' },
  { id: 'south_america', name: 'South America', countriesCount: 12, description: '12 sovereign nations spanning Andean, Southern Cone & Amazonian regions' },
  { id: 'oceania', name: 'Oceania', countriesCount: 14, description: '14 sovereign nations including Australia, New Zealand & Pacific Island nations' },
  { id: 'antarctica', name: 'Antarctica', countriesCount: 1, description: 'International scientific research stations, enclaves & polar bases' },
];

// ==========================================
// 2. 195 RECOGNIZED SOVEREIGN COUNTRIES BY CONTINENT
// ==========================================
export const COUNTRIES_BY_CONTINENT: Record<string, CountryItem[]> = {
  africa: [
    { code: 'DZ', name: 'Algeria', continentId: 'africa' },
    { code: 'AO', name: 'Angola', continentId: 'africa' },
    { code: 'BJ', name: 'Benin', continentId: 'africa' },
    { code: 'BW', name: 'Botswana', continentId: 'africa' },
    { code: 'BF', name: 'Burkina Faso', continentId: 'africa' },
    { code: 'BI', name: 'Burundi', continentId: 'africa' },
    { code: 'CV', name: 'Cabo Verde', continentId: 'africa' },
    { code: 'CM', name: 'Cameroon', continentId: 'africa' },
    { code: 'CF', name: 'Central African Republic', continentId: 'africa' },
    { code: 'TD', name: 'Chad', continentId: 'africa' },
    { code: 'KM', name: 'Comoros', continentId: 'africa' },
    { code: 'CD', name: 'Democratic Republic of the Congo', continentId: 'africa' },
    { code: 'CG', name: 'Republic of the Congo', continentId: 'africa' },
    { code: 'CI', name: "Côte d'Ivoire", continentId: 'africa' },
    { code: 'DJ', name: 'Djibouti', continentId: 'africa' },
    { code: 'EG', name: 'Egypt', continentId: 'africa' },
    { code: 'GQ', name: 'Equatorial Guinea', continentId: 'africa' },
    { code: 'ER', name: 'Eritrea', continentId: 'africa' },
    { code: 'SZ', name: 'Eswatini', continentId: 'africa' },
    { code: 'ET', name: 'Ethiopia', continentId: 'africa' },
    { code: 'GA', name: 'Gabon', continentId: 'africa' },
    { code: 'GM', name: 'Gambia', continentId: 'africa' },
    { code: 'GH', name: 'Ghana', continentId: 'africa' },
    { code: 'GN', name: 'Guinea', continentId: 'africa' },
    { code: 'GW', name: 'Guinea-Bissau', continentId: 'africa' },
    { code: 'KE', name: 'Kenya', continentId: 'africa' },
    { code: 'LS', name: 'Lesotho', continentId: 'africa' },
    { code: 'LR', name: 'Liberia', continentId: 'africa' },
    { code: 'LY', name: 'Libya', continentId: 'africa' },
    { code: 'MG', name: 'Madagascar', continentId: 'africa' },
    { code: 'MW', name: 'Malawi', continentId: 'africa' },
    { code: 'ML', name: 'Mali', continentId: 'africa' },
    { code: 'MR', name: 'Mauritania', continentId: 'africa' },
    { code: 'MU', name: 'Mauritius', continentId: 'africa' },
    { code: 'MA', name: 'Morocco', continentId: 'africa' },
    { code: 'MZ', name: 'Mozambique', continentId: 'africa' },
    { code: 'NA', name: 'Namibia', continentId: 'africa' },
    { code: 'NE', name: 'Niger', continentId: 'africa' },
    { code: 'NG', name: 'Nigeria', continentId: 'africa' },
    { code: 'RW', name: 'Rwanda', continentId: 'africa' },
    { code: 'ST', name: 'São Tomé and Príncipe', continentId: 'africa' },
    { code: 'SN', name: 'Senegal', continentId: 'africa' },
    { code: 'SC', name: 'Seychelles', continentId: 'africa' },
    { code: 'SL', name: 'Sierra Leone', continentId: 'africa' },
    { code: 'SO', name: 'Somalia', continentId: 'africa' },
    { code: 'ZA', name: 'South Africa', continentId: 'africa' },
    { code: 'SS', name: 'South Sudan', continentId: 'africa' },
    { code: 'SD', name: 'Sudan', continentId: 'africa' },
    { code: 'TZ', name: 'Tanzania', continentId: 'africa' },
    { code: 'TG', name: 'Togo', continentId: 'africa' },
    { code: 'TN', name: 'Tunisia', continentId: 'africa' },
    { code: 'UG', name: 'Uganda', continentId: 'africa' },
    { code: 'ZM', name: 'Zambia', continentId: 'africa' },
    { code: 'ZW', name: 'Zimbabwe', continentId: 'africa' },
  ],
  asia: [
    { code: 'AF', name: 'Afghanistan', continentId: 'asia' },
    { code: 'AM', name: 'Armenia', continentId: 'asia' },
    { code: 'AZ', name: 'Azerbaijan', continentId: 'asia' },
    { code: 'BH', name: 'Bahrain', continentId: 'asia' },
    { code: 'BD', name: 'Bangladesh', continentId: 'asia' },
    { code: 'BT', name: 'Bhutan', continentId: 'asia' },
    { code: 'BN', name: 'Brunei', continentId: 'asia' },
    { code: 'KH', name: 'Cambodia', continentId: 'asia' },
    { code: 'CN', name: 'China', continentId: 'asia' },
    { code: 'CY', name: 'Cyprus', continentId: 'asia' },
    { code: 'GE', name: 'Georgia', continentId: 'asia' },
    { code: 'IN', name: 'India', continentId: 'asia' },
    { code: 'ID', name: 'Indonesia', continentId: 'asia' },
    { code: 'IR', name: 'Iran', continentId: 'asia' },
    { code: 'IQ', name: 'Iraq', continentId: 'asia' },
    { code: 'IL', name: 'Israel', continentId: 'asia' },
    { code: 'JP', name: 'Japan', continentId: 'asia' },
    { code: 'JO', name: 'Jordan', continentId: 'asia' },
    { code: 'KZ', name: 'Kazakhstan', continentId: 'asia' },
    { code: 'KW', name: 'Kuwait', continentId: 'asia' },
    { code: 'KG', name: 'Kyrgyzstan', continentId: 'asia' },
    { code: 'LA', name: 'Laos', continentId: 'asia' },
    { code: 'LB', name: 'Lebanon', continentId: 'asia' },
    { code: 'MY', name: 'Malaysia', continentId: 'asia' },
    { code: 'MV', name: 'Maldives', continentId: 'asia' },
    { code: 'MN', name: 'Mongolia', continentId: 'asia' },
    { code: 'MM', name: 'Myanmar', continentId: 'asia' },
    { code: 'NP', name: 'Nepal', continentId: 'asia' },
    { code: 'KP', name: 'North Korea', continentId: 'asia' },
    { code: 'OM', name: 'Oman', continentId: 'asia' },
    { code: 'PK', name: 'Pakistan', continentId: 'asia' },
    { code: 'PS', name: 'State of Palestine (UN Observer)', continentId: 'asia' },
    { code: 'PH', name: 'Philippines', continentId: 'asia' },
    { code: 'QA', name: 'Qatar', continentId: 'asia' },
    { code: 'RU', name: 'Russia', continentId: 'asia' },
    { code: 'SA', name: 'Saudi Arabia', continentId: 'asia' },
    { code: 'SG', name: 'Singapore', continentId: 'asia' },
    { code: 'KR', name: 'South Korea', continentId: 'asia' },
    { code: 'LK', name: 'Sri Lanka', continentId: 'asia' },
    { code: 'SY', name: 'Syria', continentId: 'asia' },
    { code: 'TJ', name: 'Tajikistan', continentId: 'asia' },
    { code: 'TH', name: 'Thailand', continentId: 'asia' },
    { code: 'TL', name: 'Timor-Leste', continentId: 'asia' },
    { code: 'TR', name: 'Turkey', continentId: 'asia' },
    { code: 'TM', name: 'Turkmenistan', continentId: 'asia' },
    { code: 'AE', name: 'United Arab Emirates', continentId: 'asia' },
    { code: 'UZ', name: 'Uzbekistan', continentId: 'asia' },
    { code: 'VN', name: 'Vietnam', continentId: 'asia' },
    { code: 'YE', name: 'Yemen', continentId: 'asia' },
  ],
  europe: [
    { code: 'AL', name: 'Albania', continentId: 'europe' },
    { code: 'AD', name: 'Andorra', continentId: 'europe' },
    { code: 'AT', name: 'Austria', continentId: 'europe' },
    { code: 'BY', name: 'Belarus', continentId: 'europe' },
    { code: 'BE', name: 'Belgium', continentId: 'europe' },
    { code: 'BA', name: 'Bosnia and Herzegovina', continentId: 'europe' },
    { code: 'BG', name: 'Bulgaria', continentId: 'europe' },
    { code: 'HR', name: 'Croatia', continentId: 'europe' },
    { code: 'CZ', name: 'Czech Republic', continentId: 'europe' },
    { code: 'DK', name: 'Denmark', continentId: 'europe' },
    { code: 'EE', name: 'Estonia', continentId: 'europe' },
    { code: 'FI', name: 'Finland', continentId: 'europe' },
    { code: 'FR', name: 'France', continentId: 'europe' },
    { code: 'DE', name: 'Germany', continentId: 'europe' },
    { code: 'GR', name: 'Greece', continentId: 'europe' },
    { code: 'VA', name: 'Holy See (Vatican City - UN Observer)', continentId: 'europe' },
    { code: 'HU', name: 'Hungary', continentId: 'europe' },
    { code: 'IS', name: 'Iceland', continentId: 'europe' },
    { code: 'IE', name: 'Ireland', continentId: 'europe' },
    { code: 'IT', name: 'Italy', continentId: 'europe' },
    { code: 'LV', name: 'Latvia', continentId: 'europe' },
    { code: 'LI', name: 'Liechtenstein', continentId: 'europe' },
    { code: 'LT', name: 'Lithuania', continentId: 'europe' },
    { code: 'LU', name: 'Luxembourg', continentId: 'europe' },
    { code: 'MT', name: 'Malta', continentId: 'europe' },
    { code: 'MD', name: 'Moldova', continentId: 'europe' },
    { code: 'MC', name: 'Monaco', continentId: 'europe' },
    { code: 'ME', name: 'Montenegro', continentId: 'europe' },
    { code: 'NL', name: 'Netherlands', continentId: 'europe' },
    { code: 'MK', name: 'North Macedonia', continentId: 'europe' },
    { code: 'NO', name: 'Norway', continentId: 'europe' },
    { code: 'PL', name: 'Poland', continentId: 'europe' },
    { code: 'PT', name: 'Portugal', continentId: 'europe' },
    { code: 'RO', name: 'Romania', continentId: 'europe' },
    { code: 'SM', name: 'San Marino', continentId: 'europe' },
    { code: 'RS', name: 'Serbia', continentId: 'europe' },
    { code: 'SK', name: 'Slovakia', continentId: 'europe' },
    { code: 'SI', name: 'Slovenia', continentId: 'europe' },
    { code: 'ES', name: 'Spain', continentId: 'europe' },
    { code: 'SE', name: 'Sweden', continentId: 'europe' },
    { code: 'CH', name: 'Switzerland', continentId: 'europe' },
    { code: 'UA', name: 'Ukraine', continentId: 'europe' },
    { code: 'GB', name: 'United Kingdom', continentId: 'europe' },
  ],
  north_america: [
    { code: 'AG', name: 'Antigua and Barbuda', continentId: 'north_america' },
    { code: 'BS', name: 'Bahamas', continentId: 'north_america' },
    { code: 'BB', name: 'Barbados', continentId: 'north_america' },
    { code: 'BZ', name: 'Belize', continentId: 'north_america' },
    { code: 'CA', name: 'Canada', continentId: 'north_america' },
    { code: 'CR', name: 'Costa Rica', continentId: 'north_america' },
    { code: 'CU', name: 'Cuba', continentId: 'north_america' },
    { code: 'DM', name: 'Dominica', continentId: 'north_america' },
    { code: 'DO', name: 'Dominican Republic', continentId: 'north_america' },
    { code: 'SV', name: 'El Salvador', continentId: 'north_america' },
    { code: 'GD', name: 'Grenada', continentId: 'north_america' },
    { code: 'GT', name: 'Guatemala', continentId: 'north_america' },
    { code: 'HT', name: 'Haiti', continentId: 'north_america' },
    { code: 'HN', name: 'Honduras', continentId: 'north_america' },
    { code: 'JM', name: 'Jamaica', continentId: 'north_america' },
    { code: 'MX', name: 'Mexico', continentId: 'north_america' },
    { code: 'NI', name: 'Nicaragua', continentId: 'north_america' },
    { code: 'PA', name: 'Panama', continentId: 'north_america' },
    { code: 'KN', name: 'Saint Kitts and Nevis', continentId: 'north_america' },
    { code: 'LC', name: 'Saint Lucia', continentId: 'north_america' },
    { code: 'VC', name: 'Saint Vincent and the Grenadines', continentId: 'north_america' },
    { code: 'TT', name: 'Trinidad and Tobago', continentId: 'north_america' },
    { code: 'US', name: 'United States of America', continentId: 'north_america' },
  ],
  south_america: [
    { code: 'AR', name: 'Argentina', continentId: 'south_america' },
    { code: 'BO', name: 'Bolivia', continentId: 'south_america' },
    { code: 'BR', name: 'Brazil', continentId: 'south_america' },
    { code: 'CL', name: 'Chile', continentId: 'south_america' },
    { code: 'CO', name: 'Colombia', continentId: 'south_america' },
    { code: 'EC', name: 'Ecuador', continentId: 'south_america' },
    { code: 'GY', name: 'Guyana', continentId: 'south_america' },
    { code: 'PY', name: 'Paraguay', continentId: 'south_america' },
    { code: 'PE', name: 'Peru', continentId: 'south_america' },
    { code: 'SR', name: 'Suriname', continentId: 'south_america' },
    { code: 'UY', name: 'Uruguay', continentId: 'south_america' },
    { code: 'VE', name: 'Venezuela', continentId: 'south_america' },
  ],
  oceania: [
    { code: 'AU', name: 'Australia', continentId: 'oceania' },
    { code: 'FJ', name: 'Fiji', continentId: 'oceania' },
    { code: 'KI', name: 'Kiribati', continentId: 'oceania' },
    { code: 'MH', name: 'Marshall Islands', continentId: 'oceania' },
    { code: 'FM', name: 'Micronesia', continentId: 'oceania' },
    { code: 'NR', name: 'Nauru', continentId: 'oceania' },
    { code: 'NZ', name: 'New Zealand', continentId: 'oceania' },
    { code: 'PW', name: 'Palau', continentId: 'oceania' },
    { code: 'PG', name: 'Papua New Guinea', continentId: 'oceania' },
    { code: 'WS', name: 'Samoa', continentId: 'oceania' },
    { code: 'SB', name: 'Solomon Islands', continentId: 'oceania' },
    { code: 'TO', name: 'Tonga', continentId: 'oceania' },
    { code: 'TV', name: 'Tuvalu', continentId: 'oceania' },
    { code: 'VU', name: 'Vanuatu', continentId: 'oceania' },
  ],
  antarctica: [
    { code: 'AQ', name: 'Antarctica (Research Stations & Global Enclaves)', continentId: 'antarctica' }
  ]
};

// Flattened list of all 195 sovereign nations
export const ALL_SOVEREIGN_COUNTRIES: CountryItem[] = Object.values(COUNTRIES_BY_CONTINENT).flat();

// ==========================================
// 3. SUB-NATIONAL JURISDICTIONS (NIGERIAN STATES & COMMERCIAL LGAs)
// ==========================================
export const NIGERIAN_STATES_AND_LGAS: Record<string, string[]> = {
  'Lagos': ['Eti-Osa (Victoria Island / Lekki / Ikoyi)', 'Ikeja (Alausa / Capital)', 'Lagos Island', 'Surulere', 'Alimosho', 'Ikorodu', 'Apapa', 'Yaba / Mainland', 'Oshodi-Isolo', 'Kosofe'],
  'Abuja (FCT)': ['Abuja Municipal (Garki / Wuse / Maitama / Asokoro)', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'],
  'Rivers': ['Port Harcourt City', 'Obio-Akpor', 'Eleme', 'Bonny', 'Oyigbo', 'Ikwerre'],
  'Kano': ['Kano Municipal', 'Dala', 'Nassarawa', 'Gwale', 'Fagge', 'Tarauni'],
  'Oyo': ['Ibadan North', 'Ibadan South-West', 'Ibadan North-West', 'Oyo West', 'Ogbomosho North'],
  'Edo': ['Oredo (Benin City)', 'Ikpoba-Okha', 'Egor', 'Ovia North-East'],
  'Delta': ['Warri South', 'Uvwie', 'Oshimili South (Asaba)', 'Ughelli North'],
  'Anambra': ['Awka South', 'Onitsha North', 'Onitsha South', 'Nnewi North'],
  'Kaduna': ['Kaduna North', 'Kaduna South', 'Chikun', 'Zaria'],
  'Enugu': ['Enugu North', 'Enugu South', 'Enugu East', 'Nsukka'],
  'Ogun': ['Abeokuta South', 'Ado-Odo/Ota', 'Sagamu', 'Ijebu Ode'],
  'Akwa Ibom': ['Uyo', 'Ikot Ekpene', 'Eket', 'Oron']
};

// ==========================================
// 4. PLATFORM MICROSERVICES CATALOG (25 SERVICES)
// ==========================================
export const PLATFORM_ALL_SERVICES: PlatformServiceItem[] = [
  // Media & UGC
  { key: 'dancia4tv', label: 'Dancia-4Tv', category: 'media_ugc', tier: 'core', description: 'VoD, OTT streaming, film curation & broadcast media distribution' },
  { key: 'beatwaveng', label: 'BeatwaveNG', category: 'media_ugc', tier: 'core', description: 'Music streaming, audio distribution & regional sound charts' },
  { key: 'forum', label: 'Forum & Communities', category: 'media_ugc', tier: 'core', description: 'Public discussions, threads, member post categorization & moderation' },
  { key: 'blogs', label: 'Blogs & Publications', category: 'media_ugc', tier: 'core', description: 'Editorial publishing, author articles & long-form stories' },
  { key: 'tribut', label: 'Tribut Design Pins', category: 'media_ugc', tier: 'core', description: 'Creative design boards, media pins & curated UGC portfolios' },
  { key: 'groups', label: 'Groups & Hubs', category: 'media_ugc', tier: 'extended', description: 'Interest groups, closed cohorts & enterprise guilds' },
  { key: 'mii', label: 'Mii Personal Space', category: 'media_ugc', tier: 'extended', description: 'Member personal hubs, creator portfolios & timeline feeds' },
  { key: 'media_ingestion', label: 'Media Upload Engine', category: 'media_ugc', tier: 'core', description: 'Multi-part video/image ingestion, transcoding & S3 storage' },

  // Commerce & Monetization
  { key: 'marketplace', label: 'MarketPlace', category: 'commerce', tier: 'core', description: 'General merchandise, digital assets & e-commerce checkout' },
  { key: 'fingerlux', label: 'FingerLux', category: 'commerce', tier: 'core', description: 'High-value curated luxury items, certified watches & auctions' },
  { key: 'storefront', label: 'Storefront', category: 'commerce', tier: 'core', description: 'Merchant storefronts, catalog inventory & product sales' },
  { key: 'ownit', label: 'OwnIt', category: 'commerce', tier: 'extended', description: 'P2P asset ownership, fractional leasing & rental agreements' },
  { key: 'flamingo', label: 'Flamingo Travel', category: 'commerce', tier: 'extended', description: 'Global hospitality, flight bookings & regional experiences' },
  { key: 'lushpressies', label: 'LushPressies', category: 'commerce', tier: 'extended', description: 'Celebratory gifting, virtual greeting cards & surprise registries' },
  { key: 'gems', label: 'Gems & Collectibles', category: 'commerce', tier: 'extended', description: 'Digital collectibles, minting & reward allocations' },
  { key: 'canary_ads', label: 'Canary Ads System', category: 'commerce', tier: 'extended', description: 'Sponsored advertiser campaigns, impressions & bidding rails' },

  // Social & Identity
  { key: 'camus', label: 'Camus Secure Enclave', category: 'social_identity', tier: 'core', description: 'End-to-end encrypted messaging, channels & sovereign enclaves' },
  { key: 'hallmarks', label: 'Hallmarks Sovereign Badges', category: 'social_identity', tier: 'extended', description: 'Verified credentials, honorary titles & achievement badges' },
  { key: 'supervi', label: 'SuperVi & FingerWars', category: 'social_identity', tier: 'extended', description: 'Live interactive gaming challenges, head-to-head duels & rankings' },
  { key: 'sugarcrush', label: 'SugarCrush Gaming', category: 'social_identity', tier: 'extended', description: 'Casual puzzle gaming, daily quests & leaderboard tokens' },
  { key: 'identity_auth', label: 'Identity & Biometric Enclave', category: 'social_identity', tier: 'core', description: 'KYC Tier verification, biometric face authentication & sessions' },

  // Infrastructure & Financial Rails
  { key: 'financials', label: 'FIAT Settlement Rails', category: 'infrastructure', tier: 'core', description: 'CBN compliant payout gateways (NIBSS, Paystack, Flutterwave)' },
  { key: 'fic_treasury', label: 'Sovereign Treasury (FIC)', category: 'infrastructure', tier: 'core', description: 'FIC minting, liquidity reserves & 1 FIC = ₦100 parity audit' },
  { key: 'voicelines', label: 'VoiceLine Pipecat Audio Engine', category: 'infrastructure', tier: 'extended', description: '104-item African VoiceLine commentary rotation & speech synthesis' },
  { key: 'webhooks_api', label: 'External APIs & Webhooks', category: 'infrastructure', tier: 'core', description: 'Third-party developer webhooks, REST APIs & partner integrations' },
];

// ==========================================
// 5. CURATED INTERNET SERVICE PROVIDERS & TELECOM OPERATORS
// ==========================================
export const CURATED_NETWORK_PROVIDERS: NetworkProviderItem[] = [
  {
    asn: 'AS327714',
    name: 'MTN Nigeria (Cellular & Enterprise Fiber)',
    country: 'Nigeria',
    category: 'mobile_isp',
    subnets: ['197.210.0.0/16', '102.89.0.0/16', '105.112.0.0/15', '41.220.68.0/22'],
    notes: 'Dominant regional mobile operator (>40% market share)'
  },
  {
    asn: 'AS36873',
    name: 'Airtel Nigeria (Bharti Airtel)',
    country: 'Nigeria',
    category: 'mobile_isp',
    subnets: ['105.112.0.0/16', '197.211.0.0/16', '154.113.0.0/16'],
    notes: 'Major national mobile voice & broadband provider'
  },
  {
    asn: 'AS37148',
    name: 'Globacom / Glo Mobile Nigeria',
    country: 'Nigeria',
    category: 'mobile_isp',
    subnets: ['197.210.64.0/18', '41.203.64.0/18', '197.211.64.0/18'],
    notes: 'National submarine cable & wireless operator'
  },
  {
    asn: 'AS36980',
    name: '9mobile (EMTS Telecoms)',
    country: 'Nigeria',
    category: 'mobile_isp',
    subnets: ['197.210.128.0/18', '41.223.16.0/20'],
    notes: 'National wireless network carrier'
  },
  {
    asn: 'AS37497',
    name: 'Spectranet 4G LTE Broadband',
    country: 'Nigeria',
    category: 'fiber_broadband',
    subnets: ['102.67.0.0/16', '41.222.0.0/17'],
    notes: 'High-density urban fixed-wireless & residential fiber'
  },
  {
    asn: 'AS37107',
    name: 'Smile Communications Nigeria',
    country: 'Nigeria',
    category: 'fiber_broadband',
    subnets: ['41.190.0.0/16', '154.120.0.0/16'],
    notes: '4G LTE mobile broadband operator'
  },
  {
    asn: 'AS36935',
    name: 'IPNX Nigeria Fiber-to-the-Home',
    country: 'Nigeria',
    category: 'fiber_broadband',
    subnets: ['41.220.64.0/19', '197.255.192.0/19'],
    notes: 'Enterprise and residential optical fiber'
  },
  {
    asn: 'AS37282',
    name: 'MainOne Cable Company (Equinix)',
    country: 'Nigeria',
    category: 'transit_backbone',
    subnets: ['197.211.32.0/19', '102.130.128.0/19'],
    notes: 'West African submarine fiber & data center transit'
  },
  {
    asn: 'AS14593',
    name: 'Starlink / SpaceX Satellite Constellation',
    country: 'Global / Regional',
    category: 'satellite',
    isSatellite: true,
    subnets: ['98.97.0.0/16', '206.214.224.0/19', '144.24.0.0/16'],
    notes: 'Low Earth Orbit (LEO) satellite provider. Collateral damage risk: misallocated regional IP ground stations.'
  },
  {
    asn: 'AS36937',
    name: 'Vodacom Group (Southern & East Africa)',
    country: 'South Africa',
    category: 'mobile_isp',
    subnets: ['196.207.0.0/16', '41.1.0.0/16'],
    notes: 'Major African multinational telco'
  },
  {
    asn: 'AS36926',
    name: 'Safaricom (M-Pesa / Kenya)',
    country: 'Kenya',
    category: 'mobile_isp',
    subnets: ['197.248.0.0/16', '102.68.0.0/16'],
    notes: 'East African telecommunications carrier'
  },
];

// ==========================================
// 6. KNOWN VPN, TOR & PROXY PROVIDERS
// ==========================================
export const KNOWN_VPN_PROVIDERS: VpnProviderItem[] = [
  { id: 'nordvpn', name: 'NordVPN Commercial Egress Nodes', category: 'commercial_vpn', sampleSubnets: ['185.220.100.0/22', '194.35.233.0/24'] },
  { id: 'expressvpn', name: 'ExpressVPN Anonymous Gateways', category: 'commercial_vpn', sampleSubnets: ['185.193.125.0/24', '149.248.0.0/18'] },
  { id: 'surfshark', name: 'Surfshark / Wireguard Gateways', category: 'commercial_vpn', sampleSubnets: ['194.26.29.0/24', '185.242.6.0/24'] },
  { id: 'protonvpn', name: 'ProtonVPN Secure Core Relays', category: 'commercial_vpn', sampleSubnets: ['185.159.157.0/24', '185.159.158.0/24'] },
  { id: 'cloudflare_warp', name: 'Cloudflare WARP (1.1.1.1 / MASQUE Proxy)', category: 'commercial_vpn', sampleSubnets: ['104.28.0.0/16', '162.158.0.0/15'] },
  { id: 'tor_exit', name: 'The Onion Router (Tor) Exit Nodes', category: 'tor_node', sampleSubnets: ['185.220.101.0/24', '171.25.193.0/24'] },
  { id: 'aws_datacenter', name: 'AWS Cloud EC2 Anonymous Egress (Proxies)', category: 'datacenter_proxy', sampleSubnets: ['3.0.0.0/9', '52.0.0.0/10'] },
  { id: 'digitalocean', name: 'DigitalOcean Droplets / VPN Hosting Nodes', category: 'datacenter_proxy', sampleSubnets: ['138.68.0.0/16', '142.93.0.0/16'] },
  { id: 'hetzner', name: 'Hetzner Online Anonymous Cloud Relays', category: 'datacenter_proxy', sampleSubnets: ['168.119.0.0/16', '135.181.0.0/16'] }
];
