import { api } from "./http";
import type { ApiResponse, User, Listing, Bid, UpdateProfilePayload } from "../types";

export function getProfile(name: string): Promise<ApiResponse<User>> {
  return api.get<ApiResponse<User>>(`/auction/profiles/${name}`, {
    _listings: true,
    _wins: true,
  });
}

export function updateProfile(
  name: string,
  payload: UpdateProfilePayload
): Promise<ApiResponse<User>> {
  return api.put<ApiResponse<User>>(`/auction/profiles/${name}`, payload);
}

export function getProfileListings(
  name: string,
  page = 1,
  limit = 12
): Promise<ApiResponse<Listing[]>> {
  return api.get<ApiResponse<Listing[]>>(`/auction/profiles/${name}/listings`, {
    page,
    limit,
    _bids: true,
    sort: "created",
    sortOrder: "desc",
  });
}

export function getProfileBids(
  name: string,
  page = 1,
  limit = 20
): Promise<ApiResponse<Bid[]>> {
  return api.get<ApiResponse<Bid[]>>(`/auction/profiles/${name}/bids`, {
    page,
    limit,
    _listings: true,
    sort: "created",
    sortOrder: "desc",
  });
}

export function getProfileWins(
  name: string,
  page = 1,
  limit = 12
): Promise<ApiResponse<Listing[]>> {
  return api.get<ApiResponse<Listing[]>>(`/auction/profiles/${name}/wins`, {
    page,
    limit,
  });
}
