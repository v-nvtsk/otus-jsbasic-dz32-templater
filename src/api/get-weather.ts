const API_KEY = "ab4639f5754271e773ed6d3ffd73f327";

export default async function getWeatherInCity(
  cityName: string,
  lang = "ru",
): Promise<{ city: string; temp: string; icon: string; coord: [number, number]; cod?: number } | null> {
  const units = "metric";
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=${units}&lang=${lang}`,
  );
  const data = await response.json();
  let city;
  let temp;
  let icon;
  let coord: [number, number];
  if (data.cod === 200) {
    city = data.name;
    temp = String(Math.round(data.main.temp));
    icon = data.weather[0].icon;
    coord = [data.coord.lon, data.coord.lat];
  } else {
    return null;
  }
  return { city, temp, icon, coord };
}
