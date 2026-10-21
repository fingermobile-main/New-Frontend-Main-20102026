import React, {} from 'react';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'completed';
  assignee?: string;
}

interface TaskListProps {
  tasks?: Task[];
  onTaskClick?: (taskId: string) => void;
  onCompleteTask?: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks: propTasks,
  onTaskClick,
  onCompleteTask
}) => {
  const defaultTasks: Task[] = [
    {
      id: '1',
      title: 'Review quarterly reports',
      dueDate: '2026-06-10',
      priority: 'high',
      status: 'pending',
      assignee: 'John Doe'
    },
    {
      id: '2',
      title: 'Update product documentation',
      dueDate: '2026-06-12',
      priority: 'medium',
      status: 'in_progress'
    },
    {
      id: '3',
      title: 'Team meeting preparation',
      dueDate: '2026-06-09',
      priority: 'low',
      status: 'completed'
    }
  ];

  const tasks = propTasks || defaultTasks;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
    case 'high':
      return 'bg-red-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === 'completed') {
      return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    }
    return <div className="h-5 w-5 border-2 border-muted-foreground rounded-full" />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Tasks & Reminders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 p-3 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => onTaskClick?.(task.id)} role="button" tabIndex={0}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCompleteTask?.(task.id);
                }}
                className="mt-1"
              >
                {getStatusIcon(task.status)}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${task.status === 'completed' ? 'line-through text-slate-500 font-medium' : 'text-slate-900 dark:text-white font-bold'}`}>
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDate(task.dueDate)}
                  </div>
                  <Badge className={`${getPriorityColor(task.priority)} text-white text-xs`}>
                    {task.priority}
                  </Badge>
                  {task.assignee && <span>• {task.assignee}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskList;
