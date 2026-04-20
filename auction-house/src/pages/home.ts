import { mountNav } from "../components/nav";
import { mountFooter } from "../components/footer";
import { listingCardHTML, listingCardSkeleton } from "../components/listingCard";
import { getListings } from "../api/listings";
import { getParam } from "../utils/url";
import type { ApiMeta } from "../types";

mountNav();
mountFooter();

const grid = document.getElementById("listings-grid")!;
const paginationEl = document.getElementById("pagination")!;
const headingEl = document.getElementById("listings-heading");
const emptyEl = document.getElementById("empty-state");

let currentPage = 1;
const LIMIT = 12;
const q = getParam("q") ?? "";

if (q && headingEl) {
  headingEl.textContent = `Search results for "${q}"`;
}

function renderSkeletons(): void {
  grid.innerHTML = Array.from({ length: 8 }, listingCardSkeleton).join("");
}

function renderPagination(meta: ApiMeta | undefined): void {
  if (!meta || meta.pageCount <= 1) {
    paginationEl.innerHTML = "";
    return;
  }

  const { currentPage: cp, pageCount, isFirstPage, isLastPage } = meta;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);

  paginationEl.innerHTML = `
    <div class="flex items-center gap-1">
      <button data-page="${cp - 1}" ${isFirstPage ? "disabled" : ""}
        class="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        &larr;
      </button>
      ${pages
        .map(
          (p) => `
        <button data-page="${p}"
          class="px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            p === cp
              ? "bg-indigo-600 text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }">
          ${p}
        </button>`
        )
        .join("")}
      <button data-page="${cp + 1}" ${isLastPage ? "disabled" : ""}
        class="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
        &rarr;
      </button>
    </div>
  `;

  paginationEl.querySelectorAll<HTMLButtonElement>("[data-page]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const page = parseInt(btn.dataset.page ?? "", 10);
      if (!isNaN(page) && page >= 1) {
        currentPage = page;
        void loadListings();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

async function loadListings(): Promise<void> {
  renderSkeletons();
  emptyEl?.classList.add("hidden");

  try {
    const res = await getListings({ page: currentPage, limit: LIMIT, q, _active: !q });
    const listings = res.data ?? [];

    if (listings.length === 0) {
      grid.innerHTML = "";
      emptyEl?.classList.remove("hidden");
      renderPagination(undefined);
      return;
    }

    grid.innerHTML = listings.map(listingCardHTML).join("");
    renderPagination(res.meta);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Failed to load listings.";
    grid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-red-500 text-sm">${msg}</p>
        <button onclick="location.reload()" class="mt-3 text-indigo-600 underline text-sm">Try again</button>
      </div>
    `;
  }
}

void loadListings();
