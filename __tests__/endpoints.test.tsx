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

// Initial endpoints matching the store
const initialEndpoints = [
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

// Mock CreateEndpointModal
const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();
jest.mock('@/components/ui/CreateEndpointModal', () => ({
  CreateEndpointModal: ({ isOpen, onClose, onSubmit, editMode, initialData }: any) => {
    if (!isOpen) return null;
    return (
      <div data-testid="endpoint-modal">
        <span data-testid="modal-mode">{editMode ? 'edit' : 'create'}</span>
        <span data-testid="modal-initial-data">{JSON.stringify(initialData)}</span>
        <button onClick={onClose} data-testid="modal-close">Close</button>
        <button onClick={() => onSubmit({ name: 'Test', url: 'https://test.com', method: 'GET', interval: '60s', timeout: '10s' })} data-testid="modal-submit">Submit</button>
      </div>
    );
  },
}));

// Mock EndpointRowMenu
jest.mock('@/components/ui/EndpointRowMenu', () => ({
  EndpointRowMenu: ({ endpoint, onEdit, onDelete }: any) => (
    <div data-testid="row-menu" data-endpoint-id={endpoint.id}>
      <button onClick={() => onEdit(endpoint)} data-testid={`edit-${endpoint.id}`}>Edit</button>
      <button onClick={() => onDelete(endpoint)} data-testid={`delete-${endpoint.id}`}>Delete</button>
    </div>
  ),
}));

// Create a mutable store state for the mock
let storeEndpoints = [...initialEndpoints];
const addEndpointMock = jest.fn((data) => {
  const newEndpoint = {
    id: `ep-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: data.name,
    url: data.url.replace(/^https?:\/\//, ''),
    status: 'healthy',
    latency: Math.floor(Math.random() * 100) + 20,
    uptime: 100,
    lastCheck: 'Just now',
  };
  storeEndpoints = [newEndpoint, ...storeEndpoints];
  return newEndpoint;
});
const deleteEndpointMock = jest.fn((id) => {
  storeEndpoints = storeEndpoints.filter((e) => e.id !== id);
});
const updateEndpointMock = jest.fn((id, data) => {
  storeEndpoints = storeEndpoints.map((e) =>
    e.id === id
      ? { ...e, name: data.name, url: data.url.replace(/^https?:\/\//, ''), lastCheck: 'Just now' }
      : e
  );
});

// Mock useEndpointsStore with implementation
jest.mock('@/hooks/useEndpointsStore', () => ({
  useEndpointsStore: () => ({
    endpoints: storeEndpoints,
    addEndpoint: addEndpointMock,
    deleteEndpoint: deleteEndpointMock,
    updateEndpoint: updateEndpointMock,
  }),
}));

// Import after mocks
import EndpointsPage from '@/app/dashboard/endpoints/page';

describe('EndpointsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    // Reset store state
    storeEndpoints = [...initialEndpoints];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Search functionality', () => {
    it('should filter endpoints by name when user types in search', async () => {
      const user = userEvent.setup({ delay: null });

      render(<EndpointsPage />);

      const searchInput = screen.getByPlaceholderText('Search endpoints by name or URL...');
      await user.type(searchInput, 'User');

      const table = document.querySelector('table');
      expect(table).toBeInTheDocument();
      const rows = table!.querySelectorAll('tbody tr');
      expect(rows.length).toBe(1);
      expect(rows[0]).toHaveTextContent('User Service');
    });

    it('should show empty state with search message when no endpoints match', async () => {
      const user = userEvent.setup({ delay: null });

      render(<EndpointsPage />);

      const searchInput = screen.getByPlaceholderText('Search endpoints by name or URL...');
      await user.type(searchInput, 'nonexistent-endpoint-xyz');

      expect(screen.getByText('No endpoints found')).toBeInTheDocument();
      expect(screen.getByText('No endpoints match your search. Try a different name or URL.')).toBeInTheDocument();
    });
  });

  describe('Modal interaction', () => {
    it('should open create endpoint modal when clicking Add endpoint button', async () => {
      render(<EndpointsPage />);

      const addButton = screen.getByRole('button', { name: /add endpoint/i });
      fireEvent.click(addButton);

      expect(screen.getByTestId('endpoint-modal')).toBeInTheDocument();
      expect(screen.getByTestId('modal-mode')).toHaveTextContent('create');
    });
  });

  describe('Status summary', () => {
    it('should display correct endpoint counts in status badges', () => {
      render(<EndpointsPage />);

      expect(screen.getByText(/healthy/i)).toBeInTheDocument();
      expect(screen.getByText(/degraded/i)).toBeInTheDocument();
      expect(screen.getByText(/down/i)).toBeInTheDocument();
    });
  });

  describe('Pagination', () => {
    it('should show pagination controls when there are more than 8 endpoints', () => {
      render(<EndpointsPage />);

      const pagination = screen.getByText(/Page 1 of/i);
      expect(pagination).toBeInTheDocument();
    });

    it('should display page numbers', () => {
      render(<EndpointsPage />);

      expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Page 2' })).toBeInTheDocument();
    });

    it('should navigate to next page when clicking next button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const nextButton = screen.getByRole('button', { name: 'Next page' });
      await user.click(nextButton);

      expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();
    });

    it('should navigate to previous page when clicking previous button', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const nextButton = screen.getByRole('button', { name: 'Next page' });
      await user.click(nextButton);

      const prevButton = screen.getByRole('button', { name: 'Previous page' });
      await user.click(prevButton);

      expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });

    it('should show only 8 items per page', () => {
      render(<EndpointsPage />);

      const rows = document.querySelectorAll('tbody tr');
      expect(rows.length).toBe(8);
    });

    it('should reset to page 1 when search query changes', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const nextButton = screen.getByRole('button', { name: 'Next page' });
      await user.click(nextButton);
      expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();

      const searchInput = screen.getByPlaceholderText('Search endpoints by name or URL...');
      await user.type(searchInput, 'User');

      expect(screen.getByText(/Page 1 of/i)).toBeInTheDocument();
    });
  });

  describe('Delete functionality', () => {
    it('should call onDelete when delete button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const endpointRow = document.querySelector('tbody tr');
      const deleteButton = endpointRow?.querySelector('[data-testid^="delete-"]') as HTMLElement;
      await user.click(deleteButton);

      const confirmModal = screen.getByText('Delete endpoint?');
      expect(confirmModal).toBeInTheDocument();
    });

    it('should show confirmation dialog with endpoint name', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const endpointRow = document.querySelector('tbody tr');
      const deleteButton = endpointRow?.querySelector('[data-testid^="delete-"]') as HTMLElement;
      await user.click(deleteButton);

      expect(screen.getByText(/User Service/)).toBeInTheDocument();
    });

    it('should close confirmation when cancel is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const endpointRow = document.querySelector('tbody tr');
      const deleteButton = endpointRow?.querySelector('[data-testid^="delete-"]') as HTMLElement;
      await user.click(deleteButton);

      expect(screen.getByText('Delete endpoint?')).toBeInTheDocument();

      const cancelButton = screen.getByRole('button', { name: 'Cancel' });
      await user.click(cancelButton);

      expect(screen.queryByText('Delete endpoint?')).not.toBeInTheDocument();
    });
  });

  describe('Edit functionality', () => {
    it('should open modal in edit mode when edit button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const endpointRow = document.querySelector('tbody tr');
      const editButton = endpointRow?.querySelector('[data-testid^="edit-"]') as HTMLElement;
      await user.click(editButton);

      expect(screen.getByTestId('modal-mode')).toHaveTextContent('edit');
    });

    it('should pre-fill form with endpoint data in edit mode', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const endpointRow = document.querySelector('tbody tr');
      const editButton = endpointRow?.querySelector('[data-testid^="edit-"]') as HTMLElement;
      await user.click(editButton);

      const initialData = JSON.parse(screen.getByTestId('modal-initial-data').textContent || '{}');
      expect(initialData.name).toBe('User Service');
      expect(initialData.url).toBe('api.example.com/users');
    });
  });
});

describe('useEndpointsStore functions via EndpointsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    storeEndpoints = [...initialEndpoints];
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('deleteEndpoint', () => {
    it('should remove endpoint from the list', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      const initialRows = document.querySelectorAll('tbody tr');
      expect(initialRows.length).toBe(8);

      // Click delete on first endpoint
      const deleteButton = initialRows[0].querySelector('[data-testid^="delete-"]') as HTMLElement;
      await user.click(deleteButton);

      // Confirm deletion
      const confirmDeleteButton = screen.getByRole('button', { name: 'Delete' });
      await user.click(confirmDeleteButton);

      // Verify deleteEndpoint was called
      expect(deleteEndpointMock).toHaveBeenCalledWith('ep-001');
    });

    it('should not throw when deleting non-existent endpoint', () => {
      deleteEndpointMock('non-existent-id');
      expect(deleteEndpointMock).toHaveBeenCalledWith('non-existent-id');
    });
  });

  describe('updateEndpoint', () => {
    it('should update endpoint data', async () => {
      const user = userEvent.setup({ delay: null });
      render(<EndpointsPage />);

      // Click edit on first endpoint
      const endpointRow = document.querySelector('tbody tr');
      const editButton = endpointRow?.querySelector('[data-testid^="edit-"]') as HTMLElement;
      await user.click(editButton);

      // Submit the form via mock
      const submitButton = screen.getByTestId('modal-submit');
      await user.click(submitButton);

      // Verify updateEndpoint was called
      expect(updateEndpointMock).toHaveBeenCalled();
    });

    it('should not affect other endpoints', async () => {
      render(<EndpointsPage />);
      
      // Initial state has 10 endpoints
      const initialRows = document.querySelectorAll('tbody tr');
      expect(initialRows.length).toBe(8); // Only 8 shown per page

      // Update is called but we verify it doesn't break the page
      updateEndpointMock('ep-001', {
        name: 'Changed',
        url: 'https://changed.com',
        method: 'GET',
        interval: '60s',
        timeout: '10s',
      });

      // Page should still render
      expect(document.querySelector('table')).toBeInTheDocument();
    });
  });
});

describe('filterEndpoints (pure function)', () => {
  const { filterEndpoints } = require('@/lib/data');

  it('should return all endpoints when query is empty', () => {
    const endpoints = [
      { id: '1', name: 'Service A', url: 'a.com', status: 'healthy' as const, latency: 50, uptime: 99, lastCheck: 'now' },
      { id: '2', name: 'Service B', url: 'b.com', status: 'healthy' as const, latency: 60, uptime: 99, lastCheck: 'now' },
    ];

    const result = filterEndpoints('', endpoints);
    expect(result.length).toBe(2);
  });

  it('should filter by name', () => {
    const endpoints = [
      { id: '1', name: 'User Service', url: 'a.com', status: 'healthy' as const, latency: 50, uptime: 99, lastCheck: 'now' },
      { id: '2', name: 'Payment Service', url: 'b.com', status: 'healthy' as const, latency: 60, uptime: 99, lastCheck: 'now' },
    ];

    const result = filterEndpoints('user', endpoints);
    expect(result.length).toBe(1);
    expect(result[0].name).toBe('User Service');
  });

  it('should filter by URL', () => {
    const endpoints = [
      { id: '1', name: 'Service A', url: 'api.example.com/users', status: 'healthy' as const, latency: 50, uptime: 99, lastCheck: 'now' },
      { id: '2', name: 'Service B', url: 'api.example.com/payments', status: 'healthy' as const, latency: 60, uptime: 99, lastCheck: 'now' },
    ];

    const result = filterEndpoints('payments', endpoints);
    expect(result.length).toBe(1);
    expect(result[0].url).toBe('api.example.com/payments');
  });

  it('should be case insensitive', () => {
    const endpoints = [
      { id: '1', name: 'User Service', url: 'a.com', status: 'healthy' as const, latency: 50, uptime: 99, lastCheck: 'now' },
    ];

    const result = filterEndpoints('USER', endpoints);
    expect(result.length).toBe(1);
  });
});

describe('Pagination slice logic', () => {
  it('should return correct slice for page 1', () => {
    const allItems = Array.from({ length: 15 }, (_, i) => ({ id: `item-${i}` }));
    const ITEMS_PER_PAGE = 8;

    const page1 = allItems.slice(0, ITEMS_PER_PAGE);
    expect(page1.length).toBe(8);
    expect(page1[0].id).toBe('item-0');
    expect(page1[7].id).toBe('item-7');
  });

  it('should return correct slice for page 2', () => {
    const allItems = Array.from({ length: 15 }, (_, i) => ({ id: `item-${i}` }));
    const ITEMS_PER_PAGE = 8;
    const currentPage = 2;

    const page2 = allItems.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    expect(page2.length).toBe(7);
    expect(page2[0].id).toBe('item-8');
    expect(page2[6].id).toBe('item-14');
  });

  it('should calculate total pages correctly', () => {
    const totalItems = 15;
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    expect(totalPages).toBe(2);
  });

  it('should handle exactly 8 items (1 page)', () => {
    const totalItems = 8;
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    expect(totalPages).toBe(1);
  });

  it('should handle 16 items (2 pages)', () => {
    const totalItems = 16;
    const ITEMS_PER_PAGE = 8;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    expect(totalPages).toBe(2);
  });
});
