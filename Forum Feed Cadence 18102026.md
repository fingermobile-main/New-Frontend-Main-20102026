Forum Feed Cadence, P2P Random Shuffling & KPI Leaderboard Integration
The feed cadence has been structured in 

ForumPage.tsx
 to match protocol requirements:

mermaid
flowchart TD
    Top["Mii™®©℠ Stories & UGC Bar (Permanent at Top)"] --> PostGroup1["First 9 Random Member UGC / Published Posts"]
    PostGroup1 --> Banner["Clickable Ads Banner: 'Check out the latest Photo Credits!' (Routes to /photocredits)"]
    Banner --> Publicitee["Publicitee®©℠ Sovereign Sponsored Card"]
    Publicitee --> PostGroup2["Next 5 Random Member UGC Forum Posts (Posts 10–14)"]
    PostGroup2 --> Shorts["FingerShorts®©℠ Vertical Reel (Slide-in Fullscreen & 10s P2P Shuffle)"]
    Shorts --> PostGroup3["Next 9 Random Member UGC Forum Posts (Posts 15–23)"]
    PostGroup3 --> Discover["Discover®©℠ AI Hub (Trending Topics & Demand Gen)"]
    Discover --> CanaryShop["Canary Ads Shopping Showcase"]
    CanaryShop --> Remaining["Remaining Community Feed Posts"]
Synchronized Components Created:


PhotoCreditsFeedBanner.tsx
:
Clickable banner placed after Post 9 that states: "Check out the latest Photo Credits!".
Direct link to /photocredits.
Displays real-time thumbnail previews of UGC that automatically rotate and shuffle every 10 seconds via the P2P Leaderboard & KPI Engine.


PubliciteeAdCard.tsx
:
Sovereign sponsored ad card placed alongside the PhotoCredits banner after Post 9.


FingerShortsSection.tsx
:
Interleaved after the next 5 posts (Post 14).
Features 10-second P2P auto-shuffling and slide-in full-screen view.


DiscoverFeedSection.tsx
:
Interleaved after the next 9 posts (Post 23).
Showcases trending topics, Mega-Hallmarks, and Canary Demand Gen cards.


P2PLeaderboardKpiEngine.ts
:
Central P2P Engine maintaining creator rankings, KPI scores, and AI quality ratings.
Updates randomly every 10 seconds to keep UI modules in sync with autonomous agent states.
3. FingerMobile Canary Ads Campaigns & Formats
The unified ad delivery engine is implemented in 

CanaryAdsManager.tsx
, adhering to all platform specifications:

Mandatory Exclusion Rule
IMPORTANT

Canary Ads are systematically suppressed and excluded on non-commercial pages: /about, /about-us, /legal, /terms, /privacy, /compliance, and platform policy screens.

Implemented Campaign Types & Formats
Search Ads: Keyword-targeted sponsored links for SERPs.
Display Ads: High-contrast banners and rich media units across feeds and pages.
Shopping Ads: Product cards showcasing images, prices, FIC discounts, and merchant store names directly in feeds.
Video Ads (12-Second UGC Pause Rule): Automated video playback manager that pauses any playing UGC (Mii, FingerShorts) after 12 seconds of watch time to deliver a non-intrusive FingerMobile Bumper Ad under 6 seconds, then resumes the user's content.
Demand Gen Ads: Visually rich lifestyle and discovery cards embedded in Discover®©℠.
Canary Ads Max (Canary Max): Automated multi-channel cross-surface campaign module.
App Ads: Mobile app installation cards with download and rating badges.
Local Services Ads (LSAs): Verified service provider badges with direct contact CTA.
Smart Campaigns: Automated goal-oriented modules for independent merchants.
In-Stream & Full-Screen Formats:
Skippable In-Stream: Skip button unlocks after 5 seconds.
Non-Skippable In-Stream: 15–30 second protocol video ads.
Bumper Ads: 6-second rapid brand messaging.
Interstitial Ads / App Open Ads: Full-screen overlay transitions.
Rewarded Video Ads: Full-screen experience granting protocol FIC tokens upon completion.
Anchor / Overlay Ads: Fixed high-contrast cards docked at the screen bottom with dismiss controls.


one more algorithm to fix: 

http://localhost:3000/forum
Forum page., 
Left Column Static, does ever not scroll with page.
Center Column: Scrollable, no load more, no end., just keeps loading more UGC, Wigdets and Ads
Right column: Static, does not scroll,  just keeps loading more Platform Wigdets and More Canary Ads.