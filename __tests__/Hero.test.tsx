import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/sections/Hero";

jest.mock("@/components/ui/AnimatedTextGenerate", () => ({
  AnimatedTextGenerate: ({ text }: { text: string }) => (
    <h1 data-testid="animated-title">{text}</h1>
  ),
}));

jest.mock("@/components/ui/UnicornBackground", () => ({
  UnicornBackground: () => <div data-testid="unicorn-bg" />,
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
    useScroll: () => ({ scrollY: { onChange: jest.fn() } }),
    useTransform: () => 0,
    AnimatePresence: ({ children }: any) => children,
  };
});

describe("Hero", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render hero section with badge, title, description and buttons", () => {
    // Arrange
    // Act
    render(<Hero />);

    // Assert
    expect(screen.getByText("Now in public beta")).toBeInTheDocument();
    expect(screen.getByTestId("animated-title")).toBeInTheDocument();
    expect(
      screen.getByText(/Real-time monitoring, anomaly detection/i)
    ).toBeInTheDocument();
  });

  it("should render both action buttons", () => {
    // Arrange
    // Act
    render(<Hero />);

    // Assert
    expect(screen.getByRole("button", { name: /get started free/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /view docs/i })).toBeInTheDocument();
  });

  it("should render social proof text", () => {
    // Arrange
    // Act
    render(<Hero />);

    // Assert
    expect(screen.getByText(/trusted by/i)).toBeInTheDocument();
  });
});
