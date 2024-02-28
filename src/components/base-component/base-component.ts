export class BaseComponent<State = {}> {
  protected state: Partial<State> = {} as State;

  protected events: {
    [key: string]: (ev: Event) => void;
  } = {};

  constructor(
    protected el: HTMLElement,
    initialState?: Partial<State>,
  ) {
    this.setState(initialState);
    this.el = el;
    this.onMount(el);
  }

  eventListener() {
    Object.entries(this.events).forEach(([key, callback]) => {
      const [action, selector] = key.split("@");
      this.el.addEventListener(action, (ev: Event) => {
        if (ev.target !== null && ev.target instanceof HTMLElement) {
          let currentSelector = ev.target!.tagName;
          const currentId = ev.target!.id === "" ? "" : `#${ev.target!.id}`;
          currentSelector += currentId;
          if ("classList" in ev.target) {
            const currentClass =
              ev.target.classList.length === 0
                ? ""
                : `${Array.from(ev.target.classList).reduce((acc, el) => `${acc}.${el}`, "")}`;
            currentSelector += currentClass;
          }
          if (currentSelector === selector) {
            callback(ev);
          }
        }
      });
    });
  }

  protected setState(patch: any): void {
    this.state = { ...this.state, ...patch };
    this.render();
  }

  protected onMount(el: HTMLElement) {
    // useless activity
    const { innerHTML } = el;
    this.el.innerHTML = innerHTML;
  }

  protected render(): string {
    this.el.innerHTML = "";
    return "";
  }
}
