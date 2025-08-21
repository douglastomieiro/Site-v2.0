// Pop-up
document.addEventListener('DOMContentLoaded', () => {
    const popup = document.getElementById('popup');
    const closePopup = document.getElementById('closePopup');
    const overlay = document.getElementById('overlay');

    // Verifica se os elementos existem
    if (!popup || !overlay) return;

    // Mostrar pop-up se ainda não foi fechado nesta sessão
    if (!sessionStorage.getItem('popupClosed')) {
        popup.style.display = 'block';
        overlay.style.display = 'block';
    }

    // Função para fechar o pop-up
    const close = () => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
        sessionStorage.setItem('popupClosed', 'true');
    };

    // Adiciona eventos, se os elementos existirem
    closePopup?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
});


// Rolagem suave para as seções
const header = document.getElementById('header');
const headerHeight = header ? header.offsetHeight : 0;

document.querySelectorAll('header nav ul li a').forEach(anchor => {
    anchor.addEventListener('click', event => {
        event.preventDefault();

        const href = anchor.getAttribute('href');
        if (!href || !href.startsWith('#')) return;

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
            const targetPosition = targetSection.offsetTop - headerHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Modal
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalVideo = document.getElementById('modalVideo');
    const closeModal = document.getElementById('closeModal');

    if (!modal || !modalImg || !modalVideo || !closeModal) return;

    const items = document.querySelectorAll('.gallery .square img');

    const closeModalContent = () => {
        modal.style.display = 'none';

        modalImg.style.display = 'none';
        modalImg.src = '';
        modalImg.alt = '';

        modalVideo.pause();
        modalVideo.style.display = 'none';
        modalVideo.src = '';
    };

    items.forEach(item => {
        item.addEventListener('click', () => {
            const type = item.dataset.type || 'image';
            const src = item.dataset.src || item.src;

            if (type === 'video') {
                modalImg.style.display = 'none';
                modalImg.src = '';

                modalVideo.src = src;
                modalVideo.style.display = 'block';
                modalVideo.play();
            } else {
                modalVideo.pause();
                modalVideo.style.display = 'none';
                modalVideo.src = '';

                modalImg.src = src;
                modalImg.alt = item.alt || '';
                modalImg.style.display = 'block';
            }

            modal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', closeModalContent);

    window.addEventListener('click', event => {
        if (event.target === modal) closeModalContent();
    });

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.style.display === 'block') {
            closeModalContent();
        }
    });
});


// Animações ao rolar a página
document.addEventListener('DOMContentLoaded', function () {
    const sections = document.querySelectorAll('.section');

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1 // 10% visível já dispara
    });

    sections.forEach(section => observer.observe(section));
});
