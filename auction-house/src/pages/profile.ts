import { authGuard } from "../utils/authGuard";
import { getUser, getToken, getApiKey, setUser } from "../utils/storage";
import {
  getProfile,
  getProfileListings,
  getProfileBids,
} from "../api/profile";

authGuard();

const profileContainer =
  document.querySelector<HTMLDivElement>("#profileContainer");

if (profileContainer) {
  loadProfilePage();
}

async function loadProfilePage() {
  const user = getUser();
  const token = getToken();
  const apiKey = getApiKey();

  if (!user || !token || !apiKey || !profileContainer) {
    return;
  }

  try {
    const profile = await getProfile(user.name, token, apiKey);
    const listings = await getProfileListings(user.name, token, apiKey);
    const bids = await getProfileBids(user.name, token, apiKey);

    setUser(profile);

    renderProfile(profile, listings, bids);
  } catch (error) {
    console.error("Error loading profile:", error);

    profileContainer.innerHTML = `
      <div class="alert alert-danger">
        Could not load profile.
      </div>
    `;
  }
}

function renderProfile(profile: any, listings: any[], bids: any[]) {
  if (!profileContainer) return;

  const credits = profile.credits ?? 0;
  const avatarUrl = profile.avatar?.url;
  const bio = profile.bio || "No bio added yet.";

  profileContainer.innerHTML = `
    <section class="card shadow-sm p-4 mb-4">
      <div class="d-flex flex-column flex-md-row align-items-center gap-4">
        <img
          src="${avatarUrl || "https://placehold.co/150x150?text=User"}"
          alt="${profile.avatar?.alt || profile.name}"
          class="rounded-circle"
          width="150"
          height="150"
          style="object-fit: cover;"
        />

        <div>
          <h1 class="h3 mb-2">${profile.name}</h1>
          <p class="text-muted mb-2">${profile.email ?? ""}</p>
          <p class="mb-2">${bio}</p>
          <p class="fw-bold mb-0">Credits: ${credits.toLocaleString()}</p>
        </div>
      </div>
    </section>

    <section class="mb-4">
      <h2 class="h4 mb-3">My listings</h2>
      ${renderListings(listings)}
    </section>

    <section class="mb-4">
      <h2 class="h4 mb-3">Listings I have bid on</h2>
      ${renderBids(bids)}
    </section>
  `;
}

function renderListings(listings: any[]) {
  if (!listings || listings.length === 0) {
    return `<div class="alert alert-secondary">You have not created any listings yet.</div>`;
  }

  return `
    <div class="row g-3">
      ${listings
        .map(
          (listing) => `
            <div class="col-md-6">
              <div class="card h-100 shadow-sm">
                <img
                  src="${listing.media?.[0]?.url || "https://placehold.co/600x400?text=No+Image"}"
                  class="card-img-top"
                  alt="${listing.media?.[0]?.alt || listing.title}"
                  style="height: 180px; object-fit: cover;"
                />
                <div class="card-body">
                  <h3 class="h5">${listing.title}</h3>
                  <p class="text-muted small mb-2">
                    Ends: ${new Date(listing.endsAt).toLocaleDateString()}
                  </p>
                  <a href="listing.html?id=${listing.id}" class="btn btn-outline-primary btn-sm">
                    View listing
                  </a>
                </div>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function renderBids(bids: any[]) {
  if (!bids || bids.length === 0) {
    return `<div class="alert alert-secondary">You have not placed any bids yet.</div>`;
  }

  return `
    <div class="list-group">
      ${bids
        .map((bid) => {
          const listing = bid.listing;

          return `
            <a
              href="listing.html?id=${listing?.id}"
              class="list-group-item list-group-item-action"
            >
              <div class="d-flex justify-content-between">
                <strong>${listing?.title || "Listing"}</strong>
                <span>${bid.amount.toLocaleString()} credits</span>
              </div>
            </a>
          `;
        })
        .join("")}
    </div>
  `;
}