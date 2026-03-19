// Données mockées pour le dashboard Pulse
// Mode database-free : à remplacer par une vraie connexion base de données
//
// NOTE: Le state management des endpoints a été extrait dans src/lib/store.tsx
// Utilisez useEndpoints() depuis store.tsx pour accéder au store partagé

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

export interface EndpointFormData {
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  interval: '30s' | '60s' | '5m' | '15m';
  timeout: '5s' | '10s' | '30s';
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

// Pure function for filtering endpoints (used in tests and components)
export function filterEndpoints(query: string, list: Endpoint[]): Endpoint[] {
  if (!query.trim()) return list;
  const lowerQuery = query.toLowerCase().trim();
  return list.filter(
    (endpoint) =>
      endpoint.name.toLowerCase().includes(lowerQuery) ||
      endpoint.url.toLowerCase().includes(lowerQuery)
  );
}

// Re-export for compatibility
export const endpointsList: Endpoint[] = [];

// ============================================
// DONNÉES POUR LA PAGE ENDPOINTS
// ============================================

export const endpointsListStatic: Endpoint[] = [
  { id: 'ep-001', name: 'User Service', url: 'api.example.com/users', status: 'healthy', latency: 45, uptime: 99.99, lastCheck: 'Just now' },
  { id: 'ep-002', name: 'Payment Gateway', url: 'api.example.com/payments', status: 'healthy', latency: 128, uptime: 99.98, lastCheck: 'Just now' },
  { id: 'ep-003', name: 'Auth Service', url: 'api.example.com/auth', status: 'degraded', latency: 520, uptime: 99.85, lastCheck: 'Just now' },
  { id: 'ep-004', name: 'Analytics', url: 'api.example.com/analytics', status: 'healthy', latency: 89, uptime: 99.97, lastCheck: 'Just now' },
  { id: 'ep-005', name: 'Notifications', url: 'api.example.com/notifications', status: 'down', latency: 0, uptime: 98.42, lastCheck: 'Just now' },
  { id: 'ep-006', name: 'Search Engine', url: 'api.example.com/search', status: 'healthy', latency: 156, uptime: 99.95, lastCheck: 'Just now' },
  { id: 'ep-007', name: 'Image CDN', url: 'cdn.example.com/images', status: 'healthy', latency: 32, uptime: 99.99, lastCheck: 'Just now' },
  { id: 'ep-008', name: 'Email Service', url: 'api.example.com/emails', status: 'healthy', latency: 78, uptime: 99.92, lastCheck: 'Just now' },
  { id: 'ep-009', name: 'File Storage', url: 'api.example.com/storage', status: 'degraded', latency: 340, uptime: 99.78, lastCheck: 'Just now' },
  { id: 'ep-010', name: 'ML Inference', url: 'api.example.com/ml', status: 'healthy', latency: 245, uptime: 99.95, lastCheck: 'Just now' },
];

// ============================================
// DONNÉES POUR LA PAGE INCIDENTS
// ============================================

export const incidentsList: Incident[] = [
  {
    id: 'inc-001',
    endpoint: 'POST /api/users',
    status: 'critical',
    message: 'Connection timeout after 30s - Database connection pool exhausted',
    timestamp: '2 min ago',
    duration: '12m 34s',
  },
  {
    id: 'inc-002',
    endpoint: 'GET /api/products',
    status: 'warning',
    message: 'Elevated latency detected (>500ms) for 5 consecutive checks',
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
    message: 'Rate limit exceeded - auto-recovered after 8 minutes',
    timestamp: '3h ago',
    duration: '8m 22s',
  },
  {
    id: 'inc-005',
    endpoint: 'GET /api/search',
    status: 'resolved',
    message: 'Elasticsearch cluster rebalancing completed',
    timestamp: '6h ago',
    duration: '22m 15s',
  },
  {
    id: 'inc-006',
    endpoint: 'POST /api/checkout',
    status: 'warning',
    message: 'High error rate detected (5.2%) - payment provider experiencing issues',
    timestamp: '8h ago',
    duration: '15m 45s',
  },
];

export const incidentTimeline = [
  { time: '14:32', event: 'Incident created', user: 'System' },
  { time: '14:34', event: 'Alert triggered: Critical threshold exceeded', user: 'System' },
  { time: '14:35', event: 'On-call engineer notified', user: 'System' },
  { time: '14:38', event: 'Investigation started', user: 'John Doe' },
  { time: '14:42', event: 'Root cause identified: Database connection pool', user: 'John Doe' },
  { time: '14:45', event: 'Mitigation applied: Increased pool size', user: 'John Doe' },
  { time: '14:48', event: 'Services recovering', user: 'System' },
  { time: '14:55', event: 'Incident resolved', user: 'John Doe' },
];

// ============================================
// DONNÉES POUR LA PAGE ANALYTICS
// ============================================

export const analyticsMetrics: Metric[] = [
  { label: 'Total requests', value: '24.8M', delta: '+18.2%', trend: 'up' },
  { label: 'Avg latency', value: '128ms', delta: '-12.5%', trend: 'down' },
  { label: 'P99 latency', value: '485ms', delta: '-8.3%', trend: 'down' },
  { label: 'Error rate', value: '0.12%', delta: '+0.02%', trend: 'up' },
];

export const latencyHistory = [
  { time: '00:00', value: 120 },
  { time: '04:00', value: 98 },
  { time: '08:00', value: 145 },
  { time: '12:00', value: 168 },
  { time: '16:00', value: 152 },
  { time: '20:00', value: 128 },
  { time: '24:00', value: 112 },
];

export const requestVolume = [
  { time: 'Mon', value: 3.2 },
  { time: 'Tue', value: 3.8 },
  { time: 'Wed', value: 4.1 },
  { time: 'Thu', value: 3.9 },
  { time: 'Fri', value: 4.5 },
  { time: 'Sat', value: 2.8 },
  { time: 'Sun', value: 2.4 },
];

export const topEndpoints = [
  { name: 'GET /api/users', requests: '8.2M', latency: '45ms', errors: '0.02%' },
  { name: 'POST /api/auth', requests: '5.4M', latency: '78ms', errors: '0.05%' },
  { name: 'GET /api/products', requests: '4.1M', latency: '92ms', errors: '0.08%' },
  { name: 'POST /api/orders', requests: '2.8M', latency: '156ms', errors: '0.12%' },
  { name: 'GET /api/search', requests: '2.2M', latency: '245ms', errors: '0.15%' },
];

// ============================================
// DONNÉES POUR LA PAGE TEAM
// ============================================

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  status: 'active' | 'invited';
  avatar: string;
  lastActive: string;
}

export const teamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'John Doe', email: 'john@acme.com', role: 'owner', status: 'active', avatar: 'JD', lastActive: 'Just now' },
  { id: 'tm-002', name: 'Sarah Chen', email: 'sarah@acme.com', role: 'admin', status: 'active', avatar: 'SC', lastActive: '5m ago' },
  { id: 'tm-003', name: 'Mike Wilson', email: 'mike@acme.com', role: 'member', status: 'active', avatar: 'MW', lastActive: '1h ago' },
  { id: 'tm-004', name: 'Emily Davis', email: 'emily@acme.com', role: 'member', status: 'active', avatar: 'ED', lastActive: '3h ago' },
  { id: 'tm-005', name: 'Alex Kim', email: 'alex@acme.com', role: 'viewer', status: 'invited', avatar: 'AK', lastActive: 'Pending' },
];

export const rolePermissions = {
  owner: ['Full access', 'Billing', 'Delete workspace'],
  admin: ['Manage endpoints', 'Manage team', 'View analytics'],
  member: ['View endpoints', 'View incidents', 'Create incidents'],
  viewer: ['View only'],
};

// ============================================
// DONNÉES POUR LA PAGE NOTIFICATIONS
// ============================================

export interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'slack' | 'discord' | 'webhook' | 'sms';
  status: 'active' | 'inactive';
  recipients: number;
  lastTriggered: string;
}

export const notificationChannels: NotificationChannel[] = [
  { id: 'nc-001', name: 'Engineering Team', type: 'slack', status: 'active', recipients: 12, lastTriggered: '2 min ago' },
  { id: 'nc-002', name: 'On-call Rotation', type: 'sms', status: 'active', recipients: 4, lastTriggered: '15 min ago' },
  { id: 'nc-003', name: 'Critical Alerts', type: 'email', status: 'active', recipients: 8, lastTriggered: '1h ago' },
  { id: 'nc-004', name: 'Dev Channel', type: 'discord', status: 'active', recipients: 25, lastTriggered: '3h ago' },
  { id: 'nc-005', name: 'Management', type: 'webhook', status: 'inactive', recipients: 3, lastTriggered: 'Never' },
];

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'critical' | 'warning' | 'info';
  channels: number;
  enabled: boolean;
}

export const alertRules: AlertRule[] = [
  { id: 'ar-001', name: 'Endpoint Down', condition: 'Status = down for 1 min', severity: 'critical', channels: 3, enabled: true },
  { id: 'ar-002', name: 'High Latency', condition: 'Latency > 500ms for 5 min', severity: 'warning', channels: 2, enabled: true },
  { id: 'ar-003', name: 'Error Rate Spike', condition: 'Error rate > 1% for 2 min', severity: 'critical', channels: 3, enabled: true },
  { id: 'ar-004', name: 'SSL Expiring', condition: 'Certificate expires in < 7 days', severity: 'info', channels: 1, enabled: true },
  { id: 'ar-005', name: 'Uptime Drop', condition: 'Uptime < 99.9% in 1 hour', severity: 'warning', channels: 2, enabled: false },
];

// ============================================
// DONNÉES POUR LA PAGE SETTINGS
// ============================================

export const workspaceSettings = {
  name: 'production',
  region: 'us-east-1',
  timezone: 'America/New_York',
  autoResolve: true,
  retentionDays: 30,
};

export const billingInfo = {
  plan: 'Pro',
  price: '$49/mo',
  nextBilling: 'Dec 15, 2024',
  usage: { endpoints: '10/20', alerts: '45/100', team: '4/10' },
};
