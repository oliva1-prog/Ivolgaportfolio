const carousel = document.querySelector('.carousel');
const carouselItems = document.querySelectorAll('.carousel-item');
const centerContent = document.querySelector('.center-content');
const modal = document.getElementById('mobileModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const inviteBtn = document.querySelector('.invite-btn');

let currentRotation = 0;
let animationId;
let isAnimating = true;
let currentSpeed = 8;
let targetSpeed = 8;
let decelerating = false;
let startTime;
const itemCount = carouselItems.length;
const anglePerItem = 360 / itemCount;

// Initialize positions
function initializeCarousel() {
  carouselItems.forEach((item, index) => {
    const angle = (index * anglePerItem);
    const radius = window.innerWidth > 768 ? 280 : 120;
    const x = radius * Math.cos((angle - 90) * Math.PI / 180);
    const y = radius * Math.sin((angle - 90) * Math.PI / 180);
    
    item.style.transform = `translate(${x}px, ${y}px)`;
  });
}

// Animate carousel
function animateCarousel(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;

  if (isAnimating) {
    // Accelerate phase (0-2 seconds)
    if (elapsed < 2000) {
      currentSpeed = 8 + (elapsed / 2000) * 12; // 8 to 20 deg/frame
    }
    // Decelerate phase (2-4 seconds)
    else if (elapsed < 4000) {
      const decelProgress = (elapsed - 2000) / 2000;
      currentSpeed = 20 - decelProgress * 15; // 20 to 5 deg/frame
      targetSpeed = 0;
      decelerating = true;
    }
    // Stopped
    else {
      isAnimating = false;
      currentSpeed = 0;
      centerContent.classList.add('show');
    }

    if (isAnimating) {
      currentRotation += currentSpeed;
      currentRotation %= 360;

      carouselItems.forEach((item, index) => {
        const angle = (index * anglePerItem + currentRotation);
        const radius = window.innerWidth > 768 ? 280 : 120;
        const x = radius * Math.cos((angle - 90) * Math.PI / 180);
        const y = radius * Math.sin((angle - 90) * Math.PI / 180);
        
        item.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  }

  animationId = requestAnimationFrame(animateCarousel);
}

// Resume animation
function resumeAnimation() {
  isAnimating = true;
  startTime = null;
  centerContent.classList.remove('show');
}

// Pause animation on hover (desktop only)
carousel.addEventListener('mouseenter', () => {
  if (window.innerWidth > 768) {
    isAnimating = false;
  }
});

carousel.addEventListener('mouseleave', () => {
  if (window.innerWidth > 768) {
    resumeAnimation();
  }
});

// Mobile: Handle item click
carouselItems.forEach(item => {
  item.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.stopPropagation();
      const img = item.querySelector('img');
      const title = item.dataset.title;
      const description = item.dataset.description;
      
      modalImage.src = img.src;
      modalTitle.textContent = title;
      modalText.textContent = description;
      modal.classList.add('active');
    }
  });
});

// Close modal on background click
modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});

// Invite button
inviteBtn.addEventListener('click', () => {
  alert('Спасибо за интерес! Вскоре мы свяжемся с вами.');
});

// Initialize
window.addEventListener('load', () => {
  initializeCarousel();
  animateCarousel(0);
});

window.addEventListener('resize', () => {
  initializeCarousel();
});
