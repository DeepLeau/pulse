import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';

describe('CreateEndpointModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal when open', () => {
    render(
      <CreateEndpointModal isOpen={true} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    expect(screen.getByText('Create new endpoint')).toBeInTheDocument();
    expect(screen.getByText('Endpoint name')).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(
      <CreateEndpointModal isOpen={false} onClose={mockOnClose} onSubmit={mockOnSubmit} />
    );

    expect(screen.queryByText('Create new endpoint')).not.toBeInTheDocument();
  });
});
