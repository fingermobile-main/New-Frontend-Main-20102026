import React, {} from 'react';
import { Lock, AlertTriangle, Shield, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SecurityEvent {
  id: string;
  type: 'login' | 'failed_login' | 'suspicious_activity' | 'password_change';
  user: string;
  ip: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

interface SecurityMonitorProps {
  events?: SecurityEvent[];
  onEventClick?: (eventId: string) => void;
  onViewAll?: () => void;
}

const SecurityMonitor: React.FC<SecurityMonitorProps> = ({
  events: propEvents,
  onEventClick,
  onViewAll
}) => {
  const defaultEvents: SecurityEvent[] = [
    {
      id: '1',
      type: 'login',
      user: 'admin@example.com',
      ip: '192.168.1.100',
      timestamp: '2 minutes ago',
      severity: 'low'
    },
    {
      id: '2',
      type: 'failed_login',
      user: 'unknown@attacker.com',
      ip: '45.33.32.156',
      timestamp: '15 minutes ago',
      severity: 'high'
    },
    {
      id: '3',
      type: 'suspicious_activity',
      user: 'user123@example.com',
      ip: '10.0.0.50',
      timestamp: '1 hour ago',
      severity: 'medium'
    },
    {
      id: '4',
      type: 'password_change',
      user: 'john.doe@example.com',
      ip: '172.16.0.25',
      timestamp: '2 hours ago',
      severity: 'low'
    }
  ];

  const events = propEvents || defaultEvents;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
    case 'critical':
      return 'bg-red-500';
    case 'high':
      return 'bg-orange-500';
    case 'medium':
      return 'bg-yellow-500';
    case 'low':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
    case 'login':
      return <Shield className="h-4 w-4 text-green-600" />;
    case 'failed_login':
      return <Lock className="h-4 w-4 text-red-600" />;
    case 'suspicious_activity':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'password_change':
      return <Eye className="h-4 w-4 text-blue-600" />;
    default:
      return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6" />
            Security Monitor
          </h2>
          <p className="text-slate-700 font-medium mt-1">
            Real-time security event tracking
          </p>
        </div>
        <Button variant="outline" onClick={onViewAll}>
          View All Events
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">2</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              High Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Medium Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-slate-800">
              Low Priority
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">48</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Security Events</CardTitle>
          <CardDescription>Last 24 hours activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onEventClick?.(event.id)} role="button" tabIndex={0}
              >
                <div className="p-2 bg-muted rounded-lg">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(event.severity)}>
                      {event.severity}
                    </Badge>
                    <span className="font-medium">{event.type.replace('_', ' ')}</span>
                  </div>
                  <p className="text-sm text-slate-700 font-medium mt-1 truncate">
                    {event.user} from {event.ip}
                  </p>
                  <p className="text-xs text-slate-600 mt-1">
                    {event.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityMonitor;
