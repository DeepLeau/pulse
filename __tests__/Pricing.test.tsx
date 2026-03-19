import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Pricing } from '@/components/sections/Pricing';

describe('Pricing', () => {
  it('renders Pricing section', () => {
    render(<Pricing />);
    
    expect(screen.getByText('Pricing')).toBeInTheDocument();
  });
});
