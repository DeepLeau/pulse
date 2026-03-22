import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointRowMenu } from '@/components/ui/EndpointRowMenu';
import type { Endpoint } from '@/lib/data';

const mockEndpoint: Endpoint = {
  id: 'ep-test',
  name: 'Test Service',
  url: 'api.test.com',
  status: 'healthy',
  latency: 50,
  uptime: 99.99,
  lastCheck: 'Just now',
};

describe('EndpointRowMenu', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('menu toggle', () => {
    it('should open menu when clicking the menu button', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    });

    it('should close menu when clicking the button again', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();

      await user.click(menuButton);
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });
  });

  describe('click outside to close', () => {
    it('should close menu when clicking outside', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });
  });

  describe('Edit action', () => {
    it('should call onEdit with endpoint when Edit is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      const editButton = screen.getByRole('button', { name: /edit/i });
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should close menu after clicking Edit', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);
      await user.click(screen.getByRole('button', { name: /edit/i }));

      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    });
  });

  describe('Delete action', () => {
    it('should call onDelete with endpoint when Delete is clicked', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);

      const deleteButton = screen.getByRole('button', { name: /delete/i });
      await user.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledWith(mockEndpoint);
    });

    it('should close menu after clicking Delete', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      await user.click(menuButton);
      await user.click(screen.getByRole('button', { name: /delete/i }));

      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have aria-expanded attribute that reflects open state', async () => {
      const user = userEvent.setup();
      render(
        <EndpointRowMenu
          endpoint={mockEndpoint}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
        />
      );

      const menuButton = screen.getByRole('button', { name: /open menu/i });
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(menuButton);
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
    });
  });
});
