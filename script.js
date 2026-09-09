const views = [...document.querySelectorAll(".view")];
const navDrawer = document.getElementById("navDrawer");
const menuBtn = document.getElementById("menuBtn");
const viewIndicator = document.getElementById("viewIndicator");
const lensBtn = document.getElementById("lensBtn");
const lensModal = document.getElementById("lensModal");
const closeLens = document.getElementById("closeLens");

const lenses = {
  ai: {
    label: "AI ENGINEER",
    hero: "I build intelligent systems across computer vision, reinforcement learning, generative deep learning and optimisation — grounded by production engineering experience."
  },
  data: {
    label: "DATA SCIENTIST",
    hero: "I move from messy real-world data to features, models and evidence — with hands-on work in time series, classification, statistical validation and optimisation."
  },
  industrial: {
    label: "INDUSTRIAL AI",
    hero: "I sit at the intersection of industrial systems and AI: real-time SCADA, SQL data and production workflows on one side; machine learning and intelligent decision-making on the other."
  },
  software: {
    label: "SOFTWARE ENGINEER",
    hero: "I design software around real constraints — integrating data, applications and intelligent components across industrial systems, web applications and algorithmic projects."
  }
};

function showView(id, updateHash=true) {
  const target = document.getElementById(id) || document.getElementById("home");
  views.forEach(v => v.classList.toggle("active", v === target));
  const index = views.indexOf(target) + 1;
  viewIndicator.textContent = `${String(index).padStart(2,"0")} / ${String(views.length).padStart(2,"0")}`;
  navDrawer.classList.remove("open");
  navDrawer.setAttribute("aria-hidden","true");
  if (updateHash) history.replaceState(null, "", `#${target.id}`);
  window.scrollTo({top:0, behavior:"smooth"});
}

document.addEventListener("click", e => {
  const viewTarget = e.target.closest("[data-view]");
  if (viewTarget) {
    e.preventDefault();
    showView(viewTarget.dataset.view);
  }
});

menuBtn.addEventListener("click", () => {
  const open = navDrawer.classList.toggle("open");
  navDrawer.setAttribute("aria-hidden", String(!open));
});

lensBtn.addEventListener("click", () => {
  lensModal.classList.add("open");
  lensModal.setAttribute("aria-hidden","false");
});
closeLens.addEventListener("click", closeLensModal);
lensModal.addEventListener("click", e => { if(e.target === lensModal) closeLensModal(); });
function closeLensModal(){ lensModal.classList.remove("open"); lensModal.setAttribute("aria-hidden","true"); }

function applyLens(key) {
  const lens = lenses[key];
  document.querySelector("#home .hero-lede").textContent = lens.hero;
  lensBtn.innerHTML = `Recruiter lens <span>${lens.label}</span>`;
  document.querySelectorAll(".lens-options button").forEach(b => b.classList.toggle("selected", b.dataset.lens === key));
  document.querySelectorAll(".project").forEach(card => {
    const tags = (card.dataset.tags || "").split(",");
    const important =
      key === "ai" ? ["vision","xai","deep-learning","reinforcement-learning","agents","generative-ai","time-series","supervised-learning"].some(t=>tags.includes(t)) :
      key === "data" ? ["generative-ai","time-series","optimisation","supervised-learning"].some(t=>tags.includes(t)) :
      key === "industrial" ? ["optimisation","search"].some(t=>tags.includes(t)) :
      ["search","game-ai"].some(t=>tags.includes(t));
    card.style.opacity = important ? "1" : ".68";
    card.style.filter = important ? "none" : "saturate(.65)";
  });
  closeLensModal();
}
document.querySelectorAll("[data-lens]").forEach(b => b.addEventListener("click", () => applyLens(b.dataset.lens)));

const roleContent = {
    ai: [
      "AI / ML Engineer",
      "Engineer intelligent systems across the full machine learning lifecycle — from data preparation and feature engineering to model development, evaluation, deployment and monitoring. Particular interest in explainable, reliable and production-ready AI."
    ],

    data: [
      "Data Scientist",
      "Turn complex and high-dimensional data into evidence that can drive better decisions. Combine statistical reasoning, experimentation, data analysis, feature engineering and machine learning to uncover patterns, test hypotheses and build predictive solutions."
    ],

    industrial: [
      "Industrial AI",
      "Apply AI where software meets the physical world. Combine SCADA, PLC, industrial telemetry, operational databases and machine learning to develop systems for anomaly detection, predictive maintenance, process optimisation and intelligent operational monitoring."
    ],

    software: [
      "Software Engineer",
      "Design and develop robust software systems that connect data, applications and operational environments. Focus on clean architecture, algorithms, system integration, automation and production reliability while building solutions that are practical to deploy and maintain."
    ]
};
document.querySelectorAll(".role").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".role").forEach(b=>b.classList.remove("active"));
    btn.classList.add("active");
    const [title,text] = roleContent[btn.dataset.role];
    document.getElementById("roleTitle").textContent = title;
    document.getElementById("roleText").textContent = text;
  });
});

window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    closeLensModal();
    navDrawer.classList.remove("open");
  }
  const keys = {"1":"home","2":"ai","3":"bridge","4":"experience","5":"research","6":"contact"};
  if (keys[e.key] && !["INPUT","TEXTAREA"].includes(document.activeElement.tagName)) showView(keys[e.key]);
});

const initial = location.hash.replace("#","");
showView(views.some(v=>v.id===initial) ? initial : "home", false);
applyLens("ai");

document.querySelectorAll(".research-gallery").forEach((gallery) => {

  const image = gallery.querySelector(".research-image");
  const label = gallery.querySelector(".gallery-label");
  const nextButton = gallery.querySelector(".gallery-next");
  const prevButton = gallery.querySelector(".gallery-prev");

  let images = [];

  try {
    images = JSON.parse(gallery.dataset.gallery);
  } catch (error) {
    console.error("Invalid gallery data:", error);
    return;
  }

  if (!images.length) return;

  let currentIndex = 0;


  function showImage(index) {

    currentIndex =
      (index + images.length) % images.length;

    const item = images[currentIndex];

    image.classList.add("gallery-changing");

    setTimeout(() => {

      /*
       * Resolve relative image paths
       * relative to index.html.
       */
      image.src = new URL(
        item.src,
        document.baseURI
      ).href;

      image.alt = item.label;

      label.textContent =
        `${String(currentIndex + 1).padStart(2, "0")} / ` +
        `${String(images.length).padStart(2, "0")} · ` +
        `${item.label}`;

      image.classList.remove("gallery-changing");

    }, 180);
  }


  nextButton.addEventListener("click", (event) => {

    event.preventDefault();
    event.stopPropagation();

    showImage(currentIndex + 1);

  });


  prevButton.addEventListener("click", (event) => {

    event.preventDefault();
    event.stopPropagation();

    showImage(currentIndex - 1);

  });


  /*
   * Click image to advance.
   */
  image.addEventListener("click", () => {

    showImage(currentIndex + 1);

  });


  /*
   * Preload all images.
   */
  images.forEach((item) => {

    const preload = new Image();

    preload.src = new URL(
      item.src,
      document.baseURI
    ).href;

  });


  /*
   * Keyboard navigation.
   */
  gallery.addEventListener("keydown", (event) => {

    if (event.key === "ArrowRight") {
      showImage(currentIndex + 1);
    }

    if (event.key === "ArrowLeft") {
      showImage(currentIndex - 1);
    }

  });


  /*
   * Initial image.
   */
  showImage(0);

});
