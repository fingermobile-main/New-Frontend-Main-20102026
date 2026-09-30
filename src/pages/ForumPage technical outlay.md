# ForumPage Technical Outlay

## Overview
Technical specification and wireframe for the ForumPage component with dimensions, components, and layout details for redesign purposes.

## Overall Structure

### Page Layout
- **Total Height**: Full viewport height (100vh)
- **Total Width**: Responsive (max-width: 1280px centered)
- **Padding Top**: 32px (to accommodate header elements)
- **Padding Bottom**: 16px (for bottom navigation)

### Old Columns Layout (update as seen below)
- **Left Column**: 256px (16rem) - Hidden on mobile
- **Center Column**: Flexible (main content area)
- **Right Column**: 320px (20rem) - Hidden on screens < 1024px

### New Columns Layout
- **Left Column**: 256px (25rem) - Hidden on mobile
- **Center Column**: Flexible (50rem) (main content area)
- **Right Column**: 320px (25rem) - Hidden on screens < 1024px


## Header Components

### 1. HeaderBar
- **Position**: Fixed top
- **Height**: 64px (16 * 4)
- **Background**: `bg-crystalline-white-100` / `dark:bg-gray-800`
- **Border**: Bottom border 1px `border-gray-200` / `dark:border-gray-700`
- **Z-Index**: 50
- **Components**:
  - Brand/Logo: Left-aligned, 28px font-size
  - Global Search Bar: Centered, max-width 448px, 48px height input
  - User Profile & Quick Actions: Right-aligned with notification badges

### 2. MainNavigationTabBar
- **Position**: Fixed, top 18px below HeaderBar
- **Height**: 80px (20 * 4) - Taller to accommodate H2/H3 separation
- **Background**: `bg-crystalline-white-100` / `dark:bg-gray-800`
- **Border**: Bottom border 1px `border-gray-200` / `dark:border-gray-700`
- **Z-Index**: 40
- **Components**:
  - Menu Toggle: Left side, 40px x 40px button
  - **H2 Navigation Tabs**: "(Lush Pressies, Dancia-4tv, MarketPlace, BeatwaveNg", 20px font-size, bold, centered
  - **H3 Navigation Tabs**: "Trends, Camus, FingerWars" in row, 12px font-size, compact spacing
  - User Stats: Right side, follower count and star rating

## Content Area Components

### Left Column (Members Area, Utilities & Status), Mii, Groups, Blog, Hallmarks, Permanence, Gameon, PhotoCredits, Lendsqr (Load More)

"Settings"

- **Width**: 256px (16rem)
- **Visibility**: Hidden on mobile (md:block)
- **Sticky Offset**: Top 32px
- **Spacing**: Vertical 16px (space-y-4)

#### Old DateWeatherWidget
- **Background**: Gradient `from-blue-100 to-indigo-200` / `dark:from-gray-700 dark:to-gray-800`
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`


#### New Canary Ads Widget
- **Background**: Gradient `from-blue-100 to-indigo-200` / `dark:from-gray-700 dark:to-gray-800`
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`



#### ProfileCompletionCard
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`

#### AdvertisementCard
- **Background**: Gradient `from-purple-500 to-pink-500`
- **Padding**: 16px (p-4)
- **Text Color**: White
- **Rounded**: `rounded-lg`

### Center Column (Main Content Feed)

#### Feed Filter Tabs
- **Margin Bottom**: 16px (mb-4)
- **Spacing**: Horizontal 8px (space-x-2)
- **Scrollable**: Horizontal overflow enabled
- **Button Style**:
  - Active: `bg-orange-500 text-white rounded-full px-4 py-2`
  - Inactive: `bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-4 py-2`

#### Create New Post Box
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`
- **Input Field**:
  - Background: `bg-gray-100` / `dark:bg-gray-700`
  - Padding: `px-4 py-2`
  - Rounded: `rounded-full`
  - Focus: Ring `focus:ring-2 focus:ring-orange-500`
  - Text: `text-gray-900 dark:text-white`

#### Recent Stories Carousel
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`
- **Story Item Size**: 96px x 160px (w-24 h-40)
- **Spacing**: Horizontal 16px (space-x-4)
- **Overflow**: Horizontal scroll enabled

#### Chat Rooms Section
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Margin Bottom**: 16px (mb-4)
- **Rounded**: `rounded-lg`
- **Room Item Size**: 192px x (w-48)
- **Spacing**: Horizontal 16px (space-x-4)
- **Overflow**: Horizontal scroll enabled

#### Forum Posts
- **Spacing**: Vertical 16px (space-y-4)
- **Individual Post**:
  - Background: `bg-white` / `dark:bg-gray-800`
  - Shadow: Default shadow
  - Padding: 16px (p-4)
  - Rounded: `rounded-lg`
  - Author Avatar: 40px x 40px (w-10 h-10)
  - Author Name: `font-semibold text-gray-900 dark:text-white`
  - Post Content: `text-sm text-gray-700 dark:text-gray-300`
  - Interaction Buttons: 16px horizontal spacing (space-x-4)

### Right Column (Social Discovery & Sidebar Widgets)
- **Width**: 320px (20rem)
- **Visibility**: Hidden on screens < 1024px (lg:block)
- **Sticky Offset**: Top 32px
- **Spacing**: Vertical 16px (space-y-4)

#### User Groups Widget
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Rounded**: `rounded-lg`
- **Title**: `font-semibold text-gray-900 dark:text-white`


#### User Hallmarks Widget
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Rounded**: `rounded-lg`
- **Title**: `font-semibold text-gray-900 dark:text-white`


#### User Storefront Widget
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Rounded**: `rounded-lg`
- **Title**: `font-semibold text-gray-900 dark:text-white`


#### Suggested Groups Widget
- **Background**: `bg-white` / `dark:bg-gray-800`
- **Shadow**: Default shadow
- **Padding**: 16px (p-4)
- **Rounded**: `rounded-lg`

#### Ask Lumina Widget
- **Background**: Gradient `from-blue-500 to-indigo-600`
- **Padding**: 16px (p-4)
- **Text Color**: White
- **Rounded**: `rounded-lg`

## Fixed Position Elements

### Floating Action Button
- **Position**: Fixed bottom 16px, right 16px
- **Size**: Circular button with 48px diameter
- **Background**: `bg-orange-500`
- **Color**: White
- **Shadow**: Large shadow (`shadow-lg`)
- **Notification Badge**: Red badge on top-right of button

### Bottom Canary Ads Tab
- **Position**: Fixed bottom 0
- **Height**: 64px (16 * 4)
- **Background**: `bg-crystalline-white-100` / `dark:bg-gray-800`
- **Border**: Top border 1px `border-gray-200` / `dark:border-gray-700`
- **Z-Index**: 40
- **Content**: Centered text

### Bottom Canary Ads Tab
- **Position**: Fixed bottom 0
- **Height**: 64px (16 * 4)
- **Background**: `bg-crystalline-white-100` / `dark:bg-gray-800`
- **Border**: Top border 1px `border-gray-200` / `dark:border-gray-700`
- **Z-Index**: 40
- **Content**: Centered text

### Bottom Google Adsense Ads Tab
- **Position**: Fixed bottom 0
- **Height**: 64px (16 * 4)
- **Background**: `bg-crystalline-white-100` / `dark:bg-gray-800`
- **Border**: Top border 1px `border-gray-200` / `dark:border-gray-700`
- **Z-Index**: 40
- **Content**: Centered text

## Color Palette Reference
- **Primary Background**: `bg-crystalline-white-100` (hsl(240, 2%, 98%))
- **Secondary Background**: `bg-white` / `dark:bg-gray-800`
- **Text Primary**: `text-gray-900` / `dark:text-white`
- **Text Secondary**: `text-gray-700` / `dark:text-gray-300`
- **Text Tertiary**: `text-gray-600` / `dark:text-gray-400`
- **Accent Color**: `bg-orange-500` / `text-orange-500`
- **Notification**: `bg-red-500` / `text-red-500`

## Typography Reference
- **H2 Header**: 20px, bold (`text-xl font-bold`)
- **H3 Tabs**: 12px, medium weight (`text-xs font-medium`)
- **Section Titles**: 16px, medium (`font-semibold`)
- **Body Text**: 14px, regular (`text-sm` / `text-base`)
- **Small Text**: 12px (`text-xs`)

## Responsive Breakpoints
- **Mobile**: < 768px (md breakpoint)
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px (lg breakpoint)

## Key Interaction States
- Hover states for buttons: `hover:bg-gray-100` / `dark:hover:bg-gray-700`
- Active tab state: `text-blue-600 border-b-2 border-blue-600`
- Focus states: `focus:outline-none focus:ring-2 focus:ring-orange-500`