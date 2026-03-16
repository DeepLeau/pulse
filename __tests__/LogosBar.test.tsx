import { render, screen } from "@testing-library/react";
import { LogosBar } from "@/components/sections/LogosBar";

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

describe("LogosBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render logos bar with section title", () => {
    // Arrange
    // Act
    render(<LogosBar />);

    // Assert
    expect(screen.getByText(/trusted by sres at/i)).toBeInTheDocument();
  });

  it("should render all company logos", () => {
    // Arrange
    const companies = [
      "Vercel",
      "Linear",
      "Resend",
      "Railway",
      "Supabase",
      "Trigger.dev",
      "Turso",
      "Hugging Face",
    ];

    // Act
    render(<LogosBar />);

    // Assert
    companies.forEach((company) => {
      expect(screen.getAllByText(company)[0]).toBeInTheDocument();
    });
  });
});
