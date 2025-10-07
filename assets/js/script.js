const apiKey = "hQ9dLFxsPsvtCga5ZHz3mk3tTVgbZMQNgtvkvXa2";
const url = "https://api.nasa.gov/planetary/apod?";

const button = document.getElementById("fetch-image");
const hdButton = document.getElementById("fetch-hd");
const loader = document.getElementById("loader");
const warn = document.getElementById("warn");
let imageContainer = document.getElementById("image-container");

(function setToday() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  document.getElementById('date-input').value = `${yyyy}-${mm}-${dd}`;
})();

button.addEventListener("click", () => getImage("normal"));
hdButton.addEventListener("click", () => getImage("hd"));

$("#scrollButton").on("click", function(e) {
  e.preventDefault();
  $("html, body").animate({
    scrollTop: $("#search-section").offset().top
  }, 800);
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
  
  fetch(`${url}date=${date}&api_key=${apiKey}`)
    .then(res => {
      if (!res.ok) throw new Error();
      return res.json();
    })
    .then(data => {
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
      
      document.getElementById("apodimg").addEventListener("click", () => {
        window.location.href = imgUrl;
      });
      
      setTimeout(() => imageContainer.classList.add("visible"), 100);
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