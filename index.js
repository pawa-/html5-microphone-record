(function() {

  'use strict';

  if (!checkIfRecordable()) {
    return;
  }

  const start_button = document.getElementById('start-button');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const bar_color = 'green';
  const fftsize = 128;

  // マイクと接続
  navigator.mediaDevices.getUserMedia({ audio: true })
   .then(_handleSuccess)
   .catch(_handleError)

  function checkIfRecordable() {
    if (!navigator.mediaDevices) {
      alert('申し訳ありませんが、ご利用のブラウザでは録音できません');
      return false;
    }

    return true;
  }

  function _handleSuccess(evt) {
    start_button.addEventListener('click', () => {
      _handleClick(evt);
    }, false);
  }

  function _handleError(err) {
    console.log(err);
    alert('なにかエラーが発生しました');
  }

  function _handleClick(evt) {
    start_button.classList.add('off');

    // window.webkitAudioContext は iOS上のSafariで動かすのに必要
    const audio_ctx = new (window.AudioContext || window.webkitAudioContext)();

    const src = audio_ctx.createMediaStreamSource(evt);
    const analyser = audio_ctx.createAnalyser(evt);
    analyser.fftSize = fftsize;
    src.connect(analyser);

    let freq_domain = new Uint8Array(analyser.frequencyBinCount);

    const visualizeSound = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = bar_color;

      analyser.getByteFrequencyData(freq_domain);

      for (let i = 0; i < analyser.frequencyBinCount; ++i) {
        const percent  = freq_domain[i] / 256;
        const bar_height = canvas.height * percent;
        const bar_width = canvas.width / analyser.frequencyBinCount;
        const offset = canvas.height - bar_height;

        ctx.rect(i * bar_width, offset, bar_width, bar_height);
      }

      ctx.fill();

      requestAnimationFrame(visualizeSound);
    };

    // 初回実行
    requestAnimationFrame(visualizeSound);
  }

})();
