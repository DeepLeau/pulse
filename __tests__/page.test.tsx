import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the landing page', () => {
    render(<Home />);
    
    expect(screen.getByText('Monitor your APIs')).toBeInTheDocument();
  });

  it('renders navbar', () => {
    render(<Home />);
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders features section', () => {
    render(<Home />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders testimonials section', () => {
    render(<Home />);
    
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });

  it('renders pricing section', () => {
    render(<Home />);
    
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });

  it('renders CTA section', () => {
    render(<Home />);
    
    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
  });

  it('renders footer', () => {
    render(<Home />);
    
    expect(screen.getByText('Pulse')).toBeInTheDocument();
  });
});
