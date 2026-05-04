import { setupNav } from "../index";
import { requireLogin } from "../utils/authGuard";
import { getProfile, updateProfile, getProfileListings, getProfileBids } from "../api/profile";
import { renderProfileHeader } from "../ui/renderProfile";
import { renderListingCard } from "../ui/renderListingCard";
import { showError } from "../ui/showMessage";
import { saveCredits } from "../utils/storage";

setupNav();
requireLogin();

const params = new URLSearchParams(window.location.search);
const profileName = params.get("user") || localStorage.getItem("userName");
const container = document.getElementById("profile-container");
const currentUser = localStorage.getItem("userName");
const isOwnProfile = currentUser === profileName;

if (!profileName || !container) {
  window.location.href = "/login.html";
} else {
  loadPage(profileName, container);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function loadPage(name: string, el: HTMLElement) {
  try {
    const profile = await getProfile(name);
    const listings = await getProfileListings(name);

    let bids: any[] = [];

    if (isOwnProfile) {
       bids = await getProfileBids(name);
       console.log("Bids JSON:", JSON.stringify(bids, null, 2));
       saveCredits(profile.credits);
    }
    let listingsHtml = '<p class="text-muted">No listings yet.</p>';

    if (listings.length > 0) {
      let cards = "";

      for (let i = 0; i < listings.length; i++) {
        cards += renderListingCard(listings[i]);
      }

      listingsHtml = '<div class="row row-cols-2 row-cols-md-4 g-3">' + cards + "</div>";
    }

    let bidsSection = "";

    if (isOwnProfile) {
      let bidCards = '<p class="text-muted">No bids placed yet.</p>';

      if (bids.length > 0) {
        let cards = "";

        for (let i = 0; i < bids.length; i++) {
          if (bids[i].listing) {
            cards += renderListingCard(bids[i].listing);
          }
        }

        bidCards = '<div class="row row-cols-2 row-cols-md-4 g-3">' + cards + "</div>";
      }

      bidsSection = `
        <h5 class="fw-bold border-bottom pb-2 mb-3 mt-5">My Bids (${bids.length})</h5>
        ${bidCards}
      `;
    }

    let editButtonHtml = "";

    if (isOwnProfile) {
      editButtonHtml = `
        <button class="btn btn-outline-secondary btn-sm mb-4"
          data-bs-toggle="modal" data-bs-target="#edit-modal">
          <i class="bi bi-pencil"></i> Edit profile
        </button>
      `;
    }

    let editModalHtml = "";

    if (isOwnProfile) {
      let currentAvatar = "";
      let currentBanner = "";
      let currentBio = "";

      if (profile.avatar && profile.avatar.url) {
        currentAvatar = profile.avatar.url;
      }

      if (profile.banner && profile.banner.url) {
        currentBanner = profile.banner.url;
      }

      if (profile.bio) {
        currentBio = profile.bio;
      }

      editModalHtml = `
        <div class="modal fade" id="edit-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Profile</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div id="edit-message" hidden></div>
                <div class="mb-3">
                  <label for="edit-bio" class="form-label">Bio</label>
                  <textarea id="edit-bio" class="form-control" rows="3">${escapeHtml(currentBio)}</textarea>
                </div>
                <div class="mb-3">
                  <label for="edit-avatar" class="form-label">Avatar URL</label>
                  <input id="edit-avatar" type="url" class="form-control" value="${escapeHtml(currentAvatar)}">
                </div>
                <div class="mb-3">
                  <label for="edit-banner" class="form-label">Banner URL</label>
                  <input id="edit-banner" type="url" class="form-control" value="${escapeHtml(currentBanner)}">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button id="save-profile-btn" type="button" class="btn btn-warning">Save</button>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    el.innerHTML = `
      ${renderProfileHeader(profile, isOwnProfile)}
      ${editButtonHtml}

      <h5 class="fw-bold border-bottom pb-2 mb-3">Listings (${listings.length})</h5>
      ${listingsHtml}

      ${bidsSection}
      ${editModalHtml}
    `;

    const saveBtn = document.getElementById("save-profile-btn");

    if (saveBtn) {
      saveBtn.addEventListener("click", async function () {
        const bioInput = document.getElementById("edit-bio");
        const avatarInput = document.getElementById("edit-avatar");
        const bannerInput = document.getElementById("edit-banner");

        if (!bioInput || !avatarInput || !bannerInput) return;

        try {
          await updateProfile(
            profile.name,
            (bioInput as HTMLTextAreaElement).value,
            (avatarInput as HTMLInputElement).value.trim(),
            (bannerInput as HTMLInputElement).value.trim()
          );

          window.location.reload();
        } catch (err) {
          let message = "Could not save profile.";
          if (err instanceof Error) {
            message = err.message;
          }
          showError("edit-message", message);
        }
      });
    }
  } catch (err) {
    let message = "Could not load profile.";
    if (err instanceof Error) {
      message = err.message;
    }
    el.innerHTML = '<div class="alert alert-danger">' + message + "</div>";
  }
}
