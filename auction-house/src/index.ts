import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/styles.css";
import {
  getToken,
  getApiKey,
  getUserName,
  getCredits,
  clearAuth,
} from "./utils/storage";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function setupNav() {
  const placeholder = document.getElementById("nav-placeholder");
  if (!placeholder) return;

  const token = getToken();
  const apiKey = getApiKey();
  const loggedIn = token !== null && apiKey !== null;
  const userName = getUserName();
  const credits = getCredits();

  let rightSideLinks = "";

  if (loggedIn && userName) {
    const safeUserName = escapeHtml(userName);

    rightSideLinks = `
      <li class="nav-item">
        <span class="badge bg-warning text-dark fs-6">
          <i class="bi bi-coin me-1"></i>${credits} credits
        </span>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="./profile.html?user=${encodeURIComponent(userName)}">${safeUserName}</a>
      </li>
      <li class="nav-item">
        <button id="logout-btn" class="btn btn-outline-light btn-sm">Log out</button>
      </li>
    `;
  } else {
    rightSideLinks = `
      <li class="nav-item">
        <a class="btn btn-outline-light btn-sm me-1" href="./login.html">Log in</a>
      </li>
      <li class="nav-item">
        <a class="btn btn-warning btn-sm" href="./register.html">Register</a>
      </li>
    `;
  }

  let newListingLink = "";

  if (loggedIn) {
    newListingLink = `
      <li class="nav-item">
        <a class="nav-link" href="./create-listings.html">+ New Listing</a>
      </li>
    `;
  }

  placeholder.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">
        <a class="navbar-brand fw-bold text-warning" href="./index.html">
          <i class="bi bi-hammer me-1"></i> AuctionHouse
        </a>

        <button class="navbar-toggler" type="button"
          data-bs-toggle="collapse" data-bs-target="#mainNav"
          aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="./index.html">Browse</a>
            </li>
            ${newListingLink}
          </ul>

          <ul class="navbar-nav align-items-center gap-2">
            ${rightSideLinks}
          </ul>
        </div>
      </div>
    </nav>
  `;

  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      clearAuth();
      window.location.href = "./index.html";
    });
  }
}