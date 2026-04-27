import { authGuard } from "../utils/authGuard";
import { createListing } from "../api/listings";
import { getToken, getApiKey } from "../utils/storage";

const form = document.querySelector("#createListingForm");

if (form) {
  authGuard();

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get auth data
    const token = getToken();
    const apiKey = getApiKey();

    if (!token || !apiKey) {
      alert("You must be logged in.");
      return;
    }

    // Get form values
    const title = (document.querySelector("#title") as HTMLInputElement).value.trim();
    const description = (document.querySelector("#description") as HTMLTextAreaElement).value.trim();
    const deadline = (document.querySelector("#deadline") as HTMLInputElement).value;

    // Collect image URLs
    const mediaInputs = [
      (document.querySelector("#image1") as HTMLInputElement).value,
      (document.querySelector("#image2") as HTMLInputElement).value,
      (document.querySelector("#image3") as HTMLInputElement).value,
      (document.querySelector("#image4") as HTMLInputElement).value,
      (document.querySelector("#image5") as HTMLInputElement).value,
      (document.querySelector("#image6") as HTMLInputElement).value,
      (document.querySelector("#image7") as HTMLInputElement).value,
      (document.querySelector("#image8") as HTMLInputElement).value,
      (document.querySelector("#image9") as HTMLInputElement).value,
      (document.querySelector("#image10") as HTMLInputElement).value,
    ];

    // Filter empty inputs and convert to API format
    const media = mediaInputs
      .filter((url) => url.trim() !== "")
      .map((url) => {
        return {
          url: url.trim(),
          alt: title,
        };
      });

    // Validate minimum images
    if (media.length < 5) {
      alert("You must add at least 5 images.");
      return;
    }

    try {
      // Send request
      const listing = await createListing(
        {
          title,
          description,
          endsAt: new Date(deadline).toISOString(),
          media,
        },
        token,
        apiKey
      );

      // Redirect to listing page
      window.location.href = `listing.html?id=${listing.id}`;
    } catch (error) {
      console.error(error);
      alert("Could not create listing.");
    }
  });
}