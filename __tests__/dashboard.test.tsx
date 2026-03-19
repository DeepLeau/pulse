import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import DashboardPage from '@/app/dashboard/page';
import { useEndpointsStore } from '@/hooks/useEndpointsStore';

jest.mock('@/hooks/useEndpointsStore');

describe('DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders dashboard with metrics', async () => {
    const mockAddEndpoint = jest.fn().mockResolvedValue({});
    (useEndpointsStore as jest.Mock).mockReturnValue({
      endpoints: [],
      addEndpoint: mockAddEndpoint,
    });

    render(<DashboardPage />);

    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Total API calls')).toBeInTheDocument();
  });
});
