import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getUserRoleTier, PRIMARY_ADMIN_EMAILS } from '../../services/platformRbac';

export type MediaEcosystem = 'beatwave' | 'dancia';
type MediaAction = 'publish' | 'freeze' | 'block' | 'suspend' | 'restore' | 'flag' | 'warn' | 'pause_comments' | 'censor';
type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'json' | 'datetime-local' | 'select' | 'file';

export interface MediaField {
  key: string;
  label: string;
  type?: FieldType;
  required?: boolean;
  hint?: string;
  options?: Array<{ value: string; label: string }>;
  /** For file fields: which multipart field name to send ('media' | 'thumbnail' | 'document') */
  uploadField?: 'media' | 'thumbnail' | 'document';
  /** For file fields: which URL key in the upload response maps back to this field */
  uploadResponseKey?: string;
  /** File types accepted, e.g. "video/*,audio/*,.mp4,.mp3" */
  accept?: string;
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

interface UploadState {
  fieldKey: string;
  filename: string;
  progress: number;
  done: boolean;
  error: string;
}

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
  const [uploads, setUploads] = useState<Record<string, UploadState>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { user } = useAuth();
  const userEmail = (user?.email || '').toLowerCase().trim();
  const roleTier = getUserRoleTier(user as any);

  const isSuperAdmin =
    PRIMARY_ADMIN_EMAILS.includes(userEmail) ||
    roleTier === 'PRIMARY_SUPER_ADMIN' ||
    user?.role === 'super_admin' ||
    user?.role === 'founder';

  const [recordToDelete, setRecordToDelete] = useState<MediaRecord | null>(null);
  const [recordToReport, setRecordToReport] = useState<MediaRecord | null>(null);
  const [reportReason, setReportReason] = useState<string>('');

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

  const buildInitialFormValues = useCallback((source?: MediaRecord): Record<string, string> => {
    return Object.fromEntries(entity.fields.map(field => {
      if (field.type === 'file') return [field.key, ''];
      if (!source) {
        return [field.key, field.type === 'json' ? (field.key === 'features' || field.key === 'tags' ? '[]' : '{}') : ''];
      }
      const value = source[field.key];
      if (field.type === 'datetime-local' && typeof value === 'string') {
        return [field.key, value ? new Date(value).toISOString().slice(0, 16) : ''];
      }
      return [field.key, stringifyValue(value)];
    }));
  }, [entity]);

  const openCreate = () => {
    setEditingRecord(null);
    setFormValues(buildInitialFormValues());
    setUploads({});
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const openEdit = (record: MediaRecord) => {
    setEditingRecord(record);
    setFormValues(buildInitialFormValues(record));
    setUploads({});
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  /** Upload a single file for a given field, return the resolved URL */
  const uploadFile = async (field: MediaField, file: File): Promise<string> => {
    const uploadFieldName = field.uploadField || 'media';
    const responseKey = field.uploadResponseKey || 'media_url';

    setUploads(prev => ({
      ...prev,
      [field.key]: { fieldKey: field.key, filename: file.name, progress: 0, done: false, error: '' },
    }));

    const formData = new FormData();
    formData.append(uploadFieldName, file);

    const response = await api.post('/master-dashboard/ecosystems/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        const percent = event.total ? Math.round((event.loaded / event.total) * 100) : 0;
        setUploads(prev => ({
          ...prev,
          [field.key]: { ...prev[field.key], progress: percent },
        }));
      },
    });

    const url = String(response.data.data[responseKey] || '');
    setUploads(prev => ({
      ...prev,
      [field.key]: { ...prev[field.key], progress: 100, done: true },
    }));
    return url;
  };

  const handleFileChange = async (field: MediaField, file: File | null) => {
    if (!file) return;
    setErrorMessage('');
    setSuccessMessage('');
    setUploads(prev => ({
      ...prev,
      [field.key]: { fieldKey: field.key, filename: file.name, progress: 0, done: false, error: '' },
    }));
    try {
      const url = await uploadFile(field, file);
      // Auto-populate the URL field with the returned served URL
      setFormValues(prev => ({ ...prev, [field.key]: url }));
      setSuccessMessage(`"${file.name}" uploaded successfully. URL auto-populated.`);
    } catch (error) {
      const msg = getErrorMessage(error);
      setUploads(prev => ({
        ...prev,
        [field.key]: { ...prev[field.key], done: true, error: msg },
      }));
      setErrorMessage(`Upload failed for ${field.label}: ${msg}`);
    }
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
        if (field.type === 'file') {
          // The URL was already auto-populated into formValues after upload; skip raw file
          const url = formValues[field.key]?.trim();
          if (field.required && !url) throw new Error(`${field.label} is required — please upload a file first.`);
          if (url) payload[field.key] = url;
          continue;
        }
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
        setSuccessMessage(`${entity.label} record updated and saved to database.`);
      } else {
        await api.post(`/master-dashboard/ecosystems/${ecosystem}/${entity.key}`, payload);
        setSuccessMessage(`${entity.label} record created as draft. Use Publish to make it live immediately.`);
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
      setSuccessMessage(
        action === 'publish'
          ? `"${String(record.title || record.name || 'Record')}" is now LIVE.`
          : action === 'flag' ? 'Risk flag updated.' : action === 'warn'
          ? 'Warning recorded.'
          : `${action} action completed.`
      );
      await loadData();
    } catch (error) {
      setErrorMessage(`Unable to complete ${action}: ${getErrorMessage(error)}`);
    }
  };

  const archiveRecord = async (record: MediaRecord) => {
    if (!entity) return;
    const label = String(record.title || record.name || record.id);
    if (!window.confirm(`Archive "${label}"? The record and its audit history will be retained.`)) return;
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

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= records.length) return;

    const newRecords = [...records];
    const [moved] = newRecords.splice(index, 1);
    newRecords.splice(targetIdx, 0, moved);
    setRecords(newRecords);

    try {
      await api.patch(
        `/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(String(moved.id))}`,
        { order_index: targetIdx, display_order: targetIdx }
      );
    } catch {
      // optimistic update retained
    }
  };

  const togglePauseComments = async (record: MediaRecord) => {
    const isPaused = Boolean(record.is_commenting_paused || record.isCommentsPaused);
    await runAction(record, 'pause_comments', { is_commenting_paused: !isPaused });
  };

  const toggleCensor = async (record: MediaRecord) => {
    const isCensored = Boolean(record.is_censored || record.isCensored);
    await runAction(record, 'censor', { is_censored: !isCensored });
  };

  const handlePermanentDelete = async () => {
    if (!recordToDelete) return;
    try {
      await api.delete(
        `/master-dashboard/ecosystems/${ecosystem}/${entity.key}/${encodeURIComponent(String(recordToDelete.id))}?permanent=true`
      );
      setSuccessMessage(`Permanently deleted from PostgreSQL database.`);
      setRecordToDelete(null);
      await loadData();
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  const submitReport = async () => {
    if (!recordToReport || !reportReason.trim()) return;
    await runAction(recordToReport, 'flag', { reason: reportReason.trim() });
    setRecordToReport(null);
    setReportReason('');
  };

  const statusCounts = summary[activeEntity] || {};

  return (
    <section className="space-y-6" aria-labelledby={`${ecosystem}-catalog-title`}>
      <header className="space-y-3">
        <div>
          <h2 id={`${ecosystem}-catalog-title`} className="text-xl font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-sm text-slate-700">{description}</p>
          <p className="mt-2 rounded-md border border-emerald-400 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-950">
            ✅ Sovereign media pipeline active — file uploads send <code>multipart/form-data</code> directly to the Express backend, persist to PostgreSQL-linked storage, and go live instantly on Publish.
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
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
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
              <label key={field.key} className={`space-y-1 text-sm font-bold text-slate-800 ${field.type === 'textarea' || field.type === 'json' || field.type === 'file' ? 'md:col-span-2' : ''}`}>
                {field.label}
                {field.required && <span className="ml-1 text-red-600">*</span>}

                {field.type === 'file' ? (
                  <div className="space-y-2">
                    {/* Native file picker */}
                    <div className="flex items-center gap-3">
                      <input
                        ref={el => { fileInputRefs.current[field.key] = el; }}
                        type="file"
                        id={`file-${ecosystem}-${entity.key}-${field.key}`}
                        accept={field.accept || '*/*'}
                        onChange={event => void handleFileChange(field, event.target.files?.[0] ?? null)}
                        className="block w-full rounded-md border border-slate-300 bg-white text-sm font-bold text-slate-900 file:mr-3 file:rounded-md file:border-0 file:bg-indigo-700 file:px-3 file:py-1.5 file:text-sm file:font-extrabold file:text-white hover:file:bg-indigo-800 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    {/* Upload progress */}
                    {uploads[field.key] && !uploads[field.key].error && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-slate-700">
                          <span className="truncate font-semibold">{uploads[field.key].filename}</span>
                          <span className="ml-2 shrink-0 font-bold">{uploads[field.key].progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full border border-slate-300 bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${uploads[field.key].done ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                            style={{ width: `${uploads[field.key].progress}%` }}
                          />
                        </div>
                        {uploads[field.key].done && (
                          <p className="text-xs font-bold text-emerald-800">✅ Upload complete — URL auto-populated below</p>
                        )}
                      </div>
                    )}
                    {/* Auto-populated URL field (editable fallback) */}
                    <div>
                      <p className="mb-1 text-xs font-semibold text-slate-600">Served URL (auto-populated after upload, or paste directly):</p>
                      <input
                        type="text"
                        value={formValues[field.key] ?? ''}
                        onChange={event => setFormValues(values => ({ ...values, [field.key]: event.target.value }))}
                        placeholder="https://…"
                        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-sm font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                ) : field.type === 'textarea' || field.type === 'json' ? (
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
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500"
                  />
                )}
                {field.hint && <span className="block text-xs font-medium text-slate-700">{field.hint}</span>}
              </label>
            ))}
          </div>
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-bold text-slate-800">Cancel</button>
            <button type="submit" disabled={saving} className="rounded-md border border-slate-500 bg-slate-700 px-4 py-2 text-sm font-extrabold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save as draft'}</button>
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
                <th scope="col" className="px-3 py-3 text-center text-xs font-bold uppercase tracking-wide text-slate-800 w-16">Move</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Record</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Lifecycle</th>
                {entity.risks && <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Risk</th>}
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Updated</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-800">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record, index) => {
                const recordTitle = String(record.title || record.name || record.author || record.host || record.slug || record.id);
                const status = String(record.moderation_status || 'draft');
                const archived = status === 'archived';
                const isCommentsPaused = Boolean(record.is_commenting_paused || record.isCommentsPaused);
                const isCensored = Boolean(record.is_censored || record.isCensored);
                return (
                  <tr key={String(record.id)}>
                    <td className="px-2 py-4 align-top text-center">
                      <div className="flex flex-col items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMoveOrder(index, 'up')}
                          className="rounded border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer text-xs"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <span className="font-mono text-[10px] font-bold text-slate-600">#{index + 1}</span>
                        <button
                          type="button"
                          disabled={index === records.length - 1}
                          onClick={() => handleMoveOrder(index, 'down')}
                          className="rounded border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-100 disabled:opacity-30 cursor-pointer text-xs"
                          title="Move Down"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="max-w-sm px-4 py-4 align-top">
                      <p className="font-bold text-slate-900">{recordTitle}</p>
                      <p className="mt-0.5 break-all font-mono text-xs text-slate-700">ID {String(record.id)}</p>
                      <p className="mt-1 text-xs text-slate-700">{entity.summaryFields.map(key => record[key] == null ? '' : `${key.replace(/_/g, ' ')}: ${stringifyValue(record[key])}`).filter(Boolean).join(' · ')}</p>
                      <details className="mt-2" onToggle={event => {
                        if (event.currentTarget.open) void loadRecordAudit(record);
                      }}>
                        <summary className="cursor-pointer text-xs font-bold text-indigo-800">Metadata and audit state</summary>
                        <pre className="mt-2 max-h-52 overflow-auto rounded border border-slate-300 bg-slate-50 p-2 text-xs text-slate-800">{JSON.stringify(record, null, 2)}</pre>
                        <div className="mt-3 border-t border-slate-300 pt-2">
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
                            {status !== 'active' && !['frozen', 'blocked', 'suspended'].includes(status) && (
                              <button
                                type="button"
                                onClick={() => void runAction(record, 'publish')}
                                className="rounded border border-emerald-400 bg-emerald-600 px-2.5 py-1 text-xs font-black text-white hover:bg-emerald-700"
                              >
                                🚀 Publish Live
                              </button>
                            )}
                            {status === 'frozen' || status === 'blocked' || status === 'suspended'
                              ? <button type="button" onClick={() => void runAction(record, 'restore')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950">Restore</button>
                              : <>
                                <button type="button" onClick={() => void runAction(record, 'freeze')} className="rounded border border-blue-400 bg-blue-100 px-2.5 py-1 text-xs font-black text-blue-950">Freeze</button>
                                <button type="button" onClick={() => void runAction(record, 'block')} className="rounded border border-red-400 bg-red-100 px-2.5 py-1 text-xs font-black text-red-950">Block</button>
                                <button type="button" onClick={() => void runAction(record, 'suspend')} className="rounded border border-amber-400 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950">Suspend</button>
                              </>}

                            {/* Pause / Resume Commenting */}
                            <button
                              type="button"
                              onClick={() => void togglePauseComments(record)}
                              className={`rounded border px-2.5 py-1 text-xs font-black cursor-pointer ${
                                isCommentsPaused
                                  ? 'border-amber-400 bg-amber-100 text-amber-950'
                                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                              }`}
                              title={isCommentsPaused ? 'Resume Commenting' : 'Pause Commenting'}
                            >
                              {isCommentsPaused ? '▶ Comments' : '⏸ Pause'}
                            </button>

                            {/* Censor / Uncensor (18+ Mask) */}
                            <button
                              type="button"
                              onClick={() => void toggleCensor(record)}
                              className={`rounded border px-2.5 py-1 text-xs font-black cursor-pointer ${
                                isCensored
                                  ? 'border-purple-400 bg-purple-100 text-purple-950'
                                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                              }`}
                              title={isCensored ? 'Uncensor Media' : 'Censor Media (18+ Mask)'}
                            >
                              {isCensored ? '👁 18+' : '👁‍🗨 Censor'}
                            </button>

                            {/* Report Media Item */}
                            <button
                              type="button"
                              onClick={() => setRecordToReport(record)}
                              className="rounded border border-red-300 bg-red-50 px-2.5 py-1 text-xs font-black text-red-950 hover:bg-red-100 cursor-pointer"
                              title="File Regulatory Report"
                            >
                              🚩 Report
                            </button>

                            {entity.warnings && status !== 'frozen' && status !== 'blocked' && status !== 'suspended' && <button type="button" onClick={() => {
                              const reason = window.prompt(`Warning reason for ${recordTitle}:`);
                              if (reason?.trim()) void runAction(record, 'warn', { reason: reason.trim() });
                            }} className="rounded border border-amber-400 bg-amber-100 px-2.5 py-1 text-xs font-black text-amber-950">Issue warning</button>}
                            <button type="button" onClick={() => void archiveRecord(record)} className="rounded border border-slate-400 bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-950">Archive</button>

                            {/* Super Admin Permanent Delete */}
                            {isSuperAdmin && (
                              <button
                                type="button"
                                onClick={() => setRecordToDelete(record)}
                                className="rounded border border-red-400 bg-red-600 px-2.5 py-1 text-xs font-black text-white hover:bg-red-700 cursor-pointer"
                                title="Permanently Purge Record from PostgreSQL (Super Admin)"
                              >
                                🗑 Delete
                              </button>
                            )}
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

      {/* Super Admin Permanent Purge Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-red-300 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-3">
            <h4 className="font-black text-base text-slate-900">Purge Media Record from Database?</h4>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              As a Sovereign Super Admin, you are about to permanently purge <strong className="text-slate-900">{String(recordToDelete.title || recordToDelete.name || recordToDelete.id)}</strong> from the PostgreSQL database. This action is irreversible.
            </p>
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setRecordToDelete(null)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handlePermanentDelete}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow transition cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regulatory Report Dialog */}
      {recordToReport && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h4 className="font-black text-sm text-slate-900">File Compliance &amp; Media Report</h4>
              <button
                type="button"
                onClick={() => {
                  setRecordToReport(null);
                  setReportReason('');
                }}
                className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-700 font-medium">
              Reporting media record: <strong className="text-slate-900">{String(recordToReport.title || recordToReport.name || recordToReport.id)}</strong>
            </p>
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Violation or Regulatory Justification *
              </label>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="State specific policy violation, copyright claim, broadcast infraction, or harmful content..."
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-red-500 bg-white"
              />
            </div>
            <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setRecordToReport(null);
                  setReportReason('');
                }}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!reportReason.trim()}
                onClick={submitReport}
                className="px-3 py-1.5 text-xs font-bold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 rounded-xl shadow transition cursor-pointer"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default MediaCatalogManagementConsole;
