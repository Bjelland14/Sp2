import { authGuard } from "../utils/authGuard";
import { createListing } from "../api/listings";

authGuard();

console.log("Create page loaded");

const form = document.querySelector("#createListingForm");

if (form instanceof HTMLFormElement) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log("Form submitted");

    const title = (document.querySelector("#title") as HTMLInputElement).value.trim();
    const description = (document.querySelector("#description") as HTMLTextAreaElement).value.trim();
    const deadline = (document.querySelector("#deadline") as HTMLInputElement).value;

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

    const media = mediaInputs.filter((url) => url.trim() !== "");

    if (media.length < 5) {
      alert("You must add at least 5 images.");
      return;
    }

    if (media.length > 10) {
      alert("You can add a maximum of 10 images.");
      return;
    }

    try {
      const newListing = await createListing({
        title,
        description,
        endsAt: deadline,
        media,
      });

      console.log("Created listing:", newListing);
      alert("Listing created successfully!");
      window.location.href = "/index.html";
    } catch (error) {
      console.error("Error creating listing:", error);
      alert("Could not create listing.");
    }
  });
}