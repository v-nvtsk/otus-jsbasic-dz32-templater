import { BaseComponent } from "./base-component";

describe("Component", () => {
  it("Component is a function", () => {
    expect(typeof BaseComponent).toBe("function");
  });

  it("Component is a class", () => {
    const el = document.createElement("div");
    const component = new BaseComponent(el);
    expect(component instanceof BaseComponent).toBe(true);
  });

  it("should render empty string", () => {
    const el = document.createElement("div");
    // eslint-disable-next-line no-new
    new BaseComponent(el);
    expect(el.innerHTML).toBe("");
  });
});
