import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

// Mock framer-motion (required for CreateEndpointModal)
jest.mock('framer-motion', () => {
  const React = require('react');
  const strip = ({ animate, initial, exit, transition, whileInView, whileHover, whileTap, variants, viewport, ...p }: any) => p;
  return {
    motion: new Proxy({}, {
      get: (_t: any, tag: string) => ({ children, ...props }: any) => React.createElement(tag, strip(props), children))
    }),
    AnimatePresence: ({ children }: any) => children,
  };
});

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  usePathname: () => '/dashboard/endpoints',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock the data module
const mockEndpoints = [
  { id: 'ep-001', name: 'User Service', url: 'api.example.com/users', status: 'healthy', latency: 45, uptime: 99.99, lastCheck: 'Just now' },
  { id: 'ep-002', name: 'Payment Gateway', url: 'api.example.com/payments', status: 'healthy', latency: 128, uptime: 99.98, lastCheck: 'Just now' },
  { id: 'ep-003', name: 'Auth Service', url: 'api.example.com/auth', status: 'degraded', latency: 520, uptime: 99.85, lastCheck: 'Just now' },
];

let mockStoreEndpoints = [...mockEndpoints];
const mockAddEndpoint = jest.fn((data: any) => {
  const newEndpoint = {
    id: `ep-${Date.now()}`,
    name: data.name,
    url: data.url.replace(/^https?:\/\//, ''),
    status: 'healthy' as const,
    latency: Math.floor(Math.random() * 100) + 20,
    uptime: 100,
    lastCheck: 'Just now',
  };
  mockStoreEndpoints = [newEndpoint, ...mockStoreEndpoints];
  return newEndpoint;
});

jest.mock('@/lib/data', () => ({
  ...jest.requireActual('@/lib/data'),
  useEndpointsStore: () => ({
    endpoints: mockStoreEndpoints,
    addEndpoint: mockAddEndpoint,
  }),
  filterEndpoints: (query: string, list: any[]) => {
    if (!query.trim()) return list;
    const lowerQuery = query.toLowerCase().trim();
    return list.filter(
      (endpoint) =>
        endpoint.name.toLowerCase().includes(lowerQuery) ||
        endpoint.url.toLowerCase().includes(lowerQuery)
    );
  },
  statusColors: {
    healthy: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', dot: 'bg-green-400' },
    degraded: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', dot: 'bg-yellow-400' },
    down: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', dot: 'bg-red-400' },
  },
}));

import EndpointsPage from '@/app/dashboard/endpoints/page';

describe('EndpointsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStoreEndpoints = [...mockEndpoints];
  });

  it('should open modal when clicking Add endpoint button', async () => {
    // Arrange
    render(<EndpointsPage />);
    
    // Act
    const addButton = screen.getByRole('button', { name: /add endpoint/i });
    await userEvent.click(addButton);
    
    // Assert
    const modal = screen.getByRole('dialog', { name: /create endpoint/i });
    expect(modal).toBeInTheDocument();
    
    // Verify modal content
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/url/i)).toBeInTheDocument();
  });

  it('should filter endpoints when searching by name', async () => {
    // Arrange
    render(<EndpointsPage />);
    
    // Verify initial state - all endpoints visible
    expect(screen.getByText('User Service')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
    expect(screen.getByText('Auth Service')).toBeInTheDocument();
    
    // Act - search for "User"
    const searchInput = screen.getByPlaceholderText(/search endpoints by name or url/i);
    await userEvent.type(searchInput, 'User');
    
    // Assert - only User Service should appear
    expect(screen.getByText('User Service')).toBeInTheDocument();
    expect(screen.queryByText('Payment Gateway')).not.toBeInTheDocument();
    expect(screen.queryByText('Auth Service')).not.toBeInTheDocument();
  });

  it('should add new endpoint and display it in the list', async () => {
    // Arrange
    render(<EndpointsPage />);
    
    // Open modal
    const addButton = screen.getByRole('button', { name: /add endpoint/i });
    await userEvent.click(addButton);
    
    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const urlInput = screen.getByLabelText(/url/i);
    
    await userEvent.type(nameInput, 'New API');
    await userEvent.type(urlInput, 'https://new-api.example.com/health');
    
    // Act - submit
    const submitButton = screen.getByRole('button', { name: /create endpoint/i });
    await userEvent.click(submitButton);
    
    // Wait for async operation and modal to close
    await screen.findByText('Created!');
    
    // Assert - new endpoint appears in the list
    expect(screen.getByText('New API')).toBeInTheDocument();
  });
});
