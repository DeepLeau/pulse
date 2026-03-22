'use client';

import { useState, useCallback } from 'react';
import type { Endpoint, EndpointFormData } from '@/lib/data';

const initialEndpoints: Endpoint[] = [
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

function generateId(): string {
  return `ep-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function useEndpointsStore() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>(initialEndpoints);

  const addEndpoint = useCallback((data: EndpointFormData): Endpoint => {
    const newEndpoint: Endpoint = {
      id: generateId(),
      name: data.name,
      url: data.url.replace(/^https?:\/\//, ''),
      status: 'healthy',
      latency: Math.floor(Math.random() * 100) + 20,
      uptime: 100,
      lastCheck: 'Just now',
    };
    setEndpoints((prev) => [newEndpoint, ...prev]);
    return newEndpoint;
  }, []);

  const deleteEndpoint = useCallback((id: string): void => {
    setEndpoints((prev) => prev.filter((endpoint) => endpoint.id !== id));
  }, []);

  const updateEndpoint = useCallback((id: string, data: EndpointFormData): void => {
    setEndpoints((prev) =>
      prev.map((endpoint) =>
        endpoint.id === id
          ? {
              ...endpoint,
              name: data.name,
              url: data.url.replace(/^https?:\/\//, ''),
              latency: Math.floor(Math.random() * 100) + 20,
              lastCheck: 'Just now',
            }
          : endpoint
      )
    );
  }, []);

  return { endpoints, addEndpoint, deleteEndpoint, updateEndpoint };
}
