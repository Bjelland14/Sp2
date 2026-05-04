import { placeBid } from "../api/bids";
import { getProfile } from "../api/profile";
import { getUserName, saveCredits } from "../utils/storage";
import { showError, showSuccess, hideMessage } from "../ui/showMessage";

export function setupBidForm(listingId: string) {
  const btn = document.getElementById("bid-btn");
  const input = document.getElementById("bid-amount");

  if (!btn || !input) return;

  btn.addEventListener("click", async function () {
    hideMessage("bid-message");

    const amount = Number((input as HTMLInputElement).value);

    if (!amount || amount <= 0) {
      showError("bid-message", "Please enter a valid amount.");
      return;
    }

    (btn as HTMLButtonElement).disabled = true;
    btn.textContent = "Placing bid...";

    try {
      await placeBid(listingId, amount);

      const userName = getUserName();

      if (userName) {
        const profile = await getProfile(userName);
        saveCredits(profile.credits);
      }

      showSuccess("bid-message", "Bid of " + amount + " credits placed!");

      setTimeout(function () {
        window.location.reload();
      }, 1500);
    } catch (err) {
      let message = "Could not place bid.";
      if (err instanceof Error) {
        message = err.message;
      }

      showError("bid-message", message);
      (btn as HTMLButtonElement).disabled = false;
      btn.textContent = "Place bid";
    }
  });
}