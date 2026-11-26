/* =========================================================
   ĐỒNG NAI XANH - JavaScript dùng chung cho cả 2 trang
   Tính năng:
1. Chế độ Sáng/Tối (lưu localStorage)
2. Menu mobile (hamburger) + header đổi bóng khi cuộn
3. Slider ảnh tự động (trang Du lịch)
4. Tìm kiếm (không dấu) + lọc theo nhóm + sắp xếp theo giá
5. Yêu thích món ăn (lưu localStorage - trang Đặc sản)
6. Modal xem chi tiết
7. Accordion kinh nghiệm
8. Kiểm tra dữ liệu form liên hệ (Form validation)
9. Hiệu ứng xuất hiện khi cuộn, đếm số, nút lên đầu trang
   ========================================================= */
(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /** Bỏ dấu tiếng Việt để tìm kiếm dễ hơn: "Hồ Trị An" -> "ho tri an" */
  const normalize = (str) =>
    str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/\s+/g, " ")
      .trim();

  /** localStorage an toàn (một số trình duyệt chặn khi mở file trực tiếp) */
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : JSON.parse(v);
      } catch (e) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* bỏ qua */
      }
    },
  };

  /* ---------- Toast thông báo ---------- */
  const toastEl = $("#toast");
  let toastTimer;
  function showToast(message, type = "") {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.className = "toast show " + type;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 3200);
  }

  /* =====================================================
1. CHẾ ĐỘ SÁNG / TỐI
     ===================================================== */
  const root = document.documentElement;
  const themeBtn = $("#themeToggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeBtn) {
      themeBtn.textContent = theme === "dark" ? "☀️" : "🌙";
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Chuyển sang chế độ sáng" : "Chuyển sang chế độ tối");
    }
  }

  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(store.get("dn-theme", prefersDark ? "dark" : "light"));

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      store.set("dn-theme", next);
    });
  }

  /* =====================================================
2. MENU MOBILE + HEADER KHI CUỘN
     ===================================================== */
  const menuBtn = $("#menuToggle");
  const nav = $("#mainNav");

  function closeMenu() {
    if (!nav || !menuBtn) return;
    nav.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    menuBtn.setAttribute("aria-label", "Mở menu");
  }

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(isOpen));
      menuBtn.setAttribute("aria-label", isOpen ? "Đóng menu" : "Mở menu");
    });
    $$("a", nav).forEach((a) => a.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) closeMenu();
    });
  }

  /* ---------- 2b. MENU XỔ XUỐNG (Du lịch / Đặc sản) ---------- */
  const dropdowns = $$(".has-dropdown");

  function closeDropdowns(except) {
    dropdowns.forEach((dd) => {
      if (dd === except) return;
      dd.classList.remove("open");
      $(".dropdown-toggle", dd).setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach((dd) => {
    const toggle = $(".dropdown-toggle", dd);
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = dd.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      closeDropdowns(dd); // chỉ mở 1 menu tại 1 thời điểm
    });
    // Bấm vào 1 mục con -> đóng menu
    $$(".dropdown a", dd).forEach((a) => a.addEventListener("click", () => closeDropdowns()));
  });

  // Bấm ra ngoài hoặc nhấn Esc -> đóng menu xổ xuống
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".has-dropdown")) closeDropdowns();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeDropdowns();
  });

  const header = $("#siteHeader");
  const backToTop = $("#backToTop");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 10);
    if (backToTop) backToTop.classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* =====================================================
3. SLIDER ẢNH (chỉ có ở trang Du lịch)
     ===================================================== */
  const slider = $("#heroSlider");
  if (slider) {
    const slides = $$(".slide", slider);
    const dotsWrap = $(".slider-dots", slider);
    let current = 0;
    let timer = null;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", "Chuyển tới ảnh " + (i + 1));
      dot.addEventListener("click", () => {
        goTo(i);
        restart();
      });
      dotsWrap.appendChild(dot);
    });
    const dots = $$(".dot", dotsWrap);

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach((s, i) => {
        s.classList.toggle("active", i === current);
        s.setAttribute("aria-hidden", String(i !== current));
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === current));
    }

    const next = () => goTo(current + 1);
    const prev = () => goTo(current - 1);
    function restart() {
      clearInterval(timer);
      timer = setInterval(next, 5000);
    }

    $(".slider-btn.next", slider).addEventListener("click", () => { next(); restart(); });
    $(".slider-btn.prev", slider).addEventListener("click", () => { prev(); restart(); });
    slider.addEventListener("mouseenter", () => clearInterval(timer));
    slider.addEventListener("mouseleave", restart);

    // Vuốt trên điện thoại
    let startX = 0;
    slider.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 50) {
        diff < 0 ? next() : prev();
        restart();
      }
    });

    goTo(0);
    restart();
  }

  /* =====================================================
     4 + 5. TÌM KIẾM, LỌC, SẮP XẾP, YÊU THÍCH
     ===================================================== */
  const grid = $("#cardGrid");
  if (grid) {
    const cards = $$(".card", grid);
    const searchInput = $("#searchInput");
    const chips = $$(".chip");
    const sortSelect = $("#sortSelect");
    const favOnly = $("#favOnly");
    const emptyState = $("#emptyState");
    const resultCount = $("#resultCount");
    const unit = $(".fav-btn", grid) ? "món" : "điểm đến";
    let activeFilter = "all";
    let favs = new Set(store.get("dn-favs", []));

    // Ghi nhớ thứ tự gốc để có thể sắp xếp lại "Mặc định"
    cards.forEach((card, i) => (card.dataset.order = i));

    function applyFilters() {
      const q = normalize(searchInput ? searchInput.value : "");
      let visible = 0;

      cards.forEach((card) => {
        const matchCategory = activeFilter === "all" || card.dataset.category === activeFilter;
        const matchSearch = !q || normalize(card.textContent).includes(q);
        const matchFav = !favOnly || !favOnly.checked || favs.has(card.dataset.id);
        const show = matchCategory && matchSearch && matchFav;
        card.hidden = !show;
        if (show) visible++;
      });

      if (emptyState) emptyState.hidden = visible > 0;
      if (resultCount) resultCount.textContent = `Đang hiển thị ${visible}/${cards.length} ${unit}`;
    }

    function applySort() {
      if (!sortSelect) return;
      const mode = sortSelect.value;
      const sorted = [...cards].sort((a, b) => {
        if (mode === "asc") return a.dataset.price - b.dataset.price;
        if (mode === "desc") return b.dataset.price - a.dataset.price;
        if (mode === "name") {
          return $(".card-title", a).textContent.localeCompare($(".card-title", b).textContent, "vi");
        }
        return a.dataset.order - b.dataset.order;
      });
      sorted.forEach((card) => grid.appendChild(card));
    }

    // Tìm kiếm (debounce nhẹ)
    let searchTimer;
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(applyFilters, 150);
      });
    }

    // Chip lọc
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeFilter = chip.dataset.filter;
        applyFilters();
      });
    });

    if (sortSelect) sortSelect.addEventListener("change", applySort);
    if (favOnly) favOnly.addEventListener("change", applyFilters);

    // Yêu thích
    const HEART_SVG = '<svg class="heart-icon" viewBox="0 0 24 24" width="21" height="21" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';

    function renderFavs() {
      cards.forEach((card) => {
        const btn = $(".fav-btn", card);
        if (!btn) return;
        const isFav = favs.has(card.dataset.id);
        if (!$(".heart-icon", btn)) btn.innerHTML = HEART_SVG;
        btn.setAttribute("aria-pressed", String(isFav));
        btn.setAttribute("aria-label", isFav ? "Bỏ yêu thích" : "Yêu thích");
        btn.setAttribute("title", isFav ? "Bỏ khỏi món yêu thích" : "Lưu món yêu thích");
      });
      const count = favs.size;
      const favCount = $("#favCount");
      const favStat = $("#favStat");
      if (favCount) favCount.textContent = count;
      if (favStat) favStat.textContent = count;
    }

    grid.addEventListener("click", (e) => {
      const favBtn = e.target.closest(".fav-btn");
      if (favBtn) {
        const card = favBtn.closest(".card");
        const id = card.dataset.id;
        const name = $(".card-title", card).textContent;
        if (favs.has(id)) {
          favs.delete(id);
          showToast(`Đã bỏ "${name}" khỏi danh sách yêu thích`);
        } else {
          favs.add(id);
          favBtn.classList.remove("is-fav");
          void favBtn.offsetWidth; // khởi động lại animation
          favBtn.classList.add("is-fav");
          showToast(`❤️ Đã thêm "${name}" vào yêu thích`, "success");
        }
        store.set("dn-favs", [...favs]);
        renderFavs();
        applyFilters();
        return;
      }

      const detailBtn = e.target.closest(".btn-detail");
      if (detailBtn) openModal(detailBtn.closest(".card"));
    });

    renderFavs();
    applyFilters();
  }

  /* =====================================================
6. MODAL CHI TIẾT
     ===================================================== */
  const modal = $("#detailModal");
  let lastFocused = null;

  function openModal(card) {
    if (!modal || !card) return;
    lastFocused = document.activeElement;

    const media = $(".card-media", card);
    const modalMedia = $(".modal-media", modal);
    modalMedia.setAttribute("style", media.getAttribute("style") || "");
    modalMedia.innerHTML = "";
    ["img", ".badge", ".card-emoji"].forEach((sel) => {
      const el = $(sel, media);
      if (el) modalMedia.appendChild(el.cloneNode(true));
    });

    $("#modalTitle").textContent = $(".card-title", card).textContent;

    const meta = $(".card-meta", card);
    const modalMeta = $("#modalMeta");
    modalMeta.innerHTML = meta ? meta.innerHTML : "";
    modalMeta.hidden = !meta;

    const content = $("#modalContent");
    content.innerHTML = "";
    const desc = document.createElement("p");
    desc.textContent = $(".card-desc", card).textContent;
    content.appendChild(desc);
    const more = $(".card-more", card);
    if (more) content.insertAdjacentHTML("beforeend", more.innerHTML);
    const price = $(".price-tag", card);
    if (price) content.appendChild(price.cloneNode(true));

    // Nếu điểm đến có tọa độ trong DNX_MAP -> nhúng bản đồ Google Maps & nút Chỉ đường ngay trong Modal
    if (window.DNX_MAP && card.dataset.id) {
      const place = window.DNX_MAP.getPlace(card.dataset.id);
      if (place) {
        const mapBox = document.createElement("div");
        mapBox.className = "modal-map-box";
        mapBox.innerHTML = `
          <h4>🗺️ Vị trí thực tế trên Google Maps</h4>
          <p class="modal-map-addr">📍 ${place.address} (${place.coords})</p>
          <div class="modal-map-frame">
            <iframe
              title="Bản đồ ${place.shortName}"
              src="${window.DNX_MAP.buildEmbedUrl(place.gmapQuery, place.zoom, "m")}"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          <div class="modal-map-actions">
            <a href="${window.DNX_MAP.buildDirUrl(place.gmapQuery)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary">🧭 Chỉ đường Google Maps ↗</a>
            <a href="${window.DNX_MAP.buildSearchUrl(place.gmapQuery)}" target="_blank" rel="noopener noreferrer" class="btn btn-outline">🌏 Xem bản đồ lớn ↗</a>
          </div>
        `;
        content.appendChild(mapBox);
      }
    }

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => modal.classList.add("show"));
    $(".modal-close", modal).focus();
  }

  function closeModal() {
    if (!modal || modal.hidden) return;
    modal.classList.remove("show");
    document.body.style.overflow = "";
    setTimeout(() => {
      modal.hidden = true;
      if (lastFocused) lastFocused.focus();
    }, 250);
  }

  if (modal) {
    $(".modal-close", modal).addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  }

  /* =====================================================
7. ACCORDION
     ===================================================== */
  const accHeaders = $$(".accordion-header");
  accHeaders.forEach((btn) => {
    btn.addEventListener("click", () => {
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      // Đóng tất cả mục khác
      accHeaders.forEach((other) => {
        other.setAttribute("aria-expanded", "false");
        other.parentElement.classList.remove("open");
        other.nextElementSibling.style.maxHeight = null;
      });
      if (!isOpen) {
        btn.setAttribute("aria-expanded", "true");
        btn.parentElement.classList.add("open");
        const panel = btn.nextElementSibling;
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    });
  });
  if (accHeaders.length) accHeaders[0].click(); // mở sẵn mục đầu tiên

  /* =====================================================
8. KIỂM TRA FORM LIÊN HỆ
     ===================================================== */
  const form = $("#contactForm");
  if (form) {
    const dateInput = $("#date", form);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const pad = (n) => String(n).padStart(2, "0");
    dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;

    const rules = {
      fullname: (v) => {
        if (!v.trim()) return "Vui lòng nhập họ và tên.";
        if (v.trim().length < 2) return "Họ tên phải có ít nhất 2 ký tự.";
        if (!/^[\p{L}\s]+$/u.test(v.trim())) return "Họ tên chỉ được chứa chữ cái.";
        return "";
      },
      phone: (v) => {
        const p = v.replace(/[\s.-]/g, "");
        if (!p) return "Vui lòng nhập số điện thoại.";
        if (!/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(p)) return "Số điện thoại không hợp lệ (VD: 0912345678).";
        return "";
      },
      email: (v) => {
        if (!v.trim()) return "Vui lòng nhập email.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())) return "Email không đúng định dạng.";
        return "";
      },
      destination: (v) => (v ? "" : "Vui lòng chọn điểm đến."),
      date: (v) => {
        if (!v) return "Vui lòng chọn ngày khởi hành.";
        const d = new Date(v + "T00:00:00");
        if (d < today) return "Ngày khởi hành không được ở quá khứ.";
        return "";
      },
      people: (v) => {
        if (!v) return "Vui lòng nhập số người.";
        const n = Number(v);
        if (!Number.isInteger(n) || n < 1 || n > 50) return "Số người phải từ 1 đến 50.";
        return "";
      },
      message: (v) => (v.length > 500 ? "Lời nhắn tối đa 500 ký tự." : ""),
      agree: (_, el) => (el.checked ? "" : "Bạn cần đồng ý để chúng tôi liên hệ."),
    };

    function validateField(name) {
      const el = form.elements[name];
      const group = el.closest(".form-group");
      const msg = rules[name](el.value, el);
      $(".error-msg", group).textContent = msg;
      group.classList.toggle("invalid", !!msg);
      group.classList.toggle("valid", !msg && el.type !== "checkbox" && el.value !== "");
      el.setAttribute("aria-invalid", String(!!msg));
      return !msg;
    }

    Object.keys(rules).forEach((name) => {
      const el = form.elements[name];
      el.addEventListener("blur", () => validateField(name));
      el.addEventListener(el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input", () => {
        if (el.closest(".form-group").classList.contains("invalid") || el.type === "checkbox") validateField(name);
      });
    });

    // Đếm ký tự lời nhắn
    const msgEl = $("#message", form);
    const charCount = $("#charCount");
    msgEl.addEventListener("input", () => (charCount.textContent = `${msgEl.value.length}/500`));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const results = Object.keys(rules).map(validateField);
      if (results.every(Boolean)) {
        const name = form.elements.fullname.value.trim();
        const dest = form.elements.destination.value;
        showToast(`🎉 Cảm ơn ${name}! Chúng tôi sẽ liên hệ tư vấn chuyến đi ${dest} sớm nhất.`, "success");
        form.reset();
        resetFormState();
      } else {
        showToast("Vui lòng kiểm tra lại các trường được đánh dấu đỏ.", "error");
        const firstInvalid = $(".form-group.invalid input, .form-group.invalid select, .form-group.invalid textarea", form);
        if (firstInvalid) firstInvalid.focus();
      }
    });

    function resetFormState() {
      $$(".form-group", form).forEach((g) => g.classList.remove("invalid", "valid"));
      $$(".error-msg", form).forEach((m) => (m.textContent = ""));
      charCount.textContent = "0/500";
    }
    form.addEventListener("reset", () => setTimeout(resetFormState, 0));
  }

  /* =====================================================
9. HIỆU ỨNG KHI CUỘN + ĐẾM SỐ + NĂM HIỆN TẠI
     ===================================================== */
  /** Định dạng số: data-format="vi" -> 12.737,18 ; mặc định giữ nguyên (VD năm 1988) */
  function formatCount(el, value) {
    const decimals = Number(el.dataset.decimals || 0);
    if (el.dataset.format === "vi") {
      return value.toLocaleString("vi-VN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
    }
    return decimals ? value.toFixed(decimals) : String(Math.round(value));
  }

  function animateCount(el) {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = formatCount(el, target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const revealEls = $$(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          const counter = $("[data-count]", entry.target);
          if (counter) animateCount(counter);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
    $$("[data-count]").forEach((el) => (el.textContent = formatCount(el, Number(el.dataset.count)) + (el.dataset.suffix || "")));
  }

  /* =====================================================
     10. TABS (trang Giới thiệu)
     ===================================================== */
  const tabList = $('[role="tablist"].tabs');
  if (tabList) {
    const tabs = $$('[role="tab"]', tabList);

    function activateTab(tab, setFocus) {
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute("aria-selected", String(selected));
        t.tabIndex = selected ? 0 : -1;
        const panel = document.getElementById(t.getAttribute("aria-controls"));
        if (panel) panel.hidden = !selected;
      });
      if (setFocus) tab.focus();
    }

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activateTab(tab, false));
      // Điều hướng bằng phím mũi tên trái/phải
      tab.addEventListener("keydown", (e) => {
        let next = null;
        if (e.key === "ArrowRight") next = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") next = tabs[0];
        if (e.key === "End") next = tabs[tabs.length - 1];
        if (next) {
          e.preventDefault();
          activateTab(next, true);
        }
      });
    });

    // Bấm vào từng mục con (.figure-interactive) để xem thêm chi tiết
    function collapsePanelDetails(panel) {
      $$(".figure-interactive", panel).forEach((b) => {
        b.setAttribute("aria-expanded", "false");
        const txt = $(".hint-text", b);
        if (txt) txt.textContent = "Xem chi tiết";
      });
      $$(".figure-detail", panel).forEach((d) => {
        d.hidden = true;
      });
    }

    $$(".figure-interactive").forEach((btn) => {
      btn.addEventListener("click", () => {
        const panel = btn.closest(".tab-panel");
        const detailId = btn.getAttribute("aria-controls");
        const detailEl = detailId ? document.getElementById(detailId) : null;
        if (!panel || !detailEl) return;

        const isOpen = btn.getAttribute("aria-expanded") === "true";
        collapsePanelDetails(panel);

        if (!isOpen) {
          btn.setAttribute("aria-expanded", "true");
          const txt = $(".hint-text", btn);
          if (txt) txt.textContent = "Thu gọn";
          detailEl.hidden = false;
          detailEl.style.animation = "none";
          void detailEl.offsetWidth;
          detailEl.style.animation = "";
          detailEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      });
    });

    $$(".figure-detail-close").forEach((closeBtn) => {
      closeBtn.addEventListener("click", () => {
        const detailEl = closeBtn.closest(".figure-detail");
        const panel = closeBtn.closest(".tab-panel");
        if (!panel || !detailEl) return;
        const trigger = $(`.figure-interactive[aria-controls="${detailEl.id}"]`, panel);
        collapsePanelDetails(panel);
        if (trigger) trigger.focus();
      });
    });
  }

  $$(".year").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* =====================================================
     10b. BỘ LỌC LÀNG NGHỀ (trang Nghệ thuật)
     ===================================================== */
  const craftList = $("#craftList");
  if (craftList) {
    const craftCards = $$(".craft-card", craftList);
    const craftChips = $$(".craft-chip");
    craftChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        craftChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const reg = chip.dataset.region;
        craftCards.forEach((card) => {
          const show = reg === "all" || card.dataset.region === reg;
          card.hidden = !show;
          if (show) card.classList.add("visible");
        });
      });
    });
  }

  /* =====================================================
     10c. TRUNG TÂM HỖ TRỢ - TÌM KIẾM & CHỦ ĐỀ HOT (ho-tro.html)
     ===================================================== */
  const helpList = $("#helpTopicList");
  if (helpList) {
    const helpItems = $$(".help-item", helpList);
    const helpInput = $("#helpSearchInput");
    const helpClear = $("#helpSearchClear");
    const hotPills = $$(".hot-pill");
    const helpCatChips = $$(".help-cat-chip");
    const helpCount = $("#helpResultCount");
    const helpEmpty = $("#helpEmptyState");
    let activeHelpCat = "all";

    function toggleHelpItem(item, forceOpen) {
      const btn = $(".help-item-btn", item);
      const ans = $(".help-answer", item);
      const nextState = typeof forceOpen === "boolean" ? forceOpen : btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(nextState));
      ans.hidden = !nextState;
    }

    helpItems.forEach((item) => {
      $(".help-item-btn", item).addEventListener("click", () => toggleHelpItem(item));
    });

    function filterHelpTopics(autoExpandFirst = false) {
      const raw = helpInput ? helpInput.value.trim() : "";
      const q = normalize(raw);
      if (helpClear) helpClear.hidden = !raw;

      let visible = 0;
      let firstVisible = null;
      helpItems.forEach((item) => {
        const matchCat = activeHelpCat === "all" || item.dataset.cat === activeHelpCat;
        const matchText = !q || normalize(item.textContent).includes(q);
        const show = matchCat && matchText;
        item.hidden = !show;
        if (show) {
          visible++;
          if (!firstVisible) firstVisible = item;
        }
      });

      helpList.hidden = visible === 0;
      if (helpEmpty) helpEmpty.hidden = visible > 0;
      if (helpCount) helpCount.textContent = `Đang hiển thị ${visible}/${helpItems.length} chủ đề`;

      if (autoExpandFirst && firstVisible && q) {
        helpItems.forEach((it) => toggleHelpItem(it, it === firstVisible));
      }
    }

    if (helpInput) {
      helpInput.addEventListener("input", () => {
        const cur = normalize(helpInput.value);
        hotPills.forEach((p) => p.classList.toggle("active", normalize(p.dataset.query) === cur && cur !== ""));
        filterHelpTopics(false);
      });
    }

    if (helpClear && helpInput) {
      helpClear.addEventListener("click", () => {
        helpInput.value = "";
        hotPills.forEach((p) => p.classList.remove("active"));
        filterHelpTopics(false);
        helpInput.focus();
      });
    }

    hotPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        const wasActive = pill.classList.contains("active");
        hotPills.forEach((p) => p.classList.remove("active"));
        if (wasActive) {
          helpInput.value = "";
          filterHelpTopics(false);
        } else {
          pill.classList.add("active");
          activeHelpCat = "all";
          helpCatChips.forEach((c) => c.classList.toggle("active", c.dataset.cat === "all"));
          helpInput.value = pill.dataset.query;
          filterHelpTopics(true);
        }
      });
    });

    helpCatChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        helpCatChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        activeHelpCat = chip.dataset.cat;
        filterHelpTopics(false);
      });
    });

    filterHelpTopics(false);
  }

  /* =====================================================
     11. LIÊN KẾT SÂU TỪ TRANG GỢI Ý (?item=... & ?dest=...)
     ===================================================== */
  try {
    const params = new URLSearchParams(window.location.search);
    const targetItem = params.get("item");
    if (targetItem && grid) {
      const targetCard = $(`.card[data-id="${CSS.escape(targetItem)}"]`, grid);
      if (targetCard) {
        targetCard.hidden = false;
        targetCard.classList.add("visible", "card-highlight");
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 250);
      }
    }

    const targetArt = params.get("art");
    if (targetArt) {
      const artEl = $(`[data-art-id="${CSS.escape(targetArt)}"]`);
      if (artEl) {
        artEl.hidden = false;
        artEl.classList.add("visible", "card-highlight");
        setTimeout(() => {
          artEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 250);
      }
    }

    const targetDest = params.get("dest");
    if (targetDest && form && form.elements.destination) {
      const destSelect = form.elements.destination;
      const matchOpt = Array.from(destSelect.options).find((opt) => opt.value === targetDest || opt.textContent === targetDest);
      if (matchOpt) destSelect.value = matchOpt.value;
    }
  } catch (e) {
    /* bỏ qua nếu trình duyệt hạn chế URLSearchParams */
  }

  /* =====================================================
     12. ĐỒNG BỘ NÚT ĐĂNG NHẬP GÓC PHẢI TRÊN TOÀN WEB
     ===================================================== */
  function syncAuthHeader() {
    const authBtn = $("#headerAuthBtn");
    const user = store.get("dn-user", null);
    if (authBtn) {
      const labelEl = $(".auth-label", authBtn);
      if (user && user.fullname) {
        const shortName = user.fullname.trim().split(/\s+/).slice(-2).join(" ");
        authBtn.classList.add("is-logged");
        if (labelEl) labelEl.textContent = shortName;
        authBtn.setAttribute("title", `Tài khoản: ${user.fullname}`);
      } else {
        authBtn.classList.remove("is-logged");
        if (labelEl) labelEl.innerHTML = 'Đăng nhập<span class="auth-extra"> / Đăng ký</span>';
        authBtn.removeAttribute("title");
      }
    }

    // Tự điền thông tin liên hệ ở trang chủ nếu người dùng đã đăng nhập
    if (user && form) {
      if (form.elements.fullname && !form.elements.fullname.value) form.elements.fullname.value = user.fullname || "";
      if (form.elements.email && !form.elements.email.value) form.elements.email.value = user.email || "";
      if (form.elements.phone && !form.elements.phone.value) form.elements.phone.value = user.phone || "";
    }
  }

  syncAuthHeader();

  // Xuất các tiện ích dùng chung cho quiz.js & auth.js
  window.DNX = { openModal, showToast, store, syncAuthHeader };
})();