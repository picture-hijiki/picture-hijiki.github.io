const ACCESS_CODE = "5493";
const urlParams = new URLSearchParams(window.location.search);
const codeFromUrl = urlParams.get("accesscode");

const authScreen = document.getElementById("auth-screen");
const viewer = document.getElementById("viewer");
const errorScreen = document.getElementById("error-screen");

const daySelect = document.getElementById("day-select");
const sortSelect = document.getElementById("sort-select");
const gallery = document.getElementById("gallery");

function showGallery(day, order) {
  gallery.innerHTML = "";
  if (!day) return;

  const orderMap = order ? [order] : [1, 2, 3, 4];

  for (let num of orderMap) {
    const img = document.createElement("img");
    img.src = `picture/${day}/${num}.jpg`;
    img.alt = `Day ${day} - ${num}`;
    gallery.appendChild(img);
  }
}

daySelect.addEventListener("change", () => {
  showGallery(daySelect.value, sortSelect.value);
});

sortSelect.addEventListener("change", () => {
  showGallery(daySelect.value, sortSelect.value);
});

// 認証処理
function grantAccess() {
  authScreen.classList.add("hidden");
  viewer.classList.remove("hidden");
}

if (codeFromUrl === ACCESS_CODE) {
  grantAccess();
} else {
  document.getElementById("access-btn").addEventListener("click", () => {
    const inputCode = document.getElementById("access-input").value;
    if (inputCode === ACCESS_CODE) {
      grantAccess();
    } else {
      authScreen.classList.add("hidden");
      errorScreen.classList.remove("hidden");
    }
  });
}
