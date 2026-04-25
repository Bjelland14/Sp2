import { authGuard } from "../utils/authGuard";
import { getUser } from "../utils/storage";

authGuard();

const profileContainer = document.querySelector<HTMLDivElement>("#profileContainer");

if (profileContainer) {
  renderProfile();
}

function renderProfile() {
  const user = getUser();

  if (!user || !profileContainer) {
    return;
  }

  const credits = user.credits ?? 0;
  const avatarUrl = user.avatar?.url;

  profileContainer.innerHTML = `
    <section class="card shadow-sm p-4">
      <div class="d-flex flex-column flex-md-row align-items-center gap-4">
        <img
          src="${avatarUrl || "https://placehold.co/150x150?text=User"}"
          alt="${user.name}"
          class="rounded-circle"
          width="150"
          height="150"
          style="object-fit: cover;"
        />

        <div>
          <h1 class="h3 mb-2">${user.name}</h1>
          <p class="text-muted mb-2">${user.email ?? ""}</p>
          <p class="fw-bold mb-0">Credits: ${credits.toLocaleString()}</p>
        </div>
      </div>
    </section>
  `;
}