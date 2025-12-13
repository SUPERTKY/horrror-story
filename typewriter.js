// typewriter.js
export function createDialogueSystem({
  speakerEl,
  textEl,
  charElsById,     // { you: HTMLImageElement, guide: ..., shadow: ... }
  speed = 22,      // 文字速度（小さいほど速い）
}) {
  let lines = [];
  let index = 0;

  let typing = false;
  let cancel = false; // trueなら今の行を全文表示

  function setActiveSpeaker(speakerId){
    // 全キャラを暗くして、話しているキャラだけ明るくする
    Object.entries(charElsById).forEach(([id, el]) => {
      if (!el) return;
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

    // タイピング中なら「全文表示」に切り替え
    if (typing) {
      cancel = true;
      return;
    }

    // 次の行へ
    index++;
    if (index >= lines.length) {
      // 終了：最後はそのまま止める（次ステージに繋げたいならここを改造）
      index = lines.length - 1;
      return;
    }
    await showCurrent();
  }

  function skip(){
    // 押すと今の行を一気に表示
    cancel = true;
  }

  function load(newLines){
    lines = newLines;
    index = 0;
  }

  return { load, showCurrent, next, skip };
}
