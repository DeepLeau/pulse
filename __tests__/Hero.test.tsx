import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Hero } from "@/components/ui/Hero";

describe("Hero", () => {
  it("should render", () => {
    const { getByText } = render(<Hero />);
    expect(getByText("Pulse")).toBeDefined();
  });
});
