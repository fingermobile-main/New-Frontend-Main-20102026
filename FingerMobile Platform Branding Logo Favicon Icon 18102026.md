Platform Branding, Logo, Favicon & Icon Placements Complete
All official branding assets have been harvested, standardized, and placed across the platform database schemas, SQL master seeds, navigation menus, widget cards, and page hero headers.

1. PhotoCredits Authentic Assets Verified & Integrated
From 

Assets/PhotoCredits Fav Icon Logo
:

High-Res Icon (512x512 & 192x192): Copied to apps/frontend-main/public/assets/logos/photocredits_icon.png and photocredits_icon_192.png.
Apple Touch Icon: Copied to apps/frontend-main/public/assets/logos/photocredits_apple_touch_icon.png.
Favicon (.ico): Copied to apps/frontend-main/public/photocredits-favicon.ico and apps/frontend-main/public/assets/logos/photocredits_favicon.ico.
Full Banner Logo: Located at apps/frontend-main/public/assets/logos/photocredits_logo.png.
Active Placements:


PhotoCreditsPage.tsx
 (Hero title badge, balance card, and header).


PhotoCreditWidget.tsx
 (Replaced generic Lucide camera SVG with the official icon).


BusinessOfficesPage.tsx
 (Ecosystem grid card).


DrawerMenuContainer.tsx
 (Direct navigation item icon).
2. Complete 10-Brand Unified Ecosystem Matrix
#	Brand Platform	Route Path	Official Logo Asset	Icon Asset	Favicon Asset
1	PhotoCredits	/photocredits	photocredits_logo.png	photocredits_icon.png	photocredits-favicon.ico
2	Dancia-4Tv	/dancia-4tv	dancia4tv_logo.png	dancia4tv_logo.png	dancia-favicon.ico
3	BeatwaveNG	/beatwave-ng	beatwaveng_logo.png	beatwaveng_logo.png	beatwave-favicon.ico
4	MarketPlace	/marketplace	marketplace_logo.png	marketplace_icon.png	marketplace-favicon.ico
5	FingerLux	/fingerlux	fingerlux_logo.jpg	fingerlux_icon.png	fingerlux-favicon.ico
6	Finger Infinite Coin	/fic-vault	fic_logo.png	fic_logo.png	fic-favicon.ico
7	SuperVi	/games/supervi	supervi_logo.png	supervi_logo.png	supervi-favicon.ico
8	Flamingo	/flamingo	flamingo_logo.jpg	flamingo_icon.png	flamingo-favicon.ico
9	LushPressies	/lush-pressies	lushpressies_logo.png	lushpressies_logo.png	lushpressies-favicon.ico
10	tribut	/tribut	tribut_logo.webp	tribut_icon.png	tribut-favicon.ico
(Also seeded: FingerMobile Protocol Core (fingermobile_logo.webp) & ORMUS Security Enclave (ormus_logo.png)).

3. Database Schemas & Master Seeds Updated


platform_logos_schema.sql
: Upgraded schema with columns (name, alt_text, logo_url, icon_url, route_path, category, description, platform_key, display_order, is_active) and performance indexes on platform_key, is_active, display_order, and category.


seed_platform_logos.sql
: Idempotent ON CONFLICT (platform_key) DO UPDATE seed populating all 10 ecosystem brands + FingerMobile Core and ORMUS with authentic paths and descriptions.


01-schema-and-seed.sql
: Ingested complete platform_logos table definition and 12-item seed into the master multi-tenant bootstrap database script.


10_platform_branding_ecosystem.sql
: Dedicated standalone migration script ready for deployment execution.
4. Frontend Components & Navigation Placements


ecosystemBranding.ts
: Central registry of truth for brand metadata, routes, badge styles, and asset links.


PlatformBrandLogo.tsx
: Reusable component with automatic fallback handling, sizes, badges, and accessible labels.


drawerMenuConfig.ts
 & 

DrawerMenuContainer.tsx
: All 10 ecosystem brands now display their official logo thumbnails directly in the drawer sidebar navigation.
Hero & Landing Pages Updated with Authentic Logos:


BeatwaveNGPage.tsx
 (Sidebar brand header with beatwaveng_logo.png).


Dancia4TvHeader.tsx
 (Header icon replaced with dancia4tv_logo.png).


LushPressiesPage.tsx
 (Brand hero banner with lushpressies_logo.png).


MarketplacePage.tsx
 (Flagship hero banner with marketplace_icon.png).


FlamingoPage.tsx
 (Runway hero banner with flamingo_icon.png).


TributPage.tsx
 (Smart feed hero banner with tribut_icon.png).


FicVaultPage.tsx
 (Sleeper vault header with fic_logo.png).


SuperViPage.tsx
 (Gaming arena hero with supervi_logo.png).


FingerLuxHeader.tsx
 (Concierge header with fingerlux_icon.png).


BusinessOfficesPage.tsx
 (All 10 brands in unified grid with live routes).
