import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/styles.css";

import {
  getToken,
  getApiKey,
  getUserName,
  getCredits,
  clearAuth,
} from "./utils/storage";

// Escape HTML helper
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

  // Logged in navigation
  if (loggedIn && userName) {
    const safeUserName = escapeHtml(userName);

    rightSideLinks = `
      <li class="nav-item">
        <span class="badge bg-warning text-dark fs-6">
          <i class="bi bi-coin me-1"></i>${credits} credits
        </span>
      </li>

      <li class="nav-item">
        <a class="nav-link"
          href="./profile.html?user=${encodeURIComponent(userName)}">
          ${safeUserName}
        </a>
      </li>

      <li class="nav-item">
        <button id="logout-btn"
          class="btn btn-outline-light btn-sm">
          Log out
        </button>
      </li>
    `;

  } else {

    // Guest navigation
    rightSideLinks = `
      <li class="nav-item">
        <a class="btn btn-outline-light btn-sm me-1"
          href="./login.html">
          Log in
        </a>
      </li>

      <li class="nav-item">
        <a class="btn btn-warning btn-sm"
          href="./register.html">
          Register
        </a>
      </li>
    `;
  }

  let newListingLink = "";

  // Show create listing link only for logged in users
  if (loggedIn) {
    newListingLink = `
      <li class="nav-item">
        <a class="nav-link"
          href="./create-listings.html">
          + New Listing
        </a>
      </li>
    `;
  }

  // Render navbar
  placeholder.innerHTML = `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div class="container">

        <a class="navbar-brand fw-bold text-warning"
          href="./index.html">
          <i class="bi bi-hammer me-1"></i> AuctionHouse
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation">

          <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="mainNav">

          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" href="./index.html">
                Browse
              </a>
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

  // Logout button
  const logoutBtn = document.getElementById("logout-btn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      clearAuth();
      window.location.href = "./index.html";
    });
  }
}