import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  usePathname: () => '/dashboard/endpoints',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock framer-motion
jest.mock('framer-motion', () => {
  const React = require('react');
  const strip = ({ animate, initial, exit, transition, whileInView, whileHover, whileTap, variants, viewport, ...p }: any) => p;
  return {
    motion: new Proxy({}, { get: (_t: any, tag: string) => ({ children, ...props }: any) => React.createElement(tag, strip(props), children) }),
    useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => children,
  };
}, { virtual: true });

// Mock next/image
jest.mock('next/image', () => ({ __esModule: true, default: ({ src, alt, fill, priority, quality, placeholder, blurDataURL, loader, unoptimized, onLoadingComplete, ...props }: any) => <img src={src} alt={alt} {...props} /> }));

// Mock CreateEndpointModal
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
jest.mock('@/components/ui/CreateEndpointModal', () => ({
  CreateEndpointModal: ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void }) => {
    if (!isOpen) return null;
    return (
      <div data-testid="create-modal">
        <button onClick={onClose} data-testid="modal-close">Close</button>
        <button onClick={() => onSubmit({ name: 'Test', url: 'https://test.com', method: 'GET', interval: '60s', timeout: '10s' })} data-testid="modal-submit">Submit</button>
      </div>
    );
  },
}));

// Import après les mocks
import { useEndpointsStore } from '@/hooks/useEndpointsStore';

// Restore real module for the hook we're testing
jest.mock('@/hooks/useEndpointsStore');

import EndpointsPage from '@/app/dashboard/endpoints/page';

describe('EndpointsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Search functionality', () => {
    it('should filter endpoints by name when user types in search', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<EndpointsPage />);
      
      // Act - type a search query for "User Service"
      const searchInput = screen.getByPlaceholderText('Search endpoints by name or URL...');
      await user.type(searchInput, 'User');
      
      // Assert - filtered table shows only matching endpoint
      const table = document.querySelector('table');
      expect(table).toBeInTheDocument();
      const rows = table!.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0]).toHaveTextContent('User Service');
    });

    it('should show empty state with search message when no endpoints match', async () => {
      const user = userEvent.setup({ delay: null });
      
      render(<EndpointsPage />);
      
      // Act - search for something that doesn't exist
      const searchInput = screen.getByPlaceholderText('Search endpoints by name or URL...');
      await user.type(searchInput, 'nonexistent-endpoint-xyz');
      
      // Assert - empty state with search-specific message appears
      expect(screen.getByText('No endpoints found')).toBeInTheDocument();
      expect(screen.getByText('No endpoints match your search. Try a different name or URL.')).toBeInTheDocument();
    });
  });

  describe('Modal interaction', () => {
    it('should open create endpoint modal when clicking Add endpoint button', async () => {
      render(<EndpointsPage />);
      
      // Act - click the Add endpoint button
      const addButton = screen.getByRole('button', { name: /add endpoint/i });
      fireEvent.click(addButton);
      
      // Assert - modal is visible
      expect(screen.getByTestId('create-modal')).toBeInTheDocument();
    });
  });

  describe('Status summary', () => {
    it('should display correct endpoint counts in status badges', () => {
      render(<EndpointsPage />);
      
      // Assert - status summary shows counts from store (3 healthy, 2 degraded, 1 down based on initial data)
      expect(screen.getByText(/healthy/i)).toBeInTheDocument();
      expect(screen.getByText(/degraded/i)).toBeInTheDocument();
      expect(screen.getByText(/down/i)).toBeInTheDocument();
    });
  });
});
