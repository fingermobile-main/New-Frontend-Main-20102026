/**
 * SuperViModels - Centralized Model Exports and Association Definitions
 *
 * This module re-exports all available Sequelize models and defines
 * their inter-model associations. Models self-initialize via their
 * own .init() or sequelize.define() calls, so no external
 * .initialize() invocation is needed here.
 *
 * NOTE: Only models that exist as actual files are imported.
 * The dynamic loader in models/index.ts handles runtime discovery.
 */

/* eslint-disable @typescript-eslint/no-var-requires */

// ── Database ────────────────────────────────────────────────────────
import { sequelize } from '../config/database';

// ── JS models (CommonJS default exports) ────────────────────────────
// These use `module.exports = ModelName`
const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Cart = require('./Cart');
const Category = require('./Category');
const Notification = require('./Notification');
const Post = require('./Post');
const ProductImage = require('./ProductImage');

// These use `module.exports = { ModelName }` (destructured)
const { Conversation } = require('./Conversation');
const { Message } = require('./Message');

// Coupon uses a factory pattern: module.exports = (sequelize, DataTypes) => Coupon
// We invoke the factory with the sequelize instance and DataTypes
import { DataTypes } from 'sequelize';
const CouponFactory = require('./Coupon');
const Coupon = typeof CouponFactory === 'function'
  ? CouponFactory(sequelize, DataTypes)
  : CouponFactory;

// ── TS models (ESM default exports) ─────────────────────────────────
import ForumCategory from './ForumCategory';
import ForumThread from './ForumThread';
import ForumPost from './ForumPost';
import UserLike from './UserLike';
import SavedPost from './SavedPost';
import ForumNotification from './ForumNotification';
import ForumReport from './ForumReport';
import ForumSubscription from './ForumSubscription';
import ForumPollVote from './ForumPollVote';
import ForumActivityType from './ForumActivityType';
import VideoRoom from './VideoRoom';
import ForumSearchHistory from './ForumSearchHistory';
import ForumModerationAction from './ForumModerationAction';
import Moderator from './Moderator';
import ModeratorRole from './ModeratorRole';
import BadgeHolderEvent from './BadgeHolderEvent';

// ── Associations ────────────────────────────────────────────────────
export const defineAssociations = (): void => {
  // ─ User → Social / Content ────────────────────────────────────────
  User.hasMany(Post, { foreignKey: 'authorId', as: 'posts' });
  User.hasMany(Notification, { foreignKey: 'recipientId', as: 'notifications' });
  User.hasMany(Product, { foreignKey: 'sellerId', as: 'productsSold' });
  User.hasMany(Order, { foreignKey: 'customerId', as: 'orders' });
  User.hasMany(Cart, { foreignKey: 'userId', as: 'cart' });
  User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
  User.hasMany(Message, { foreignKey: 'receiverId', as: 'receivedMessages' });
  User.hasMany(Conversation, { foreignKey: 'participant1Id', as: 'conversationsAsParticipant1' });
  User.hasMany(Conversation, { foreignKey: 'participant2Id', as: 'conversationsAsParticipant2' });

  // ─ User → Forum ──────────────────────────────────────────────────
  User.hasMany(ForumThread, { foreignKey: 'authorId', as: 'threads' });
  User.hasMany(ForumPost, { foreignKey: 'authorId', as: 'forumPosts' });
  User.hasMany(UserLike, { foreignKey: 'userId', as: 'userLikes' });
  User.hasMany(SavedPost, { foreignKey: 'userId', as: 'savedPosts' });
  User.hasMany(ForumNotification, { foreignKey: 'userId', as: 'forumNotifications' });
  User.hasMany(ForumReport, { foreignKey: 'reporterId', as: 'forumReportsMade' });
  User.hasMany(ForumReport, { foreignKey: 'moderatorId', as: 'moderationReports' });
  User.hasMany(ForumSubscription, { foreignKey: 'userId', as: 'subscriptions' });
  User.hasMany(ForumPollVote, { foreignKey: 'userId', as: 'pollVotes' });
  User.hasMany(VideoRoom, { foreignKey: 'creatorId', as: 'createdRooms' });
  User.hasMany(ForumSearchHistory, { foreignKey: 'userId', as: 'searchHistory' });
  User.hasMany(ForumModerationAction, { foreignKey: 'moderatorId', as: 'moderationActions' });
  User.hasMany(Moderator, { foreignKey: 'userId', as: 'moderatorRoles' });

  // ─ Forum Category ────────────────────────────────────────────────
  ForumCategory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ForumCategory.hasMany(ForumThread, { foreignKey: 'categoryId', as: 'threads' });
  ForumCategory.hasMany(Moderator, { foreignKey: 'forumId', as: 'moderators' });

  // ─ Forum Thread ──────────────────────────────────────────────────
  ForumThread.belongsTo(ForumCategory, { foreignKey: 'categoryId', as: 'category' });
  ForumThread.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
  ForumThread.hasMany(ForumPost, { foreignKey: 'threadId', as: 'threadPosts' });
  ForumThread.hasMany(ForumSubscription, { foreignKey: 'threadId', as: 'subscribers' });
  ForumThread.hasMany(ForumPollVote, { foreignKey: 'threadId', as: 'votes' });
  ForumThread.hasOne(ForumActivityType, { foreignKey: 'threadId', as: 'activityType' });

  // ─ Forum Post ────────────────────────────────────────────────────
  ForumPost.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });
  ForumPost.belongsTo(User, { foreignKey: 'authorId', as: 'author' });
  ForumPost.belongsTo(ForumPost, { foreignKey: 'parentPostId', as: 'parent' });
  ForumPost.hasMany(ForumPost, { foreignKey: 'parentPostId', as: 'replies' });
  ForumPost.hasMany(UserLike, {
    foreignKey: 'targetId', as: 'postLikes',
    constraints: false, scope: { targetType: 'forum_post' },
  });
  ForumPost.hasMany(SavedPost, { foreignKey: 'postId', as: 'savedInstances' });
  ForumPost.hasMany(ForumReport, {
    foreignKey: 'targetId', as: 'postReports',
    constraints: false, scope: { targetType: 'forum_post' },
  });

  // ─ UserLike / SavedPost ──────────────────────────────────────────
  UserLike.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  SavedPost.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  SavedPost.belongsTo(ForumPost, { foreignKey: 'postId', as: 'post' });

  // ─ Forum Notification / Report / Subscription ────────────────────
  ForumNotification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ForumReport.belongsTo(User, { foreignKey: 'reporterId', as: 'reporter' });
  ForumReport.belongsTo(User, { foreignKey: 'moderatorId', as: 'moderator' });
  ForumSubscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ForumSubscription.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });

  // ─ Forum Poll / Activity / Search / Moderation ───────────────────
  ForumPollVote.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ForumPollVote.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });
  ForumActivityType.belongsTo(ForumThread, { foreignKey: 'threadId', as: 'thread' });
  VideoRoom.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });
  ForumSearchHistory.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  ForumModerationAction.belongsTo(User, { foreignKey: 'moderatorId', as: 'moderator' });

  // ─ Moderator ─────────────────────────────────────────────────────
  Moderator.belongsTo(User, { foreignKey: 'userId', as: 'user' });
  Moderator.belongsTo(ForumCategory, { foreignKey: 'forumId', as: 'forum' });

  // ─ Post (blog/social) ────────────────────────────────────────────
  Post.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

  // ─ Conversation / Message ────────────────────────────────────────
  Conversation.belongsTo(User, { foreignKey: 'participant1Id', as: 'participant1' });
  Conversation.belongsTo(User, { foreignKey: 'participant2Id', as: 'participant2' });
  Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
  Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
  Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
  Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

  // ─ Notification ──────────────────────────────────────────────────
  Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });
  Notification.belongsTo(User, { foreignKey: 'senderId', as: 'notificationSender' });

  // ─ Product / Category / Order ────────────────────────────────────
  Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
  Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
  Product.hasMany(ProductImage, { foreignKey: 'productId', as: 'images' });
  Product.hasMany(OrderItem, { foreignKey: 'productId', as: 'orderItems' });
  Category.hasMany(Product, { foreignKey: 'categoryId', as: 'products' });
  Order.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
  Order.hasMany(OrderItem, { foreignKey: 'orderId', as: 'items' });
  OrderItem.belongsTo(Order, { foreignKey: 'orderId', as: 'order' });
  OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

  // ─ Cart ──────────────────────────────────────────────────────────
  Cart.belongsTo(User, { foreignKey: 'userId', as: 'user' });
};

// ── Exports ─────────────────────────────────────────────────────────
export {
  User,
  Product,
  Order,
  OrderItem,
  Cart,
  Category,
  Coupon,
  Notification,
  Conversation,
  Message,
  Post,
  ProductImage,
  ForumCategory,
  ForumThread,
  ForumPost,
  UserLike,
  SavedPost,
  ForumNotification,
  ForumReport,
  ForumSubscription,
  ForumPollVote,
  ForumActivityType,
  VideoRoom,
  ForumSearchHistory,
  ForumModerationAction,
  Moderator,
  ModeratorRole,
  BadgeHolderEvent,
};