import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import adminOperationsService, { SiteMenu } from '../../../services/adminOperationsService';

interface MenuItem {
  label: string;
  url: string;
}

const SiteMenusPage: React.FC = () => {
  const { showToast } = useAppContext();
  const [menus, setMenus] = useState<SiteMenu[]>([]);
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
      setMenus(data);
    } catch (err: any) {
      console.error('Failed to fetch site menus:', err);
      showToast('Failed to load site menus', 'error');
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Menu Management</h1>
          <p className="text-sm text-slate-700 font-medium mt-1">Configure headers, navigation bars, and footer links</p>
        </div>
        <button
          onClick={() => setShowAddMenuModal(true)}
          className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
        >
          + Add Menu
        </button>
      </div>

      {loading ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-slate-700">
          Loading site menus from protocol database...
        </div>
      ) : menus.length === 0 ? (
        <div className="bg-white p-8 rounded-xl shadow-sm text-center text-slate-700">
          No menus configured yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menus.map((menu) => (
            <div key={menu.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{menu.title}</h3>
                    <p className="text-xs text-slate-700 font-mono">Location: {menu.location}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    menu.is_active ? 'bg-green-100 text-green-950 border border-green-400 font-bold' : 'bg-gray-100 text-green-950'
                  }font-black`}>
                    {menu.is_active ? 'Active' : 'Disabled'}
                  </span>
                </div>

                <div className="space-y-2 my-4 min-h-[100px]">
                  {Array.isArray(menu.items) && menu.items.length > 0 ? (
                    menu.items.map((link: MenuItem, linkIdx: number) => (
                      <div key={linkIdx} className="p-2 bg-gray-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-gray-800">{link.label}</span>
                          <span className="text-slate-700 font-mono ml-2">{link.url}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(menu.id, linkIdx)}
                          className="text-red-500 hover:text-red-700 font-bold px-1"
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

              <div className="pt-3 border-t border-slate-200 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleAddItem(menu.id)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                >
                  + Add Item
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => handleSaveMenu(menu)}
                  className="flex-1 py-1.5 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
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
