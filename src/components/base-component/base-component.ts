import { template } from "../../utils/templater";

export abstract class BaseComponent<State = {}> {
  protected state: Partial<State> = {};

  protected events: {
    [key: string]: (ev: Event) => void;
  } = {};

  constructor(
    protected el: HTMLElement,
    initialState?: Partial<State>,
  ) {
    this.el = el;
    setTimeout(() => {
      this.setState(initialState);
      this.onMount();
    }, 0);
  }

  setEventHandlers() {
    Object.entries(this.events).forEach(([key, callback]) => {
      const [action, selector] = key.split("@");
      this.el.querySelectorAll(selector).forEach((el) => {
        el.addEventListener(action, callback);
      });
    });
  }

  protected setState(patch: any): void {
    if (patch !== undefined) {
      const oldState = { ...this.state };
      this.state = { ...this.state, ...patch };
      const newState = { ...this.state };
      if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
        this.el.innerHTML = template(this.render(), this.state);
        this.onMount();
      }
    }
  }

  protected onMount(): void {
    this.setEventHandlers();
  }

  // eslint-disable-next-line class-methods-use-this
  protected render(): string {
    return "";
  }
}
