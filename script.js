// Слайдер-книга с разворотами
const spreads = document.querySelectorAll('.spread');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
// const pageInfo = document.getElementById('pageInfo');
const animPage = document.querySelector('.anim-page');


let currentSpread = 1;
const totalSpreads = spreads.length;
let isAnimating = false;

function updatePageInfo() {
    // pageInfo.textContent = `Разворот ${currentSpread} из ${totalSpreads}`;
    prevBtn.disabled = currentSpread <= 1;
    nextBtn.disabled = currentSpread >= totalSpreads;
}

function playAnimationForward(callback) {
    animPage.classList.add('animate-forward');
    setTimeout(() => {
        animPage.classList.remove('animate-forward'); // Убираем класс после анимации
        if (callback) callback();
    }, 700); // длительность анимации вперед (700 мс)
}

function playAnimationBackward(callback) {
    animPage.classList.add('animate-backward');
    setTimeout(() => {
        animPage.classList.remove('animate-backward'); // Убираем класс после анимации
        if (callback) callback();
    }, 700); // длительность анимации вперед (700 мс)
}

function turnSpread(direction) {
    if (isAnimating) return;

    let newSpread = currentSpread;
    if (direction === 'next' && currentSpread < totalSpreads) {
        newSpread = currentSpread + 1;
    } else if (direction === 'prev' && currentSpread > 1) {
        newSpread = currentSpread - 1;
    } else {
        return;
    }

    isAnimating = true;

    const switchSpread = () => {
        spreads[currentSpread - 1].classList.remove('active');
        spreads[newSpread - 1].classList.add('active');
        currentSpread = newSpread;
        updatePageInfo();
        isAnimating = false;
    };

    if (direction === 'next') {
        playAnimationForward(switchSpread);
    } else {
        playAnimationBackward(switchSpread);
    }
}

prevBtn.addEventListener('click', () => turnSpread('prev'));
nextBtn.addEventListener('click', () => turnSpread('next'));

const book = document.getElementById('book');
book.addEventListener('click', (event) => {
    const rect = book.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const bookWidth = rect.width;

    if (clickX < bookWidth / 2) {
        turnSpread('prev');
    } else {
        turnSpread('next');
    }
});

document.addEventListener('keydown', (event) => {
    switch(event.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
            event.preventDefault();
            turnSpread('prev');
            break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
            event.preventDefault();
            turnSpread('next');
            break;
    }
});

let startX = 0;
let startY = 0;

book.addEventListener('touchstart', (event) => {
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
});

book.addEventListener('touchend', (event) => {
    if (!startX || !startY) return;

    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;

    const diffX = startX - endX;
    const diffY = startY - endY;

    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
            turnSpread('next');
        } else {
            turnSpread('prev');
        }
    }

    startX = 0;
    startY = 0;
});

document.addEventListener('DOMContentLoaded', () => {
    spreads.forEach((spread, index) => {
        if (index > 0) {
            spread.classList.remove('active');
        }
    });
    updatePageInfo();
});

function goToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Находим номер spread с нужным ID
    const spreadsArr = Array.from(document.querySelectorAll('.spread'));
    const index = spreadsArr.indexOf(section); // 0-based индекс
    if (index === -1) return;
    goToSpread(index + 1); // Приводим к 1-based нумерации
}

document.querySelectorAll('.goToSection').forEach(btn => {
    btn.addEventListener('click', function() {
        const sectionId = btn.getAttribute('data-section');
        goToSection(sectionId);
    });
});

const menuBtn = document.querySelector('.menu-btn');
const menuList = document.querySelector('.menu-list');


function toggleMenu() {
  menuBtn.classList.toggle('active');
  menuList.classList.toggle('active');
}

// Клик по кнопке меню
menuBtn.addEventListener('click', toggleMenu);

const navLinks = document.querySelectorAll('.goToSection')
// Клик по любой ссылке в меню
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    // Если меню открыто — закрываем
    if (menuList.classList.contains('active')) {
      toggleMenu();
    }
  });
});

function goToSpread(targetSpread) {
    if (isAnimating || targetSpread < 1 || targetSpread > totalSpreads || targetSpread === currentSpread) return;

    // Опционально: плавно закрыть текущий разворот с анимацией
    const switchSpread = () => {
        spreads[currentSpread - 1].classList.remove('active');
        spreads[targetSpread - 1].classList.add('active');
        currentSpread = targetSpread;
        updatePageInfo();
        isAnimating = false;
    };

    isAnimating = true;

    // Если нужна анимация — определяется по направлению
    if (targetSpread > currentSpread) {
        playAnimationForward(switchSpread);
    } else if (targetSpread < currentSpread) {
        playAnimationBackward(switchSpread);
    } else {
        isAnimating = false;
    }
}
