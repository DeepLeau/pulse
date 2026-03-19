import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { DashboardPage } from '@/app/dashboard/page';

describe('DashboardPage', () => {
  it('renders dashboard overview', () => {
    render(<DashboardPage />);
    
    expect(screen.getByText('Overview')).toBeInTheDocument();
  });
});
