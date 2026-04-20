import { api } from "./http";
import type { ApiResponse, Listing, ListingParams, CreateListingPayload } from "../types";

export function getListings(
  params: ListingParams = {}
): Promise<ApiResponse<Listing[]>> {
  const { page = 1, limit = 12, sort = "created", sortOrder = "desc", _active = true, q } = params;

  return api.get<ApiResponse<Listing[]>>("/auction/listings", {
    page,
    limit,
    sort,
    sortOrder,
    _seller: true,
    _bids: true,
    _active: _active ? true : undefined,
    q: q || undefined,
  });
}

export function getListing(id: string): Promise<ApiResponse<Listing>> {
  return api.get<ApiResponse<Listing>>(`/auction/listings/${id}`, {
    _seller: true,
    _bids: true,
  });
}

export function createListing(
  payload: CreateListingPayload
): Promise<ApiResponse<Listing>> {
  const body: Partial<CreateListingPayload> = { title: payload.title, endsAt: payload.endsAt };
  if (payload.description) body.description = payload.description;
  if (payload.tags?.length) body.tags = payload.tags;
  if (payload.media?.length) body.media = payload.media;
  return api.post<ApiResponse<Listing>>("/auction/listings", body);
}

export function updateListing(
  id: string,
  updates: Partial<CreateListingPayload>
): Promise<ApiResponse<Listing>> {
  return api.put<ApiResponse<Listing>>(`/auction/listings/${id}`, updates);
}

export function deleteListing(id: string): Promise<void> {
  return api.delete<void>(`/auction/listings/${id}`);
}

export function placeBid(
  listingId: string,
  amount: number
): Promise<ApiResponse<{ amount: number }>> {
  return api.post<ApiResponse<{ amount: number }>>(
    `/auction/listings/${listingId}/bids`,
    { amount }
  );
}
