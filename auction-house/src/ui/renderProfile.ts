import { Profile } from "../types";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderProfileHeader(profile: Profile, isOwn: boolean) {
  let bannerUrl = "https://placehold.co/1200x200?text=+";

  if (profile.banner && profile.banner.url) {
    bannerUrl = profile.banner.url;
  }

  let avatarUrl = "https://placehold.co/100x100?text=?";

  if (profile.avatar && profile.avatar.url) {
    avatarUrl = profile.avatar.url;
  }

  let creditsHtml = "";

  if (isOwn) {
    creditsHtml = `
      <span class="badge bg-warning text-dark">
        <i class="bi bi-coin me-1"></i>${profile.credits} credits
      </span>
    `;
  }

  let bioHtml = "";

  if (profile.bio) {
    bioHtml = '<p class="text-muted">' + escapeHtml(profile.bio) + "</p>";
  }

  return `
    <img
      src="${escapeHtml(bannerUrl)}"
      alt="Profile banner"
      class="w-100 rounded mb-3"
      style="height: 200px; object-fit: cover;"
      onerror="this.src='https://placehold.co/1200x200?text=+'"
    >

<div class="d-flex align-items-end gap-3 mb-3" style="margin-top: -40px;">
    <img
        src="${escapeHtml(avatarUrl)}"
        alt="${escapeHtml(profile.name)}"
        class="rounded-circle border border-4 border-white shadow"
        style="width: 90px; height: 90px; object-fit: cover;"
        onerror="this.src='https://placehold.co/100x100?text=?'"
      >

      <div>
        <h3 class="fw-bold mb-0">${escapeHtml(profile.name)}</h3>
        ${creditsHtml}
      </div>
    </div>

    ${bioHtml}
  `;
}
