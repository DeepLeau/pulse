import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Features } from "@/components/ui/Features";

describe("Features", () => {
  it("should render", () => {
    const { getByText } = render(<Features />);
    expect(getByText("Features")).toBeDefined();
  });
});
