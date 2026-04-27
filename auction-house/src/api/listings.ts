const API_BASE = "https://v2.api.noroff.dev";

// Fetch all listings
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

// Fetch single listing with seller and bids
export async function getListingById(id: string) {
  const response = await fetch(
    `${API_BASE}/auction/listings/${id}?_seller=true&_bids=true`
  );

  if (!response.ok) {
    const errorData = await response.json();
    console.error(errorData);
    throw new Error("Failed to fetch listing");
  }

  const data = await response.json();
  return data.data;
}

// Create new listing
export async function createListing(
  listingData: any,
  token: string,
  apiKey: string
) {
  const response = await fetch(`${API_BASE}/auction/listings`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(listingData),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(data?.errors?.[0]?.message || "Failed to create listing");
  }

  return data.data;
}

// Place a bid on a listing
export async function placeBid(
  listingId: string,
  amount: number,
  token: string,
  apiKey: string
) {
  const response = await fetch(
    `${API_BASE}/auction/listings/${listingId}/bids`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
      body: JSON.stringify({ amount }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error(data);
    throw new Error(data?.errors?.[0]?.message || "Failed to place bid");
  }

  return data.data;
}