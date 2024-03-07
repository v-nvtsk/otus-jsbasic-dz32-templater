import { CitiesCache } from "./cities-cache";
import * as storage from "./storage";

describe("citiesCache tests", () => {
  let citiesCache: CitiesCache;

  beforeEach(() => {
    localStorage.clear();
    citiesCache = new CitiesCache();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("should load array from storage", () => {
    let mockedGetItem = jest.spyOn(storage, "getLocalStorageItem").mockReturnValue(null);
    expect(citiesCache.loadItems()).toEqual([]);
    expect(mockedGetItem).toHaveBeenCalled();
    const testList = ["1", "2", "3", "4"];
    mockedGetItem = jest.spyOn(storage, "getLocalStorageItem").mockReturnValue(testList);
    expect(citiesCache.loadItems()).toEqual(testList);
    // jest.restoreAllMocks();
  });

  it("should save toStorage and read from Cities list", () => {
    const citiesList = ["Moscow", "London", "Paris", "New York"];
    citiesCache.setCities(citiesList);
    citiesCache.saveItems();
    expect(citiesCache.loadItems()).toEqual(citiesList);
  });

  it("storage and cache should be empty", () => {
    expect(citiesCache.getCities()).toEqual([]);
    expect(citiesCache.loadItems()).toEqual([]);
  });

  it("should add new item to citiesCache", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.getCities()).toEqual(["MADRID"]);
  });

  it("should not add empty item to citiesCache", () => {
    citiesCache.addCity("Madrid");
    citiesCache.addCity("");
    expect(citiesCache.getCities()).toEqual(["MADRID"]);
  });

  it("should insert new item to start of citiesCache", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.getCities()).toEqual(["MADRID"]);
    citiesCache.addCity("Moscow");
    expect(citiesCache.getCities()).toEqual(["MOSCOW", "MADRID"]);
  });

  it("should save cached cities to Storage and read again", () => {
    citiesCache.setCities(["MOSCOW", "MADRID"]);
    citiesCache.saveItems();
    expect(citiesCache.loadItems()).toEqual(["MOSCOW", "MADRID"]);
  });

  it("should not set cities list with more than 10 items", () => {
    citiesCache.setCities(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]);
    expect(citiesCache.getCities()).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]);
  });

  test("it should not add same item", () => {
    citiesCache.addCity("Madrid");
    expect(citiesCache.getCities()).toEqual(["MADRID"]);
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

  it("should call listeners on cityAdd and unsubscribe them", () => {
    const listener = jest.fn();
    citiesCache.subscribe(listener);
    citiesCache.addCity("Moscow");
    expect(listener).toHaveBeenCalledWith(["MOSCOW"]);
    expect(listener).toHaveBeenCalledTimes(1);
    citiesCache.unsubscribe(listener);
    citiesCache.addCity("Tula");
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
