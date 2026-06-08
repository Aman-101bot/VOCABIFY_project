document.addEventListener("dblclick", (e) => {
  const word = window.getSelection().toString().trim();
  if (!word) return;

  chrome.runtime.sendMessage(
    { action: "lookupWord", word },
    (data) => {
      if (chrome.runtime.lastError) return;

      showTooltip(word, data, e.pageX, e.pageY);
    }
  );
});

function showTooltip(word, data, x, y) {
  const old = document.getElementById("dict-box");
  if (old) old.remove();

  const box = document.createElement("div");
  box.id = "dict-box";

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;">
      <strong>${word}</strong>
      <button id="closeBtn">❌</button>
    </div>

    <div style="margin-top:10px;">
      <strong>Meaning:</strong><br>
      ${data.meaning}
    </div>

    <div style="margin-top:10px;">
      <strong>Pronunciation:</strong><br>
      ${data.phonetic}
    </div>

    <button id="playAudio" style="margin-top:10px;">
      🔊 Pronounce
    </button>
  `;

  box.style.position = "absolute";
  box.style.left = x + "px";
  box.style.top = y + "px";

  document.body.appendChild(box);

  // CLOSE BUTTON
  document.getElementById("closeBtn").addEventListener("click", () => {
    box.remove();
  });

  // AUDIO (FIXED - WORKS ALWAYS)
  document.getElementById("playAudio").addEventListener("click", () => {
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
  });

  // AUTO CLOSE
  setTimeout(() => {
    if (box.parentNode) box.remove();
  }, 15000);
}