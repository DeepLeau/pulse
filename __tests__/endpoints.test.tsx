import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { EndpointsPage } from '@/app/dashboard/endpoints/page';

describe('EndpointsPage', () => {
  it('renders endpoints page', () => {
    render(<EndpointsPage />);
    
    expect(screen.getByText('Endpoints')).toBeInTheDocument();
  });

  it('renders add endpoint button', () => {
    render(<EndpointsPage />);
    
    expect(screen.getByText('Add endpoint')).toBeInTheDocument();
  });

  it('renders status badges', () => {
    render(<EndpointsPage />);
    
    expect(screen.getByText('healthy')).toBeInTheDocument();
    expect(screen.getByText('degraded')).toBeInTheDocument();
    expect(screen.getByText('down')).toBeInTheDocument();
  });

  it('renders search input', () => {
    render(<EndpointsPage />);
    
    expect(screen.getByPlaceholderText('Search endpoints by name or URL...')).toBeInTheDocument();
  });
});
