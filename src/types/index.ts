export interface Media {
  url: string;
  alt: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: Media;
  banner?: Media;
  credits: number;
  bio?: string;
  accessToken?: string;
  _count?: {
    listings: number;
    wins: number;
    bids: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  bidder?: User;
  created: string;
  listing?: Listing;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  media?: Media[];
  created: string;
  updated: string;
  endsAt: string;
  bids?: Bid[];
  seller?: User;
  _count?: {
    bids: number;
  };
}

export interface ApiMeta {
  isFirstPage: boolean;
  isLastPage: boolean;
  currentPage: number;
  previousPage: number | null;
  nextPage: number | null;
  pageCount: number;
  totalCount: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiErrorBody {
  errors?: Array<{ message: string }>;
}

export interface ListingParams {
  page?: number;
  limit?: number;
  sort?: string;
  sortOrder?: "asc" | "desc";
  _active?: boolean;
  q?: string;
}

export interface CreateListingPayload {
  title: string;
  description?: string;
  tags?: string[];
  media?: Media[];
  endsAt: string;
}

export interface UpdateProfilePayload {
  bio?: string;
  avatar?: Media;
  banner?: Media;
}
