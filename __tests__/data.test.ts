import { filterEndpoints, type Endpoint } from '@/lib/data';

describe('filterEndpoints', () => {
  const mockEndpoints: Endpoint[] = [
    { id: 'ep-001', name: 'User Service', url: 'api.example.com/users', status: 'healthy', latency: 45, uptime: 99.99, lastCheck: 'Just now' },
    { id: 'ep-002', name: 'Payment Gateway', url: 'api.example.com/payments', status: 'healthy', latency: 128, uptime: 99.98, lastCheck: 'Just now' },
    { id: 'ep-003', name: 'Auth Service', url: 'api.example.com/auth', status: 'degraded', latency: 520, uptime: 99.85, lastCheck: 'Just now' },
    { id: 'ep-004', name: 'Notifications', url: 'api.example.com/notifications', status: 'down', latency: 0, uptime: 98.42, lastCheck: 'Just now' },
  ];

  // Arrange — Already done via mockEndpoints constant

  it('should return all endpoints when query is empty', () => {
    // Act
    const result = filterEndpoints('', mockEndpoints);

    // Assert
    expect(result).toHaveLength(4);
  });

  it('should filter endpoints by name (case-insensitive)', () => {
    // Act
    const result = filterEndpoints('payment', mockEndpoints);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('Payment Gateway');
  });

  it('should filter endpoints by URL', () => {
    // Act
    const result = filterEndpoints('auth', mockEndpoints);

    // Assert
    expect(result).toHaveLength(1);
    expect(result[0].url).toContain('auth');
  });

  it('should return empty array when no matches found', () => {
    // Act
    const result = filterEndpoints('nonexistent', mockEndpoints);

    // Assert
    expect(result).toHaveLength(0);
  });
});
