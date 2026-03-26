'use strict';

// Language button toggle
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach((btn) => {
  const radio = btn.querySelector('input[type="radio"]');
  if (radio) {
    btn.addEventListener('click', () => {
      langButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
    });
  }
});
