const layers = document.querySelectorAll('.layer');
const papers = document.querySelectorAll('.papers');
const textBoxes = document.querySelectorAll('.comic-text-box');
const finalMessage = document.getElementById('finalMessage');

let scrollSpeed = 5;
let edgeThreshold = 100;
let scrollInterval;
let revealButtonClicked = false;
let endSoundPlayed = false;
let isAutoscrollEnabled = false;
let autoscrollInterval;


const backgroundSound = new Audio('assets/sounds/typewriter.mp3');
const endSound = new Audio('assets/sounds/bing.mp3');
backgroundSound.loop = true;
backgroundSound.volume = 0.3;
endSound.volume = 0.3;


function startScrolling(direction) {
  if (!revealButtonClicked) return;
  stopScrolling();
  scrollInterval = setInterval(() => {
    window.scrollBy(direction * scrollSpeed, 0);
    const maxScroll = document.body.scrollWidth - window.innerWidth;
    if (window.scrollX <= 0 || window.scrollX >= maxScroll) stopScrolling();
  }, 16);
}


function stopScrolling() {
  clearInterval(scrollInterval);
}

window.addEventListener('mousemove', ({ clientX }) => {
  const windowWidth = window.innerWidth;
  if (clientX < edgeThreshold) startScrolling(-1);
  else if (clientX > windowWidth - edgeThreshold) startScrolling(1);
  else stopScrolling();
});


window.addEventListener('scroll', () => {
  const scrollX = window.scrollX;

  layers.forEach((layer, index) => {
    const speed = (index + 1) * 0.1;
    layer.style.transform = `translateX(-${scrollX * speed}px)`;
  });

  papers.forEach((paper, index) => {
    const speed = (index + 1) * 0.2;
    const amplitude = 100;
    const frequency = 0.001;
    const offsetY = Math.sin(scrollX * frequency + index) * amplitude;
    paper.style.transform = `translate(${-(scrollX * speed)}px, ${offsetY}px)`;
  });

  const maxScroll = window.innerWidth * 8;
  if (scrollX == maxScroll && !endSoundPlayed) {
    endSoundPlayed = true;
    backgroundSound.pause();
    endSound.play();
  }
});


window.addEventListener('mousemove', ({ clientX, clientY }) => {
  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const offsetX = (clientX - centerX) / centerX;
  const offsetY = (clientY - centerY) / centerY;
  const rotateY = offsetX * 15;
  const rotateX = offsetY * -15;

  textBoxes.forEach((box) => {
    box.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) perspective(500px)`;
  });
});


document.getElementById('revealButton').addEventListener('click', function () {
  const background = document.querySelector('.background');
  const body = document.body;
  const container = document.querySelector('.starting-container');
  const revealButton = document.getElementById('revealButton');
  const title = document.querySelector('.title');

  setTimeout(() => title.classList.add('animate'), 2000);

  revealButton.style.display = 'none';
  setTimeout(() => {
    background.classList.toggle('revealed');
    if (background.classList.contains('revealed')) {
      container.style.backgroundColor = '#AB483B';
      body.style.overflowX = 'auto';
      revealButtonClicked = true;
      backgroundSound.play();
      document.getElementById('toggleAutoscrollButton').style.display = 'block';
    } else {
      container.style.backgroundColor = '#000000';
      body.style.overflowX = 'hidden';
    }
  }, 1000);
});


const maxScroll = window.innerWidth * 8;
window.addEventListener('scroll', () => {
  if (window.scrollX > maxScroll) window.scrollTo(maxScroll, 0);
});


window.history.scrollRestoration = 'manual';
document.addEventListener('DOMContentLoaded', () => window.scrollTo(0, 0));


function startAutoscroll() {
  if (autoscrollInterval) return;
  autoscrollInterval = setInterval(() => {
    const maxScroll = document.body.scrollWidth - window.innerWidth;
    if (window.scrollX >= maxScroll) window.scrollTo(0, 0);
    else window.scrollBy(1, 0);
  }, 16);
}

function stopAutoscroll() {
  clearInterval(autoscrollInterval);
  autoscrollInterval = null;
}


document.getElementById('toggleAutoscrollButton').addEventListener('click', function () {
  isAutoscrollEnabled = !isAutoscrollEnabled;
  if (isAutoscrollEnabled) {
    startAutoscroll();
    this.textContent = 'Auto-Scroll ON';
  } else {
    stopAutoscroll();
    this.textContent = 'Auto-Scroll OFF';
  }
});