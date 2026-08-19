import 'package:fingermobile_app/models/page_category.dart';

class PageNavigationService {
  static List<PageCategory> getPageCategories() {
    return [
      PageCategory(
        id: 'community',
        name: 'Community',
        icon: 'forum',
        subCategories: [
          SubCategory(
            id: 'forum',
            name: 'Forum',
            route: '/forum',
            description: 'Main community discussion platform',
          ),
          SubCategory(
            id: 'hallmark',
            name: 'Hallmark',
            route: '/hallmark',
            description: 'Special recognition and achievements',
          ),
          SubCategory(
            id: 'gems',
            name: 'Gems',
            route: '/gems',
            description: 'Premium content and features',
          ),
          SubCategory(
            id: 'blogs',
            name: 'Blogs',
            route: '/blogs',
            description: 'Member blog posts and articles',
          ),
          SubCategory(
            id: 'groups',
            name: 'Groups',
            route: '/groups',
            description: 'Community interest groups',
          ),
        ],
      ),
      PageCategory(
        id: 'entertainment',
        name: 'Entertainment',
        icon: 'music_note',
        subCategories: [
          SubCategory(
            id: 'beatwavedemo',
            name: 'Beatwave Demo',
            route: '/beatwave-demo',
            description: 'Music streaming demo',
          ),
          SubCategory(
            id: 'fingerlux',
            name: 'FingerLux',
            route: '/fingerlux',
            description: 'Premium entertainment content',
          ),
          SubCategory(
            id: 'fingerwars',
            name: 'FingerWars',
            route: '/fingerwars',
            description: 'Gaming platform',
          ),
          SubCategory(
            id: 'dancia4tv',
            name: 'Dancia 4Tv',
            route: '/dancia4tv',
            description: 'Video streaming service',
          ),
        ],
      ),
      PageCategory(
        id: 'marketplace',
        name: 'Marketplace',
        icon: 'store',
        subCategories: [
          SubCategory(
            id: 'flamingo',
            name: 'Flamingo Marketplace',
            route: '/flamingo',
            description: 'Buy and sell goods',
          ),
          SubCategory(
            id: 'lushpressies',
            name: 'Lush Pressies',
            route: '/lush-pressies',
            description: 'Gift and product marketplace',
          ),
          SubCategory(
            id: 'my_storefront',
            name: 'My Storefront',
            route: '/my-storefront',
            description: 'Manage your own store',
          ),
        ],
      ),
      PageCategory(
        id: 'education',
        name: 'Education',
        icon: 'school',
        subCategories: [
          SubCategory(
            id: 'elearning',
            name: 'E-Learning',
            route: '/elearning',
            description: 'Online learning platform',
          ),
          SubCategory(
            id: 'nysc',
            name: 'NYSC',
            route: '/nysc',
            description: 'National Youth Service Corps resources',
          ),
          SubCategory(
            id: 'elib',
            name: 'E-Library',
            route: '/elib',
            description: 'Digital library resources',
          ),
        ],
      ),
      PageCategory(
        id: 'business',
        name: 'Business',
        icon: 'business',
        subCategories: [
          SubCategory(
            id: 'financials',
            name: 'Financials',
            route: '/financials',
            description: 'Financial management tools',
          ),
          SubCategory(
            id: 'monetization',
            name: 'Monetization',
            route: '/monetization',
            description: 'Revenue generation tools',
          ),
          SubCategory(
            id: 'wallet',
            name: 'Wallet & Pay',
            route: '/wallet',
            description: 'Digital wallet and payments',
          ),
        ],
      ),
      PageCategory(
        id: 'creative',
        name: 'Creative Studio',
        icon: 'palette',
        subCategories: [
          SubCategory(
            id: 'editor_studio',
            name: 'Editor Studio',
            route: '/editor-studio',
            description: 'Content creation tools',
          ),
          SubCategory(
            id: 'ai_playlist',
            name: 'AI Playlist',
            route: '/ai-playlist',
            description: 'AI-powered playlist creation',
          ),
          SubCategory(
            id: 'media_library',
            name: 'Media Library',
            route: '/media-library',
            description: 'Media asset management',
          ),
        ],
      ),
    ];
  }

  // Map page IDs to actual URLs
  static String getPageUrl(String pageId) {
    const baseUrl = 'https://fingermobile.com'; // This would be your actual domain
    
    switch (pageId) {
      case 'forum':
        return '$baseUrl/forum';
      case 'hallmark':
        return '$baseUrl/hallmark';
      case 'gems':
        return '$baseUrl/gems';
      case 'blogs':
        return '$baseUrl/blogs';
      case 'groups':
        return '$baseUrl/groups';
      case 'beatwavedemo':
        return '$baseUrl/beatwave-demo';
      case 'fingerlux':
        return '$baseUrl/fingerlux';
      case 'fingerwars':
        return '$baseUrl/fingerwars';
      case 'dancia4tv':
        return '$baseUrl/dancia4tv';
      case 'flamingo':
        return '$baseUrl/flamingo';
      case 'lushpressies':
        return '$baseUrl/lush-pressies';
      case 'my_storefront':
        return '$baseUrl/my-storefront';
      case 'elearning':
        return '$baseUrl/elearning';
      case 'nysc':
        return '$baseUrl/nysc';
      case 'elib':
        return '$baseUrl/elib';
      case 'financials':
        return '$baseUrl/financials';
      case 'monetization':
        return '$baseUrl/monetization';
      case 'wallet':
        return '$baseUrl/wallet';
      case 'editor_studio':
        return '$baseUrl/editor-studio';
      case 'ai_playlist':
        return '$baseUrl/ai-playlist';
      case 'media_library':
        return '$baseUrl/media-library';
      default:
        return baseUrl;
    }
  }
}