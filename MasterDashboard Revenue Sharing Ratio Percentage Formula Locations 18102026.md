### B. Master Dashboard: Revenue Sharing Ratio, Percentage & Formula Locations
The revenue sharing formulas and commission models are managed across 4 unified locations:
1. **Master Financials Console (`/dashboard/master?tab=financials`)**:
   - **Sub-Tab 6**: [Economic & Algorithmic Rules](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/MasterFinancialsConsole.tsx#L2198-L2395)
     - **Commercial Sales Split**: `60% Seller` • `20% Marketplace Fees` • `10% User Rewards` • `10% Platform Maintenance`.
     - **Ecosystem Liquidity Split**: `20% Creator Incentive` • `20% Node Royalty` • `20% Treasury Grant` • `20% System Comp` • `20% Market Liquidity`.
     - **Deflationary Burn Engine**: 10% Mandatory Token Burn automatically deducted on every product sale, subscription, reward, and system fee.
2. **Enterprise Financial Ecosystem Console (`/dashboard/master?tab=financials` -> Sub-Tab 1)**:
   - [EnterpriseFinancialEcosystemConsole.tsx](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/EnterpriseFinancialEcosystemConsole.tsx):
     - Displays live Storefront GMV Gross Commission (10%), Treasury Allocations, and live heartbeats.
3. **Subscription Models Console (`/dashboard/master?tab=subscriptions`)**:
   - [SubscriptionModelsConsole.tsx](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/frontend-main/src/components/dashboard/SubscriptionModelsConsole.tsx):
     - Manages Platform Subscription Tiers and Ad Revenue Sharing (`70/30 split`).
4. **PostgreSQL Database (`commission_rules` table)**:
   - File: [commission_schema.sql](file:///Users/user/Documents/FingerMobile%20Protocol%20Communication/FingerMobile%20Protocol/apps/backend/database/commission_schema.sql)
   - Columns: `commission_type`, `platform_percentage`, `creator_percentage` with constraint `chk_percentages` (`platform + creator = 100%`).
   - Default Rules:
     - `marketplace_sale`: 10.00% Platform / 90.00% Creator
     - `subscription`: 15.00% Platform / 85.00% Creator
     - `tip`: 5.00% Platform / 95.00% Creator
     - `challenge_reward`: 10.00% Platform / 90.00% Creator
     - `referral`: 20.00% Platform / 80.00% Creator

     Master Financials Console (/dashboard/master?tab=financials):
Sub-Tab 6: 
Economic & Algorithmic Rules
Commercial Sales Split: 60% Seller • 20% Marketplace Fees • 10% User Rewards • 10% Platform Maintenance.
Ecosystem Liquidity Split: 20% Creator Incentive • 20% Node Royalty • 20% Treasury Grant • 20% System Comp • 20% Market Liquidity.
Deflationary Burn Engine: 10% Mandatory Token Burn automatically deducted on every product sale, subscription, reward, and system fee.
Enterprise Financial Ecosystem Console (/dashboard/master?tab=financials -> Sub-Tab 1):
EnterpriseFinancialEcosystemConsole.tsx
:
Displays live Storefront GMV Gross Commission (10%), Treasury Allocations, and live heartbeats.
Subscription Models Console (/dashboard/master?tab=subscriptions):
SubscriptionModelsConsole.tsx
:
Manages Platform Subscription Tiers and Ad Revenue Sharing (70/30 split).
PostgreSQL Database (commission_rules table):
File: 
commission_schema.sql
Columns: commission_type, platform_percentage, creator_percentage with constraint chk_percentages (platform + creator = 100%).
Default Rules:
marketplace_sale: 10.00% Platform / 90.00% Creator
subscription: 15.00% Platform / 85.00% Creator
tip: 5.00% Platform / 95.00% Creator
challenge_reward: 10.00% Platform / 90.00% Creator
referral: 20.00% Platform / 80.00% Creator
