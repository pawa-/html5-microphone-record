export const visualizeSound = (canvas, canvas_ctx, bar_color, audio_analyser) => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas_ctx.fillStyle = bar_color;

  const bar_width = canvas.width / audio_analyser.frequencyBinCount;

  let freq_domain = new Uint8Array(audio_analyser.frequencyBinCount);
  audio_analyser.getByteFrequencyData(freq_domain);

  for (let i = 0; i < audio_analyser.frequencyBinCount; ++i) {
    const percent  = freq_domain[i] / 256;
    const bar_height = canvas.height * percent;
    const offset = canvas.height - bar_height;

    canvas_ctx.rect(i * bar_width, offset, bar_width, bar_height);
  }

  canvas_ctx.fill();

  requestAnimationFrame(() => visualizeSound(canvas, canvas_ctx, bar_color, audio_analyser));
};
