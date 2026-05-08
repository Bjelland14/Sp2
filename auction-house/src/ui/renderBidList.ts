import { Bid } from "../../types";
import { formatDate } from "../utils/formatDate";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function renderBidList(bids: Bid[]) {
  if (bids.length === 0) {
    return '<p class="text-muted">No bids yet. Be the first!</p>';
  }

  const sorted = bids.slice().sort(function (a, b) {
    return b.amount - a.amount;
  });

  let rows = "";

  for (let i = 0; i < sorted.length; i++) {
    const bid = sorted[i];
    let bidderName = "Unknown";

    if (bid.bidder && bid.bidder.name) {
      bidderName = escapeHtml(bid.bidder.name);
    }

    rows += `
      <tr>
        <td>${bidderName}</td>
        <td><strong>${bid.amount} credits</strong></td>
        <td class="text-muted small">${formatDate(bid.created)}</td>
      </tr>
    `;
  }

  return `
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Bidder</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}
