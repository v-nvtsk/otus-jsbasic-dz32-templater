import appendParentWithChild from "./appendParentWithChild";

describe("appendParentWithChild", () => {
  it("should append parent with child with id", () => {
    const parentEl = document.createElement("div");
    const el = appendParentWithChild(parentEl, "div", "testId");
    expect(el.id).toBe("testId");
  });
  it("should append parent with child without id", () => {
    const parentEl = document.createElement("div");
    const el = appendParentWithChild(parentEl, "div");
    expect(el.id).toBe("");
  });
});
