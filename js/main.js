import { visualizeSound } from './modules/visualize-sound.js';

(() => {
  if (!checkIfRecordable()) {
    alert('申し訳ありませんが、ご利用のブラウザでは録音できません');
    return;
  }

  const start_button = document.getElementById('start-button');
  const canvas = document.getElementById('canvas');
  const canvas_ctx = canvas.getContext('2d');
  const bar_color = 'green';
  const fftsize = 128;

  // マイクと接続
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(_handleSuccess)
    .catch(_handleError)

  function checkIfRecordable() {
    if (!navigator.mediaDevices) {
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
    const audio_analyser = audio_ctx.createAnalyser(evt);
    audio_analyser.fftSize = fftsize;
    src.connect(audio_analyser);

    // キャンバスに音声波形を描画
    requestAnimationFrame(() => visualizeSound(canvas, canvas_ctx, bar_color, audio_analyser));
  }
})();
