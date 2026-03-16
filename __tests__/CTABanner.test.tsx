import { render, screen } from "@testing-library/react";
import { CTABanner } from "@/components/sections/CTABanner";

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

describe("CTABanner", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render CTA banner with headline and button", () => {
    // Arrange
    // Act
    render(<CTABanner />);

    // Assert
    expect(
      screen.getByRole("heading", { name: /start monitoring today/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get started for free/i })
    ).toBeInTheDocument();
  });

  it("should render CTA description", () => {
    // Arrange
    // Act
    render(<CTABanner />);

    // Assert
    expect(
      screen.getByText(/join 1,200\+ sres who sleep better/i)
    ).toBeInTheDocument();
  });
});
