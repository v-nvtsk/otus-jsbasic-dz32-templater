import getCityByIP from "./ip";

// Mock the GeoIP data
const mockGeoIpJSON = {
  organization_name: "Rostelecom",
  country_code: "RU",
  country_code3: "RUS",
  continent_code: "EU",
  region: "Moscow",
  latitude: "55.7483",
  longitude: "37.6171",
  accuracy: 5,
  asn: 42610,
  timezone: "Europe/Moscow",
  city: "Moscow",
  organization: "AS42610 Rostelecom",
  ip: "",
  country: "Russia",
  area_code: "0",
};

describe("getCityByIP", () => {
  let result: string;
  beforeEach(async () => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockGeoIpJSON),
      }),
    );

    result = await getCityByIP();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("getCityByIP is a function", () => {
    expect(getCityByIP).toBeInstanceOf(Function);
  });

  it("getCityByIP returns promise", async () => {
    expect(fetch).toHaveBeenCalledWith(`https://get.geojs.io/v1/ip/geo.json`);
    expect(result).toEqual("Moscow");
  });
});
