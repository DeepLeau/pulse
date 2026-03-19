import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { LogosBar } from "@/components/ui/LogosBar";

describe("LogosBar", () => {
  it("should render", () => {
    const { getByText } = render(<LogosBar />);
    expect(getByText("Trusted by")).toBeDefined();
  });
});
