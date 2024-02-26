import "./style.css";
import { Weather } from "./components/weather/weather";
import getCityByIP from "./api/ip";
import appendParentWithChild from "./utils/appendParentWithChild";

const app = appendParentWithChild(document.body, "div", "app");

// Запуск с начальным состоянием
getCityByIP().then((city) => new Weather(app, { currentCity: city }));
