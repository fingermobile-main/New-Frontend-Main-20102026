import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Sparkles,
  Shield,
  Compass,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  Edit3,
  Volume2,
  Upload,
  ExternalLink,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Layers,
  Lock,
  Crown,
  ShieldAlert,
  PauseCircle,
  AlertOctagon,
  Image as ImageIcon
} from 'lucide-react';
import {
  CommerceLuxuryServiceKey,
  CommerceLuxuryConsoleItem,
  CommerceLuxuryServiceOverview,
  SpawnedCommerceConsole
} from '../../types/commerceLuxuryConsole';
import commerceLuxuryConsoleService from '../../services/commerceLuxuryConsoleService';
import audioEngine, { AfricanVoiceLine } from '../../services/SuperViAudioEngine';
import { useAppContext } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { getUserRoleTier } from '../../services/platformRbac';
import CommerceMediaPicker, { CommerceMediaValue } from '../common/CommerceMediaPicker';

// Primary Admin Emails with unrestricted Super Admin authority
const PRIMARY_ADMIN_EMAILS = [
  'obinnambah100@gmail.com',
  'gracelinkbustech@gmail.com',
  'fingermobileprotocol@gmail.com'
];

// 6 Commerce & Luxury Microservices Definitions
export const COMMERCE_LUXURY_SERVICES: {
  key: CommerceLuxuryServiceKey;
  name: string;
  route: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  defaultCategory: string;
}[] = [
  {
    key: 'marketplace',
    name: 'MarketPlace Global',
    route: '/marketplace',
    category: 'Multi-Vendor Commerce',
    icon: ShoppingBag,
    description: 'Hardware nodes, protocol merchandise, escrow-protected checkout, and vendor vetting.',
    defaultCategory: 'Electronics'
  },
  {
    key: 'storefront',
    name: 'Creator Storefronts',
    route: '/storefronts',
    category: 'Independent Boutiques',
    icon: Store,
    description: 'Independent creator shops, royal silk tailored robes, and Benin bronze digital twins.',
    defaultCategory: 'Luxury Wear'
  },
  {
    key: 'flamingo',
    name: 'Flamingo Couture',
    route: '/flamingo',
    category: 'Afrocentric Haute Couture',
    icon: Sparkles,
    description: 'Runway drops, architectural cyber-corsets, 3D body measurements, and kinetic pleats.',
    defaultCategory: 'Haute Couture'
  },
  {
    key: 'ownit',
    name: 'OwnIt Sovereign Vault',
    route: '/ownit',
    category: 'Tokenized High-Ticket Assets',
    icon: Lock,
    description: 'Fractional luxury real estate deeds, vintage collector vehicles, and warranty deeds.',
    defaultCategory: 'Real Estate'
  },
  {
    key: 'fingerlux',
    name: 'FingerLux High Luxury',
    route: '/fingerlux',
    category: 'VIP Concierge & Jewelry',
    icon: Crown,
    description: 'Solid 18K gold & emerald chokers, private safari charters, and closed-circuit auctions.',
    defaultCategory: 'High Jewelry'
  },
  {
    key: 'tribut',
    name: 'Tribut Cultural Archives',
    route: '/tribut',
    category: 'Heritage Lookbooks',
    icon: Compass,
    description: '500-year Osogbo indigo dyers lookbooks, Bida glass beadmaker guild sets, and crafts.',
    defaultCategory: 'Cultural Archive'
  }
];

export const MasterCommerceLuxuryConsole: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useAppContext();
  const { user } = useAuth();

  // Granular RBAC Permissions
  const userEmail = (user?.email || '').toLowerCase().trim();
  const userRoleTier = getUserRoleTier(user as any);
  const isSuperAdmin =
    (userEmail && PRIMARY_ADMIN_EMAILS.includes(userEmail)) ||
    userRoleTier === 'PRIMARY_SUPER_ADMIN' ||
    user?.role === 'super_admin' ||
    user?.role === 'founder';

  const isAdmin =
    isSuperAdmin ||
    userRoleTier === 'SECONDARY_ADMIN_CFO' ||
    user?.role === 'admin' ||
    user?.role === 'administrator';

  const isModerator =
    isAdmin ||
    user?.role === 'moderator' ||
    user?.role === 'sentinel' ||
    user?.role === 'curator';

  // Active Service State
  const [activeService, setActiveService] = useState<CommerceLuxuryServiceKey>('marketplace');
  const [items, setItems] = useState<CommerceLuxuryConsoleItem[]>([]);
  const [overview, setOverview] = useState<Record<CommerceLuxuryServiceKey, CommerceLuxuryServiceOverview> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<CommerceLuxuryConsoleItem | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isSpawnerModalOpen, setIsSpawnerModalOpen] = useState<boolean>(false);

  // Upload State
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Spawner Form State
  const [spawnName, setSpawnName] = useState<string>('');
  const [spawnDescription, setSpawnDescription] = useState<string>('');
  const [spawnedConsoles, setSpawnedConsoles] = useState<SpawnedCommerceConsole[]>([]);

  // Multi-Media Asset State for Add & Edit
  const [mediaPickerValue, setMediaPickerValue] = useState<CommerceMediaValue>({
    coverUrl: '',
    galleryUrls: [],
    videoUrl: '',
    isCensored: false
  });

  // Item Form State
  const [formData, setFormData] = useState<{
    title: string;
    slug: string;
    category: string;
    subcategory: string;
    description: string;
    media_url: string;
    media_type: 'image' | 'video' | '3d_twin' | 'lookbook';
    price: number;
    currency: string;
    inventory_count: number;
    sku: string;
    fic_bounty: number;
    fic_discount_percent: number;
    provenance_hash: string;
    escrow_protected: boolean;
    tags: string;
    voice_prompt: string;
    vendor_name: string;
    status: 'active' | 'frozen' | 'draft' | 'archived' | 'censored' | 'suspended';
    is_comments_paused: boolean;
  }>({
    title: '',
    slug: '',
    category: 'General',
    subcategory: '',
    description: '',
    media_url: '/images/supervi-banner.png',
    media_type: 'image',
    price: 150000,
    currency: 'NGN',
    inventory_count: 20,
    sku: '',
    fic_bounty: 250,
    fic_discount_percent: 5,
    provenance_hash: '0x' + Math.random().toString(16).substring(2, 14),
    escrow_protected: true,
    tags: 'Commerce, Luxury, Sovereign',
    voice_prompt: 'owo_ni_koko',
    vendor_name: 'Official Sovereign Store',
    status: 'active',
    is_comments_paused: false
  });

  // Load Overview Data
  const loadOverview = useCallback(async () => {
    try {
      const data = await commerceLuxuryConsoleService.getOverview();
      setOverview(data);
    } catch (_err) {
      // Handled silently
    }
  }, []);

  // Load Items for Active Service
  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { items: fetchedItems } = await commerceLuxuryConsoleService.getServiceItems(activeService, {
        search: searchTerm,
        status: statusFilter,
        category: categoryFilter,
        limit: 100
      });
      setItems(fetchedItems);
    } catch (_err) {
      showToast('Error loading commerce items', 'error');
    } finally {
      setLoading(false);
    }
  }, [activeService, searchTerm, statusFilter, categoryFilter, showToast]);

  // Load Spawned Consoles
  const loadSpawned = useCallback(async () => {
    try {
      const list = await commerceLuxuryConsoleService.getSpawnedConsoles();
      setSpawnedConsoles(list);
    } catch (_err) {
      // Handled silently
    }
  }, []);

  useEffect(() => {
    loadOverview();
    loadItems();
    loadSpawned();
  }, [loadOverview, loadItems, loadSpawned]);

  // Toggle Freeze Handler (Quarantine)
  const handleToggleFreeze = async (id: number) => {
    try {
      const updated = await commerceLuxuryConsoleService.toggleFreeze(activeService, id);
      setItems(prev => prev.map(item => item.id === id ? updated : item));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(`Item #${id} is now ${updated.status.toUpperCase()}`, 'info');
    } catch (_err) {
      showToast('Error toggling freeze state', 'error');
    }
  };

  // Toggle Censor Handler (18+ Sensitive Blur Mask)
  const handleToggleCensor = async (item: CommerceLuxuryConsoleItem) => {
    try {
      const nextStatus = item.status === 'censored' ? 'active' : 'censored';
      const updated = await commerceLuxuryConsoleService.updateItem(activeService, item.id, {
        status: nextStatus as any
      });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(
        nextStatus === 'censored'
          ? `Item #${item.id} (${item.title}) has been CENSORED with 18+ sensitive mask.`
          : `Censorship lifted on Item #${item.id} (${item.title}): Now ACTIVE.`,
        nextStatus === 'censored' ? 'warning' : 'success'
      );
    } catch (_err) {
      showToast('Error toggling censorship status', 'error');
    }
  };

  // Toggle Suspend Handler (Offline / Delisted)
  const handleToggleSuspend = async (item: CommerceLuxuryConsoleItem) => {
    try {
      const nextStatus = item.status === 'suspended' ? 'active' : 'suspended';
      const updated = await commerceLuxuryConsoleService.updateItem(activeService, item.id, {
        status: nextStatus as any
      });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      loadOverview();
      audioEngine.playVoiceLine('wahala');
      showToast(
        nextStatus === 'suspended'
          ? `Item #${item.id} (${item.title}) has been SUSPENDED & taken offline.`
          : `Item #${item.id} (${item.title}) restored to ACTIVE catalog.`,
        nextStatus === 'suspended' ? 'warning' : 'success'
      );
    } catch (_err) {
      showToast('Error toggling suspension status', 'error');
    }
  };

  // Toggle Pause Comments / Inquiries
  const handleTogglePauseComments = async (item: CommerceLuxuryConsoleItem) => {
    try {
      const nextVal = !item.is_comments_paused;
      const updated = await commerceLuxuryConsoleService.updateItem(activeService, item.id, {
        is_comments_paused: nextVal
      });
      setItems(prev => prev.map(i => i.id === item.id ? updated : i));
      showToast(
        nextVal
          ? `Inquiries & commenting PAUSED for "${item.title}".`
          : `Inquiries & commenting RESUMED for "${item.title}".`,
        'info'
      );
    } catch (_err) {
      showToast('Error toggling commenting status', 'error');
    }
  };

  // Move Item Up / Down (Reorder)
  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;

    const updatedOrders = newItems.map((item, idx) => ({
      id: item.id,
      display_order: idx + 1
    }));

    setItems(newItems.map((item, idx) => ({ ...item, display_order: idx + 1 })));

    try {
      await commerceLuxuryConsoleService.reorderItems(activeService, updatedOrders);
      audioEngine.playVoiceLine('sweet');
      showToast('New arrangement saved to PostgreSQL live!', 'success');
    } catch (_err) {
      showToast('Failed to save arrangement order', 'error');
      loadItems();
    }
  };

  // Delete Item Handler (Strictly Gated to Super Admin)
  const handleDeleteItem = async (id: number, title: string) => {
    if (!isSuperAdmin) {
      showToast('RBAC Access Denied: Only Super Admins can permanently delete catalog records.', 'error');
      return;
    }
    if (!window.confirm(`SUPER ADMIN ACTION: Permanently purge "${title}" from ${activeService}? This cannot be undone.`)) return;

    try {
      await commerceLuxuryConsoleService.deleteItem(activeService, id);
      setItems(prev => prev.filter(item => item.id !== id));
      loadOverview();
      showToast(`Permanently deleted ${title}`, 'success');
    } catch (_err) {
      showToast('Error deleting item', 'error');
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    const currentMeta = COMMERCE_LUXURY_SERVICES.find(s => s.key === activeService);
    setEditingItem(null);
    setMediaPickerValue({
      coverUrl: '',
      galleryUrls: [],
      videoUrl: '',
      isCensored: false
    });
    setFormData({
      title: '',
      slug: '',
      category: currentMeta ? currentMeta.defaultCategory : 'General',
      subcategory: activeService === 'ownit' ? 'Tokenized Deed' : activeService === 'fingerlux' ? 'High Jewelry' : 'Boutique',
      description: '',
      media_url: '',
      media_type: activeService === 'storefront' ? '3d_twin' : activeService === 'tribut' ? 'lookbook' : 'image',
      price: activeService === 'ownit' ? 10000000 : activeService === 'fingerlux' ? 5000000 : 150000,
      currency: 'NGN',
      inventory_count: activeService === 'ownit' ? 1 : 25,
      sku: `${activeService.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      fic_bounty: 300,
      fic_discount_percent: 10,
      provenance_hash: '0x' + Math.random().toString(16).substring(2, 14),
      escrow_protected: true,
      tags: `${activeService}, luxury, asset`,
      voice_prompt: 'owo_ni_koko',
      vendor_name: activeService === 'ownit' ? 'OwnIt Escrow Vault' : activeService === 'fingerlux' ? 'FingerLux Vault' : 'Sovereign Vendor',
      status: 'active',
      is_comments_paused: false
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: CommerceLuxuryConsoleItem) => {
    setEditingItem(item);
    setMediaPickerValue({
      coverUrl: item.thumbnail_url || item.media_url || '',
      galleryUrls: item.images || [],
      videoUrl: item.video_urls?.[0] || (item.media_type === 'video' ? item.media_url : ''),
      isCensored: item.status === 'censored'
    });
    setFormData({
      title: item.title,
      slug: item.slug,
      category: item.category,
      subcategory: item.subcategory || '',
      description: item.description,
      media_url: item.media_url,
      media_type: item.media_type,
      price: Number(item.price) || 0,
      currency: item.currency || 'NGN',
      inventory_count: item.inventory_count || 0,
      sku: item.sku || '',
      fic_bounty: Number(item.fic_bounty) || 0,
      fic_discount_percent: Number(item.fic_discount_percent) || 5,
      provenance_hash: item.provenance_hash || '',
      escrow_protected: Boolean(item.escrow_protected),
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : '',
      voice_prompt: item.voice_prompt || 'owo_ni_koko',
      vendor_name: item.vendor_name || 'Official Sovereign Store',
      status: item.status || 'active',
      is_comments_paused: Boolean(item.is_comments_paused)
    });
    setIsEditModalOpen(true);
  };

  // Save Item Handler
  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    const finalCover = mediaPickerValue.coverUrl || formData.media_url.trim() || '/images/supervi-banner.png';
    const finalStatus = mediaPickerValue.isCensored ? 'censored' : formData.status;

    const payload: Partial<CommerceLuxuryConsoleItem> = {
      title: formData.title.trim(),
      slug: formData.slug.trim(),
      category: formData.category,
      subcategory: formData.subcategory,
      description: formData.description,
      media_url: finalCover,
      thumbnail_url: finalCover,
      media_type: mediaPickerValue.videoUrl ? 'video' : formData.media_type,
      images: mediaPickerValue.galleryUrls,
      video_urls: mediaPickerValue.videoUrl ? [mediaPickerValue.videoUrl] : [],
      price: Number(formData.price) || 0,
      currency: formData.currency,
      inventory_count: Number(formData.inventory_count) || 0,
      sku: formData.sku.trim(),
      fic_bounty: Number(formData.fic_bounty) || 0,
      fic_discount_percent: Number(formData.fic_discount_percent) || 5,
      provenance_hash: formData.provenance_hash.trim(),
      escrow_protected: formData.escrow_protected,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      voice_prompt: formData.voice_prompt,
      vendor_name: formData.vendor_name.trim() || 'Official Sovereign Store',
      status: finalStatus,
      is_comments_paused: formData.is_comments_paused
    };

    try {
      if (editingItem) {
        const updated = await commerceLuxuryConsoleService.updateItem(activeService, editingItem.id, payload);
        setItems(prev => prev.map(item => item.id === editingItem.id ? updated : item));
        showToast(`Item #${editingItem.id} updated live in PostgreSQL!`, 'success');
      } else {
        const created = await commerceLuxuryConsoleService.createItem(activeService, payload);
        setItems(prev => [...prev, created]);
        showToast(`Catalog item "${created.title}" published live!`, 'success');
      }
      loadOverview();
      setIsEditModalOpen(false);
      audioEngine.playVoiceLine('blessings');
    } catch (_err) {
      showToast('Error saving item to database', 'error');
    }
  };

  // File Upload Handler (Multipart / Form-Data direct to Express)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const res = await commerceLuxuryConsoleService.uploadMedia(file, (percent) => {
        setUploadProgress(percent);
      });

      setFormData(prev => ({
        ...prev,
        media_url: res.url,
        title: prev.title || file.name.replace(/\.[^/.]+$/, "")
      }));

      audioEngine.playVoiceLine('owo_ni_koko');
      showToast(`Uploaded ${file.name} directly to Express storage (${res.url})`, 'success');
      setIsUploadModalOpen(false);
    } catch (_err) {
      showToast('File upload failed', 'error');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // One-Click Console Spawner Handler
  const handleSpawnConsole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!spawnName.trim()) {
      showToast('Console name is required', 'error');
      return;
    }

    try {
      const spawned = await commerceLuxuryConsoleService.spawnConsole({
        console_name: spawnName.trim(),
        service_key: activeService,
        description: spawnDescription.trim(),
        config: {
          generatedAt: new Date().toISOString(),
          parentService: activeService
        }
      });
      setSpawnedConsoles(prev => [spawned, ...prev]);
      setIsSpawnerModalOpen(false);
      setSpawnName('');
      setSpawnDescription('');
      audioEngine.playVoiceLine('colossal_combo');
      showToast(`One-Click Console "${spawned.console_name}" spawned successfully!`, 'success');
    } catch (_err) {
      showToast('Error spawning new console', 'error');
    }
  };

  const currentServiceMeta = COMMERCE_LUXURY_SERVICES.find(s => s.key === activeService)!;
  const currentOverview = overview ? overview[activeService] : null;

  return (
    <div className="w-full bg-slate-50 min-h-screen p-4 sm:p-6 space-y-6">
      {/* 1. Header & Sovereign Authority Strip */}
      <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-100 text-amber-950 border border-amber-400">
              Commerce & High-Ticket Vault
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-400">
              Escrow & Provenance Active
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <currentServiceMeta.icon className="w-7 h-7 text-amber-700" />
            Commerce & Luxury Asset Consoles
          </h1>
          <p className="text-sm font-bold text-slate-700 mt-1">
            Total micromanagement of Marketplace, Storefronts, Flamingo Haute Couture, OwnIt Tokenized Deeds, FingerLux Luxury, and Tribut.
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => audioEngine.playVoiceLine('owo_ni_koko')}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors"
            title="Test Owo Ni Koko voice line"
          >
            <Volume2 className="w-4 h-4 text-slate-700" />
            Owo Ni Koko FX
          </button>
          <button
            onClick={() => setIsSpawnerModalOpen(true)}
            className="px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            1-Click Console Spawner
          </button>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add Catalog Asset
          </button>
        </div>
      </div>

      {/* 2. Microservice Navigation Strip (6 Commerce Services) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {COMMERCE_LUXURY_SERVICES.map((srv) => {
          const srvStats = overview ? overview[srv.key] : null;
          const isSelected = activeService === srv.key;
          const SrvIcon = srv.icon;

          return (
            <button
              key={srv.key}
              onClick={() => {
                setActiveService(srv.key);
                setSearchTerm('');
                setStatusFilter('ALL');
                setCategoryFilter('ALL');
              }}
              className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-white border-amber-600 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-white border-slate-300 hover:border-slate-400 hover:bg-slate-50/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-lg border ${
                    isSelected ? 'bg-amber-100 text-amber-950 border-amber-300' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    <SrvIcon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                    srvStats && srvStats.frozenItems > 0
                      ? 'bg-amber-100 text-amber-950 border-amber-400'
                      : 'bg-emerald-100 text-emerald-950 border-emerald-400'
                  }`}>
                    {srvStats ? `${srvStats.activeItems} Live` : 'Sync'}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{srv.name}</h3>
                <p className="text-[11px] font-bold text-slate-700 line-clamp-1 mt-0.5">{srv.category}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] font-mono font-bold">
                <span className="text-slate-600">SKUs</span>
                <span className="text-amber-800">
                  {srvStats ? srvStats.totalItems : '0'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Operational Overview KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total SKUs</div>
          <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
            {currentOverview?.totalItems || items.length}
          </div>
          <div className="text-[11px] font-bold text-emerald-700 mt-1">PostgreSQL Active</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Inventory In Stock</div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono">
            {currentOverview?.totalStock || items.reduce((acc, i) => acc + (i.inventory_count || 0), 0)} Units
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">Ready for fulfillment</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Total Valuation</div>
          <div className="text-xl font-black text-amber-800 mt-1 font-mono truncate">
            ₦{(currentOverview?.totalValuation || 0).toLocaleString()}
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">Escrow & vault balance</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">FIC Bounty Pool</div>
          <div className="text-2xl font-black text-indigo-700 mt-1 font-mono">
            {currentOverview?.totalBountyFic || 0} FIC
          </div>
          <div className="text-[11px] font-bold text-slate-700 mt-1">Buyer referral rewards</div>
        </div>

        <div className="bg-white border border-slate-300 rounded-xl p-3.5 shadow-2xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Public Storefront</div>
          <button
            onClick={() => navigate(currentServiceMeta.route)}
            className="w-full mt-2 py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-lg text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
          >
            Launch {currentServiceMeta.name}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4. Filter, Search & Reorder Action Bar */}
      <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={`Search ${currentServiceMeta.name}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs font-bold text-slate-900 border border-slate-300 rounded-xl bg-white outline-none focus:border-amber-600"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-slate-700" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl text-xs outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="censored">Censored (18+ Mask) Only</option>
              <option value="frozen">Frozen Only</option>
              <option value="suspended">Suspended Only</option>
              <option value="draft">Draft Only</option>
            </select>
          </div>

          {/* Reload Button */}
          <button
            onClick={() => {
              loadOverview();
              loadItems();
            }}
            className="p-2 border border-slate-300 rounded-xl hover:bg-slate-100 text-slate-700"
            title="Reload items from PostgreSQL"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Priority Reordering Notice */}
        <div className="text-xs font-bold text-slate-700 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-700" />
          <span>Arrangement Priority: Use ▲ / ▼ buttons to move items up/down in real time.</span>
        </div>
      </div>

      {/* 5. Autonomous Commerce Items Table */}
      <div className="bg-white border border-slate-300 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-amber-700 border-t-transparent rounded-full mx-auto mb-3" />
            <div className="text-sm font-bold text-slate-800">Streaming live records from PostgreSQL...</div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertTriangle className="w-10 h-10 text-amber-700 mx-auto" />
            <div className="text-base font-black text-slate-900">No items cataloged yet</div>
            <p className="text-xs font-bold text-slate-700 max-w-sm mx-auto">
              Publish a new product, tokenized deed, or artisan lookbook to populate this console.
            </p>
            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Add First Item
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-300 text-slate-900 font-black">
                <tr>
                  <th className="py-3 px-3 w-16 text-center">Order</th>
                  <th className="py-3 px-3">Product & Vendor</th>
                  <th className="py-3 px-3">Price & Inventory</th>
                  <th className="py-3 px-3">Provenance / Escrow</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">FIC Bounty</th>
                  <th className="py-3 px-3 text-right">Autonomous Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Reorder Buttons (Up / Down) */}
                    <td className="py-3 px-2 text-center">
                      <div className="flex flex-col items-center justify-center gap-0.5">
                        <button
                          onClick={() => handleMoveOrder(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-slate-700 hover:text-amber-700 disabled:opacity-30 disabled:hover:text-slate-700"
                          title="Move feature up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-black text-slate-900 text-[11px]">
                          #{item.display_order}
                        </span>
                        <button
                          onClick={() => handleMoveOrder(index, 'down')}
                          disabled={index === items.length - 1}
                          className="p-1 text-slate-700 hover:text-amber-700 disabled:opacity-30 disabled:hover:text-slate-700"
                          title="Move feature down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                    {/* Product & Vendor with Media Thumbnail */}
                    <td className="py-3 px-3">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl border border-slate-300 bg-slate-100 overflow-hidden shrink-0 relative shadow-2xs">
                          {item.thumbnail_url || item.media_url ? (
                            <>
                              <img
                                src={item.thumbnail_url || item.media_url}
                                alt={item.title}
                                className={`w-full h-full object-cover ${
                                  item.status === 'censored' ? 'filter blur-xs' : ''
                                }`}
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = 'none';
                                }}
                              />
                              {item.status === 'censored' && (
                                <span className="absolute inset-0 bg-black/50 text-[8px] font-black text-white flex items-center justify-center uppercase">
                                  18+
                                </span>
                              )}
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-slate-900 text-sm leading-snug flex items-center gap-1.5">
                            <span className="truncate">{item.title}</span>
                            {item.is_comments_paused && (
                              <span className="px-1.5 py-0.2 bg-amber-100 text-amber-950 border border-amber-300 rounded text-[9px] font-bold">
                                Inquiries Paused
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] font-bold text-slate-700 mt-0.5 flex items-center gap-1.5">
                            <span>Vendor: {item.vendor_name}</span>
                            <span>•</span>
                            <span className="font-mono text-slate-600">SKU: {item.sku || 'N/A'}</span>
                          </div>
                          {item.description && (
                            <p className="text-[11px] font-medium text-slate-700 line-clamp-1 mt-1">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Price & Inventory */}
                    <td className="py-3 px-3">
                      <div className="font-mono font-black text-amber-900 text-sm">
                        {item.currency} {Number(item.price).toLocaleString()}
                      </div>
                      <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                        Stock: <span className="font-mono font-black text-slate-900">{item.inventory_count}</span> units
                      </div>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300 uppercase">
                        {item.category} • {item.media_type}
                      </span>
                    </td>

                    {/* Provenance Hash & Escrow */}
                    <td className="py-3 px-3">
                      <div className="space-y-1 font-mono text-[11px]">
                        {item.escrow_protected ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-400 px-2 py-0.5 rounded-full">
                            <Shield className="w-3 h-3 text-emerald-700" />
                            Escrow Locked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-slate-100 text-slate-800 border border-slate-300 px-2 py-0.5 rounded-full">
                            Direct Settlement
                          </span>
                        )}
                        {item.provenance_hash && (
                          <div className="text-[10px] font-mono font-bold text-slate-600 truncate max-w-[140px]" title={item.provenance_hash}>
                            Hash: {item.provenance_hash}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                        item.status === 'active'
                          ? 'bg-emerald-100 text-emerald-950 border-emerald-400'
                          : item.status === 'censored'
                          ? 'bg-purple-100 text-purple-950 border-purple-400'
                          : item.status === 'frozen'
                          ? 'bg-blue-100 text-blue-950 border-blue-400'
                          : item.status === 'suspended'
                          ? 'bg-rose-100 text-rose-950 border-rose-400'
                          : 'bg-slate-100 text-slate-900 border-slate-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'active' ? 'bg-emerald-600' : item.status === 'censored' ? 'bg-purple-600' : item.status === 'frozen' ? 'bg-blue-600' : item.status === 'suspended' ? 'bg-rose-600' : 'bg-slate-500'
                        }`} />
                        {item.status.toUpperCase()}
                      </span>
                    </td>

                    {/* FIC Bounty */}
                    <td className="py-3 px-3 font-mono">
                      <div className="font-black text-emerald-800 text-xs">
                        +{item.fic_bounty} FIC
                      </div>
                      <div className="text-[11px] font-bold text-slate-700">
                        Disc: {item.fic_discount_percent}%
                      </div>
                    </td>

                    {/* Granular RBAC Action Buttons */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* African Voice Line Trigger */}
                        <button
                          onClick={() => audioEngine.playVoiceLine((item.voice_prompt as AfricanVoiceLine) || 'owo_ni_koko')}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300"
                          title={`Voice FX: ${item.voice_prompt}`}
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                        </button>

                        {/* Freeze / Unfreeze (Moderator / Admin / Super Admin) */}
                        {isModerator && (
                          <button
                            onClick={() => handleToggleFreeze(item.id)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                              item.status === 'frozen'
                                ? 'bg-emerald-100 text-emerald-950 border-emerald-400 hover:bg-emerald-200'
                                : 'bg-blue-100 text-blue-950 border-blue-400 hover:bg-blue-200'
                            }`}
                            title={item.status === 'frozen' ? 'Unfreeze Item' : 'Freeze Item (Hold Asset)'}
                          >
                            {item.status === 'frozen' ? 'Unfreeze' : 'Freeze'}
                          </button>
                        )}

                        {/* Censor / Uncensor (18+ Sensitive Blur Mask) */}
                        {isModerator && (
                          <button
                            onClick={() => handleToggleCensor(item)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              item.status === 'censored'
                                ? 'bg-purple-100 text-purple-950 border-purple-400 hover:bg-purple-200'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                            title={item.status === 'censored' ? 'Uncensor Item (Lift 18+ mask)' : 'Censor Item (Apply 18+ sensitive blur mask)'}
                          >
                            <ShieldAlert className={`w-3.5 h-3.5 ${item.status === 'censored' ? 'text-purple-800' : 'text-slate-700'}`} />
                          </button>
                        )}

                        {/* Suspend / Restore (Quarantine / Delist) */}
                        {isModerator && (
                          <button
                            onClick={() => handleToggleSuspend(item)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              item.status === 'suspended'
                                ? 'bg-rose-100 text-rose-950 border-rose-400 hover:bg-rose-200'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                            title={item.status === 'suspended' ? 'Restore Item to Active Catalog' : 'Suspend Item (Take Offline)'}
                          >
                            <AlertOctagon className={`w-3.5 h-3.5 ${item.status === 'suspended' ? 'text-rose-800' : 'text-slate-700'}`} />
                          </button>
                        )}

                        {/* Pause Commenting / Inquiries */}
                        {isModerator && (
                          <button
                            onClick={() => handleTogglePauseComments(item)}
                            className={`p-1.5 rounded-lg border transition-colors ${
                              item.is_comments_paused
                                ? 'bg-amber-100 text-amber-950 border-amber-400 hover:bg-amber-200'
                                : 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-200'
                            }`}
                            title={item.is_comments_paused ? 'Resume Inquiries & Commenting' : 'Pause Inquiries & Commenting'}
                          >
                            <PauseCircle className={`w-3.5 h-3.5 ${item.is_comments_paused ? 'text-amber-800' : 'text-slate-700'}`} />
                          </button>
                        )}

                        {/* Edit Button */}
                        {isAdmin && (
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300"
                            title="Edit Item Specs & Media"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Delete Button (Strictly Super Admin) */}
                        {isSuperAdmin && (
                          <button
                            onClick={() => handleDeleteItem(item.id, item.title)}
                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-300"
                            title="Permanently Purge Record (Super Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Spawned Commerce Consoles Strip */}
      {spawnedConsoles.length > 0 && (
        <div className="bg-white border border-slate-300 rounded-2xl p-5 shadow-xs">
          <h3 className="text-base font-black text-slate-900 mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            Dynamically Spawned Commerce Sub-Consoles ({spawnedConsoles.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {spawnedConsoles.map(sp => (
              <div key={sp.id} className="p-3 bg-purple-50/50 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-purple-950">{sp.console_name}</div>
                  <div className="text-[10px] font-mono font-bold text-purple-700">{sp.service_key} • /{sp.slug}</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-100 text-purple-950 border border-purple-300 rounded-full">
                  LIVE
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: Create / Edit Product */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-2xl w-full p-6 shadow-xl space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-lg font-black text-slate-900">
                {editingItem ? `Edit Item #${editingItem.id}` : `Publish New ${currentServiceMeta.name} Asset`}
              </h2>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Asset Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="e.g. Benin Bronze Ancestral Mask"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Vanity Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                    placeholder="e.g. benin-bronze-mask"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="e.g. Fine Art"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                    placeholder="e.g. Sculpture"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-900 block mb-1">Media Format</label>
                  <select
                    value={formData.media_type}
                    onChange={(e) => setFormData({ ...formData, media_type: e.target.value as any })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="image">Still Photography</option>
                    <option value="3d_twin">3D Digital Twin</option>
                    <option value="lookbook">Artisan Lookbook</option>
                    <option value="video">Cinematic Video</option>
                  </select>
                </div>
              </div>

              {/* Price, Currency, Inventory & SKU */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="FIC">FIC Token</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Inventory</label>
                  <input
                    type="number"
                    value={formData.inventory_count}
                    onChange={(e) => setFormData({ ...formData, inventory_count: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  placeholder="Artisan provenance, material specifications, warranty terms..."
                />
              </div>

              {/* Universal Sovereign Media Picker (Cover Image, Multi-Image Gallery, Showcase Video) */}
              <CommerceMediaPicker
                value={mediaPickerValue}
                onChange={setMediaPickerValue}
                title={`${currentServiceMeta.name} Media & Cover Art Picker`}
                description="Upload high-fidelity product cover photos, multi-angle gallery photos, and showcase video reels saving directly to Express storage."
                allowGallery={true}
                allowVideo={true}
                maxGalleryImages={8}
              />

              {/* Vendor, Provenance & Escrow */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Vendor Name</label>
                  <input
                    type="text"
                    value={formData.vendor_name}
                    onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">Provenance Hash</label>
                  <input
                    type="text"
                    value={formData.provenance_hash}
                    onChange={(e) => setFormData({ ...formData, provenance_hash: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-900 block mb-1">African Voice Prompt</label>
                  <select
                    value={formData.voice_prompt}
                    onChange={(e) => setFormData({ ...formData, voice_prompt: e.target.value })}
                    className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                  >
                    <option value="owo_ni_koko">Owo Ni Koko (Wealth Voice)</option>
                    <option value="colossal_combo">Colossal Combo (Triumph Voice)</option>
                    <option value="blessings">Blessings Blessings (Abundance)</option>
                    <option value="sweet">Sweet (Praise Voice)</option>
                    <option value="stunning">Stunning (Aesthetic Voice)</option>
                    <option value="madt_o">Madt O (Shock/Excitement)</option>
                    <option value="wahala">Wahala Dey (Warning/Freeze)</option>
                  </select>
                </div>
              </div>

              {/* Compliance & RBAC Actions Box - Black with hairline of dark red (#880808) */}
              <div className="bg-black border border-[#880808] rounded-xl p-3.5 space-y-3 shadow-lg text-white">
                <div className="flex items-center justify-between border-b border-red-950/60 pb-2">
                  <div className="flex items-center gap-2 text-xs font-black text-white uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    Compliance & RBAC Actions
                  </div>
                  <span className="text-[9px] font-mono text-red-300 font-bold bg-red-950/80 px-2 py-0.5 rounded-full border border-red-800/60">
                    SOVEREIGN POLICY
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Catalog Lifecycle Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="active">Active (Public Catalog)</option>
                      <option value="censored">Censored (18+ Blur Mask)</option>
                      <option value="frozen">Frozen (Compliance Quarantine)</option>
                      <option value="suspended">Suspended (Offline)</option>
                      <option value="draft">Draft (Private Inspection)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-200 block mb-1">Public Inquiries & Comments</label>
                    <select
                      value={formData.is_comments_paused ? 'paused' : 'open'}
                      onChange={(e) => setFormData({ ...formData, is_comments_paused: e.target.value === 'paused' })}
                      className="w-full p-2 font-bold text-slate-900 bg-white border border-slate-300 rounded-lg outline-none"
                    >
                      <option value="open">Open (Inquiries & Tips Enabled)</option>
                      <option value="paused">Paused (Moderator Freeze)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-xl font-bold"
                >
                  {editingItem ? 'Save Changes' : 'Publish Live to PostgreSQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Multipart Direct File Uploader (Real Express Backend) */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Upload className="w-5 h-5 text-amber-700" />
                Upload Asset to Express Backend
              </h2>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-700">
              Direct multipart/form-data ingestion saving permanently to <code className="font-mono bg-slate-100 p-1 rounded">public/uploads/commerce/</code>.
            </p>

            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-3 hover:border-amber-600 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs font-bold text-slate-800">
                Choose a product image (.png, .jpg, .webp), 3D asset (.glb), or lookbook (.pdf)
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.glb,.gltf,.pdf"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="text-xs font-bold text-slate-700 cursor-pointer"
              />
            </div>

            {isUploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-800">
                  <span>Uploading to server...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-amber-700 h-2 transition-all duration-200"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: One-Click Console Spawner */}
      {isSpawnerModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h2 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-700" />
                1-Click Commerce Console Spawner
              </h2>
              <button
                type="button"
                onClick={() => setIsSpawnerModalOpen(false)}
                className="text-slate-500 hover:text-slate-900 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs font-bold text-slate-700">
              Instantly scaffold a dedicated, schema-aware commerce console registered into PostgreSQL.
            </p>

            <form onSubmit={handleSpawnConsole} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-900 block mb-1">New Console Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Benin Bronze Heritage Console"
                  value={spawnName}
                  onChange={(e) => setSpawnName(e.target.value)}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Target Service</label>
                <input
                  type="text"
                  readOnly
                  value={currentServiceMeta.name}
                  className="w-full p-2.5 font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-900 block mb-1">Operational Description</label>
                <textarea
                  rows={2}
                  placeholder="Console scope, permitted vendors, escrow policies..."
                  value={spawnDescription}
                  onChange={(e) => setSpawnDescription(e.target.value)}
                  className="w-full p-2.5 font-bold text-slate-900 bg-white border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsSpawnerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Spawn Console
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MasterCommerceLuxuryConsole;
