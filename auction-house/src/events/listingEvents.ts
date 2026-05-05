import { getListings, createListing, updateListing, deleteListing } from "../api/listings";
import { renderListingCard } from "../ui/renderListingCard";
import { showError } from "../ui/showMessage";

let currentPage = 1;
let currentSearch = "";
let currentTag = "";

export function setupBrowse() {
  const searchBtn = document.getElementById("search-btn");
  const searchInput = document.getElementById("search-input");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const tagButtons = document.querySelectorAll(".tag-filter");

  if (!searchBtn || !searchInput || !prevBtn || !nextBtn) return;

  searchBtn.addEventListener("click", function () {
    currentSearch = (searchInput as HTMLInputElement).value.trim();
    currentTag = "";
    currentPage = 1;

    for (let i = 0; i < tagButtons.length; i++) {
      tagButtons[i].classList.remove("active");
    }

    const allBtn = document.querySelector('.tag-filter[data-tag=""]');
    if (allBtn) {
      allBtn.classList.add("active");
    }

    loadListings();
  });

  searchInput.addEventListener("keydown", function (e) {
    if ((e as KeyboardEvent).key === "Enter") {
      (searchBtn as HTMLButtonElement).click();
    }
  });

  for (let i = 0; i < tagButtons.length; i++) {
    const btn = tagButtons[i];

    btn.addEventListener("click", function () {
      currentTag = (btn as HTMLButtonElement).dataset.tag || "";
      currentSearch = "";
      (searchInput as HTMLInputElement).value = "";
      currentPage = 1;

      for (let j = 0; j < tagButtons.length; j++) {
        tagButtons[j].classList.remove("active");
      }

      btn.classList.add("active");
      loadListings();
    });
  }

  prevBtn.addEventListener("click", function () {
    if (currentPage > 1) {
      currentPage--;
      loadListings();
    }
  });

  nextBtn.addEventListener("click", function () {
    currentPage++;
    loadListings();
  });

  loadListings();
}

async function loadListings() {
  const grid = document.getElementById("listings-grid");
  const pageInfo = document.getElementById("page-info");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");

  if (!grid || !pageInfo || !prevBtn || !nextBtn) return;

  grid.innerHTML = `
    <div class="col-12 text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>
  `;

  try {
    const result = await getListings(currentPage, currentSearch, currentTag);
    const listings = result.data;
    const meta = result.meta;

    if (listings.length === 0) {
      grid.innerHTML = '<div class="col-12 text-center py-5 text-muted">No listings found.</div>';
      return;
    }

    let cards = "";

    for (let i = 0; i < listings.length; i++) {
      cards += renderListingCard(listings[i]);
    }

    grid.innerHTML = cards;

    if (meta) {
      pageInfo.textContent = "Page " + meta.currentPage + " of " + meta.pageCount;
      (prevBtn as HTMLButtonElement).disabled = meta.isFirstPage;
      (nextBtn as HTMLButtonElement).disabled = meta.isLastPage;
    }
  } catch (err) {
    let message = "Could not load listings.";
    if (err instanceof Error) {
      message = err.message;
    }
    grid.innerHTML = '<div class="col-12 text-center py-5 text-danger">' + message + "</div>";
  }
}

export function setupListingForm(editId: string | null) {
  const form = document.getElementById("listing-form");
  const addImageBtn = document.getElementById("add-image-btn");
  const imageList = document.getElementById("image-list");

  if (!form || !addImageBtn || !imageList) return;

  addImageBtn.addEventListener("click", function () {
    const row = document.createElement("div");
    row.className = "image-row row g-2 mb-2 align-items-center";

    row.innerHTML = `
      <div class="col">
        <input type="url" class="form-control image-url" placeholder="https://example.com/image.jpg">
      </div>
      <div class="col">
        <input type="text" class="form-control image-alt" placeholder="Image description">
      </div>
      <div class="col-auto">
        <button type="button" class="btn btn-outline-danger btn-sm remove-image-btn">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;

    const removeBtn = row.querySelector(".remove-image-btn");

    if (removeBtn) {
      removeBtn.addEventListener("click", function () {
        row.remove();
      });
    }

    imageList.appendChild(row);
  });

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const endsAtInput = document.getElementById("ends-at");
    const tagsInput = document.getElementById("tags");
    const submitBtn = form.querySelector("button[type=submit]");

    if (!titleInput || !descriptionInput || !endsAtInput || !tagsInput || !submitBtn) return;

    const title = (titleInput as HTMLInputElement).value.trim();
    const description = (descriptionInput as HTMLTextAreaElement).value.trim();
    const endsAt = (endsAtInput as HTMLInputElement).value;
    const tagsRaw = (tagsInput as HTMLInputElement).value.trim();

    if (!title) {
      showError("form-message", "Please enter a title.");
      return;
    }

    if (!editId && !endsAt) {
      showError("form-message", "Please choose an auction deadline.");
      return;
    }

    if (!editId && new Date(endsAt) <= new Date()) {
      showError("form-message", "Deadline must be in the future.");
      return;
    }

    const tags = [];

    if (tagsRaw) {
      const parts = tagsRaw.split(",");

      for (let i = 0; i < parts.length; i++) {
        const tag = parts[i].trim();
        if (tag) {
          tags.push(tag);
        }
      }
    }

    const media = [];
    const rows = imageList.querySelectorAll(".image-row");

    for (let i = 0; i < rows.length; i++) {
      const urlInput = rows[i].querySelector(".image-url");
      const altInput = rows[i].querySelector(".image-alt");

      const url = urlInput ? (urlInput as HTMLInputElement).value.trim() : "";
      const alt = altInput ? (altInput as HTMLInputElement).value.trim() : "";

      if (url) {
        media.push({ url, alt: alt || title });
      }
    }

    (submitBtn as HTMLButtonElement).disabled = true;

    try {
      if (editId) {
        await updateListing(editId, title, description, media, tags);
      } else {
        const isoDate = new Date(endsAt).toISOString();
        await createListing(title, description, isoDate, media, tags);
      }

      window.location.href = "/index.html";
    } catch (err) {
      let message = "Could not save listing.";
      if (err instanceof Error) {
        message = err.message;
      }
      showError("form-message", message);
      (submitBtn as HTMLButtonElement).disabled = false;
    }
  });
}

export function setupDeleteButton(listingId: string) {
  const btn = document.getElementById("delete-btn");
  if (!btn) return;

  btn.addEventListener("click", async function () {
    const confirmed = confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    (btn as HTMLButtonElement).disabled = true;

    try {
      await deleteListing(listingId);
      window.location.href = "/index.html";
    } catch (err) {
      let message = "Could not delete listing.";
      if (err instanceof Error) {
        message = err.message;
      }
      alert("Could not delete: " + message);
      (btn as HTMLButtonElement).disabled = false;
    }
  });
}