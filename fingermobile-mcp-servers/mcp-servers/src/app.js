require("dotenv").config();
const express = require("express");
const http = require("http");
const https = require("https");
const fs = require("fs");
const socketIo = require("socket.io");
const path = require("path");
const cors = require("cors");

// Import model associations
require("./models/associations");

const sequelize = require("./config/database");

// Synchronize only specific models that belong to this database
// Skip auto-sync of models that would create cross-database foreign key constraints
// which PostgreSQL does not support
async function syncDatabase() {
  try {
    // Rather than syncing all models which creates cross-database FK constraints,
    // we'll just verify the connection works and let the tables be created separately
    await sequelize.authenticate();
    console.log("Database connection established successfully.");
  } catch (err) {
    console.error("Error connecting to,
database:", err);
  }
}

// Call the modified sync function
syncDatabase();

// Import routes
const authRoutes = require("./routes/auth");
const projectRoutes = require("./routes/projects"); // New projects route
const taskRoutes = require("./routes/tasks"); // New tasks route
const postRoutes = require("./routes/posts");
const livestreamRoutes = require("./routes/livestreams");
const marketplaceRoutes = require("./routes/marketplace");
const flamingoRoutes = require("./routes/flamingo");
const financialRoutes = require("./routes/financials");
const aiRoutes = require("./routes/ai");
const web3Routes = require("./routes/web3");
const communicationRoutes = require("./routes/communication");
const dashboardRoutes = require("./routes/dashboard");
const musicRoutes = require("./routes/music");
const adminMusicRoutes = require("./routes/adminMusic");
const adminArtistRoutes = require("./routes/adminArtist");
const adminRoyaltyRoutes = require("./routes/adminRoyalty");
const wordModerationRoutes = require("./routes/wordModeration");
const subscriptionRoutes = require("./routes/subscription");
const monetizationRoutes = require("./routes/monetization");
const paylinkRoutes = require("./routes/paylinks");
const p2pMatchingRoutes = require("./routes/p2pMatching");
const gemsRoutes = require("./routes/gems");
const loyaltyRoutes = require("./routes/loyalty");
const groupsRoutes = require("./routes/groups");
const groupRoutes = require("./routes/groups");
const memberDirectoryRoutes = require("./routes/memberDirectory");
const blogRoutes = require("./routes/blog");
const forumRoutes = require("./routes/forum");
const eventRoutes = require("./routes/event");
const messageRoutes = require("./routes/message");
const publicationRoutes = require("./routes/publication");
const productRoutes = require("./routes/product");
const transactionRoutes = require("./routes/transaction");
const profileRoutes = require("./routes/profile");
const privacySettingsRoutes = require("./routes/privacySettings"); // Added privacy settings route
const accountSettingsRoutes = require("./routes/accountSettings"); // Added account settings route
const securitySettingsRoutes = require("./routes/securitySettings"); // Added security settings route
const connectionsRoutes = require("./routes/connections"); // Added connections route
const activitiesRoutes = require("./routes/activities"); // Added activities route
const notificationsRoutes = require("./routes/notifications"); // Added notifications route
const conversationsRoutes = require("./routes/conversations"); // Added conversations route
const memberBlockingRoutes = require("./routes/memberBlocking"); // Changed from memberBlocking to memberBlocking
const contentModerationRoutes = require("./routes/contentModeration"); // Added content moderation route
const sessionsRoutes = require("./routes/sessions"); // Added sessions route
const loginHistoryRoutes = require("./routes/loginHistory"); // Added login history route
const loginAnalyticsRoutes = require("./routes/loginAnalytics"); // Added login analytics route
const pageNavigationRoutes = require("./routes/pageNavigation"); // Added page navigation route
const twoFactorAuthRoutes = require("./routes/twoFactorAuth"); // Added two-factor authentication route
const contentRoutes = require("./routes/content");
const analyticsRoutes = require("./routes/analytics");
const gameRoutes = require("./routes/game");
const listingRoutes = require("./routes/listing");
const walletRoutes = require("./routes/wallet");
const commentRoutes = require("./routes/comment");
const gameProgressRoutes = require("./routes/gameProgress");
const discoveryRoutes = require("./routes/discovery");
const ppvRoutes = require("./routes/ppv");
const thirdPartyIntegrationRoutes = require("./routes/thirdPartyIntegration");
const developerPortalRoutes = require("./routes/developerPortalRoutes");
const policyRoutes = require("./routes/policyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const newMcpServerRoutes = require("./routes/newMcpServer");

// ML routes
const mlRoutes = require("./routes/ml");
const multer = require("multer");
const { loadBlockedWords } = require("./utils/wordModeration");
const cacheMiddleware = require("./middleware/cacheMiddleware");
const policyEnforcementMiddleware = require("./middleware/policyEnforcementMiddleware");

// Import middleware
// const { authenticate } = require('./middleware/auth');

// Import configurations
const webrtcConfig = require("../config/webrtc-config");

// Create Express app
const app = express();

let server;

const privateKeyPath = path.join(__dirname, "../certs", "key.pem");
const certificatePath = path.join(__dirname, "../certs", "cert.pem");

if (fs.existsSync(privateKeyPath) && fs.existsSync(certificatePath)) {
  const privateKey = fs.readFileSync(privateKeyPath, "utf8");
  const certificate = fs.readFileSync(certificatePath, "utf8");
  const credentials = {key: privateKey,
  cert: certificate };
  server = https.createServer(credentials, app);
  console.log("HTTPS server enabled.");
  server.isHTTPS = true;
} else {
  server = http.createServer(app);
  console.log("HTTPS certificates not found. Running HTTP server.");
  server.isHTTPS = false;
}

const io = socketIo(server, webrtcConfig.socketConfig);

loadBlockedWords(); // Load blocked words on startup

// Middleware
app.use(
  cors({origin: process.env.FRONTEND_URL || ",
  http://,
  localhost:5173", // Allow requests from the Vite dev server,
  credentials: true
  }),
);
app.use(express.json({limit: "50mb" }));
app.use(express.urlencoded({extended: true,
  limit: "50mb" }));
app.use(policyEnforcementMiddleware);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes); // Added projects route
app.use("/api/tasks", taskRoutes); // Added tasks route
app.use("/api/posts", postRoutes);
app.use("/api/livestreams", livestreamRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/flamingo", flamingoRoutes);
app.use("/api/financials", financialRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/web3", web3Routes);
app.use("/api/communication", communicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/music", musicRoutes);
app.use("/api/admin/music", adminMusicRoutes);
app.use("/api/admin/artist", adminArtistRoutes);
app.use("/api/admin/royalty", adminRoyaltyRoutes);
app.use("/api/moderation/words", wordModerationRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/monetization", monetizationRoutes);
app.use("/api/paylinks", paylinkRoutes);
app.use("/api/p2p", p2pMatchingRoutes);
app.use("/api/gems", gemsRoutes);
app.use("/api/loyalty", loyaltyRoutes);
app.use("/api/groups", groupsRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/directory", memberDirectoryRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/publications", publicationRoutes);
app.use("/api/products", cacheMiddleware, productRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/privacy-settings", privacySettingsRoutes); // Added privacy settings route
app.use("/api/account-settings", accountSettingsRoutes); // Added account settings route
app.use("/api/security-settings", securitySettingsRoutes); // Added security settings route
app.use("/api/connections", connectionsRoutes); // Added connections route
app.use("/api/activities", activitiesRoutes); // Added activities route
app.use("/api/notifications", notificationsRoutes); // Added notifications route
app.use("/api/conversations", conversationsRoutes); // Added conversations route
app.use("/api/blocking", memberBlockingRoutes); // Changed from memberBlockingRoutes to memberBlockingRoutes
app.use("/api/moderation/words", wordModerationRoutes); // Added word moderation route
app.use("/api/moderation", contentModerationRoutes); // Added content moderation route
app.use("/api/sessions", sessionsRoutes); // Added sessions route
app.use("/api/login-history", loginHistoryRoutes); // Added login history route
app.use("/api/login-analytics", loginAnalyticsRoutes); // Added login analytics route
app.use("/api/page-navigation", pageNavigationRoutes); // Added page navigation route
app.use("/api/2fa", twoFactorAuthRoutes); // Added two-factor authentication route
app.use("/api/content", cacheMiddleware, contentRoutes);
app.use("/api/analytics", cacheMiddleware, analyticsRoutes);
app.use("/api/games", cacheMiddleware, gameRoutes);
app.use("/api/listings", cacheMiddleware, listingRoutes);
app.use("/api/wallets", cacheMiddleware, walletRoutes);
app.use("/api/comments", cacheMiddleware, commentRoutes);
app.use("/api/game-progress", cacheMiddleware, gameProgressRoutes);
app.use("/api/discovery", cacheMiddleware, discoveryRoutes);
app.use("/api/ppv", cacheMiddleware, ppvRoutes);
app.use("/api/integrations", thirdPartyIntegrationRoutes);
app.use("/api/developer", developerPortalRoutes);
app.use("/api/policies", policyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/new-mcp-server", newMcpServerRoutes);

// ML routes
app.use("/api/ml", mlRoutes);

// Multer configuration for file uploads
const storage = multer.memoryStorage(); // Store files in memory as buffers
const upload = multer({storage: storage,
  limits: {,
  fileSize: 100 * 1024 * 1024 }, // 100MB file size limit
});

// Apply multer middleware specifically to the music upload route
app.use(
  "/api/music/upload",
  upload.fields([
    {name: "audio",
  maxCount: 1 },
    {name: "coverArt",
  maxCount: 1 }
  ]),
);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({status: "OK",
  message: "FingerMobile Protocol API is running",
  timestamp: new Date().toISOString()
  });
});

// WebSockets for real-time communication
io.on("connection", (socket) => {
  // Handle disconnection
  socket.on("disconnect", () => {});

  // Handle chat messages
  socket.on("chat-message", (data) => {
    io.emit("chat-message", data);
  });

  // Handle signaling for WebRTC
  socket.on("offer", (data) => {
    socket.broadcast.emit("offer", data);
  });

  socket.on("answer", (data) => {
    socket.broadcast.emit("answer", data);
  });

  socket.on("ice-candidate", (data) => {
    socket.broadcast.emit("ice-candidate", data);
  });

  // Handle live streaming events
  socket.on("start-stream", (data) => {
    socket.broadcast.emit("stream-started", data);
  });

  socket.on("stop-stream", (data) => {
    socket.broadcast.emit("stream-stopped", data);
  });
});

// Error handler
app.use((err, req, res /* next */) => {
  res.status(500).json({message: "Internal server error"
  });
});

module.exports = { app, server, io };
