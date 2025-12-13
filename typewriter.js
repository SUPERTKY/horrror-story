// typewriter.js
export function createDialogueSystem({
  dialogEl,        // ★追加：dialog全体（classを付ける）
  speakerEl,
  textEl,
  charElsById,     // { atsushi: el, shusuke: el, fanako: el }
  speed = 22,
}) {
  let lines = [];
  let index = 0;

  let typing = false;
  let cancel = false;

  const appeared = new Set();

  function setActiveSpeaker(speakerId){
    if (speakerId && charElsById[speakerId]) {
      appeared.add(speakerId);
      charElsById[speakerId].classList.remove("hidden");
    }

    Object.entries(charElsById).forEach(([id, el]) => {
      if (!el) return;

      if (!appeared.has(id)) {
        el.classList.add("hidden");
        el.classList.remove("active");
        return;
      }
      el.classList.toggle("active", id === speakerId);
    });
  }

  function applyLineStyle(line){
    if (!dialogEl) return;

    // まず既存の tone/fx を外す
    dialogEl.classList.remove(
      "tone-whisper","tone-shout","tone-cold",
      "fx-shake","fx-glitch"
    );

    if (line.tone) dialogEl.classList.add(`tone-${line.tone}`);
    if (line.fx) dialogEl.classList.add(`fx-${line.fx}`);
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  // ★文章内コマンド：[pause:500] を消費して止める
  async function typeTextWithCommands(rawText, baseDelay){
    textEl.textContent = "";
    for (let i = 0; i < rawText.length; i++){
      if (cancel) break;

      // [pause:xxx] 判定
      if (rawText.startsWith("[pause:", i)) {
        const end = rawText.indexOf("]", i);
        if (end !== -1) {
          const num = rawText.slice(i + 7, end);
          const ms = Math.max(0, parseInt(num, 10) || 0);
          await sleep(ms);
          i = end; // ] まで読み飛ばす
          continue;
        }
      }

      const c = rawText[i];
      textEl.textContent += c;

      let d = baseDelay;
      if ("。！？".includes(c)) d += 90;
      if (c === "\n") d += 60;
      await sleep(d);
    }

    if (cancel) {
      // コマンドは取り除いて全文表示
      textEl.textContent = rawText.replace(/\[pause:\d+\]/g, "");
    }
  }

  async function typeLine(line){
    typing = true;
    cancel = false;

    speakerEl.textContent = line.speaker ?? "—";
    setActiveSpeaker(line.speakerId);
    applyLineStyle(line);

    const lineSpeed = line.speed ?? speed;
    await typeTextWithCommands(line.text ?? "", lineSpeed);

    typing = false;
    await sleep(180);
  }

  async function showCurrent(){
    if (!lines.length) return;
    await typeLine(lines[index]);
  }

  async function next(){
    if (!lines.length) return;

    if (typing) { cancel = true; return; }

    index++;
    if (index >= lines.length) {
      index = lines.length - 1;
      return;
    }
    await showCurrent();
  }

  function load(newLines){
    lines = newLines;
    index = 0;
  }

  return { load, showCurrent, next };
}
