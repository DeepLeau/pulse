import { render, screen } from "@testing-library/react";
import { Testimonials } from "@/components/sections/Testimonials";

jest.mock("@/components/ui/AnimatedCanopy", () => ({
  AnimatedCanopy: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="animated-canopy">{children}</div>
  ),
}));

jest.mock("framer-motion", () => {
  const React = require("react");
  const strip = ({
    animate,
    initial,
    exit,
    transition,
    whileInView,
    whileHover,
    whileTap,
    variants,
    viewport,
    ...p
  }: any) => p;
  return {
    motion: new Proxy(
      {},
      {
        get: (_t: any, tag: string) => ({
          children,
          ...props,
        }: any) => React.createElement(tag, strip(props), children),
      },
    ),
  };
});

describe("Testimonials", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render testimonials section with header", () => {
    // Arrange
    // Act
    render(<Testimonials />);

    // Assert
    expect(screen.getByText(/testimonials/i)).toBeInTheDocument();
    expect(screen.getByText(/loved by sres/i)).toBeInTheDocument();
  });

  it("should render testimonial cards", () => {
    // Arrange
    const testimonialNames = [
      "Sarah Chen",
      "Marcus Johnson",
      "Alex Rivera",
      "Emma Watson",
      "David Kim",
      "Jordan Lee",
    ];

    // Act
    render(<Testimonials />);

    // Assert - use getAllByText since AnimatedCanopy duplicates cards
    testimonialNames.forEach((name) => {
      expect(screen.getAllByText(name)[0]).toBeInTheDocument();
    });
  });
});
