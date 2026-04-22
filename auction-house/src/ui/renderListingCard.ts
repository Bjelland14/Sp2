export function renderListingCard(listing: any) {
  const image =
    listing.media?.[0]?.url?.replace(/\/$/, "") ||
    listing.media?.[0]?.replace(/\/$/, "") ||
    "https://placehold.co/300x200";

  return `
    <div class="col-12 col-md-6 col-lg-4">
      <a href="/listing.html?id=${listing.id}" class="text-decoration-none text-dark">
        <div class="card h-100 shadow-sm">

          <img 
            src="${image}" 
            class="card-img-top" 
            alt="${listing.title}"
            style="height: 200px; object-fit: cover;"
            onerror="this.src='https://placehold.co/300x200';"
          />

          <div class="card-body d-flex flex-column">
            <h5 class="card-title">${listing.title}</h5>

            <p class="card-text text-muted">
              ${listing.description ?? "No description"}
            </p>

            <div class="mt-auto">
              <span class="text-primary fw-semibold">
                View listing
              </span>
            </div>
          </div>

        </div>
      </a>
    </div>
  `;
}