// Pop-up
document.addEventListener("DOMContentLoaded", () => {
  const popup = document.getElementById("popup");
  const closePopup = document.getElementById("closePopup");
  const overlay = document.getElementById("overlay");

  // Verifica se os elementos existem
  if (!popup || !overlay) return;

  // Mostrar pop-up se ainda não foi fechado nesta sessão
  if (!sessionStorage.getItem("popupClosed")) {
    popup.style.display = "block";
    overlay.style.display = "block";
  }

  // Função para fechar o pop-up
  const close = () => {
    popup.style.display = "none";
    overlay.style.display = "none";
    sessionStorage.setItem("popupClosed", "true");
  };

  // Adiciona eventos, se os elementos existirem
  closePopup?.addEventListener("click", close);
  overlay?.addEventListener("click", close);
});

// Rolagem suave para as seções
const header = document.getElementById("header");
const headerHeight = header ? header.offsetHeight : 0;

document.querySelectorAll("header nav ul li a").forEach((anchor) => {
  anchor.addEventListener("click", (event) => {
    event.preventDefault();

    const href = anchor.getAttribute("href");
    if (!href || !href.startsWith("#")) return;

    const targetId = href.substring(1);
    const targetSection = document.getElementById(targetId);
    if (targetSection) {
      const targetPosition = targetSection.offsetTop - headerHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalVideo = document.getElementById("modalVideo");
  const closeModal = document.getElementById("closeModal");

  if (!modal || !modalImg || !modalVideo || !closeModal) return;

  const items = Array.from(document.querySelectorAll(".gallery .square img"));

  let currentIndex = -1;

  // Cria botões de navegação (próximo/anterior) se não existirem
  const ensureNavButtons = () => {
    let prevBtn = modal.querySelector(".modal-prev");
    let nextBtn = modal.querySelector(".modal-next");

    if (!prevBtn) {
      prevBtn = document.createElement("button");
      prevBtn.className = "modal-prev";
      prevBtn.type = "button";
      prevBtn.setAttribute("aria-label", "Imagem anterior");
      prevBtn.textContent = "‹";
      modal.appendChild(prevBtn);
    }

    if (!nextBtn) {
      nextBtn = document.createElement("button");
      nextBtn.className = "modal-next";
      nextBtn.type = "button";
      nextBtn.setAttribute("aria-label", "Próxima imagem");
      nextBtn.textContent = "›";
      modal.appendChild(nextBtn);
    }

    prevBtn.addEventListener("click", showPrev);
    nextBtn.addEventListener("click", showNext);
  };

  const hideMedia = () => {
    // Esconde imagem
    modalImg.style.display = "none";
    modalImg.src = "";
    modalImg.alt = "";

    // Esconde vídeo (e pausa)
    modalVideo.pause();
    modalVideo.style.display = "none";
    modalVideo.src = "";
  };

  const renderItem = (index) => {
    const item = items[index];
    const type = item.dataset.type || "image";
    const src = item.dataset.src || item.src;

    hideMedia();

    if (type === "video") {
      modalVideo.src = src;
      modalVideo.style.display = "block";
      // Tenta tocar, mas não quebra se o navegador bloquear autoplay
      const p = modalVideo.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    } else {
      modalImg.src = src;
      modalImg.alt = item.alt || "";
      modalImg.style.display = "block";
    }
  };

  const openAt = (index) => {
    if (!items.length) return;
    currentIndex = ((index % items.length) + items.length) % items.length; // wrap seguro
    renderItem(currentIndex);
    modal.style.display = "block";
    ensureNavButtons();
  };

  const showNext = () => {
    if (currentIndex === -1) return;
    currentIndex = (currentIndex + 1) % items.length;
    renderItem(currentIndex);
  };

  const showPrev = () => {
    if (currentIndex === -1) return;
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    renderItem(currentIndex);
  };

  const closeModalContent = () => {
    modal.style.display = "none";
    hideMedia();
    currentIndex = -1;
  };

  // Clique nas miniaturas abre no índice certo
  items.forEach((item, idx) => {
    item.addEventListener("click", () => openAt(idx));
  });

  // Fechamento
  closeModal.addEventListener("click", closeModalContent);
  window.addEventListener("click", (event) => {
    if (event.target === modal) closeModalContent();
  });

  // Teclado: Esc fecha, setas navegam
  document.addEventListener("keydown", (event) => {
    if (modal.style.display !== "block") return;

    if (event.key === "Escape") {
      closeModalContent();
    } else if (event.key === "ArrowRight") {
      showNext();
    } else if (event.key === "ArrowLeft") {
      showPrev();
    }
  });

  // Swipe no touch
  let touchStartX = 0;
  let touchStartY = 0;

  const SWIPE_THRESHOLD = 50; // px

  modal.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  modal.addEventListener(
    "touchend",
    (e) => {
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;

      // Evita confundir scroll vertical com swipe horizontal
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
        if (dx < 0) {
          showNext(); // arrastou para a esquerda -> próxima
        } else {
          showPrev(); // arrastou para a direita -> anterior
        }
      }
    },
    { passive: true }
  );
});

// Animações ao rolar a página
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".opacidade");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    {
      threshold: 0,
    }
  );

  sections.forEach((section) => observer.observe(section));
});
