import { setupNav } from "../index";
import { requireLogin } from "../utils/authGuard";
import { getListing } from "../api/listings";
import { setupListingForm } from "../events/listingEvents";

requireLogin();
setupNav();

const params = new URLSearchParams(window.location.search);
const editId = params.get("edit");

if (editId) {
  const pageTitle = document.getElementById("page-title");
  const submitText = document.getElementById("submit-text");

  if (pageTitle) pageTitle.textContent = "Edit Listing";
  if (submitText) submitText.textContent = "Save changes";

  prefillForm(editId);
}

setupListingForm(editId);

async function prefillForm(id: string) {
  try {
    const listing = await getListing(id);

    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");
    const endsAtInput = document.getElementById("ends-at");
    const tagsInput = document.getElementById("tags");
    const imageList = document.getElementById("image-list");

    if (!titleInput || !descriptionInput || !endsAtInput || !tagsInput || !imageList) return;

    (titleInput as HTMLInputElement).value = listing.title;
    (descriptionInput as HTMLTextAreaElement).value = listing.description || "";
    (endsAtInput as HTMLInputElement).value = listing.endsAt.slice(0, 16);

    if (listing.tags && listing.tags.length > 0) {
      (tagsInput as HTMLInputElement).value = listing.tags.join(", ");
    }

    if (listing.media && listing.media.length > 0) {
      const existingRows = imageList.querySelectorAll(".image-row");

      for (let i = 0; i < listing.media.length; i++) {
        const img = listing.media[i];

        if (i === 0 && existingRows[0]) {
          const urlInput = existingRows[0].querySelector(".image-url");
          const altInput = existingRows[0].querySelector(".image-alt");

          if (urlInput) (urlInput as HTMLInputElement).value = img.url;
          if (altInput) (altInput as HTMLInputElement).value = img.alt || "";
        } else {
          const row = createImageRow(img.url, img.alt || "");
          imageList.appendChild(row);
        }
      }
    }
  } catch {
    alert("Could not load listing for editing.");
  }
}

function createImageRow(url: string, alt: string) {
  const row = document.createElement("div");
  row.className = "image-row row g-2 mb-2 align-items-center";

  const urlCol = document.createElement("div");
  urlCol.className = "col";

  const urlInput = document.createElement("input");
  urlInput.type = "url";
  urlInput.className = "form-control image-url";
  urlInput.value = url;

  urlCol.appendChild(urlInput);

  const altCol = document.createElement("div");
  altCol.className = "col";

  const altInput = document.createElement("input");
  altInput.type = "text";
  altInput.className = "form-control image-alt";
  altInput.value = alt;

  altCol.appendChild(altInput);

  const btnCol = document.createElement("div");
  btnCol.className = "col-auto";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "btn btn-outline-danger btn-sm";
  removeBtn.innerHTML = '<i class="bi bi-trash"></i>';

  removeBtn.addEventListener("click", function () {
    row.remove();
  });

  btnCol.appendChild(removeBtn);

  row.appendChild(urlCol);
  row.appendChild(altCol);
  row.appendChild(btnCol);

  return row;
}
