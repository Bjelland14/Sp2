import { mountNav } from "../components/nav";
import { mountFooter } from "../components/footer";
import { getListing, placeBid, deleteListing } from "../api/listings";
import { isLoggedIn, getUser } from "../utils/storage";
import { getParam } from "../utils/url";
import { formatDate, startCountdown } from "../utils/time";
import { toast } from "../components/toast";
import type { Listing, Bid } from "../types";

mountNav();
mountFooter();

const id = getParam("id");
if (!id) window.location.href = "/";

const appEl = document.getElementById("app")!;

async function load(): Promise<void> {
  appEl.innerHTML = `<div class="flex justify-center py-20"><div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>`;

  try {
    const res = await getListing(id!);
    render(res.data);
  } catch {
    appEl.innerHTML = `
      <div class="max-w-2xl mx-auto px-4 py-20 text-center">
        <p class="text-gray-500">Listing not found or failed to load.</p>
        <a href="/" class="mt-4 inline-block text-indigo-600 hover:underline">Back to listings</a>
      </div>
    `;
  }
}

function render(listing: Listing): void {
  const { title, description, media = [], bids = [], endsAt, seller, tags = [] } = listing;
  const isOwner = isLoggedIn() && getUser()?.name === seller?.name;
  const loggedIn = isLoggedIn();
  const expired = new Date(endsAt) <= new Date();
  const highestBid = bids.length > 0 ? Math.max(...bids.map((b: Bid) => b.amount)) : 0;
  const sortedBids = [...bids].sort((a, b) => b.amount - a.amount);
  const images = media.length > 0 ? media : [{ url: "https://placehold.co/800x600/e0e7ff/4f46e5?text=No+Image", alt: title }];

  appEl.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav class="text-sm text-gray-500 mb-6">
        <a href="/" class="hover:text-indigo-600">Listings</a>
        <span class="mx-2">/</span>
        <span class="text-gray-900 truncate">${title}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Gallery -->
        <div>
          <div class="rounded-2xl overflow-hidden bg-gray-100 aspect-[4/3] mb-3">
            <img id="main-img" src="${images[0].url}" alt="${images[0].alt}"
              class="w-full h-full object-contain"
              onerror="this.src='https://placehold.co/800x600/e0e7ff/4f46e5?text=No+Image'">
          </div>
          ${images.length > 1 ? `
            <div class="flex gap-2 overflow-x-auto pb-1">
              ${images.map((img, i) => `
                <button class="thumb-btn shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${i === 0 ? "border-indigo-500" : "border-transparent"} hover:border-indigo-300 transition-colors"
                  data-src="${img.url}" data-alt="${img.alt}">
                  <img src="${img.url}" alt="${img.alt}" class="w-full h-full object-cover">
                </button>
              `).join("")}
            </div>
          ` : ""}
        </div>

        <!-- Details -->
        <div class="flex flex-col">
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">${title}</h1>

          ${seller ? `
            <div class="flex items-center gap-2 mb-4">
              <img src="${seller.avatar?.url ?? "https://placehold.co/24x24/e0e7ff/4f46e5?text=" + seller.name[0].toUpperCase()}"
                alt="${seller.name}" class="w-6 h-6 rounded-full object-cover">
              <span class="text-sm text-gray-600">Listed by
                <a href="/profile/?user=${seller.name}" class="text-indigo-600 hover:underline font-medium">${seller.name}</a>
              </span>
            </div>
          ` : ""}

          ${tags.length > 0 ? `
            <div class="flex flex-wrap gap-1.5 mb-4">
              ${tags.map((t) => `<span class="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium">${t}</span>`).join("")}
            </div>
          ` : ""}

          ${description ? `<p class="text-gray-600 text-sm leading-relaxed mb-5">${description}</p>` : ""}

          <!-- Bid status -->
          <div class="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-5 mb-5">
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-indigo-600 font-medium mb-1">Current bid</p>
                <p class="text-2xl font-bold text-indigo-700">${highestBid > 0 ? highestBid.toLocaleString() + " cr" : "No bids"}</p>
                <p class="text-xs text-indigo-500">${bids.length} bid${bids.length !== 1 ? "s" : ""}</p>
              </div>
              <div>
                <p class="text-xs text-indigo-600 font-medium mb-1">${expired ? "Ended" : "Ends in"}</p>
                <p class="text-xl font-bold text-indigo-700" id="countdown-display">--</p>
                <p class="text-xs text-indigo-500">${formatDate(endsAt)}</p>
              </div>
            </div>

            ${!expired && loggedIn && !isOwner ? `
              <form id="bid-form" class="flex gap-2">
                <input type="number" id="bid-amount" min="${highestBid + 1}" step="1" required
                  placeholder="${highestBid > 0 ? "Bid > " + highestBid : "Enter amount"}"
                  class="flex-1 px-4 py-2.5 rounded-xl border border-indigo-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <button type="submit" id="bid-btn"
                  class="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  Bid
                </button>
              </form>
              <p class="text-xs text-indigo-500 mt-2">Min bid: <strong>${highestBid + 1} cr</strong></p>
            ` : !loggedIn && !expired ? `
              <a href="/auth/login.html?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}"
                class="block w-full text-center px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Log in to place a bid
              </a>
            ` : expired ? `
              <p class="text-sm text-indigo-600 font-medium text-center">This auction has ended</p>
            ` : `
              <p class="text-sm text-indigo-600 font-medium text-center">You cannot bid on your own listing</p>
            `}
          </div>

          ${isOwner ? `
            <div class="flex gap-2">
              <a href="/listings/edit.html?id=${id}"
                class="flex-1 text-center px-4 py-2.5 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
                Edit Listing
              </a>
              <button id="delete-btn"
                class="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
                Delete Listing
              </button>
            </div>
          ` : ""}
        </div>
      </div>

      <!-- Bid history -->
      ${sortedBids.length > 0 ? `
        <div class="mt-10">
          <h2 class="text-lg font-bold text-gray-900 mb-4">Bid History</h2>
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table class="w-full bid-table">
              <thead class="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th class="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bidder</th>
                  <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                ${sortedBids.map((bid, i) => `
                  <tr class="${i === 0 ? "bg-indigo-50" : ""}">
                    <td class="flex items-center gap-2">
                      ${bid.bidder?.avatar?.url
                        ? `<img src="${bid.bidder.avatar.url}" class="w-6 h-6 rounded-full object-cover">`
                        : `<div class="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">${(bid.bidder?.name ?? "?")[0].toUpperCase()}</div>`
                      }
                      <span class="text-sm text-gray-800 font-medium">${bid.bidder?.name ?? "Anonymous"}</span>
                      ${i === 0 ? `<span class="text-xs bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-full ml-1">Highest</span>` : ""}
                    </td>
                    <td class="text-right text-sm font-bold ${i === 0 ? "text-indigo-600" : "text-gray-700"}">${bid.amount.toLocaleString()} cr</td>
                    <td class="text-right text-xs text-gray-400">${formatDate(bid.created)}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      ` : `
        <div class="mt-10 text-center py-10 bg-gray-50 rounded-2xl">
          <p class="text-gray-400 text-sm">No bids yet. Be the first to bid!</p>
        </div>
      `}
    </div>
  `;

  // Countdown
  const countdownEl = document.getElementById("countdown-display");
  if (countdownEl && !expired) startCountdown(countdownEl, endsAt);
  else if (countdownEl) countdownEl.textContent = "Ended";

  // Thumbnails
  document.querySelectorAll<HTMLButtonElement>(".thumb-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mainImg = document.getElementById("main-img") as HTMLImageElement | null;
      if (mainImg) { mainImg.src = btn.dataset.src ?? ""; mainImg.alt = btn.dataset.alt ?? ""; }
      document.querySelectorAll(".thumb-btn").forEach((b) => {
        b.classList.remove("border-indigo-500");
        b.classList.add("border-transparent");
      });
      btn.classList.replace("border-transparent", "border-indigo-500");
    });
  });

  // Bid form
  const bidForm = document.getElementById("bid-form") as HTMLFormElement | null;
  bidForm?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const amountInput = document.getElementById("bid-amount") as HTMLInputElement;
    const amount = parseInt(amountInput.value, 10);
    const btn = document.getElementById("bid-btn") as HTMLButtonElement;

    if (!amount || amount <= highestBid) {
      toast(`Bid must be greater than ${highestBid} credits`, "error");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Placing...";
    try {
      await placeBid(id!, amount);
      toast("Bid placed successfully!", "success");
      setTimeout(() => void load(), 800);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to place bid", "error");
      btn.disabled = false;
      btn.textContent = "Bid";
    }
  });

  // Delete
  const deleteBtn = document.getElementById("delete-btn") as HTMLButtonElement | null;
  deleteBtn?.addEventListener("click", async () => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";
    try {
      await deleteListing(id!);
      toast("Listing deleted.", "info");
      setTimeout(() => (window.location.href = "/profile/"), 1000);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to delete", "error");
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete Listing";
    }
  });
}

void load();
