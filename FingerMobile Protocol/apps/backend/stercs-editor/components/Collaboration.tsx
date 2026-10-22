import React, { useState, useEffect } from 'react';

interface Collaborator {
  id: number;
  projectId: number;
  memberId: number;
  membername: string;
  email: string;
  role: string;
  permissions: string[];
  joinedAt: string;
  updatedAt: string;
}

interface Invitation {
  id: number;
  inviterId: number;
  invitermembername: string;
  projectId: number;
  projectName: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

interface CollaborationProps {
  theme: 'light' | 'dark' | 'blue';
}

const Collaboration: React.FC<CollaborationProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'collaborators' | 'invitations' | 'invite'>('collaborators');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states for inviting members
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteRole, setInviteRole] = useState<string>('viewer');
  const [inviteProjectId, setInviteProjectId] = useState<string>('1');
  const [invitePermissions, setInvitePermissions] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    if (activeTab === 'collaborators' || activeTab === 'invitations') {
      fetchData();
    }
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'collaborators') {
        const response = await fetch('/api/editor/collaboration/project/1', { // In a real app, this would be the actual project ID
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
          }
        });

        const result = await response.json();

        if (result.success) {
          setCollaborators(result.data);
        } else {
          setError(result.message || 'Failed to fetch collaborators');
        }
      } else if (activeTab === 'invitations') {
        const response = await fetch('/api/editor/collaboration/invitations', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
          }
        });

        const result = await response.json();

        if (result.success) {
          setInvitations(result.data);
        } else {
          setError(result.message || 'Failed to fetch invitations');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }member
  };

  const handleInviteMember = async () => {
    if (!inviteEmail || !inviteProjectId) {
      setError('Email and Project ID are required for inviting a member');
      return;
    }

    try {
      const response = await fetch('/api/editor/collaboration/invite', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          projectId: parseInt(inviteProjectId),
          email: inviteEmail,
          role: inviteRole,
          permissions: invitePermissions.split(',').map(p => p.trim()).filter(p => p)
        })
      });

      const result = await response.json();
Member
      if (result.success) {
        setInviteEmail('');member
        setInviteRole('viewer');
        setInviteProjectId('1');
        setInvitePermissions('');
        alert('Member invited successfully!');
      } else {
        setError(result.message || 'Failed to invite member');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleAcceptInvitation = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/editor/collaboration/invitations/${invitationId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        alert('Invitation accepted successfully!');
      } else {
        setError(result.message || 'Failed to accept invitation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeclineInvitation = async (invitationId: number) => {
    try {
      const response = await fetch(`/api/editor/collaboration/invitations/${invitationId}/decline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
        alert('Invitation declined successfully!');
      } else {
        setError(result.message || 'Failed to decline invitation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'editor': return '#f59e0b';
      case 'viewer': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div
      className="collaboration-panel"
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme === 'dark' ? '#1f2937' : theme === 'blue' ? '#dbeafe' : '#e5e7eb',
        color: theme === 'dark' ? 'white' : '#1f2937',
        padding: '1rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0' }}>Collaboration</h3>

      {error && (
        <div style={{
          padding: '0.75rem',
          color: '#ef4444',
          backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : '#f3f4f6',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['collaborators', 'invitations', 'invite'] as const).map((tab) => (
          <button aria-label={tab}
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: activeTab === tab ? (theme === 'dark' ? '#374151' : theme === 'blue' ? '#3b82f6' : '#d1d5db') : (theme === 'dark' ? '#4b5563' : theme === 'blue' ? '#93c5fd' : '#e5e7eb'),
              color: theme === 'dark' ? 'white' : '#1f2937',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {loading && activeTab !== 'invite' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'collaborators' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Project Collaborators</h4>
          {collaborators.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No collaborators added yet. Invite your first collaborator!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {collaborators.map(collab => (
                <div
                  key={collab.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div>
                      <div style={{ fontWeight: 'bold' }}>
                        {collab.membername}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                        {collab.email}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor:
                        collab.role === 'admin' ? '#fee2e2' :
                        collab.role === 'editor' ? '#fef3c7' :
                        '#d1fae5',
                      color:
                        collab.role === 'admin' ? '#7f1d1d' :
                        collab.role === 'editor' ? '#d97706' :
                        '#065f46'
                    }}>
                      {collab.role.toUpperCase()}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Joined: {formatDate(collab.joinedAt)} • Updated: {formatDate(collab.updatedAt)}
                  </div>

                  {collab.permissions && collab.permissions.length > 0 && (
                    <div style={{ fontSize: '0.8rem' }}>
                      <span style={{ fontWeight: 'bold' }}>Permissions:</span> {collab.permissions.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'invitations' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <h4>Pending Invitations</h4>
          {invitations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No pending invitations.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {invitations.map(invitation => (
                <div
                  key={invitation.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    Invitation from {invitation.invitermembername}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Project: {invitation.projectName} (ID: {invitation.projectId})
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    <div>
                      <div style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        backgroundColor:
                          invitation.role === 'admin' ? '#fee2e2' :
                          invitation.role === 'editor' ? '#fef3c7' :
                          '#d1fae5',
                        color:
                          invitation.role === 'admin' ? '#7f1d1d' :
                          invitation.role === 'editor' ? '#d97706' :
                          '#065f46'
                      }}>
                        {invitation.role.toUpperCase()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleAcceptInvitation(invitation.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDeclineInvitation(invitation.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: (theme === 'dark' ? '#ef4444' : theme === 'blue' ? '#ef4444' : '#ef4444'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.25rem' }}>
                    Sent: {formatDate(invitation.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'invite' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Invite New Collaborator</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter email address"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project ID</label>
                <input
                  type="number"
                  value={inviteProjectId}
                  onChange={(e) => setInviteProjectId(e.target.value)}
                  placeholder="Project ID"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role</label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="viewer">Viewer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Permissions (comma separated)</label>
              <input
                type="text"
                value={invitePermissions}
                onChange={(e) => setInvitePermissions(e.target.value)}
                placeholder="e.g., read, write, delete"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              />
            </div>

            <button
              onClick={handleInviteMember}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#3b82f6' : theme === 'blue' ? '#3b82f6' : '#3b82f6'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Invitation
            </button>
          </div>

          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px'
          }}>
            <h4>Collaboration Roles Explained</h4>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>Viewer</div>
                <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                  Can view the project but cannot make changes.
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.25rem' }}>Editor</div>
                <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                  Can view and edit the project, but cannot manage collaborators or project settings.
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 'bold', color: '#ef4444', marginBottom: '0.25rem' }}>Admin</div>
                <div style={{ fontSize: '0.9rem', color: theme === 'dark' ? '#d1d5db' : '#4b5563' }}>
                  Full access to the project including managing collaborators and project settings.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;
