import getWeatherInCity from "./get-weather";

const mockWeatherJSON = {
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
};

global.fetch = jest.fn();

describe("getWeatherInCity", () => {
  it("getWeatherInCity is a function", () => {
    expect(getWeatherInCity).toBeInstanceOf(Function);
  });

  beforeEach(async () => {
    // global.fetch.mockReset();
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockWeatherJSON),
    });
  });

  afterEach(() => {
    // эта строка добавлена взамен
    // global.fetch.mockReset();
    // в beforeEach
    jest.resetAllMocks();
  });

  it("getWeatherInCity returns city, temp and icon", async () => {
    const result = await getWeatherInCity("Moscow");
    expect(result).toEqual({
      city: "Москва",
      temp: String(Math.round(-3.43)),
      icon: "04d",
      coord: [37.6156, 55.7522],
    });
  });
  it("getWeatherInCity returns not found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ cod: 400 }),
    });
    const result = await getWeatherInCity("Moscow");
    expect(result).toBeNull();
  });
});
