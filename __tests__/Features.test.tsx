import { render, screen, waitFor } from "@testing-library/react";
import { Features } from "@/components/sections/Features";
import "@testing-library/jest-dom";

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
    useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => children,
  };
});

describe("Features", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render features section with header", () => {
    // Arrange
    // Act
    render(<Features />);

    // Assert
    expect(screen.getByText(/features/i)).toBeInTheDocument();
    expect(
      screen.getByText(/monitor at scale\. sleep at night\./i)
    ).toBeInTheDocument();
  });

  it("should render all feature titles", () => {
    // Arrange
    const featureTitles = [
      "Real-time alerts",
      "AI anomaly detection",
      "Distributed tracing",
      "Historical analysis",
    ];

    // Act
    render(<Features />);

    // Assert
    featureTitles.forEach((title) => {
      expect(screen.getAllByText(title)[0]).toBeInTheDocument();
    });
  });

  it("should render widgets with animated content", async () => {
    // Arrange
    // Act
    render(<Features />);

    // Assert - check that widgets render their labels
    expect(screen.getByText(/live traffic/i)).toBeInTheDocument();
    expect(screen.getByText(/anomaly score/i)).toBeInTheDocument();
    expect(screen.getByText(/integrations/i)).toBeInTheDocument();
    expect(screen.getByText(/active alerts/i)).toBeInTheDocument();
  });
});
