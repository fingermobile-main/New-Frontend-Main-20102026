const { randomBytes } = require('crypto');
const db = require('../db');
const logger = require('../utils/logger');

const field = (name, type = 'text', required = false) => ({ name, type, required });

const DOMAINS = {
  branding: {
    label: 'Branding & Ecosystem Assets',
    entities: {
      platform_logos: {
        label: 'Platform Logos & Brand Assets',
        table: 'platform_logos',
        search: ['name', 'alt_text', 'category', 'description', 'platform_key'],
        fields: [
          field('name', 'text', true),
          field('platform_key', 'text', true),
          field('category', 'text'),
          field('route_path', 'text'),
          field('logo_url', 'text', true),
          field('icon_url', 'text'),
          field('alt_text', 'text'),
          field('description', 'textarea'),
          field('display_order', 'number'),
          field('is_active', 'boolean')
        ],
        lifecycle: {
          columns: {
            is_active: { active: true, suspended: false, frozen: false, archived: false }
          }
        }
      }
    }
  },
  forum: {
    label: 'Forum',
    entities: {
      forums: {
        label: 'Forums',
        table: 'forums',
        search: ['name', 'description', 'category'],
        fields: [field('name', 'text', true), field('description', 'textarea'), field('category_id'), field('category'), field('creator_id', 'text', true)],
        lifecycle: { columns: { moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      categories: {
        label: 'Categories',
        table: 'forum_categories',
        search: ['name', 'slug', 'description'],
        fields: [field('name', 'text', true), field('slug'), field('description', 'textarea'), field('icon'), field('display_order', 'number')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      threads: {
        label: 'Threads',
        table: 'forum_threads',
        search: ['title', 'content'],
        fields: [field('title', 'text', true), field('content', 'textarea', true), field('category_id'), field('author_id', 'text', true), field('tags', 'json'), field('is_pinned', 'boolean'), field('is_sticky', 'boolean')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      posts: {
        label: 'Posts',
        table: 'forum_posts',
        search: ['title', 'content'],
        fields: [field('title'), field('content', 'textarea', true), field('thread_id'), field('forum_id'), field('author_id'), field('tags', 'json'), field('is_pinned', 'boolean')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  tribut: {
    label: 'Tribut',
    entities: {
      posts: {
        label: 'Portfolio posts',
        table: 'tribut_posts',
        search: ['title', 'caption', 'category'],
        fields: [field('user_id', 'text', true), field('title', 'text', true), field('caption', 'textarea'), field('image_url', 'text', true), field('thumbnail_url'), field('video_url'), field('category'), field('tags', 'json'), field('media_type'), field('multi_media_urls', 'json'), field('board_name'), field('is_pinned_to_tribut', 'boolean')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      uploads: {
        label: 'Media uploads',
        table: 'tribut_media_uploads',
        search: ['file_name', 'original_name', 'file_url', 'status'],
        fields: [field('user_id', 'text', true), field('file_name', 'text', true), field('original_name', 'text', true), field('file_path', 'text', true), field('file_url', 'text', true), field('mime_type'), field('media_type'), field('file_size_bytes', 'number'), field('metadata', 'json')],
        lifecycle: { columns: { status: { active: 'uploaded', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      boards: {
        label: 'Project boards',
        table: 'tribut_project_boards',
        search: ['title', 'description'],
        fields: [field('user_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('cover_image'), field('privacy')],
        lifecycle: { columns: { moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  lushpressies: {
    label: 'LushPressies',
    entities: {
      posts: {
        label: 'Posts',
        table: 'lushpressies_posts',
        search: ['title', 'content', 'category'],
        fields: [field('author_id', 'text', true), field('title'), field('content', 'textarea', true), field('category'), field('media_url'), field('tags', 'array'), field('is_pin_protected', 'boolean')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, is_published: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      matches: {
        label: 'Member matches',
        table: 'lushpressies_matches',
        search: ['user_id', 'matched_user_id', 'status', 'last_message'],
        fields: [field('user_id', 'text', true), field('matched_user_id', 'text', true), field('compatibility_score', 'number'), field('last_message', 'textarea'), field('pin_exchanged', 'boolean')],
        lifecycle: { columns: { status: { active: 'matched', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  gems: {
    label: 'Gems',
    entities: {
      items: {
        label: 'Gem catalog items',
        table: 'gem_items',
        search: ['title', 'description', 'category'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('category'), field('price', 'number', true), field('rating', 'number'), field('image_url'), field('creator'), field('privacy_type')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      }
    }
  },
  hallmarks: {
    label: 'Hallmarks',
    entities: {
      communities: {
        label: 'Hallmark communities',
        table: 'hallmarks',
        search: ['name', 'description', 'category'],
        fields: [field('creator_id', 'number'), field('name', 'text', true), field('slug'), field('description', 'textarea'), field('tier'), field('category'), field('rarity'), field('criteria', 'json'), field('icon_url'), field('banner_url'), field('website_url')],
        lifecycle: {
          columns: {
            status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'deleted' },
            is_suspended: { active: false, suspended: true, frozen: false, archived: false },
            is_frozen: { active: false, suspended: false, frozen: true, archived: false }
          }
        }
      }
    }
  },
  mii: {
    label: 'Mii',
    entities: {
      statuses: {
        label: 'Statuses',
        table: 'mii_statuses',
        search: ['author_id', 'audience_type'],
        fields: [field('author_id', 'text', true), field('audience_type'), field('allowed_contact_ids', 'array'), field('excluded_contact_ids', 'array'), field('expires_at', 'datetime')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } },
        automation: { expiryColumn: 'expires_at', defaultHours: 48 }
      },
      channels: {
        label: 'Channels',
        table: 'mii_channels',
        search: ['name', 'description', 'creator_id'],
        fields: [field('creator_id', 'text', true), field('name', 'text', true), field('description', 'textarea'), field('avatar_url')],
        lifecycle: { columns: { moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      products: {
        label: 'MiniStore products',
        table: 'mii_ministore_products',
        search: ['title', 'description', 'seller_id'],
        fields: [field('seller_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('price_fic', 'number'), field('price_gems', 'number'), field('catalog_page', 'number'), field('media_urls', 'array')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  blogs: {
    label: 'Blogs',
    entities: {
      blogs: {
        label: 'Blogs',
        table: 'blogs',
        search: ['name', 'slug', 'description'],
        fields: [field('owner_id', 'text', true), field('name', 'text', true), field('slug', 'text', true), field('description', 'textarea'), field('tagline'), field('logo_url'), field('cover_image_url'), field('theme'), field('is_public', 'boolean'), field('allow_comments', 'boolean'), field('moderation_enabled', 'boolean')],
        lifecycle: { columns: { moderation_enabled: { active: false, suspended: true, frozen: true, archived: true }, is_public: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      posts: {
        label: 'Posts',
        table: 'blog_posts',
        search: ['title', 'excerpt', 'content', 'slug'],
        fields: [field('blog_id', 'text', true), field('author_id', 'text', true), field('category_id'), field('title', 'text', true), field('slug', 'text', true), field('excerpt', 'textarea'), field('content', 'textarea', true), field('featured_image_url'), field('meta_keywords', 'array'), field('scheduled_for', 'datetime'), field('allow_comments', 'boolean'), field('is_featured', 'boolean'), field('is_pinned', 'boolean')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'draft', frozen: 'draft', archived: 'archived' } } }
      },
      comments: {
        label: 'Comments',
        table: 'blog_comments',
        search: ['content'],
        fields: [field('post_id', 'text', true), field('author_id', 'text', true), field('parent_id'), field('content', 'textarea', true)],
        lifecycle: { columns: { status: { active: 'approved', suspended: 'rejected', frozen: 'spam', archived: 'deleted' } } }
      }
    }
  },
  groups: {
    label: 'Groups',
    entities: {
      groups: {
        label: 'Groups',
        table: 'groups',
        search: ['name', 'description', 'category'],
        fields: [field('creator_id', 'text', true), field('name', 'text', true), field('description', 'textarea'), field('category'), field('privacy_level'), field('is_public', 'boolean'), field('banner_url'), field('avatar_url')],
        lifecycle: { columns: { moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  fingershorts: {
    label: 'FingerShorts',
    entities: {
      sessions: {
        label: 'Sessions',
        table: 'fingershorts_sessions',
        search: ['author_id', 'title'],
        fields: [field('author_id', 'text', true), field('title'), field('expires_at', 'datetime')],
        lifecycle: { columns: { is_published: { active: true, suspended: false, frozen: false, archived: false } } },
        automation: { expiryColumn: 'expires_at', defaultHours: 48 }
      },
      sounds: {
        label: 'Sounds',
        table: 'fingershorts_sounds',
        search: ['title', 'artist', 'creator_id'],
        fields: [field('title', 'text', true), field('artist', 'text', true), field('audio_url', 'text', true), field('duration_seconds', 'number', true), field('creator_id')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      }
    }
  },
  trends: {
    label: 'Trends',
    entities: {
      topics: {
        label: 'Topics',
        table: 'trends',
        search: ['trend_name', 'title', 'description', 'category'],
        fields: [field('trend_name', 'text', true), field('title'), field('trend_description', 'textarea'), field('description', 'textarea'), field('trend_category'), field('category'), field('trend_subcategory'), field('trend_type'), field('content_type'), field('content_id'), field('creator_id'), field('tags', 'json'), field('location', 'json')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false }, status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  photocredits: {
    label: 'PhotoCredits',
    entities: {
      photos: {
        label: 'Photos',
        table: 'photocredits_photos',
        search: ['title', 'description', 'category', 'location_name'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('uploader_id', 'text', true), field('image_url', 'text', true), field('thumbnail_url'), field('high_res_url'), field('video_url'), field('category'), field('tags', 'json'), field('license_type'), field('usage_rights', 'textarea'), field('cost', 'number'), field('is_downloadable', 'boolean'), field('is_free', 'boolean'), field('allow_commercial_use', 'boolean'), field('allow_modifications', 'boolean'), field('featured', 'boolean')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, is_public: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      collections: {
        label: 'Collections',
        table: 'photocredits_collections',
        search: ['name', 'description'],
        fields: [field('name', 'text', true), field('description', 'textarea'), field('creator_id', 'text', true), field('photo_ids', 'json'), field('cover_photo_id')],
        lifecycle: { columns: { moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, is_public: { active: true, suspended: false, frozen: false, archived: false } } }
      }
    }
  },
  discovery: {
    label: 'Discovery',
    entities: {
      content: {
        label: 'Discoverable content',
        table: 'content',
        search: ['title', 'content', 'excerpt', 'category'],
        fields: [field('author_id'), field('title', 'text', true), field('content', 'textarea', true), field('body', 'textarea'), field('excerpt', 'textarea'), field('content_type'), field('category'), field('media_url'), field('media_urls', 'json'), field('thumbnail_url'), field('tags', 'array'), field('is_featured', 'boolean'), field('featured_at', 'datetime')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      recommendations: {
        label: 'Recommendations',
        table: 'member_discovery_recommendations',
        search: ['name', 'handle', 'role'],
        fields: [field('id', 'text', true), field('user_id', 'text', true), field('target_user_id', 'text', true), field('name', 'text', true), field('handle', 'text', true), field('role'), field('avatar'), field('mutual_connections_count', 'number'), field('mutual_connection_name'), field('relevance_score', 'number')],
        lifecycle: { columns: { is_dismissed: { active: false, suspended: true, frozen: true, archived: true }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      }
    }
  },
  permanence: {
    label: 'Permanence',
    entities: {
      challenges: {
        label: 'Challenges',
        table: 'challenges',
        search: ['title', 'description', 'challenge_type'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('category_id', 'number'), field('challenge_type'), field('creator_id', 'text', true), field('stake_amount', 'number'), field('duration'), field('mechanics', 'array'), field('rules', 'textarea')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } }
      },
      streams: {
        label: 'Streams',
        table: 'streaming_sessions',
        search: ['title', 'stream_category', 'stream_type'],
        fields: [field('title', 'text', true), field('creator_id', 'text', true), field('stream_category'), field('stream_type'), field('description', 'textarea'), field('thumbnail_url'), field('tags', 'array'), field('privacy_level')],
        lifecycle: { columns: { status: { active: 'created', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, is_active: { active: false, suspended: false, frozen: false, archived: false }, is_live: { active: false, suspended: false, frozen: false, archived: false } } }
      }
    }
  },
  marketplace: {
    label: 'Marketplace',
    entities: {
      flagship_products: {
        label: 'Flagship products',
        table: 'marketplace_products',
        search: ['name', 'tagline', 'description', 'category', 'sku'],
        fields: [
          field('name', 'text', true), field('tagline'), field('description', 'textarea'),
          field('price', 'number', true), field('price_fic', 'number', true), field('currency'),
          field('category'), field('sku'), field('images', 'array'), field('stock_quantity', 'number'),
          field('is_flagship', 'boolean'), field('is_active', 'boolean'),
          field('specifications', 'json'), field('likes', 'number'), field('dislikes', 'number'),
          field('rating', 'number'), field('reviews_count', 'number'), field('poll_data', 'json')
        ],
        lifecycle: {
          columns: {
            status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' },
            is_active: { active: true, suspended: false, frozen: false, archived: false }
          }
        }
      },
      listings: {
        label: 'Listings',
        table: 'marketplace_listings',
        search: ['title', 'slug', 'description', 'category', 'subcategory'],
        fields: [
          field('seller_id', 'text', true), field('title', 'text', true), field('slug', 'text', true),
          field('type', 'text', true), field('description', 'textarea'), field('category'),
          field('subcategory'), field('tags', 'array'), field('price', 'number', true),
          field('currency'), field('discount_price', 'number'), field('inventory_count', 'number'),
          field('thumbnail_url'), field('media_urls', 'array'), field('demo_url'),
          field('delivery_method'), field('delivery_instructions', 'textarea'),
          field('status'), field('is_featured', 'boolean'), field('is_verified', 'boolean'),
          field('settings', 'json'), field('metadata', 'json')
        ],
        lifecycle: { columns: { status: { active: 'active', suspended: 'paused', frozen: 'paused', archived: 'archived' } } }
      },
      orders: {
        label: 'Orders',
        table: 'marketplace_orders',
        search: ['member_id', 'seller_id', 'status', 'currency'],
        fields: [field('member_id', 'text', true), field('seller_id'), field('total_amount', 'number', true), field('currency'), field('status')],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      reviews: {
        label: 'Reviews',
        table: 'marketplace_reviews',
        search: ['title', 'comment', 'pros', 'cons'],
        fields: [
          field('listing_id', 'text', true), field('buyer_id', 'text', true),
          field('transaction_id'), field('rating', 'number', true), field('title'),
          field('comment', 'textarea'), field('pros', 'textarea'), field('cons', 'textarea'),
          field('is_verified_purchase', 'boolean'), field('helpful_count', 'number'), field('status')
        ],
        lifecycle: { columns: { status: { active: 'published', suspended: 'hidden', frozen: 'hidden', archived: 'deleted' } } }
      },
      transactions: {
        label: 'Transactions (read only)',
        table: 'marketplace_transactions',
        search: ['buyer_id', 'seller_id', 'status', 'delivery_status', 'payment_intent_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      }
    }
  },
  storefront: {
    label: 'Storefront',
    entities: {
      stores: {
        label: 'Stores',
        table: 'storefronts',
        search: ['name', 'slug', 'owner_id', 'business_type', 'country'],
        fields: [
          field('owner_id', 'text', true), field('name', 'text', true), field('slug', 'text', true),
          field('description', 'textarea'), field('tagline'), field('logo_url'), field('banner_url'),
          field('theme_colors', 'json'), field('email'), field('phone'), field('website_url'),
          field('social_links', 'json'), field('address', 'json'), field('city'), field('state'),
          field('country'), field('postal_code'), field('business_type'), field('currency'),
          field('timezone'), field('language'), field('is_verified', 'boolean'),
          field('verification_badge'), field('analytics_enabled', 'boolean'), field('rating', 'number'),
          field('follower_count', 'number'), field('product_count', 'number'), field('subscription_tier')
        ],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      products: {
        label: 'Products',
        table: 'storefront_products',
        search: ['name', 'slug', 'sku', 'category', 'vendor'],
        fields: [
          field('storefront_id', 'text', true), field('name', 'text', true), field('slug', 'text', true),
          field('description', 'textarea'), field('short_description'), field('price', 'number', true),
          field('compare_at_price', 'number'), field('cost_per_item', 'number'), field('currency'), field('goods_type'),
          field('sku'), field('barcode'), field('track_inventory', 'boolean'),
          field('allow_backorder', 'boolean'), field('category'), field('tags', 'array'), field('vendor'),
          field('images', 'json'), field('video_urls', 'json'), field('has_variants', 'boolean'),
          field('variant_options', 'json'), field('seo_title'), field('seo_description', 'textarea'),
          field('visibility'), field('weight_kg', 'number'), field('dimensions_cm', 'json'),
          field('requires_shipping', 'boolean'), field('status')
        ],
        lifecycle: { columns: { status: { active: 'active', suspended: 'draft', frozen: 'draft', archived: 'archived' }, visibility: { active: 'visible', suspended: 'hidden', frozen: 'hidden', archived: 'hidden' } } }
      },
      orders: {
        label: 'Orders (read only)',
        table: 'storefront_orders',
        search: ['customer_name', 'product_name', 'status', 'tracking_number'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      shipments: {
        label: 'Shipments',
        table: 'storefront_shipments',
        search: ['tracking_number', 'carrier', 'status', 'destination'],
        fields: [
          field('order_id', 'text', true), field('storefront_id', 'text', true),
          field('tracking_number', 'text', true), field('carrier', 'text', true),
          field('status'), field('origin'), field('destination'),
          field('current_location', 'json'), field('estimated_arrival', 'datetime'),
          field('status_updates', 'array')
        ],
        lifecycle: { columns: { status: { active: 'processing', suspended: 'on-hold', frozen: 'on-hold', archived: 'cancelled' } } }
      },
      inventory: {
        label: 'Inventory',
        table: 'storefront_inventory',
        search: ['warehouse_location', 'bin_location', 'status'],
        fields: [
          field('product_id', 'text', true), field('variant_id'), field('quantity', 'number'),
          field('reserved_quantity', 'number'), field('warehouse_location'), field('bin_location'),
          field('reorder_point', 'number'), field('reorder_quantity', 'number'),
          field('supplier_id'), field('unit_cost', 'number'), field('total_value', 'number'),
          field('status'), field('last_restocked_date', 'datetime'), field('next_restock_date', 'datetime')
        ],
        lifecycle: { columns: { status: { active: 'in_stock', suspended: 'discontinued', frozen: 'out_of_stock', archived: 'discontinued' } } }
      }
    }
  },
  flamingo: {
    label: 'Flamingo',
    entities: {
      products: {
        label: 'Products',
        table: 'flamingo_products',
        search: ['name', 'description', 'category', 'brand', 'approval_status'],
        fields: [
          field('category_id'), field('category'), field('seller_id', 'number'),
          field('name', 'text', true), field('description', 'textarea'), field('price', 'number', true),
          field('currency'), field('stock_quantity', 'number'), field('images', 'array'),
          field('images_urls', 'array'), field('brand'), field('tags', 'array'),
          field('rating', 'number'), field('rating_average', 'number'), field('rating_count', 'number'),
          field('discrete_shipping', 'boolean'), field('is_adult_verified', 'boolean'),
          field('is_available', 'boolean'), field('is_approved', 'boolean'), field('approval_status'),
          field('approval_notes', 'textarea'), field('likes', 'number'), field('dislikes', 'number'),
          field('poll_data', 'json')
        ],
        lifecycle: {
          columns: {
            approval_status: { active: 'approved', suspended: 'rejected', frozen: 'pending', archived: 'rejected' },
            is_available: { active: true, suspended: false, frozen: false, archived: false },
            is_approved: { active: true, suspended: false, frozen: false, archived: false }
          }
        },
        redact: ['seller_id']
      },
      categories: {
        label: 'Fashion categories',
        table: 'flamingo_categories',
        search: ['name', 'slug', 'type', 'description'],
        fields: [field('name', 'text', true), field('slug', 'text', true), field('type', 'text', true), field('description', 'textarea'), field('icon_url'), field('measurement_guide', 'json'), field('display_order', 'number')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      outfits: {
        label: 'Outfits',
        table: 'flamingo_outfits',
        search: ['name', 'description', 'occasion', 'season'],
        fields: [field('user_id', 'text', true), field('name', 'text', true), field('description', 'textarea'), field('occasion'), field('season'), field('style_tags', 'array'), field('color_palette', 'json'), field('is_favorite', 'boolean')],
        lifecycle: { columns: { is_public: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      outfit_items: {
        label: 'Outfit items',
        table: 'flamingo_outfit_items',
        search: ['item_name', 'category', 'brand', 'color', 'size'],
        fields: [field('outfit_id', 'text', true), field('item_name', 'text', true), field('category', 'text', true), field('brand'), field('color'), field('size'), field('product_id'), field('product_url'), field('price', 'number'), field('position', 'number', true), field('item_type'), field('image_url')],
        lifecycle: { columns: {} }
      }
    }
  },
  ownit: {
    label: 'OwnIt',
    entities: {
      stores: {
        label: 'Luxury stores',
        table: 'ownit_stores',
        search: ['name', 'slug', 'store_type', 'curator_name', 'pavilion_location'],
        fields: [
          field('name', 'text', true), field('slug', 'text', true), field('store_type', 'text', true),
          field('curator_name'), field('brand_tier'), field('pavilion_location'),
          field('cover_4k_url'), field('video_trailer_4k_url'),
          field('description', 'textarea'), field('authenticity_pledge', 'textarea'),
          field('is_verified', 'boolean'), field('is_active', 'boolean'), field('rating', 'number')
        ],
        lifecycle: {
          columns: {
            status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' },
            is_active: { active: true, suspended: false, frozen: false, archived: false }
          }
        }
      },
      products: {
        label: 'Luxury products',
        table: 'ownit_products',
        search: ['name', 'brand', 'category', 'description', 'authenticity_cert_number', 'serial_number'],
        fields: [
          field('store_id'), field('name', 'text', true), field('brand', 'text', true),
          field('category', 'text', true), field('description', 'textarea'),
          field('price_fic', 'number', true), field('price_usd', 'number', true),
          field('media_4k_urls', 'array'), field('video_showcase_url'),
          field('authenticity_cert_number', 'text', true), field('cryptographic_sha256', 'text', true),
          field('provenance_history', 'json'), field('serial_number'), field('rarity_level'),
          field('celebrity_endorsement'), field('stock', 'number'), field('likes', 'number'),
          field('dislikes', 'number'), field('rating', 'number'), field('poll_data', 'json'),
          field('is_active', 'boolean')
        ],
        lifecycle: {
          columns: {
            status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' },
            is_active: { active: true, suspended: false, frozen: false, archived: false }
          }
        }
      },
      categories: {
        label: 'Asset categories',
        table: 'ownit_categories',
        search: ['name', 'slug', 'description'],
        fields: [field('name', 'text', true), field('slug', 'text', true), field('description', 'textarea'), field('icon_url'), field('display_order', 'number')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      entries: {
        label: 'Owned assets',
        table: 'ownit_entries',
        search: ['title', 'slug', 'brand', 'model', 'serial_number', 'status'],
        fields: [
          field('title', 'text', true), field('slug', 'text', true), field('description', 'textarea'),
          field('category_id'), field('brand'), field('model'), field('serial_number'),
          field('purchase_date', 'datetime'), field('purchase_price', 'number'), field('currency'),
          field('owner_id', 'text', true), field('status'), field('location'),
          field('images', 'json'), field('receipt_url'), field('warranty_card_url'),
          field('warranty_start_date', 'datetime'), field('warranty_end_date', 'datetime'),
          field('warranty_provider'), field('warranty_type'), field('warranty_documents', 'json'),
          field('tags', 'array'), field('notes', 'textarea')
        ],
        lifecycle: { columns: {} }
      },
      orders: {
        label: 'Orders',
        table: 'ownit_orders',
        search: ['order_number', 'seller_name', 'tracking_number', 'status', 'payment_status'],
        fields: [
          field('order_number', 'text', true), field('seller_name'), field('seller_contact', 'textarea'),
          field('order_date', 'datetime', true), field('delivery_date', 'datetime'),
          field('total_amount', 'number', true), field('currency'), field('payment_method'),
          field('payment_status'), field('shipping_address', 'json'), field('tracking_number'),
          field('carrier'), field('shipping_status'), field('owner_id', 'text', true),
          field('status'), field('invoice_url'), field('receipt_url')
        ],
        lifecycle: { columns: {} }
      },
      returns: {
        label: 'Returns',
        table: 'ownit_returns',
        search: ['return_number', 'reason', 'reason_category', 'status', 'refund_status'],
        fields: [
          field('return_number', 'text', true), field('order_id', 'text', true),
          field('reason', 'textarea', true), field('reason_category'), field('description', 'textarea'),
          field('return_request_date', 'datetime', true), field('expected_pickup_date', 'datetime'),
          field('actual_return_date', 'datetime'), field('items', 'json', true),
          field('refund_amount', 'number'), field('refund_method'), field('refund_status'),
          field('refund_processed_date', 'datetime'), field('return_shipping_label_url'),
          field('return_tracking_number'), field('status'), field('seller_notes', 'textarea'),
          field('customer_notes', 'textarea')
        ],
        lifecycle: { columns: {} }
      },
      warranty_claims: {
        label: 'Warranty claims',
        table: 'ownit_warranty_claims',
        search: ['claim_number', 'issue_description', 'issue_category', 'status', 'service_provider'],
        fields: [
          field('claim_number', 'text', true), field('entry_id', 'text', true),
          field('issue_description', 'textarea', true), field('issue_category'), field('severity'),
          field('issue_discovered_date', 'datetime', true), field('claim_submitted_date', 'datetime', true),
          field('expected_resolution_date', 'datetime'), field('actual_resolution_date', 'datetime'),
          field('photos', 'json'), field('videos', 'json'), field('diagnostic_reports', 'json'),
          field('resolution_type'), field('resolution_description', 'textarea'),
          field('repair_cost', 'number'), field('covered_by_warranty', 'boolean'),
          field('service_provider'), field('service_location'), field('appointment_date', 'datetime'),
          field('completion_date', 'datetime'), field('status'), field('claim_notes', 'textarea'),
          field('provider_response', 'textarea')
        ],
        lifecycle: { columns: {} }
      }
    }
  },
  gameon: {
    label: 'GameOn',
    entities: {
      events: {
        label: 'Events',
        table: 'gameon_events',
        search: ['title', 'sport_type', 'event_type', 'location', 'status'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('organizer_id', 'text', true), field('sport_type'), field('event_type'), field('location'), field('start_time', 'datetime', true), field('end_time', 'datetime'), field('max_participants', 'number'), field('entry_fee', 'number'), field('currency'), field('image_url'), field('status')],
        lifecycle: { columns: { status: { active: 'upcoming', suspended: 'cancelled', frozen: 'postponed', archived: 'archived' } } }
      },
      matches: {
        label: 'Matches',
        table: 'gameon_matches',
        search: ['sport', 'home_team', 'away_team', 'status', 'result'],
        fields: [field('sport', 'text', true), field('home_team', 'text', true), field('away_team', 'text', true), field('match_date', 'datetime', true), field('odds', 'json'), field('status'), field('result')],
        lifecycle: { columns: { status: { active: 'scheduled', suspended: 'cancelled', frozen: 'postponed', archived: 'archived' } } }
      },
      predictions: {
        label: 'Predictions (read only)',
        table: 'gameon_predictions',
        search: ['match_id', 'user_id', 'prediction', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      leaderboards: {
        label: 'Leaderboards (read only)',
        table: 'gameon_leaderboards',
        search: ['game_id', 'season'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      }
    }
  },
  fingerwars: {
    label: 'FingerWars',
    entities: {
      categories: {
        label: 'Game categories',
        table: 'fingerwars_game_categories',
        generateId: true,
        search: ['name', 'slug', 'description'],
        fields: [field('name', 'text', true), field('description', 'textarea'), field('slug', 'text', true), field('icon_url'), field('display_order', 'number')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      games: {
        label: 'Games',
        table: 'fingerwars_games',
        search: ['title', 'description', 'age_rating'],
        fields: [field('category_id', 'text', true), field('developer_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('short_description', 'textarea'), field('thumbnail_url'), field('banner_url'), field('trailer_url'), field('release_date', 'datetime'), field('published_at', 'datetime'), field('player_count_min', 'number'), field('player_count_max', 'number'), field('age_rating'), field('genre_tags', 'array'), field('tags', 'array'), field('average_rating', 'number'), field('rating_count', 'number'), field('total_plays', 'number'), field('is_multiplayer', 'boolean'), field('is_free_to_play', 'boolean'), field('price', 'number'), field('currency'), field('rules', 'textarea')],
        lifecycle: { columns: { is_published: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      tournaments: {
        label: 'Tournaments',
        table: 'fingerwars_tournaments',
        search: ['game_id', 'title', 'name', 'status'],
        fields: [field('game_id', 'text', true), field('title', 'text', true), field('name'), field('description', 'textarea'), field('start_date', 'datetime'), field('end_date', 'datetime'), field('registration_start', 'datetime'), field('registration_end', 'datetime'), field('entry_fee', 'number'), field('currency'), field('prize_pool', 'number'), field('max_participants', 'number'), field('winner_id'), field('is_public', 'boolean'), field('created_by'), field('organizer_id'), field('status')],
        lifecycle: { columns: { status: { active: 'upcoming', suspended: 'cancelled', frozen: 'paused', archived: 'archived' } } }
      },
      teams: {
        label: 'Teams',
        table: 'fingerwars_teams',
        search: ['name', 'tag', 'description'],
        fields: [field('name', 'text', true), field('tag', 'text', true), field('description', 'textarea'), field('logo_url'), field('captain_id', 'text', true), field('created_by')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      team_members: {
        label: 'Team memberships',
        table: 'fingerwars_team_members',
        search: ['team_id', 'user_id', 'role', 'status'],
        fields: [field('team_id', 'text', true), field('user_id', 'text', true), field('role'), field('join_date', 'datetime', true), field('status')],
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      achievements: {
        label: 'Achievements',
        table: 'fingerwars_achievements',
        search: ['name', 'description', 'rarity'],
        fields: [field('game_id', 'text', true), field('name', 'text', true), field('description', 'textarea'), field('icon_url'), field('points_value', 'number'), field('rarity'), field('criteria', 'json'), field('is_hidden', 'boolean')],
        lifecycle: { columns: { is_hidden: { active: false, suspended: true, frozen: true, archived: true } } }
      },
      player_achievements: {
        label: 'Player achievements (read only)',
        table: 'fingerwars_player_achievements',
        search: ['achievement_id', 'progress'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      matches: {
        label: 'Matches (read only)',
        table: 'fingerwars_matches',
        search: ['game_id', 'status', 'match_format'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      game_sessions: {
        label: 'Game sessions (read only)',
        table: 'fingerwars_game_sessions',
        search: ['game_id', 'user_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      match_participants: {
        label: 'Match participants (read only)',
        table: 'fingerwars_match_participants',
        search: ['match_id', 'user_id', 'team_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      tournament_registrations: {
        label: 'Tournament registrations (read only)',
        table: 'fingerwars_tournament_registrations',
        search: ['tournament_id', 'user_id', 'status', 'payment_status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      player_rankings: {
        label: 'Player rankings (read only)',
        table: 'fingerwars_player_rankings',
        search: ['user_id', 'game_id', 'season'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      }
    }
  },
  supervi: {
    label: 'SuperVi Games',
    entities: {
      sessions: {
        label: 'Game sessions (read only)',
        table: 'supervi_game_sessions',
        search: ['player_id', 'game_title'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['player_id']
      },
      leaderboard: {
        label: 'Leaderboard (read only)',
        table: 'supervi_leaderboard_entries',
        search: ['leaderboard_type', 'member_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['member_id']
      }
    }
  },
  canary: {
    label: 'Canary Ads',
    entities: {
      advertisers: {
        label: 'Advertisers',
        table: 'canary_advertisers',
        search: ['company_name', 'status', 'website_url'],
        fields: [field('user_id', 'text', true), field('company_name', 'text', true), field('billing_email', 'text', true), field('website_url'), field('is_verified_merchant', 'boolean'), field('status')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'suspended', archived: 'archived' } } },
        redact: ['billing_email']
      },
      campaigns: {
        label: 'Campaigns',
        table: 'canary_campaigns',
        search: ['title', 'campaign_type', 'status'],
        fields: [field('advertiser_id', 'text', true), field('title', 'text', true), field('campaign_type', 'text', true), field('status'), field('daily_budget', 'number'), field('total_budget', 'number'), field('currency'), field('bid_strategy'), field('start_date', 'datetime'), field('end_date', 'datetime')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'paused', frozen: 'paused', archived: 'archived' } } }
      },
      ad_groups: {
        label: 'Ad groups',
        table: 'canary_ad_groups',
        search: ['name', 'placement', 'status'],
        fields: [field('campaign_id', 'text', true), field('name', 'text', true), field('placement', 'text', true), field('target_locations', 'array'), field('target_genders', 'array'), field('target_age_min', 'number'), field('target_age_max', 'number'), field('target_keywords', 'array'), field('status')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'paused', frozen: 'paused', archived: 'archived' } } }
      },
      creatives: {
        label: 'Creatives',
        table: 'canary_creatives',
        search: ['headline', 'description', 'primary_text', 'moderation_status'],
        fields: [field('ad_group_id', 'text', true), field('format', 'text', true), field('media_url', 'text', true), field('thumbnail_url'), field('headline', 'text', true), field('description', 'textarea'), field('primary_text', 'textarea'), field('destination_url', 'text', true), field('call_to_action'), field('video_duration_seconds', 'number'), field('file_size_bytes', 'number', true), field('aspect_ratio', 'text', true), field('has_safe_area_padding', 'boolean'), field('ai_policy_passed', 'boolean'), field('ai_policy_score', 'number'), field('ai_rejection_reason', 'textarea'), field('moderation_status'), field('moderated_by'), field('moderated_at', 'datetime')],
        lifecycle: { columns: {} }
      },
      carousel_cards: {
        label: 'Carousel cards',
        table: 'canary_carousel_cards',
        search: ['headline', 'description', 'destination_url'],
        fields: [field('creative_id', 'text', true), field('card_index', 'number', true), field('media_url', 'text', true), field('headline', 'text', true), field('description', 'textarea'), field('destination_url', 'text', true), field('video_duration_seconds', 'number')],
        lifecycle: { columns: {} }
      },
      publisher_whitelist: {
        label: 'Publisher whitelist',
        table: 'canary_publisher_whitelist',
        search: ['user_id', 'publisher_badge', 'role_or_badge', 'status'],
        fields: [field('user_id', 'text', true), field('publisher_badge', 'text', true), field('role_or_badge', 'text', true), field('approved_by', 'text', true), field('status')],
        lifecycle: { columns: {} },
        redact: ['user_id', 'approved_by']
      },
      payments: {
        label: 'Payments (read only)',
        table: 'canary_payments',
        search: ['campaign_id', 'advertiser_id', 'status', 'transaction_ref'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      impressions: {
        label: 'Impressions (read only)',
        table: 'canary_impressions',
        search: ['creative_id', 'placement', 'ip_hash'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['viewer_user_id', 'ip_hash']
      },
      clicks: {
        label: 'Clicks (read only)',
        table: 'canary_clicks',
        search: ['creative_id', 'ip_hash'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['viewer_user_id', 'ip_hash']
      },
      system_checks: {
        label: 'System checks (read only)',
        table: 'canary_checks',
        search: ['check_type', 'status', 'message'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      legal_disclaimers: {
        label: 'Advertiser legal disclaimers (read only)',
        table: 'canary_disclaimers',
        search: ['advertiser_id', 'disclaimer_version'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['accepted_ip', 'digital_signature']
      }
    }
  },
  loansqr: {
    label: 'LoanSQR',
    entities: {
      applications: {
        label: 'Loan applications (read only)',
        table: 'lendsq_loans',
        search: ['borrower_id', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['borrower_id']
      },
      credit_scores: {
        label: 'Credit scores (read only)',
        table: 'lendsq_credit_scores',
        search: ['user_id', 'risk_tier'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      loan_facilities: {
        label: 'Loan facilities',
        table: 'platform_loan_facilities',
        generateId: true,
        search: ['facility_name', 'status'],
        fields: [field('facility_name', 'text', true), field('principal_amount', 'number', true), field('annual_interest_rate', 'number', true), field('tenor_months', 'number', true), field('moratorium_months', 'number'), field('amortization_months', 'number'), field('total_interest', 'number', true), field('prime_plus_interest', 'number', true), field('monthly_payment', 'number', true), field('start_date', 'datetime', true), field('end_date', 'datetime'), field('status')],
        lifecycle: { columns: {} }
      },
      payments: {
        label: 'Loan payments (read only)',
        table: 'lendsq_payments',
        search: ['loan_id', 'user_id', 'payment_method'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      }
    }
  },
  camus: {
    label: 'Camus',
    entities: {
      reflections: {
        label: 'Reflections',
        table: 'camus_reflections',
        search: ['title', 'content', 'philosophical_school'],
        fields: [field('user_id', 'text', true), field('title', 'text', true), field('content', 'textarea', true), field('philosophical_school'), field('is_public', 'boolean')],
        lifecycle: { columns: { is_public: { active: true, suspended: false, frozen: false, archived: false } } },
        redact: ['user_id']
      },
      posts: {
        label: 'Philosophical posts',
        table: 'camus_posts',
        search: ['title', 'content', 'slug', 'status'],
        fields: [field('topic_id', 'text', true), field('author_id', 'text', true), field('title', 'text', true), field('content', 'textarea', true), field('excerpt', 'textarea'), field('slug', 'text', true), field('status'), field('is_featured', 'boolean'), field('published_at', 'datetime')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'draft', frozen: 'draft', archived: 'archived' } } },
        redact: ['author_id']
      },
      comments: {
        label: 'Comments',
        table: 'camus_comments',
        search: ['content', 'status'],
        fields: [field('post_id', 'text', true), field('parent_comment_id', 'text'), field('author_id', 'text', true), field('content', 'textarea', true), field('status')],
        lifecycle: { columns: { status: { active: 'approved', suspended: 'rejected', frozen: 'spam', archived: 'spam' } } },
        redact: ['author_id']
      },
      topics: {
        label: 'Topics',
        table: 'camus_topics',
        search: ['title', 'description', 'slug'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('slug', 'text', true), field('parent_topic_id', 'text'), field('is_active', 'boolean')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      schools: {
        label: 'Philosophical schools',
        table: 'camus_schools',
        search: ['name', 'description'],
        fields: [field('name', 'text', true), field('description', 'textarea'), field('founding_date', 'datetime'), field('key_figures', 'array'), field('core_beliefs', 'array'), field('influence_regions', 'array'), field('is_active', 'boolean')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      philosophers: {
        label: 'Philosopher profiles',
        table: 'camus_philosophers',
        search: ['philosopher_name', 'bio', 'expertise_areas'],
        fields: [field('user_id', 'text', true), field('philosopher_name', 'text', true), field('bio', 'textarea'), field('expertise_areas', 'array'), field('notable_works', 'array'), field('school_id', 'text'), field('is_verified', 'boolean'), field('reputation_score', 'number'), field('join_date', 'datetime')],
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      debates: {
        label: 'Debates',
        table: 'camus_debates',
        search: ['title', 'proposition_statement', 'opposition_statement', 'status'],
        fields: [field('title', 'text', true), field('topic_id', 'text', true), field('moderator_id', 'text', true), field('proposition_statement', 'textarea', true), field('opposition_statement', 'textarea', true), field('status'), field('start_time', 'datetime'), field('end_time', 'datetime')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'cancelled', frozen: 'paused', archived: 'completed' } } },
        redact: ['moderator_id']
      },
      debate_participants: {
        label: 'Debate participants (read only)',
        table: 'camus_debate_participants',
        search: ['debate_id', 'side'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      debate_votes: {
        label: 'Debate votes (read only)',
        table: 'camus_debate_votes',
        search: ['debate_id', 'vote_side'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['voter_id']
      },
      post_interactions: {
        label: 'Post interactions (read only)',
        table: 'camus_post_interactions',
        search: ['post_id', 'interaction_type'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      post_schools: {
        label: 'Post and school links (read only)',
        table: 'camus_post_schools',
        keyColumns: ['post_id', 'school_id'],
        search: ['post_id', 'school_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      }
    }
  },
  elearning: {
    label: 'ELearning',
    entities: {
      categories: {
        label: 'Categories',
        table: 'elearning_categories',
        search: ['name', 'slug', 'description'],
        fields: [field('name', 'text', true), field('description', 'textarea'), field('slug', 'text', true), field('parent_category_id'), field('icon_url')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      courses: {
        label: 'Courses',
        table: 'elearning_courses',
        search: ['title', 'description', 'level', 'language'],
        fields: [field('category_id', 'text', true), field('instructor_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('short_description', 'textarea'), field('thumbnail_url'), field('preview_video_url'), field('level'), field('language'), field('duration_hours', 'number'), field('price', 'number'), field('discount_price', 'number'), field('currency'), field('published_at', 'datetime'), field('is_certificate_available', 'boolean'), field('skills_gained', 'array'), field('requirements', 'array'), field('target_audience', 'array')],
        lifecycle: { columns: { is_published: { active: true, suspended: false, frozen: false, archived: false } } }
      },
      modules: {
        label: 'Course modules',
        table: 'elearning_modules',
        search: ['title', 'description'],
        fields: [field('course_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('order_index', 'number', true), field('duration_minutes', 'number'), field('is_preview', 'boolean')],
        lifecycle: { columns: {} }
      },
      lessons: {
        label: 'Lessons',
        table: 'elearning_lessons',
        search: ['title', 'content', 'lesson_type'],
        fields: [field('module_id', 'text', true), field('lesson_type', 'text', true), field('title', 'text', true), field('content', 'textarea'), field('video_url'), field('external_url'), field('duration_minutes', 'number'), field('order_index', 'number', true), field('is_preview', 'boolean'), field('is_downloadable', 'boolean')],
        lifecycle: { columns: {} }
      },
      quizzes: {
        label: 'Quizzes',
        table: 'elearning_quizzes',
        search: ['title', 'description'],
        fields: [field('lesson_id', 'text', true), field('title', 'text', true), field('description', 'textarea'), field('question_count', 'number'), field('time_limit_minutes', 'number'), field('passing_score', 'number'), field('shuffle_questions', 'boolean')],
        lifecycle: { columns: {} }
      },
      quiz_questions: {
        label: 'Quiz questions',
        table: 'elearning_quiz_questions',
        search: ['question_text', 'question_type'],
        fields: [field('quiz_id', 'text', true), field('question_text', 'textarea', true), field('question_type', 'text', true), field('order_index', 'number', true), field('points', 'number')],
        lifecycle: { columns: {} }
      },
      quiz_answers: {
        label: 'Quiz answers',
        table: 'elearning_quiz_answers',
        search: ['answer_text'],
        fields: [field('question_id', 'text', true), field('answer_text', 'textarea', true), field('is_correct', 'boolean'), field('order_index', 'number', true)],
        lifecycle: { columns: {} }
      },
      enrollments: {
        label: 'Enrollments (read only)',
        table: 'elearning_enrollments',
        search: ['user_id', 'course_id', 'payment_status', 'enrollment_type'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      certificates: {
        label: 'Certificates (read only)',
        table: 'elearning_certificates',
        search: ['user_id', 'course_id', 'certificate_code', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id', 'certificate_code']
      },
      reviews: {
        label: 'Reviews (read only)',
        table: 'elearning_reviews',
        search: ['course_id', 'user_id', 'review_text'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      student_progress: {
        label: 'Student progress (read only)',
        table: 'elearning_student_progress',
        search: ['user_id', 'course_id', 'lesson_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      announcements: {
        label: 'Course announcements',
        table: 'elearning_announcements',
        search: ['title', 'content'],
        fields: [field('course_id', 'text', true), field('author_id', 'text', true), field('title', 'text', true), field('content', 'textarea', true), field('is_pinned', 'boolean')],
        lifecycle: { columns: {} },
        redact: ['author_id']
      }
    }
  },
  franchise: {
    label: 'Franchise',
    entities: {
      franchises: {
        label: 'Franchises',
        table: 'franchises',
        search: ['name', 'code', 'owner_id', 'region', 'status'],
        fields: [field('name', 'text', true), field('code', 'text', true), field('owner_id', 'text', true), field('region'), field('revenue_share_percentage', 'number'), field('total_revenue', 'number'), field('active_terminals', 'number'), field('status')],
        lifecycle: { columns: { status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' } } },
        redact: ['owner_id']
      },
      locations: {
        label: 'Locations',
        table: 'franchise_locations',
        search: ['franchise_name', 'location_name', 'city', 'state', 'country'],
        fields: [field('franchise_id'), field('franchise_name'), field('location_name', 'text', true), field('address', 'textarea'), field('city'), field('state'), field('country'), field('postal_code'), field('phone_number'), field('email'), field('website'), field('manager_id'), field('opening_date', 'datetime')],
        lifecycle: { columns: { is_active: { active: true, suspended: false, frozen: false, archived: false } } },
        redact: ['phone_number', 'email', 'manager_id']
      },
      revenue_shares: {
        label: 'Revenue shares (read only)',
        table: 'franchise_revenue_shares',
        search: ['franchise_id', 'payout_status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      }
    }
  },
  livestreaming: {
    label: 'LiveStreaming',
    entities: {
      sessions: {
        label: 'Streaming sessions',
        table: 'streaming_sessions',
        search: ['title', 'creator_id', 'stream_category', 'stream_type', 'status'],
        fields: [field('title', 'text', true), field('creator_id', 'text', true), field('stream_category'), field('stream_type'), field('description', 'textarea'), field('thumbnail_url'), field('tags', 'array'), field('privacy_level')],
        lifecycle: { columns: { status: { active: 'created', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, moderation_status: { active: 'active', suspended: 'suspended', frozen: 'frozen', archived: 'archived' }, is_active: { active: false, suspended: false, frozen: false, archived: false }, is_live: { active: false, suspended: false, frozen: false, archived: false } } },
        redact: ['stream_key']
      }
    }
  },
  downloads: {
    label: 'My Downloads',
    entities: {
      mii_tokens: {
        label: 'Mii download tokens (read only)',
        table: 'mii_download_tokens',
        search: ['content_id', 'owner_id', 'requester_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['owner_id', 'requester_id', 'pin_code', 'token_string']
      },
      ugc_tokens: {
        label: 'UGC download tokens (read only)',
        table: 'ugc_download_tokens',
        search: ['content_type', 'content_id', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['token', 'user_id']
      },
      voice_downloads: {
        label: 'VoiceLine downloads (read only)',
        table: 'voicelines_downloads',
        search: ['clip_id', 'user_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      photo_downloads: {
        label: 'PhotoCredits downloads (read only)',
        table: 'photocredits_downloads',
        search: ['photo_id', 'user_id', 'download_type', 'download_purpose'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id', 'member_id']
      }
    }
  },
  stercs_editor: {
    label: 'StercsEditor',
    entities: {
      pages: {
        label: 'Editor pages',
        table: 'stercs_editor_pages',
        search: ['title', 'slug', 'status'],
        fields: [field('title', 'text', true), field('slug', 'text', true), field('components', 'json', true), field('theme', 'json'), field('created_by'), field('status')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'draft', archived: 'archived' } } }
      },
      projects: {
        label: 'Editor projects',
        table: 'stercs_projects',
        search: ['title', 'status', 'template'],
        fields: [field('title'), field('status'), field('template'), field('published_at', 'datetime'), field('canvas_data', 'json'), field('thumbnail_url')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'draft', archived: 'archived' } } }
      },
      shows: {
        label: 'Shows',
        table: 'stercs_shows',
        search: ['title', 'description', 'language', 'country', 'status'],
        fields: [field('title', 'text', true), field('description', 'textarea'), field('is_premium', 'boolean'), field('release_year', 'number'), field('rating', 'number'), field('language'), field('country'), field('poster_url'), field('backdrop_url'), field('created_by'), field('status')],
        lifecycle: { columns: { status: { active: 'published', suspended: 'suspended', frozen: 'draft', archived: 'archived' } } }
      },
      episodes: {
        label: 'Episodes',
        table: 'stercs_episodes',
        search: ['title', 'description'],
        fields: [field('season_id', 'text', true), field('episode_number', 'number', true), field('title', 'text', true), field('description', 'textarea'), field('video_url'), field('hls_playlist_url'), field('duration_seconds', 'number'), field('thumbnail_url'), field('is_premium', 'boolean'), field('release_date', 'datetime', true)],
        lifecycle: { columns: {} }
      },
      genres: {
        label: 'Genres',
        table: 'stercs_genres',
        search: ['name', 'description'],
        fields: [field('name', 'text', true), field('description', 'textarea')],
        lifecycle: { columns: {} }
      },
      seasons: {
        label: 'Show seasons',
        table: 'stercs_seasons',
        search: ['title', 'description'],
        fields: [field('show_id', 'text', true), field('season_number', 'number', true), field('title'), field('description', 'textarea'), field('poster_url')],
        lifecycle: { columns: {} }
      },
      show_genres: {
        label: 'Show and genre links (read only)',
        table: 'stercs_show_genres',
        keyColumns: ['show_id', 'genre_id'],
        search: ['show_id', 'genre_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      thumbnails: {
        label: 'Episode thumbnails',
        table: 'stercs_thumbnails',
        search: ['episode_id', 'url'],
        fields: [field('episode_id', 'text', true), field('url', 'text', true), field('timestamp_seconds', 'number'), field('is_primary', 'boolean')],
        lifecycle: { columns: {} }
      },
      streaming_sessions: {
        label: 'Streaming sessions (read only)',
        table: 'stercs_streaming_sessions',
        search: ['episode_id', 'device_type', 'playback_quality', 'ended_reason'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id', 'ip_address', 'user_agent']
      },
      video_transcodes: {
        label: 'Video transcodes (read only)',
        table: 'stercs_video_transcodes',
        search: ['original_filename', 'status', 'error_message'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} }
      },
      subscriptions: {
        label: 'Subscriptions (read only)',
        table: 'stercs_subscriptions',
        search: ['user_id', 'tier', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id', 'payment_transaction_id']
      },
      watch_history: {
        label: 'Watch history (read only)',
        table: 'stercs_watch_history',
        search: ['user_id', 'episode_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      }
    }
  },
  wallets: {
    label: 'Wallets & Treasury',
    entities: {
      member_wallets: {
        label: 'Member wallets (read only)',
        table: 'enhanced_wallets',
        search: ['member_id', 'currency'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['member_id']
      },
      fic_wallets: {
        label: 'FIC wallets (read only)',
        table: 'fic_wallets',
        idColumn: 'user_id',
        search: ['user_id'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      fics_wallets: {
        label: 'FICS wallets (read only)',
        table: 'fics_wallets',
        search: ['user_id', 'status'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      },
      treasury_requests: {
        label: 'Treasury funding requests (read only)',
        table: 'treasury_funding_requests',
        search: ['request_reference', 'user_id', 'status', 'depositor_name'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_email', 'user_wallet_address', 'destination_account_number', 'bank_tx_reference', 'proof_attachment_url', 'vault_depletion_sequence']
      },
      vaults: {
        label: 'Sovereign vaults (read only)',
        table: 'sovereign_vaults',
        search: ['vault_number', 'vault_name', 'custodian_title'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['wallet_address', 'authorized_signers']
      },
      vault_transactions: {
        label: 'Vault transactions (read only)',
        table: 'vault_transactions',
        search: ['user_id', 'type', 'description'],
        fields: [],
        readOnly: true,
        lifecycle: { columns: {} },
        redact: ['user_id']
      }
    }
  }
};

const getPool = () => db.pool || db;
const sanitizeRecord = (domainKey, entityKey, record) => {
  if (!record) return record;
  const safeRecord = { ...record };
  if (domainKey === 'permanence' && entityKey === 'streams') delete safeRecord.stream_key;
  const resource = DOMAINS[domainKey]?.entities[entityKey];
  for (const column of resource?.redact || []) delete safeRecord[column];
  if (domainKey === 'livestreaming' && entityKey === 'sessions') delete safeRecord.stream_key;
  return safeRecord;
};

const getResource = (domainKey, entityKey) => {
  const domain = DOMAINS[domainKey];
  const resource = domain?.entities[entityKey];
  if (!resource) {
    const error = new Error('Unknown platform domain resource');
    error.statusCode = 404;
    throw error;
  }
  return { domain, resource };
};

const getRecordIdExpression = (resource, alias) => {
  const keyColumns = resource.keyColumns || [resource.idColumn || 'id'];
  const columnExpressions = keyColumns.map(column => `${alias}.${column}::text`);
  return columnExpressions.length === 1
    ? columnExpressions[0]
    : `concat_ws(':', ${columnExpressions.join(', ')})`;
};

const convertValue = (value, type) => {
  if (value === null || value === '') return null;
  if (type === 'boolean') {
    if (typeof value === 'boolean') return value;
    if (value === 'true') return true;
    if (value === 'false') return false;
    throw new Error('Invalid boolean value');
  }
  if (type === 'number') {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new Error('Invalid numeric value');
    return parsed;
  }
  if (type === 'array' || type === 'json') {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    if (type === 'array' && !Array.isArray(parsed)) throw new Error('Expected an array value');
    if (type === 'json' && (typeof parsed !== 'object' || parsed === null)) throw new Error('Expected a JSON object or array');
    return parsed;
  }
  return value;
};

const normalizeFields = (resource, body, { requireRequired = false } = {}) => {
  if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Request body must be an object');
  const normalized = [];
  const allowed = new Map(resource.fields.map(item => [item.name, item]));
  for (const [name, value] of Object.entries(body)) {
    const definition = allowed.get(name);
    if (!definition) throw new Error(`Field ${name} cannot be changed`);
    if (value === undefined) continue;
    if (requireRequired && (value === '' || value === null)) continue;
    normalized.push([name, convertValue(value, definition.type)]);
  }
  if (requireRequired) {
    for (const definition of resource.fields) {
      if (definition.required && (body[definition.name] === undefined || body[definition.name] === null || body[definition.name] === '')) {
        throw new Error(`Field ${definition.name} is required`);
      }
    }
  }
  return normalized;
};

const audit = async (client, { domain, entity, id, action, actorId, reason, before, after }) => {
  await client.query(
    `INSERT INTO platform_domain_management_audit
      (domain_key, entity_key, record_id, action, actor_id, reason, before_snapshot, after_snapshot)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb, $8::jsonb)`,
    [
      domain,
      entity,
      String(id),
      action,
      actorId ? String(actorId) : null,
      reason || null,
      before ? JSON.stringify(sanitizeRecord(domain, entity, before)) : null,
      after ? JSON.stringify(sanitizeRecord(domain, entity, after)) : null
    ]
  );
};

const getActorId = req => req.user?.id || req.member?.id || null;
const respondError = (res, error, message) => {
  logger.error(message, error);
  return res.status(error.statusCode || (error.message?.startsWith('Field ') || error.message?.startsWith('Expected ') || error.message?.startsWith('Invalid ') || error.message === 'Request body must be an object' ? 400 : 500))
    .json({ success: false, message: error.statusCode === 404 ? error.message : message, ...(error.statusCode === 400 ? { detail: error.message } : {}) });
};

const getDefinitions = async (req, res) => {
  try {
    const result = [];
    const resources = Object.entries(DOMAINS).flatMap(([domainKey, domain]) =>
      Object.entries(domain.entities).map(([entityKey, resource]) => ({ domainKey, domain, entityKey, resource }))
    );
    const counts = await getPool().query(
      resources.map(({ resource }, index) =>
        `SELECT ${index}::int AS resource_index, COUNT(*)::int AS count FROM ${resource.table}`
      ).join(' UNION ALL ')
    );
    const countByIndex = new Map(counts.rows.map(row => [row.resource_index, row.count]));
    for (const [domainKey, domain] of Object.entries(DOMAINS)) {
      const entities = [];
      for (const [entityKey, resource] of Object.entries(domain.entities)) {
        const resourceIndex = resources.findIndex(item => item.domainKey === domainKey && item.entityKey === entityKey);
        entities.push({
          key: entityKey,
          label: resource.label,
          count: countByIndex.get(resourceIndex) || 0,
          fields: resource.fields,
          readOnly: Boolean(resource.readOnly),
          supportsLifecycle: Object.keys(resource.lifecycle.columns).length > 0,
          supportsAutomation: Boolean(resource.automation)
        });
      }
      result.push({ key: domainKey, label: domain.label, entities });
    }
    return res.json({ success: true, data: result });
  } catch (error) {
    return respondError(res, error, 'Failed to load platform domain management definitions');
  }
};

const listRecords = async (req, res) => {
  try {
    const { domainKey, entityKey } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    const idColumn = resource.idColumn || 'id';
    const recordIdExpression = getRecordIdExpression(resource, 'r');
    const keyColumns = resource.keyColumns || [idColumn];
    const canExposeId = !resource.redact?.includes(idColumn);
    const idProjection = (resource.keyColumns || idColumn !== 'id') && canExposeId
      ? `, ${recordIdExpression} AS id`
      : '';
    const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 50, 1), 100);
    const offset = Math.max(Number.parseInt(req.query.offset, 10) || 0, 0);
    const search = String(req.query.search || '').trim();
    const params = [];
    const where = [];
    if (search && resource.search.length) {
      params.push(`%${search}%`);
      const searchParam = `$${params.length}`;
      where.push(`(${resource.search.map(column => `r.${column}::text ILIKE ${searchParam}`).join(' OR ')})`);
    }
    if (req.query.includeArchived !== 'true') {
      params.push(domainKey, entityKey);
      where.push('COALESCE(s.lifecycle_status, \'active\') <> \'archived\'');
      where.push(`NOT EXISTS (
        SELECT 1 FROM platform_domain_management_state s
        WHERE s.domain_key = $${params.length - 1}
          AND s.entity_key = $${params.length}
          AND s.record_id = ${recordIdExpression}
          AND s.lifecycle_status = 'archived'
      )`);
    }
    params.push(limit, offset);
    const whereSql = where.length ? `WHERE ${where.filter(part => !part.startsWith('COALESCE')).join(' AND ')}` : '';
    const rows = await getPool().query(
      `SELECT r.*${idProjection}, COALESCE(s.lifecycle_status, 'active') AS management_status
       FROM ${resource.table} r
       LEFT JOIN platform_domain_management_state s
         ON s.domain_key = '${domainKey}' AND s.entity_key = '${entityKey}' AND s.record_id = ${recordIdExpression}
       ${whereSql}
       ORDER BY ${keyColumns.map(column => `r.${column} DESC`).join(', ')}
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    const countParams = params.slice(0, params.length - 2);
    const count = await getPool().query(
      `SELECT COUNT(*)::int AS count FROM ${resource.table} r ${whereSql}`,
      countParams
    );
    return res.json({
      success: true,
      data: rows.rows.map(row => sanitizeRecord(domainKey, entityKey, row)),
      count: count.rows[0].count,
      limit,
      offset
    });
  } catch (error) {
    return respondError(res, error, 'Failed to list platform domain records');
  }
};

const createRecord = async (req, res) => {
  const client = await getPool().connect();
  try {
    const { domainKey, entityKey } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    if (resource.readOnly) {
      return res.status(405).json({ success: false, message: 'This resource is read-only to protect its operational source-of-truth records' });
    }
    const entries = normalizeFields(resource, req.body, { requireRequired: true });
    if (!entries.length) throw new Error('At least one editable field is required');
    for (const [column, states] of Object.entries(resource.lifecycle.columns)) {
      if (states.active !== undefined && !entries.some(([name]) => name === column)) {
        entries.push([column, states.active]);
      }
    }
    if (resource.generateId) {
      entries.push(['id', `fm_${randomBytes(16).toString('hex')}`]);
    }
    if (domainKey === 'permanence' && entityKey === 'streams') {
      entries.push(['stream_key', randomBytes(32).toString('hex')]);
    }
    if (domainKey === 'livestreaming' && entityKey === 'sessions') {
      entries.push(['stream_key', randomBytes(32).toString('hex')]);
    }
    if (resource.automation && !entries.some(([name]) => name === resource.automation.expiryColumn)) {
      const automation = await client.query(
        `SELECT enabled, expiry_hours FROM platform_domain_automation_settings
         WHERE domain_key = $1 AND entity_key = $2`,
        [domainKey, entityKey]
      );
      if (automation.rows[0]?.enabled) {
        const expiry = new Date(Date.now() + automation.rows[0].expiry_hours * 60 * 60 * 1000);
        entries.push([resource.automation.expiryColumn, expiry.toISOString()]);
      }
    }
    const columns = entries.map(([name]) => name);
    const placeholders = entries.map((_, index) => `$${index + 1}`);
    const values = entries.map(([, value]) => value);
    await client.query('BEGIN');
    const inserted = await client.query(
      `INSERT INTO ${resource.table} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`,
      values
    );
    const row = inserted.rows[0];
    await client.query(
      `INSERT INTO platform_domain_management_state (domain_key, entity_key, record_id, lifecycle_status)
       VALUES ($1, $2, $3, 'active')
       ON CONFLICT (domain_key, entity_key, record_id) DO UPDATE SET lifecycle_status = 'active', prior_status = NULL, archived_at = NULL, updated_at = NOW()`,
      [domainKey, entityKey, String(row.id)]
    );
    await audit(client, { domain: domainKey, entity: entityKey, id: row.id, action: 'created', actorId: getActorId(req), after: row });
    await client.query('COMMIT');
    return res.status(201).json({
      success: true,
      data: { ...sanitizeRecord(domainKey, entityKey, row), management_status: 'active' }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return respondError(res, error, 'Failed to create platform domain record');
  } finally {
    client.release();
  }
};

const updateRecord = async (req, res) => {
  const client = await getPool().connect();
  try {
    const { domainKey, entityKey, id } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    if (resource.readOnly) {
      return res.status(405).json({ success: false, message: 'This resource is read-only to protect its operational source-of-truth records' });
    }
    const entries = normalizeFields(resource, req.body);
    if (!entries.length) throw new Error('At least one editable field is required');
    await client.query('BEGIN');
    const existing = await client.query(`SELECT * FROM ${resource.table} WHERE id::text = $1 FOR UPDATE`, [id]);
    if (!existing.rowCount) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    const assignments = entries.map(([name], index) => `${name} = $${index + 1}`);
    const values = entries.map(([, value]) => value);
    values.push(id);
    if (resource.fields.some(item => item.name === 'updated_at')) assignments.push('updated_at = NOW()');
    const updated = await client.query(
      `UPDATE ${resource.table} SET ${assignments.join(', ')} WHERE id::text = $${values.length} RETURNING *`,
      values
    );
    await audit(client, { domain: domainKey, entity: entityKey, id, action: 'updated', actorId: getActorId(req), before: existing.rows[0], after: updated.rows[0] });
    await client.query('COMMIT');
    return res.json({ success: true, data: sanitizeRecord(domainKey, entityKey, updated.rows[0]) });
  } catch (error) {
    await client.query('ROLLBACK');
    return respondError(res, error, 'Failed to update platform domain record');
  } finally {
    client.release();
  }
};

const transitionRecord = async (req, res) => {
  const client = await getPool().connect();
  try {
    const { domainKey, entityKey, id } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    if (resource.readOnly || Object.keys(resource.lifecycle.columns).length === 0) {
      return res.status(405).json({ success: false, message: 'Lifecycle actions are not supported for this resource' });
    }
    const nextStatus = req.body?.status;
    const reason = typeof req.body?.reason === 'string' ? req.body.reason.trim().slice(0, 1000) : null;
    if (!['active', 'suspended', 'frozen', 'archived'].includes(nextStatus)) {
      return res.status(400).json({ success: false, message: 'Lifecycle status must be active, suspended, frozen, or archived' });
    }
    await client.query('BEGIN');
    const current = await client.query(`SELECT * FROM ${resource.table} WHERE id::text = $1 FOR UPDATE`, [id]);
    if (!current.rowCount) {
      const error = new Error('Record not found');
      error.statusCode = 404;
      throw error;
    }
    const state = await client.query(
      `SELECT * FROM platform_domain_management_state
       WHERE domain_key = $1 AND entity_key = $2 AND record_id = $3 FOR UPDATE`,
      [domainKey, entityKey, String(id)]
    );
    const currentState = state.rows[0];
    const before = current.rows[0];
    const previousPrior = currentState?.prior_status || {};
    const lifecycleColumns = resource.lifecycle.columns;
    const sourceColumns = Object.keys(lifecycleColumns);
    const priorStatus = nextStatus === 'active'
      ? null
      : (currentState?.lifecycle_status && currentState.lifecycle_status !== 'active'
        ? previousPrior
        : Object.fromEntries(sourceColumns.map(column => [column, before[column]])));
    const sourceUpdates = nextStatus === 'active' && currentState?.prior_status
      ? currentState.prior_status
      : Object.fromEntries(sourceColumns.map(column => [column, lifecycleColumns[column][nextStatus]]));
    const sets = [];
    const values = [];
    for (const [column, value] of Object.entries(sourceUpdates)) {
      if (value === undefined) continue;
      values.push(value);
      sets.push(`${column} = $${values.length}`);
    }
    if (resource.fields.some(item => item.name === 'updated_at')) sets.push('updated_at = NOW()');
    values.push(id);
    const updateResult = await client.query(
      `UPDATE ${resource.table} SET ${sets.join(', ')} WHERE id::text = $${values.length} RETURNING *`,
      values
    );
    await client.query(
      `INSERT INTO platform_domain_management_state
        (domain_key, entity_key, record_id, lifecycle_status, prior_status, archived_at, updated_at)
       VALUES ($1, $2, $3, $4, $5::jsonb, CASE WHEN $4 = 'archived' THEN NOW() ELSE NULL END, NOW())
       ON CONFLICT (domain_key, entity_key, record_id)
       DO UPDATE SET lifecycle_status = EXCLUDED.lifecycle_status,
         prior_status = EXCLUDED.prior_status, archived_at = EXCLUDED.archived_at, updated_at = NOW()`,
      [domainKey, entityKey, String(id), nextStatus, priorStatus ? JSON.stringify(priorStatus) : null]
    );
    const after = updateResult.rows[0];
    await audit(client, { domain: domainKey, entity: entityKey, id, action: nextStatus, actorId: getActorId(req), reason, before, after });
    await client.query('COMMIT');
    return res.json({
      success: true,
      data: { ...sanitizeRecord(domainKey, entityKey, after), management_status: nextStatus }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    return respondError(res, error, 'Failed to update platform domain lifecycle');
  } finally {
    client.release();
  }
};

const getAudit = async (req, res) => {
  try {
    getResource(req.params.domainKey, req.params.entityKey);
    const result = await getPool().query(
      `SELECT id, domain_key, entity_key, record_id, action, actor_id, reason,
              before_snapshot, after_snapshot, created_at
       FROM platform_domain_management_audit
       WHERE domain_key = $1 AND entity_key = $2 AND record_id = $3
       ORDER BY created_at DESC LIMIT 100`,
      [req.params.domainKey, req.params.entityKey, req.params.id]
    );
    return res.json({ success: true, data: result.rows });
  } catch (error) {
    return respondError(res, error, 'Failed to load platform domain audit history');
  }
};

const getAutomation = async (req, res) => {
  try {
    const { domainKey, entityKey } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    if (!resource.automation) return res.status(400).json({ success: false, message: 'Expiry automation is not supported for this resource' });
    const result = await getPool().query(
      `SELECT enabled, expiry_hours, updated_by, updated_at
       FROM platform_domain_automation_settings WHERE domain_key = $1 AND entity_key = $2`,
      [domainKey, entityKey]
    );
    return res.json({
      success: true,
      data: result.rows[0] || { enabled: false, expiry_hours: resource.automation.defaultHours }
    });
  } catch (error) {
    return respondError(res, error, 'Failed to load platform domain automation settings');
  }
};

const updateAutomation = async (req, res) => {
  try {
    const { domainKey, entityKey } = req.params;
    const { resource } = getResource(domainKey, entityKey);
    if (!resource.automation) return res.status(400).json({ success: false, message: 'Expiry automation is not supported for this resource' });
    const enabled = req.body?.enabled;
    const expiryHours = Number(req.body?.expiryHours ?? resource.automation.defaultHours);
    if (typeof enabled !== 'boolean' || !Number.isInteger(expiryHours) || expiryHours < 1 || expiryHours > 2160) {
      return res.status(400).json({ success: false, message: 'Provide enabled as a boolean and expiryHours between 1 and 2160' });
    }
    const result = await getPool().query(
      `INSERT INTO platform_domain_automation_settings
        (domain_key, entity_key, enabled, expiry_hours, updated_by, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       ON CONFLICT (domain_key, entity_key) DO UPDATE SET
         enabled = EXCLUDED.enabled, expiry_hours = EXCLUDED.expiry_hours,
         updated_by = EXCLUDED.updated_by, updated_at = NOW()
       RETURNING enabled, expiry_hours, updated_by, updated_at`,
      [domainKey, entityKey, enabled, expiryHours, getActorId(req) ? String(getActorId(req)) : null]
    );
    return res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    return respondError(res, error, 'Failed to update platform domain automation settings');
  }
};

module.exports = {
  getDefinitions,
  listRecords,
  createRecord,
  updateRecord,
  transitionRecord,
  getAudit,
  getAutomation,
  updateAutomation,
  DOMAINS
};
