const url = "/api/apod?";

const button = document.getElementById("fetch-image");
const hdButton = document.getElementById("fetch-hd");
const loader = document.getElementById("loader");
const warn = document.getElementById("warn");
let imageContainer = document.getElementById("image-container");

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.getElementById("nav");
  const body = document.body;
  
  if (menuToggle && header && nav) {
    // فتح وإغلاق القائمة بالزر
    menuToggle.addEventListener("click", () => {
      nav.classList.toggle("active");
      menuToggle.classList.toggle("active");
      
      if (nav.classList.contains("active")) {
        header.style.background = "#000";
        body.style.overflow = "hidden";
      } else {
        header.style.background = "";
        body.style.overflow = "";
      }
    });
    
    // إغلاق القائمة عند الضغط على أي خيار داخلها
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
        menuToggle.classList.remove("active");
        header.style.background = "";
        body.style.overflow = "";
      });
    });
  }
});

const bgDiv = document.querySelector(".hero-bg");

fetch("/api/apod")
  .then(res => res.json())
  .then(data => {
    let bgUrl = "";

    if (data.media_type === "image") bgUrl = data.url;
    else if (data.media_type === "video") {
      const youtubeMatch = data.url.match(/youtube\.com.*[?&]v=([^&]+)/) || data.url.match(/youtu\.be\/([^?&]+)/);
      if (youtubeMatch) bgUrl = `https://img.youtube.com/vi/${youtubeMatch[1]}/maxresdefault.jpg`;
      else if (data.thumbnail_url) bgUrl = data.thumbnail_url;
    }

    if (!bgUrl) return console.warn("No background found.");

    const img = new Image();
    img.src = bgUrl;
    img.onload = () => {
      bgDiv.style.background = `
        linear-gradient(to top, black 0%, transparent 25%),
        url('${bgUrl}') no-repeat center center / cover`;
      bgDiv.classList.add("loaded");
    };
  })
  .catch(() => console.error("Failed to fetch today's image."));

(function setToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  document.getElementById("date-input").value = `${yyyy}-${mm}-${dd}`;
})();

button.addEventListener("click", () => getImage("normal"));
hdButton.addEventListener("click", () => getImage("hd"));

$("#scrollButton").on("click", e => {
  e.preventDefault();
  $("html, body").animate({ scrollTop: $("#search-section").offset().top }, 800);
});

function getImage(mode) {
  loader.classList.add("active");
  warn.style.opacity = 0;
  imageContainer.classList.remove("visible");

  const date = document.getElementById("date-input").value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    loader.classList.remove("active");
    warn.style.opacity = 1;
    return;
  }

  fetch(`${url}date=${date}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      const newC = document.createElement("div");
      newC.className = "image-container";
      const imgUrl = mode === "hd" && data.hdurl ? data.hdurl : data.url;

      newC.innerHTML = `
        <img id="apodimg" src="${imgUrl}" alt="${data.title}">
        <div class="image-info">
          <h2>${data.title}</h2>
          <p>${data.explanation}</p>
          <div class="image-credit">
            <div>Image Credit: ${data.copyright || "NASA"}</div>
            <div>Date: ${date}</div>
          </div>
        </div>`;

      document.getElementById("image-section").replaceChild(newC, imageContainer);
      imageContainer = newC;

      document.getElementById("apodimg").addEventListener("click", () => {
        window.location.href = imgUrl;
      });

      setTimeout(() => imageContainer.classList.add("visible"), 100);
      setTimeout(() => {
        document.getElementById("image-section").scrollIntoView({ behavior: "smooth" });
      }, 500);
    })
    .catch(() => alert("Error fetching image! Please try again."))
    .finally(() => loader.classList.remove("active"));
}