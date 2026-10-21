import React, { useState, useMemo } from 'react';
import { PAGE_INVENTORY_DATA, PageGovernanceEntry, DOMAIN_SUMMARIES } from './masterPageInventoryData';

export const PageManagementMatrixGaps: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalPage, setActiveModalPage] = useState<PageGovernanceEntry | null>(null);

  const filteredPages = useMemo(() => {
    return PAGE_INVENTORY_DATA.filter(page => {
      const matchesDomain = selectedDomain === 'all' || page.domain === selectedDomain;
      const matchesStatus = 
        statusFilter === 'all' ||
        (statusFilter === 'governed' && page.gapStatus === 'fully_governed') ||
        (statusFilter === 'degraded' && page.gapStatus !== 'fully_governed');
      const matchesSearch = 
        page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.route.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.filePath.toLowerCase().includes(searchQuery.toLowerCase()) ||
        page.entityManaged.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesDomain && matchesStatus && matchesSearch;
    });
  }, [selectedDomain, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = PAGE_INVENTORY_DATA.length;
    const governed = PAGE_INVENTORY_DATA.filter(p => p.gapStatus === 'fully_governed').length;
    const degraded = PAGE_INVENTORY_DATA.filter(p => p.gapStatus !== 'fully_governed').length;
    const avgCompletion = Math.round(PAGE_INVENTORY_DATA.reduce((acc, p) => acc + p.completionPercentage, 0) / total);

    return { total, governed, degraded, avgCompletion };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Audited Catalog Pages</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f8fafc', marginTop: '6px' }}>{stats.total} <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 500 }}>Screens</span></div>
          <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>●</span> Evaluated against 210-screen matrix
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#6ee7b7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Fully Governed (CRUD)</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#10b981', marginTop: '6px' }}>{stats.governed} <span style={{ fontSize: '14px', color: '#6ee7b7', fontWeight: 500 }}>Online</span></div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>✓</span> Server-side RBAC & WORM audit active
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#fcd34d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Degraded / Action Gaps</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#f59e0b', marginTop: '6px' }}>{stats.degraded} <span style={{ fontSize: '14px', color: '#fcd34d', fontWeight: 500 }}>Modules</span></div>
          <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚠</span> FingerWars, Contacts, Templates (78%)
          </div>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          borderRadius: '16px',
          padding: '20px',
          backdropFilter: 'blur(16px)'
        }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Health Index</div>
          <div style={{ fontSize: '32px', fontWeight: 800, color: '#818cf8', marginTop: '6px' }}>{stats.avgCompletion}% <span style={{ fontSize: '14px', color: '#a5b4fc', fontWeight: 500 }}>Coverage</span></div>
          <div style={{ fontSize: '12px', color: '#818cf8', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>⚡</span> SHA-256 linear chain verified
          </div>
        </div>
      </div>

      {/* Control Bar: Domain Filter Tabs & Search */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '16px 20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px'
      }}>
        {/* Domain Selection Tabs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { id: 'all', label: 'All Domains' },
            { id: 'SuperAdmin Core', label: 'SuperAdmin Core' },
            { id: 'Community & Identity', label: 'Community & Identity' },
            { id: 'Media & Discovery', label: 'Media & Discovery' },
            { id: 'Commerce & Growth', label: 'Commerce & Growth' },
            { id: 'Gaming & Esports', label: 'Gaming & Esports' },
            { id: 'Creation & Config', label: 'Creation & Config' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setSelectedDomain(d.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: selectedDomain === d.id ? 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)' : 'rgba(15, 23, 42, 0.6)',
                color: selectedDomain === d.id ? '#ffffff' : '#94a3b8'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        {/* Filter and Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#e2e8f0',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="all">All Statuses ({PAGE_INVENTORY_DATA.length})</option>
            <option value="governed">Fully Governed ({stats.governed})</option>
            <option value="degraded">Degraded / Action Gaps ({stats.degraded})</option>
          </select>

          <input
            type="text"
            placeholder="Search screen, route, entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '8px 14px',
              borderRadius: '8px',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#f8fafc',
              fontSize: '13px',
              outline: 'none',
              width: '240px'
            }}
          />
        </div>
      </div>

      {/* Pages Matrix Table */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.7)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Screen & Route</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Domain</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>CRUD Lifecycle</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Primary Owner Privileges</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Safeguards</th>
                <th style={{ padding: '14px 18px', fontWeight: 600 }}>Governance Score</th>
                <th style={{ padding: '14px 18px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map((page, idx) => {
                const isDegraded = page.gapStatus !== 'fully_governed';
                return (
                  <tr
                    key={page.id}
                    style={{
                      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(30, 41, 59, 0.2)',
                      transition: 'background 0.2s'
                    }}
                  >
                    {/* Screen & Route */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ fontWeight: 600, color: '#f8fafc' }}>{page.name}</div>
                      <div style={{ fontSize: '11px', color: '#ff6b00', fontFamily: 'monospace', marginTop: '2px' }}>{page.route}</div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{page.filePath}</div>
                    </td>

                    {/* Domain */}
                    <td style={{ padding: '16px 18px' }}>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: 600,
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: '#38bdf8',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                      }}>
                        {page.domain}
                      </span>
                    </td>

                    {/* CRUD Badges */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        <span title="View & Retrieve" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canView ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canView ? '#10b981' : '#ef4444' }}>V</span>
                        <span title="Create" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canCreate ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canCreate ? '#10b981' : '#ef4444' }}>C</span>
                        <span title="Edit & Modify" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canEdit ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canEdit ? '#10b981' : '#ef4444' }}>E</span>
                        <span title="Publish & Unpublish" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canPublish ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canPublish ? '#10b981' : '#ef4444' }}>P</span>
                        <span title="Archive & Restore" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canArchive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canArchive ? '#10b981' : '#ef4444' }}>A</span>
                        <span title="Purge & Delete" style={{ padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 700, background: page.capabilities.canDelete ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)', color: page.capabilities.canDelete ? '#10b981' : '#ef4444' }}>D</span>
                      </div>
                    </td>

                    {/* Owner Privileges */}
                    <td style={{ padding: '16px 18px', maxWidth: '240px' }}>
                      <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.4' }}>
                        👑 {page.ownerExclusiveControls}
                      </div>
                    </td>

                    {/* Safeguards */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        {page.safeguards.map((sg, i) => (
                          <span key={i} style={{ fontSize: '11px', color: '#94a3b8' }}>• {sg}</span>
                        ))}
                      </div>
                    </td>

                    {/* Governance Score */}
                    <td style={{ padding: '16px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          fontWeight: 700,
                          fontSize: '13px',
                          color: isDegraded ? '#f59e0b' : '#10b981'
                        }}>
                          {page.completionPercentage}%
                        </span>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: isDegraded ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: isDegraded ? '#f59e0b' : '#10b981',
                          border: `1px solid ${isDegraded ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`
                        }}>
                          {isDegraded ? 'Degraded Gap' : 'Governed'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                      <button
                        onClick={() => setActiveModalPage(page)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(255, 107, 0, 0.15)',
                          color: '#ff6b00',
                          border: '1px solid rgba(255, 107, 0, 0.3)',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                      >
                        Inspect Matrix
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drilldown Modal for Detailed Governance Specification */}
      {activeModalPage && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'linear-gradient(145deg, #1e293b, #0f172a)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '720px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  background: 'rgba(56, 189, 248, 0.15)',
                  color: '#38bdf8',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  {activeModalPage.domain}
                </span>
                <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#f8fafc', margin: '8px 0 4px 0' }}>{activeModalPage.name}</h2>
                <div style={{ fontSize: '13px', color: '#ff6b00', fontFamily: 'monospace' }}>Route: {activeModalPage.route}</div>
              </div>
              <button
                onClick={() => setActiveModalPage(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  color: '#cbd5e1',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ✕
              </button>
            </div>

            {/* Entity and Code Location */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '12px',
              padding: '14px',
              marginTop: '16px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>File Path</div>
                <div style={{ fontSize: '12px', color: '#e2e8f0', fontFamily: 'monospace', marginTop: '2px' }}>{activeModalPage.filePath}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Database Entities</div>
                <div style={{ fontSize: '12px', color: '#38bdf8', fontFamily: 'monospace', marginTop: '2px' }}>{activeModalPage.entityManaged}</div>
              </div>
            </div>

            {/* Lifecycle Matrix */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>CRUD Lifecycle Specification</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>View & Retrieve</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canView ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canView ? 'Enabled' : 'Restricted'}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Create Record</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canCreate ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canCreate ? 'Enabled' : 'Restricted'}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Edit & Modify</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canEdit ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canEdit ? 'Enabled' : 'Restricted'}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Publish & Unpublish</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canPublish ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canPublish ? 'Enabled' : 'Restricted'}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Archive & Restore</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canArchive ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canArchive ? 'Enabled' : 'Restricted'}</div>
                </div>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Purge & Delete</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: activeModalPage.capabilities.canDelete ? '#10b981' : '#ef4444' }}>{activeModalPage.capabilities.canDelete ? 'Enabled' : 'Restricted'}</div>
                </div>
              </div>
            </div>

            {/* Exclusive Privileges vs Delegated */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#e2e8f0', marginBottom: '8px' }}>Privilege Boundaries</h3>
              <div style={{ background: 'rgba(255, 107, 0, 0.08)', border: '1px solid rgba(255, 107, 0, 0.25)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ff6b00' }}>👑 SuperAdmin / Owner Exclusive Controls</div>
                <div style={{ fontSize: '13px', color: '#f8fafc', marginTop: '4px', lineHeight: '1.4' }}>{activeModalPage.ownerExclusiveControls}</div>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.06)', borderRadius: '12px', padding: '14px', marginTop: '10px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>👥 Delegated Administrative Roles</div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {activeModalPage.delegatedRoles.map((role, i) => (
                    <span key={i} style={{ padding: '3px 8px', borderRadius: '4px', background: 'rgba(15, 23, 42, 0.8)', color: '#38bdf8', fontSize: '11px', fontFamily: 'monospace' }}>
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Remediation Plan if Degraded */}
            {activeModalPage.remediationPlan && (
              <div style={{ marginTop: '20px', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', padding: '14px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#f59e0b' }}>⚠️ Active Remediation & Engineering Plan</div>
                <div style={{ fontSize: '13px', color: '#fcd34d', marginTop: '4px', lineHeight: '1.4' }}>{activeModalPage.remediationPlan}</div>
              </div>
            )}

            {/* Modal Actions */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => setActiveModalPage(null)}
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#e2e8f0',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Dismiss
              </button>
              <a
                href={activeModalPage.route}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #ff6b00 0%, #ea580c 100%)',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '13px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Launch Screen ↗
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
