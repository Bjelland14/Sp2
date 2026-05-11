function m(e){return new Date(e).toLocaleString("en-GB",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function n(e){const i=Date.now(),t=new Date(e).getTime()-i;if(t<=0)return"Ended";const a=Math.floor(t/36e5);return a<1?Math.floor(t/6e4)+"m left":a<24?a+"h left":Math.floor(a/24)+"d left"}function c(e){return new Date(e).getTime()<=Date.now()}function d(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function u(e){let i="https://placehold.co/400x220?text=No+Image",s=e.title||"Listing image";e.media&&e.media[0]&&e.media[0].url&&(i=e.media[0].url,s=e.media[0].alt||e.title||"Listing image");let t=0;e._count?t=e._count.bids:e.bids&&(t=e.bids.length);let a=t+" bids";t===1&&(a="1 bid"),t===0&&e.bids&&(a="Bid placed");let r="bg-success",o=n(e.endsAt);c(e.endsAt)&&(r="bg-danger",o="Ended");let l="";return e.seller&&(l='<p class="text-muted small mb-0">by '+d(e.seller.name)+"</p>"),`
    <div class="col">
      <a href="/listing.html?id=${d(e.id)}" class="text-decoration-none">
        <div class="card h-100 shadow-sm listing-card">

          <div class="position-relative">
            <img
              src="${d(i)}"
              alt="${d(s)}"
              class="card-img-top"
              style="height: 200px; object-fit: cover;"
              onerror="this.src='https://placehold.co/400x220?text=No+Image'"
            >

            <span class="badge ${r} position-absolute top-0 end-0 m-2">
              ${d(o)}
            </span>
          </div>

          <div class="card-body">
            <h6 class="card-title text-dark fw-semibold text-truncate">
              ${d(e.title||"Untitled listing")}
            </h6>

            <p class="text-muted small mb-1">
              <i class="bi bi-gavel me-1"></i>${a}
            </p>

            ${l}
          </div>

        </div>
      </a>
    </div>
  `}export{m as f,c as i,u as r};
