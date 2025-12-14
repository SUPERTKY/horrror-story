// typewriter.js
export function createDialogueSystem({
  dialogEl,
  speakerEl,
  textEl,        // ★コンテナ (#text)
  charElsById,
  speed = 22,
}) {
  let lines = [];
  let index = 0;

  let typing = false;
  let cancel = false;

  const appeared = new Set();

  // ★2段対応：中の要素を拾う（無ければフォールバック）
  const textAEl = textEl?.querySelector?.("#textA") ?? textEl;
  const textBEl = textEl?.querySelector?.("#textB") ?? null;

  function setActiveSpeakers(speakerIds){
    const ids = (Array.isArray(speakerIds) ? speakerIds : [speakerIds]).filter(Boolean);

    // 立ち絵が存在するidだけ出す
    ids.forEach(id => {
      if (charElsById[id]) {
        appeared.add(id);
        charElsById[id].classList.remove("hidden");
      }
    });

    Object.entries(charElsById).forEach(([id, el]) => {
      if (!el) return;

      if (!appeared.has(id)) {
        el.classList.add("hidden");
        el.classList.remove("active");
        return;
      }

      // ★同時発話なら2人ともactive
      el.classList.toggle("active", ids.includes(id));
    });
  }

  function applyLineStyle(line){
    if (!dialogEl) return;
    dialogEl.classList.remove(
      "tone-whisper","tone-shout","tone-cold",
      "fx-shake","fx-glitch"
    );
    if (line.tone) dialogEl.classList.add(`tone-${line.tone}`);
    if (line.fx) dialogEl.classList.add(`fx-${line.fx}`);
  }

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  async function typeTextWithCommands(targetEl, rawText, baseDelay){
    if (!targetEl) return;
    targetEl.textContent = "";

    for (let i = 0; i < rawText.length; i++){
      if (cancel) break;

      if (rawText.startsWith("[pause:", i)) {
        const end = rawText.indexOf("]", i);
        if (end !== -1) {
          const num = rawText.slice(i + 7, end);
          const ms = Math.max(0, parseInt(num, 10) || 0);
          await sleep(ms);
          i = end;
          continue;
        }
      }

      const c = rawText[i];
      targetEl.textContent += c;

      let d = baseDelay;
      if ("。！？".includes(c)) d += 90;
      if (c === "\n") d += 60;
      await sleep(d);
    }

    if (cancel) {
      targetEl.textContent = rawText.replace(/\[pause:\d+\]/g, "");
    }
  }

  async function typeLine(line){
    typing = true;
    cancel = false;

    applyLineStyle(line);

    // ★2人同時発話 or 1人発話 判定
    const isDual = Array.isArray(line.speakers) && Array.isArray(line.texts);

    if (isDual) {
      const a = line.speakers[0] ?? {};
      const b = line.speakers[1] ?? {};

      // 表示名：2人まとめて
      speakerEl.textContent = `${a.speaker ?? "—"}＆${b.speaker ?? "—"}`;

      // 立ち絵：2人分active（ゲストはspeakerId nullでOK）
      setActiveSpeakers([a.speakerId, b.speakerId]);

      const lineSpeed = line.speed ?? speed;

      // ★同時にタイプ（Promise.all）
      await Promise.all([
        typeTextWithCommands(textAEl, line.texts[0] ?? "", lineSpeed),
        typeTextWithCommands(textBEl, line.texts[1] ?? "", lineSpeed),
      ]);

    } else {
      // 1人発話（従来互換）
      speakerEl.textContent = line.speaker ?? "—";
      setActiveSpeakers(line.speakerId ?? null);

      const lineSpeed = line.speed ?? speed;
      await typeTextWithCommands(textAEl, line.text ?? "", lineSpeed);
      if (textBEl) textBEl.textContent = ""; // ★2段目は消す
    }

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
