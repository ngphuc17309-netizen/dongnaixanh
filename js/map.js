/* =========================================================
   ĐỒNG NAI XANH - Bản đồ du lịch & Tìm kiếm vị trí Google Maps
   Định vị chính xác 12 khu du lịch + tìm kiếm địa điểm bất kỳ
   tại Đồng Nai + chuyển đổi Bản đồ / Vệ tinh + Chỉ đường.
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const normalize = (str) =>
    (str || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();

  /* ---------- 1. DỮ LIỆU ĐỊNH VỊ CHÍNH XÁC 12 KHU DU LỊCH ---------- */
  const MAP_PLACES = [
    {
      id: "amazing-bay",
      num: "01",
      title: "Công viên nước The Amazing Bay – Vịnh Kỳ Diệu",
      shortName: "The Amazing Bay",
      badge: "Vui chơi",
      area: "bien-hoa",
      image: "images/amazing-bay.jpg",
      coords: "10.8749° B, 106.8704° Đ",
      address: "Khu du lịch Sơn Tiên, Quốc lộ 51, P. An Hòa, TP. Biên Hòa, Đồng Nai",
      distance: "Cách TP.HCM ~30 km (~45 phút)",
      zoom: 15,
      gmapQuery: "Công viên nước The Amazing Bay, Sơn Tiên, Quốc lộ 51, Biên Hòa, Đồng Nai",
      keywords: "son tien vinh ky dieu cong vien nuoc bien nhan tao bien hoa ql51",
    },
    {
      id: "rung-ma-da",
      num: "02",
      title: "Rừng Mã Đà",
      shortName: "Rừng Mã Đà",
      badge: "Thiên nhiên",
      area: "vinh-cuu",
      image: "images/rung-ma-da.jpg",
      coords: "11.2361° B, 107.0683° Đ",
      address: "Khu bảo tồn thiên nhiên – văn hóa Đồng Nai, xã Mã Đà, Vĩnh Cửu, Đồng Nai",
      distance: "Cách TP.HCM ~90 km (~2 giờ)",
      zoom: 13,
      gmapQuery: "Khu bảo tồn thiên nhiên văn hóa Đồng Nai, Mã Đà, Vĩnh Cửu, Đồng Nai",
      keywords: "chien khu d trekking rung nguyen sinh vinh cuu",
    },
    {
      id: "ho-tri-an",
      num: "03",
      title: "Hồ Trị An – Viên ngọc xanh của Đồng Nai",
      shortName: "Hồ Trị An",
      badge: "Thiên nhiên",
      area: "vinh-cuu",
      image: "images/ho-tri-an.jpg",
      coords: "11.1065° B, 107.0542° Đ",
      address: "Thị trấn Vĩnh An – xã Mã Đà, huyện Vĩnh Cửu, Đồng Nai",
      distance: "Cách TP.HCM ~70 km (~1 giờ 40 phút)",
      zoom: 12,
      gmapQuery: "Hồ Trị An, Vĩnh Cửu, Đồng Nai",
      keywords: "dap thuy dien tri an cam trai cheo sup vinh an",
    },
    {
      id: "thac-da-han",
      num: "04",
      title: "Khu du lịch sinh thái Thác Đá Hàn",
      shortName: "Thác Đá Hàn",
      badge: "Thiên nhiên",
      area: "dinh-quan",
      image: "images/thac-da-han.jpg",
      coords: "10.9912° B, 107.0128° Đ",
      address: "Tổ 15, Ấp 5, xã Sông Trầu, huyện Trảng Bom, Đồng Nai",
      distance: "Cách TP.HCM ~70 km (~1 giờ 35 phút)",
      zoom: 15,
      gmapQuery: "Khu du lịch sinh thái Thác Đá Hàn, Sông Trầu, Trảng Bom, Đồng Nai",
      keywords: "song trau trang bom tam thac da ngoai",
    },
    {
      id: "thac-mai",
      num: "05",
      title: "Khu du lịch Thác Mai – Bàu Nước Sôi",
      shortName: "Thác Mai",
      badge: "Thiên nhiên",
      area: "dinh-quan",
      image: "images/thac-mai.jpg",
      coords: "11.1578° B, 107.3264° Đ",
      address: "Rừng phòng hộ Tân Phú, xã Gia Canh, huyện Định Quán, Đồng Nai",
      distance: "Cách TP.HCM ~130 km (~2 giờ 45 phút)",
      zoom: 14,
      gmapQuery: "Khu du lịch sinh thái Thác Mai, Gia Canh, Định Quán, Đồng Nai",
      keywords: "bau nuoc soi gia canh dinh quan la nga",
    },
    {
      id: "buu-long",
      num: "06",
      title: "Khu du lịch Bửu Long",
      shortName: "Khu du lịch Bửu Long",
      badge: "Văn hóa – Lịch sử",
      area: "bien-hoa",
      image: "images/buu-long.jpg",
      coords: "10.9630° B, 106.7944° Đ",
      address: "Đường Huỳnh Văn Nghệ, KP.4, P. Bửu Long, TP. Biên Hòa, Đồng Nai",
      distance: "Cách TP.HCM ~32 km (~50 phút)",
      zoom: 15,
      gmapQuery: "Khu du lịch Bửu Long, Huỳnh Văn Nghệ, Bửu Long, Biên Hòa, Đồng Nai",
      keywords: "vinh ha long thu nho long son thach dong buu phong co tu nui binh dien",
    },
    {
      id: "tre-viet",
      num: "07",
      title: "Làng du lịch sinh thái Tre Việt (The Bamboo)",
      shortName: "Khu du lịch Tre Việt",
      badge: "Vui chơi",
      area: "bien-hoa",
      image: "images/tre-viet.jpg",
      coords: "10.7495° B, 106.7738° Đ",
      address: "25 Phan Văn Đáng, ấp Phước Lương, xã Phú Hữu, huyện Nhơn Trạch, Đồng Nai",
      distance: "Cách TP.HCM ~15 km (~30 phút qua phà Cát Lái)",
      zoom: 16,
      gmapQuery: "Làng du lịch sinh thái Tre Việt, 25 Phan Văn Đáng, Phú Hữu, Nhơn Trạch, Đồng Nai",
      keywords: "the bamboo pha cat lai nhon trach phu huu kayak",
    },
    {
      id: "nui-chua-chan",
      num: "08",
      title: "Danh thắng Núi Chứa Chan (Núi Gia Lào)",
      shortName: "Núi Chứa Chan",
      badge: "Thiên nhiên",
      area: "long-khanh",
      image: "images/nui-chua-chan.jpg",
      coords: "10.9411° B, 107.3792° Đ",
      address: "Thị trấn Gia Ray – xã Xuân Trường, huyện Xuân Lộc, Đồng Nai",
      distance: "Cách TP.HCM ~100 km (~2 giờ 10 phút)",
      zoom: 14,
      gmapQuery: "Núi Chứa Chan, Xuân Lộc, Đồng Nai",
      keywords: "nui gia lao chua gia lao xuan loc cap treo leo nui san may",
    },
    {
      id: "da-ba-chong",
      num: "09",
      title: "Quần thể danh thắng Đá Ba Chồng",
      shortName: "Đá Ba Chồng",
      badge: "Văn hóa – Lịch sử",
      area: "dinh-quan",
      image: "images/da-ba-chong.jpg",
      coords: "11.1965° B, 107.2412° Đ",
      address: "Quốc lộ 20, thị trấn Định Quán, huyện Định Quán, Đồng Nai",
      distance: "Cách TP.HCM ~110 km (~2 giờ 20 phút)",
      zoom: 16,
      gmapQuery: "Đá Ba Chồng, Quốc lộ 20, Định Quán, Đồng Nai",
      keywords: "di tich quoc gia dinh quan ql20 van hoa oc eo",
    },
    {
      id: "lang-buoi-tan-trieu",
      num: "10",
      title: "Làng Bưởi Tân Triều",
      shortName: "Làng Bưởi Tân Triều",
      badge: "Miệt vườn",
      area: "vinh-cuu",
      image: "images/lang-buoi-tan-trieu.jpg",
      coords: "10.9856° B, 106.8142° Đ",
      address: "Cù lao Tân Triều, xã Tân Bình, huyện Vĩnh Cửu, Đồng Nai",
      distance: "Cách TP.HCM ~35 km (cách Biên Hòa 3 km)",
      zoom: 15,
      gmapQuery: "Làng bưởi Tân Triều, Tân Bình, Vĩnh Cửu, Đồng Nai",
      keywords: "cu lao tan trieu nam hue goi buoi ruou buoi tan binh",
    },
    {
      id: "vuon-trai-cay-long-khanh",
      num: "11",
      title: "Vườn trái cây Long Khánh (Bình Lộc)",
      shortName: "Vườn trái cây Long Khánh",
      badge: "Miệt vườn",
      area: "long-khanh",
      image: "images/vuon-trai-cay-long-khanh.jpg",
      coords: "10.9754° B, 107.2285° Đ",
      address: "Làng du lịch sinh thái Bình Lộc, xã Bình Lộc, TP. Long Khánh, Đồng Nai",
      distance: "Cách TP.HCM ~80 km (~1 giờ 30 phút qua cao tốc)",
      zoom: 14,
      gmapQuery: "Vườn trái cây Bình Lộc, Long Khánh, Đồng Nai",
      keywords: "chom chom sau rieng mang cut mit to nu binh loc long khanh",
    },
    {
      id: "dao-o",
      num: "12",
      title: "Đảo Ó – Đồng Trường (Hồ Trị An)",
      shortName: "Đảo Ó",
      badge: "Thiên nhiên",
      area: "vinh-cuu",
      image: "images/cu-lao-pho.jpg",
      coords: "11.1028° B, 107.0394° Đ",
      address: "Bến tàu Đảo Ó Đồng Trường, thị trấn Vĩnh An, Vĩnh Cửu, Đồng Nai",
      distance: "Cách TP.HCM ~70 km + 30 phút đi tàu ra đảo",
      zoom: 14,
      gmapQuery: "Khu du lịch Đảo Ó Đồng Trường, Vĩnh An, Vĩnh Cửu, Đồng Nai",
      keywords: "ben tau dao o dong truong oc dao xanh ho tri an vinh an",
    },
  ];

  const placeById = new Map(MAP_PLACES.map((p) => [p.id, p]));

  function buildEmbedUrl(query, zoom = 15, mapType = "m") {
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=${mapType}&z=${zoom}&ie=UTF8&iwloc=B&output=embed&hl=vi`;
  }

  function buildDirUrl(query) {
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
  }

  function buildSearchUrl(query) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  }

  // Xuất API tra cứu cho Modal chi tiết (dùng chung ở index.html & goi-y.html)
  window.DNX_MAP = {
    getPlace: (id) => placeById.get(id) || null,
    buildEmbedUrl,
    buildDirUrl,
    buildSearchUrl,
  };

  /* ---------- 2. KHỞI TẠO BẢN ĐỒ TƯƠNG TÁC TRÊN INDEX.HTML ---------- */
  const mapSection = $("#ban-do");
  if (!mapSection) return;

  const mapFrame = $("#googleMapFrame");
  const placeListEl = $("#mapPlaceList");
  const sidebarCountEl = $("#mapSidebarCount");
  const searchForm = $("#mapSearchForm");
  const searchInput = $("#mapSearchInput");
  const clearBtn = $("#mapClearBtn");
  const suggestList = $("#mapSuggestList");
  const regionBtns = $$(".map-region-btn");
  const typeBtns = $$(".map-type-btn");

  const activeBadge = $("#mapActiveBadge");
  const activeCoords = $("#mapActiveCoords");
  const activeTitle = $("#mapActiveTitle");
  const activeAddress = $("#mapActiveAddress");
  const dirBtn = $("#mapDirBtn");
  const openLargeBtn = $("#mapOpenLargeBtn");

  let currentPlaceId = MAP_PLACES[0].id;
  let currentCustomQuery = "";
  let currentZoom = MAP_PLACES[0].zoom;
  let currentMapType = "m";
  let activeArea = "all";
  let suggestIndex = -1;

  function updateFrame() {
    const query = currentCustomQuery || (placeById.get(currentPlaceId) || MAP_PLACES[0]).gmapQuery;
    mapFrame.src = buildEmbedUrl(query, currentZoom, currentMapType);
  }

  function selectPlace(id, shouldScrollSidebar = false) {
    const place = placeById.get(id);
    if (!place) return;

    currentPlaceId = place.id;
    currentCustomQuery = "";
    currentZoom = place.zoom;

    activeBadge.textContent = place.badge;
    activeCoords.textContent = `🌐 ${place.coords}`;
    activeTitle.textContent = place.title;
    activeAddress.textContent = `📍 ${place.address} · 🚗 ${place.distance}`;
    dirBtn.href = buildDirUrl(place.gmapQuery);
    openLargeBtn.href = buildSearchUrl(place.gmapQuery);

    updateFrame();

    $$(".map-place-item", placeListEl).forEach((btn) => {
      const active = btn.dataset.id === id;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
      if (active && shouldScrollSidebar) {
        btn.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  function selectCustomLocation(rawText) {
    const clean = rawText.trim();
    if (!clean) return;

    const fullQuery = normalize(clean).includes("dong nai") ? clean : `${clean}, Đồng Nai`;
    currentCustomQuery = fullQuery;
    currentPlaceId = "";
    currentZoom = 14;

    activeBadge.textContent = "Tìm kiếm vị trí";
    activeCoords.textContent = "🌏 Định vị trực tiếp Google Maps";
    activeTitle.textContent = clean;
    activeAddress.textContent = `📍 Hiển thị kết quả trên Google Maps cho từ khóa "${fullQuery}"`;
    dirBtn.href = buildDirUrl(fullQuery);
    openLargeBtn.href = buildSearchUrl(fullQuery);

    $$(".map-place-item", placeListEl).forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-current", "false");
    });

    updateFrame();
    if (window.DNX && window.DNX.showToast) {
      window.DNX.showToast(`📍 Đã định vị "${clean}" trên bản đồ`, "success");
    }
  }

  function renderSidebar() {
    placeListEl.innerHTML = "";
    const filtered = MAP_PLACES.filter((p) => activeArea === "all" || p.area === activeArea);
    sidebarCountEl.textContent = `${filtered.length} địa điểm`;

    filtered.forEach((p) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "map-place-item" + (p.id === currentPlaceId ? " active" : "");
      btn.dataset.id = p.id;
      btn.setAttribute("aria-current", p.id === currentPlaceId ? "true" : "false");
      btn.innerHTML = `
        <img src="${p.image}" alt="" loading="lazy">
        <span class="map-place-text">
          <strong><span class="map-place-num">${p.num}.</span> ${p.shortName}</strong>
          <small>${p.distance}</small>
        </span>
      `;
      btn.addEventListener("click", () => selectPlace(p.id, false));
      placeListEl.appendChild(btn);
    });
  }

  /* ---------- 3. THANH TÌM KIẾM VỊ TRÍ & AUTOCOMPLETE ---------- */
  function getMatchingPlaces(raw) {
    const q = normalize(raw);
    if (!q) return [];
    return MAP_PLACES.filter((p) =>
      normalize(`${p.title} ${p.shortName} ${p.address} ${p.keywords}`).includes(q)
    );
  }

  function closeSuggest() {
    suggestList.hidden = true;
    suggestIndex = -1;
  }

  function renderSuggest() {
    const raw = searchInput.value.trim();
    clearBtn.hidden = !raw;
    if (!raw) {
      closeSuggest();
      return;
    }

    const matches = getMatchingPlaces(raw).slice(0, 6);
    suggestList.innerHTML = "";
    suggestIndex = -1;

    matches.forEach((p) => {
      const li = document.createElement("li");
      li.className = "map-suggest-item";
      li.setAttribute("role", "option");
      li.dataset.id = p.id;
      li.innerHTML = `
        <img src="${p.image}" alt="">
        <div>
          <strong>${p.title}</strong>
          <small>📍 ${p.address}</small>
        </div>
      `;
      li.addEventListener("click", () => {
        searchInput.value = p.shortName;
        closeSuggest();
        ensurePlaceVisibleInSidebar(p.id);
        selectPlace(p.id, true);
      });
      suggestList.appendChild(li);
    });

    // Dòng tìm kiếm tự do bất kỳ địa điểm nào tại Đồng Nai trên Google Maps
    const customLi = document.createElement("li");
    customLi.className = "map-suggest-item map-suggest-custom";
    customLi.setAttribute("role", "option");
    customLi.dataset.custom = raw;
    customLi.innerHTML = `
      <span class="custom-pin" aria-hidden="true">🌏</span>
      <div>
        <strong>Tìm "${raw.replace(/</g, "&lt;")}" trên Google Maps Đồng Nai</strong>
        <small>Định vị trực tiếp bất kỳ địa danh, quán ăn hoặc tuyến đường nào</small>
      </div>
    `;
    customLi.addEventListener("click", () => {
      closeSuggest();
      selectCustomLocation(raw);
    });
    suggestList.appendChild(customLi);

    suggestList.hidden = false;
  }

  function ensurePlaceVisibleInSidebar(placeId) {
    if (activeArea !== "all") {
      const p = placeById.get(placeId);
      if (p && p.area !== activeArea) {
        activeArea = "all";
        regionBtns.forEach((b) => b.classList.toggle("active", b.dataset.area === "all"));
        renderSidebar();
      }
    }
  }

  searchInput.addEventListener("input", renderSuggest);
  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim()) renderSuggest();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (suggestList.hidden) return;
    const items = $$(".map-suggest-item", suggestList);
    if (!items.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      suggestIndex = (suggestIndex + 1) % items.length;
      items.forEach((el, i) => el.classList.toggle("highlighted", i === suggestIndex));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      suggestIndex = (suggestIndex - 1 + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle("highlighted", i === suggestIndex));
    } else if (e.key === "Escape") {
      closeSuggest();
    }
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const raw = searchInput.value.trim();
    if (!raw) {
      searchInput.focus();
      return;
    }

    const items = $$(".map-suggest-item", suggestList);
    if (!suggestList.hidden && suggestIndex >= 0 && items[suggestIndex]) {
      items[suggestIndex].click();
      return;
    }

    closeSuggest();
    const matches = getMatchingPlaces(raw);
    if (matches.length > 0) {
      ensurePlaceVisibleInSidebar(matches[0].id);
      selectPlace(matches[0].id, true);
      if (window.DNX && window.DNX.showToast) {
        window.DNX.showToast(`📍 Đã tìm thấy "${matches[0].shortName}" trên bản đồ`, "success");
      }
    } else {
      selectCustomLocation(raw);
    }
  });

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    clearBtn.hidden = true;
    closeSuggest();
    searchInput.focus();
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".map-input-wrap")) closeSuggest();
  });

  /* ---------- 4. LỌC KHU VỰC & ĐỔI CHẾ ĐỘ BẢN ĐỒ / VỆ TINH ---------- */
  regionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      regionBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeArea = btn.dataset.area;
      renderSidebar();
      const firstInArea = MAP_PLACES.find((p) => activeArea === "all" || p.area === activeArea);
      if (firstInArea && (!currentPlaceId || (activeArea !== "all" && placeById.get(currentPlaceId)?.area !== activeArea))) {
        selectPlace(firstInArea.id, false);
      }
    });
  });

  typeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      typeBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentMapType = btn.dataset.maptype;
      updateFrame();
    });
  });

  /* ---------- 5. NÚT "📍 BẢN ĐỒ" TỪ 12 THẺ ĐIỂM ĐẾN ---------- */
  const cardGrid = $("#cardGrid");
  if (cardGrid) {
    cardGrid.addEventListener("click", (e) => {
      const mapBtn = e.target.closest(".btn-map-jump");
      if (!mapBtn) return;
      const card = mapBtn.closest(".card");
      if (!card || !card.dataset.id) return;
      ensurePlaceVisibleInSidebar(card.dataset.id);
      selectPlace(card.dataset.id, true);
      mapSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  renderSidebar();
  selectPlace(MAP_PLACES[0].id, false);
})();
