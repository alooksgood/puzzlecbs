document.addEventListener('DOMContentLoaded', () => {
  let startTime = Date.now();
  let score = 0;

  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");
  const piecesContainer = document.getElementById("pieces");
  const slots = document.querySelectorAll(".slot");

  // ⏱️ TIMER
  setInterval(() => {
    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const seconds = String(elapsed % 60).padStart(2, "0");
    timerDisplay.textContent = `${minutes}:${seconds}`;
  }, 1000);

  // 🔁 SHUFFLE PIECES (manual DOM)
  function shufflePieces() {
    const pieces = Array.from(document.querySelectorAll(".piece"));
    const shuffled = pieces.sort(() => 0.5 - Math.random());
    piecesContainer.innerHTML = "";
    shuffled.forEach(piece => piecesContainer.appendChild(piece));
  }

  // 🧩 DRAG & DROP
  function setupDragAndDrop() {
    const pieces = document.querySelectorAll(".piece");

    pieces.forEach(piece => {
      piece.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", piece.dataset.id);
      });
    });

    slots.forEach(slot => {
      slot.addEventListener("dragover", e => e.preventDefault());

      slot.addEventListener("drop", e => {
        e.preventDefault();
        const rawPieceId = e.dataTransfer.getData("text/plain")?.trim();
        const rawCorrectId = slot.getAttribute("data-correct")?.trim();

        const pieceId = rawPieceId?.replace(/\s+/g, "").replace(/[–—]/g, "-").toLowerCase();
        const correctId = rawCorrectId?.replace(/\s+/g, "").replace(/[–—]/g, "-").toLowerCase();

        if (!pieceId || !correctId) return;

        if (pieceId === correctId && !slot.querySelector(".piece")) {
          const piece = document.querySelector(`.piece[data-id='${rawPieceId}']`);
          if (piece) {
            slot.appendChild(piece);
            piece.setAttribute("draggable", false);
            piece.style.backgroundColor = "#d4edda";
            piece.style.border = "1px solid green";
            score++;
            scoreDisplay.textContent = score;
          }
          return; // ✅ Stop agar tidak lanjut ke alert
        }

        alert(`Salah! Coba lagi.\n\nDijatuhkan: "${rawPieceId}"\nSeharusnya: "${rawCorrectId}"`);
      });
    });
  }

  // ✔️ CEK JAWABAN
  document.getElementById("checkBtn").addEventListener("click", () => {
    let benar = 0;
    slots.forEach(slot => {
      const correctId = slot.getAttribute("data-correct")?.trim();
      const piece = slot.querySelector(".piece");
      if (piece && piece.dataset.id.trim() === correctId) {
        benar++;
        slot.style.borderColor = "green";
      } else {
        slot.style.borderColor = "red";
      }
    });
    alert(`Kamu menyusun ${benar} dari 23 langkah dengan benar.`);
  });

  // 🔄 RESET
  document.getElementById("resetBtn").addEventListener("click", () => {
    const allPieces = document.querySelectorAll(".piece");
    allPieces.forEach(piece => {
      piece.setAttribute("draggable", true);
      piece.style.backgroundColor = "";
      piece.style.border = "";
      piecesContainer.appendChild(piece);
    });

    slots.forEach(slot => slot.style.borderColor = "#888");
    score = 0;
    scoreDisplay.textContent = "0";
    startTime = Date.now();

    shufflePieces();       // acak ulang
    setupDragAndDrop();    // re-bind drag
  });

  // 🔢 TOGGLE NOMOR (slot dan pieces)
  document.getElementById("toggleNumberBtn").addEventListener("click", () => {
    const numbers = document.querySelectorAll('.slot-number, .piece-number');
    numbers.forEach(el => {
      el.style.display = (el.style.display === "none") ? "inline" : "none";
    });
  });

  // 🔁 INISIALISASI
  setupDragAndDrop();
  shufflePieces();
});