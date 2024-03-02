import { Weather } from "./weather";

jest.mock("../../api/ip", () => jest.fn().mockImplementation(() => Promise.resolve("TestCityByIp")));

const sleep = async (x: number = 0) =>
  new Promise((resolve) => {
    setTimeout(resolve, x);
  });

describe("weather", () => {
  const el: HTMLElement = document.createElement("div");
  let weatherComponent: Weather;
  let form: HTMLFormElement;
  let cityInput: HTMLInputElement;
  let submitBtn: HTMLButtonElement;
  let savedCitiesList: HTMLElement;

  function queryElements() {
    form = el.querySelector("form") as HTMLFormElement;
    cityInput = el.querySelector("input#inputCity") as HTMLInputElement;
    submitBtn = el.querySelector("button#submitBtn") as HTMLButtonElement;
    savedCitiesList = el.querySelector("#savedCitiesList") as HTMLElement;
  }

  const initWeatherComponent = async (testCity = "TestCity") => {
    weatherComponent = new Weather(el, { currentCity: testCity });
    await sleep(0);
    weatherComponent.init();
    await sleep(0);
    queryElements();
  };

  const getCityFromURL = (url: string) => {
    const params = new URLSearchParams(url.split("?")[1]);
    return params.get("q");
  };

  afterEach(() => {
    jest.clearAllMocks();
    if (weatherComponent) weatherComponent.onUnmount();
    el.innerHTML = "";
  });

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

  it("should be a function", () => {
    expect(typeof Weather).toBe("function");
  });

  it("should create initial markup", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({
        json: () => Promise.resolve({ ...testData, name: getCityFromURL(url) }),
      }),
    );
    await initWeatherComponent();
    expect(el.innerHTML).not.toBe("");
    expect(form).not.toBeNull();
    expect(cityInput).not.toBeNull();
    expect(submitBtn).not.toBeNull();
    expect(savedCitiesList).not.toBeNull();

    expect(el.querySelector("#currentCity")).not.toBeNull();
  });

  it("should not submit if no city in input", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({
        json: () => Promise.resolve({ ...testData, name: getCityFromURL(url) }),
      }),
    );
    await initWeatherComponent();
    const len = el.querySelectorAll(".savedCity").length;
    const inner = el.innerHTML;
    cityInput.value = "";
    global.fetch = jest.fn();
    form.submit();
    expect(global.fetch).not.toHaveBeenCalled();
    const savedCities = el.querySelectorAll(".savedCity");
    expect(savedCities.length).toBe(len);
    expect(el.innerHTML).toEqual(inner);
  });

  it("should not render if city not exist", async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve({ cod: 400 }),
      }),
    );
    await initWeatherComponent();

    const len = el.querySelectorAll(".savedCity").length;
    const inner = el.innerHTML;
    cityInput.value = "testFaultCity";
    form.submit();
    const savedCities = el.querySelectorAll(".savedCity");
    expect(savedCities.length).toBe(len);
    expect(el.innerHTML).toEqual(inner);
  });

  it("should add city to list", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({
        json: () => Promise.resolve({ ...testData, name: getCityFromURL(url) }),
      }),
    );
    await initWeatherComponent();
    let savedCities = el.querySelectorAll(".savedCity");
    expect(savedCities.length).toBe(1);
    expect(savedCities[0].innerHTML).toEqual("TESTCITY");

    const testList = ["MOSCOW", "TULA"];
    const [city1, city2] = testList;
    cityInput.value = city2;
    form.submit();
    await sleep();
    savedCities = el.querySelectorAll(".savedCity");
    expect(savedCities.length).toBe(2);

    queryElements();

    cityInput.value = city1;
    form.submit();
    await sleep();
    const expectedTestList = ["MOSCOW", "TULA", "TESTCITY"];
    savedCities = el.querySelectorAll(".savedCity");
    expect(savedCities.length).toBe(expectedTestList.length);
    expectedTestList.forEach((elem, i) => {
      expect(savedCities[i].innerHTML).toBe(expectedTestList[i]);
    });

    (savedCities[1] as HTMLElement).click();
    await sleep();

    savedCities = el.querySelectorAll(".savedCity");

    const expectedListAfterClick = [expectedTestList[1], expectedTestList[0], "TESTCITY"];
    savedCities.forEach((elem, i) => {
      expect(elem.innerHTML).toBe(expectedListAfterClick[i]);
    });
  });

  it("should get city by ip if no city in input", async () => {
    global.fetch = jest.fn().mockImplementation((url: string) =>
      Promise.resolve({
        json: () => Promise.resolve({ ...testData, name: getCityFromURL(url) }),
      }),
    );

    const wrapper = document.createElement("div");
    const weather = new Weather(wrapper, {});
    await sleep(0);
    weather.init();
    await sleep();
    const currentCity = wrapper.querySelector("#currentCity");
    expect(currentCity!.innerHTML).toBe("TestCityByIp");
  });
});
