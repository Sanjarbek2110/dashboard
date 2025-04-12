const sidebar = document.getElementById('sidebar');
const hamburgerBtn = document.getElementById('hamburgerBtn');

hamburgerBtn.addEventListener('click', () => {
  if (sidebar.style.right === '0px') {
    sidebar.style.right = '-100%';
  } else {
    sidebar.style.right = '0';
  }
});

// Tashqariga bosganda menyuni yopish
document.addEventListener('click', (e) => {
  if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
    sidebar.style.right = '-100%';
  }
});