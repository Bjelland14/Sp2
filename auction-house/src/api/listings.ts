const API_BASE = "https://v2.api.noroff.dev";

export async function getListings() {
  const response = await fetch(`${API_BASE}/auction/listings`);

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    throw new Error("Failed to fetch listings");
  }

  const data = await response.json();
  return data.data;
}

export async function getListingById(id: string) {
  const response = await fetch(`${API_BASE}/auction/listings/${id}`);

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    throw new Error("Failed to fetch listing");
  }

  const data = await response.json();
  return data.data;
}

export async function createListing(listingData: {
  title: string;
  description: string;
  endsAt: string;
  media: string[];
}) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    throw new Error("User is not logged in");
  }

  const response = await fetch(`${API_BASE}/auction/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(listingData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    throw new Error("Failed to create listing");
  }

  const data = await response.json();
  return data.data;
}