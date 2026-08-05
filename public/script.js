/* ===========================================================
   SealedCircle — lightweight client-side router (SPA)
   =========================================================== */

const ROUTES = ["home", "tickets", "details", "bookings"];

const TITLES = {
  home: "SealedCircle",
  tickets: "Choose Your Pass — SealedCircle",
  details: "Your Details — SealedCircle",
  bookings: "Bookings — SealedCircle",
};

function pathForRoute(route) {
  if (route === "home") return "/";
  if (route === "bookings") return "/my-bookings";
  return "/" + route;
}

function routeForPath(path) {
  const clean = path.replace(/\/+$/, "");
  if (clean === "" || clean === "/") return "home";
  if (clean === "/my-bookings") return "bookings";
  const route = clean.replace(/^\//, "");
  return ROUTES.includes(route) ? route : "home";
}

function showRoute(route, { push = true } = {}) {
  if (!ROUTES.includes(route)) route = "home";

  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.toggle("active", section.dataset.page === route);
  });

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.classList.toggle("active", link.dataset.route === route);
  });

  document.title = TITLES[route] || "SealedCircle";

  window.scrollTo({
    top: 0,
    behavior: "auto",
  });

  closeMenu();

  if (push) {
    history.pushState({ route }, "", pathForRoute(route));
  }
}

document.addEventListener("click", (e) => {
  const link = e.target.closest("[data-route]");
  if (!link) return;

  e.preventDefault();
  showRoute(link.dataset.route);
});

window.addEventListener("popstate", (e) => {
  const route =
    (e.state && e.state.route) ||
    routeForPath(location.pathname);

  showRoute(route, { push: false });
});

/* ---------- Mobile Menu ---------- */

function closeMenu() {
  const overlay = document.getElementById("navOverlay");
  if (overlay) overlay.classList.remove("open");
}

function initMenu() {
  const menuBtn = document.getElementById("menuBtn");
  const closeBtn = document.getElementById("closeBtn");
  const overlay = document.getElementById("navOverlay");

  if (!menuBtn || !overlay) return;

  menuBtn.addEventListener("click", () => {
    overlay.classList.add("open");
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeMenu);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeMenu();
    }
  });
}

/* ---------- Details Form ---------- */

function initForms() {
  const detailsForm = document.getElementById("detailsForm");

  if (!detailsForm) return;

  detailsForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const payload = Object.fromEntries(
      new FormData(detailsForm).entries()
    );

    try {
      const res = await fetch("/api/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();

      console.log("Status:", res.status);
      console.log("Response:", responseText);

      alert(
        "Status: " +
          res.status +
          "\n\nResponse:\n" +
          responseText
      );

    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    }
  });
}

/* ---------- QR Payment ---------- */

function initQRModal() {
  const overlay = document.getElementById("qrOverlay");
  const closeBtn = document.getElementById("qrClose");

  const passNameEl = document.getElementById("qrPassName");
  const amountEl = document.getElementById("qrAmount");
  const qrImage = document.getElementById("qrCanvas");

  if (!overlay) return;

  const UPI_ID = "9599471563@pthdfc";
  const PAYEE_NAME = "SealedCircle";

  function openQR(passName, price) {
    passNameEl.textContent = passName;
    amountEl.textContent = "₹" + price;

    const upiUri =
      "upi://pay?pa=" +
      encodeURIComponent(UPI_ID) +
      "&pn=" +
      encodeURIComponent(PAYEE_NAME) +
      "&am=" +
      encodeURIComponent(price) +
      "&cu=INR&tn=" +
      encodeURIComponent(passName + " - SealedCircle");

    qrImage.src =
      "/api/qrcode?text=" +
      encodeURIComponent(upiUri);

    overlay.classList.add("open");
  }

  function closeQR() {
    overlay.classList.remove("open");
  }

  document.querySelectorAll(".access-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      openQR(btn.dataset.pass, btn.dataset.price);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", closeQR);
  }

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeQR();
    }
  });
}

/* ---------- Boot ---------- */

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initForms();
  initQRModal();

  showRoute(
    routeForPath(location.pathname),
    { push: false }
  );
});