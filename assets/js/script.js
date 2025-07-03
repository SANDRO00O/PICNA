        // API Configuration
        const apiKey = "hQ9dLFxsPsvtCga5ZHz3mk3tTVgbZMQNgtvkvXa2";
        const url = "https://api.nasa.gov/planetary/apod?";
        
        // DOM Elements
        let button = document.getElementById("fetch-image");
        let warn = document.getElementById("warn");
        let hdButton = document.getElementById("fetch-hd");
        let loader = document.getElementById("loader");
        let imageContainer = document.getElementById("image-container");
        
        // Event Listeners
        button.addEventListener("click", () => {
          getImage("normal");
        });
        
        hdButton.addEventListener("click", () => {
          getImage("hd");
        });
        
        // Get Image Function
        function getImage(value) {
          loader.style.display = "block";
          imageContainer.style.display = "none";
          let dateInput = document.getElementById("date-input");
          let date = dateInput.value;
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
            warn.style.display = "block";
            loader.style.display = "none";
            imageContainer.style.display = "block";
            return;
          }
          
          let request = new XMLHttpRequest();
          request.open("GET", url + "date=" + date + "&api_key=" + apiKey, true);
          request.send();
          
          request.onload = function() {
            if (request.status === 200) {
              let data = JSON.parse(request.responseText);
              loader.style.display = "none";
              warn.style.display = "none";
              
              let newImageContainer = document.createElement("div");
              newImageContainer.classList.add("image-container");
              
              let imageUrl;
              let imageTitle = data.title;
              let imageCredit = data.copyright || "NASA";
              
              if (value === "hd" && data.hdurl) {
                imageUrl = data.hdurl;
              } else {
                imageUrl = data.url;
              }
              
              let image = document.createElement("img");
              image.src = imageUrl;
              image.alt = imageTitle;
              newImageContainer.appendChild(image);
              
              let infoContainer = document.createElement("div");
              infoContainer.classList.add("image-info");
              
              let titleElement = document.createElement("h2");
              titleElement.textContent = imageTitle;
              infoContainer.appendChild(titleElement);
              
              let imageDescription = document.createElement("p");
              imageDescription.textContent = data.explanation;
              infoContainer.appendChild(imageDescription);
              
              let creditContainer = document.createElement("div");
              creditContainer.classList.add("image-credit");
              
              let creditElement = document.createElement("div");
              creditElement.textContent = `Image Credit: ${imageCredit}`;
              creditContainer.appendChild(creditElement);
              
              let dateElement = document.createElement("div");
              dateElement.textContent = `Date: ${date}`;
              creditContainer.appendChild(dateElement);
              
              infoContainer.appendChild(creditContainer);
              newImageContainer.appendChild(infoContainer);
              
              document.getElementById("image-section").replaceChild(newImageContainer, imageContainer);
              imageContainer = newImageContainer;
              
              setTimeout(() => {
                imageContainer.classList.add("visible");
              }, 100);
              
              setTimeout(() => {
                document.getElementById("image-section").scrollIntoView({ behavior: 'smooth' });
              }, 500);
            } else {
              window.alert("Error fetching image! Please try again.");
              loader.style.display = "none";
              imageContainer.style.display = "block";
            }
          };
        }
        
        // Smooth Scrolling
        $(document).ready(function() {
          $("#scrollButton").on("click", function(e) {
            e.preventDefault();
            $("html, body").animate({
              scrollTop: $("#search-section").offset().top
            }, 800);
          });
        });
        
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const formattedDate = `${yyyy}-${mm}-${dd}`;
        
        // ضبط قيمة الحقل
        document.getElementById('date-input').value = formattedDate;