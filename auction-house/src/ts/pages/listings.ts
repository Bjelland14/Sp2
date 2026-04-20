console.log ("listings page loaded");

import { getListings } from "../api/listings";

async function loadListings() {
    try {
        const listings = await getListings ();
        console.log (listings);
        } catch (error) {
          console.log("Error loading listings", error);
    }
}

loadListings ();