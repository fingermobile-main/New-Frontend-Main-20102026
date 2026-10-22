import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import adminOperationsService, { SiteMenu } from '../../../services/adminOperationsService';
import { PlatformOwnershipCard } from '../../../components/ownership/PlatformOwnershipCard';

interface MenuItem {
  label: string;
  url: string;
}

const FALLBACK_MENUS: SiteMenu[] = [
  {
    id: 'menu-hdr-01',
    title: 'Main Header Navigation',
    slug: 'header-main',
    location: 'header',
    items: [
      { label: 'Ecosystem', url: '/dashboard/hub' },
      { label: 'Storefront', url: '/store' },
      { label: 'Guardian Sentinel', url: '/dashboard/guardian' },
      { label: 'Financial Vault', url: '/dashboard/financials' }
    ],
    is_active: true
  },
  {
    id: 'menu-ftr-01',
    title: 'Footer Platform Links',
    slug: 'footer-main',
    location: 'footer',
    items: [
      { label: 'Developer Portal', url: '/dashboard/developer' },
      { label: 'System Status', url: '/dashboard/system/status' },
      { label: 'Documentation', url: '/whitepaper' },
      { label: 'Support Queue', url: '/dashboard/support' }
    ],
    is_active: true
  },
  {
    id: 'menu-leg-01',
    title: 'Legal & Governance Links',
    slug: 'legal-links',
    location: 'sidebar',
    items: [
      { label: 'Terms of Use', url: '/legal/terms' },
      { label: 'Privacy Policy', url: '/legal/privacy' },
      { label: 'Community Standards', url: '/legal/community-standards' }
    ],
    is_active: true
  }
];

const SiteMenusPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [menus, setMenus] = useState<SiteMenu[]>(FALLBACK_MENUS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [newMenuTitle, setNewMenuTitle] = useState('');
  const [newMenuSlug, setNewMenuSlug] = useState('');
  const [newMenuLocation, setNewMenuLocation] = useState('header');
  const [showAddMenuModal, setShowAddMenuModal] = useState(false);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getSiteMenus();
      if (Array.isArray(data) && data.length > 0) {
        setMenus(data);
      }
    } catch (err: any) {
      console.warn('Backend site menus not reached, utilizing resilient protocol fallbacks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const handleAddItem = (menuId: string) => {
    const label = prompt('Enter link label (e.g. Documentation):');
    if (!label) return;
    const url = prompt('Enter link URL (e.g. /docs):', '/');
    if (!url) return;

    setMenus(prev => prev.map(m => {
      if (m.id !== menuId) return m;
      const currentItems = Array.isArray(m.items) ? m.items : [];
      return {
        ...m,
        items: [...currentItems, { label, url }]
      };
    }));
  };

  const handleRemoveItem = (menuId: string, itemIdx: number) => {
    setMenus(prev => prev.map(m => {
      if (m.id !== menuId) return m;
      const currentItems = Array.isArray(m.items) ? m.items : [];
      return {
        ...m,
        items: currentItems.filter((_, idx) => idx !== itemIdx)
      };
    }));
  };

  const handleSaveMenu = async (menu: SiteMenu) => {
    try {
      setIsSaving(true);
      await adminOperationsService.updateSiteMenu(menu.id, {
        title: menu.title,
        location: menu.location,
        items: menu.items,
        is_active: menu.is_active
      });
      showToast(`Menu "${menu.title}" saved successfully!`, 'success');
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to save menu', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateMenu = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuTitle.trim() || !newMenuSlug.trim()) return;

    try {
      await adminOperationsService.createSiteMenu({
        title: newMenuTitle,
        slug: newMenuSlug.toLowerCase().replace(/\s+/g, '-'),
        location: newMenuLocation,
        items: [{ label: 'Home', url: '/' }],
        is_active: true
      });
      showToast('New menu created successfully!', 'success');
      setShowAddMenuModal(false);
      setNewMenuTitle('');
      setNewMenuSlug('');
      fetchMenus();
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Failed to create menu', 'error');
    }
  };

  return (
    <div className="w-full max-w-[1536px] 2xl:max-w-[1680px] mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Site Menu Management</h1>
          <p className="text-sm font-semibold text-slate-700 mt-1">Configure headers, navigation bars, and footer links across the platform</p>
        </div>
        <button
          onClick={() => setShowAddMenuModal(true)}
          className="px-5 py-2.5 text-sm font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-sm transition-colors"
        >
          + Add Menu
        </button>
      </div>

      <PlatformOwnershipCard className="mb-6" />

      {loading ? (
        <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-300 text-center text-slate-700 font-medium">
          Loading site menus from protocol database...
        </div>
      ) : menus.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl shadow-xs border border-slate-300 text-center text-slate-700 font-medium">
          No menus configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white p-6 rounded-2xl shadow-xs border border-slate-300 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-black text-slate-900 text-lg">{menu.title}</h3>
                    <p className="text-xs text-slate-700 font-mono font-medium">Location: {menu.location}</p>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full uppercase ${
                    menu.is_active
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-400 font-bold'
                      : 'bg-slate-100 text-slate-800 border border-slate-300 font-bold'
                  }`}>
                    {menu.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-2 my-4 min-h-[100px]">
                  {Array.isArray(menu.items) && menu.items.length > 0 ? (
                    menu.items.map((link: MenuItem, linkIdx: number) => (
                      <div key={linkIdx} className="p-2.5 bg-slate-50 rounded-xl border border-slate-300 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold text-slate-900">{link.label}</span>
                          <span className="text-slate-700 font-mono ml-2 font-medium">{link.url}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(menu.id, linkIdx)}
                          className="text-rose-600 hover:text-rose-800 font-bold px-1.5 py-0.5 rounded hover:bg-rose-50 transition-colors"
                          title="Remove menu link"
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-700 italic py-2">No links in this menu.</p>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem(menu.id)}
                  className="flex-1 py-2 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-xl transition-colors"
                >
                  + Add Item
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveMenu(menu)}
                  className="flex-1 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl disabled:opacity-50 shadow-xs transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddMenuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create Site Menu</h3>
            <form onSubmit={handleCreateMenu} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Menu Title</label>
                <input
                  type="text"
                  required
                  value={newMenuTitle}
                  onChange={(e) => setNewMenuTitle(e.target.value)}
                  placeholder="e.g. Header Nav"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={newMenuSlug}
                  onChange={(e) => setNewMenuSlug(e.target.value)}
                  placeholder="e.g. header-nav"
                  className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                <select
                  value={newMenuLocation}
                  onChange={(e) => setNewMenuLocation(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm text-slate-900 font-bold border-slate-300 bg-white focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="header">Header</option>
                  <option value="footer">Footer</option>
                  <option value="sidebar">Sidebar</option>
                  <option value="admin_nav">Admin Nav</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddMenuModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Menu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SiteMenusPage;
