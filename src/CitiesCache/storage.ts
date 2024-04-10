export function getLocalStorageItem(key: string) {
  let result;
  try {
    const res = localStorage.getItem(key);
    result = res === null ? null : JSON.parse(res);
  } catch (err) {
    result = null;
  }
  return result;
}

export function setLocalStorageItem(key: string, value: string | string[]): void {
  const savedValue = JSON.stringify(value);
  localStorage.setItem(key, savedValue);
}
