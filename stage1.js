// stage1.js
import { createDialogueSystem } from "./typewriter.js";

/**
 * 編集するのはここだけでOK：
 * - speaker（表示名）
 * - speakerId（どのキャラが話してるか：you / guide / shadow）
 * - text（セリフ）
 */
const STAGE1_DIALOGUE = [
  { speaker: "熱史", speakerId: "atsushi", text: "……霧が濃いな。\nここ、本当に森か？" },
  { speaker: "秋介", speakerId: "shusuke", text: "熱史、足元見ろ。\n……足跡が、変だ。" },
  { speaker: "ふぁなこ", speakerId: "fanako", text: "ねえ……。\n今、誰か数えた？" },
  { speaker: "熱史", speakerId: "atsushi", text: "……数える？\n何をだよ。" },
  { speaker: "ふぁなこ", speakerId: "fanako", text: "……ううん。\n数えないで。" }
];


// 画面の要素を拾う
const speakerEl = document.getElementById("speaker");
const textEl = document.getElementById("text");

// キャラ画像（IDは game.html の img id に合わせる）
const charElsById = {
  atsushi: document.getElementById("char_atsushi"),
  shusuke: document.getElementById("char_shusuke"),
  fanako: document.getElementById("char_fanako"),
};

const dialog = createDialogueSystem({
  speakerEl,
  textEl,
  charElsById,
  speed: 22, // 速さ（数字を小さくすると速い）
});

// データ読み込み＆開始
dialog.load(STAGE1_DIALOGUE);
dialog.showCurrent();

// 操作：ボタン＆画面タップで進む
document.getElementById("btnNext").addEventListener("click", () => dialog.next());
document.getElementById("btnSkip").addEventListener("click", () => dialog.skip());
document.getElementById("tapLayer").addEventListener("click", () => dialog.next());
// ===== BGM（ステージ1） =====
const bgm = document.getElementById("bgm");

// 好みで調整
bgm.volume = 0.6;

// 再生を試みる（環境によってはブロックされる）
bgm.play().catch(() => {
  // ブロックされたら、最初の操作で鳴らす
});

// 最初のタップ/クリックで確実に鳴らす（どこ触ってもOK）
const unlockBgm = () => {
  bgm.play().catch(() => {});
  document.removeEventListener("click", unlockBgm);
  document.removeEventListener("touchstart", unlockBgm);
};
document.addEventListener("click", unlockBgm);
document.addEventListener("touchstart", unlockBgm);


