import { request } from "./httpClient";

export async function getListings(page: number, search: string, tag: string) {
  const params = new URLSearchParams({
    limit: "12",
    page: String(page),
    sort: "created",
    sortOrder: "desc",
    _seller: "true",
    _bids: "true",
  });

  if (search) {
    params.set("q", search);
    return request("/auction/listings/search?" + params.toString(), "GET", null, false);
  }

  if (tag) {
    params.set("_tag", tag);
  }

  return request("/auction/listings?" + params.toString(), "GET", null, false);
}

export async function getListing(id: string) {
  if (!id) {
    throw new Error("Missing listing ID");
  }

  const result = await request(
    "/auction/listings/" + id + "?_seller=true&_bids=true",
    "GET",
    null,
    false
  );

  if (!result || !result.data) {
    throw new Error("Listing not found");
  }

  return result.data;
}

export async function createListing(
  title: string,
  description: string,
  endsAt: string,
  media: { url: string; alt: string }[],
  tags: string[]
) {
  const body: any = {
    title,
    description,
    endsAt,
    tags,
  };

  if (media.length > 0) {
    body.media = media;
  }

  const result = await request("/auction/listings", "POST", body, true);

  if (!result || !result.data) {
    throw new Error("Failed to create listing");
  }

  return result.data;
}

export async function updateListing(
  id: string,
  title: string,
  description: string,
  media: { url: string; alt: string }[]
) {
  if (!id) {
    throw new Error("Missing listing ID");
  }

  const body: any = {
    title,
    description,
  };

  if (media.length > 0) {
    body.media = media;
  }

  const result = await request("/auction/listings/" + id, "PUT", body, true);

  if (!result || !result.data) {
    throw new Error("Failed to update listing");
  }

  return result.data;
}

export async function deleteListing(id: string) {
  if (!id) {
    throw new Error("Missing listing ID");
  }

  return request("/auction/listings/" + id, "DELETE", null, true);
}
