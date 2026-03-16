import { render, screen } from "@testing-library/react";
import Home from "@/app/page";

jest.mock("@/components/layout/Navbar", () => ({
  Navbar: () => <header data-testid="navbar">Navbar</header>,
}));

jest.mock("@/components/layout/Footer", () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

jest.mock("@/components/sections/Hero", () => ({
  Hero: () => <section data-testid="hero">Hero</section>,
}));

jest.mock("@/components/sections/LogosBar", () => ({
  LogosBar: () => <section data-testid="logos-bar">LogosBar</section>,
}));

jest.mock("@/components/sections/Features", () => ({
  Features: () => <section data-testid="features">Features</section>,
}));

jest.mock("@/components/sections/Testimonials", () => ({
  Testimonials: () => <section data-testid="testimonials">Testimonials</section>,
}));

jest.mock("@/components/sections/Pricing", () => ({
  Pricing: () => <section data-testid="pricing">Pricing</section>,
}));

jest.mock("@/components/sections/CTABanner", () => ({
  CTABanner: () => <section data-testid="cta-banner">CTABanner</section>,
}));

describe("Home Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render all main sections", () => {
    // Arrange
    // Act
    render(<Home />);

    // Assert
    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("hero")).toBeInTheDocument();
    expect(screen.getByTestId("logos-bar")).toBeInTheDocument();
    expect(screen.getByTestId("features")).toBeInTheDocument();
    expect(screen.getByTestId("testimonials")).toBeInTheDocument();
    expect(screen.getByTestId("pricing")).toBeInTheDocument();
    expect(screen.getByTestId("cta-banner")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();
  });
});
