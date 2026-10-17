import React, { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { api } from '../../services/api';

type FieldType = 'text' | 'textarea' | 'number' | 'boolean' | 'json' | 'array' | 'datetime';
type LifecycleStatus = 'active' | 'suspended' | 'frozen' | 'archived';
type RecordData = Record<string, unknown>;

interface DomainField {
  name: string;
  type: FieldType;
  required: boolean;
}

interface DomainEntity {
  key: string;
  label: string;
  count: number;
  fields: DomainField[];
  supportsAutomation: boolean;
}

interface Domain {
  key: string;
  label: string;
  entities: DomainEntity[];
}

interface AuditEntry {
  id: string;
  action: string;
  actor_id: string | null;
  reason: string | null;
  created_at: string;
  before_snapshot: RecordData | null;
  after_snapshot: RecordData | null;
}

const inputClassName = 'w-full rounded-md border border-slate-300 bg-white px-3 py-2 font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500';

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.detail || error.response?.data?.message || error.message;
  }
  return error instanceof Error ? error.message : 'The request failed.';
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'object') return JSON.stringify(value);
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
};

const formatDate = (value: unknown) => {
  if (!value) return '—';
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
};

const statusClassName = (status: LifecycleStatus) => {
  const classes: Record<LifecycleStatus, string> = {
    active: 'border-emerald-400 bg-emerald-100 text-emerald-950',
    suspended: 'border-amber-400 bg-amber-100 text-amber-950',
    frozen: 'border-blue-400 bg-blue-100 text-blue-950',
    archived: 'border-slate-400 bg-slate-200 text-slate-950',
  };
  return `inline-flex rounded-full border px-2.5 py-1 text-xs font-black capitalize ${classes[status]}`;
};

const initialValue = (field: DomainField) => {
  if (field.type === 'boolean') return 'false';
  if (field.type === 'array') return '[]';
  if (field.type === 'json') return ['metadata', 'criteria', 'location', 'camera_info'].includes(field.name) ? '{}' : '[]';
  return '';
};

const serializeField = (field: DomainField, value: string): unknown => {
  if (value === '') return null;
  if (field.type === 'boolean') return value === 'true';
  if (field.type === 'number') {
    const number = Number(value);
    if (!Number.isFinite(number)) throw new Error(`${field.name} must be a valid number.`);
    return number;
  }
  if (field.type === 'json' || field.type === 'array') {
    const parsed: unknown = JSON.parse(value);
    if (field.type === 'array' && !Array.isArray(parsed)) throw new Error(`${field.name} must be a JSON array.`);
    return parsed;
  }
  return value;
};

const PlatformDomainManagementConsole: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [activeDomainKey, setActiveDomainKey] = useState('');
  const [activeEntityKey, setActiveEntityKey] = useState('');
  const [records, setRecords] = useState<RecordData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [includeArchived, setIncludeArchived] = useState(false);
  const [loadingDefinitions, setLoadingDefinitions] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<RecordData | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [auditRecordId, setAuditRecordId] = useState<string | null>(null);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [automationEnabled, setAutomationEnabled] = useState(false);
  const [expiryHours, setExpiryHours] = useState(48);
  const [automationLoading, setAutomationLoading] = useState(false);

  const activeDomain = useMemo(
    () => domains.find(domain => domain.key === activeDomainKey),
    [activeDomainKey, domains],
  );
  const activeEntity = useMemo(
    () => activeDomain?.entities.find(entity => entity.key === activeEntityKey),
    [activeDomain, activeEntityKey],
  );

  const loadDefinitions = useCallback(async () => {
    setLoadingDefinitions(true);
    setErrorMessage('');
    try {
      const response = await api.get('/master-dashboard/domains');
      const nextDomains: Domain[] = response.data.data || [];
      setDomains(nextDomains);
      setActiveDomainKey(current => current || nextDomains[0]?.key || '');
      setActiveEntityKey(current => current || nextDomains[0]?.entities[0]?.key || '');
    } catch (error) {
      setErrorMessage(`Unable to load domain configuration: ${getErrorMessage(error)}`);
    } finally {
      setLoadingDefinitions(false);
    }
  }, []);

  const loadRecords = useCallback(async () => {
    if (!activeDomain || !activeEntity) return;
    setLoadingRecords(true);
    setErrorMessage('');
    try {
      const response = await api.get(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}`, {
        params: { search: searchTerm || undefined, includeArchived, limit: 100 },
      });
      setRecords(response.data.data || []);
      setTotalCount(Number(response.data.count) || 0);
    } catch (error) {
      setErrorMessage(`Unable to load ${activeEntity.label.toLowerCase()}: ${getErrorMessage(error)}`);
    } finally {
      setLoadingRecords(false);
    }
  }, [activeDomain, activeEntity, includeArchived, searchTerm]);

  const loadAutomation = useCallback(async () => {
    if (!activeDomain || !activeEntity?.supportsAutomation) {
      setAutomationEnabled(false);
      return;
    }
    setAutomationLoading(true);
    try {
      const response = await api.get(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/automation`);
      setAutomationEnabled(response.data.data.enabled === true);
      setExpiryHours(Number(response.data.data.expiry_hours) || 48);
    } catch (error) {
      setErrorMessage(`Unable to load expiry automation: ${getErrorMessage(error)}`);
    } finally {
      setAutomationLoading(false);
    }
  }, [activeDomain, activeEntity]);

  useEffect(() => {
    void loadDefinitions();
  }, [loadDefinitions]);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearchTerm(searchInput.trim()), 250);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    void loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    void loadAutomation();
  }, [loadAutomation]);

  const openCreate = () => {
    if (!activeEntity) return;
    setEditingRecord(null);
    setFormValues(Object.fromEntries(activeEntity.fields.map(field => [field.name, initialValue(field)])));
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const openEdit = (record: RecordData) => {
    if (!activeEntity) return;
    setEditingRecord(record);
    setFormValues(Object.fromEntries(activeEntity.fields.map(field => {
      const value = record[field.name];
      return [field.name, value === null || value === undefined ? '' : typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)];
    })));
    setFormOpen(true);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const saveRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!activeDomain || !activeEntity) return;
    setSaving(true);
    setErrorMessage('');
    setSuccessMessage('');
    try {
      const payload = Object.fromEntries(activeEntity.fields
        .filter(field => !editingRecord || formValues[field.name] !== String(editingRecord[field.name] ?? ''))
        .map(field => [field.name, serializeField(field, formValues[field.name] ?? '')]));
      if (editingRecord) {
        await api.put(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/${encodeURIComponent(String(editingRecord.id))}`, payload);
      } else {
        await api.post(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}`, payload);
      }
      setFormOpen(false);
      setSuccessMessage(`${activeEntity.label} record ${editingRecord ? 'updated' : 'created'} in PostgreSQL.`);
      await loadRecords();
      void loadDefinitions();
    } catch (error) {
      setErrorMessage(`Unable to save record: ${getErrorMessage(error)}`);
    } finally {
      setSaving(false);
    }
  };

  const transitionRecord = async (record: RecordData, status: LifecycleStatus) => {
    if (!activeDomain || !activeEntity) return;
    const reason = status === 'active' ? '' : window.prompt(`Reason for ${status} action:`, `Master Dashboard ${status}`);
    if (reason === null) return;
    setErrorMessage('');
    setSuccessMessage('');
    try {
      if (status === 'archived') {
        await api.delete(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/${encodeURIComponent(String(record.id))}`, { data: { reason } });
      } else {
        await api.patch(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/${encodeURIComponent(String(record.id))}/lifecycle`, { status, reason });
      }
      setSuccessMessage(`Record ${String(record.id)} is now ${status}.`);
      await loadRecords();
    } catch (error) {
      setErrorMessage(`Unable to change record lifecycle: ${getErrorMessage(error)}`);
    }
  };

  const loadAudit = async (record: RecordData) => {
    if (!activeDomain || !activeEntity) return;
    const id = String(record.id);
    setAuditRecordId(id);
    setAuditEntries([]);
    try {
      const response = await api.get(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/${encodeURIComponent(id)}/audit`);
      setAuditEntries(response.data.data || []);
    } catch (error) {
      setErrorMessage(`Unable to load audit history: ${getErrorMessage(error)}`);
      setAuditRecordId(null);
    }
  };

  const updateAutomation = async () => {
    if (!activeDomain || !activeEntity?.supportsAutomation) return;
    setAutomationLoading(true);
    setErrorMessage('');
    try {
      const response = await api.put(`/master-dashboard/domains/${activeDomain.key}/${activeEntity.key}/automation`, {
        enabled: !automationEnabled,
        expiryHours,
      });
      setAutomationEnabled(response.data.data.enabled);
      setSuccessMessage(`Automatic expiry archival ${response.data.data.enabled ? 'enabled' : 'disabled'} for ${activeEntity.label}.`);
    } catch (error) {
      setErrorMessage(`Unable to update expiry automation: ${getErrorMessage(error)}`);
    } finally {
      setAutomationLoading(false);
    }
  };

  const titleForRecord = (record: RecordData) => {
    for (const key of ['title', 'name', 'trend_name', 'file_name', 'original_name', 'handle']) {
      if (record[key]) return String(record[key]);
    }
    return `${activeEntity?.label || 'Record'} ${String(record.id)}`;
  };

  const visibleFields = (record: RecordData) => Object.entries(record)
    .filter(([key, value]) => !['id', 'management_status', 'created_at', 'updated_at', 'expires_at'].includes(key) && value !== null && value !== '')
    .slice(0, 4);

  if (loadingDefinitions) {
    return <div className="rounded-xl border border-slate-300 bg-white p-8 text-center font-bold text-slate-700">Loading domain management configuration…</div>;
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-slate-300 bg-white p-6">
        <p className="text-sm font-black uppercase tracking-wide text-indigo-800">PostgreSQL-backed administration</p>
        <h2 className="mt-1 text-2xl font-black text-slate-900">Community, Creator & Discovery Domains</h2>
        <p className="mt-2 text-slate-700">Manage persisted records, moderation lifecycle, expiry automation, and audit history for the requested platform pages.</p>
      </header>

      {errorMessage && <div role="alert" className="rounded-lg border border-red-400 bg-red-100 px-4 py-3 font-bold text-red-950">{errorMessage}</div>}
      {successMessage && <div role="status" className="rounded-lg border border-emerald-400 bg-emerald-100 px-4 py-3 font-bold text-emerald-950">{successMessage}</div>}

      <div className="flex flex-wrap gap-2">
        {domains.map(domain => (
          <button
            key={domain.key}
            type="button"
            onClick={() => {
              setActiveDomainKey(domain.key);
              setActiveEntityKey(domain.entities[0]?.key || '');
              setAuditRecordId(null);
            }}
            className={`rounded-lg border px-3 py-2 text-sm font-extrabold ${activeDomainKey === domain.key ? 'border-indigo-700 bg-indigo-700 text-white' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'}`}
          >
            {domain.label}
          </button>
        ))}
      </div>

      {activeDomain && (
        <div className="rounded-xl border border-slate-300 bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-black text-slate-900">{activeDomain.label} management</h3>
              <p className="mt-1 text-sm text-slate-700">Choose a catalog to review and manage its database records.</p>
            </div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <input
                type="checkbox"
                checked={includeArchived}
                onChange={event => setIncludeArchived(event.target.checked)}
                className="h-4 w-4 rounded border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
              Include archived
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {activeDomain.entities.map(entity => (
              <button
                key={entity.key}
                type="button"
                onClick={() => {
                  setActiveEntityKey(entity.key);
                  setAuditRecordId(null);
                }}
                className={`rounded-md border px-3 py-2 text-sm font-bold ${activeEntityKey === entity.key ? 'border-blue-700 bg-blue-700 text-white' : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'}`}
              >
                {entity.label} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-900">{entity.count}</span>
              </button>
            ))}
          </div>

          {activeEntity && (
            <>
              {activeEntity.supportsAutomation && (
                <div className="mt-5 flex flex-wrap items-center gap-3 rounded-lg border border-indigo-300 bg-indigo-50 p-4">
                  <div className="mr-auto">
                    <h4 className="font-extrabold text-slate-900">Expiry-based automatic archival</h4>
                    <p className="text-sm text-slate-700">Uses the stored expiry timestamp; expired content is excluded from active views.</p>
                  </div>
                  <label className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    Expiry hours
                    <input
                      type="number"
                      min="1"
                      max="2160"
                      value={expiryHours}
                      onChange={event => setExpiryHours(Number(event.target.value))}
                      className={`${inputClassName} w-28`}
                    />
                  </label>
                  <button
                    type="button"
                    disabled={automationLoading}
                    onClick={() => void updateAutomation()}
                    className="rounded-md bg-indigo-700 px-4 py-2 font-extrabold text-white disabled:opacity-60"
                  >
                    {automationLoading ? 'Saving…' : automationEnabled ? 'Disable automation' : 'Enable automation'}
                  </button>
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${automationEnabled ? 'border-emerald-400 bg-emerald-100 text-emerald-950' : 'border-slate-400 bg-slate-100 text-slate-800'}`}>
                    {automationEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              )}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <label className="min-w-[16rem] flex-1">
                  <span className="sr-only">Search {activeEntity.label}</span>
                  <input
                    type="search"
                    value={searchInput}
                    onChange={event => setSearchInput(event.target.value)}
                    placeholder={`Search ${activeEntity.label.toLowerCase()}…`}
                    className={inputClassName}
                  />
                </label>
                <span className="text-sm font-bold text-slate-700">{totalCount} database records</span>
                <button type="button" onClick={openCreate} className="rounded-md bg-emerald-700 px-4 py-2 font-extrabold text-white hover:bg-emerald-800">Create record</button>
              </div>

              {loadingRecords ? (
                <div className="py-10 text-center font-bold text-slate-700">Loading records from PostgreSQL…</div>
              ) : records.length === 0 ? (
                <div className="mt-5 rounded-lg border border-slate-300 bg-slate-50 p-6 text-center text-slate-700">No records match this catalog and filter.</div>
              ) : (
                <div className="mt-5 space-y-4">
                  {records.map(record => {
                    const status = (['active', 'suspended', 'frozen', 'archived'].includes(String(record.management_status)) ? record.management_status : 'active') as LifecycleStatus;
                    const recordId = String(record.id);
                    return (
                      <article key={recordId} className="rounded-lg border border-slate-300 bg-white p-4">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="break-all font-extrabold text-slate-900">{titleForRecord(record)}</h4>
                              <span className={statusClassName(status)}>{status}</span>
                            </div>
                            <p className="mt-1 break-all text-xs font-bold text-slate-600">Record ID: {recordId}</p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button type="button" onClick={() => openEdit(record)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-bold text-slate-800 hover:bg-slate-100">Edit</button>
                            <button type="button" onClick={() => void loadAudit(record)} className="rounded-md border border-indigo-400 bg-indigo-100 px-3 py-1.5 text-sm font-bold text-indigo-950">Audit</button>
                            {status !== 'active' && <button type="button" onClick={() => void transitionRecord(record, 'active')} className="rounded-md border border-emerald-400 bg-emerald-100 px-3 py-1.5 text-sm font-bold text-emerald-950">Restore</button>}
                            {status === 'active' && <button type="button" onClick={() => void transitionRecord(record, 'suspended')} className="rounded-md border border-amber-400 bg-amber-100 px-3 py-1.5 text-sm font-bold text-amber-950">Suspend</button>}
                            {status === 'active' && <button type="button" onClick={() => void transitionRecord(record, 'frozen')} className="rounded-md border border-blue-400 bg-blue-100 px-3 py-1.5 text-sm font-bold text-blue-950">Freeze</button>}
                            {status !== 'archived' && <button type="button" onClick={() => void transitionRecord(record, 'archived')} className="rounded-md border border-red-400 bg-red-100 px-3 py-1.5 text-sm font-bold text-red-950">Archive</button>}
                          </div>
                        </div>
                        <dl className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
                          {visibleFields(record).map(([key, value]) => (
                            <div key={key} className="min-w-0">
                              <dt className="text-xs font-black uppercase tracking-wide text-slate-600">{key.replace(/_/g, ' ')}</dt>
                              <dd className="break-all text-sm font-semibold text-slate-800">{formatValue(value)}</dd>
                            </div>
                          ))}
                          <div>
                            <dt className="text-xs font-black uppercase tracking-wide text-slate-600">Created</dt>
                            <dd className="text-sm font-semibold text-slate-800">{formatDate(record.created_at)}</dd>
                          </div>
                          {record.expires_at && (
                            <div>
                              <dt className="text-xs font-black uppercase tracking-wide text-slate-600">Expires</dt>
                              <dd className="text-sm font-semibold text-slate-800">{formatDate(record.expires_at)}</dd>
                            </div>
                          )}
                        </dl>
                        {auditRecordId === recordId && (
                          <div className="mt-4 rounded-md border border-slate-300 bg-slate-50 p-4">
                            <div className="flex items-center justify-between gap-3">
                              <h5 className="font-extrabold text-slate-900">Audit history</h5>
                              <button type="button" onClick={() => setAuditRecordId(null)} className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm font-bold text-slate-800">Close</button>
                            </div>
                            {auditEntries.length === 0 ? (
                              <p className="mt-2 text-sm text-slate-700">No management events have been recorded for this item.</p>
                            ) : (
                              <ol className="mt-3 space-y-3">
                                {auditEntries.map(entry => (
                                  <li key={entry.id} className="border-l-2 border-indigo-500 pl-3">
                                    <p className="font-bold capitalize text-slate-900">{entry.action}</p>
                                    <p className="text-xs text-slate-700">{formatDate(entry.created_at)} · Actor: {entry.actor_id || 'System'}</p>
                                    {entry.reason && <p className="text-sm text-slate-700">Reason: {entry.reason}</p>}
                                  </li>
                                ))}
                              </ol>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {formOpen && activeEntity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="domain-record-form-title">
          <form onSubmit={event => void saveRecord(event)} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-slate-300 bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="domain-record-form-title" className="text-xl font-black text-slate-900">{editingRecord ? 'Edit' : 'Create'} {activeEntity.label}</h3>
                <p className="mt-1 text-sm text-slate-700">Changes are saved directly to PostgreSQL and recorded in the management audit log.</p>
              </div>
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-slate-300 bg-white px-3 py-1.5 font-bold text-slate-800">Close</button>
            </div>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {activeEntity.fields.filter(field => field.name !== 'id' || !editingRecord).map(field => (
                <label key={field.name} className={field.type === 'textarea' || field.type === 'json' || field.type === 'array' ? 'sm:col-span-2' : ''}>
                  <span className="mb-1 block text-sm font-bold text-slate-800">{field.name.replace(/_/g, ' ')}{field.required && <span className="text-red-800"> *</span>}</span>
                  {field.type === 'boolean' ? (
                    <select
                      required={field.required}
                      value={formValues[field.name] ?? 'false'}
                      onChange={event => setFormValues(values => ({ ...values, [field.name]: event.target.value }))}
                      className={inputClassName}
                    >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                    </select>
                  ) : field.type === 'textarea' || field.type === 'json' || field.type === 'array' ? (
                    <textarea
                      required={field.required}
                      value={formValues[field.name] ?? ''}
                      onChange={event => setFormValues(values => ({ ...values, [field.name]: event.target.value }))}
                      rows={field.type === 'textarea' ? 4 : 3}
                      className={inputClassName}
                    />
                  ) : (
                    <input
                      required={field.required}
                      type={field.type === 'number' ? 'number' : field.type === 'datetime' ? 'datetime-local' : 'text'}
                      step={field.type === 'number' ? 'any' : undefined}
                      value={formValues[field.name] ?? ''}
                      onChange={event => setFormValues(values => ({ ...values, [field.name]: event.target.value }))}
                      className={inputClassName}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 font-bold text-slate-800">Cancel</button>
              <button type="submit" disabled={saving} className="rounded-md bg-indigo-700 px-5 py-2 font-extrabold text-white disabled:opacity-60">{saving ? 'Saving…' : 'Save to database'}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default PlatformDomainManagementConsole;
