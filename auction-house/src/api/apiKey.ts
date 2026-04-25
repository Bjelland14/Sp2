const API_CREATE_KEY = "https://v2.api.noroff.dev/auth/create-api-key";

export async function createApiKey(token: string) {
  const response = await fetch(API_CREATE_KEY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Auction House",
    }),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Could not create API key");
  }

  return json.data.key;
}