import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Testimonials } from '@/components/sections/Testimonials';

describe('Testimonials', () => {
  it('renders Testimonials section', () => {
    render(<Testimonials />);
    
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
  });
});
