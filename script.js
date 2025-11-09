document.addEventListener("DOMContentLoaded", () => {
    const ACCESS_CODE = "5493";
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("accesscode");
  
    const loader = document.getElementById("loader");
    const authScreen = document.getElementById("auth-screen");
    const viewer = document.getElementById("viewer");
    const errorScreen = document.getElementById("error-screen");
    const accessForm = document.getElementById("access-form");
    const accessInput = document.getElementById("access-input");
    const errorMessage = document.getElementById("error-message");
    const daySelect = document.getElementById("day-select");
    const sortSelect = document.getElementById("sort-select");
    const gallery = document.getElementById("gallery");
  
    const modal = document.getElementById("modal");
    const modalImg = document.getElementById("modal-img");
    const modalClose = document.getElementById("modal-close");
    const modalBg = document.getElementById("modal-bg");
  
    window.addEventListener("load", () => {
      setTimeout(() => {
        loader.style.display = "none";
        authScreen.classList.add("fade-in");
        setTimeout(() => authScreen.classList.add("show"), 100);
      }, 500);
    });
  
    function showGallery(day, order) {
      gallery.innerHTML = "";
  
      const sortNames = {
        "1": "Refrigerator",
        "2": "Ziplock Bag",
        "3": "Plastic Wrap",
        "4": "Room Temperature"
      };
  
      const sortDisplay = document.getElementById("sort-display");
      sortDisplay.textContent = order && sortNames[order] ? `Sort: ${sortNames[order]}` : "Sort: None";
  
      if (!day) return;
  
      const orderList = order ? [order] : ["1", "2", "3", "4"];
  
      if (day === "All") {
        const dayList = ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"];
        dayList.forEach(d => {
          const section = document.createElement("section");
          section.className = "day-section";
  
          const dayTitle = document.createElement("h3");
          dayTitle.textContent = d;
          section.appendChild(dayTitle);
  
          orderList.forEach(num => {
            const img = document.createElement("img");
            img.src = `picture/${d}/${num}.jpg`;
            img.alt = `${d} - ${num}`;
            section.appendChild(img);
          });
  
          gallery.appendChild(section);
        });
      } else {
        orderList.forEach(num => {
          const img = document.createElement("img");
          img.src = `picture/${day}/${num}.jpg`;
          img.alt = `${day} - ${num}`;
          gallery.appendChild(img);
        });
      }
    }
  
    daySelect.addEventListener("change", () => {
      showGallery(daySelect.value, sortSelect.value);
    });
  
    sortSelect.addEventListener("change", () => {
      showGallery(daySelect.value, sortSelect.value);
    });
  
    function grantAccess() {
      authScreen.classList.add("hidden");
      viewer.classList.remove("hidden");
      viewer.classList.add("fade-in");
      setTimeout(() => viewer.classList.add("show"), 100);
    }
  
    if (codeFromUrl === ACCESS_CODE) {
      grantAccess();
    }
  
    accessForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const inputCode = accessInput.value.trim();
      if (inputCode === ACCESS_CODE) {
        grantAccess();
      } else {
        errorMessage.textContent = "Access code incorrect.";
        accessInput.value = "";
      }
    });
  
    gallery.addEventListener("click", (e) => {
      if (e.target.tagName === "IMG") {
        modalImg.src = e.target.src;
        modal.classList.remove("hidden");
      }
    });
  
    modalClose.addEventListener("click", () => {
      modal.classList.add("hidden");
      modalImg.src = "";
    });
    modalBg.addEventListener("click", () => {
      modal.classList.add("hidden");
      modalImg.src = "";
    });
  });
  