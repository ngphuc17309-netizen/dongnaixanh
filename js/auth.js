/* =========================================================
   ĐỒNG NAI XANH - Đăng nhập & Đăng ký tài khoản (dang-nhap.html)
   Lưu trữ tài khoản qua localStorage, kiểm tra dữ liệu hợp lệ,
   hỗ trợ tài khoản dùng thử và hiển thị hồ sơ thành viên.
   ========================================================= */
(function () {
  "use strict";

  const formsWrap = document.getElementById("authFormsWrap");
  if (!formsWrap) return;

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const dnx = window.DNX || {
    showToast: () => {},
    store: { get: (_, fb) => fb, set: () => {} },
    syncAuthHeader: () => {},
  };

  // Khởi tạo sẵn 1 tài khoản mẫu để tiện demo thuyết trình
  const DEFAULT_DEMO = {
    fullname: "Du khách Đồng Nai Xanh",
    email: "demo@dongnaixanh.vn",
    phone: "0901234567",
    password: "123456",
  };

  function getAccounts() {
    const list = dnx.store.get("dn-accounts", []);
    if (!Array.isArray(list) || !list.some((a) => a.email === DEFAULT_DEMO.email)) {
      const merged = [DEFAULT_DEMO, ...(Array.isArray(list) ? list : [])];
      dnx.store.set("dn-accounts", merged);
      return merged;
    }
    return list;
  }

  getAccounts();

  const tabLogin = $("#tabLogin");
  const tabRegister = $("#tabRegister");
  const loginForm = $("#panelLogin");
  const registerForm = $("#panelRegister");
  const profileWrap = $("#profileWrap");

  /* ---------- 1. CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ ---------- */
  function switchTab(mode) {
    const isLogin = mode === "login";
    tabLogin.classList.toggle("active", isLogin);
    tabLogin.setAttribute("aria-selected", String(isLogin));
    tabRegister.classList.toggle("active", !isLogin);
    tabRegister.setAttribute("aria-selected", String(!isLogin));
    loginForm.hidden = !isLogin;
    registerForm.hidden = isLogin;
  }

  tabLogin.addEventListener("click", () => switchTab("login"));
  tabRegister.addEventListener("click", () => switchTab("register"));
  $("#goToRegister").addEventListener("click", () => switchTab("register"));
  $("#goToLogin").addEventListener("click", () => switchTab("login"));

  // Hỗ trợ mở thẳng tab Đăng ký nếu URL có ?mode=register hoặc #dang-ky
  if (window.location.hash === "#dang-ky" || window.location.search.includes("register")) {
    switchTab("register");
  }

  /* ---------- 2. NÚT HIỆN / ẨN MẬT KHẨU ---------- */
  $$(".pwd-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = $("input", btn.parentElement);
      if (!input) return;
      const show = input.type === "password";
      input.type = show ? "text" : "password";
      btn.textContent = show ? "🙈" : "👁️";
    });
  });

  /* ---------- 3. TRỢ GIÚP HIỂN THỊ LỖI FORM ---------- */
  function setFieldError(inputEl, message) {
    const group = inputEl.closest(".form-group");
    if (!group) return !message;
    const errEl = $(".error-msg", group);
    if (errEl) errEl.textContent = message;
    group.classList.toggle("invalid", !!message);
    group.classList.toggle("valid", !message && inputEl.type !== "checkbox" && inputEl.value.trim() !== "");
    inputEl.setAttribute("aria-invalid", String(!!message));
    return !message;
  }

  function clearErrors(formEl) {
    $$(".form-group", formEl).forEach((g) => g.classList.remove("invalid", "valid"));
    $$(".error-msg", formEl).forEach((e) => (e.textContent = ""));
  }

  /* ---------- 4. ĐĂNG NHẬP ---------- */
  $("#fillDemoBtn").addEventListener("click", () => {
    $("#loginIdentifier").value = DEFAULT_DEMO.email;
    $("#loginPassword").value = DEFAULT_DEMO.password;
    clearErrors(loginForm);
    dnx.showToast("Đã điền tài khoản mẫu, bấm Đăng nhập ngay nhé!");
  });

  $("#forgotPwdBtn").addEventListener("click", () => {
    dnx.showToast("💡 Bạn có thể dùng tài khoản mẫu demo@dongnaixanh.vn (MK: 123456) hoặc tạo tài khoản mới!", "");
  });

  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const idInput = $("#loginIdentifier");
    const pwdInput = $("#loginPassword");
    const idVal = idInput.value.trim().toLowerCase();
    const pwdVal = pwdInput.value;

    const okId = setFieldError(idInput, idVal ? "" : "Vui lòng nhập email hoặc số điện thoại.");
    const okPwd = setFieldError(pwdInput, pwdVal ? "" : "Vui lòng nhập mật khẩu.");
    if (!okId || !okPwd) return;

    const cleanPhone = idVal.replace(/[\s.-]/g, "");
    const accounts = getAccounts();
    const found = accounts.find(
      (acc) => acc.email.toLowerCase() === idVal || acc.phone.replace(/[\s.-]/g, "") === cleanPhone
    );

    if (!found) {
      setFieldError(idInput, "Không tìm thấy tài khoản với thông tin này.");
      dnx.showToast("Tài khoản chưa tồn tại, bạn hãy đăng ký nhé!", "error");
      return;
    }

    if (found.password !== pwdVal) {
      setFieldError(pwdInput, "Mật khẩu chưa chính xác.");
      dnx.showToast("Mật khẩu chưa đúng, vui lòng thử lại.", "error");
      return;
    }

    const sessionUser = { fullname: found.fullname, email: found.email, phone: found.phone };
    dnx.store.set("dn-user", sessionUser);
    if (dnx.syncAuthHeader) dnx.syncAuthHeader();
    clearErrors(loginForm);
    loginForm.reset();
    renderAuthView();
    dnx.showToast(`🎉 Chào mừng ${found.fullname} đã đăng nhập thành công!`, "success");
  });

  /* ---------- 5. ĐĂNG KÝ TÀI KHOẢN ---------- */
  registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const nameEl = $("#regName");
    const emailEl = $("#regEmail");
    const phoneEl = $("#regPhone");
    const pwdEl = $("#regPassword");
    const confirmEl = $("#regConfirm");
    const agreeEl = $("#regAgree");

    const nameVal = nameEl.value.trim();
    const emailVal = emailEl.value.trim().toLowerCase();
    const phoneVal = phoneEl.value.replace(/[\s.-]/g, "");
    const pwdVal = pwdEl.value;
    const confirmVal = confirmEl.value;

    const v1 = setFieldError(
      nameEl,
      !nameVal
        ? "Vui lòng nhập họ và tên."
        : nameVal.length < 2
        ? "Họ tên tối thiểu 2 ký tự."
        : ""
    );
    const v2 = setFieldError(
      emailEl,
      !emailVal
        ? "Vui lòng nhập email."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(emailVal)
        ? "Email chưa đúng định dạng."
        : ""
    );
    const v3 = setFieldError(
      phoneEl,
      !phoneVal
        ? "Vui lòng nhập số điện thoại."
        : !/^(0|\+84)(3|5|7|8|9)\d{8}$/.test(phoneVal)
        ? "Số điện thoại chưa hợp lệ (VD: 0912345678)."
        : ""
    );
    const v4 = setFieldError(
      pwdEl,
      !pwdVal ? "Vui lòng tạo mật khẩu." : pwdVal.length < 6 ? "Mật khẩu cần ít nhất 6 ký tự." : ""
    );
    const v5 = setFieldError(
      confirmEl,
      !confirmVal ? "Vui lòng nhập lại mật khẩu." : confirmVal !== pwdVal ? "Mật khẩu nhập lại không khớp." : ""
    );
    const v6 = setFieldError(agreeEl, agreeEl.checked ? "" : "Bạn cần đồng ý với điều khoản để đăng ký.");

    if (!(v1 && v2 && v3 && v4 && v5 && v6)) {
      dnx.showToast("Vui lòng kiểm tra lại các thông tin báo đỏ.", "error");
      return;
    }

    const accounts = getAccounts();
    if (accounts.some((a) => a.email.toLowerCase() === emailVal)) {
      setFieldError(emailEl, "Email này đã được đăng ký trước đó.");
      dnx.showToast("Email này đã có tài khoản, hãy chuyển sang Đăng nhập!", "error");
      return;
    }

    const newAcc = { fullname: nameVal, email: emailVal, phone: phoneVal, password: pwdVal };
    accounts.push(newAcc);
    dnx.store.set("dn-accounts", accounts);

    const sessionUser = { fullname: nameVal, email: emailVal, phone: phoneVal };
    dnx.store.set("dn-user", sessionUser);
    if (dnx.syncAuthHeader) dnx.syncAuthHeader();
    clearErrors(registerForm);
    registerForm.reset();
    renderAuthView();
    dnx.showToast(`🎉 Đăng ký thành công! Xin chào ${nameVal}.`, "success");
  });

  /* ---------- 6. HIỂN THỊ HỒ SƠ & ĐĂNG XUẤT ---------- */
  function renderAuthView() {
    const user = dnx.store.get("dn-user", null);
    if (!user || !user.fullname) {
      formsWrap.hidden = false;
      profileWrap.hidden = true;
      return;
    }

    formsWrap.hidden = true;
    profileWrap.hidden = false;

    const initial = user.fullname.trim().charAt(0).toUpperCase() || "Đ";
    $("#profileAvatar").textContent = initial;
    $("#profileName").textContent = user.fullname;
    $("#profileMeta").textContent = `${user.email} · ${user.phone}`;

    const favs = dnx.store.get("dn-favs", []);
    $("#profileFavCount").textContent = Array.isArray(favs) ? favs.length : 0;

    const quizAns = dnx.store.get("dn-quiz-answers", []);
    const doneQuiz = Array.isArray(quizAns) && quizAns.length > 0 && quizAns.every((x) => x !== null);
    const doneCount = Array.isArray(quizAns) ? quizAns.filter((x) => x !== null).length : 0;
    $("#profileQuizStatus").textContent = doneQuiz ? "Đã hoàn thành" : doneCount > 0 ? `${doneCount}/10 câu` : "Chưa làm";
  }

  $("#logoutBtn").addEventListener("click", () => {
    dnx.store.set("dn-user", null);
    if (dnx.syncAuthHeader) dnx.syncAuthHeader();
    switchTab("login");
    renderAuthView();
    dnx.showToast("Đã đăng xuất khỏi tài khoản.");
  });

  renderAuthView();
})();
