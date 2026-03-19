import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';
import type { EndpointFormData } from '@/components/ui/CreateEndpointModal';

// Mock framer-motion to avoid IntersectionObserver errors
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe('CreateEndpointModal', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show validation error when submitting empty form', async () => {
    const user = userEvent.setup();

    // Arrange
    render(
      <CreateEndpointModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Act - click submit without filling fields
    const submitButton = screen.getByRole('button', { name: /create endpoint/i });
    await userEvent.click(submitButton);

    // Assert - errors should be visible
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/url is required/i)).toBeInTheDocument();
    });

    // Assert - submit was not called
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();

    // Arrange
    render(
      <CreateEndpointModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Act - fill form
    const nameInput = screen.getByLabelText(/name/i);
    const urlInput = screen.getByLabelText(/url/i);
    const submitButton = screen.getByRole('button', { name: /create endpoint/i });

    await user.type(nameInput, 'My API');
    await user.type(urlInput, 'https://api.example.com/health');
    await user.click(submitButton);

    // Assert - onSubmit called with correct data
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My API',
          url: 'https://api.example.com/health',
          method: 'GET',
          interval: '60s',
          timeout: '10s',
        })
      );
    });
  });

  it('should close modal when clicking backdrop', async () => {
    // Arrange
    render(
      <CreateEndpointModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Act - click on backdrop (first child of the fixed container)
    const backdrop = screen.getByRole('dialog').parentElement;
    if (backdrop) {
      fireEvent.click(backdrop);
    }

    // Assert
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('should close modal when pressing Escape', async () => {
    // Arrange
    render(
      <CreateEndpointModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Act
    fireEvent.keyDown(document, { key: 'Escape' });

    // Assert
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
