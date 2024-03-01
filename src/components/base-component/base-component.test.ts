/* eslint-disable max-classes-per-file */
import { BaseComponent } from "./base-component";

describe("Component", () => {
  it("Component is a function", () => {
    expect(typeof BaseComponent).toBe("function");
  });

  it("Component is a class", () => {
    const el = document.createElement("div");
    class Weather extends BaseComponent {}
    const component = new Weather(el);
    expect(component instanceof Weather).toBe(true);
  });

  it("should render empty string if no render method implementation", () => {
    const el = document.createElement("div");
    el.innerHTML = "some innerHTML";
    class Weather extends BaseComponent {
      state = { field: 1 };
    }
    // eslint-disable-next-line no-new
    new Weather(el);
    expect(el.innerHTML).toEqual("some innerHTML");
  });
});
