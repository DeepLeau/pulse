import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { CTABanner } from '@/components/sections/CTABanner';

describe('CTABanner', () => {
  it('renders CTA banner with title and description', () => {
    render(<CTABanner />);
    
    expect(screen.getByText('Ready to get started?')).toBeInTheDocument();
    expect(screen.getByText(/Start your free trial/i)).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<CTABanner />);
    const section = container.querySelector('section');
    expect(section).toHaveClass('bg-zinc-900');
  });
});
