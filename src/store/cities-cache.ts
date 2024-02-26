import { getLocalStorageItem, setLocalStorageItem } from "../js/storage";

const CITY_LIST = "cities";

export default {
  cities: [] as string[],
  listeners: [] as Function[],
  init() {
    this.loadItems();
  },
  loadItems() {
    this.cities = (getLocalStorageItem(CITY_LIST) || []) as string[];
    return this.cities;
  },
  saveItems() {
    setLocalStorageItem(CITY_LIST, this.cities);
  },
  addCity(cityName: string) {
    if (!cityName) return false;
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
  },

  subscribe(listener: Function) {
    this.listeners.push(listener);
  },
};
