import { create } from 'zustand';

// ============================================
// Types - Endpoint
// ============================================
export type EndpointStatus = 'healthy' | 'degraded' | 'down';

export interface Endpoint {
  id: string;
  name: string;
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  status: EndpointStatus;
  latency: number;
  uptime: number;
  lastCheck: string;
  interval: string;
  timeout: string;
}

export type Method = Endpoint['method'];
export type Interval = '30s' | '60s' | '5m' | '15m';
export type Timeout = '5s' | '10s' | '30s';

export interface EndpointFormData {
  name: string;
  url: string;
  method: Method;
  interval: Interval;
  timeout: Timeout;
}

export interface EndpointStore {
  endpoints: Endpoint[];
  addEndpoint: (data: EndpointFormData) => void;
  removeEndpoint: (id: string) => void;
  updateEndpoint: (id: string, data: Partial<Endpoint>) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useEndpointsStore = create<EndpointStore>((set) => ({
  endpoints: [
    {
      id: '1',
      name: 'Production API',
      url: 'https://api.example.com/health',
      method: 'GET',
      status: 'healthy',
      latency: 45,
      uptime: 99.98,
      lastCheck: '2 min ago',
      interval: '60s',
      timeout: '10s',
    },
    {
      id: '2',
      name: 'Auth Service',
      url: 'https://auth.example.com/status',
      method: 'GET',
      status: 'healthy',
      latency: 32,
      uptime: 99.99,
      lastCheck: '1 min ago',
      interval: '60s',
      timeout: '10s',
    },
    {
      id: '3',
      name: 'Database Primary',
      url: 'https://db.example.com/health',
      method: 'GET',
      status: 'degraded',
      latency: 285,
      uptime: 98.5,
      lastCheck: '30s ago',
      interval: '30s',
      timeout: '5s',
    },
    {
      id: '4',
      name: 'Cache Layer',
      url: 'https://cache.example.com/ping',
      method: 'GET',
      status: 'healthy',
      latency: 12,
      uptime: 100,
      lastCheck: '1 min ago',
      interval: '60s',
      timeout: '5s',
    },
    {
      id: '5',
      name: 'CDN Edge',
      url: 'https://cdn.example.com/health',
      method: 'GET',
      status: 'down',
      latency: 0,
      uptime: 95.2,
      lastCheck: '5 min ago',
      interval: '60s',
      timeout: '10s',
    },
  ],
  addEndpoint: (data) =>
    set((state) => ({
      endpoints: [
        ...state.endpoints,
        {
          id: generateId(),
          ...data,
          status: 'healthy' as EndpointStatus,
          latency: 0,
          uptime: 100,
          lastCheck: 'Just now',
        },
      ],
    })),
  removeEndpoint: (id) =>
    set((state) => ({
      endpoints: state.endpoints.filter((e) => e.id !== id),
    })),
  updateEndpoint: (id, data) =>
    set((state) => ({
      endpoints: state.endpoints.map((e) =>
        e.id === id ? { ...e, ...data } : e
      ),
    })),
}));

export function filterEndpoints(query: string, endpoints: Endpoint[]): Endpoint[] {
  if (!query.trim()) return endpoints;
  const lowerQuery = query.toLowerCase();
  return endpoints.filter(
    (e) =>
      e.name.toLowerCase().includes(lowerQuery) ||
      e.url.toLowerCase().includes(lowerQuery)
  );
}

export const statusColors = {
  healthy: {
    dot: 'bg-green-400',
    bg: 'bg-green-500/10',
    text: 'text-green-400',
    border: 'border-green-500/20',
  },
  degraded: {
    dot: 'bg-yellow-400',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20',
  },
  down: {
    dot: 'bg-red-400',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/20',
  },
};

// ============================================
// Types - Dashboard
// ============================================
export interface DashboardMetric {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
}

export const dashboardMetrics: DashboardMetric[] = [
  { label: 'Total endpoints', value: '24', delta: '+3', up: true },
  { label: 'Healthy', value: '21', delta: '+2', up: true },
  { label: 'Avg latency', value: '48ms', delta: '-12ms', up: true },
  { label: 'Uptime (30d)', value: '99.94%', delta: null },
];

export interface RecentIncident {
  id: string;
  title: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'resolved' | 'monitoring' | 'investigating';
  endpoint: string;
  time: string;
}

export const recentIncidents: RecentIncident[] = [
  {
    id: 'inc-001',
    title: 'CDN Edge connection timeout',
    severity: 'critical',
    status: 'resolved',
    endpoint: 'CDN Edge',
    time: '2 hours ago',
  },
  {
    id: 'inc-002',
    title: 'Database latency spike',
    severity: 'warning',
    status: 'monitoring',
    endpoint: 'Database Primary',
    time: '5 hours ago',
  },
  {
    id: 'inc-003',
    title: 'SSL certificate expiring soon',
    severity: 'info',
    status: 'investigating',
    endpoint: 'Auth Service',
    time: '1 day ago',
  },
];

export interface MonitoredEndpoint {
  id: string;
  name: string;
  url: string;
  status: EndpointStatus;
}

export const monitoredEndpoints: MonitoredEndpoint[] = [
  { id: '1', name: 'Production API', url: 'https://api.example.com/health', status: 'healthy' },
  { id: '2', name: 'Auth Service', url: 'https://auth.example.com/status', status: 'healthy' },
  { id: '3', name: 'Database Primary', url: 'https://db.example.com/health', status: 'degraded' },
  { id: '4', name: 'Cache Layer', url: 'https://cache.example.com/ping', status: 'healthy' },
  { id: '5', name: 'CDN Edge', url: 'https://cdn.example.com/health', status: 'down' },
];

// ============================================
// Types - Analytics
// ============================================
export interface AnalyticsMetric {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export const analyticsMetrics: AnalyticsMetric[] = [
  { label: 'Total requests', value: '1.2M', change: '+12.5%', trend: 'up' },
  { label: 'Avg response time', value: '48ms', change: '-8.2%', trend: 'down' },
  { label: 'Error rate', value: '0.12%', change: '-0.04%', trend: 'down' },
  { label: 'p95 latency', value: '125ms', change: '-15ms', trend: 'down' },
];

export interface LatencyDataPoint {
  time: string;
  p50: number;
  p95: number;
  p99: number;
}

export const latencyHistory: LatencyDataPoint[] = [
  { time: '00:00', p50: 42, p95: 118, p99: 245 },
  { time: '04:00', p50: 38, p95: 105, p99: 220 },
  { time: '08:00', p50: 55, p95: 145, p99: 310 },
  { time: '12:00', p50: 62, p95: 168, p99: 380 },
  { time: '16:00', p50: 58, p95: 155, p99: 345 },
  { time: '20:00', p50: 45, p95: 128, p99: 275 },
];

export interface RequestVolumeDataPoint {
  time: string;
  requests: number;
  errors: number;
}

export const requestVolume: RequestVolumeDataPoint[] = [
  { time: '00:00', requests: 12000, errors: 12 },
  { time: '04:00', requests: 8500, errors: 8 },
  { time: '08:00', requests: 45000, errors: 45 },
  { time: '12:00', requests: 68000, errors: 72 },
  { time: '16:00', requests: 72000, errors: 85 },
  { time: '20:00', requests: 52000, errors: 48 },
];

export interface TopEndpoint {
  id: string;
  name: string;
  requests: number;
  avgLatency: number;
  errorRate: number;
}

export const topEndpoints: TopEndpoint[] = [
  { id: '1', name: 'Production API', requests: 450000, avgLatency: 42, errorRate: 0.08 },
  { id: '2', name: 'Auth Service', requests: 380000, avgLatency: 28, errorRate: 0.05 },
  { id: '3', name: 'Payment Gateway', requests: 210000, avgLatency: 85, errorRate: 0.12 },
  { id: '4', name: 'User Profile', requests: 180000, avgLatency: 35, errorRate: 0.03 },
  { id: '5', name: 'Search Service', requests: 95000, avgLatency: 65, errorRate: 0.15 },
];

// ============================================
// Types - Incidents
// ============================================
export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'resolved' | 'monitoring' | 'investigating';
  endpoint: string;
  startedAt: string;
  resolvedAt?: string;
  affectedRegions: string[];
}

export const incidentsList: Incident[] = [
  {
    id: 'inc-001',
    title: 'CDN Edge connection timeout',
    description: 'Multiple timeout errors detected on CDN Edge endpoints',
    severity: 'critical',
    status: 'resolved',
    endpoint: 'CDN Edge',
    startedAt: '2024-01-15T14:30:00Z',
    resolvedAt: '2024-01-15T16:45:00Z',
    affectedRegions: ['us-east-1', 'us-west-2'],
  },
  {
    id: 'inc-002',
    title: 'Database latency spike',
    description: 'Elevated latency detected on primary database cluster',
    severity: 'warning',
    status: 'monitoring',
    endpoint: 'Database Primary',
    startedAt: '2024-01-15T10:00:00Z',
    affectedRegions: ['us-east-1'],
  },
  {
    id: 'inc-003',
    title: 'SSL certificate expiring soon',
    description: 'SSL certificate for auth.example.com expires in 7 days',
    severity: 'info',
    status: 'investigating',
    endpoint: 'Auth Service',
    startedAt: '2024-01-14T09:00:00Z',
    affectedRegions: ['global'],
  },
];

export interface IncidentTimelineEvent {
  id: string;
  type: 'started' | 'updated' | 'resolved';
  message: string;
  timestamp: string;
  incidentId: string;
}

export const incidentTimeline: IncidentTimelineEvent[] = [
  { id: 'evt-001', type: 'started', message: 'Incident started: CDN Edge connection timeout', timestamp: '2024-01-15T14:30:00Z', incidentId: 'inc-001' },
  { id: 'evt-002', type: 'updated', message: 'Investigation started', timestamp: '2024-01-15T14:35:00Z', incidentId: 'inc-001' },
  { id: 'evt-003', type: 'updated', message: 'Root cause identified: DDoS attack', timestamp: '2024-01-15T15:00:00Z', incidentId: 'inc-001' },
  { id: 'evt-004', type: 'updated', message: 'Mitigation in progress', timestamp: '2024-01-15T15:30:00Z', incidentId: 'inc-001' },
  { id: 'evt-005', type: 'resolved', message: 'Incident resolved', timestamp: '2024-01-15T16:45:00Z', incidentId: 'inc-001' },
];

// ============================================
// Types - Notifications
// ============================================
export interface NotificationChannel {
  id: string;
  type: 'email' | 'slack' | 'discord' | 'webhook' | 'sms';
  name: string;
  config: Record<string, string>;
  enabled: boolean;
}

export const notificationChannels: NotificationChannel[] = [
  { id: 'ch-001', type: 'email', name: 'On-call Team', config: { email: 'team@example.com' }, enabled: true },
  { id: 'ch-002', type: 'slack', type: 'slack', name: '#incidents', config: { channel: '#incidents', webhookUrl: 'https://hooks.slack.com/xxx' }, enabled: true },
  { id: 'ch-003', type: 'webhook', name: 'PagerDuty', config: { url: 'https://events.pagerduty.com/v2/enqueue' }, enabled: false },
];

export interface AlertRule {
  id: string;
  name: string;
  condition: string;
  severity: 'critical' | 'warning' | 'info';
  channels: string[];
  enabled: boolean;
}

export const alertRules: AlertRule[] = [
  { id: 'rule-001', name: 'Endpoint Down', condition: 'status == down', severity: 'critical', channels: ['ch-001', 'ch-002'], enabled: true },
  { id: 'rule-002', name: 'High Latency', condition: 'latency > 500ms', severity: 'warning', channels: ['ch-001'], enabled: true },
  { id: 'rule-003', name: 'Error Rate Spike', condition: 'error_rate > 1%', severity: 'critical', channels: ['ch-001', 'ch-002'], enabled: true },
  { id: 'rule-004', name: 'SSL Expiring', condition: 'ssl_days_remaining < 30', severity: 'info', channels: ['ch-001'], enabled: false },
];

// ============================================
// Types - Team
// ============================================
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: string;
}

export const teamMembers: TeamMember[] = [
  { id: 'tm-001', name: 'John Doe', email: 'john@example.com', role: 'owner', joinedAt: '2023-06-15T10:00:00Z' },
  { id: 'tm-002', name: 'Jane Smith', email: 'jane@example.com', role: 'admin', joinedAt: '2023-07-20T14:30:00Z' },
  { id: 'tm-003', name: 'Bob Wilson', email: 'bob@example.com', role: 'member', joinedAt: '2023-09-10T09:15:00Z' },
  { id: 'tm-004', name: 'Alice Brown', email: 'alice@example.com', role: 'viewer', joinedAt: '2024-01-05T11:00:00Z' },
];

export const rolePermissions: Record<string, string[]> = {
  owner: ['read', 'write', 'delete', 'manage_team', 'manage_billing', 'manage_settings'],
  admin: ['read', 'write', 'delete', 'manage_team', 'manage_settings'],
  member: ['read', 'write'],
  viewer: ['read'],
};

// ============================================
// Types - Settings
// ============================================
export interface WorkspaceSettings {
  name: string;
  timezone: string;
  dateFormat: string;
  defaultInterval: string;
  defaultTimeout: string;
}

export const workspaceSettings: WorkspaceSettings = {
  name: 'Acme Corp',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  defaultInterval: '60s',
  defaultTimeout: '10s',
};

export interface BillingInfo {
  plan: 'free' | 'pro' | 'enterprise';
  billingEmail: string;
  nextBillingDate: string;
  amount: number;
  paymentMethod: string;
}

export const billingInfo: BillingInfo = {
  plan: 'pro',
  billingEmail: 'billing@acme.com',
  nextBillingDate: '2024-02-01',
  amount: 99,
  paymentMethod: 'Visa ****4242',
};
