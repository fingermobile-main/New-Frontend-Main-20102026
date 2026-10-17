import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { api } from '../../services/api';

type ScreenStatus = 'draft' | 'published' | 'suspended' | 'frozen';
type ScreenAction = 'publish' | 'suspend' | 'freeze' | 'restore';

interface ScreenDefinition {
  id: number;
  slug: string;
  title: string;
  category: string;
  version: number;
  status: ScreenStatus;
  layout_schema: unknown[];
  data_bindings: Record<string, unknown>;
  rbac_roles: string[];
  created_at: string;
  updated_at: string;
}

interface ScreenForm {
  slug: string;
  title: string;
  category: string;
  layoutSchema: string;
  dataBindings: string;
  rbacRoles: string;
}

const EMPTY_FORM: ScreenForm = {
  slug: '',
  title: '',
  category: 'General',
  layoutSchema: '[]',
  dataBindings: '{}',
  rbacRoles: 'user, member',
};

const statusClasses: Record<ScreenStatus, string> = {
  draft: 'bg-slate-100 text-slate-950 border-slate-400',
  published: 'bg-emerald-100 text-emerald-950 border-emerald-400',
  suspended: 'bg-amber-100 text-amber-950 border-amber-400',
  frozen: 'bg-blue-100 text-blue-950 border-blue-400',
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'The request failed.';
  }
  return error instanceof Error ? error.message : 'The request failed.';
};

const ScreenCatalogManagementConsole: React.FC = () => {
  const [screens, setScreens] = useState<ScreenDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScreen, setEditingScreen] = useState<ScreenDefinition | null>(null);
  const [form, setForm] = useState<ScreenForm>(EMPTY_FORM);

  const loadScreens = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.get('/master-dashboard/screens');
      setScreens(response.data.data || response.data.screens || []);
    } catch (error) {
      setErrorMessage(`Unable to load the screen catalog: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadScreens();
  }, [loadScreens]);

  const openCreateForm = () => {
    setIsFormOpen(true);
    setEditingScreen(null);
    setForm(EMPTY_FORM);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const openEditForm = (screen: ScreenDefinition) => {
    setIsFormOpen(true);
    setEditingScreen(screen);
    setForm({
      slug: screen.slug,
      title: screen.title,
      category: screen.category,
      layoutSchema: JSON.stringify(screen.layout_schema, null, 2),
      dataBindings: JSON.stringify(screen.data_bindings, null, 2),
      rbacRoles: screen.rbac_roles.join(', '),
    });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingScreen(null);
    setErrorMessage('');
  };

  const saveScreen = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    let layoutSchema: unknown;
    let dataBindings: unknown;
    try {
      layoutSchema = JSON.parse(form.layoutSchema);
      dataBindings = JSON.parse(form.dataBindings);
      if (!Array.isArray(layoutSchema)) {
        throw new Error('Layout schema must be a JSON array.');
      }
      if (!dataBindings || typeof dataBindings !== 'object' || Array.isArray(dataBindings)) {
        throw new Error('Data bindings must be a JSON object.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Enter valid JSON definitions.');
      setSaving(false);
      return;
    }

    const payload = {
      slug: form.slug.trim(),
      title: form.title.trim(),
      category: form.category.trim() || 'General',
      layout_schema: layoutSchema,
      data_bindings: dataBindings,
      rbac_roles: form.rbacRoles.split(',').map(role => role.trim()).filter(Boolean),
    };

    try {
      if (editingScreen) {
        await api.put(`/master-dashboard/screens/${encodeURIComponent(editingScreen.slug)}`, payload);
        setSuccessMessage('Screen definition saved.');
      } else {
        await api.post('/master-dashboard/screens', payload);
        setSuccessMessage('Screen created as a draft.');
      }
      setIsFormOpen(false);
      setEditingScreen(null);
      await loadScreens();
    } catch (error) {
      setErrorMessage(`Unable to save the screen: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (screen: ScreenDefinition, action: ScreenAction) => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await api.patch(`/master-dashboard/screens/${encodeURIComponent(screen.slug)}/status`, { action });
      const completedAction: Record<ScreenAction, string> = {
        publish: 'published',
        suspend: 'suspended',
        freeze: 'frozen',
        restore: 'restored',
      };
      setSuccessMessage(`“${screen.title}” ${completedAction[action]}.`);
      await loadScreens();
    } catch (error) {
      setErrorMessage(`Unable to ${action} the screen: ${getErrorMessage(error)}`);
    }
  };

  const deleteScreen = async (screen: ScreenDefinition) => {
    const confirmed = window.confirm(
      `Delete the catalog record for “${screen.title}” (${screen.slug})? This does not delete source routes or business data.`
    );
    if (!confirmed) return;

    setErrorMessage('');
    setSuccessMessage('');
    try {
      await api.delete(`/master-dashboard/screens/${encodeURIComponent(screen.slug)}`);
      setSuccessMessage(`Catalog record “${screen.title}” deleted.`);
      await loadScreens();
    } catch (error) {
      setErrorMessage(`Unable to delete the screen: ${getErrorMessage(error)}`);
    }
  };

  const updateField = (field: keyof ScreenForm, value: string) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  return (
    <section className="space-y-6" aria-labelledby="screen-catalog-heading">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 id="screen-catalog-heading" className="text-xl font-bold text-slate-900">
            Screen Catalog Management
          </h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-700">
            Manage persisted screen definitions, access roles, and lifecycle status. Changes are audited and broadcast to catalog subscribers.
          </p>
          <p className="mt-2 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
            This catalog is metadata only. Suspending or deleting an entry does not disable a static application route or change business data.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => void loadScreens()}
            disabled={loading}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-md border border-indigo-700 bg-indigo-700 px-3 py-2 text-sm font-extrabold text-white hover:bg-indigo-800"
          >
            Create screen
          </button>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" className="rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm font-semibold text-red-950">
          {errorMessage}
        </div>
      )}
      {successMessage && (
        <div role="status" className="rounded-md border border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">
          {successMessage}
        </div>
      )}

      {isFormOpen && (
        <form onSubmit={saveScreen} className="space-y-4 rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">
              {editingScreen ? `Edit ${editingScreen.title}` : 'Create screen definition'}
            </h3>
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1 text-sm font-bold text-slate-800">
              Slug
              <input
                required
                pattern="[a-z0-9]+(-[a-z0-9]+)*"
                maxLength={120}
                value={form.slug}
                disabled={Boolean(editingScreen)}
                onChange={event => updateField('slug', event.target.value)}
                placeholder="creator-studio"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 font-bold placeholder:text-slate-400 disabled:bg-slate-100"
              />
            </label>
            <label className="space-y-1 text-sm font-bold text-slate-800">
              Title
              <input
                required
                maxLength={200}
                value={form.title}
                onChange={event => updateField('title', event.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 font-bold placeholder:text-slate-400"
              />
            </label>
            <label className="space-y-1 text-sm font-bold text-slate-800">
              Category
              <input
                maxLength={100}
                value={form.category}
                onChange={event => updateField('category', event.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 font-bold placeholder:text-slate-400"
              />
            </label>
            <label className="space-y-1 text-sm font-bold text-slate-800">
              RBAC roles (comma-separated)
              <input
                value={form.rbacRoles}
                onChange={event => updateField('rbacRoles', event.target.value)}
                placeholder="user, member"
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 text-slate-900 font-bold placeholder:text-slate-400"
              />
            </label>
            <label className="space-y-1 text-sm font-bold text-slate-800">
              Layout schema (JSON array)
              <textarea
                required
                rows={6}
                value={form.layoutSchema}
                onChange={event => updateField('layoutSchema', event.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900"
              />
            </label>
            <label className="space-y-1 text-sm font-bold text-slate-800">
              Data bindings (JSON object)
              <textarea
                required
                rows={6}
                value={form.dataBindings}
                onChange={event => updateField('dataBindings', event.target.value)}
                className="w-full rounded border border-slate-300 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={closeForm}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-md border border-indigo-700 bg-indigo-700 px-4 py-2 text-sm font-extrabold text-white hover:bg-indigo-800 disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save definition'}
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm font-semibold text-slate-700">Loading screen catalog…</p>
        ) : screens.length === 0 ? (
          <p className="p-6 text-sm font-semibold text-slate-700">No screen definitions have been registered.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Screen</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Status</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Version</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Updated</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {screens.map(screen => (
                  <tr key={screen.id}>
                    <td className="px-4 py-4 align-top">
                      <p className="font-bold text-slate-900">{screen.title}</p>
                      <p className="mt-0.5 font-mono text-xs text-slate-700">{screen.slug}</p>
                      <p className="mt-1 text-xs text-slate-700">{screen.category}</p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black capitalize ${statusClasses[screen.status]}`}>
                        {screen.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top text-sm font-bold text-slate-800">v{screen.version}</td>
                    <td className="px-4 py-4 align-top text-sm text-slate-700">
                      {new Date(screen.updated_at).toLocaleString()}
                    </td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex max-w-md flex-wrap gap-2">
                        {screen.status !== 'frozen' && (
                          <>
                            <button type="button" onClick={() => openEditForm(screen)} className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800 hover:bg-slate-50">Edit</button>
                            {screen.status !== 'published' && <button type="button" onClick={() => void runAction(screen, 'publish')} className="rounded border border-emerald-400 bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-950 hover:bg-emerald-200">Publish</button>}
                            {screen.status !== 'suspended' && <button type="button" onClick={() => void runAction(screen, 'suspend')} className="rounded border border-amber-400 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950 hover:bg-amber-200">Suspend</button>}
                            <button type="button" onClick={() => void runAction(screen, 'freeze')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950 hover:bg-blue-200">Freeze</button>
                            <button type="button" onClick={() => void deleteScreen(screen)} className="rounded border border-red-400 bg-red-100 px-2.5 py-1 text-xs font-black text-red-950 hover:bg-red-200">Delete</button>
                          </>
                        )}
                        {screen.status === 'frozen' && (
                          <button type="button" onClick={() => void runAction(screen, 'restore')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950 hover:bg-blue-200">Restore</button>
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
    </section>
  );
};

export default ScreenCatalogManagementConsole;
