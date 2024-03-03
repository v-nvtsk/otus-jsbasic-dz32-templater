import { getLocalStorageItem, setLocalStorageItem } from "./storage";

export const CITY_LIST = "cities";

export class CitiesCache {
  private cities: string[] = [];

  private listeners: Function[] = [];

  loadItems() {
    this.cities = (getLocalStorageItem(CITY_LIST) ?? []) as string[];
    return [...this.cities];
  }

  setCities(cities: string[]) {
    this.cities = [...cities].slice(0, 10);
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
    // if (tempArr.length === 11) tempArr.pop();
    this.setCities(tempArr);

    this.saveItems();
    this.trigger();
    return newItem;
  }

  trigger() {
    this.listeners.forEach((listener) => listener(this.cities));
  }

  subscribe(listener: Function) {
    this.listeners.push(listener);
  }

  unsubscribe(listener: Function) {
    this.listeners = this.listeners.filter((el) => el !== listener);
  }
}
