const Member = require("./Member");
const Group = require("./Group");
const GroupMember = require("./GroupMember");
const BlogPost = require("./BlogPost");
const BlogCategory = require("./BlogCategory");
const Forum = require("./Forum");
const ForumThread = require("./ForumThread");
const ForumPost = require("./ForumPost");
const Event = require("./Event");
const Message = require("./Message");
const Publication = require("./Publication");
const Product = require("./Product");
const Transaction = require("./Transaction");
const Profile = require("./Profile");
const Content = require("./Content");
const Analytics = require("./Analytics");
const Game = require("./Game");
const Listing = require("./Listing");
const Wallet = require("./Wallet");
const Comment = require("./Comment");
const GameProgress = require("./GameProgress");
// const Member = require('./Member');  // This line was the duplicate - REMOVED
const DeveloperApplication = require("./DeveloperApplication");
const ApiKey = require("./ApiKey");
const WebhookEndpoint = require("./WebhookEndpoint");
const WebhookDelivery = require("./WebhookDelivery");
const ApiRateLimit = require("./ApiRateLimit");
const Connection = require("./Connection");
const Activity = require("./Activity");
const Notification = require("./Notification");
const Session = require("./Session");
const LoginHistory = require("./LoginHistory");
const PageNavigation = require("./PageNavigation"); // Added PageNavigation model

// member and Group associations
Member.hasMany(GroupMember, {foreignKey: "memberId",
  onDelete: "CASCADE" });
GroupMember.belongsTo(Member, {foreignKey: "memberId" });

// Group - GroupMember (One-to-Many)
Group.hasMany(GroupMember, {foreignKey: "groupId",
  onDelete: "CASCADE" });
GroupMember.belongsTo(Group, {foreignKey: "groupId" });

// member - Group (One-to-Many, for creator of the group)
Member.hasMany(Group, {foreignKey: "creatorId",
  as: "CreatedGroups",
  onDelete: "SET NULL"
});
Group.belongsTo(Member, {foreignKey: "creatorId",
  as: "Creator" });

// Blog Post Associations
Member.hasMany(BlogPost, {foreignKey: "authorId",
  as: "BlogPosts" });
BlogPost.belongsTo(Member, {foreignKey: "authorId",
  as: "Author" });

BlogCategory.hasMany(BlogPost, {foreignKey: "categoryId",
  as: "BlogPosts" });
BlogPost.belongsTo(BlogCategory, {foreignKey: "categoryId",
  as: "Category" });

// Forum Associations
Member.hasMany(ForumThread, {foreignKey: "memberId",
  as: "ForumThreads" });
ForumThread.belongsTo(Member, {foreignKey: "memberId",
  as: "Author" });

Forum.hasMany(ForumThread, {foreignKey: "forumId",
  as: "Threads" });
ForumThread.belongsTo(Forum, {foreignKey: "forumId",
  as: "Forum" });

Member.hasMany(ForumPost, {foreignKey: "memberId",
  as: "ForumPosts" });
ForumPost.belongsTo(Member, {foreignKey: "memberId",
  as: "Author" });

ForumThread.hasMany(ForumPost, {foreignKey: "threadId",
  as: "Posts" });
ForumPost.belongsTo(ForumThread, {foreignKey: "threadId",
  as: "Thread" });

ForumPost.hasMany(ForumPost, {foreignKey: "parentPostId",
  as: "Replies" });
ForumPost.belongsTo(ForumPost, {foreignKey: "parentPostId",
  as: "ParentPost"
});

// Event associations
Member.hasMany(Event, {foreignKey: "creatorId",
  as: "createdEvents" });
Event.belongsTo(Member, {foreignKey: "creatorId",
  as: "creator" });
Group.hasMany(Event, {foreignKey: "groupId",
  as: "events" });
Event.belongsTo(Group, {foreignKey: "groupId",
  as: "group" });

// Message associations
Member.hasMany(Message, {foreignKey: "senderId",
  as: "sentMessages" });
Message.belongsTo(Member, {foreignKey: "senderId",
  as: "sender" });
Member.hasMany(Message, {foreignKey: "receiverId",
  as: "receivedMessages" });
Message.belongsTo(Member, {foreignKey: "receiverId",
  as: "receiver" });
Group.hasMany(Message, {foreignKey: "groupId",
  as: "groupMessages" });
Message.belongsTo(Group, {foreignKey: "groupId",
  as: "group" });

// Publication associations
Member.hasMany(Publication, {foreignKey: "authorId",
  as: "publications" });
Publication.belongsTo(Member, {foreignKey: "authorId",
  as: "author" });

// Product associations
Member.hasMany(Product, {foreignKey: "sellerId",
  as: "products" });
Product.belongsTo(Member, {foreignKey: "sellerId",
  as: "seller" });

// Transaction associations
Member.hasMany(Transaction, {as: "SentTransactions",
  foreignKey: "senderId" });
Transaction.belongsTo(Member, {as: "Sender",
  foreignKey: "senderId" });
Member.hasMany(Transaction, {as: "ReceivedTransactions",
  foreignKey: "receiverId"
});
Transaction.belongsTo(Member, {as: "Receiver",
  foreignKey: "receiverId" });

// Profile associations
Member.hasOne(Profile, {foreignKey: "memberId",
  onDelete: "CASCADE" });
Profile.belongsTo(Member, {foreignKey: "memberId" });

// Content associations
Member.hasMany(Content, {foreignKey: "memberId",
  onDelete: "CASCADE" });
Content.belongsTo(Member, {foreignKey: "memberId" });

// Analytics associations
Member.hasMany(Analytics, {foreignKey: "memberId",
  onDelete: "SET NULL" });
Analytics.belongsTo(Member, {foreignKey: "memberId" });

// Game associations
Member.hasMany(Game, {foreignKey: "creatorId",
  as: "createdGames" });
Game.belongsTo(Member, {foreignKey: "creatorId",
  as: "creator" });

Member.hasMany(GameProgress, {foreignKey: "memberId",
  as: "gameProgress" });
GameProgress.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Listing associations
Member.hasMany(Listing, {foreignKey: "memberId",
  as: "listings" });
Listing.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Wallet associations
Member.hasOne(Wallet, {foreignKey: "memberId",
  as: "wallet" });
Wallet.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Comment associations
Member.hasMany(Comment, {foreignKey: "memberId",
  as: "comments" });
Comment.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });
Content.hasMany(Comment, {foreignKey: "contentId",
  as: "comments" });
Comment.belongsTo(Content, {foreignKey: "contentId",
  as: "content" });

// Developer Application associations
Member.hasMany(DeveloperApplication, {foreignKey: "memberId",
  as: "developerApplications"
});
DeveloperApplication.belongsTo(Member, {foreignKey: "memberId",
  as: "member"
});

// API Key associations
Member.hasMany(ApiKey, {foreignKey: "memberId",
  as: "apiKeys" });
ApiKey.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Webhook associations
Member.hasMany(WebhookEndpoint, {foreignKey: "memberId",
  as: "webhookEndpoints"
});
WebhookEndpoint.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

WebhookEndpoint.hasMany(WebhookDelivery, {foreignKey: "endpointId",
  as: "deliveries"
});
WebhookDelivery.belongsTo(WebhookEndpoint, {foreignKey: "endpointId",
  as: "endpoint"
});

// Connection associations (Friend/Follower system)
Member.hasMany(Connection, {foreignKey: "requesterId",
  as: "sentConnections"
});
Connection.belongsTo(Member, {foreignKey: "requesterId",
  as: "requester" });

Member.hasMany(Connection, {foreignKey: "recipientId",
  as: "receivedConnections"
});
Connection.belongsTo(Member, {foreignKey: "recipientId",
  as: "recipient" });

// Activity associations
Member.hasMany(Activity, {foreignKey: "memberId",
  as: "activities" });
Activity.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Notification associations
Member.hasMany(Notification, {foreignKey: "memberId",
  as: "notifications" });
Notification.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// Session associations
Member.hasMany(Session, {foreignKey: "memberId",
  as: "sessions" });
Session.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// LoginHistory associations
Member.hasMany(LoginHistory, {foreignKey: "memberId",
  as: "loginHistory" });
LoginHistory.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

// PageNavigation associations
Member.hasMany(PageNavigation, {foreignKey: "memberId",
  as: "pageNavigations"
});
PageNavigation.belongsTo(Member, {foreignKey: "memberId",
  as: "member" });

Session.hasMany(PageNavigation, {foreignKey: "sessionId",
  as: "pageNavigations"
});
PageNavigation.belongsTo(Session, {foreignKey: "sessionId",
  as: "session" });

// Member associations

module.exports = {
  Member,
  Group,
  GroupMember,
  BlogPost,
  BlogCategory,
  Forum,
  ForumThread,
  ForumPost,
  Event,
  Message,
  Publication,
  Product,
  Transaction,
  Profile,
  Content,
  Analytics,
  Game,
  GameProgress,
  Listing,
  Wallet,
  Comment,
  DeveloperApplication,
  ApiKey,
  WebhookEndpoint,
  WebhookDelivery,
  ApiRateLimit,
  // Member,  // This was the duplicate export - REMOVED
  Connection,
  Activity,
  Notification,
  Session,
  LoginHistory,
  PageNavigation, // Export PageNavigation model
};
