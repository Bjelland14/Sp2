import { getListingById } from "../api/listings";

console.log("Listing detail page loaded");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

console.log("Listing ID:", id);

async function loadListingDetail() {
  const listingDetail = document.querySelector("#listingDetail");

  if (!(listingDetail instanceof HTMLElement)) return;

  if (!id) {
    listingDetail.innerHTML = "<p>Listing ID is missing.</p>";
    return;
  }

  try {
    const listing = await getListingById(id);
    console.log("Listing:", listing);

    listingDetail.innerHTML = `
      <div class="card shadow-sm border-0 p-4">
        <h1 class="h2 mb-3">${listing.title}</h1>
        <p class="text-muted">${listing.description ?? "No description available."}</p>
      </div>
    `;
  } catch (error) {
    console.error("Error loading listing detail:", error);
    listingDetail.innerHTML = "<p>Could not load listing details.</p>";
  }
}

loadListingDetail();