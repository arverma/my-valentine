/**
 * Valentine Week – config
 * Edit this file to create your own page. Add your image in images/ and music in music/.
 */
window.VALENTINE_CONFIG = {
  personal: {
    fromName: "Aman",
    toName: "Moni",
    photoUrl: "images/we.jpg",
    photoClickMessage: "I love you!"
  },

  page: {
    title: "Valentine Week — Aman & Moni",
    lang: "en",
    comingSoonMessage: "Valentine Week is coming soon.",
    pastWeekMessage: "See you next year."
  },

  days: [
    { nameEn: "Rose Day", date: 7, videoId: "oDSfEuErIEc" },
    { nameEn: "Propose Day", date: 8, videoId: "Hy4LJYKIsQ0" },
    { nameEn: "Chocolate Day", date: 9, videoId: "h2tv4PmSaKU" },
    { nameEn: "Teddy Day", date: 10, videoId: "Bxl2MunBIt8" },
    { nameEn: "Promise Day", date: 11, videoId: "43VHF4Q6wfU" },
    { nameEn: "Hug Day", date: 12, videoId: "BwGQIv_m_wg" },
    { nameEn: "Kiss Day", date: 13, videoId: "1i0Jo8ml2pg" },
    { nameEn: "Valentine's Day", date: 14, videoId: "yYHGvhs06Xc" }
  ],

  emojiConfig: {
    1: ["ℛosé", "𓇢𓆸", "𓍢🌷͙֒", "( ၴႅၴၴႅၴၴႅၴၴၴႅၴၴႅၴၴႅၴ", "ᥫ᭡١٥٧٤♡"],
    2: ["ᥫ᭡١٥٧٤♡", "ᥫ᭡", "💍🧎‍♂️", "𑣲𝑨", "-`♡´-", "⋆˙⟡"],
    3: ["⋆˙⟡", "🤎ྀིྀི𝒞ℎ𝑜𝑐𝑜𝑙𝑎𝑡𝑒も", "⋆｡‧˚ʚ🍫ɞ˚‧｡⋆", "⋆˚꩜｡"],
    4: ["⋆｡‧˚ʚ🧸ɞ˚‧｡⋆", "ᥫ᭡١٥٧٤♡", "🐻ིྀ", "Ი︵𐑼", "❀", "🐻‍❄️ྀིྀི", "ᵔᴥᵔ"],
    5: ["ᥫ᭡。", "ᥫ᭡١٥٧٤♡", "∞", "𓍯𓂃𓏧♡", "𓂃✍︎"],
    6: ["⋆.˚🫂༘⋆", "ᥫ᭡١٥٧٤♡", "⋆˙⟡", "(っᵔ◡ᵔ)っ", "ᥫ᭡"],
    7: [">⩊<", "ᥫ᭡١٥٧٤♡", "ﾒ૦ﾒ૦💋", "( ˶˘ ³˘)♡"],
    8: ["⋆ ˚｡ ⋆୨♡୧⋆ ˚｡ ⋆", "ᥫ᭡١٥٧٤♡", "𓆩❤︎𓆪", "-`♡´-", "˗ˏˋ ꒰ ♡ ꒱ ˎˊ˗", "♡⸝⸝", "⋆˙⟡"]
  },
  emojiCount: 20,
  floatEmojiDuration: { min: 22, max: 28 },
  floatEmojiDelayMax: 28,

  musicTracks: [
    { id: "track1", src: "music/1.webm", emoji: "🎧ྀི" },
    { id: "track3", src: "music/3.webm", emoji: "𝄞𝄢" },
    { id: "track4", src: "music/4.webm", emoji: "♬" }
  ],

  yellowHeartCount: { min: 3, max: 5 },
  heartBurst: { emoji: "❤️", color: "#e74c3c" },

  floatNamesCount: 10,
  starCount: 60,
  confettiCount: 30,
  heartBurstParticleCount: 25,
  toastDurationMs: 2000
};
