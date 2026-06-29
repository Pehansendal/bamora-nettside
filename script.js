const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".desktop-nav");
const header = document.querySelector(".site-header");
const progress = document.querySelector(".scroll-progress");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("menu-open");
    nav.classList.toggle("mobile-active", isOpen);
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Lukk meny" : "Åpne meny");
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      nav.classList.remove("mobile-active");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const form = document.querySelector("#lead-form");
const toast = document.querySelector(".toast");

if (form && toast) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    toast.classList.add("show");
    form.reset();
    window.setTimeout(() => toast.classList.remove("show"), 5000);
  });
}

const revealTargets = document.querySelectorAll(
  ".benefit-row article, .product-card, .steps li, .audience-grid article, .section-heading, .statement-copy, .process-intro > *, .process-step .step-visual, .process-step .step-copy, .summary-grid article"
);

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity .6s ease, transform .6s ease";
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach((el) => observer.observe(el));

  const hero = document.querySelector(".hero-visual");
  const heroFrame = document.querySelector(".hero-frame");

  if (hero && heroFrame) {
    hero.addEventListener("pointermove", (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      heroFrame.style.transform = `scale(1.055) rotateY(${x * 1.8}deg) rotateX(${y * -1.8}deg) translate3d(${x * -8}px, ${y * -8}px, 0)`;
    });

    hero.addEventListener("pointerleave", () => {
      heroFrame.style.transform = "";
    });
  }

  document.querySelectorAll(".product-card").forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      const bounds = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
      card.style.setProperty("--my", `${event.clientY - bounds.top}px`);
    });
  });
}

const updateScrollEffects = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progress.style.width = `${ratio * 100}%`;
  header.classList.toggle("is-scrolled", window.scrollY > 50);

  const salesImage = document.querySelector(".sales-image");
  if (salesImage) {
    const rect = salesImage.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight) {
      const visibleProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      salesImage.style.setProperty("--image-shift", `${-10 + visibleProgress * 10}%`);
    }
  }
};

window.addEventListener("scroll", updateScrollEffects, { passive: true });
updateScrollEffects();
