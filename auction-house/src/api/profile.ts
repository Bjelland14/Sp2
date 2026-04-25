const API_BASE = "https://v2.api.noroff.dev";

type ProfileUpdateBody = {
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
};

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

export async function getProfileListings(
  name: string,
  token: string,
  apiKey: string
) {
  const response = await fetch(`${API_BASE}/auction/profiles/${name}/listings`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Failed to fetch profile listings");
  }

  return json.data;
}

export async function getProfileBids(
  name: string,
  token: string,
  apiKey: string
) {
  const response = await fetch(
    `${API_BASE}/auction/profiles/${name}/bids?_listings=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
      },
    }
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Failed to fetch profile bids");
  }

  return json.data;
}

export async function updateProfile(
  name: string,
  token: string,
  apiKey: string,
  body: ProfileUpdateBody
) {
  const response = await fetch(`${API_BASE}/auction/profiles/${name}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.errors?.[0]?.message || "Failed to update profile");
  }

  return json.data;
}