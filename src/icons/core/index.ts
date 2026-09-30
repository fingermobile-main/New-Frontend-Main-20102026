import { Link} from 'react-router-dom';
// Core UI Icons - Custom SVG icons for the platform
// Consolidated from core/ui.tsx and missing_icons.ts (duplicates removed)
import { I } from '../factory';

// ===== Navigation & Layout Icons =====
export const HomeIcon = I('M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6');
export const MenuIcon = I('M4 6h16M4 12h16M4 18h16');
export const CogIcon = I('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37.996.608 2.296.07 2.572-1.065z', 'M15 12a3 3 0 11-6 0 3 3 0 016 0z');

// ===== User & Profile Icons =====
export const UserIcon = I('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-4 6m8 0a7 7 0 00-4-6m-4 6a7 7 0 01-4-6m8 0a7 7 0 01-4 6');
export const UserCircleIcon = I('M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z');
export const UserGroupIcon = I('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h8v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 00-6 0 2.5 2.5 0 006 0z');
export const UsersIcon = I('M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h8v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 00-6 0v.05a2.5 2.5 0 01-5 0v-.05a2.5 2.5 0 00-6 0v.75a.75.75 0 00.75.75h.75a.75.75 0 01.75.75v3.75a.75.75 0 01-.75.75h-.75a.75.75 0 00-.75.75v.75c0 1.379 1.122 2.5 2.5 2.5h8.25c1.378 0 2.5-1.121 2.5-2.5v-.75a.75.75 0 00-.75-.75h-.75a.75.75 0 01-.75-.75v-3.75a.75.75 0 01.75-.75h.75a.75.75 0 00.75-.75v-.75a2.5 2.5 0 00-2.5-2.5H12z');

// ===== Action Icons =====
export const SearchIcon = I('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z');
export const MagnifyingGlassIcon = I('M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'); // Alias for SearchIcon
export const PlusIcon = I('M12 6v6m0 0v6m0-6h6m-6 0H6');
export const MinusIcon = I('M20 12H4');
export const CheckIcon = I('M5 13l4 4L19 7');
export const XIcon = I('M6 18L18 6M6 6l12 12');
export const TrashIcon = I('M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16');
export const PencilIcon = I('M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z');

// ===== Arrow Icons =====
export const ArrowLeftIcon = I('M10 19l-7-7m0 0l7-7m-7 7h18');
export const ArrowRightIcon = I('M14 5l7 7m0 0l-7 7m7-7H3');
export const ArrowUpIcon = I('M5 15l7-7m0 0l7 7m-7-7v18');
export const ArrowDownIcon = I('M19 9l-7 7-7-7');
export const ArrowTrendingUpIcon = I('M13 7h8m0 0v8m0-8l-8 8-4-4-6 6');

// ===== Visibility Icons =====
export const EyeIcon = I('M15 12a3 3 0 11-6 0 3 3 0 016 0z', 'M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z');
export const EyeOffIcon = I('M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.972 9.972 0 011.563-3.029m5.858.099a3 3 0 015.129 1.425m2.915 2.915a2.25 2.25 0 010 3.182M21 12a9 9 0 11-18 0 9 9 0 0118 0z');

// ===== Document & File Icons =====
export const DocumentIcon = I('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
export const DocumentTextIcon = I('M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
export const FolderIcon = I('M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z');

// ===== Communication Icons =====
export const BellIcon = I('M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m5 4v1a3 3 0 11-6 0v-1m6 0H9');
export const ChatBubbleLeftRightIcon = I('M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');
export const ShareIcon = I('M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.412 3 3 0 00-5.367 2.412zm0 6.024a3 3 0 105.368 2.412 3 3 0 00-5.368-2.412');
export const PhoneIcon = I('M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z');
export const EnvelopeIcon = I('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z');

// ===== Media Icons =====
export const VideoCameraIcon = I('M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z');
export const PhotoIcon = I('M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z');
export const MusicalNoteIcon = I('M9 19V6l12-2v13M9 6l12-2m0 0v15M9 21l12-2');

// ===== Time & Calendar Icons =====
export const CalendarIcon = I('M8 7V3m8 4V3m-9 8h10m-6 4v6m6-10v10a2 2 0 01-18 0 9 9 0 0118 0z');
export const CalendarDaysIcon = I('M6.25 6.375a4.25 4.25 0 118.5 0 4.25 4.25 0 01-8.5 0zM3.5 16.5a10.5 10.5 0 0017 0z');
export const ClockIcon = I('M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z');

// ===== Chart & Analytics Icons =====
export const ChartBarIcon = I('M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z');

// ===== Security Icons =====
export const LockIcon = I('M12 15V13M10 17H14a2 2 0 002-2V9a2 2 0 00-2-2H8a2 2 0 00-2 2v6a2 2 0 002 2z', 'M10 13h4');
export const KeyIcon = I('M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z');
export const ShieldCheckIcon = I('M9 12.75l3 3m0 0l3-3m-3 3v-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const ShieldExclamationIcon = I('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z');

// ===== Link & Connection Icons =====
export const LinkIcon = I('M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1');

// ===== Emotion & Status Icons =====
export const HeartIcon = I('M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z');
export const StarIcon = I('M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z');
export const FireIcon = I('M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z');

// ===== Location Icons =====
export const MapPinIcon = I('M17.657 18.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z');

// ===== Currency & Finance Icons =====
export const CurrencyDollarIcon = I('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z');

// ===== Shopping & Commerce Icons =====
export const ShoppingCartIcon = I('M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m0 0h8m-8 0a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4z');
export const BuildingStorefrontIcon = I('M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-15z');
export const GiftIcon = I('M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 11-4 0 2 2 0 014 0zm14 0a2 2 0 11-4 0 2 2 0 014 0z');
export const GiftCardIcon = I('M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z');

// ===== Status & Feedback Icons =====
export const CheckCircleIcon = I('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
export const XCircleIcon = I('M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z');
export const InformationCircleIcon = I('M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const ExclamationTriangleIcon = I('M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z');
export const ExclamationCircleIcon = I('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const PlusCircleIcon = I('M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z');
export const MinusCircleIcon = I('M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z');

// ===== Media Control Icons =====
export const PauseIcon = I('M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z');
export const StopIcon = I('M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z');

// ===== Device Icons =====
export const DeviceTabletIcon = I('M12 18.75a6 6 0 006-6v-4.5a3 3 0 00-3-3h-1.5v9.75a3 3 0 01-3 3h-1.5v-9.75a3 3 0 00-3-3H4.5v4.5a6 6 0 006 6v0z');
export const ServerIcon = I('M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v8a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V4a1 1 0 011-1h4zM5 7v8a1 1 0 001 1h10a1 1 0 001-1V7H5z');

// ===== Utility Icons =====
export const TableCellsIcon = I('M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z');
export const HandThumbUpIcon = I('M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5');
export const BriefcaseIcon = I('M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z');
export const BarcodeIcon = I('M3 5h2v14H3V5zm4 0h1v14H7V5zm3 0h2v14h-2V5zm4 0h1v14h-1V5zm3 0h2v14h-2V5z');

// ===== Special Brand Icons =====
export const CatalogueIcon = I('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z');
export const FingerLuxIcon = I('M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5');

// ===== Additional Icons from missing_icons.ts =====
export const AtSymbolIcon = I('M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9');
export const AwardIcon = I('M12 15l-3 6 1.5-4H9l3-6m0 4l3 6-1.5-4H15l-3-6', 'M12 9a3 3 0 100-6 3 3 0 000 6z');
export const BoltIcon = I('M13 10V3L4 14h7v7l9-11h-7z');
export const RoseIcon = I('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const LightBulbIcon = I('M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 011.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z');
export const LockClosedIcon = I('M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z');

// ===== PLACEHOLDER ICONS FOR MISSING HEROICONS (TS2724 fixes) =====
// These are simple placeholders - replace with actual Heroicons SVG paths when available
export const SignalSlashIcon = I('M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636');
export const Battery100Icon = I('M3 10h14a2 2 0 012 2v4a2 2 0 01-2 2H3a2 2 0 01-2-2v-4a2 2 0 012-2zm16-4v8');
export const ArrowsRightLeftIcon = I('M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4');
export const DocumentCheckIcon = I('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z');
export const UserPlusIcon = I('M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z');
export const ArrowDownTrayIcon = I('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4');
export const ArrowUpTrayIcon = I('M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12');
export const FolderOpenIcon = I('M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z');
export const SwatchIcon = I('M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01');
export const BarsArrowUpIcon = I('M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12');

// ===== ADDITIONAL MISSING ICONS =====
export const ClipboardListIcon = I('M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01');
export const CircleStackIcon = I('M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4');
export const ArrowsPointingInIcon = I('M3 8l3.89 3.89a2 2 0 002.83 0L12 9.586V14m0 0l-2.293 2.293a2 2 0 01-2.828 0L4.586 14m7.414 0l2.293 2.293a2 2 0 002.828 0L19.414 14M12 9.586V5m0 0L9.707 2.707a2 2 0 00-2.828 0L4.586 5m7.414 0l2.293-2.293a2 2 0 012.828 0L19.414 5');
export const PlayCircleIcon = I('M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z', 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const PlayIcon = I('M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z');
export const TrophyIcon = I('M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z');
export const CartIcon = I('M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z');
export const ListIcon = I('M4 6h16M4 10h16M4 14h16M4 18h16');
export const LendsqrIcon = I('M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z');
export const CheckBadgeIcon = I('M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z');
export const LocationMarkerIcon = I('M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', 'M15 11a3 3 0 11-6 0 3 3 0 016 0z');
