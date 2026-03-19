/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EndpointsPage from '@/app/dashboard/endpoints/page';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/dashboard/endpoints',
}));

describe('EndpointsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display search input', () => {
    // Arrange
    render(<EndpointsPage />);

    // Assert - search input exists
    expect(screen.getByPlaceholderText(/search endpoints/i)).toBeInTheDocument();
  });

  it('should filter endpoints when typing in search', async () => {
    const user = userEvent.setup();

    // Arrange
    render(<EndpointsPage />);

    // Verify initial state - multiple endpoints visible
    expect(screen.getByText('User Service')).toBeInTheDocument();
    expect(screen.getByText('Payment Gateway')).toBeInTheDocument();

    // Act - search for specific endpoint
    const searchInput = screen.getByPlaceholderText(/search endpoints/i);
    await user.type(searchInput, 'Payment');

    // Assert - only matching endpoint visible
    await waitFor(() => {
      expect(screen.getByText('Payment Gateway')).toBeInTheDocument();
    });

    // Non-matching should not be visible
    await waitFor(() => {
      expect(screen.queryByText('User Service')).not.toBeInTheDocument();
    });
  });

  it('should show empty state when no endpoints match search', async () => {
    const user = userEvent.setup();

    // Arrange
    render(<EndpointsPage />);

    // Act - search for non-existent endpoint
    const searchInput = screen.getByPlaceholderText(/search endpoints/i);
    await user.type(searchInput, 'xyznonexistent');

    // Assert - empty state message visible
    await waitFor(() => {
      expect(screen.getByText(/no endpoints found/i)).toBeInTheDocument();
    });
  });
});
