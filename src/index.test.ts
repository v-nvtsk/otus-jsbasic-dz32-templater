import "./index";

jest.mock("./api/ip", () => jest.fn().mockImplementation(() => Promise.resolve("Moscow")));
jest.mock("./api/get-weather", () =>
  jest.fn().mockImplementation(() => ({
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
    name: "Москва",
    cod: 200,
  })),
);

describe("index", () => {
  it("should create initial markup", () => {
    expect(document.body.innerHTML).not.toBe("");
  });
});
