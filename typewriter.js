// typewriter.js
export function createDialogueSystem({
  dialogEl,
  speakerEl,
  textEl,
  charElsById,
  speed = 22,

  // ★追加
  bgmEl = null,
  sfxEl = null,
  overlayEl = null,
  overlayImgEl = null,
}) {
  let lines = [];
  let index = 0;

  let typing = false;
  let cancel = false;

  const appeared = new Set();

  const textAEl = textEl?.querySelector?.("#textA") ?? textEl;
  const textBEl = textEl?.querySelector?.("#textB") ?? null;

  function sleep(ms){ return new Promise(r => setTimeout(r, ms)); }

  function setActiveSpeakers(speakerIds){
    const ids = (Array.isArray(speakerIds) ? speakerIds : [speakerIds]).filter(Boolean);

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

  // ===== ★効果：BGMを一瞬止めて、別音を鳴らす（終わったらBGM復帰）=====
  async function playInterruptAudio(src, { volume = 1.0 } = {}) {
    if (!src) return;
    if (!bgmEl) return;

    const wasPlaying = !bgmEl.paused;
    const prevVol = bgmEl.volume;

    // BGMを一時停止（または極小にするなら bgmEl.volume = 0.05 でもOK）
    if (wasPlaying) bgmEl.pause();

    const a = new Audio(src);
    a.volume = volume;

    try {
      await a.play();
      await new Promise(res => a.addEventListener("ended", res, { once:true }));
    } catch {
      // autoplay制限等で失敗しても無視
    }

    // BGM復帰
    bgmEl.volume = prevVol;
    if (wasPlaying) {
      bgmEl.play().catch(()=>{});
    }
  }

  // ===== ★効果：効果音（BGMは止めない）=====
  function playSfx(src, { volume = 1.0 } = {}) {
    if (!src || !sfxEl) return;
    sfxEl.pause();
    sfxEl.currentTime = 0;
    sfxEl.src = src;
    sfxEl.volume = volume;
    sfxEl.play().catch(()=>{});
  }

  // ===== ★効果：中央画像の表示（一定時間 or 手動で消す）=====
async function showOverlayImage(src, { persist = false, ms = 800 } = {}) {
  if (!src || !overlayEl || !overlayImgEl) return;

  overlayImgEl.src = src;
  overlayEl.classList.add("show");

  // ★出しっぱなし
  if (persist) return;

  // 従来：時間で消す
  if (ms > 0) {
    await sleep(ms);
    overlayEl.classList.remove("show");
  }
}
function hideOverlay(){
  if (!overlayEl || !overlayImgEl) return;
  overlayEl.classList.remove("show");
  overlayImgEl.src = "";
}


  // ★ここで「セリフ開始時に発動する効果」をまとめて実行
async function runLineEffects(line){
  if (!line) return;

  if (line.sfx?.src) playSfx(line.sfx.src, line.sfx);

  // ★ここ：await を外す
  if (line.cut?.src) playInterruptAudio(line.cut.src, line.cut);

  // ★ここ：await を外す
  if (line.image?.src) showOverlayImage(line.image.src, line.image);
}


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

  // ★ここで先に表示名と立ち絵を確定（効果より先）
  const isDual = Array.isArray(line.speakers) && Array.isArray(line.texts);

  if (isDual) {
    const a = line.speakers[0] ?? {};
    const b = line.speakers[1] ?? {};
    speakerEl.textContent = `${a.speaker ?? "—"}＆${b.speaker ?? "—"}`;
    setActiveSpeakers([a.speakerId, b.speakerId]);
  } else {
    speakerEl.textContent = line.speaker ?? "—";
    setActiveSpeakers(line.speakerId ?? null);
  }

  // ★ここが超重要：テキスト欄を「同期で」先に空にする（残像対策）
  if (textAEl) textAEl.textContent = "";
  if (textBEl) textBEl.textContent = "";

  // ★効果は “待たずに” 発火（セリフ表示と同時に）
  runLineEffects(line); // ← await しない

  const lineSpeed = line.speed ?? speed;

  if (isDual) {
    await Promise.all([
      typeTextWithCommands(textAEl, line.texts[0] ?? "", lineSpeed),
      typeTextWithCommands(textBEl, line.texts[1] ?? "", lineSpeed),
    ]);
  } else {
    await typeTextWithCommands(textAEl, line.text ?? "", lineSpeed);
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

  // ★次の会話に進む瞬間に消す
  hideOverlay();

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


