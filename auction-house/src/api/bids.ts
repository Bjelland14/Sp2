import { request } from "./httpClient";

export async function placeBid(listingId: string, amount: number) {
  if (!listingId) {
    throw new Error("Missing listing ID");
  }

  if (amount <= 0) {
    throw new Error("Bid amount must be greater than 0");
  }

  const result = await request(
    "/auction/listings/" + listingId + "/bids",
    "POST",
    { amount },
    true
  );

  if (!result || !result.data) {
    throw new Error("Failed to place bid");
  }

  return result.data;
}
