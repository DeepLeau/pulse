import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { LogosBar } from '@/components/sections/LogosBar';

describe('LogosBar', () => {
  it('renders LogosBar section', () => {
    render(<LogosBar />);
    
    expect(screen.getByText('Trusted by')).toBeInTheDocument();
  });
});
