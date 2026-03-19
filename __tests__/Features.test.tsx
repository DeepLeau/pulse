import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Features } from '@/components/sections/Features';

describe('Features', () => {
  it('renders Features section', () => {
    render(<Features />);
    
    expect(screen.getByText('Features')).toBeInTheDocument();
  });
});
