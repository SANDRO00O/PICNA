// API Configuration
const apiKey = "hQ9dLFxsPsvtCga5ZHz3mk3tTVgbZMQNgtvkvXa2";
const url = "https://api.nasa.gov/planetary/apod?";

// DOM Elements
const button = document.getElementById("fetch-image");
const hdButton = document.getElementById("fetch-hd");
const loader = document.getElementById("loader");
const warn = document.getElementById("warn");
let imageContainer = document.getElementById("image-container");

// Set today's date
(function setToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('date-input').value = `${yyyy}-${mm}-${dd}`;
})();

// Event Listeners
button.addEventListener("click", () => getImage("normal"));
hdButton.addEventListener("click", () => getImage("hd"));

// Smooth scroll for hero button
$("#scrollButton").on("click", function(e) {
  e.preventDefault();
  $("html, body").animate({
    scrollTop: $("#search-section").offset().top
  }, 800);
});

// Fetch and display image
function getImage(mode) {
  // show loader
  loader.classList.add("active");
  // hide warning & previous image
  warn.style.opacity = 0;
  imageContainer.classList.remove("visible");
  
  const date = document.getElementById("date-input").value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    loader.classList.remove("active");
    warn.style.opacity = 1;
    return;
  }
  
  fetch(`${url}date=${date}&api_key=${apiKey}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
      // build new container
      const newC = document.createElement("div");
      newC.className = "image-container";
      const imgUrl = (mode === "hd" && data.hdurl) ? data.hdurl : data.url;
      
      newC.innerHTML = `
        <img id="apodimg" src="${imgUrl}" alt="${data.title}">
        <div class="image-info">
          <h2>${data.title}</h2>
          <p>${data.explanation}</p>
          <div class="image-credit">
            <div>Image Credit: ${data.copyright || 'NASA'}</div>
            <div>Date: ${date}</div>
          </div>
        </div>`;
      
      document.getElementById("image-section").replaceChild(newC, imageContainer);
      imageContainer = newC;
      
      // ✅ اربط الحدث بعد ما تنرسم الصورة
      document.getElementById("apodimg").addEventListener("click", () => {
        window.location.href = imgUrl;
      });
      
      // animate in
      setTimeout(() => imageContainer.classList.add("visible"), 100);
      // scroll into view
      setTimeout(() => {
        document.getElementById("image-section")
          .scrollIntoView({ behavior: 'smooth' });
      }, 500);
    })
    .catch(() => {
      alert("Error fetching image! Please try again.");
    })
    .finally(() => {
      loader.classList.remove("active");
    });
}