import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Testimonials } from "@/components/ui/Testimonials";

describe("Testimonials", () => {
  it("should render", () => {
    const { getByText } = render(<Testimonials />);
    expect(getByText("What our customers say")).toBeDefined();
  });
});
