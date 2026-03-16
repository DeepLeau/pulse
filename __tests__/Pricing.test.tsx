import { render, screen } from "@testing-library/react";
import { Pricing } from "@/components/sections/Pricing";

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

describe("Pricing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render pricing section with header", () => {
    // Arrange
    // Act
    render(<Pricing />);

    // Assert
    expect(screen.getByRole("heading", { name: /simple pricing/i })).toBeInTheDocument();
    expect(
      screen.getByText(/start free\. upgrade when you're ready\./i)
    ).toBeInTheDocument();
  });

  it("should render both pricing plans with CTA buttons", () => {
    // Arrange
    // Act
    render(<Pricing />);

    // Assert
    expect(screen.getByRole("heading", { name: /starter/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start free/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /pro/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /start trial/i })).toBeInTheDocument();
  });

  it("should show most popular badge on Pro plan", () => {
    // Arrange
    // Act
    render(<Pricing />);

    // Assert
    expect(screen.getByText(/most popular/i)).toBeInTheDocument();
  });
});
