/* ======  DATA  ====== */
const endpoints = [
  {
    name: "All-in-one",
    path: "/api/all-in-one?url=https://fb.com/video",
    method: "GET",
    params: ["url"],
    desc: "Download any social-media video",
    cat: "Downloaders",
    isActive: false,
  },
  {
    name: "Anime Quote",
    path: "/api/aniquote",
    method: "GET",
    params: [],
    desc: "Random quote from popular anime",
    cat: "Fun",
    isActive: true,
  },
  {
    name: "APK Downloader",
    path: "/api/apkdl?q=Facebook%20lite",
    method: "GET",
    params: ["q"],
    desc: "Download APKs directly",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "Calculator",
    path: "/api/cal?num1=10&num2=5&operation=add",
    method: "GET",
    params: ["num1", "num2", "operation"],
    desc: "Basic arithmetic",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Country Info",
    path: "/api/country?q=Nigeria",
    method: "GET",
    params: ["q"],
    desc: "Country profiles",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Currency Converter",
    path: "/api/convert?from=USD&to=EUR&amount=100",
    method: "GET",
    params: ["from", "to", "amount"],
    desc: "Live exchange rates",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Dare",
    path: "/api/dare",
    method: "GET",
    params: [],
    desc: "Random dare challenge",
    cat: "Fun",
    isActive: true,
  },
  {
    name: "Encode",
    path: "/api/encode?text=Hello-world",
    method: "GET",
    params: ["text"],
    desc: "Text → binary",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Decode",
    path: "/api/decode?binary=01001000",
    method: "GET",
    params: ["binary"],
    desc: "Binary → text",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Facebook DL",
    path: "/api/fbdl?url=https://www.facebook.com/share/r/1JB12MKi1Z/",
    method: "GET",
    params: ["url"],
    desc: "Facebook video downloader",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "JS Encryptor",
    path: "/api/obf?code=console.log('hello');",
    method: "GET",
    params: ["code"],
    desc: "For encrypting JavaScript codes",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Flirt 😏",
    path: "/api/flirt",
    method: "GET",
    params: [],
    desc: "Random flirting text",
    cat: "Fun",
    isActive: true,
  },
  {
    name: "Font",
    path: "/api/font",
    method: "GET",
    params: ["text"],
    desc: "Generate different fonts",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Gpt3.5",
    path: "/api/gpt3.5?prompt=hi",
    method: "GET",
    params: ["prompt"],
    desc: "ChatGPT-3.5 turbo",
    cat: "AI",
    isActive: true,
  },
  {
    name: "Movie",
    path: "/api/moviedl?moviename=Wednesday&episode=1",
    method: "GET",
    params: ["moviename", "episode"],
    desc: "Movie downloader",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "Npm stalker",
    path: "/api/npmcheck?package=Baileys",
    method: "GET",
    params: ["package"],
    desc: "Info on an npm package",
    cat: "Stalker",
    isActive: true,
  },
  {
    name: "TikTok DL",
    path: "/api/tkdl?url=https://vt.tiktok.com/ZSAG1bG1e/",
    method: "GET",
    params: ["url"],
    desc: "No-watermark TikTok",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "TikTok DL2",
    path: "/api/tkdl2?url=https://vt.tiktok.com/ZSAG1bG1e/",
    method: "GET",
    params: ["url"],
    desc: "No-watermark TikTok faster than v1",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "Instagram DL",
    path: "/api/instadl?url=https://www.instagram.com/reel/DNsaHN70Cdr/?igsh=YzljYTk1ODg3Zg==",
    method: "GET",
    params: ["url"],
    desc: "Instagram media downloader",
    cat: "Downloaders",
    isActive: false,
  },
  {
    name: "wachannel",
    path: "/api/wachannel?url=https://whatsapp.com/channel/0029VangYOt96H4JhFarL10C",
    method: "GET",
    params: ["url"],
    desc: "Get WhatsApp channel info",
    cat: "Stalker",
    isActive: false,
  },
  {
    name: "Wallpaper",
    path: "/api/wallpaper?q=naruto",
    method: "GET",
    params: ["q"],
    desc: "Wallpaper search",
    cat: "Search",
    isActive: true,
  },
  {
    name: "YouTube MP4",
    path: "/api/ytmp4?url=URL",
    method: "GET",
    params: ["url"],
    desc: "YouTube video",
    cat: "Downloaders",
    isActive: false,
  },
  {
    name: "YouTube MP3",
    path: "/api/ytmp3?url=URL",
    method: "GET",
    params: ["url"],
    desc: "YouTube audio",
    cat: "Downloaders",
    isActive: false,
  },
  {
    name: "Text-to-Image",
    path: "/api/text2img?prompt=hello",
    method: "GET",
    params: ["prompt"],
    desc: "AI image generation",
    cat: "AI",
    isActive: false,
  },
  {
    name: "Translator",
    path: "/api/translate?text=hello&from=en&to=id",
    method: "GET",
    params: ["text", "from", "to"],
    desc: "Auto-detect translate",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Joke",
    path: "/api/joke",
    method: "GET",
    params: [],
    desc: "Random joke",
    cat: "Fun",
    isActive: true,
  },
  {
    name: "Quote",
    path: "/api/quote",
    method: "GET",
    params: [],
    desc: "Inspirational quote",
    cat: "Fun",
    isActive: true,
  },
  {
    name: "Screenshot",
    path: "/api/screenshot?url=WEBSITE",
    method: "GET",
    params: ["url"],
    desc: "Website screenshot",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "TinyURL",
    path: "/api/tinyurl?url=LONG",
    method: "GET",
    params: ["url"],
    desc: "URL shortener",
    cat: "Tools",
    isActive: true,
  },
  {
    name: "Spotify DL",
    path: "/api/spotifydl?url=TRACK_URL",
    method: "GET",
    params: ["url"],
    desc: "Spotify downloader",
    cat: "Downloaders",
    isActive: false,
  },
  {
    name: "Twitter DL",
    path: "/api/twitterdl?url=https://x.com/Korsogyimi/status/1962912658618802257",
    method: "GET",
    params: ["url"],
    desc: "Twitter video downloader",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "Pinterest Search",
    path: "/api/pinterest?q=cats",
    method: "GET",
    params: ["q"],
    desc: "Pinterest images",
    cat: "Search",
    isActive: true,
  },
  {
    name: "Waifu (NSFW)",
    path: "/api/waifu?q=",
    method: "GET",
    params: ["q"],
    desc: "Random waifu pics",
    cat: "Random",
    isActive: true,
  },
  {
    name: "Hentai (NSFW)",
    path: "/api/hentai",
    method: "GET",
    params: [],
    desc: "Hentai videos",
    cat: "Random",
    isActive: true,
  },
  {
    name: "Xvideos",
    path: "/api/xvideos?url=https://www.xvideos.com/video.oipfcmd53ee/he_fucking_peaces_my_wet_hole_xxx",
    method: "GET",
    params: ["url"],
    desc: "download xvidios videos",
    cat: "Downloaders",
    isActive: true,
  },
  {
    name: "XXX Search",
    path: "/api/xxxsearch?q=keyword",
    method: "GET",
    params: ["q"],
    desc: "Search adult videos",
    cat: "Search",
    isActive: true,
  },
];

const baseURL = window.location.origin;

/* ======  STATE  ====== */
let filtered = [...endpoints];
let page = 0;
const perPage = 15;

/* ======  DOM  ====== */
const grid = document.getElementById("grid");
const search = document.getElementById("search");
const categoryList = document.getElementById("category-list");
const loadBtn = document.getElementById("loadMore");
const endpointCount = document.getElementById("endpoint-count");
const sectionTitle = document.getElementById("section-title");

// Modal DOM
const modal = document.getElementById("modal");
const mTitle = document.getElementById("mTitle");
const mBody = document.getElementById("mBody");
const mMethod = document.getElementById("mMethod");

// Sidebar
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.querySelector(".sidebar");

/* ======  INIT  ====== */
function init() {
  createSidebarCategories();
  render();
  bindEvents();
  fetchCount();
}

/* ======  CATEGORIES  ====== */
function createSidebarCategories() {
  const cats = [...new Set(endpoints.map((e) => e.cat))].sort();

  categoryList.innerHTML = cats
    .map((c) => `
      <div class="nav-item" data-cat="${c}">
        <i class="fas fa-folder"></i>
        <span>${c}</span>
      </div>
    `)
    .join("");
}

/* ======  RENDER  ====== */
function render(reset = true) {
  if (reset) {
    grid.innerHTML = "";
    page = 0;
  }

  endpointCount.textContent = filtered.length;

  // Calculate slice
  const slice = filtered.slice(page * perPage, (page + 1) * perPage);

  slice.forEach((e) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
        <div class="card-header">
            <span class="card-cat">${e.cat}</span>
            <span class="method-badge">${e.method}</span>
        </div>
        <h4>${e.name}</h4>
        <p>${e.desc}</p>
        <div class="card-footer">
            <div class="status-dot ${e.isActive ? "active" : "inactive"}"></div>
            <div class="card-action">
                <span>Try it</span>
                <i class="fas fa-arrow-right"></i>
            </div>
        </div>
    `;
    card.onclick = () => openModal(e);
    grid.appendChild(card);
  });

  // Show/Hide Load More
  loadBtn.style.display = (page + 1) * perPage < filtered.length ? "flex" : "none";
}

/* ======  SEARCH / FILTER  ====== */
function bindEvents() {
  // Search
  search.addEventListener("input", filter);

  // Category Click (Sidebar)
  document.querySelector(".nav-menu").addEventListener("click", (e) => {
    const item = e.target.closest(".nav-item");
    if (!item) return;

    // Handle "Main" links specially or specific links
    if(item.getAttribute("href") && item.getAttribute("href").startsWith("#")) return;
    if(item.target === "_blank") return;

    e.preventDefault();

    // Remove active class from all
    document.querySelectorAll(".nav-item").forEach(el => el.classList.remove("active"));
    item.classList.add("active");

    const cat = item.dataset.cat;
    if (cat) {
        filter(cat);
        sectionTitle.textContent = cat === "All" ? "All Endpoints" : `${cat} Endpoints`;
        // On mobile, close sidebar after selection
        if(window.innerWidth <= 768) {
            sidebar.classList.remove("open");
        }
    }
  });

  // Load More
  loadBtn.addEventListener("click", () => {
    page++;
    render(false);
  });

  // Modal Close
  modal.querySelector(".modal-close").onclick = closeModal;
  modal.addEventListener("click", (e) => {
      if(e.target === modal) closeModal();
  });

  // Mobile Menu
  menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
  });
}

function filter(category = null) {
  const term = search.value.toLowerCase();

  // Determine current category if not passed
  let activeCat = category;
  if (!activeCat) {
      const activeEl = document.querySelector(".nav-item.active");
      activeCat = activeEl ? activeEl.dataset.cat : "All";
  }

  filtered = endpoints.filter((e) => {
    const matchesCat = activeCat === "All" || e.cat === activeCat;
    const matchesSearch = e.name.toLowerCase().includes(term) || e.desc.toLowerCase().includes(term);
    return matchesCat && matchesSearch;
  });

  render();
}

/* ======  MODAL  ====== */
function openModal(e) {
  mTitle.textContent = e.name;
  mMethod.textContent = e.method;

  const url = `${baseURL}${e.path}`;

  // Parameters HTML
  const paramsHtml = e.params.length
    ? `<div class="param-list">
         ${e.params.map(p => `
           <div class="param-item">
             <span class="param-key">${p}</span>
             <span class="param-desc">Required</span>
           </div>
         `).join("")}
       </div>`
    : `<div class="param-list" style="text-align:center; color:#666;">No parameters required</div>`;

  mBody.innerHTML = `
    <p style="color:var(--text-muted); margin-bottom:1rem;">${e.desc}</p>

    ${paramsHtml}

    <div class="code-block">curl -X ${e.method} "${url}"</div>

    <div class="modal-actions">
      <button class="btn-primary" onclick="copyToClipboard('${url}')">
        <i class="fas fa-copy"></i> Copy URL
      </button>
      <a href="${url}" target="_blank" class="btn-secondary" style="text-decoration:none; display:inline-flex; align-items:center; gap:.5rem;">
        <i class="fas fa-external-link-alt"></i> Test
      </a>
    </div>
  `;

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Could add a toast here
        const btn = document.querySelector(".btn-primary");
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check"></i> Copied!`;
        setTimeout(() => {
            btn.innerHTML = original;
        }, 2000);
    });
}

/* ======  LIVE REQUEST COUNT  ====== */
async function fetchCount() {
  try {
    const res = await fetch(`${baseURL}/api/requests`);
    const data = await res.json();
    document.getElementById("req-count").textContent =
      data.request_count.toLocaleString();
  } catch {
    document.getElementById("req-count").textContent = "0";
  }
}

init();
