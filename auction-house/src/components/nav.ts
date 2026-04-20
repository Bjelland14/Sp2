import { isLoggedIn, getUser } from "../utils/storage";
import { logout } from "../../../src/api/auth";

export function mountNav(placeholderId = "nav-placeholder"): void {
  const el = document.getElementById(placeholderId);
  if (!el) return;

  const loggedIn = isLoggedIn();
  const user = getUser();
  const credits = user?.credits ?? 0;
  const avatarFallback =
    "https://placehold.co/32x32/e0e7ff/4f46e5?text=" +
    (user?.name?.[0]?.toUpperCase() ?? "U");

  el.innerHTML = `
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">

          <a href="/" class="flex items-center gap-2 shrink-0">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-indigo-600 hidden sm:block">BidHub</span>
          </a>

          <form id="nav-search-form" class="flex-1 max-w-md mx-4">
            <div class="relative">
              <input id="nav-search-input" name="q" type="search"
                placeholder="Search listings..."
                class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent">
              <svg class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </form>

          <div class="flex items-center gap-2 shrink-0">
            ${loggedIn ? `
              <a href="/listings/create.html"
                class="hidden sm:flex items-center gap-1 px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                <span>List Item</span>
              </a>

              <div class="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full">
                <svg class="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"/>
                </svg>
                <span class="text-sm font-semibold text-amber-700">${credits.toLocaleString()}</span>
              </div>

              <div class="relative">
                <button id="profile-btn"
                  class="flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors">
                  <img src="${user?.avatar?.url ?? avatarFallback}"
                    alt="${user?.name ?? "User"}"
                    class="w-8 h-8 rounded-full object-cover border-2 border-indigo-200">
                </button>
                <div id="profile-dropdown"
                  class="hidden absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-semibold text-gray-900 truncate">${user?.name ?? ""}</p>
                    <p class="text-xs text-gray-500 truncate">${user?.email ?? ""}</p>
                  </div>
                  <a href="/profile/" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    My Profile
                  </a>
                  <a href="/listings/create.html" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 sm:hidden">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                    List Item
                  </a>
                  <button id="logout-btn"
                    class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Log Out
                  </button>
                </div>
              </div>
            ` : `
              <a href="/auth/login.html" class="text-sm font-medium text-gray-700 hover:text-indigo-600 px-3 py-2">
                Log In
              </a>
              <a href="/auth/register.html"
                class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                Register
              </a>
            `}
          </div>
        </div>
      </div>
    </nav>
  `;

  // Search
  const searchForm = document.getElementById("nav-search-form");
  const searchInput = document.getElementById("nav-search-input") as HTMLInputElement | null;
  const q = new URLSearchParams(window.location.search).get("q");
  if (q && searchInput) searchInput.value = q;

  searchForm?.addEventListener("submit", (e: Event) => {
    e.preventDefault();
    const val = searchInput?.value.trim() ?? "";
    window.location.href = val ? `/?q=${encodeURIComponent(val)}` : "/";
  });

  // Dropdown toggle
  if (loggedIn) {
    const btn = document.getElementById("profile-btn");
    const dropdown = document.getElementById("profile-dropdown");

    btn?.addEventListener("click", (e: Event) => {
      e.stopPropagation();
      dropdown?.classList.toggle("hidden");
    });

    document.addEventListener("click", () => {
      dropdown?.classList.add("hidden");
    });

    document.getElementById("logout-btn")?.addEventListener("click", () => {
      logout();
    });
  }
}
