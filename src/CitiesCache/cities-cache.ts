import { getLocalStorageItem, setLocalStorageItem } from "./storage";

const CITY_LIST = "cities";

export class CitiesCache {
  private cities: string[] = [];

  private listeners: Function[] = [];

  loadItems() {
    this.cities = (getLocalStorageItem(CITY_LIST) || []) as string[];
    return this.cities;
  }

  setCities(cities: string[]) {
    this.cities = [...cities];
  }

  getCities() {
    return [...this.cities];
  }

  saveItems() {
    setLocalStorageItem(CITY_LIST, this.cities);
  }

  addCity(cityName: string): string {
    if (!cityName) return "";
    const newItem = cityName.toUpperCase();
    const tempArr = [newItem];
    for (let i = 0; i < this.cities.length; i += 1) {
      if (this.cities[i] !== newItem) {
        tempArr.push(this.cities[i]);
      }
    }
    if (tempArr.length === 11) tempArr.pop();
    this.cities = tempArr;

    this.saveItems();
    this.listeners.forEach((listener) => listener(this.cities));
    return newItem;
  }

  subscribe(listener: Function) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Function) {
    this.listeners = this.listeners.filter((el) => el !== listener);
  }
}
