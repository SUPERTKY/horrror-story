// typewriter.js
export function createDialogueSystem({
  speakerEl,
  textEl,
  charElsById,     // { atsushi: el, shusuke: el, fanako: el }
  speed = 22,
}) {
  let lines = [];
  let index = 0;

  let typing = false;
  let cancel = false;

  // ★初登場したキャラだけ表示する
  const appeared = new Set();

  function setActiveSpeaker(speakerId){
    // speakerId がある＝そのキャラが喋る → 初登場扱いにする
    if (speakerId && charElsById[speakerId]) {
      appeared.add(speakerId);
      charElsById[speakerId].classList.remove("hidden");
    }

    Object.entries(charElsById).forEach(([id, el]) => {
      if (!el) return;

      // 初登場前は完全に「いない」
      if (!appeared.has(id)) {
        el.classList.add("hidden");
        el.classList.remove("active");
        return;
      }

      // 登場済みなら、喋ってるキャラだけ明るく
      el.classList.toggle("active", id === speakerId);
    });
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function typeLine({ speaker, speakerId, text }){
    typing = true;
    cancel = false;

    speakerEl.textContent = speaker ?? "—";
    setActiveSpeaker(speakerId);

    textEl.textContent = "";

    for (let i = 0; i < text.length; i++){
      if (cancel) break;
      textEl.textContent += text[i];

      const c = text[i];
      let d = speed;
      if ("。！？".includes(c)) d += 90;
      if (c === "\n") d += 60;
      await sleep(d);
    }

    if (cancel) textEl.textContent = text;
    typing = false;
  }

  async function showCurrent(){
    if (!lines.length) return;
    await typeLine(lines[index]);
  }

  async function next(){
    if (!lines.length) return;

    // タイピング中なら全文表示
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
