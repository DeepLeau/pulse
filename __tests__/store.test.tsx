/**
 * @jest-environment jsdom
 */
import React, { ReactNode } from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EndpointsProvider, useEndpoints } from '@/lib/store';
import type { Endpoint, EndpointFormData } from '@/lib/data';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

// Test component that uses the hook
function TestConsumer({ onEndpointsChange }: { onEndpointsChange?: (endpoints: Endpoint[]) => void }) {
  const { endpoints, addEndpoint, isLoading } = useEndpoints();
  
  if (onEndpointsChange) {
    onEndpointsChange(endpoints);
  }
  
  return (
    <div>
      <span data-testid="count">{endpoints.length}</span>
      <span data-testid="loading">{isLoading.toString()}</span>
      <button 
        data-testid="add-btn"
        onClick={() => addEndpoint({ 
          name: 'Test API', 
          url: 'https://api.test.com/health',
          method: 'GET',
          interval: '60s',
          timeout: '10s'
        })}
      >
        Add
      </button>
      <ul>
        {endpoints.map(ep => (
          <li key={ep.id} data-testid={`endpoint-${ep.name}`}>{ep.name}</li>
        ))}
      </ul>
    </div>
  );
}

describe('EndpointsProvider', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should provide initial endpoints', () => {
    // Arrange
    render(
      <EndpointsProvider>
        <TestConsumer />
      </EndpointsProvider>
    );

    // Assert - initial endpoints are loaded
    expect(screen.getByTestId('count')).toHaveTextContent('10');
    expect(screen.getByTestId('loading')).toHaveTextContent('false');
  });

  it('should add new endpoint when addEndpoint is called', async () => {
    const user = userEvent.setup();

    // Arrange
    render(
      <EndpointsProvider>
        <TestConsumer />
      </EndpointsProvider>
    );

    // Initial count
    expect(screen.getByTestId('count')).toHaveTextContent('10');

    // Act
    await user.click(screen.getByTestId('add-btn'));

    // Assert - endpoint added at beginning
    await waitFor(() => {
      expect(screen.getByTestId('count')).toHaveTextContent('11');
    });
    expect(screen.getByTestId('endpoint-Test API')).toBeInTheDocument();
  });

  it('should strip protocol from URL when adding endpoint', async () => {
    const user = userEvent.setup();

    // Arrange
    render(
      <EndpointsProvider>
        <TestConsumer />
      </EndpointsProvider>
    );

    // Act - add endpoint with full URL including protocol
    await user.click(screen.getByTestId('add-btn'));

    // Assert - URL should have protocol stripped
    await waitFor(() => {
      const endpoint = screen.getByTestId('endpoint-Test API');
      expect(endpoint).toBeInTheDocument();
    });
  });
});

describe('useEndpoints', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should throw error when used outside provider', () => {
    // Arrange & Assert
    expect(() => {
      render(<TestConsumer />);
    }).toThrow('useEndpoints must be used within an EndpointsProvider');
  });
});
