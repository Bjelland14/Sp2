import { getListings } from "../api/listings";
import { renderListingCard } from "../ui/renderListingCard";
import { getUser, isLoggedIn, clearAuth } from "../utils/storage";

let allListings: any[] = [];

const listingGrid = document.querySelector("#listingGrid");
const searchForm = document.querySelector("#searchForm");
const searchInput = document.querySelector("#searchInput");
const authStatus = document.querySelector<HTMLDivElement>("#authStatus");

function renderAuthStatus() {
  if (!authStatus) return;

  if (!isLoggedIn()) {
    authStatus.innerHTML = `
      <a href="login.html" class="btn btn-outline-primary">Login</a>
      <a href="register.html" class="btn btn-primary">Register</a>
    `;
    return;
  }

  const user = getUser();
  const credits = user?.credits ?? 0;

  authStatus.innerHTML = `
    <span class="text-muted small">
      Credits: ${credits.toLocaleString()}
    </span>
    <a href="profile.html" class="btn btn-outline-primary btn-sm">
      ${user?.name ?? "Profile"}
    </a>
    <button id="logoutBtn" class="btn btn-outline-danger btn-sm">
      Logout
    </button>
  `;

  const logoutBtn = document.querySelector<HTMLButtonElement>("#logoutBtn");

  logoutBtn?.addEventListener("click", () => {
    clearAuth();
    window.location.href = "index.html";
  });
}

function renderListings(listings: any[]) {
  if (!(listingGrid instanceof HTMLElement)) return;

  listingGrid.innerHTML = "";

  if (listings.length === 0) {
    listingGrid.innerHTML =
      '<div class="alert alert-secondary">No listings found.</div>';
    return;
  }

  for (const listing of listings) {
    listingGrid.innerHTML += renderListingCard(listing);
  }
}

function filterListings(searchTerm: string) {
  const normalizedTerm = searchTerm.trim().toLowerCase();

  if (!normalizedTerm) {
    renderListings(allListings);
    return;
  }

  const filteredListings = allListings.filter((listing) =>
    listing.title?.toLowerCase().includes(normalizedTerm)
  );

  renderListings(filteredListings);
}

async function loadListings() {
  if (!(listingGrid instanceof HTMLElement)) return;

  try {
    allListings = await getListings();
    renderListings(allListings);
  } catch (error) {
    console.error("Error loading listings:", error);
    listingGrid.innerHTML = "<p>Could not load listings</p>";
  }
}

if (
  searchForm instanceof HTMLFormElement &&
  searchInput instanceof HTMLInputElement
) {
  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    filterListings(searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    filterListings(searchInput.value);
  });
}

renderAuthStatus();
loadListings();