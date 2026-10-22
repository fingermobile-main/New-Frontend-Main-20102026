import React, {useState, useEffect} from 'react';
interface BusinessProject {
  id: string;
  name: string;
  description?: string;
  industry: string;
  goals: string[];
  startDate: string;
  endDate: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessGoal {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  targetValue: number;
  currentValue: number;
  deadline: string | null;
  priority: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface BusinessMilestone {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  targetDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface BusinessManagementProps {
  theme: 'light' | 'dark' | 'blue';
}

const BusinessManagement: React.FC<BusinessManagementProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'goals' | 'milestones'>('projects');
  const [projects, setProjects] = useState<BusinessProject[]>([]);
  const [goals, setGoals] = useState<BusinessGoal[]>([]);
  const [milestones, setMilestones] = useState<BusinessMilestone[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newProjectDescription, setNewProjectDescription] = useState<string>('');
  const [newProjectIndustry, setNewProjectIndustry] = useState<string>('');
  const [newGoalTitle, setNewGoalTitle] = useState<string>('');
  const [newGoalDescription, setNewGoalDescription] = useState<string>('');
  const [newGoalTargetValue, setNewGoalTargetValue] = useState<number>(0);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState<string>('');
  const [newMilestoneDescription, setNewMilestoneDescription] = useState<string>('');
  const [newMilestoneTargetDate, setNewMilestoneTargetDate] = useState<string>('');

  // Fetch projects on initial load
  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch goals when a project is selected
  useEffect(() => {
    if (selectedProject) {
      fetchGoals(selectedProject);
    }
  }, [selectedProject]);

  // Fetch milestones when a goal is selected
  useEffect(() => {
    if (selectedGoal) {
      fetchMilestones(selectedGoal);
    }
  }, [selectedGoal]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/business-management/projects', {
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

  const fetchGoals = async (projectId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-management/projects/${projectId}/goals`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setGoals(result.data);
      } else {
        setError(result.message || 'Failed to fetch goals');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestones = async (goalId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/business-management/goals/${goalId}/milestones`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        }
      });

      const result = await response.json();

      if (result.success) {
        setMilestones(result.data);
      } else {
        setError(result.message || 'Failed to fetch milestones');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async () => {
    if (!newProjectName.trim() || !newProjectIndustry.trim()) {
      setError('Project name and industry are required');
      return;
    }

    try {
      const response = await fetch('/api/business-management/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          name: newProjectName,
          description: newProjectDescription,
          industry: newProjectIndustry
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewProjectName('');
        setNewProjectDescription('');
        setNewProjectIndustry('');
        fetchProjects(); // Refresh the projects list
      } else {
        setError(result.message || 'Failed to create project');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateGoal = async () => {
    if (!selectedProject || !newGoalTitle.trim()) {
      setError('Project must be selected and goal title is required');
      return;
    }

    try {
      const response = await fetch(`/api/business-management/projects/${selectedProject}/goals`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          title: newGoalTitle,
          description: newGoalDescription,
          targetValue: parseFloat(newGoalTargetValue.toString())
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewGoalTitle('');
        setNewGoalDescription('');
        setNewGoalTargetValue(0);
        fetchGoals(selectedProject); // Refresh the goals list
      } else {
        setError(result.message || 'Failed to create goal');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleCreateMilestone = async () => {
    if (!selectedGoal || !newMilestoneTitle.trim()) {
      setError('Goal must be selected and milestone title is required');
      return;
    }

    try {
      const response = await fetch(`/api/business-management/goals/${selectedGoal}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({
          title: newMilestoneTitle,
          description: newMilestoneDescription,
          targetDate: newMilestoneTargetDate || null
        })
      });

      const result = await response.json();

      if (result.success) {
        setNewMilestoneTitle('');
        setNewMilestoneDescription('');
        setNewMilestoneTargetDate('');
        fetchMilestones(selectedGoal); // Refresh the milestones list
      } else {
        setError(result.message || 'Failed to create milestone');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleToggleMilestone = async (milestoneId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/business-management/milestones/${milestoneId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || 'fake-token'}` // In real app, use proper auth
        },
        body: JSON.stringify({ completed: !completed })
      });

      const result = await response.json();

      if (result.success) {
        // Update the milestone in the local state
        setMilestones(milestones.map(m =>
          m.id === milestoneId ? { ...m, completed: !completed } : m
        ));
      } else {
        setError(result.message || 'Failed to update milestone');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div
      className="business-management-panel"
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
      <h3 style={{ margin: '0 0 1rem 0' }}>Business Management Tools</h3>

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
        {(['projects', 'goals', 'milestones'] as const).map((tab) => (
          <button
            key={tab}
            aria-label={tab}
            onClick={() => {
              setActiveTab(tab);
              if (tab === 'projects') {
                setSelectedProject(null);
                setSelectedGoal(null);
              } else if (tab === 'goals' && !selectedProject) {
                // If switching to goals but no project is selected, default to first project
                if (projects.length > 0) {
                  setSelectedProject(projects[0].id);
                }
              } else if (tab === 'milestones' && !selectedGoal) {
                // If switching to milestones but no goal is selected, default to first goal
                if (goals.length > 0) {
                  setSelectedGoal(goals[0].id);
                }
              }
            }}
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

      {!loading && activeTab === 'projects' && (
        <div>
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
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Industry</label>
              <input
                type="text"
                value={newProjectIndustry}
                onChange={(e) => setNewProjectIndustry(e.target.value)}
                placeholder="Enter industry"
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

            <button
              onClick={handleCreateProject}
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
                  onClick={() => {
                    setSelectedProject(project.id);
                    setActiveTab('goals');
                  }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {project.industry} • {project.status} • Started: {formatDate(project.startDate)}
                  </div>
                  {project.description && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {project.description.substring(0, 100)}{project.description.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'goals' && (
        <div>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Goal for {projects.find(p => p.id === selectedProject)?.name || 'Selected Project'}</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Goal Title</label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                placeholder="Enter goal title"
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
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                placeholder="Enter goal description"
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

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Target Value</label>
              <input
                type="number"
                value={newGoalTargetValue}
                onChange={(e) => setNewGoalTargetValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter target value"
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
              onClick={handleCreateGoal}
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
              Create Goal
            </button>
          </div>

          <h4>Goals for {projects.find(p => p.id === selectedProject)?.name || 'Selected Project'}</h4>
          {goals.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No goals created yet for this project. Create your first goal!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {goals.map(goal => (
                <div
                  key={goal.id}
                  onClick={() => {
                    setSelectedGoal(goal.id);
                    setActiveTab('milestones');
                  }}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                    {goal.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {goal.status} • Priority: {goal.priority} • Target: {goal.targetValue}
                  </div>
                  {goal.description && (
                    <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                      {goal.description.substring(0, 100)}{goal.description.length > 100 ? '...' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && activeTab === 'milestones' && (
        <div>
          <div style={{
            padding: '1rem',
            backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            marginBottom: '1rem'
          }}>
            <h4>Create New Milestone for {goals.find(g => g.id === selectedGoal)?.title || 'Selected Goal'}</h4>
            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Milestone Title</label>
              <input
                type="text"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Enter milestone title"
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
                value={newMilestoneDescription}
                onChange={(e) => setNewMilestoneDescription(e.target.value)}
                placeholder="Enter milestone description"
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

            <div style={{ marginBottom: '0.75rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem' }}>Target Date</label>
              <input
                type="date"
                value={newMilestoneTargetDate}
                onChange={(e) => setNewMilestoneTargetDate(e.target.value)}
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
              onClick={handleCreateMilestone}
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
              Create Milestone
            </button>
          </div>

          <h4>Milestones for {goals.find(g => g.id === selectedGoal)?.title || 'Selected Goal'}</h4>
          {milestones.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1rem', color: '#9ca3af' }}>
              No milestones created yet for this goal. Create your first milestone!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {milestones.map(milestone => (
                <div
                  key={milestone.id}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: theme === 'dark' ? '#374151' : theme === 'blue' ? '#eff6ff' : 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={milestone.completed}
                    onChange={() => handleToggleMilestone(milestone.id, milestone.completed)}
                    style={{ marginRight: '0.75rem', cursor: 'pointer' }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                      {milestone.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Target: {formatDate(milestone.targetDate)} • Status: {milestone.completed ? 'Completed' : 'Pending'}
                    </div>
                    {milestone.description && (
                      <div style={{ marginTop: '0.25rem', fontSize: '0.8rem' }}>
                        {milestone.description.substring(0, 100)}{milestone.description.length > 100 ? '...' : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessManagement;
