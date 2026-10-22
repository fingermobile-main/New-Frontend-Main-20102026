import React, { useState, useEffect } from 'react';

interface Project {
  id: number;
  name: string;
  description?: string;
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

interface Task {
  id: number;
  projectId: number;
  title: string;
  description?: string;
  status: string;
  priority: string;
  assigneeId: number | null;
  assigneeName?: string;
  dueDate: string;
  tags: string[];
  dependencies: number[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  highPriorityTasks: number;
  mediumPriorityTasks: number;
  lowPriorityTasks: number;
}

interface ProjectManagementProps {
  theme: 'light' | 'dark' | 'blue';
}

const ProjectManagement: React.FC<ProjectManagementProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'stats'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<ProjectStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  
  // Form states for creating projects
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [newProjectStatus, setNewProjectStatus] = useState<string>('active');
  const [newProjectPriority, setNewProjectPriority] = useState<string>('medium');
  const [newProjectStartDate, setNewProjectStartDate] = useState<string>('');
  const [newProjectEndDate, setNewProjectEndDate] = useState<string>('');
  const [newProjectTags, setNewProjectTags] = useState<string>('');
  
  // Form states for creating tasks
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [newTaskStatus, setNewTaskStatus] = useState<string>('pending');
  const [newTaskPriority, setNewTaskPriority] = useState<string>('medium');
  const [newTaskAssigneeId, setNewTaskAssigneeId] = useState<string>('');
  const [newTaskDueDate, setNewTaskDueDate] = useState<string>('');
  const [newTaskTags, setNewTaskTags] = useState<string>('');

  // Fetch data on initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
      fetchStats(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/editor/project-management/projects', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setProjects(result.data);
      } else {
        setError(result.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId: number) => {
    try {
      const response = await fetch(`/api/editor/project-management/projects/${projectId}/tasks`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setTasks(result.data);
      } else {
        setError(result.message || 'Failed to fetch tasks');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const fetchStats = async (projectId: number) => {
    try {
      const response = await fetch(`/api/editor/project-management/projects/${projectId}/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setStats(result.data);
      } else {
        setError(result.message || 'Failed to fetch project stats');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName) {
      setError('Project name is required');
      return;
    }

    try {
      const response = await fetch('/api/editor/project-management/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          status: newProjectStatus,
          priority: newProjectPriority,
          startDate: newProjectStartDate || undefined,
          endDate: newProjectEndDate || undefined,
          tags: newProjectTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewProjectName('');
        setNewProjectDescription('');
        setNewProjectStatus('active');
        setNewProjectPriority('medium');
        setNewProjectStartDate('');
        setNewProjectEndDate('');
        setNewProjectTags('');
        setProjects([...projects, result.data]);
        alert('Project created successfully!');
      } else {
        setError(result.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateTask = async () => {
    if (!selectedProject || !newTaskTitle) {
      setError('Project and task title are required');
      return;
    }

    try {
      const response = await fetch(`/api/editor/project-management/projects/${selectedProject}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          title: newTaskTitle,
          description: newTaskDescription,
          status: newTaskStatus,
          priority: newTaskPriority,
          assigneeId: newTaskAssigneeId ? parseInt(newTaskAssigneeId) : null,
          dueDate: newTaskDueDate || undefined,
          tags: newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewTaskTitle('');
        setNewTaskDescription('');
        setNewTaskStatus('pending');
        setNewTaskPriority('medium');
        setNewTaskAssigneeId('');
        setNewTaskDueDate('');
        setNewTaskTags('');
        setTasks([...tasks, result.data]);
        fetchStats(selectedProject); // Refresh stats
        alert('Task created successfully!');
      } else {
        setError(result.message || 'Failed to create task');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return '#7f1d1d'; // Dark red
      case 'high': return '#dc2626'; // Red
      case 'medium': return '#f59e0b'; // Yellow
      case 'low': return '#10b981'; // Green
      default: return '#6b7280'; // Gray
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981'; // Green
      case 'in_progress': return '#f59e0b'; // Yellow
      case 'pending': return '#3b82f6'; // Blue
      case 'on_hold': return '#8b5cf6'; // Purple
      case 'cancelled': return '#6b7280'; // Gray
      default: return '#6b7280'; // Gray
    }
  };

  return (
    <div 
      className="project-management-panel" 
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Project Management</h3>
      
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
        {(['projects', 'tasks', 'stats'] as const).map((tab) => (
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

      {loading && activeTab !== 'stats' && (
        <div style={{ padding: '1rem', textAlign: 'center' }}>
          Loading...
        </div>
      )}

      {!loading && activeTab === 'projects' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Project</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Project Name</label>
              <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
              <textarea
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
                placeholder="Enter project description"
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
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Status</label>
                <select
                  value={newProjectStatus}
                  onChange={(e) => setNewProjectStatus(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                <select
                  value={newProjectPriority}
                  onChange={(e) => setNewProjectPriority(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                    color: theme === 'dark' ? 'white' : '#1f2937'
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>Start Date</label>
                <input
                  type="date"
                  value={newProjectStartDate}
                  onChange={(e) => setNewProjectStartDate(e.target.value)}
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
                <label style={{ display: 'block', marginBottom: '0.25rem' }}>End Date</label>
                <input
                  type="date"
                  value={newProjectEndDate}
                  onChange={(e) => setNewProjectEndDate(e.target.value)}
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
            </div>
            
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Tags (comma separated)</label>
              <input
                type="text"
                value={newProjectTags}
                onChange={(e) => setNewProjectTags(e.target.value)}
                placeholder="e.g., web, mobile, design"
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
              onClick={handleCreateProject}
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
              Create Project
            </button>
          </div>
          
          <h4>Your Projects</h4>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No projects created yet. Create your first project!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {projects.map(project => (
                <div 
                  key={project.id}
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
                        {project.name}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => {
                          setSelectedProject(project.id);
                          setActiveTab('tasks');
                        }}
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
                        Tasks
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProject(project.id);
                          setActiveTab('stats');
                        }}
                        style={{
                          padding: '0.25rem 0.5rem',
                          backgroundColor: (theme === 'dark' ? '#8b5cf6' : theme === 'blue' ? '#8b5cf6' : '#8b5cf6'),
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.75rem'
                        }}
                      >
                        Stats
                      </button>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <div>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: 
                          project.status === 'active' ? '#dbeafe' : 
                          project.status === 'completed' ? '#d1fae5' : 
                          project.status === 'on_hold' ? '#fef3c7' : 
                          project.status === 'cancelled' ? '#fee2e2' : 
                          '#e5e7eb',
                        color: 
                          project.status === 'active' ? '#1e40af' : 
                          project.status === 'completed' ? '#065f46' : 
                          project.status === 'on_hold' ? '#d97706' : 
                          project.status === 'cancelled' ? '#7f1d1d' : 
                          '#6b7280',
                        fontWeight: 'bold',
                        marginRight: '0.5rem'
                      }}>
                        {project.status}
                      </span>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '4px', 
                        backgroundColor: 
                          project.priority === 'critical' ? '#fee2e2' : 
                          project.priority === 'high' ? '#ffedd5' : 
                          project.priority === 'medium' ? '#fef3c7' : 
                          project.priority === 'low' ? '#d1fae5' : 
                          '#e5e7eb',
                        color: 
                          project.priority === 'critical' ? '#7f1d1d' : 
                          project.priority === 'high' ? '#c2410c' : 
                          project.priority === 'medium' ? '#d97706' : 
                          project.priority === 'low' ? '#065f46' : 
                          '#6b7280',
                        fontWeight: 'bold'
                      }}>
                        {project.priority}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                    Created: {formatDate(project.createdAt)} • Updated: {formatDate(project.updatedAt)}
                  </div>
                  {project.description && (
                    <div style={{ fontSize: '0.8rem' }}>
                      {project.description}
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      {project.tags.map((tag, index) => (
                        <span 
                          key={index}
                          style={{ 
                            display: 'inline-block', 
                            padding: '0.25rem 0.5rem', 
                            marginRight: '0.25rem', 
                            marginBottom: '0.25rem',
                            backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', 
                            borderRadius: '4px', 
                            fontSize: '0.75rem' 
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'tasks' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          {selectedProject ? (
            <>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <h4>Add New Task</h4>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Task Title</label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Enter task title"
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
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Description</label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    placeholder="Enter task description"
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
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Status</label>
                    <select
                      value={newTaskStatus}
                      onChange={(e) => setNewTaskStatus(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                        color: theme === 'dark' ? 'white' : '#1f2937'
                      }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Priority</label>
                    <select
                      value={newTaskPriority}
                      onChange={(e) => setNewTaskPriority(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        border: '1px solid #d1d5db',
                        borderRadius: '4px',
                        backgroundColor: theme === 'dark' ? '#4b5563' : 'white',
                        color: theme === 'dark' ? 'white' : '#1f2937'
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Assignee ID</label>
                    <input
                      type="number"
                      value={newTaskAssigneeId}
                      onChange={(e) => setNewTaskAssigneeId(e.target.value)}
                      placeholder="Member ID"
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
                    <label style={{ display: 'block', marginBottom: '0.25rem' }}>Due Date</label>
                    <input
                      type="date"
                      value={newTaskDueDate}
                      onChange={(e) => setNewTaskDueDate(e.target.value)}
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
                </div>
                
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.25rem' }}>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={newTaskTags}
                    onChange={(e) => setNewTaskTags(e.target.value)}
                    placeholder="e.g., frontend, bug, urgent"
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
                  onClick={handleCreateTask}
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
                  Create Task
                </button>
              </div>
              
              <h4>Tasks for Project: {projects.find(p => p.id === selectedProject)?.name}</h4>
              {tasks.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
                  No tasks created yet for this project. Add your first task!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {tasks.map(task => (
                    <div 
                      key={task.id}
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
                            {task.title}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            backgroundColor: 
                              task.status === 'completed' ? '#d1fae5' : 
                              task.status === 'in_progress' ? '#fef3c7' : 
                              task.status === 'pending' ? '#dbeafe' : 
                              task.status === 'on_hold' ? '#e0e7ff' : 
                              task.status === 'cancelled' ? '#fee2e2' : 
                              '#e5e7eb',
                            color: 
                              task.status === 'completed' ? '#065f46' : 
                              task.status === 'in_progress' ? '#d97706' : 
                              task.status === 'pending' ? '#1e40af' : 
                              task.status === 'on_hold' ? '#4f46e5' : 
                              task.status === 'cancelled' ? '#7f1d1d' : 
                              '#6b7280',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}>
                            {task.status}
                          </span>
                          <span style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '4px', 
                            backgroundColor: 
                              task.priority === 'critical' ? '#fee2e2' : 
                              task.priority === 'high' ? '#ffedd5' : 
                              task.priority === 'medium' ? '#fef3c7' : 
                              task.priority === 'low' ? '#d1fae5' : 
                              '#e5e7eb',
                            color: 
                              task.priority === 'critical' ? '#7f1d1d' : 
                              task.priority === 'high' ? '#c2410c' : 
                              task.priority === 'medium' ? '#d97706' : 
                              task.priority === 'low' ? '#065f46' : 
                              '#6b7280',
                            fontWeight: 'bold',
                            fontSize: '0.75rem'
                          }}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        <div>
                          {task.assigneeId ? `Assignee: Member ${task.assigneeId}` : 'Unassigned'}
                        </div>
                        <div>
                          Due: {formatDate(task.dueDate)}
                        </div>
                      </div>
                      {task.description && (
                        <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                          {task.description}
                        </div>
                      )}
                      {task.tags && task.tags.length > 0 && (
                        <div>
                          {task.tags.map((tag, index) => (
                            <span 
                              key={index}
                              style={{ 
                                display: 'inline-block', 
                                padding: '0.15rem 0.4rem', 
                                marginRight: '0.25rem', 
                                backgroundColor: theme === 'dark' ? '#4b5563' : '#e5e7eb', 
                                borderRadius: '4px', 
                                fontSize: '0.7rem' 
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              Select a project to view its tasks
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'stats' && (
        <div style={{ overflowY: 'auto', maxHeight: 'calc(100vh- 200px)' }}>
          {selectedProject && stats ? (
            <>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                marginBottom: '1rem'
              }}>
                <h4>Project Statistics: {projects.find(p => p.id === selectedProject)?.name}</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#dbeafe', borderRadius: '4px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
                      {stats.totalTasks}
                    </div>
                    <div style={{ color: '#6b7280' }}>Total Tasks</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                      {stats.completedTasks}
                    </div>
                    <div style={{ color: '#6b7280' }}>Completed</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                      {stats.inProgressTasks}
                    </div>
                    <div style={{ color: '#6b7280' }}>In Progress</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: '#ddd6fe', borderRadius: '4px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                      {stats.pendingTasks}
                    </div>
                    <div style={{ color: '#6b7280' }}>Pending</div>
                  </div>
                </div>
                
                <div style={{ marginTop: '1rem' }}>
                  <h5>Priority Distribution</h5>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#d1fae5', borderRadius: '4px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#065f46' }}>
                        {stats.lowPriorityTasks}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Low Priority</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#fef3c7', borderRadius: '4px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                        {stats.mediumPriorityTasks}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>Medium Priority</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '4px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b91c1c' }}>
                        {stats.highPriorityTasks}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>High Priority</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ 
                padding: '1rem', 
                backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                border: '1px solid #d1d5db',
                borderRadius: '4px'
              }}>
                <h5>Progress Overview</h5>
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Completion</span>
                    <span>{stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%</span>
                  </div>
                  <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0}%`, 
                        backgroundColor: '#10b981',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', marginTop: '1rem' }}>
                    <span>Tasks In Progress</span>
                    <span>{stats.totalTasks > 0 ? Math.round((stats.inProgressTasks / stats.totalTasks) * 100) : 0}%</span>
                  </div>
                  <div style={{ height: '20px', backgroundColor: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${stats.totalTasks > 0 ? (stats.inProgressTasks / stats.totalTasks) * 100 : 0}%`, 
                        backgroundColor: '#f59e0b',
                        transition: 'width 0.3s ease'
                      }} 
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              Select a project to view its statistics
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;