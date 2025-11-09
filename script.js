document.addEventListener("DOMContentLoaded", () => {
    const ACCESS_CODE = "5493";
    const urlParams = new URLSearchParams(window.location.search);
    const codeFromUrl = urlParams.get("accesscode");
  
    const authScreen = document.getElementById("auth-screen");
    const viewer = document.getElementById("viewer");
    const loader = document.getElementById("loader");
    const accessInput = document.getElementById("access-input");
    const errorMessage = document.getElementById("error-message");
    const daySelect = document.getElementById("day-select");
    const sortSelect = document.getElementById("sort-select");
    const gallery = document.getElementById("gallery");
    const sortInfo = document.getElementById("sort-info");
    const accessForm = document.getElementById("access-form");
  
    // フォルダー構造
    const DAYS = ["Day1", "Day2", "Day3", "Day4", "Day5", "Day6", "Day7"];
    const SORT_MAP = {
      "1": "Refrigerator",
      "2": "Ziplock Bag",
      "3": "Plastic Wrap",
      "4": "Room Temperature"
    };
  
    // ギャラリー表示処理
    function showGallery(day, order) {
      gallery.innerHTML = "";
  
      // ソート情報を表示
      if (order) {
        sortInfo.textContent = `Sorting by: ${SORT_MAP[order] || "Default"}`;
      } else {
        sortInfo.textContent = "";
      }
  
      // "All Day" モード
      if (day === "All") {
        DAYS.forEach((d) => {
          const dayHeader = document.createElement("h3");
          dayHeader.textContent = d;
          gallery.appendChild(dayHeader);
  
          const orderMap = order ? [order] : [1, 2, 3, 4];
          for (let num of orderMap) {
            const img = createImageElement(d, num);
            gallery.appendChild(img);
          }
        });
        return;
      }
  
      // 通常の1日分
      const orderMap = order ? [order] : [1, 2, 3, 4];
      for (let num of orderMap) {
        const img = createImageElement(day, num);
        gallery.appendChild(img);
      }
    }
  
    // 画像生成関数（クリックで拡大対応）
    function createImageElement(day, num) {
      const img = document.createElement("img");
      img.src = `picture/${day}/${num}.jpg`;
      img.alt = `${day} - ${num}`;
      img.addEventListener("click", () => openModal(img.src));
      return img;
    }
  
    // 拡大モーダル処理
    function openModal(src) {
      const modal = document.createElement("div");
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <img src="${src}" alt="Enlarged" />
        </div>
      `;
      document.body.appendChild(modal);
  
      // クリックで閉じる
      modal.addEventListener("click", () => {
        modal.classList.add("fade-out");
        setTimeout(() => modal.remove(), 300);
      });
    }
  
    // ロードアニメーション → フェードイン演出
    function grantAccess() {
      authScreen.classList.add("hidden");
      loader.classList.remove("hidden");
  
      setTimeout(() => {
        loader.classList.add("hidden");
        viewer.classList.remove("hidden");
        viewer.classList.add("fade-in");
      }, 2500); // ← ロード時間を長めに設定
    }
  
    // 自動アクセス許可
    if (codeFromUrl === ACCESS_CODE) {
      grantAccess();
      return;
    }
  
    // フォーム認証
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
  
    // セレクト変更
    daySelect.addEventListener("change", () => {
      showGallery(daySelect.value, sortSelect.value);
    });
    sortSelect.addEventListener("change", () => {
      showGallery(daySelect.value, sortSelect.value);
    });
  });
  