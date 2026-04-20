const API_BASE = "https://api.noroff.dev/api/v2";

export async function getListings() {
     const response = await fetch(`${API_BASE}/auction/listings`);

     if (!response.ok) {
        throw new Error ("Failed to fetch listings");
}

const data = await response.json ();
return data.data;
}