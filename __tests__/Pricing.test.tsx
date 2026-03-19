import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Pricing } from "@/components/ui/Pricing";

describe("Pricing", () => {
  it("should render", () => {
    const { getByText } = render(<Pricing />);
    expect(getByText("Pricing")).toBeDefined();
  });
});
