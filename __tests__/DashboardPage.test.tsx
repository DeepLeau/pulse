import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DashboardPage from "@/app/dashboard/page";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("DashboardPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should open create endpoint modal when clicking New endpoint button", async () => {
    const user = userEvent.setup();
    // Arrange
    render(<DashboardPage />);
    const newEndpointButton = screen.getByRole("button", { name: /\+ new endpoint/i });

    // Act
    await user.click(newEndpointButton);

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Create endpoint", { selector: "h2" })).toBeInTheDocument();
  });
});
