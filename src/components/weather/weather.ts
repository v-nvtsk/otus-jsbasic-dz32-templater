import { template } from "../../utils/templater";
import getWeatherInCity from "../../api/get-weather";
import citiesCache from "../../store/cities-cache";
import getCityByIP from "../../api/ip";
import { BaseComponent } from "../base-component/base-component";

export type State = {
  currentCity: string;
  currentTemp: string;
  currentIcon: string;
  coord: {
    lat: number;
    lon: number;
  };
};

export class Weather extends BaseComponent<State> {
  constructor(el: HTMLElement, initialState?: Partial<State>) {
    super(el, initialState);
    citiesCache.init();
    citiesCache.subscribe(() => {
      this.setState({ cities: citiesCache.cities });
    });
  }

  public init() {
    const initialCity =
      this.state.currentCity !== undefined
        ? new Promise((resolve) => {
            resolve(this.state.currentCity);
          })
        : getCityByIP();

    initialCity
      .then((city) => this.updateWeather(city))
      .then(() => {
        this.onMount(this.el);
        this.setEventHandlers();
      });
  }

  private onSubmit = (ev: Event) => {
    ev.preventDefault();
    const inputCityEl = this.el.querySelector("#inputCity") as HTMLInputElement;
    const city = inputCityEl.value.trim();
    if (city !== "") {
      this.updateWeather(city);
      inputCityEl.value = "";
    }
  };

  private onCitySelect = (ev: Event) => {
    ev.preventDefault();
    const target = ev.target as HTMLElement;
    const city = target.innerHTML;
    this.updateWeather(city);
  };

  private updateWeather = async (city: string) => {
    const weather = await getWeatherInCity(city);
    if (weather !== null) {
      this.setState({
        currentCity: weather.city,
        currentTemp: weather.temp,
        currentIcon: weather.icon,
        coord: { lat: weather.coord[0], lon: weather.coord[1] },
      });
      citiesCache.addCity(weather.city);
      this.el.innerHTML = this.render();
    }
  };

  events = {
    "submit@form#inputGroup": this.onSubmit,
    "click@li.savedCity": this.onCitySelect,
  };

  render() {
    const templateStr = `
    <h1 id="header">Прогноз погоды</h1>
    <div id="currentWeather">
      <div id="currentCity">{{if currentCity}}{{currentCity}}{{endif}}</div>
      <div id="currentTemp">{{if currentTemp}}{{currentTemp}}{{endif}}</div>
      <div id="currentIcon">
      {{if currentIcon}}<img src="https://openweathermap.org/img/wn/{{currentIcon}}@2x.png">{{endif}}
      </div>
    </div>
    <form id="inputGroup"><input id="inputCity" placeholder="Enter city">
    <button type="submit" id="submitBtn">Получить погоду</button>
    </form>
    <ul id="savedCitiesList">
      {{for cities as city}}
        <li class="savedCity">{{city}}</li>
      {{endfor}}
    </ul>
    <div id="map">{{if coord}}
    <img class="ymap" src="https://static-maps.yandex.ru/v1?ll={{coord.lat}},{{coord.lon}}&lang=ru_RU&z=12&pt={{coord.lat}},{{coord.lon}},comma&apikey=b7d16e2b-938b-4809-b74b-5ae97b162f00">
    {{endif}}</div>`;

    const { currentCity, currentTemp, currentIcon, coord } = this.state;
    const cities = [...citiesCache.cities];
    return template(templateStr, { currentCity, currentTemp, currentIcon, cities, coord });
  }
}
