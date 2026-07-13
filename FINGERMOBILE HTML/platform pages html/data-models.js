/**
 * FingerMobile Protocol Platform - Frontend Data Models
 * TypeScript-style data models matching database schema
 * Version: 1.0
 */

// ===== Member Model =====
/**
 * @typedef {Object} Member
 * @property {string} id - UUID
 * @property {string} membername - Unique username
 * @property {string} email - Email address
 * @property {string} [first_name] - First name
 * @property {string} [last_name] - Last name
 * @property {string} [phone_number] - Phone number
 * @property {string} [date_of_birth] - Date of birth (ISO date)
 * @property {string} [gender] - Gender
 * @property {string} [country] - Country
 * @property {string} [city] - City
 * @property {string} [profile_picture_url] - Profile picture URL
 * @property {string} [bio] - Bio text
 * @property {boolean} is_verified - Verification status
 * @property {boolean} is_active - Active status
 * @property {string} [last_login] - Last login timestamp (ISO)
 * @property {string} created_at - Creation timestamp (ISO)
 * @property {string} updated_at - Last update timestamp (ISO)
 */

const MemberModel = {
  // Create member from API response
  fromAPI(data) {
    return {
      id: data.id,
      membername: data.membername,
      email: data.email,
      first_name: data.first_name || null,
      last_name: data.last_name || null,
      phone_number: data.phone_number || null,
      date_of_birth: data.date_of_birth || null,
      gender: data.gender || null,
      country: data.country || null,
      city: data.city || null,
      profile_picture_url: data.profile_picture_url || null,
      bio: data.bio || null,
      is_verified: data.is_verified || false,
      is_active: data.is_active !== false,
      last_login: data.last_login || null,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Create API payload from member object
  toAPI(member) {
    return {
      first_name: member.first_name,
      last_name: member.last_name,
      bio: member.bio,
      country: member.country,
      city: member.city,
      profile_picture_url: member.profile_picture_url
    };
  },

  // Get display name
  getDisplayName(member) {
    if (member.first_name && member.last_name) {
      return `${member.first_name} ${member.last_name}`;
    }
    return member.membername;
  },

  // Get avatar URL
  getAvatarURL(member, size = 80) {
    return member.profile_picture_url || 
           `https://ui-avatars.com/api/?name=${encodeURIComponent(member.membername)}&size=${size}&background=0021f3&color=fff`;
  },

  // Validate member profile
  validate(member) {
    const errors = [];
    if (!member.membername || member.membername.length < 3) {
      errors.push('Membername must be at least 3 characters');
    }
    if (!member.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(member.email)) {
      errors.push('Valid email is required');
    }
    return { valid: errors.length === 0, errors };
  }
};

// ===== Session Model =====
/**
 * @typedef {Object} Session
 * @property {number} id - Session ID
 * @property {string} member_id - Member UUID
 * @property {string} session_token - Session token
 * @property {string} expires_at - Expiration timestamp (ISO)
 * @property {string} created_at - Creation timestamp (ISO)
 */

const SessionModel = {
  fromAPI(data) {
    return {
      id: data.id,
      member_id: data.member_id,
      session_token: data.session_token,
      expires_at: data.expires_at,
      created_at: data.created_at
    };
  },

  isExpired(session) {
    return new Date(session.expires_at) < new Date();
  },

  getTimeRemaining(session) {
    const now = new Date();
    const expires = new Date(session.expires_at);
    return expires - now;
  }
};

// ===== Wallet Model =====
/**
 * @typedef {Object} Wallet
 * @property {number} id - Wallet ID
 * @property {string} member_id - Member UUID
 * @property {number} balance - Current balance
 * @property {number} locked_balance - Locked balance
 * @property {string} currency_code - Currency code (FIC)
 * @property {string} status - Wallet status (active, frozen, closed)
 * @property {string} created_at - Creation timestamp (ISO)
 * @property {string} updated_at - Last update timestamp (ISO)
 */

const WalletModel = {
  fromAPI(data) {
    return {
      id: data.id,
      member_id: data.member_id,
      balance: parseFloat(data.balance) || 0,
      locked_balance: parseFloat(data.locked_balance) || 0,
      currency_code: data.currency_code || 'FIC',
      status: data.status || 'active',
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  },

  // Get total balance (balance + locked)
  getTotalBalance(wallet) {
    return wallet.balance + wallet.locked_balance;
  },

  // Format balance for display
  formatBalance(wallet, decimals = 2) {
    return `${wallet.balance.toFixed(decimals)} ${wallet.currency_code}`;
  },

  // Check if wallet is active
  isActive(wallet) {
    return wallet.status === 'active';
  },

  // Validate transfer
  validateTransfer(wallet, amount) {
    const errors = [];
    if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    }
    if (amount > wallet.balance) {
      errors.push('Insufficient balance');
    }
    return { valid: errors.length === 0, errors };
  }
};

// ===== Transaction Model =====
/**
 * @typedef {Object} Transaction
 * @property {number} id - Transaction ID
 * @property {string} from_member_id - Sender UUID
 * @property {string} to_member_id - Recipient UUID
 * @property {number} amount - Transaction amount
 * @property {string} currency_code - Currency code
 * @property {string} type - Transaction type (transfer, purchase, reward, etc.)
 * @property {string} [description] - Description
 * @property {string} status - Status (pending, completed, failed)
 * @property {string} created_at - Creation timestamp (ISO)
 */

const TransactionModel = {
  fromAPI(data) {
    return {
      id: data.id,
      from_member_id: data.from_member_id,
      to_member_id: data.to_member_id,
      amount: parseFloat(data.amount) || 0,
      currency_code: data.currency_code || 'FIC',
      type: data.type || 'transfer',
      description: data.description || null,
      status: data.status || 'pending',
      created_at: data.created_at
    };
  },

  // Get transaction type label
  getTypeLabel(transaction) {
    const labels = {
      transfer: 'Transfer',
      purchase: 'Purchase',
      reward: 'Reward',
      refund: 'Refund',
      stake: 'Stake',
      unstake: 'Unstake'
    };
    return labels[transaction.type] || transaction.type;
  },

  // Get transaction type icon
  getTypeIcon(transaction) {
    const icons = {
      transfer: '↔️',
      purchase: '🛒',
      reward: '🎁',
      refund: '↩️',
      stake: '🔒',
      unstake: '🔓'
    };
    return icons[transaction.type] || '💰';
  }
};

// ===== Message Model =====
/**
 * @typedef {Object} Message
 * @property {number} id - Message ID
 * @property {string} member_id - Sender UUID
 * @property {string} recipient_id - Recipient UUID
 * @property {string} message_type - Message type (text, image, file, etc.)
 * @property {string} content - Message content
 * @property {string} [file_url] - File URL (if applicable)
 * @property {string} status - Status (sent, delivered, read)
 * @property {string} created_at - Creation timestamp (ISO)
 */

const MessageModel = {
  fromAPI(data) {
    return {
      id: data.id,
      member_id: data.member_id,
      recipient_id: data.recipient_id,
      message_type: data.message_type || 'text',
      content: data.content || '',
      file_url: data.file_url || null,
      status: data.status || 'sent',
      created_at: data.created_at
    };
  },

  // Check if message is from current user
  isFromMe(message, currentMemberId) {
    return message.member_id === currentMemberId;
  },

  // Get message status label
  getStatusLabel(message) {
    const labels = {
      sent: 'Sent',
      delivered: 'Delivered',
      read: 'Read'
    };
    return labels[message.status] || message.status;
  },

  // Get message status icon
  getStatusIcon(message) {
    const icons = {
      sent: '✓',
      delivered: '✓✓',
      read: '✓✓'
    };
    return icons[message.status] || '✓';
  }
};

// ===== Conversation Model =====
/**
 * @typedef {Object} Conversation
 * @property {string} conversation_partner_id - Partner UUID
 * @property {string} partner_membername - Partner username
 * @property {string} [partner_profile_picture_url] - Partner avatar
 * @property {string} last_message - Last message content
 * @property {string} last_message_at - Last message timestamp (ISO)
 * @property {number} unread_count - Unread message count
 */

const ConversationModel = {
  fromAPI(data) {
    return {
      conversation_partner_id: data.conversation_partner_id,
      partner_membername: data.partner_membername,
      partner_profile_picture_url: data.partner_profile_picture_url || null,
      last_message: data.last_message || '',
      last_message_at: data.last_message_at,
      unread_count: parseInt(data.unread_count) || 0
    };
  },

  // Check if conversation has unread messages
  hasUnread(conversation) {
    return conversation.unread_count > 0;
  },

  // Get last message preview
  getLastMessagePreview(conversation, maxLength = 50) {
    const msg = conversation.last_message;
    if (msg.length <= maxLength) return msg;
    return msg.substring(0, maxLength) + '...';
  }
};

// ===== Forum Thread Model =====
/**
 * @typedef {Object} ForumThread
 * @property {number} id - Thread ID
 * @property {string} title - Thread title
 * @property {string} content - Thread content
 * @property {string} author_id - Author UUID
 * @property {string} author_membername - Author username
 * @property {string} [category_id] - Category ID
 * @property {string} [category_name] - Category name
 * @property {number} reply_count - Number of replies
 * @property {number} view_count - Number of views
 * @property {number} like_count - Number of likes
 * @property {boolean} is_pinned - Pinned status
 * @property {boolean} is_locked - Locked status
 * @property {string} created_at - Creation timestamp (ISO)
 * @property {string} updated_at - Last update timestamp (ISO)
 */

const ForumThreadModel = {
  fromAPI(data) {
    return {
      id: data.id,
      title: data.title,
      content: data.content,
      author_id: data.author_id,
      author_membername: data.author_membername,
      category_id: data.category_id || null,
      category_name: data.category_name || null,
      reply_count: parseInt(data.reply_count) || 0,
      view_count: parseInt(data.view_count) || 0,
      like_count: parseInt(data.like_count) || 0,
      is_pinned: data.is_pinned || false,
      is_locked: data.is_locked || false,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
  }
};

// ===== Group Model =====
/**
 * @typedef {Object} Group
 * @property {number} id - Group ID
 * @property {string} name - Group name
 * @property {string} [description] - Group description
 * @property {string} [avatar_url] - Group avatar URL
 * @property {number} member_count - Number of members
 * @property {boolean} is_private - Privacy setting
 * @property {string} created_by - Creator UUID
 * @property {string} created_at - Creation timestamp (ISO)
 */

const GroupModel = {
  fromAPI(data) {
    return {
      id: data.id,
      name: data.name,
      description: data.description || null,
      avatar_url: data.avatar_url || null,
      member_count: parseInt(data.member_count) || 0,
      is_private: data.is_private || false,
      created_by: data.created_by,
      created_at: data.created_at
    };
  }
};

// ===== Marketplace Item Model =====
/**
 * @typedef {Object} MarketplaceItem
 * @property {number} id - Item ID
 * @property {string} title - Item title
 * @property {string} description - Item description
 * @property {string[]} image_urls - Image URLs
 * @property {number} price - Item price
 * @property {string} currency_code - Currency code
 * @property {string} seller_id - Seller UUID
 * @property {string} seller_membername - Seller username
 * @property {string} category - Item category
 * @property {string} status - Status (available, sold, pending)
 * @property {string} created_at - Creation timestamp (ISO)
 */

const MarketplaceItemModel = {
  fromAPI(data) {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      image_urls: data.image_urls || [],
      price: parseFloat(data.price) || 0,
      currency_code: data.currency_code || 'FIC',
      seller_id: data.seller_id,
      seller_membername: data.seller_membername,
      category: data.category || 'general',
      status: data.status || 'available',
      created_at: data.created_at
    };
  },

  // Format price for display
  formatPrice(item) {
    return `${item.price.toFixed(2)} ${item.currency_code}`;
  }
};

// ===== Platform Stats Model =====
/**
 * @typedef {Object} PlatformStats
 * @property {number} total_members - Total member count
 * @property {number} active_members - Active member count
 * @property {number} total_messages - Total message count
 * @property {number} total_wallet_balance - Total FIC in circulation
 */

const PlatformStatsModel = {
  fromAPI(data) {
    return {
      total_members: parseInt(data.total_members) || 0,
      active_members: parseInt(data.active_members) || 0,
      total_messages: parseInt(data.total_messages) || 0,
      total_wallet_balance: parseFloat(data.total_wallet_balance) || 0
    };
  }
};

// ===== Export all models =====
window.Models = {
  Member: MemberModel,
  Session: SessionModel,
  Wallet: WalletModel,
  Transaction: TransactionModel,
  Message: MessageModel,
  Conversation: ConversationModel,
  ForumThread: ForumThreadModel,
  Group: GroupModel,
  MarketplaceItem: MarketplaceItemModel,
  PlatformStats: PlatformStatsModel
};
