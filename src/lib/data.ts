// Données mockées pour le dashboard Pulse
// Mode database-free : à remplacer par une vraie connexion base de données

export interface Incident {
  id: string;
  endpoint: string;
  status: 'critical' | 'warning' | 'resolved';
  message: string;
  timestamp: string;
  duration: string;
}

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
  uptime: number;
  lastCheck: string;
}

export interface Metric {
  label: string;
  value: string;
  delta: string;
  trend: 'up' | 'down' | 'neutral';
}

export const dashboardMetrics: Metric[] = [
  { label: 'Total API calls', value: '1.2M', delta: '+12.4%', trend: 'up' },
  { label: 'Avg response time', value: '142ms', delta: '-8.2%', trend: 'down' },
  { label: 'Uptime (24h)', value: '99.94%', delta: '+0.02%', trend: 'up' },
  { label: 'Error rate', value: '0.08%', delta: '-0.03%', trend: 'down' },
];

export const recentIncidents: Incident[] = [
  {
    id: 'inc-001',
    endpoint: 'POST /api/users',
    status: 'critical',
    message: 'Connection timeout after 30s',
    timestamp: '2 min ago',
    duration: '12m 34s',
  },
  {
    id: 'inc-002',
    endpoint: 'GET /api/products',
    status: 'warning',
    message: 'Elevated latency detected (>500ms)',
    timestamp: '15 min ago',
    duration: '3m 12s',
  },
  {
    id: 'inc-003',
    endpoint: 'GET /api/analytics',
    status: 'resolved',
    message: 'SSL certificate renewed successfully',
    timestamp: '1h ago',
    duration: '45m 00s',
  },
  {
    id: 'inc-004',
    endpoint: 'POST /api/webhooks',
    status: 'resolved',
    message: 'Rate limit exceeded - auto-recovered',
    timestamp: '3h ago',
    duration: '8m 22s',
  },
];

export const monitoredEndpoints: Endpoint[] = [
  { id: 'ep-001', name: 'User Service', url: 'api.example.com/users', status: 'healthy', latency: 45, uptime: 99.99, lastCheck: 'Just now' },
  { id: 'ep-002', name: 'Payment Gateway', url: 'api.example.com/payments', status: 'healthy', latency: 128, uptime: 99.98, lastCheck: 'Just now' },
  { id: 'ep-003', name: 'Auth Service', url: 'api.example.com/auth', status: 'degraded', latency: 520, uptime: 99.85, lastCheck: 'Just now' },
  { id: 'ep-004', name: 'Analytics', url: 'api.example.com/analytics', status: 'healthy', latency: 89, uptime: 99.97, lastCheck: 'Just now' },
  { id: 'ep-005', name: 'Notifications', url: 'api.example.com/notifications', status: 'down', latency: 0, uptime: 98.42, lastCheck: 'Just now' },
  { id: 'ep-006', name: 'Search Engine', url: 'api.example.com/search', status: 'healthy', latency: 156, uptime: 99.95, lastCheck: 'Just now' },
];

export const statusColors = {
  healthy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' },
  degraded: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  down: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
  critical: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
  warning: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
  resolved: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' },
};
