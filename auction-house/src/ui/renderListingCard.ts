import { timeLeft, isEnded } from "../utils/formatDate";

type ListingCardData = {
  id: string;
  title?: string;
  endsAt: string;
  media?: {
    url: string;
    alt?: string;
  }[];
  seller?: {
    name: string;
  };
  _count?: {
    bids: number;
  };
  bids?: unknown[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderListingCard(listing: ListingCardData) {
  let image = "https://placehold.co/400x220?text=No+Image";
  let imageAlt = listing.title || "Listing image";

  // Use first image if available
  if (listing.media && listing.media[0] && listing.media[0].url) {
    image = listing.media[0].url;
    imageAlt = listing.media[0].alt || listing.title || "Listing image";
  }

  // Get bid count
  let bidCount = 0;

  if (listing._count) {
    bidCount = listing._count.bids;
  } else if (listing.bids) {
    bidCount = listing.bids.length;
  }

  // Create bid text
  let bidText = bidCount + " bids";

  if (bidCount === 1) {
    bidText = "1 bid";
  }

  if (bidCount === 0 && listing.bids) {
    bidText = "Bid placed";
  }

  // Time badge
  let badgeClass = "bg-success";
  let badgeText = timeLeft(listing.endsAt);

  if (isEnded(listing.endsAt)) {
    badgeClass = "bg-danger";
    badgeText = "Ended";
  }

  // Seller line
  let sellerLine = "";

  if (listing.seller) {
    sellerLine =
      '<p class="text-muted small mb-0">by ' +
      escapeHtml(listing.seller.name) +
      "</p>";
  }

  return `
    <div class="col">
      <a href="/listing.html?id=${escapeHtml(listing.id)}" class="text-decoration-none">
        <div class="card h-100 shadow-sm listing-card">

          <div class="position-relative">
           <img
            src="${escapeHtml(image)}"
            alt="${escapeHtml(imageAlt)}"
            class="card-img-top"
            style="height: 200px; object-fit: cover;"
            loading="lazy"
            onerror="this.src='https://placehold.co/400x220?text=No+Image'"
  >

            <span class="badge ${badgeClass} position-absolute top-0 end-0 m-2">
              ${escapeHtml(badgeText)}
            </span>
          </div>

          <div class="card-body">
            <h6 class="card-title text-dark fw-semibold text-truncate">
              ${escapeHtml(listing.title || "Untitled listing")}
            </h6>

            <p class="text-muted small mb-1">
              <i class="bi bi-gavel me-1"></i>${bidText}
            </p>

            ${sellerLine}
          </div>

        </div>
      </a>
    </div>
  `;
}