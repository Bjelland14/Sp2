export function renderListingCard(listing: any) {
  const image = listing.media?.[0]?.url || listing.media?.[0] || "https://via.placeholder.com/300";

  return `
    <div class="col-md-4">
      <a href="/listing.html?id=${listing.id}" class="text-decoration-none text-dark">
        <div class="card h-100">
          <img src="${image}" class="card-img-top" alt="${listing.title}" />
          <div class="card-body">
            <h5 class="card-title">${listing.title}</h5>
            <p class="card-text">${listing.description ?? "No description"}</p>
          </div>
        </div>
      </a>
    </div>
  `;
}