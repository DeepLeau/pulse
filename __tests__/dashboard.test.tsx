import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { useEndpointsStore } from "@/lib/stores/useEndpointsStore";

describe("Dashboard Page", () => {
  it("should render the dashboard page", () => {
    const { getByText } = render(<DashboardPage />);
    expect(getByText("Overview")).toBeDefined();
  });

  it("should display metrics", () => {
    const { getByText } = render(<DashboardPage />);
    expect(getByText("Total API calls")).toBeDefined();
  });
});
