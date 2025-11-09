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
  const modalPrev = document.getElementById("modal-prev");
  const modalNext = document.getElementById("modal-next");

  // 現在表示セットとインデックスを保持する変数
  let currentSet = [];
  let currentIndex = 0;

  // Day と Sort の組み合わせから現在表示セットを作成
  function buildCurrentSet(dayValue, sortValue) {
    const daysAll = ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"];
    const dayList = dayValue === "All" ? daysAll : (dayValue ? [dayValue] : []);
    const sortOrder = sortValue ? [sortValue] : ["1","2","3","4"];

    const result = [];

    // All Day の場合、日別を順に追加。ただし各日ごとにその日の写真を sortOrder の順で追加
    if (dayValue === "All") {
      dayList.forEach(d => {
        sortOrder.forEach(n => {
          result.push(`picture/${d}/${n}.jpg`);
        });
      });
    } else if (dayValue && dayValue.startsWith("Day")) {
      sortOrder.forEach(n => result.push(`picture/${dayValue}/${n}.jpg`));
    }
    return result;
  }

  // モーダル表示用のセットを更新して表示
  function showInModal(index) {
    if (!currentSet.length) return;
    modalImg.src = currentSet[index];
    modal.classList.remove("hidden");
    // キャンセル用フォーカスを当てる等の追加可
  }

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.display = "none";
      authScreen.classList.add("fade-in");
      setTimeout(() => authScreen.classList.add("show"), 100);
    }, 500);
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

  // 認証フォーム
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

  // 表示リストの初期化とイベント
  function initializeGallery() {
    const dayVal = daySelect.value;
    const sortVal = sortSelect.value;

    currentSet = buildCurrentSet(dayVal, sortVal);

    // 表示エリアを day ごとにセクション化して表示
    gallery.innerHTML = "";
    const sortNames = {
      "1": "Refrigerator",
      "2": "Ziplock Bag",
      "3": "Plastic Wrap",
      "4": "Room Temperature"
    };
    const sortDisplay = document.getElementById("sort-display");
    sortDisplay.textContent = sortVal ? `Sort: ${sortNames[sortVal]}` : "Sort: None";

    if (dayVal === "All") {
      const days = ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"];
      days.forEach(d => {
        const section = document.createElement("section");
        section.className = "day-section";
        const dayTitle = document.createElement("h3");
        dayTitle.textContent = d;
        section.appendChild(dayTitle);

        sortVal && currentSet.filter(u => u.includes(d)).forEach((src, idx) => {
          const img = document.createElement("img");
          img.src = src;
          img.alt = `${d} - ${idx+1}`;
          section.appendChild(img);
        });
        // ソート無しの場合は全写真を追加
        if (!sortVal) {
          for (let i = 1; i <= 4; i++) {
            const img = document.createElement("img");
            img.src = `picture/${d}/${i}.jpg`;
            img.alt = `${d} - ${i}`;
            section.appendChild(img);
          }
        }
        gallery.appendChild(section);
      });
    } else if (dayVal) {
      // Day 単体
      currentSet.forEach((src, idx) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${dayVal} - ${idx+1}`;
        gallery.appendChild(img);
      });
    }

    // サムネイルクリックでモーダルを開く
    gallery.querySelectorAll("img").forEach((img, idx) => {
      img.addEventListener("click", () => {
        // currentSet に対応するクリック位置を特定
        // dayVal が All の場合は day ごとに分割して表示されるため、インデックス計算は簡易化のため全体の構造を再構築する場合は別実装が望ましい
        // 現実装では、All の場合は全画像をモーダルに列挙する前提でインデックスを img の順序と一致させる
        const absoluteIndex = Array.from(gallery.querySelectorAll("img")).indexOf(img);
        currentIndex = absoluteIndex;
        showInModal(currentIndex);
      });
    });
  }

  // 日付・並び替え変更時の再描画
  daySelect.addEventListener("change", () => {
    initializeGallery();
    // モーダルの現在位置はリセットし、新しいセットの先頭を表示するのが安全
    currentIndex = 0;
  });

  sortSelect.addEventListener("change", () => {
    initializeGallery();
    currentIndex = 0;
  });

  // 初期表示の準備
  initializeGallery();

  // モーダル操作
  function closeModal() {
    modal.classList.add("hidden");
    modalImg.src = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalBg.addEventListener("click", closeModal);

  // 左右ナビゲーション
  modalPrev.addEventListener("click", () => {
    if (!currentSet.length) return;
    if (currentIndex > 0) {
      currentIndex--;
      modalImg.src = currentSet[currentIndex];
    }
  });

  modalNext.addEventListener("click", () => {
    if (!currentSet.length) return;
    if (currentIndex < currentSet.length - 1) {
      currentIndex++;
      modalImg.src = currentSet[currentIndex];
    }
  });

  // キーボード操作（左右矢印, Esc）
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") {
      if (currentIndex > 0) {
        currentIndex--;
        modalImg.src = currentSet[currentIndex];
      }
    } else if (e.key === "ArrowRight") {
      if (currentIndex < currentSet.length - 1) {
        currentIndex++;
        modalImg.src = currentSet[currentIndex];
      }
    } else if (e.key === "Escape") {
      closeModal();
    }
  });
});