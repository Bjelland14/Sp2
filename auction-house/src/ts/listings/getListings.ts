export async function getListings() {
  const res = await fetch("API_URL/listings");
  return res.json();
}