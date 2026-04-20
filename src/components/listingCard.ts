import { timeLeft } from "../utils/time";
import type { Listing } from "../types";

export function listingCardHTML(listing: Listing): string {
  const { id, title, media, description, bids = [], endsAt, seller } = listing;
  const highestBid =
    bids.length > 0 ? Math.max(...bids.map((b) => b.amount)) : 0;
  const { expired, label, urgent } = timeLeft(endsAt);
  const img =
    media?.[0]?.url ??
    "https://placehold.co/400x300/e0e7ff/4f46e5?text=No+Image";
  const imgAlt = media?.[0]?.alt ?? title;
  const bidCount = bids.length;

  const timerClass = expired
    ? "text-gray-400"
    : urgent
    ? "text-red-500 font-semibold"
    : "text-green-600";

  return `
    <a href="/listing.html?id=${id}"
      class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col">
      <div class="aspect-[4/3] overflow-hidden bg-gray-100 relative">
        <img src="${img}" alt="${imgAlt}"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onerror="this.src='https://placehold.co/400x300/e0e7ff/4f46e5?text=No+Image'">
        ${expired ? `<div class="absolute top-2 right-2 bg-gray-800 bg-opacity-80 text-white text-xs px-2 py-1 rounded-full">Ended</div>` : ""}
        ${bidCount > 0 ? `<div class="absolute bottom-2 left-2 bg-white bg-opacity-90 text-xs font-semibold text-gray-700 px-2 py-1 rounded-full">${bidCount} bid${bidCount !== 1 ? "s" : ""}</div>` : ""}
      </div>
      <div class="p-4 flex flex-col flex-1">
        <h3 class="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">${title}</h3>
        ${description ? `<p class="text-xs text-gray-500 line-clamp-2 mb-3">${description}</p>` : '<div class="mb-3"></div>'}
        <div class="mt-auto flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-400">Current bid</p>
            <p class="text-base font-bold text-indigo-600">${highestBid > 0 ? highestBid.toLocaleString() + " cr" : "No bids"}</p>
          </div>
          <div class="text-right">
            <p class="text-xs text-gray-400">${expired ? "Ended" : "Ends in"}</p>
            <p class="text-sm ${timerClass}">${label}</p>
          </div>
        </div>
        ${seller ? `<p class="text-xs text-gray-400 mt-2">by ${seller.name}</p>` : ""}
      </div>
    </a>
  `;
}

export function listingCardSkeleton(): string {
  return `
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
      <div class="aspect-[4/3] bg-gray-200"></div>
      <div class="p-4 space-y-3">
        <div class="h-4 bg-gray-200 rounded w-3/4"></div>
        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
        <div class="flex justify-between mt-4">
          <div class="h-5 bg-gray-200 rounded w-20"></div>
          <div class="h-5 bg-gray-200 rounded w-16"></div>
        </div>
      </div>
    </div>
  `;
}
