import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

jest.mock("@/components/ui/UnicornBackground", () => ({
  UnicornBackground: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="unicorn-background">{children}</div>
  ),
}));

jest.mock("@/components/ui/AnimatedTextGenerate", () => ({
  AnimatedTextGenerate: ({ text }: { text: string }) => (
    <div data-testid="animated-text">{text}</div>
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

describe("Hero", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hero section with main heading", () => {
    // Arrange
    // Act
    render(<Hero />);

    // Assert
    expect(
      screen.getByText(/know instantly when your apis fail/i)
    ).toBeInTheDocument();
  });

  it("should render call to action links", () => {
    // Arrange
    // Act
    render(<Hero />);

    // Assert
    expect(
      screen.getByRole("link", { name: /get started for free/i })
    ).toBeInTheDocument();
  });
});
