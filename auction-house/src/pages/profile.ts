import { mountNav } from "../components/nav";
import { mountFooter } from "../components/footer";
import {
  getProfile,
  getProfileListings,
  getProfileBids,
  getProfileWins,
  updateProfile,
} from "../api/profiles";
import { getParam } from "../utils/url";
import { isLoggedIn, getUser, setUser } from "../utils/storage";
import { listingCardHTML } from "../components/listingCard";
import { toast } from "../components/toast";
import { formatDate } from "../utils/time";
import type { User, Listing, Bid } from "../types";

mountNav();
mountFooter();

const username = getParam("user") ?? getUser()?.name ?? null;
if (!username) window.location.href = "/auth/login.html";

const isOwnProfile = isLoggedIn() && getUser()?.name === username;
const appEl = document.getElementById("app")!;

async function load(): Promise<void> {
  appEl.innerHTML = `<div class="flex justify-center py-20"><div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>`;

  try {
    const [profileRes, listingsRes] = await Promise.all([
      getProfile(username!),
      getProfileListings(username!),
    ]);
    render(profileRes.data, listingsRes.data ?? []);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load profile";
    appEl.innerHTML = `<div class="text-center py-20"><p class="text-red-500">${msg}</p></div>`;
  }
}

function render(profile: User, listings: Listing[]): void {
  const { name, email, avatar, banner, bio, credits = 0, _count } = profile;
  const bannerUrl = banner?.url ?? "";

  appEl.innerHTML = `
    <div class="relative">
      <div class="h-40 sm:h-52 bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden">
        ${bannerUrl ? `<img src="${bannerUrl}" alt="banner" class="w-full h-full object-cover opacity-60">` : ""}
      </div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end gap-4 -mt-12 pb-4">
          <img src="${avatar?.url ?? "https://placehold.co/96x96/e0e7ff/4f46e5?text=" + name[0].toUpperCase()}"
            alt="${name}" class="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-4 border-white shadow-md object-cover bg-white">
          <div class="pb-1 flex-1 min-w-0">
            <h1 class="text-xl sm:text-2xl font-bold text-gray-900">${name}</h1>
            ${email ? `<p class="text-sm text-gray-500">${email}</p>` : ""}
          </div>
          ${isOwnProfile ? `
            <button id="edit-profile-btn"
              class="pb-1 shrink-0 px-4 py-2 border border-indigo-200 text-indigo-700 rounded-xl text-sm font-medium hover:bg-indigo-50 transition-colors">
              Edit Profile
            </button>
          ` : ""}
        </div>
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        ${isOwnProfile ? `
          <div class="bg-amber-50 border border-amber-100 rounded-2xl p-4 text-center">
            <p class="text-2xl font-bold text-amber-600">${credits.toLocaleString()}</p>
            <p class="text-xs text-amber-700 mt-1">Credits</p>
          </div>
        ` : ""}
        <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 text-center">
          <p class="text-2xl font-bold text-indigo-600">${_count?.listings ?? listings.length}</p>
          <p class="text-xs text-indigo-700 mt-1">Listings</p>
        </div>
        <div class="bg-purple-50 border border-purple-100 rounded-2xl p-4 text-center">
          <p class="text-2xl font-bold text-purple-600">${_count?.wins ?? 0}</p>
          <p class="text-xs text-purple-700 mt-1">Won</p>
        </div>
        <div class="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
          <p class="text-2xl font-bold text-green-600">${_count?.bids ?? 0}</p>
          <p class="text-xs text-green-700 mt-1">Bids</p>
        </div>
      </div>

      ${bio ? `<p class="text-gray-600 text-sm leading-relaxed mb-8 max-w-2xl">${bio}</p>` : ""}

      <div class="border-b border-gray-200 mb-6">
        <nav class="flex gap-6 -mb-px">
          <button class="tab-btn pb-3 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600" data-tab="listings">Listings</button>
          ${isOwnProfile ? `
            <button class="tab-btn pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent" data-tab="bids">My Bids</button>
            <button class="tab-btn pb-3 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent" data-tab="wins">Won</button>
          ` : ""}
        </nav>
      </div>

      <div id="tab-content">
        ${listings.length > 0
          ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">${listings.map(listingCardHTML).join("")}</div>`
          : `<div class="text-center py-16 text-gray-400 text-sm">No listings yet</div>`}
      </div>
    </div>

    <!-- Edit modal -->
    <div id="edit-modal" class="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg font-bold text-gray-900">Edit Profile</h2>
          <button id="close-modal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <form id="edit-profile-form" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea id="ep-bio" rows="3"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              placeholder="Tell others about yourself...">${bio ?? ""}</textarea>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input id="ep-avatar" type="url"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value="${avatar?.url ?? ""}" placeholder="https://...">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Banner URL</label>
            <input id="ep-banner" type="url"
              class="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value="${bannerUrl}" placeholder="https://...">
          </div>
          <div class="flex gap-3 pt-1">
            <button type="button" id="cancel-edit"
              class="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" id="save-profile-btn"
              class="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  // Tabs
  document.querySelectorAll<HTMLButtonElement>(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".tab-btn").forEach((b) => {
        b.classList.remove("text-indigo-600", "border-indigo-600");
        b.classList.add("text-gray-500", "border-transparent");
      });
      btn.classList.add("text-indigo-600", "border-indigo-600");
      btn.classList.remove("text-gray-500", "border-transparent");
      await loadTab(btn.dataset.tab ?? "listings");
    });
  });

  // Modal
  const modal = document.getElementById("edit-modal");
  document.getElementById("edit-profile-btn")?.addEventListener("click", () => modal?.classList.remove("hidden"));
  document.getElementById("close-modal")?.addEventListener("click", () => modal?.classList.add("hidden"));
  document.getElementById("cancel-edit")?.addEventListener("click", () => modal?.classList.add("hidden"));
  modal?.addEventListener("click", (e) => { if (e.target === modal) modal.classList.add("hidden"); });

  (document.getElementById("edit-profile-form") as HTMLFormElement | null)?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const newBio = (document.getElementById("ep-bio") as HTMLTextAreaElement).value.trim();
    const newAvatarUrl = (document.getElementById("ep-avatar") as HTMLInputElement).value.trim();
    const newBannerUrl = (document.getElementById("ep-banner") as HTMLInputElement).value.trim();
    const btn = document.getElementById("save-profile-btn") as HTMLButtonElement;

    btn.disabled = true;
    btn.textContent = "Saving...";

    try {
      const res = await updateProfile(name, {
        bio: newBio || undefined,
        avatar: newAvatarUrl ? { url: newAvatarUrl, alt: `${name}'s avatar` } : undefined,
        banner: newBannerUrl ? { url: newBannerUrl, alt: `${name}'s banner` } : undefined,
      });
      const updated = res.data;
      const currentUser = getUser();
      if (currentUser) setUser({ ...currentUser, avatar: updated.avatar, banner: updated.banner });
      toast("Profile updated!", "success");
      setTimeout(() => location.reload(), 800);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update", "error");
      btn.disabled = false;
      btn.textContent = "Save";
    }
  });
}

async function loadTab(tab: string): Promise<void> {
  const content = document.getElementById("tab-content")!;
  content.innerHTML = `<div class="flex justify-center py-10"><div class="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>`;

  try {
    if (tab === "listings") {
      const res = await getProfileListings(username!);
      const items: Listing[] = res.data ?? [];
      content.innerHTML =
        items.length > 0
          ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">${items.map(listingCardHTML).join("")}</div>`
          : `<div class="text-center py-16 text-gray-400 text-sm">No listings yet</div>`;
    } else if (tab === "bids") {
      const res = await getProfileBids(username!);
      const bids: Bid[] = res.data ?? [];
      if (bids.length === 0) {
        content.innerHTML = `<div class="text-center py-16 text-gray-400 text-sm">No bids placed yet</div>`;
        return;
      }
      content.innerHTML = `
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table class="w-full bid-table">
            <thead class="bg-gray-50 border-b border-gray-100">
              <tr>
                <th class="text-left text-xs font-semibold text-gray-500 uppercase">Listing</th>
                <th class="text-right text-xs font-semibold text-gray-500 uppercase">Amount</th>
                <th class="text-right text-xs font-semibold text-gray-500 uppercase">Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              ${bids.map((bid) => `
                <tr>
                  <td>${bid.listing
                    ? `<a href="/listing.html?id=${bid.listing.id}" class="text-sm text-indigo-600 hover:underline font-medium">${bid.listing.title}</a>`
                    : `<span class="text-sm text-gray-500">Unknown listing</span>`
                  }</td>
                  <td class="text-right text-sm font-bold text-indigo-600">${bid.amount.toLocaleString()} cr</td>
                  <td class="text-right text-xs text-gray-400">${formatDate(bid.created)}</td>
                </tr>`).join("")}
            </tbody>
          </table>
        </div>
      `;
    } else if (tab === "wins") {
      const res = await getProfileWins(username!);
      const wins: Listing[] = res.data ?? [];
      content.innerHTML =
        wins.length > 0
          ? `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">${wins.map(listingCardHTML).join("")}</div>`
          : `<div class="text-center py-16 text-gray-400 text-sm">No wins yet. Keep bidding!</div>`;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    content.innerHTML = `<div class="text-center py-10"><p class="text-red-500 text-sm">${msg}</p></div>`;
  }
}

void load();
