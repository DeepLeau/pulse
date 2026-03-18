import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CreateEndpointModal } from "@/components/ui/CreateEndpointModal";

jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div {...props}>{children}</div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("CreateEndpointModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should close modal when Escape key is pressed", async () => {
    const user = userEvent.setup();
    // Arrange
    render(<CreateEndpointModal {...defaultProps} />);

    // Act
    await user.keyboard("{Escape}");

    // Assert
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("should show validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    // Arrange
    render(<CreateEndpointModal {...defaultProps} />);
    const submitButton = screen.getByRole("button", { name: /create endpoint/i });

    // Act
    await user.click(submitButton);

    // Assert
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/url is required/i)).toBeInTheDocument();
    expect(defaultProps.onSubmit).not.toHaveBeenCalled();
  });

  it("should call onSubmit with form data when submission succeeds", async () => {
    const user = userEvent.setup();
    // Arrange
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<CreateEndpointModal {...defaultProps} onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText(/name/i), "Production API");
    await user.type(screen.getByLabelText(/url/i), "https://api.example.com/health");
    await user.click(screen.getByRole("button", { name: /create endpoint/i }));

    // Assert
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Production API",
          url: "https://api.example.com/health",
          method: "GET",
          interval: "60s",
          timeout: "10s",
        })
      );
    });
  });
});
