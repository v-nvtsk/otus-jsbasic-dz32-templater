import { Weather } from "./weather";

const sleep = async (x: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

describe("weather", () => {
  let el: HTMLElement;
  let weatherComponent: Weather;
  let cityInput: HTMLInputElement;
  let submitBtn: HTMLButtonElement;
  let savedCitiesList: HTMLElement;

  const testData = {
    coord: { lon: 37.6156, lat: 55.7522 },
    weather: [{ id: 804, main: "Clouds", description: "пасмурно", icon: "04d" }],
    base: "stations",
    main: {
      temp: -3.43,
      feels_like: -6.88,
      temp_min: -3.9,
      temp_max: -2.87,
      pressure: 1010,
      humidity: 96,
      sea_level: 1010,
      grnd_level: 991,
    },
    visibility: 10000,
    wind: { speed: 2.33, deg: 221, gust: 5.6 },
    clouds: { all: 91 },
    dt: 1701516989,
    sys: { type: 1, id: 9027, country: "RU", sunrise: 1701495350, sunset: 1701522123 },
    timezone: 10800,
    id: 524901,
    name: "Moscow",
    cod: 200,
  };

  afterEach(() => {
    jest.clearAllMocks();
    el.remove();
  });

  beforeEach(async () => {
    global.fetch = jest.fn().mockImplementation((url: string) => {
      if (url.includes("openweather")) {
        const params = new URLSearchParams(url.split("?")[1]);
        const name = params.get("q");
        if (name !== "testFaultCity") {
          return Promise.resolve({
            json: () => Promise.resolve({ ...testData, name }),
          });
        }
        return Promise.resolve({
          json: () => Promise.resolve({ cod: 400 }),
        });
      }
      if (url.includes("get.geojs.io")) {
        return Promise.resolve({
          json: () => Promise.resolve({ city: "TestCityByIp" }),
        });
      }
      return Promise.resolve({});
    });

    el = document.createElement("div");
    weatherComponent = new Weather(el, { currentCity: "TestCity" });

    await weatherComponent.init();

    await sleep();
    cityInput = el.querySelector("input#inputCity") as HTMLInputElement;
    submitBtn = el.querySelector("button#submitBtn") as HTMLButtonElement;
    savedCitiesList = el.querySelector("#savedCitiesList") as HTMLElement;
  });

  it("should be a function", () => {
    expect(typeof Weather).toBe("function");
  });

  it("should create initial markup", () => {
    expect(el.innerHTML).not.toBe("");
    expect(cityInput).not.toBeNull();
    expect(submitBtn).not.toBeNull();
    expect(savedCitiesList).not.toBeNull();

    expect(el.querySelector("#currentCity")).not.toBeNull();
  });

  it("should not submit if no city in input", () => {
    const len = el.querySelectorAll(".savedCity").length;
    const inner = el.innerHTML;
    cityInput.value = "";
    submitBtn.click();
    expect(el.querySelectorAll(".savedCity").length).toBe(len);
    expect(el.innerHTML).toEqual(inner);
  });

  it("should not render if city not exist", () => {
    const len = el.querySelectorAll(".savedCity").length;
    const inner = el.innerHTML;
    cityInput.value = "testFaultCity";
    submitBtn.click();
    expect(el.querySelectorAll(".savedCity").length).toBe(len);
    expect(el.innerHTML).toEqual(inner);
  });

  it("should add city to list", async () => {
    const testList = ["MOSCOW", "TULA", "TESTCITY"];
    const [city1, city2] = testList;
    cityInput.value = city2;
    submitBtn.click();
    await sleep();
    expect(el.querySelectorAll(".savedCity").length).toBe(2);

    cityInput = el.querySelector("input#inputCity") as HTMLInputElement;
    submitBtn = el.querySelector("button#submitBtn") as HTMLButtonElement;
    cityInput.value = city1;
    submitBtn.click();
    await sleep();
    expect(el.querySelectorAll(".savedCity").length).toBe(3);

    (el.querySelectorAll(".savedCity")[1] as HTMLElement).click();
    await sleep();

    const citiesList = el.querySelectorAll(".savedCity");

    const testListAfterClick = ["TULA", "MOSCOW", "TESTCITY"];
    citiesList.forEach((elem, i) => {
      expect(elem.innerHTML).toBe(testListAfterClick[i]);
    });
  });

  it("should get city by ip if no city in input", async () => {
    el.innerHTML = "";
    weatherComponent = new Weather(el, {});
    weatherComponent.init();
    await sleep();
    expect(el.querySelector("#currentCity")!.innerHTML).toBe("TestCityByIp");
  });
});
