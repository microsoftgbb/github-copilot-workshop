'use strict';

// Language button toggle
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(function(btn) {
  const radio = btn.querySelector('input[type="radio"]');
  if (radio) {
    btn.addEventListener('click', function() {
      langButtons.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  }
});
