export function mountFooter(placeholderId = "footer-placeholder"): void {
  const el = document.getElementById(placeholderId);
  if (!el) return;

  el.innerHTML = `
    <footer class="bg-gray-900 text-gray-400 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center">
                <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span class="text-white font-bold text-lg">BidHub</span>
            </div>
            <p class="text-sm">The student auction platform. Buy, sell and discover unique items using virtual credits.</p>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Quick Links</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="/" class="hover:text-white transition-colors">Browse Listings</a></li>
              <li><a href="/auth/register.html" class="hover:text-white transition-colors">Create Account</a></li>
              <li><a href="/listings/create.html" class="hover:text-white transition-colors">List an Item</a></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-semibold mb-3">Info</h4>
            <ul class="space-y-2 text-sm">
              <li>Requires <span class="text-indigo-400">@stud.noroff.no</span> email</li>
              <li>1,000 credits on sign-up</li>
              <li>Powered by Noroff API v2</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
          &copy; ${new Date().getFullYear()} BidHub — Student Auction Platform
        </div>
      </div>
    </footer>
  `;
}
