import "./style.css";
import { Weather } from "./components/weather/weather";
// import getCityByIP from "./api/ip";
import appendParentWithChild from "./utils/appendParentWithChild";

// Запуск с начальным состоянием
const app = appendParentWithChild(document.body, "div", "app");
new Weather(app, { currentCity: "tula" }).init();

// // Запуск с пустым начальным состоянием
// const app2 = appendParentWithChild(document.body, "div", "app");
// new Weather(app2, {}).init();
