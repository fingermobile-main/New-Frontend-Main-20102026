import React, {} from 'react';
import { User, Shield, Settings, Activity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface SystemMetric {
  label: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  trend?: 'up' | 'down' | 'stable';
}

interface SystemOverviewProps {
  metrics?: SystemMetric[];
  onRefresh?: () => void;
  onViewDetails?: (metric: string) => void;
}

const SystemOverview: React.FC<SystemOverviewProps> = ({
  metrics: propMetrics,
  onRefresh,
  onViewDetails
}) => {
  const defaultMetrics: SystemMetric[] = [
    { label: 'Server Uptime', value: '99.9%', status: 'healthy', trend: 'stable' },
    { label: 'Active Users', value: '12,456', status: 'healthy', trend: 'up' },
    { label: 'API Response Time', value: '245ms', status: 'healthy', trend: 'down' },
    { label: 'Database Connections', value: '87/100', status: 'warning', trend: 'up' },
    { label: 'Error Rate', value: '0.3%', status: 'healthy', trend: 'down' },
    { label: 'Memory Usage', value: '72%', status: 'warning', trend: 'up' }
  ];

  const metrics = propMetrics || defaultMetrics;

  const getStatusColor = (status: string) => {
    switch (status) {
    case 'healthy':
      return 'bg-green-500';
    case 'warning':
      return 'bg-yellow-500';
    case 'critical':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
    case 'up':
      return '↑';
    case 'down':
      return '↓';
    default:
      return '→';
    }
  };

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6" />
            System Overview
          </h2>
          <p className="text-slate-700 font-medium mt-1">
            Real-time system health monitoring
          </p>
        </div>
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onViewDetails?.(metric.label)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-800">
                  {metric.label}
                </CardTitle>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-3xl font-bold">{metric.value}</div>
                <div className="text-lg text-slate-700">
                  {getTrendIcon(metric.trend)}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Status
          </CardTitle>
          <CardDescription>Current security posture and threats</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">SSL Certificate</span>
              </div>
              <Badge className="bg-green-500">Valid</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-700">Authentication</span>
              </div>
              <Badge className="bg-green-500">Secure</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-700">Firewall</span>
              </div>
              <Badge className="bg-blue-500">Active</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemOverview;
