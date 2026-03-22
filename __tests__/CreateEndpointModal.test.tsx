import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';
import type { EndpointFormData } from '@/lib/data';

describe('CreateEndpointModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = (props: Partial<React.ComponentProps<typeof CreateEndpointModal>> = {}) => {
    return render(
      <CreateEndpointModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        editMode={false}
        {...props}
      />
    );
  };

  describe('form fields', () => {
    it('should render name input field', () => {
      renderModal();
      expect(screen.getByPlaceholderText('User Service')).toBeInTheDocument();
    });

    it('should render URL input field', () => {
      renderModal();
      expect(screen.getByPlaceholderText('https://api.example.com/users')).toBeInTheDocument();
    });

    it('should render method, interval, and timeout selects', () => {
      renderModal();
      expect(screen.getByRole('combobox', { name: /method/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /interval/i })).toBeInTheDocument();
      expect(screen.getByRole('combobox', { name: /timeout/i })).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('should show error when submitting empty name', async () => {
      const user = userEvent.setup();
      renderModal();

      const urlInput = screen.getByPlaceholderText('https://api.example.com/users');
      await user.type(urlInput, 'https://api.test.com');

      const submitButton = screen.getByRole('button', { name: /create endpoint/i });
      await user.click(submitButton);

      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when submitting empty URL', async () => {
      const user = userEvent.setup();
      renderModal();

      const nameInput = screen.getByPlaceholderText('User Service');
      await user.type(nameInput, 'My Service');

      const submitButton = screen.getByRole('button', { name: /create endpoint/i });
      await user.click(submitButton);

      expect(screen.getByText('URL is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('should show error when URL does not start with http', async () => {
      const user = userEvent.setup();
      renderModal();

      const nameInput = screen.getByPlaceholderText('User Service');
      await user.type(nameInput, 'My Service');

      const urlInput = screen.getByPlaceholderText('https://api.example.com/users');
      await user.clear(urlInput);
      await user.type(urlInput, 'api.test.com');

      const submitButton = screen.getByRole('button', { name: /create endpoint/i });
      await user.click(submitButton);

      expect(screen.getByText('URL must start with http:// or https://')).toBeInTheDocument();
    });

    it('should clear name error when user starts typing', async () => {
      const user = userEvent.setup();
      renderModal();

      const submitButton = screen.getByRole('button', { name: /create endpoint/i });
      await user.click(submitButton);
      expect(screen.getByText('Name is required')).toBeInTheDocument();

      const nameInput = screen.getByPlaceholderText('User Service');
      await user.type(nameInput, 'A');

      expect(screen.queryByText('Name is required')).not.toBeInTheDocument();
    });

    it('should clear URL error when user starts typing', async () => {
      const user = userEvent.setup();
      renderModal();

      const submitButton = screen.getByRole('button', { name: /create endpoint/i });
      await user.click(submitButton);
      expect(screen.getByText('URL is required')).toBeInTheDocument();

      const urlInput = screen.getByPlaceholderText('https://api.example.com/users');
      await user.type(urlInput, 'h');

      expect(screen.queryByText('URL is required')).not.toBeInTheDocument();
    });
  });

  describe('successful submission', () => {
    it('should call onSubmit with form data when form is valid', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.type(screen.getByPlaceholderText('User Service'), 'New Endpoint');
      await user.type(screen.getByPlaceholderText('https://api.example.com/users'), 'https://api.new.com/v1');

      await user.click(screen.getByRole('button', { name: /create endpoint/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'New Endpoint',
            url: 'https://api.new.com/v1',
            method: 'GET',
            interval: '60s',
            timeout: '10s',
          })
        );
      });
    });

    it('should call onClose after successful submission', async () => {
      const user = userEvent.setup();
      renderModal();

      await user.type(screen.getByPlaceholderText('User Service'), 'Valid Endpoint');
      await user.type(screen.getByPlaceholderText('https://api.example.com/users'), 'https://valid.com');

      await user.click(screen.getByRole('button', { name: /create endpoint/i }));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Cancel button', () => {
    it('should call onClose when Cancel is clicked', async () => {
      const user = userSetup();
      renderModal();

      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('edit mode', () => {
    it('should show "Edit Endpoint" title when editMode is true', () => {
      renderModal({ editMode: true, initialData: { name: 'Test', url: 'https://test.com' } });
      expect(screen.getByText('Edit Endpoint')).toBeInTheDocument();
    });

    it('should show "Save changes" button when in edit mode', () => {
      renderModal({ editMode: true, initialData: { name: 'Test', url: 'https://test.com' } });
      expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
    });

    it('should pre-fill form with initialData name', () => {
      renderModal({
        editMode: true,
        initialData: { name: 'My Service', url: 'api.my.com' },
      });

      const nameInput = screen.getByPlaceholderText('User Service') as HTMLInputElement;
      expect(nameInput.value).toBe('My Service');
    });

    it('should pre-fill URL with https:// prefix when editing', () => {
      renderModal({
        editMode: true,
        initialData: { name: 'My Service', url: 'api.my.com' },
      });

      const urlInput = screen.getByPlaceholderText('https://api.example.com/users') as HTMLInputElement;
      expect(urlInput.value).toBe('https://api.my.com');
    });

    it('should use initialData method if provided', () => {
      renderModal({
        editMode: true,
        initialData: { name: 'POST Endpoint', url: 'https://post.com', method: 'POST' },
      });

      const methodSelect = screen.getByRole('combobox', { name: /method/i }) as HTMLSelectElement;
      expect(methodSelect.value).toBe('POST');
    });
  });

  describe('loading state', () => {
    it('should disable buttons while submitting', async () => {
      const user = userEvent.setup();
      const deferredSubmit = new Promise<void>((resolve) => {
        mockOnSubmit.mockImplementation(() => new Promise(resolve));
      });
      mockOnSubmit.mockImplementation(() => deferredSubmit);

      renderModal();

      await user.type(screen.getByPlaceholderText('User Service'), 'Loading Test');
      await user.type(screen.getByPlaceholderText('https://api.example.com/users'), 'https://loading.com');

      await user.click(screen.getByRole('button', { name: /create endpoint/i }));

      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
      expect(screen.getByRole('button', { name: /creating\.\.\./i })).toBeDisabled();
    });
  });

  describe('not rendered when closed', () => {
    it('should return null when isOpen is false', () => {
      renderModal({ isOpen: false });
      expect(screen.queryByPlaceholderText('User Service')).not.toBeInTheDocument();
    });
  });
});
