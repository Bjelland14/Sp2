export type Media = {
  url: string;
  alt?: string;
};

export type Bid = {
  id: string;
  amount: number;
  created: string;
  bidder?: {
    name: string;
  };
};

export type Listing = {
  id: string;
  title: string;
  description?: string;
  endsAt: string;
  media?: Media[];
  seller?: {
    name: string;
  };
  bids?: Bid[];
  _count?: {
    bids: number;
  };
  tags?: string[];
};

export type Profile = {
  name: string;
  email?: string;
  bio?: string;
  credits: number;
  avatar?: Media;
  banner?: Media;
};