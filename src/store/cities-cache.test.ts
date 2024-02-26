import citiesCache from "./cities-cache";

beforeEach(() => {
  citiesCache.cities = [];
  citiesCache.saveItems();
});

describe("citiesCache tests", () => {
  it("should save toStorage and read from Cities list", () => {
    const citiesList = ["Moscow", "London", "Paris", "New York"];
    citiesCache.cities = citiesList;
    citiesCache.saveItems();
    expect(citiesCache.loadItems()).toEqual(citiesList);
  });

  it("storage and cache should be empty", () => {
    expect(citiesCache.cities).toEqual([]);
    expect(citiesCache.loadItems()).toEqual([]);
  });

  it("should add new item to citiesCache", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.cities).toEqual(["MADRID"]);
  });

  it("should not add empty item to citiesCache", () => {
    citiesCache.addCity("Madrid");
    citiesCache.addCity("");
    expect(citiesCache.cities).toEqual(["MADRID"]);
  });

  it("should insert new item to start of citiesCache", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.cities).toEqual(["MADRID"]);
    citiesCache.addCity("Moscow");
    expect(citiesCache.cities).toEqual(["MOSCOW", "MADRID"]);
  });

  it("should save cached cities to Storage and read again", () => {
    citiesCache.cities = ["MOSCOW", "MADRID"];
    citiesCache.saveItems();
    expect(citiesCache.loadItems()).toEqual(["MOSCOW", "MADRID"]);
  });

  test("it should not add same item", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.cities).toEqual(["MADRID"]);
    citiesCache.addCity("Moscow");
    expect(citiesCache.loadItems()).toEqual(["MOSCOW", "MADRID"]);
    citiesCache.addCity("Madrid");
    expect(citiesCache.loadItems()).toEqual(["MADRID", "MOSCOW"]);
  });

  it("should remove oldest item from citiesCache on overflow", () => {
    const arr = [
      "MOSCOW",
      "MADRID",
      "Rome",
      "Oslo",
      "Berlin",
      "Praga",
      "London",
      "Belgrad",
      "Minsk",
      "Paris",
      "Overflow",
    ];
    arr.forEach((el) => {
      citiesCache.addCity(el);
    });

    citiesCache.saveItems();
    expect(citiesCache.loadItems()).toEqual([
      "OVERFLOW",
      "PARIS",
      "MINSK",
      "BELGRAD",
      "LONDON",
      "PRAGA",
      "BERLIN",
      "OSLO",
      "ROME",
      "MADRID",
    ]);
  });
});
