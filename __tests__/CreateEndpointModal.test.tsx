import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CreateEndpointModal } from "@/components/ui/CreateEndpointModal";
import type { EndpointFormData } from "@/lib/data";

describe("CreateEndpointModal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
  };

  it("should render when open", () => {
    render(<CreateEndpointModal {...defaultProps} />);
    expect(screen.getByText("Add Endpoint")).toBeDefined();
  });

  it("should not render when closed", () => {
    render(<CreateEndpointModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText("Add Endpoint")).toBeNull();
  });
});
