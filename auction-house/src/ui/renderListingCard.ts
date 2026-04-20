export function renderListingCard(listing: any) {
  return `
    <div class="col-md-4">
      <div class="card h-100">
        <div class="card-body">
          <h5 class="card-title">${listing.title}</h5>
          <p class="card-text">
            ${listing.description ?? "No description"}
          </p>
        </div>
      </div>
    </div>
  `;
}