import { describe, expect, it } from "vitest";
import { filterEndpoints } from "@/lib/stores/useEndpointsStore";
import type { Endpoint } from "@/lib/data";

describe("filterEndpoints", () => {
  const endpoints: Endpoint[] = [
    { id: "1", name: "Test API", url: "api.test.com", status: "healthy", latency: 100, uptime: 99.9, lastCheck: "now" },
  ];

  it("should return all endpoints when query is empty", () => {
    expect(filterEndpoints("", endpoints)).toHaveLength(1);
  });

  it("should filter by name", () => {
    expect(filterEndpoints("Test", endpoints)).toHaveLength(1);
    expect(filterEndpoints("NotFound", endpoints)).toHaveLength(0);
  });
});
