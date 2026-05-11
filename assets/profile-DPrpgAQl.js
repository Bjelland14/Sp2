import{s as $,e as B,a as E}from"./showMessage-7BOvKEKx.js";import{r as H}from"./authGuard-Dw2cyNDm.js";import{g as I,a as L,b as P,u as N}from"./profile-Dqhqk4vy.js";import{r as y}from"./renderListingCard-Ba3jJfl1.js";function c(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function S(t,m){let d="https://placehold.co/1200x200?text=+";t.banner&&t.banner.url&&(d=t.banner.url);let e="https://placehold.co/100x100?text=?";t.avatar&&t.avatar.url&&(e=t.avatar.url);let l="";m&&(l=`
      <span class="badge bg-warning text-dark">
        <i class="bi bi-coin me-1"></i>${t.credits} credits
      </span>
    `);let s="";return t.bio&&(s='<p class="text-muted">'+c(t.bio)+"</p>"),`
    <img
      src="${c(d)}"
      alt="Profile banner"
      class="w-100 rounded mb-3"
      style="height: 200px; object-fit: cover;"
      onerror="this.src='https://placehold.co/1200x200?text=+'"
    >

<div class="d-flex align-items-end gap-3 mb-3" style="margin-top: -40px;">
    <img
        src="${c(e)}"
        alt="${c(t.name)}"
        class="rounded-circle border-4 border-white shadow"
        style="width: 90px; height: 90px; object-fit: cover;"
        onerror="this.src='https://placehold.co/100x100?text=?'"
      >

      <div>
        <h3 class="fw-bold mb-0">${c(t.name)}</h3>
        ${l}
      </div>
    </div>

    ${s}
  `}$();H();const C=new URLSearchParams(window.location.search),g=C.get("user")||localStorage.getItem("userName"),x=document.getElementById("profile-container"),U=localStorage.getItem("userName"),b=U===g;!g||!x?window.location.href="./login.html":M(g,x);function u(t){return t.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}async function M(t,m){var d;try{const e=await I(t),l=await L(t);let s=[];b&&(s=await P(t),console.log("Bids JSON:",JSON.stringify(s,null,2)),B(e.credits));let f='<p class="text-muted">No listings yet.</p>';if(l.length>0){let i="";for(let a=0;a<l.length;a++)i+=y(l[a]);f='<div class="row row-cols-2 row-cols-md-4 g-3">'+i+"</div>"}let v="";if(b){let i='<p class="text-muted">No bids placed yet.</p>';if(s.length>0){let a="";for(let r=0;r<s.length;r++){const o=s[r],n=o.listing||o._listing||((d=o.listings)==null?void 0:d[0]);n&&(a+=y({...n,bids:n.bids||[o]}))}a?i='<div class="row row-cols-2 row-cols-md-4 g-3">'+a+"</div>":i='<p class="text-muted">Bids found, but listings could not be loaded.</p>'}v=`
        <h5 class="fw-bold border-bottom pb-2 mb-3 mt-5">My Bids (${s.length})</h5>
        ${i}
      `}let p="";b&&(p=`
        <button class="btn btn-outline-secondary btn-sm mb-4"
          data-bs-toggle="modal" data-bs-target="#edit-modal">
          <i class="bi bi-pencil"></i> Edit profile
        </button>
      `);let h="";if(b){let i="",a="",r="";e.avatar&&e.avatar.url&&(i=e.avatar.url),e.banner&&e.banner.url&&(a=e.banner.url),e.bio&&(r=e.bio),h=`
        <div class="modal fade" id="edit-modal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Profile</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <div id="edit-message" hidden></div>
                <div class="mb-3">
                  <label for="edit-bio" class="form-label">Bio</label>
                  <textarea id="edit-bio" class="form-control" rows="3">${u(r)}</textarea>
                </div>
                <div class="mb-3">
                  <label for="edit-avatar" class="form-label">Avatar URL</label>
                  <input id="edit-avatar" type="url" class="form-control" value="${u(i)}">
                </div>
                <div class="mb-3">
                  <label for="edit-banner" class="form-label">Banner URL</label>
                  <input id="edit-banner" type="url" class="form-control" value="${u(a)}">
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                <button id="save-profile-btn" type="button" class="btn btn-warning">Save</button>
              </div>
            </div>
          </div>
        </div>
      `}m.innerHTML=`
      ${S(e,b)}
      ${p}

      <h5 class="fw-bold border-bottom pb-2 mb-3">Listings (${l.length})</h5>
      ${f}

      ${v}
      ${h}
    `;const w=document.getElementById("save-profile-btn");w&&w.addEventListener("click",async function(){const i=document.getElementById("edit-bio"),a=document.getElementById("edit-avatar"),r=document.getElementById("edit-banner");if(!(!i||!a||!r))try{await N(e.name,i.value,a.value.trim(),r.value.trim()),window.location.reload()}catch(o){let n="Could not save profile.";o instanceof Error&&(n=o.message),E("edit-message",n)}})}catch(e){let l="Could not load profile.";e instanceof Error&&(l=e.message),m.innerHTML='<div class="alert alert-danger">'+l+"</div>"}}
