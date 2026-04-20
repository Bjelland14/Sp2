import { mountNav } from "../components/nav";
import { mountFooter } from "../components/footer";
import { requireAuth } from "../utils/auth-guard";
import { createListing } from "../api/listings";
import { toast } from "../components/toast";
import { clearAllErrors, showError } from "../utils/validation";
import type { Media } from "../types";

mountNav();
mountFooter();
requireAuth();

const form = document.getElementById("create-form") as HTMLFormElement | null;
const submitBtn = document.getElementById("submit-btn") as HTMLButtonElement | null;
const mediaList = document.getElementById("media-list");
const addMediaBtn = document.getElementById("add-media-btn") as HTMLButtonElement | null;
const mediaUrlInput = document.getElementById("media-url") as HTMLInputElement | null;
const mediaAltInput = document.getElementById("media-alt") as HTMLInputElement | null;

let mediaItems: Media[] = [];

function renderMedia(): void {
  if (!mediaList) return;
  if (mediaItems.length === 0) {
    mediaList.innerHTML = `<p class="text-xs text-gray-400 italic">No images added yet</p>`;
    return;
  }
  mediaList.innerHTML = mediaItems
    .map(
      (item, i) => `
    <div class="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
      <img src="${item.url}" alt="${item.alt}" class="w-12 h-12 rounded-lg object-cover bg-gray-200"
        onerror="this.style.opacity='0.3'">
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

addMediaBtn?.addEventListener("click", () => {
  const url = mediaUrlInput?.value.trim() ?? "";
  if (!url) { toast("Please enter an image URL", "warning"); return; }
  try { new URL(url); } catch { toast("Please enter a valid URL", "error"); return; }
  mediaItems.push({ url, alt: mediaAltInput?.value.trim() ?? "" });
  if (mediaUrlInput) mediaUrlInput.value = "";
  if (mediaAltInput) mediaAltInput.value = "";
  renderMedia();
});

// Set minimum deadline (1 hour from now)
const deadlineInput = document.getElementById("deadline") as HTMLInputElement | null;
if (deadlineInput) {
  const min = new Date(Date.now() + 3_600_000).toISOString().slice(0, 16);
  deadlineInput.min = min;
  deadlineInput.value = min;
}

form?.addEventListener("submit", async (e: Event) => {
  e.preventDefault();
  if (!form || !submitBtn) return;
  clearAllErrors(form);

  const titleInput = form.elements.namedItem("title") as HTMLInputElement;
  const descInput = form.elements.namedItem("description") as HTMLTextAreaElement | null;
  const tagsInput = form.elements.namedItem("tags") as HTMLInputElement | null;
  const deadline = (form.elements.namedItem("deadline") as HTMLInputElement | null)?.value ?? "";

  const title = titleInput.value.trim();
  const description = descInput?.value.trim() ?? "";
  const tagsRaw = tagsInput?.value.trim() ?? "";

  let valid = true;
  if (!title) { showError(titleInput, "Title is required"); valid = false; }
  if (title.length > 280) { showError(titleInput, "Title must be under 280 characters"); valid = false; }
  if (!deadline) { showError(deadlineInput!, "Deadline is required"); valid = false; }
  if (deadline && new Date(deadline) <= new Date()) {
    showError(deadlineInput!, "Deadline must be in the future");
    valid = false;
  }
  if (!valid) return;

  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];

  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    const res = await createListing({
      title,
      description: description || undefined,
      tags: tags.length ? tags : undefined,
      media: mediaItems.length ? mediaItems : undefined,
      endsAt: new Date(deadline).toISOString(),
    });
    toast("Listing created!", "success", 2000);
    setTimeout(() => (window.location.href = `/listing.html?id=${res.data.id}`), 800);
  } catch (err) {
    toast(err instanceof Error ? err.message : "Failed to create listing", "error");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Listing";
  }
});

renderMedia();
