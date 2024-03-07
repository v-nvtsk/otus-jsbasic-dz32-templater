const API_KEY = "ab4639f5754271e773ed6d3ffd73f327";

export default async function getWeatherInCity(
  cityName: string,
  lang = "ru",
): Promise<{ city: string; temp: string; icon: string; coord: [number, number] } | null> {
  const units = "metric";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}&lang=${lang}`,
  );
  if (response.ok) {
    const data = await response.json();

    const city = data.name;
    const temp = String(Math.round(data.main.temp));
    const { icon } = data.weather[0];
    const coord: [number, number] = [data.coord.lon, data.coord.lat];
    return { city, temp, icon, coord };
  }
  return null;
}
