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

  // スワイプ / ドラッグ用変数
  let pointerActive = false;
  let startX = 0;
  let lastX = 0;
  const SWIPE_THRESHOLD = 50; // px, スワイプとして認定する閾値

  function buildCurrentSet(dayValue, sortValue) {
    const daysAll = ["Day1","Day2","Day3","Day4","Day5","Day6","Day7"];
    const dayList = dayValue === "All" ? daysAll : (dayValue ? [dayValue] : []);
    const sortOrder = sortValue ? [sortValue] : ["1","2","3","4"];

    const result = [];

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

  function showInModal(index) {
    if (!currentSet.length) return;
    currentIndex = Math.max(0, Math.min(index, currentSet.length - 1));
    modalImg.src = currentSet[currentIndex];
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
    // 視覚的フィードインは CSS 側で制御しても良い
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

  function goPrev() {
    if (!currentSet.length) return;
    if (currentIndex > 0) {
      currentIndex--;
      modalImg.style.transform = "translateX(-20px)";
      requestAnimationFrame(() => {
        modalImg.src = currentSet[currentIndex];
        modalImg.style.transform = "translateX(0)";
      });
    }
  }
  function goNext() {
    if (!currentSet.length) return;
    if (currentIndex < currentSet.length - 1) {
      currentIndex++;
      modalImg.style.transform = "translateX(20px)";
      requestAnimationFrame(() => {
        modalImg.src = currentSet[currentIndex];
        modalImg.style.transform = "translateX(0)";
      });
    }
  }

  function initializeGallery() {
    const dayVal = daySelect.value;
    const sortVal = sortSelect.value;

    currentSet = buildCurrentSet(dayVal, sortVal);

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

        // sortVal があれば currentSet を使ってその日の画像順を表示
        if (sortVal) {
          currentSet.filter(u => u.includes(d)).forEach((src, idx) => {
            const img = document.createElement("img");
            img.src = src;
            img.alt = `${d} - ${idx+1}`;
            section.appendChild(img);
          });
        } else {
          // ソート無しはデフォルト 1..4
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
      currentSet.forEach((src, idx) => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = `${dayVal} - ${idx+1}`;
        gallery.appendChild(img);
      });
    }

    // サムネイルクリックでモーダルを開く
    const thumbs = gallery.querySelectorAll("img");
    thumbs.forEach((img, idx) => {
      img.addEventListener("click", () => {
        // サムネイルの順で currentSet が一致していることを前提に絶対インデックスを使用
        const absoluteIndex = Array.from(thumbs).indexOf(img);
        // All のとき currentSet は dayごとの順で作られているため一致するはず
        showInModal(absoluteIndex);
      });
    });
  }

  daySelect.addEventListener("change", () => {
    initializeGallery();
    currentIndex = 0;
  });

  sortSelect.addEventListener("change", () => {
    initializeGallery();
    currentIndex = 0;
  });

  // 初期表示
  initializeGallery();

  function closeModal() {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    modalImg.src = "";
  }

  modalClose.addEventListener("click", closeModal);
  modalBg.addEventListener("click", closeModal);

  // prev / next ボタン
  if (modalPrev) modalPrev.addEventListener("click", goPrev);
  if (modalNext) modalNext.addEventListener("click", goNext);

  // キーボード操作
  document.addEventListener("keydown", (e) => {
    if (modal.classList.contains("hidden")) return;
    if (e.key === "ArrowLeft") {
      goPrev();
    } else if (e.key === "ArrowRight") {
      goNext();
    } else if (e.key === "Escape") {
      closeModal();
    }
  });

  /* ---------- Pointer events: スワイプ / ドラッグで前後切替 ---------- */
  // pointerdown
  modalImg.addEventListener("pointerdown", (e) => {
    // モーダル内だけで扱う
    pointerActive = true;
    startX = e.clientX;
    lastX = startX;
    modalImg.setPointerCapture(e.pointerId);
    modalImg.style.transition = ""; // 移動中はトランジションなし
  });

  // pointermove
  modalImg.addEventListener("pointermove", (e) => {
    if (!pointerActive) return;
    const dx = e.clientX - startX;
    lastX = e.clientX;
    // 移動に合わせて画像を横にスライド（視覚フィードバック）
    modalImg.style.transform = `translateX(${dx}px)`;
  });

  // pointerup / pointercancel
  function onPointerEnd(e) {
    if (!pointerActive) return;
    pointerActive = false;
    try { modalImg.releasePointerCapture(e.pointerId); } catch (err) {}
    modalImg.style.transition = "transform 0.25s ease";
    const totalDx = lastX - startX;
    if (totalDx > SWIPE_THRESHOLD) {
      // 右スワイプ -> 前の画像
      goPrev();
    } else if (totalDx < -SWIPE_THRESHOLD) {
      // 左スワイプ -> 次の画像
      goNext();
    } else {
      // 閾値に満たない -> 元に戻す
      modalImg.style.transform = "translateX(0)";
      // 少し遅らせてトランジションを戻す
      setTimeout(() => {
        modalImg.style.transform = "";
      }, 260);
    }
  }

  modalImg.addEventListener("pointerup", onPointerEnd);
  modalImg.addEventListener("pointercancel", onPointerEnd);

  // もしユーザがポインタを離したのが modal 外だった場合に備え、グローバルでもキャッチ
  window.addEventListener("pointerup", (e) => {
    if (!pointerActive) return onPointerEnd(e);
  });

});
