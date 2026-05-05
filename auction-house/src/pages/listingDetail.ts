import { setupNav } from "../index";
import { getListing } from "../api/listings";
import { renderBidList } from "../ui/renderBidList";
import { setupBidForm } from "../events/bidEvents";
import { setupDeleteButton } from "../events/listingEvents";
import { formatDate, isEnded } from "../utils/formatDate";

setupNav();

// Get listing ID from URL
const params = new URLSearchParams(window.location.search);
const listingId = params.get("id");

// Get container
const container = document.getElementById("listing-container");

// Redirect if missing ID or container
if (!listingId || !container) {
  window.location.href = "/index.html";
} else {
  loadPage(listingId, container);
}

// Escape HTML to prevent XSS
function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function loadPage(id: string, container: HTMLElement) {

  // Show loading spinner
  container.innerHTML = `
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>
  `;

  try {
    // Fetch listing from API
    const listing = await getListing(id);

    // Check login state
    const token = localStorage.getItem("token");
    const apiKey = localStorage.getItem("apiKey");
    const loggedIn = token !== null && apiKey !== null;

    // Get current user
    const currentUser = localStorage.getItem("userName");

    // Check if auction ended
    const ended = isEnded(listing.endsAt);

    // Check if current user owns listing
    const isOwner = loggedIn && listing.seller && currentUser === listing.seller.name;

    // Get bids
    const bids = listing.bids || [];

    // Find highest bid
    let highestBid = 0;
    for (let i = 0; i < bids.length; i++) {
      if (bids[i].amount > highestBid) {
        highestBid = bids[i].amount;
      }
    }

    // Prepare safe text
    const title = escapeHtml(listing.title || "Untitled listing");
    const description = escapeHtml(listing.description || "No description.");

    // Seller info
    let sellerHtml = "";
    if (listing.seller && listing.seller.name) {
      sellerHtml = `<p class="text-muted">by <strong>${escapeHtml(listing.seller.name)}</strong></p>`;
    }

    // Highest bid display
    let highestBidHtml = "";
    if (highestBid > 0) {
      highestBidHtml = `<li><i class="bi bi-trophy me-2"></i><strong>Highest bid:</strong> ${highestBid} credits</li>`;
    }

    // Ended badge
    let endedBadge = "";
    if (ended) {
      endedBadge = '<span class="badge bg-danger fs-6">Auction ended</span>';
    }

    // Build image carousel
    let imagesHtml = `
      <img
        src="https://placehold.co/800x400?text=No+Image"
        alt="${title}"
        class="img-fluid rounded w-100"
        style="max-height: 420px; object-fit: cover;"
      >
    `;

    if (listing.media && listing.media.length > 0) {
      let items = "";

      for (let i = 0; i < listing.media.length; i++) {
        const active = i === 0 ? "active" : "";

        items += `
          <div class="carousel-item ${active}">
            <img
              src="${escapeHtml(listing.media[i].url)}"
              alt="${escapeHtml(listing.media[i].alt || listing.title)}"
              class="d-block w-100 rounded"
              style="height: 420px; object-fit: cover;"
              onerror="this.src='https://placehold.co/800x400?text=No+Image'"
            >
          </div>
        `;
      }

      imagesHtml = `
        <div id="listing-carousel" class="carousel slide">
          <div class="carousel-inner">
            ${items}
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#listing-carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target="#listing-carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      `;
    }

    // Owner controls (edit/delete)
    let ownerControls = "";

    if (isOwner) {
      ownerControls = `
        <div class="d-flex gap-2 mt-3">
          <a href="/create-listings.html?edit=${listing.id}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-pencil"></i> Edit
          </a>
          <button id="delete-btn" class="btn btn-danger btn-sm">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      `;
    }

    // Bid form for users
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

    // Login message for guests
    let loginPrompt = "";

    // Log in button for visitors
   if (!loggedIn && !ended) {
  loginPrompt = `
    <div class="alert alert-info mt-3 d-flex align-items-center justify-content-between">
      <span>Want to place a bid?</span>
      <a href="/login.html" class="btn btn-sm btn-outline-primary">
        Log in
      </a>
    </div>
  `;
}
    // Render page
    container.innerHTML = `
      <div class="row g-4">
        <div class="col-md-7">
          ${imagesHtml}
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

    // Setup bid form
    if (loggedIn && !isOwner && !ended) {
      setupBidForm(listing.id);
    }

    // Setup delete button
    if (isOwner) {
      setupDeleteButton(listing.id);
    }

  } catch (err) {
    container.innerHTML = `
      <div class="alert alert-danger">
        Could not load listing.
      </div>
    `;
  }
}