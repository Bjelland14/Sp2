import { mountNav } from "../components/nav";
import { mountFooter } from "../components/footer";
import { requireAuth } from "../utils/auth-guard";
import { getListing, updateListing } from "../api/listings";
import { getUser } from "../utils/storage";
import { getParam } from "../utils/url";
import { toast } from "../components/toast";
import type { Listing, Media } from "../types";

mountNav();
mountFooter();
requireAuth();

const id = getParam("id");
if (!id) window.location.href = "/";

const appEl = document.getElementById("app")!;
let mediaItems: Media[] = [];

async function load(): Promise<void> {
  appEl.innerHTML = `<div class="flex justify-center py-20"><div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>`;

  try {
    const res = await getListing(id!);
    const listing = res.data;

    if (listing.seller?.name !== getUser()?.name) {
      toast("You do not own this listing", "error");
      setTimeout(() => (window.location.href = "/"), 1500);
      return;
    }

    mediaItems = listing.media ?? [];
    renderForm(listing);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load";
    appEl.innerHTML = `<div class="text-center py-20"><p class="text-red-500">${msg}</p></div>`;
  }
}

function renderForm(listing: Listing): void {
  const tagsStr = (listing.tags ?? []).join(", ");

  appEl.innerHTML = `
    <div class="max-w-2xl mx-auto px-4 py-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">Edit Listing</h1>
      <form id="edit-form" class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input id="edit-title" name="title" type="text" value="${listing.title}"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea id="edit-description" name="description" rows="4"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-y">${listing.description ?? ""}</textarea>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
          <input id="edit-tags" name="tags" type="text" value="${tagsStr}"
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            placeholder="vintage, electronics, rare">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Images</label>
          <div id="media-list" class="space-y-2 mb-3"></div>
          <div class="flex gap-2">
            <input id="media-url" type="url" placeholder="Image URL"
              class="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <input id="media-alt" type="text" placeholder="Alt text"
              class="w-32 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <button type="button" id="add-media-btn"
              class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              Add
            </button>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <a href="/listing.html?id=${id}"
            class="flex-1 text-center px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </a>
          <button type="submit" id="submit-btn"
            class="flex-1 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  `;

  renderMedia();

  document.getElementById("add-media-btn")?.addEventListener("click", () => {
    const url = (document.getElementById("media-url") as HTMLInputElement).value.trim();
    if (!url) { toast("Please enter an image URL", "warning"); return; }
    try { new URL(url); } catch { toast("Invalid URL", "error"); return; }
    const alt = (document.getElementById("media-alt") as HTMLInputElement).value.trim();
    mediaItems.push({ url, alt });
    (document.getElementById("media-url") as HTMLInputElement).value = "";
    (document.getElementById("media-alt") as HTMLInputElement).value = "";
    renderMedia();
  });

  (document.getElementById("edit-form") as HTMLFormElement | null)?.addEventListener("submit", async (e: Event) => {
    e.preventDefault();
    const title = (document.getElementById("edit-title") as HTMLInputElement).value.trim();
    const description = (document.getElementById("edit-description") as HTMLTextAreaElement).value.trim();
    const tagsRaw = (document.getElementById("edit-tags") as HTMLInputElement).value.trim();

    if (!title) { toast("Title is required", "error"); return; }

    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const btn = document.getElementById("submit-btn") as HTMLButtonElement;
    btn.disabled = true;
    btn.textContent = "Saving...";

    try {
      await updateListing(id!, {
        title,
        description: description || undefined,
        tags: tags.length ? tags : undefined,
        media: mediaItems.length ? mediaItems : undefined,
      });
      toast("Listing updated!", "success", 2000);
      setTimeout(() => (window.location.href = `/listing.html?id=${id}`), 800);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Failed to update", "error");
      btn.disabled = false;
      btn.textContent = "Save Changes";
    }
  });
}

function renderMedia(): void {
  const mediaList = document.getElementById("media-list");
  if (!mediaList) return;
  if (mediaItems.length === 0) {
    mediaList.innerHTML = `<p class="text-xs text-gray-400 italic">No images added</p>`;
    return;
  }
  mediaList.innerHTML = mediaItems
    .map(
      (item, i) => `
    <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
      <img src="${item.url}" alt="${item.alt}" class="w-12 h-12 rounded-lg object-cover bg-gray-200" onerror="this.style.opacity='0.3'">
      <div class="flex-1 min-w-0">
        <p class="text-xs text-gray-700 truncate">${item.url}</p>
        <p class="text-xs text-gray-400">${item.alt || "No alt text"}</p>
      </div>
      <button type="button" data-index="${i}" class="remove-media text-red-400 hover:text-red-600 p-1">
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>`
    )
    .join("");

  mediaList.querySelectorAll<HTMLButtonElement>(".remove-media").forEach((btn) => {
    btn.addEventListener("click", () => {
      mediaItems.splice(parseInt(btn.dataset.index ?? "0", 10), 1);
      renderMedia();
    });
  });
}

void load();
