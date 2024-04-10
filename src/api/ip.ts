export default async function getCityByIP() {
  const res = await fetch("https://get.geojs.io/v1/ip/geo.json");
  const result = await res.json();
  return result.city;
}
