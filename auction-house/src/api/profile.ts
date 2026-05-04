import { request } from "./httpClient";

export async function getProfile(name: string) {
  if (!name) {
    throw new Error("Missing profile name");
  }

  const result = await request("/auction/profiles/" + name, "GET", null, true);

  if (!result || !result.data) {
    throw new Error("Profile not found");
  }

  return result.data;
}

export async function updateProfile(
  name: string,
  bio: string,
  avatarUrl: string,
  bannerUrl: string
) {
  if (!name) {
    throw new Error("Missing profile name");
  }

  const body: any = { bio };

  if (avatarUrl) {
    body.avatar = { url: avatarUrl, alt: "avatar" };
  }

  if (bannerUrl) {
    body.banner = { url: bannerUrl, alt: "banner" };
  }

  const result = await request("/auction/profiles/" + name, "PUT", body, true);

  if (!result || !result.data) {
    throw new Error("Failed to update profile");
  }

  return result.data;
}

export async function getProfileListings(name: string) {
  if (!name) {
    throw new Error("Missing profile name");
  }

  const result = await request(
    "/auction/profiles/" + name + "/listings?_bids=true&sort=created&sortOrder=desc",
    "GET",
    null,
    true
  );

  if (!result || !result.data) {
    throw new Error("Failed to fetch listings");
  }

  return result.data;
}

export async function getProfileBids(name: string) {
  if (!name) {
    throw new Error("Missing profile name");
  }

  const result = await request(
    "/auction/profiles/" + name + "/bids?_listings=true",
    "GET",
    null,
    true
  );

  if (!result || !result.data) {
    throw new Error("Failed to fetch bids");
  }

  return result.data;
}