const API_BASE = "https://v2.api.noroff.dev";

export async function getProfile(
  name: string,
  token: string,
  apiKey: string
) {
  const response = await fetch(`${API_BASE}/auction/profiles/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Failed to fetch profile");
  }

  return json.data;
}