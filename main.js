const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburgerBtn');

hamburgerBtn.addEventListener('click', () => {
  if (sidebar.style.top === '0px') {
    sidebar.style.top = '-200%';
  } else {
    sidebar.style.top = '0';
  }
});

// Tashqariga bosganda menyuni yopish
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    sidebar.style.top = '-200%';
  }
});