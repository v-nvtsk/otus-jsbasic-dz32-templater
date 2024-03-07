## Раразработать шаблонизатор

Разработать собственный шаблонизатор, который должен поддерживать:

- подстановку данных
- условный рендеринг
- работу со списками
- поддерживать дополнительные переменные в циклах (index, isFirst, isLast etc.)

Пример шаблона для шаблонизатора:

```html
<!-- Пример шаблона -->
<h2>{{title}}</h2>
{{if author}}
<h3>{{author}}</h3>
{{endif}}
<div class="tags">
  {{for tags as item}}
  <a class="tag" href="#tag{{item.id}}"> {{item.title}} </a>
  {{if notIsLastElement}}, {{endif}}
</div>
```

## Разработать базовый визуальный компонент

Разработать базовый компонент, использующий шаблонизатор внутри метода `render` с сигнатурой

```ts
export declare class Component<State = {}> {
  private el;
  state: State;
  events: {
    [key: string]: (ev: Event) => void;
  };
  constructor(el: HTMLElement, initialState?: Partial<State>);
  setState(patch: any): void;
  onMount(el: HTMLElement): void;
  render(): string;
}
```

Пример использования базового компонента

```ts
import { Component } from "./Component";

class Clicker extends Component {
  state = {
    value: 1,
    input: "123",
  };

  increaseCounter = () =>
    this.setState({
      value: this.state.value + 1,
    });

  decreaseCounter = () =>
    this.setState({
      value: this.state.value + 1,
    });

  setInputValue = (ev: Event) => {
    this.setState({
      input: (ev.target as HTMLInputElement).value,
    });
  };

  events = {
    "click@button.inc": this.increaseCounter,
    "click@button.dec": this.decreaseCounter,
    "change@input": this.setInputValue,
  };

  render() {
    return `
      <h1>Count ${this.state.value} (${this.state.input})</h1>
      <input value="${this.state.input}"  />
      <button class="dec">-</button>
      <button class="inc">+</button>
    `;
  }
}

new Clicker(document.getElementById("app") as HTMLElement);
new Clicker(document.getElementById("app2") as HTMLElement, {
  value: 5,
  input: "Hola",
});
```

Компонент должен поддерживать

- передачу частичных свойств в конструктор
- подписку на события, объявленные в свойстве `events`
- рендеринг шаблона, который возвращается из метода `render()` c подстановкой данных из `state`
- вызов хука `onMount` при первом рендеринге
- обновление представления при изменении `state` через `setState`

Применить разработанный компонент к презентационной части проекта "Прогноз погоды" (вывод всех данных должен быть сделан на базе одного/ нескольких таких компонент).

## Критерии оценки

Шаблонизатор подддерживает

- подстановку данных 2 балла
- условный рендеринг 2 балла
- работу со списками 2 балла
- поддерживать дополнительные переменные в циклах (index, isFirst, isLast etc.) 2 балла

Базовый компонент

- выводит состояние при создании
- поддерживает проброс состояния - 2 балла
- подписку на события - 2 балла
- использует шаблонизатор - 1 балл
- вызывает хук onMount - 1 балл
- обновляет представление при изменении состояния - 2 балла

Код в проекте переден на использование компонента/ов - 3 балла

Принято от 18 баллов.

### Отмечу

- это отдельное задание и отдельный PR в проекте с погодой
- условия по покрытию тестами остаются те же (60% минимум)
- шаблонизатор/компонент не покрытый тестами не принимается
