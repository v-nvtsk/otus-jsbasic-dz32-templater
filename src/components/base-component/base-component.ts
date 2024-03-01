import { template } from "../../utils/templater";

export class BaseComponent<State = {}> {
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
      this.setEventHandlers();
    }, 0);
  }

  setEventHandlers() {
    Object.entries(this.events).forEach(([key, callback]) => {
      const [action, selector] = key.split("@");
      this.el.addEventListener(action, (ev: Event) => {
        if ((ev.target as HTMLElement).matches(selector)) callback(ev);
      });
    });
  }

  protected setState(patch: any): void {
    if (patch !== undefined) {
      this.state = { ...this.state, ...patch };
    }
    this.el.innerHTML = template(this.render(), this.state);
  }

  protected onMount(el: HTMLElement) {
    // useless activity
    const { innerHTML } = el;
    this.el.innerHTML = innerHTML;
  }

  // eslint-disable-next-line class-methods-use-this
  protected render(): string {
    return this.el.innerHTML;
  }
}
