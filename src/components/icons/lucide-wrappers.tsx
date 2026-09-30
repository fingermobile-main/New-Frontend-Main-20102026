import { Link} from 'react-router-dom';
// Explicit wrapper components for Lucide icons to help TypeScript resolution
// NOTE: Icons already in core/ui.tsx are EXCLUDED to avoid duplicate export errors
import {
  Filter, Grid3x3, List, Gamepad2, Play, CirclePlay,
  MessageSquare, MessageCircle, UsersRound, Linkedin, Facebook,
  Instagram, Twitter, Mail, LogIn, DollarSign,
  Wallet, TrendingUp, Building2, Package, Ticket,
  Image, Download, MoreHorizontal, Music, Youtube, Users, User,
  Scale, Database, FolderDown, ClipboardCheck, ClipboardList,
  Wand2, ArrowUpDown, Pin, Shuffle, Handshake, Coins, Trophy,
  Shield, Sparkles, Flame,
  Gem, Flower2, Smartphone, Award, Vault, GraduationCap, BookOpen,
  Globe, Bell, Settings, LayoutDashboard, CircleUser, Megaphone,
  Mic, Volume2, Camera, FileText, Folder,
  Upload, Share2, Star, ThumbsUp, ThumbsDown, Flag, Trash2,
  Edit, Eye, EyeOff, Unlock, Key, AtSign, Hash, Tag, Bookmark,
  SlidersHorizontal, MoreVertical, ChevronLeft, ChevronRight,
  ChevronUp, ChevronDown, RefreshCw, RotateCw, Zap, Battery, Wifi, Signal, Bluetooth,
  QrCode, CreditCard, Euro, PoundSterling, Percent, Calculator,
  Gavel, IdCard, Receipt, Box, Layers, Grid, Columns, Rows, Table,
  ChartPie, Activity, Server, HardDrive, Cpu, Terminal,
  Code, GitBranch, GitCommit, GitPullRequest, Github, Gitlab,
  Slack, Twitch
} from 'lucide-react';
import React from 'react';

// Export each icon as a properly typed React component
// EXCLUDING icons that already exist in core/ui.tsx
export const FilterIcon = Filter;
export const ViewGridIcon = Grid3x3;
export const ViewListIcon = List;
export const GridIcon = Grid3x3;
// SearchIcon excluded - exists in core/ui.tsx
export const MagnifyingGlassIcon = Filter; // Alternative
export const GamepadIcon = Gamepad2;
export const GameIcon = Gamepad2;
export const CanaryIcon = Play;
export const LiveIcon = CirclePlay;
export const ChatIcon = MessageSquare;
export const ChatAlt2Icon = MessageCircle;
export const PhoneGroupIcon = UsersRound;
export const LinkedInIcon = Linkedin;
export const FacebookIcon = Facebook;
export const InstagramIcon = Instagram;
export const TikTokIcon = Twitter;
export const MailIcon = Mail;
export const YahooIcon = Mail;
export const GoogleIcon = LogIn;
export const CartIcon = undefined as any; // ShoppingCart excluded - exists in core/ui.tsx
export const CurrencyNairaIcon = DollarSign;
export const FinancialsIcon = Wallet;
export const EarningsIcon = TrendingUp;
export const ReferralIcon = Users;
export const LoyaltyIcon = Award;
export const VaultIcon = Lock;
export const BankIcon = Building2;
export const PaylinkIcon = undefined as any; // Link excluded - exists in core/ui.tsx
export const OrdersIcon = Package;
export const CouponsIcon = Ticket;
// GiftCardIcon removed - now exported from core/ui.tsx
export const CollectionIcon = Image;
export const DownloadIcon = Download;
export const DotsHorizontalIcon = MoreHorizontal;
export const MusicNoteIcon = Music;
export const CamusIcon = Youtube;
export const MemberGroupIcon = Users;
export const MemberIcon = User;
export const PolicyIcon = Scale;
export const DatabaseIcon = Database;
export const MyDownloadsIcon = FolderDown;
export const ClipboardCheckIcon = ClipboardCheck;
export const ClipboardListIcon = ClipboardList;
export const MagicWandIcon = Wand2;
export const SortIcon = ArrowUpDown;
export const PinIcon = Pin;
export const ShuffleIcon = Shuffle;
export const HandshakeIcon = Handshake;
export const TokenIcon = Coins;
// AwardIcon excluded - exists in core/ui.tsx
// ShieldIcon excluded - ShieldCheckIcon exists in core/ui.tsx
// LocationMarkerIcon excluded - MapPin exists in core/ui.tsx
export const StoreIcon = undefined as any;
export const StorefrontIcon = undefined as any;
export const MarketplaceIcon = undefined as any;
export const BuildingOfficeIcon = Building2;
export const OwnitIcon = Sparkles;
export const FlamingoIcon = Flame;
export const GemIcon = Gem;
export const RoseIcon = Flower2;
// Add missing icons required by constants/index.ts and other files
export const CreditCardIcon = CreditCard;
export const Squares2X2Icon = Grid;
export const AdjustmentsHorizontalIcon = SlidersHorizontal;
export const LockOpenIcon = Unlock;
export const SignalIcon = Signal;
export const WifiIcon = Wifi;
export const CubeIcon = Box;
export const TagIcon = Tag;
export const HashtagIcon = Hash;
export const ArrowPathIcon = RefreshCw;
export const ChartPieIcon = ChartPie;
export const CommandLineIcon = Terminal;
export const ChevronDownIcon = ChevronDown;
export const ChevronRightIcon = ChevronRight;
export const BookmarkIcon = Bookmark;
export const MegaphoneIcon = Megaphone;
export const TrendingUpIcon = TrendingUp;
export const MembersIcon = Users;
