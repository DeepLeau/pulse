import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Hero } from '@/components/sections/Hero';

describe('Hero', () => {
  it('renders Hero section with title', () => {
    render(<Hero />);
    
    expect(screen.getByText(/Monitor your APIs/i)).toBeInTheDocument();
  });
});
