// stage1.js
import { createDialogueSystem } from "./typewriter.js";

const STAGE1_DIALOGUE = [
  { speaker:"熱史", speakerId:"atsushi", text:"……霧が濃いな。", tone:"cold" },

  { speaker:"秋介", speakerId:"shusuke",
    text:"熱史、足元見ろ。[pause:500]\n……足跡が、変だ。",
    tone:"whisper", speed: 26
  },

  { speaker:"ふぁなこ", speakerId:"fanako",
    text:"ねえ……。[pause:700]\n今、誰か数えた？",
    tone:"whisper", fx:"glitch"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"やめろ！", tone:"shout", fx:"shake", speed: 16
  },
];


// 要素
const speakerEl = document.getElementById("speaker");
const textEl = document.getElementById("text");

const charElsById = {
  atsushi: document.getElementById("char_atsushi"),
  shusuke: document.getElementById("char_shusuke"),
  fanako: document.getElementById("char_fanako"),
};

const dialog = createDialogueSystem({
  dialogEl: document.getElementById("dialog"),
  speakerEl,
  textEl,
  charElsById,
  speed: 22,
});

dialog.load(STAGE1_DIALOGUE);
dialog.showCurrent();

// タップで進む（存在チェックつき）
const tapLayer = document.getElementById("tapLayer");
if (tapLayer) {
  tapLayer.addEventListener("click", () => dialog.next());
}

// ===== BGM（ステージ1）=====
const bgm = document.getElementById("bgm");
if (bgm) {
  bgm.volume = 0.6;

  // まず再生を試す（ブロックされることはある）
  bgm.play().catch(() => {});

  // 最初の操作で確実に鳴らす
  const unlockBgm = () => {
    bgm.play().catch(() => {});
    document.removeEventListener("click", unlockBgm);
    document.removeEventListener("touchstart", unlockBgm);
  };
  document.addEventListener("click", unlockBgm);
  document.addEventListener("touchstart", unlockBgm);
}

// ===== フェードアウト開始 =====
const fade = document.getElementById("fade");
if (fade) {
  requestAnimationFrame(() => fade.classList.add("out"));
  fade.addEventListener("transitionend", () => fade.remove(), { once: true });
}


