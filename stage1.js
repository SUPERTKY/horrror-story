// stage1.js
import { createDialogueSystem } from "./typewriter.js";

// stage1.js（STAGE1_DIALOGUEだけ差し替え）
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

  // ===== ここから：導入シナリオを当てはめ =====
  { speaker:"熱史", speakerId:"atsushi",
    text:"俺、ミュージシャンになりたいんだ。",
    tone:"cold"
  },

  { speaker:"秋介", speakerId:"shusuke",
    text:"そうか。がんばれ。",
    tone:"whisper"
  },

  { speaker:"ふぁなこ", speakerId:"fanako",
    text:"ふーん。そうなんだ。",
    tone:"whisper"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"そこで…プロに相談しようと思う。",
    tone:"cold"
  },

  { speaker:"ふぁなこ", speakerId:"fanako",
    text:"うん、いいんじゃない？[pause:300]\nところで誰に相談するの？",
    tone:"whisper"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"3カ月前に亡くなった天才ミュージシャン！\n田中たけしさんだ！",
    tone:"shout", fx:"shake", speed: 16
  },

  // ★同時しゃべり（typewriter.js拡張版を入れている前提）
  {
    speakers: [
      { speaker:"秋介", speakerId:"shusuke" },
      { speaker:"ふぁなこ", speakerId:"fanako" }
    ],
    texts: [
      "は？",
      "は？"
    ],
    tone:"shout"
  },

  { speaker:"秋介", speakerId:"shusuke",
    text:"おいふぁなこ、熱史…やばいことしようとしてないか？",
    tone:"whisper"
  },

  { speaker:"ふぁなこ", speakerId:"fanako",
    text:"うん、やばい雰囲気しかしないね…",
    tone:"whisper", fx:"glitch"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"そこで、彼が亡くなっていた森に行って、アドバイスもらおうと思う。",
    tone:"cold"
  },

  // ★同時しゃべり：脱力の「あぁ…」
  {
    speakers: [
      { speaker:"秋介", speakerId:"shusuke" },
      { speaker:"ふぁなこ", speakerId:"fanako" }
    ],
    texts: [
      "あぁ…",
      "あぁ…"
    ],
    tone:"whisper"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"そこで、一人だとなんか怖いので、君たちに来てもらう。",
    tone:"cold"
  },

  // ★同時しゃべり：あぁ……は！？
  {
    speakers: [
      { speaker:"秋介", speakerId:"shusuke" },
      { speaker:"ふぁなこ", speakerId:"fanako" }
    ],
    texts: [
      "あぁ……は！？",
      "あぁ……は！？"
    ],
    tone:"shout", fx:"shake"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"では、今夜さっそく森に行く。[pause:250]\n準備しといてくれ！",
    tone:"shout", speed: 18
  },

  // ★同時しゃべり：止めに入る
  {
    speakers: [
      { speaker:"ふぁなこ", speakerId:"fanako" },
      { speaker:"秋介", speakerId:"shusuke" }
    ],
    texts: [
      "ちょっ！まっ！",
      "なんてこった…。",
    ],
    tone:"shout"
  },

  // 〆：最初の「やめろ！」に繋がるように置く（演出）
  { speaker:"熱史", speakerId:"atsushi",
    text:"やめろ！",
    tone:"shout", fx:"shake", speed: 16
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



