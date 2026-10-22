import React, {useState, useEffect} from 'react';
interface TeamMember {
  id: number;
  membername: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
}

interface Invitation {
  id: number;
  email: string;
  role: string;
  permissions: string[];
  message: string;
  status: string;
  createdAt: string;
  expiresAt: string;
}

interface MemberManagementProps {
  theme: 'light' | 'dark' | 'blue';
}

const MemberManagement: React.FC<MemberManagementProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'members' | 'invitations'>('members');
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Form states
  const [newMembermembername, setNewMembermembername] = useState<string>('');
  const [newMemberEmail, setNewMemberEmail] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<string>('member');
  const [newInviteEmail, setNewInviteEmail] = useState<string>('');
  const [newInviteRole, setNewInviteRole] = useState<string>('member');
  const [newInviteMessage, setNewInviteMessage] = useState<string>('');

  // Fetch members and invitations on initial load
  useEffect(() => {
    fetchMembers();
    fetchInvitations();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/member-management/members', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setMembers(result.data);
      } else {
        setError(result.message || 'Failed to fetch members');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/member-management/invitations', {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMember = async () => {
    if (!newMembermembername.trim() || !newMemberEmail.trim()) {
      setError('membername and email are required');
      return;
    }

    try {
      const response = await fetch('/api/member-management/members', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          membername: newMembermembername,
          email: newMemberEmail,
          role: newMemberRole
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewMembermembername('');
        setNewMemberEmail('');
        setNewMemberRole('member');
        fetchMembers(); // Refresh the members list
      } else {
        setError(result.message || 'Failed to create member');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleInviteMember = async () => {
    if (!newInviteEmail.trim()) {
      setError('Email is required for invitation');
      return;
    }

    try {
      const response = await fetch('/api/member-management/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          email: newInviteEmail,
          role: newInviteRole,
          message: newInviteMessage
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewInviteEmail('');
        setNewInviteRole('member');
        setNewInviteMessage('');
        fetchInvitations(); // Refresh the invitations list
      } else {
        setError(result.message || 'Failed to send invitation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleRevokeInvitation = async (invitationId: number) => {
    if (!window.confirm('Are you sure you want to revoke this invitation?')) {
      return;
    }

    try {
      const response = await fetch(`/api/member-management/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        fetchInvitations(); // Refresh the invitations list
      } else {
        setError(result.message || 'Failed to revoke invitation');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteMember = async (memberId: number) => {
    if (!window.confirm('Are you sure you want to remove this team member? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/member-management/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        fetchMembers(); // Refresh the members list
      } else {
        setError(result.message || 'Failed to remove member');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div 
      className="member-management-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Member Management</h3>
      
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
        {(['members', 'invitations'] as const).map((tab) => (
          <button
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

      {loading && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'members' && (
        <div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Add New Team Member</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>membername</label>
              <input
                type="text"
                value={newMembermembername}
                onChange={(e) => setNewMembermembername(e.target.value)}
                placeholder="Enter membername"
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
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Enter email"
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
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role</label>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <button
              onClick={handleCreateMember}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Add Member
            </button>
          </div>
          
          <h4>Team Members</h4>
          {members.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No team members added yet. Add your first team member!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {members.map(member => (
                <div 
                  key={member.id}
                  style={{ 
                    padding: '0.75rem', 
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {handlename}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {member.email} • {member.role} • Joined: {formatDate(member.createdAt)}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'invitations' && (
        <div>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Invite New Member</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Email</label>
              <input
                type="email"
                value={newInviteEmail}
                onChange={(e) => setNewInviteEmail(e.target.value)}
                placeholder="Enter email to invite"
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
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Role</label>
              <select
                value={newInviteRole}
                onChange={(e) => setNewInviteRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937'
                }}
              >
                <option value="member">Member</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Message (Optional)</label>
              <textarea
                value={newInviteMessage}
                onChange={(e) => setNewInviteMessage(e.target.value)}
                placeholder="Enter a custom message for the invitation"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                  color: theme === 'dark' ? 'white' : '#1f2937',
                  minHeight: '60px'
                }}
              />
            </div>
            
            <button
              onClick={handleInviteMember}
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: (theme === 'dark' ? '#10b981' : theme === 'blue' ? '#10b981' : '#10b981'),
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Send Invitation
            </button>
          </div>
          
          <h4>Pending Invitations</h4>
          {invitations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No pending invitations. Send your first invitation!
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
                    borderRadius: '4px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {invitation.email}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      {invitation.role} • Status: {invitation.status} • Expires: {formatDateTime(invitation.expiresAt)}
                    </div>
                    {invitation.message && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.8rem', fontStyle: 'italic' }}>
                        Message: {invitation.message}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRevokeInvitation(invitation.id)}
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Revoke
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemberManagement;