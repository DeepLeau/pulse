/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from '@/app/dashboard/page';
import { useEndpointsStore } from '@/lib/data';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';
import * as dataModule from '@/lib/data';

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
  usePathname: () => '/dashboard',
}));

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the store instance to ensure clean state
    (dataModule as any).storeInstance = null;
  });

  it('should open modal when clicking "Add endpoint" button', async () => {
    const user = userEvent.setup();

    // Arrange
    render(<DashboardPage />);

    // Act
    const addButton = screen.getByRole('button', { name: /add endpoint/i });
    await user.click(addButton);

    // Assert - modal should be visible
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/create endpoint/i)).toBeInTheDocument();
    });
  });

  it('should add endpoint to store when form is submitted', async () => {
    const user = userEvent.setup();

    // Arrange
    render(<DashboardPage />);

    // Act - open modal
    const addButton = screen.getByRole('button', { name: /add endpoint/i });
    await user.click(addButton);

    // Fill form
    const nameInput = screen.getByLabelText(/name/i);
    const urlInput = screen.getByLabelText(/url/i);
    const submitButton = screen.getByRole('button', { name: /create endpoint/i });

    await user.type(nameInput, 'New API');
    await user.type(urlInput, 'https://newapi.com/health');
    await user.click(submitButton);

    // Assert - wait for success state
    await waitFor(() => {
      expect(screen.getByText(/endpoint created successfully/i)).toBeInTheDocument();
    });
  });
});
