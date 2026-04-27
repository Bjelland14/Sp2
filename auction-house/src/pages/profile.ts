import { authGuard } from "../utils/authGuard";
import { getUser, getToken, getApiKey, setUser } from "../utils/storage";
import {
  getProfile,
  getProfileListings,
  getProfileBids,
  updateProfile,
} from "../api/profile";

authGuard();

const profileContainer =
  document.querySelector<HTMLDivElement>("#profileContainer");

if (profileContainer) {
  loadProfilePage();
}

async function loadProfilePage() {
  const user = getUser();
  const token = getToken();
  const apiKey = getApiKey();

  if (!user || !token || !apiKey || !profileContainer) {
    return;
  }

  try {
    const profile = await getProfile(user.name, token, apiKey);
    const listings = await getProfileListings(user.name, token, apiKey);
    const bids = await getProfileBids(user.name, token, apiKey);

    setUser(profile);

    renderProfile(profile, listings, bids);
  } catch (error) {
    console.error(error);

    profileContainer.innerHTML = `
      <div class="alert alert-danger">
        Could not load profile
      </div>
    `;
  }
}

function renderProfile(profile: any, listings: any[], bids: any[]) {
  if (!profileContainer) return;

  const credits = profile.credits ?? 0;

  profileContainer.innerHTML = `
    <section class="card p-4 mb-4">
      <img
        src="${profile.banner?.url || "https://placehold.co/800x200"}"
        style="height:200px;object-fit:cover;"
        class="mb-3 w-100"
      />

      <div class="d-flex gap-3 align-items-center">
        <img
          src="${profile.avatar?.url || "https://placehold.co/150"}"
          class="rounded-circle"
          width="100"
          height="100"
        />

        <div>
          <h2>${profile.name}</h2>
          <p>${profile.bio || "No bio yet"}</p>
          <p><strong>Credits:</strong> ${credits}</p>

          <button id="editBtn" class="btn btn-outline-primary btn-sm">
            Edit profile
          </button>
        </div>
      </div>
    </section>

    <section id="editSection" class="card p-4 mb-4 d-none">
      <form id="editForm">
        <textarea id="bio" class="form-control mb-2" placeholder="Bio">${profile.bio || ""}</textarea>
        <input id="avatar" class="form-control mb-2" placeholder="Avatar URL" value="${profile.avatar?.url || ""}">
        <input id="banner" class="form-control mb-2" placeholder="Banner URL" value="${profile.banner?.url || ""}">
        <button class="btn btn-primary">Save</button>
      </form>
    </section>

    <section class="mb-4">
      <h3>My listings</h3>
      ${
        listings.length === 0
          ? "<p>No listings yet</p>"
          : listings
              .map(
                (l) => `
        <div class="card mb-2 p-2">
          ${l.title}
        </div>`
              )
              .join("")
      }
    </section>

    <section>
      <h3>Bids</h3>
      ${
        bids.length === 0
          ? "<p>No bids yet</p>"
          : bids
              .map(
                (b) => `
        <div class="card mb-2 p-2">
          ${b.listing?.title} - ${b.amount}
        </div>`
              )
              .join("")
      }
    </section>
  `;

  // 🔧 enkel edit logikk
  const editBtn = document.querySelector("#editBtn");
  const editSection = document.querySelector("#editSection");
  const form = document.querySelector("#editForm");

  editBtn?.addEventListener("click", () => {
    editSection?.classList.toggle("d-none");
  });

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = getUser();
    const token = getToken();
    const apiKey = getApiKey();

    if (!user || !token || !apiKey) return;

    const bio = (document.querySelector("#bio") as HTMLTextAreaElement).value;
    const avatar = (document.querySelector("#avatar") as HTMLInputElement).value;
    const banner = (document.querySelector("#banner") as HTMLInputElement).value;

    try {
      await updateProfile(user.name, token, apiKey, {
        bio,
        avatar: { url: avatar },
        banner: { url: banner },
      });

      loadProfilePage();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  });
}