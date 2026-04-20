import { getListings } from "../api/listings";
import { renderListingCard } from "../ui/renderListingCard";

async function loadListings() {
  const listingGrid = document.querySelector("#listingGrid");

  if (!listingGrid) return;

  try {
    const listings = await getListings();

    listingGrid.innerHTML = "";

    for (const listing of listings) {
      listingGrid.innerHTML += renderListingCard(listing);
    }

  } catch (error) {
    console.error("Error loading listings:", error);
    listingGrid.innerHTML = "<p>Could not load listings</p>";
  }
}

loadListings();