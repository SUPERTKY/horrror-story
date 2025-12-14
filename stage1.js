// stage1.js
import { createDialogueSystem } from "./typewriter.js";

// stage1.js（STAGE1_DIALOGUEだけ差し替え）
// stage1.js
const STAGE1_DIALOGUE = [
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
  tone:"shout",
  fx:"shake",
  speed:16,            // ← ここにもカンマ
  cut:{ src:"assets/bikkuri.mp3", volume:0.9 }
},


  // ★ 同時しゃべり
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
    text:"おいふぁなこ、熱史……やばいことしようとしてないか？",
    tone:"whisper"
  },

  { speaker:"ふぁなこ", speakerId:"fanako",
    text:"うん、やばい雰囲気しかしないね…",
    tone:"whisper", fx:"glitch"
  },

{ speaker:"熱史", speakerId:"atsushi",
  text:"そこで、彼が亡くなっていた森に行って、アドバイスもらおうと思う。",
  tone:"cold",         // ← ★ここにカンマ
  image:{ src:"assets/mori.png", ms:1200 },
  cut:{ src:"assets/bikkuri.mp3", volume:0.9 }
},

  // ★ 同時しゃべり（脱力）
  {
    speakers: [
      { speaker:"秋介", speakerId:"shusuke" },
      { speaker:"ふぁなこ", speakerId:"fanako" }
    ],
    texts: [
      "は？",
      "は？"
    ],
    tone:"whisper"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"一人だとなんか怖いので、君たちにも来てもらう。",
    tone:"cold"
  },

  // ★ 同時しゃべり（拒否反応）
  {
    speakers: [
      { speaker:"秋介", speakerId:"shusuke" },
      { speaker:"ふぁなこ", speakerId:"fanako" }
    ],
    texts: [
      "は！？",
      "は！？"
    ],
    tone:"shout", fx:"shake"
  },

  { speaker:"熱史", speakerId:"atsushi",
    text:"では、今夜さっそく森に行く。[pause:250]\n準備しといてくれ！",
    tone:"shout", speed:18
  },

  // ★ 同時しゃべり（ラスト）
  {
    speakers: [
      { speaker:"ふぁなこ", speakerId:"fanako" },
      { speaker:"秋介", speakerId:"shusuke" }
    ],
    texts: [
      "ちょっ！まっ！",
      "なんてこった……。",
    ],
    tone:"shout"
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

const bgm = document.getElementById("bgm");
const sfx = document.getElementById("sfx");
const overlayEl = document.getElementById("overlay");
const overlayImgEl = document.getElementById("overlayImg");

const dialog = createDialogueSystem({
  dialogEl: document.getElementById("dialog"),
  speakerEl,
  textEl,
  charElsById,
  speed: 22,

  // ★追加
  bgmEl: bgm,
  sfxEl: sfx,
  overlayEl,
  overlayImgEl,
});


dialog.load(STAGE1_DIALOGUE);
dialog.showCurrent();

// タップで進む（存在チェックつき）
const tapLayer = document.getElementById("tapLayer");
if (tapLayer) {
  tapLayer.addEventListener("click", () => dialog.next());
}

// ===== BGM（ステージ1）=====
// ===== BGM（ステージ1）=====
if (bgm) {
  bgm.volume = 0.6;

  bgm.play().catch(() => {});

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








