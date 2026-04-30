import { setupNav } from "../index";
import { getListing } from "../api/listings";
import { renderBidList } from "../ui/renderBidList";
import { setupBidForm } from "../events/bidEvents";
import { setupDeleteButton } from "../events/listingEvents";
import { formatDate, isEnded } from "../utils/formatDate";

setupNav();

const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");
const container = document.getElementById("listing-container");

if (!listingId || !container) {
  window.location.href = "/index.html";
} else {
  loadPage(listingId, container);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadPage(id: string, container: HTMLElement) {
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>
  `;

  try {
    const listing = await getListing(id);

    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("apiKey");
    const loggedIn = token !== null && apiKey !== null;
    const currentUser = localStorage.getItem("userName");
    const ended = isEnded(listing.endsAt);

    const isOwner = loggedIn && listing.seller && currentUser === listing.seller.name;
    const bids = listing.bids || [];

    let highestBid = 0;

    for (let i = 0; i < bids.length; i++) {
      if (bids[i].amount > highestBid) {
        highestBid = bids[i].amount;
      }
    }

    let image = "https://placehold.co/800x400?text=No+Image";

    if (listing.media && listing.media[0] && listing.media[0].url) {
      image = listing.media[0].url;
    }

    const title = escapeHtml(listing.title || "Untitled listing");
    const description = escapeHtml(listing.description || "No description.");
    let sellerName = "";

    if (listing.seller) {
      sellerName = escapeHtml(listing.seller.name);
    }

    let sellerHtml = "";

    if (sellerName) {
      sellerHtml = '<p class="text-muted">by <strong>' + sellerName + "</strong></p>";
    }

    let highestBidHtml = "";

    if (highestBid > 0) {
      highestBidHtml = `<li><i class="bi bi-trophy me-2"></i><strong>Highest bid:</strong> ${highestBid} credits</li>`;
    }

    let endedBadge = "";

    if (ended) {
      endedBadge = '<span class="badge bg-danger fs-6">Auction ended</span>';
    }

    let ownerControls = "";

    if (isOwner) {
      ownerControls = `
        <div class="d-flex gap-2 mt-3">
          <a href="/create-listing.html?edit=${listing.id}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-pencil"></i> Edit
          </a>
          <button id="delete-btn" class="btn btn-danger btn-sm">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      `;
    }

    let bidFormHtml = "";

    if (loggedIn && !isOwner && !ended) {
      bidFormHtml = `
        <div class="card mt-4 border-warning">
          <div class="card-body">
            <h6 class="card-title">Place a Bid</h6>
            <div id="bid-message" hidden></div>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-coin"></i></span>
              <input
                type="number"
                id="bid-amount"
                class="form-control"
                placeholder="Min. ${highestBid + 1}"
                min="${highestBid + 1}"
              >
              <button id="bid-btn" class="btn btn-warning">Place bid</button>
            </div>
          </div>
        </div>
      `;
    }

    let loginPrompt = "";

    if (!loggedIn && !ended) {
      loginPrompt = `
        <div class="alert alert-info mt-3">
          <a href="/login.html">Log in</a> to place a bid.
        </div>
      `;
    }

    container.innerHTML = `
      <div class="row g-4">
        <div class="col-md-7">
          <img
            src="${escapeHtml(image)}"
            alt="${title}"
            class="img-fluid rounded w-100"
            style="max-height: 420px; object-fit: cover;"
            onerror="this.src='https://placehold.co/800x400?text=No+Image'"
          >
        </div>

        <div class="col-md-5">
          <h2 class="fw-bold">${title}</h2>
          ${sellerHtml}
          <p>${description}</p>

          <ul class="list-unstyled">
            <li><i class="bi bi-clock me-2"></i><strong>Ends:</strong> ${formatDate(listing.endsAt)}</li>
            <li><i class="bi bi-gavel me-2"></i><strong>Bids:</strong> ${bids.length}</li>
            ${highestBidHtml}
          </ul>

          ${endedBadge}
          ${ownerControls}
          ${bidFormHtml}
          ${loginPrompt}
        </div>
      </div>

      <div class="mt-5">
        <h5 class="fw-bold border-bottom pb-2">Bid History</h5>
        ${renderBidList(bids)}
      </div>
    `;

    if (loggedIn && !isOwner && !ended) {
      setupBidForm(listing.id);
    }

    if (isOwner) {
      setupDeleteButton(listing.id);
    }
  } catch (err) {
    let message = "Could not load listing.";
    if (err instanceof Error) {
      message = err.message;
    }
    container.innerHTML = '<div class="alert alert-danger">' + escapeHtml(message) + "</div>";
  }
}
