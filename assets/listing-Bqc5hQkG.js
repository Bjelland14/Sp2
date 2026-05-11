import{r as N,h as P,a as $,g as L,e as k,d as C,s as M}from"./showMessage-Do1J44am.js";import{g as S,a as D}from"./listingEvents-Bjv4WE3C.js";import{f as E,i as T}from"./renderListingCard-Ba3jJfl1.js";import{g as U}from"./profile-DefyQVfd.js";function A(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function j(i){if(i.length===0)return'<p class="text-muted">No bids yet. Be the first!</p>';const e=i.slice().sort(function(a,s){return s.amount-a.amount});let t="";for(let a=0;a<e.length;a++){const s=e[a];let n="Unknown";s.bidder&&s.bidder.name&&(n=A(s.bidder.name)),t+=`
      <tr>
        <td>${n}</td>
        <td><strong>${s.amount} credits</strong></td>
        <td class="text-muted small">${E(s.created)}</td>
      </tr>
    `}return`
    <table class="table table-sm table-hover">
      <thead>
        <tr>
          <th>Bidder</th>
          <th>Amount</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>${t}</tbody>
    </table>
  `}async function q(i,e){if(!i)throw new Error("Missing listing ID");if(e<=0)throw new Error("Bid amount must be greater than 0");const t=await N("/auction/listings/"+i+"/bids","POST",{amount:e},!0);if(!t||!t.data)throw new Error("Failed to place bid");return t.data}function F(i){const e=document.getElementById("bid-btn"),t=document.getElementById("bid-amount");!e||!t||e.addEventListener("click",async function(){P("bid-message");const a=Number(t.value);if(!a||a<=0){$("bid-message","Please enter a valid amount.");return}e.disabled=!0,e.textContent="Placing bid...";try{await q(i,a);const s=L();if(s){const n=await U(s);k(n.credits)}C("bid-message","Bid of "+a+" credits placed!"),setTimeout(function(){window.location.reload()},1500)}catch(s){let n="Could not place bid.";s instanceof Error&&(n=s.message),$("bid-message",n),e.disabled=!1,e.textContent="Place bid"}})}M();const K=new URLSearchParams(window.location.search),x=K.get("id"),B=document.getElementById("listing-container");!x||!B?window.location.href="/index.html":O(x,B);function c(i){return i.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}async function O(i,e){e.innerHTML=`
    <div class="text-center py-5">
      <div class="spinner-border text-warning" role="status"></div>
    </div>
  `;try{const t=await S(i),a=localStorage.getItem("token"),s=localStorage.getItem("apiKey"),n=a!==null&&s!==null,H=localStorage.getItem("userName"),g=T(t.endsAt),m=n&&t.seller&&H===t.seller.name,o=t.bids||[];let r=0;for(let l=0;l<o.length;l++)o[l].amount>r&&(r=o[l].amount);const u=c(t.title||"Untitled listing"),I=c(t.description||"No description.");let b="";t.seller&&t.seller.name&&(b=`<p class="text-muted">by <strong>${c(t.seller.name)}</strong></p>`);let p="";r>0&&(p=`<li><i class="bi bi-trophy me-2"></i><strong>Highest bid:</strong> ${r} credits</li>`);let f="";g&&(f='<span class="badge bg-danger fs-6">Auction ended</span>');let h=`
      <img
        src="https://placehold.co/800x400?text=No+Image"
        alt="${u}"
        class="img-fluid rounded w-100"
        style="max-height: 420px; object-fit: cover;"
      >
    `;if(t.media&&t.media.length>0){let l="";for(let d=0;d<t.media.length;d++)l+=`
          <div class="carousel-item ${d===0?"active":""}">
            <img
              src="${c(t.media[d].url)}"
              alt="${c(t.media[d].alt||t.title)}"
              class="d-block w-100 rounded"
              style="height: 420px; object-fit: cover;"
              onerror="this.src='https://placehold.co/800x400?text=No+Image'"
            >
          </div>
        `;h=`
        <div id="listing-carousel" class="carousel slide">
          <div class="carousel-inner">
            ${l}
          </div>

          <button class="carousel-control-prev" type="button" data-bs-target="#listing-carousel" data-bs-slide="prev">
            <span class="carousel-control-prev-icon"></span>
          </button>

          <button class="carousel-control-next" type="button" data-bs-target="#listing-carousel" data-bs-slide="next">
            <span class="carousel-control-next-icon"></span>
          </button>
        </div>
      `}let v="";m&&(v=`
        <div class="d-flex gap-2 mt-3">
          <a href="/create-listings.html?edit=${t.id}" class="btn btn-outline-secondary btn-sm">
            <i class="bi bi-pencil"></i> Edit
          </a>
          <button id="delete-btn" class="btn btn-danger btn-sm">
            <i class="bi bi-trash"></i> Delete
          </button>
        </div>
      `);let w="";n&&!m&&!g&&(w=`
        <div class="card mt-4 border-warning">
          <div class="card-body">
            <h6 class="card-title">Place a Bid</h6>
            <div id="bid-message" hidden></div>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-coin"></i></span>
              <input
                type="number"
                id="bid-amount"
                class="form-control"
                placeholder="Min. ${r+1}"
                min="${r+1}"
              >
              <button id="bid-btn" class="btn btn-warning">Place bid</button>
            </div>
          </div>
        </div>
      `);let y="";!n&&!g&&(y=`
    <div class="alert alert-info mt-3 d-flex align-items-center justify-content-between">
      <span>Want to place a bid?</span>
      <a href="/login.html" class="btn btn-sm btn-outline-primary">
        Log in
      </a>
    </div>
  `),e.innerHTML=`
      <div class="row g-4">
        <div class="col-md-7">
          ${h}
        </div>

        <div class="col-md-5">
          <h2 class="fw-bold">${u}</h2>
          ${b}
          <p>${I}</p>

          <ul class="list-unstyled">
            <li><i class="bi bi-clock me-2"></i><strong>Ends:</strong> ${E(t.endsAt)}</li>
            <li><i class="bi bi-gavel me-2"></i><strong>Bids:</strong> ${o.length}</li>
            ${p}
          </ul>

          ${f}
          ${v}
          ${w}
          ${y}
        </div>
      </div>

      <div class="mt-5">
        <h5 class="fw-bold border-bottom pb-2">Bid History</h5>
        ${j(o)}
      </div>
    `,n&&!m&&!g&&F(t.id),m&&D(t.id)}catch{e.innerHTML=`
      <div class="alert alert-danger">
        Could not load listing.
      </div>
    `}}
