import { describe, expect, it } from "vitest";
import { createRibbonGeometry } from "./RibbonGeometry";

describe("ribbon geometry", () => {
  it("builds a dense indexed strip with UVs", () => {
    const geometry = createRibbonGeometry(20, 4);
    expect(geometry.getAttribute("position").count).toBe(105);
    expect(geometry.getAttribute("uv").count).toBe(105);
    expect(geometry.index?.count).toBe(480);
    geometry.dispose();
  });
});
