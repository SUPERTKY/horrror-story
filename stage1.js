// stage1.js
import { createDialogueSystem } from "./typewriter.js";

/**
 * 編集するのはここだけでOK：
 * - speaker（表示名）
 * - speakerId（どのキャラが話してるか：you / guide / shadow）
 * - text（セリフ）
 */
const STAGE1_DIALOGUE = [
  { speaker: "あなた", speakerId: "you", text: "……霧が濃い。\n森の匂いが、近すぎる。" },
  { speaker: "あなた", speakerId: "you", text: "さっきまであった道が、消えてる。" },
  { speaker: "？？？", speakerId: "guide", text: "戻らないほうがいい。" },
  { speaker: "あなた", speakerId: "you", text: "……誰？" },
  { speaker: "？？？", speakerId: "shadow", text: "数えるな。" }
];

// 画面の要素を拾う
const speakerEl = document.getElementById("speaker");
const textEl = document.getElementById("text");

// キャラ画像（IDは game.html の img id に合わせる）
const charElsById = {
  you: document.getElementById("char_you"),
  guide: document.getElementById("char_guide"),
  shadow: document.getElementById("char_shadow"),
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
