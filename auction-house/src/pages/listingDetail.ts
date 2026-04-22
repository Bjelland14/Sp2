import { getListingById } from "../api/listings";

console.log("Listing detail page loaded");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

async function loadListingDetail() {
  const listingDetail = document.querySelector("#listingDetail");

  if (!(listingDetail instanceof HTMLElement)) return;

  if (!id) {
    listingDetail.innerHTML = "<p>Listing ID is missing.</p>";
    return;
  }

  try {
    const listing = await getListingById(id);

    const media = listing.media ?? [];

    const imagesHtml = media.length
      ? media
          .map((image: any) => {
            const src =
              image?.url?.replace(/\/$/, "") ||
              image?.replace?.(/\/$/, "") ||
              "https://placehold.co/600x400";

            return `
              <div class="col-12 col-md-6">
                <img
                  src="${src}"
                  alt="${listing.title}"
                  class="img-fluid rounded"
                  style="width: 100%; height: 300px; object-fit: cover;"
                  onerror="this.src='https://placehold.co/600x400';"
                />
              </div>
            `;
          })
          .join("")
      : `
        <div class="col-12">
          <img
            src="https://placehold.co/600x400"
            class="img-fluid rounded"
          />
        </div>
      `;

    listingDetail.innerHTML = `
      <div class="card shadow-sm border-0 p-4">
        <h1 class="h2 mb-3">${listing.title}</h1>

        <p class="text-muted">
          <strong>Ends at:</strong> ${listing.endsAt ?? "No deadline"}
        </p>

        <p class="mb-4">
          ${listing.description ?? "No description"}
        </p>

        <div class="row g-3">
          ${imagesHtml}
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error loading listing detail:", error);
    listingDetail.innerHTML = "<p>Could not load listing details.</p>";
  }
}

loadListingDetail();