import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { api } from '../../services/api';

export type MediaEcosystem = 'beatwave' | 'dancia';
type MediaAction = 'publish' | 'freeze' | 'block' | 'suspend' | 'restore' | 'flag' | 'warn';
type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'json' | 'datetime-local' | 'select';

export interface MediaField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
}

export interface MediaEntityDefinition {
  key: string;
  label: string;
  fields: MediaField[];
  summaryFields: string[];
  risks?: boolean;
  warnings?: boolean;
}

interface MediaCatalogManagementConsoleProps {
  ecosystem: MediaEcosystem;
  title: string;
  description: string;
  entities: MediaEntityDefinition[];
}

type MediaRecord = Record<string, unknown>;

const stringifyValue = (value: unknown) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value, null, 2);
  return String(value);
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'The request failed.';
  }
  return error instanceof Error ? error.message : 'The request failed.';
};

const statusClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'border-emerald-400 bg-emerald-100 text-emerald-950',
    draft: 'border-slate-400 bg-slate-100 text-slate-950',
    frozen: 'border-blue-400 bg-blue-100 text-blue-950',
    blocked: 'border-red-400 bg-red-100 text-red-950',
    suspended: 'border-amber-400 bg-amber-100 text-amber-950',
    archived: 'border-slate-500 bg-slate-200 text-slate-950',
  };
  return classes[status] || classes.draft;
};

const MediaCatalogManagementConsole: React.FC<MediaCatalogManagementConsoleProps> = ({
  ecosystem,
  title,
  description,
  entities,
}) => {
  const [activeEntity, setActiveEntity] = useState(entities[0]?.key || '');
  const [records, setRecords] = useState<MediaRecord[]>([]);
  const [summary, setSummary] = useState<Record<string, Record<string, number>>>({});
  const [autoArchiveExpired, setAutoArchiveExpired] = useState(false);
  const [auditHistory, setAuditHistory] = useState<Record<string, Record<string, unknown>[]>>({});
  const [auditLoading, setAuditLoading] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MediaRecord | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const entity = useMemo(
    () => entities.find(item => item.key === activeEntity) || entities[0],
    [activeEntity, entities]
  );

  const loadData = useCallback(async () => {
    if (!entity) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const [catalogResponse, summaryResponse] = await Promise.all([
        api.get(`/master-dashboard/ecosystems/${ecosystem}/${entity.key}`, {
          params: { search: searchTerm || undefined, includeArchived, limit: 100 },
        }),
        api.get(`/master-dashboard/ecosystems/${ecosystem}/summary`),
      ]);
      setRecords(catalogResponse.data.data || []);
      setSummary(summaryResponse.data.data.entities || {});
      setAutoArchiveExpired(summaryResponse.data.data.automation?.autoArchiveExpired === true);
    } catch (error) {
      setErrorMessage(`Unable to load ${entity.label.toLowerCase()}: ${getErrorMessage(error)}`);
    } finally {
      setLoading(false);
    }
  }, [ecosystem, entity, includeArchived, searchTerm]);

  const toggleExpiryAutomation = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const response = await api.patch(`/master-dashboard/ecosystems/${ecosystem}/automation`, {
        autoArchiveExpired: !autoArchiveExpired,
      });
      setAutoArchiveExpired(response.data.data.autoArchiveExpired);
      setSuccessMessage(`Automatic expiry archival ${response.data.data.autoArchiveExpired ? 'enabled' : 'disabled'} for ${ecosystem === 'beatwave' ? 'BeatwaveNG' : 'Dancia-4Tv'}.`);
    } catch (error) {
      setErrorMessage(`Unable to update automation: ${getErrorMessage(error)}`);
    }
  };

  const loadRecordAudit = async (record: MediaRecord) => {
    if (!entity) return;
    const recordId = String(record.id);
    if (auditHistory[recordId] || auditLoading[recordId]) return;
    setAuditLoading(current => ({ ...current, [recordId]: true }));
    try {
      const response = await api.get(
        `/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(recordId)}/audit`
      );
      setAuditHistory(current => ({ ...current, [recordId]: response.data.data || [] }));
    } catch (error) {
      setErrorMessage(`Unable to load audit history: ${getErrorMessage(error)}`);
    } finally {
      setAuditLoading(current => ({ ...current, [recordId]: false }));
    }
  };

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreate = () => {
    setEditingRecord(null);
    setFormValues(Object.fromEntries(entity.fields.map(field => [field.key, field.type === 'json' ? (field.key === 'features' || field.key === 'tags' ? '[]' : '{}') : ''])));
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const openEdit = (record: MediaRecord) => {
    setEditingRecord(record);
    setFormValues(Object.fromEntries(entity.fields.map(field => {
      const value = record[field.key];
      if (field.type === 'datetime-local' && typeof value === 'string') {
        return [field.key, value ? new Date(value).toISOString().slice(0, 16) : ''];
      }
      return [field.key, stringifyValue(value)];
    })));
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const saveRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!entity) return;
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');

    const payload: Record<string, unknown> = {};
    try {
      for (const field of entity.fields) {
        const value = formValues[field.key] ?? '';
        if (field.required && !value.trim()) throw new Error(`${field.label} is required.`);
        if (!value.trim() && !field.required) continue;
        if (field.type === 'number') {
          const numericValue = Number(value);
          if (!Number.isFinite(numericValue)) throw new Error(`${field.label} must be a number.`);
          payload[field.key] = numericValue;
        } else if (field.type === 'boolean') {
          payload[field.key] = value === 'true';
        } else if (field.type === 'json') {
          payload[field.key] = JSON.parse(value);
        } else if (field.type === 'datetime-local') {
          const date = new Date(value);
          if (Number.isNaN(date.getTime())) throw new Error(`${field.label} must be a valid date and time.`);
          payload[field.key] = date.toISOString();
        } else {
          payload[field.key] = value.trim();
        }
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'One or more fields are invalid.');
      setSaving(false);
      return;
    }

    try {
      if (editingRecord) {
        await api.put(`/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(String(editingRecord.id))}`, payload);
        setSuccessMessage(`${entity.label} record updated.`);
      } else {
        await api.post(`/master-dashboard/ecosystems/${ecosystem}/${entity.key}`, payload);
        setSuccessMessage(`${entity.label} record created as a draft.`);
      }
      setFormOpen(false);
      setEditingRecord(null);
      await loadData();
    } catch (error) {
      setErrorMessage(`Unable to save record: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const runAction = async (record: MediaRecord, action: MediaAction, extra?: Record<string, unknown>) => {
    if (!entity) return;
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await api.patch(
        `/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(String(record.id))}/lifecycle`,
        { action, ...extra }
      );
      setSuccessMessage(`${String(record.title || record.name || 'Record')} ${action === 'flag' ? 'risk flag updated' : action === 'warn' ? 'warning recorded' : `${action} action completed`}.`);
      await loadData();
    } catch (error) {
      setErrorMessage(`Unable to complete ${action}: ${getErrorMessage(error)}`);
    }
  };

  const archiveRecord = async (record: MediaRecord) => {
    if (!entity) return;
    const label = String(record.title || record.name || record.id);
    if (!window.confirm(`Archive “${label}”? The record and its audit history will be retained.`)) return;
    setErrorMessage('');
    setSuccessMessage('');
    try {
      await api.delete(`/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(String(record.id))}`);
      setSuccessMessage(`${label} archived; its record remains retained for audit.`);
      await loadData();
    } catch (error) {
      setErrorMessage(`Unable to archive record: ${getErrorMessage(error)}`);
    }
  };

  const statusCounts = summary[activeEntity] || {};

  return (
    <section className="space-y-6" aria-labelledby={`${ecosystem}-catalog-title`}>
      <header className="space-y-3">
        <div>
          <h2 id={`${ecosystem}-catalog-title`} className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-700">{description}</p>
          <p className="mt-2 rounded-md border border-amber-400 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-950">
            Catalog actions are stored in PostgreSQL and audited. “Archive” retains data; publication controls visibility. Media URLs are managed as metadata—this console does not upload or copy media files.
          </p>
        </div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label={`${title} catalog types`}>
          {entities.map(item => (
            <button
              type="button"
              role="tab"
              aria-selected={activeEntity === item.key}
              key={item.key}
              onClick={() => {
                setActiveEntity(item.key);
                setFormOpen(false);
                setEditingRecord(null);
              }}
              className={`rounded-md border px-3 py-2 text-sm font-bold ${
                activeEntity === item.key
                  ? 'border-indigo-700 bg-indigo-700 text-white'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
              }`}
            >
              {item.label}
              <span className="ml-2 rounded-full bg-white/20 px-1.5 text-xs">{Object.values(summary[item.key] || {}).reduce((sum, count) => sum + count, 0)}</span>
            </button>
          ))}
        </div>
      </header>

      {errorMessage && <div role="alert" className="rounded-md border border-red-400 bg-red-50 px-4 py-3 text-sm font-semibold text-red-950">{errorMessage}</div>}
      {successMessage && <div role="status" className="rounded-md border border-emerald-400 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-950">{successMessage}</div>}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white p-4">
        <div className="flex flex-wrap gap-2 text-xs font-bold">
          {Object.entries(statusCounts).map(([status, count]) => (
            <span key={status} className={`rounded-full border px-2.5 py-1 capitalize ${statusClass(status)}`}>{status}: {count}</span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-300 bg-white p-4">
          <div>
            <p className="font-bold text-slate-900">Expiry archival automation</p>
            <p className="text-sm text-slate-700">Expired temporal media is archived by the backend scheduler and retained in the audit history.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={autoArchiveExpired}
            onClick={() => void toggleExpiryAutomation()}
            className={`rounded-md border px-3 py-2 text-sm font-extrabold ${autoArchiveExpired ? 'border-emerald-400 bg-emerald-100 text-emerald-950' : 'border-slate-400 bg-slate-100 text-slate-950'}`}
          >
            {autoArchiveExpired ? 'Enabled' : 'Disabled'} · Change
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            type="search"
            aria-label={`Search ${entity.label}`}
            placeholder={`Search ${entity.label.toLowerCase()}...`}
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
          />
          <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <input type="checkbox" checked={includeArchived} onChange={event => setIncludeArchived(event.target.checked)} className="rounded border border-slate-300 bg-white font-bold text-slate-900" />
            Include archived
          </label>
          <button type="button" onClick={() => void loadData()} disabled={loading} className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-60">Refresh</button>
          <button type="button" onClick={openCreate} className="rounded-md border border-indigo-700 bg-indigo-700 px-3 py-2 text-sm font-extrabold text-white hover:bg-indigo-800">Create {entity.label.replace(/s$/, '')}</button>
        </div>
      </div>

      {formOpen && (
        <form onSubmit={saveRecord} className="space-y-4 rounded-xl border border-slate-300 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">{editingRecord ? `Edit ${entity.label.replace(/s$/, '')}` : `Create ${entity.label.replace(/s$/, '')}`}</h3>
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-800">Close</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {entity.fields.map(field => (
              <label key={field.key} className={`space-y-1 text-sm font-bold text-slate-800 ${field.type === 'textarea' || field.type === 'json' ? 'md:col-span-2' : ''}`}>
                {field.label}
                {field.type === 'textarea' || field.type === 'json' ? (
                  <textarea
                    required={field.required}
                    rows={field.type === 'json' ? 5 : 3}
                    value={formValues[field.key] ?? ''}
                    onChange={event => setFormValues(values => ({ ...values, [field.key]: event.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  />
                ) : field.type === 'select' ? (
                  <select
                    required={field.required}
                    value={formValues[field.key] ?? ''}
                    onChange={event => setFormValues(values => ({ ...values, [field.key]: event.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {(field.options || []).map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                  </select>
                ) : field.type === 'boolean' ? (
                  <select
                    value={formValues[field.key] ?? ''}
                    onChange={event => setFormValues(values => ({ ...values, [field.key]: event.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Use default</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  <input
                    required={field.required}
                    type={field.type || 'text'}
                    value={formValues[field.key] ?? ''}
                    onChange={event => setFormValues(values => ({ ...values, [field.key]: event.target.value }))}
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                {field.hint && <span className="block text-xs font-medium text-slate-700">{field.hint}</span>}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-md border border-indigo-700 bg-indigo-700 px-4 py-2 text-sm font-extrabold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save as draft'}</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white shadow-sm">
        {loading ? <p className="p-6 text-sm font-semibold text-slate-700">Loading database records…</p> : records.length === 0 ? (
          <p className="p-6 text-sm font-semibold text-slate-700">No {entity.label.toLowerCase()} records match this view.</p>
        ) : (
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Record</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Lifecycle</th>
                {entity.risks && <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Risk</th>}
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Updated</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map(record => {
                const recordTitle = String(record.title || record.name || record.author || record.host || record.slug || record.id);
                const status = String(record.moderation_status || 'draft');
                const archived = status === 'archived';
                return (
                  <tr key={String(record.id)}>
                    <td className="max-w-sm px-4 py-4 align-top">
                      <p className="font-bold text-slate-900">{recordTitle}</p>
                      <p className="mt-0.5 break-all font-mono text-xs text-slate-700">ID {String(record.id)}</p>
                      <p className="mt-1 text-xs text-slate-700">{entity.summaryFields.map(key => record[key] == null ? '' : `${key.replace(/_/g, ' ')}: ${stringifyValue(record[key])}`).filter(Boolean).join(' · ')}</p>
                      <details className="mt-2" onToggle={event => {
                        if (event.currentTarget.open) void loadRecordAudit(record);
                      }}>
                        <summary className="cursor-pointer text-xs font-bold text-indigo-800">Metadata and audit state</summary>
                        <pre className="mt-2 max-h-52 overflow-auto rounded border border-slate-200 bg-slate-50 p-2 text-xs text-slate-800">{JSON.stringify(record, null, 2)}</pre>
                        <div className="mt-3 border-t border-slate-200 pt-2">
                          <p className="text-xs font-bold text-slate-900">Audit history</p>
                          {auditLoading[String(record.id)] ? <p className="text-xs text-slate-700">Loading audit history…</p> : (
                            <ol className="mt-1 space-y-1">
                              {(auditHistory[String(record.id)] || []).map((entry, index) => (
                                <li key={String(entry.id || index)} className="text-xs text-slate-700">
                                  {String(entry.action)} · {entry.actor_id ? `Actor ${String(entry.actor_id)}` : 'System'} · {new Date(String(entry.created_at)).toLocaleString()}
                                </li>
                              ))}
                              {auditHistory[String(record.id)]?.length === 0 && <li className="text-xs text-slate-700">No audit events recorded.</li>}
                            </ol>
                          )}
                        </div>
                      </details>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-black capitalize ${statusClass(status)}`}>{status}</span>
                      {Number(record.warning_count) > 0 && <p className="mt-1 text-xs font-bold text-slate-700">Warnings: {String(record.warning_count)}</p>}
                    </td>
                    {entity.risks && (
                      <td className="px-4 py-4 align-top">
                        <select
                          aria-label={`Set risk flag for ${recordTitle}`}
                          value={String(record.risk_flag || 'green')}
                          disabled={archived}
                          onChange={event => void runAction(record, 'flag', { risk_flag: event.target.value })}
                          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-bold capitalize text-slate-900 focus:ring-2 focus:ring-indigo-500"
                        >
                          {['green', 'yellow', 'orange', 'red'].map(flag => <option key={flag} value={flag}>{flag}</option>)}
                        </select>
                      </td>
                    )}
                    <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-slate-700">{record.updated_at ? new Date(String(record.updated_at)).toLocaleString() : '—'}</td>
                    <td className="px-4 py-4 align-top">
                      <div className="flex min-w-64 flex-wrap gap-2">
                        {archived ? (
                          <button type="button" onClick={() => void runAction(record, 'restore')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950">Restore</button>
                        ) : (
                          <>
                            {status !== 'frozen' && status !== 'blocked' && status !== 'suspended' && <button type="button" onClick={() => openEdit(record)} className="rounded border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800">Edit</button>}
                            {status !== 'active' && !['frozen', 'blocked', 'suspended'].includes(status) && <button type="button" onClick={() => void runAction(record, 'publish')} className="rounded border border-emerald-400 bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-950">Publish</button>}
                            {status === 'frozen' || status === 'blocked' || status === 'suspended'
                              ? <button type="button" onClick={() => void runAction(record, 'restore')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950">Restore</button>
                              : <>
                                <button type="button" onClick={() => void runAction(record, 'freeze')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950">Freeze</button>
                                <button type="button" onClick={() => void runAction(record, 'block')} className="rounded border border-red-400 bg-red-100 px-2.5 py-1 text-xs font-black text-red-950">Block</button>
                                <button type="button" onClick={() => void runAction(record, 'suspend')} className="rounded border border-amber-400 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950">Suspend</button>
                              </>}
                            {entity.warnings && status !== 'frozen' && status !== 'blocked' && status !== 'suspended' && <button type="button" onClick={() => {
                              const reason = window.prompt(`Warning reason for ${recordTitle}:`);
                              if (reason?.trim()) void runAction(record, 'warn', { reason: reason.trim() });
                            }} className="rounded border border-amber-400 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950">Issue warning</button>}
                            <button type="button" onClick={() => void archiveRecord(record)} className="rounded border border-slate-400 bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-950">Archive</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default MediaCatalogManagementConsole;
