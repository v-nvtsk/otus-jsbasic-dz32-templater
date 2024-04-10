/* eslint-disable class-methods-use-this */
/* eslint-disable max-classes-per-file */
import { BaseComponent } from "./base-component";

const sleep = async (x: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

describe("Component", () => {
  it("Component is a function", () => {
    expect(typeof BaseComponent).toBe("function");
  });

  it("Component is a class", () => {
    const wrapper = document.createElement("div");
    class Component extends BaseComponent {}
    const component = new Component(wrapper);
    expect(component instanceof Component).toBe(true);
  });

  it("should render empty string if no render method implementation", async () => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = "some innerHTML";
    class Component extends BaseComponent {}
    // eslint-disable-next-line no-new
    new Component(wrapper, { field2: 2 });
    await sleep(0);
    expect(wrapper.innerHTML).toEqual("");
  });
});
