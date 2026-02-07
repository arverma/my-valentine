(function () {
  "use strict";

  var CONFIG = window.VALENTINE_CONFIG || {};
  var PERSONAL = CONFIG.personal || {};
  var DAYS = (CONFIG.days && CONFIG.days.length) ? CONFIG.days : [{ nameEn: "", date: 7, videoId: "" }];
  var EMOJI_CONFIG = CONFIG.emojiConfig || { 1: ["❤️"] };

  var EMOJI_COUNT = CONFIG.emojiCount;
  var fd = CONFIG.floatEmojiDuration || {};
  var FLOAT_EMOJI_DURATION_MIN = fd.min;
  var FLOAT_EMOJI_DURATION_MAX = fd.max;
  var FLOAT_EMOJI_DELAY_MAX = CONFIG.floatEmojiDelayMax;
  var MUSIC_TRACKS = CONFIG.musicTracks || [];
  var yhc = CONFIG.yellowHeartCount || {};
  var YELLOW_HEART_COUNT_MIN = yhc.min;
  var YELLOW_HEART_COUNT_MAX = yhc.max;
  var RED_HEART_BURST = CONFIG.heartBurst || {};

  var dom = {};
  function cacheDom() {
    dom.dayMeta = document.getElementById("dayMeta");
    dom.dayLabel = document.getElementById("dayLabel");
    dom.videoWrap = document.getElementById("videoWrap");
    dom.videoPlaceholder = document.getElementById("videoPlaceholder");
    dom.linkYesterday = document.getElementById("linkYesterday");
    dom.linkTomorrow = document.getElementById("linkTomorrow");
    dom.navSep = document.getElementById("navSep");
    dom.photoWrap = document.getElementById("photoWrap");
    dom.floatEmojis = document.getElementById("floatEmojis");
    dom.musicHeartsFloat = document.getElementById("musicHeartsFloat");
    dom.starfield = document.getElementById("starfield");
    dom.floatNames = document.getElementById("floatNames");
  }
  var cachedAudioList = [];
  cacheDom();

  function secureRandom() {
    if (typeof crypto !== "undefined" && crypto.getRandomValues) {
      return crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000;
    }
    return Math.random();
  }

  function randomBetween(min, max) {
    return min + secureRandom() * (max - min);
  }

  function pickRandom(arr) {
    return arr[Math.floor(secureRandom() * arr.length)];
  }

  function randomPositionAvoidCenter() {
    var left = randomBetween(5, 95);
    var top = randomBetween(5, 95);
    if (left >= 40 && left <= 60) left = left < 50 ? 35 : 65;
    if (top >= 30 && top <= 70) top = top < 50 ? 25 : 75;
    return { left: left, top: top };
  }

  function removeEl(el) {
    if (el && el.parentNode) el.parentNode.removeChild(el);
  }

  function initFloatNames() {
    var container = dom.floatNames;
    if (!container || !PERSONAL.fromName || !PERSONAL.toName) return;
    var names = [PERSONAL.fromName, PERSONAL.toName];
    var count = CONFIG.floatNamesCount != null ? CONFIG.floatNamesCount : 10;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var span = document.createElement("span");
      span.className = "float-name " + (i % 2 === 0 ? "from-name" : "to-name");
      span.textContent = names[i % 2];
      var x = randomBetween(5, 95);
      var duration = randomBetween(28, 38);
      var delay = -randomBetween(0, 35);
      var drift = randomBetween(-25, 25);
      span.setAttribute("style",
        "left: " + x + "%; " +
        "animation-duration: " + duration.toFixed(1) + "s; " +
        "animation-delay: " + delay.toFixed(1) + "s; " +
        "--drift: " + drift.toFixed(0) + "px;"
      );
      frag.appendChild(span);
    }
    container.appendChild(frag);
  }

  function initStarfield() {
    var container = dom.starfield;
    if (!container) return;
    var count = CONFIG.starCount != null ? CONFIG.starCount : 60;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var star = document.createElement("span");
      star.className = "star";
      star.style.left = randomBetween(0, 100) + "%";
      star.style.top = randomBetween(0, 100) + "%";
      star.style.width = star.style.height = randomBetween(1, 2.5) + "px";
      star.style.animationDelay = randomBetween(0, 4) + "s";
      star.style.opacity = randomBetween(0.25, 0.85);
      frag.appendChild(star);
    }
    container.appendChild(frag);
  }

  function renderEmojis(dayIndex) {
    var container = dom.floatEmojis;
    if (!container) return;
    var list = EMOJI_CONFIG[dayIndex] || EMOJI_CONFIG[1];
    container.innerHTML = "";
    var cap = EMOJI_COUNT != null ? EMOJI_COUNT : 20;
    var dMin = FLOAT_EMOJI_DURATION_MIN != null ? FLOAT_EMOJI_DURATION_MIN : 22;
    var dMax = FLOAT_EMOJI_DURATION_MAX != null ? FLOAT_EMOJI_DURATION_MAX : 28;
    var delayMax = FLOAT_EMOJI_DELAY_MAX != null ? FLOAT_EMOJI_DELAY_MAX : 28;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < cap; i++) {
      var span = document.createElement("span");
      span.className = "float-emoji";
      var x = randomBetween(1, 99);
      var duration = randomBetween(dMin, dMax);
      var delay = -randomBetween(0, delayMax);
      var drift = randomBetween(-20, 20);
      span.setAttribute("style",
        "left: " + x + "%; " +
        "animation-duration: " + duration.toFixed(1) + "s; " +
        "animation-delay: " + delay.toFixed(1) + "s; " +
        "--drift: " + drift.toFixed(0) + "px;"
      );
      span.textContent = pickRandom(list);
      frag.appendChild(span);
    }
    container.appendChild(frag);
  }

  function getTodayDayIndex() {
    var d = new Date();
    var month = d.getMonth();
    var date = d.getDate();
    if (month !== 1) return month < 1 || (month === 1 && date < 7) ? 0 : 9;
    if (date >= 7 && date <= 14) return date - 6;
    return date < 7 ? 0 : 9;
  }

  var todayIndex = getTodayDayIndex();
  var viewingIndex = todayIndex >= 1 && todayIndex <= 8 ? todayIndex : 1;
  var confettiShown = false;
  var ytPlayer = null;
  var pendingVideoId = null;

  window.onYouTubeIframeAPIReady = function () {
    var initialVideoId = (viewingIndex >= 1 && viewingIndex <= 8) ? DAYS[viewingIndex - 1].videoId : DAYS[0].videoId;
    ytPlayer = new YT.Player("ytPlayer", {
      width: "100%",
      height: "100%",
      videoId: initialVideoId,
      playerVars: {
        autoplay: 1,
        mute: 0,
        playsinline: 1
      },
      events: {
        onReady: onYTPlayerReady,
        onStateChange: onYTStateChange
      }
    });
    var iframe = document.getElementById("ytPlayer");
    if (iframe && iframe.tagName === "IFRAME") {
      iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
    }
  };

  function onYTPlayerReady(event) {
    var target = event.target;
    if (pendingVideoId) {
      target.loadVideoById(pendingVideoId);
      pendingVideoId = null;
    }
    target.unMute();
    target.playVideo();
  }

  function onYTStateChange(event) {
    if (event.data === 1) {
      pauseAllMusic();
    }
  }

  function pauseAllMusic() {
    for (var i = 0; i < cachedAudioList.length; i++) {
      cachedAudioList[i].pause();
      cachedAudioList[i].currentTime = 0;
    }
    var musicBtns = dom.musicHeartsFloat ? dom.musicHeartsFloat.querySelectorAll(".music-emoji") : [];
    for (var j = 0; j < musicBtns.length; j++) musicBtns[j].classList.remove("playing");
  }

  function render() {
    var dayMetaEl = dom.dayMeta;
    var dayLabelEl = dom.dayLabel;
    var videoWrap = dom.videoWrap;
    var videoPlaceholder = dom.videoPlaceholder;
    var linkYesterdayEl = dom.linkYesterday;
    var linkTomorrowEl = dom.linkTomorrow;
    var navSepEl = dom.navSep;
    var photoWrap = dom.photoWrap;

    if (PERSONAL.photoUrl) {
      photoWrap.innerHTML = "<img src=\"" + PERSONAL.photoUrl + "\" alt=\"\" class=\"photo\">";
      photoWrap.style.display = "block";
    } else {
      photoWrap.innerHTML = "";
      photoWrap.style.display = "none";
    }

    if (todayIndex === 0 && viewingIndex === 1) {
      renderEmojis(1);
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = "";
      if (videoWrap) videoWrap.style.display = "none";
      if (videoPlaceholder) {
        videoPlaceholder.textContent = (CONFIG.page && CONFIG.page.comingSoonMessage) || "";
        videoPlaceholder.style.display = "block";
      }
      linkYesterdayEl.style.display = "none";
      navSepEl.style.display = "inline";
      linkTomorrowEl.style.display = "inline";
      return;
    }

    if (todayIndex === 9 && viewingIndex === 8) {
      renderEmojis(8);
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = "";
      if (videoWrap) videoWrap.style.display = "none";
      if (videoPlaceholder) {
        videoPlaceholder.textContent = (CONFIG.page && CONFIG.page.pastWeekMessage) || "";
        videoPlaceholder.style.display = "block";
      }
      linkYesterdayEl.style.display = "inline";
      navSepEl.style.display = "inline";
      linkTomorrowEl.style.display = "none";
      return;
    }

    if (viewingIndex >= 1 && viewingIndex <= 8) {
      renderEmojis(viewingIndex);
      var day = DAYS[viewingIndex - 1];
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = day.nameEn + " : " + day.date + " February";
      if (videoPlaceholder) videoPlaceholder.style.display = "none";
      if (videoWrap) videoWrap.style.display = "block";
      pendingVideoId = day.videoId;
      if (ytPlayer && typeof ytPlayer.loadVideoById === "function") {
        ytPlayer.loadVideoById(day.videoId);
        ytPlayer.unMute();
        ytPlayer.playVideo();
        pendingVideoId = null;
      }

      if (viewingIndex > 1) {
        linkYesterdayEl.style.display = "inline";
      } else {
        linkYesterdayEl.style.display = "none";
      }
      if (viewingIndex < 8) {
        linkTomorrowEl.style.display = "inline";
        navSepEl.style.display = viewingIndex > 1 ? "inline" : "none";
      } else {
        linkTomorrowEl.style.display = "none";
        navSepEl.style.display = "inline";
      }
      if (viewingIndex === 8 && !confettiShown && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        fireConfetti();
        confettiShown = true;
      }
    }
  }

  function fireConfetti() {
    var wrap = document.createElement("div");
    wrap.className = "confetti-wrap";
    var count = CONFIG.confettiCount != null ? CONFIG.confettiCount : 30;
    var colors = ["#e8b4bc", "#f0c8d0", "#d06070", "#ffb6c1"];
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "confetti-particle";
      p.textContent = "♥";
      p.style.setProperty("--delay", randomBetween(0, 0.35) + "s");
      p.style.setProperty("--tx", (randomBetween(-100, 100)) + "px");
      p.style.setProperty("--ty", (randomBetween(-150, -250)) + "px");
      p.style.setProperty("--rot", randomBetween(0, 360) + "deg");
      p.style.color = pickRandom(colors);
      frag.appendChild(p);
    }
    wrap.appendChild(frag);
    document.body.appendChild(wrap);
    setTimeout(function () { removeEl(wrap); }, 2800);
  }

  function fireHeartBurst(originX, originY, color, emoji) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var wrap = document.createElement("div");
    wrap.className = "heart-burst-wrap";
    wrap.style.left = originX + "px";
    wrap.style.top = originY + "px";
    wrap.style.transform = "translate(-50%, -50%)";
    var count = CONFIG.heartBurstParticleCount != null ? CONFIG.heartBurstParticleCount : 25;
    var frag = document.createDocumentFragment();
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "heart-burst-particle";
      p.textContent = emoji || "♥";
      p.style.setProperty("--delay", randomBetween(0, 0.2) + "s");
      p.style.setProperty("--tx", (randomBetween(-120, 120)) + "px");
      p.style.setProperty("--ty", (randomBetween(-180, -80)) + "px");
      p.style.setProperty("--rot", randomBetween(0, 360) + "deg");
      p.style.color = color;
      frag.appendChild(p);
    }
    wrap.appendChild(frag);
    document.body.appendChild(wrap);
    setTimeout(function () { removeEl(wrap); }, 2600);
  }

  function addYellowHeart(container) {
    if (!container) return;
    var pos = randomPositionAvoidCenter();
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "heart-emoji";
    btn.setAttribute("aria-label", "Heart burst");
    btn.textContent = "💛";
    btn.style.left = pos.left + "%";
    btn.style.top = pos.top + "%";
    container.appendChild(btn);
  }

  function initMusicHeartsFloat() {
    var container = dom.musicHeartsFloat;
    if (!container) return;
    var i, pos, btn, trackId;
    var frag = document.createDocumentFragment();
    for (i = 0; i < MUSIC_TRACKS.length; i++) {
      pos = randomPositionAvoidCenter();
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "music-emoji";
      btn.setAttribute("aria-label", "Play track " + (i + 1));
      btn.textContent = MUSIC_TRACKS[i].emoji;
      btn.style.left = pos.left + "%";
      btn.style.top = pos.top + "%";
      btn.setAttribute("data-track-id", MUSIC_TRACKS[i].id);
      frag.appendChild(btn);
    }
    container.appendChild(frag);
    var yMin = YELLOW_HEART_COUNT_MIN != null ? YELLOW_HEART_COUNT_MIN : 3;
    var yMax = YELLOW_HEART_COUNT_MAX != null ? YELLOW_HEART_COUNT_MAX : 5;
    var yellowHeartCount = yMin + Math.floor(secureRandom() * (yMax - yMin + 1));
    for (i = 0; i < yellowHeartCount; i++) {
      addYellowHeart(container);
    }
    container.addEventListener("click", function (ev) {
      var heart = ev.target.closest(".heart-emoji");
      if (heart) {
        ev.stopPropagation();
        fireHeartBurst(ev.clientX, ev.clientY, RED_HEART_BURST.color || "#e74c3c", RED_HEART_BURST.emoji || "\u2764\ufe0f");
        removeEl(heart);
        addYellowHeart(container);
        addYellowHeart(container);
        return;
      }
      var musicBtn = ev.target.closest(".music-emoji");
      if (musicBtn) {
        ev.stopPropagation();
        var id = musicBtn.getAttribute("data-track-id");
        var target = document.getElementById(id);
        if (!target) return;
        if (musicBtn.classList.contains("playing")) {
          target.pause();
          target.currentTime = 0;
          musicBtn.classList.remove("playing");
        } else {
          if (ytPlayer && typeof ytPlayer.pauseVideo === "function") ytPlayer.pauseVideo();
          for (var j = 0; j < cachedAudioList.length; j++) {
            cachedAudioList[j].pause();
            cachedAudioList[j].currentTime = 0;
          }
          var musicBtns = container.querySelectorAll(".music-emoji");
          for (var k = 0; k < musicBtns.length; k++) musicBtns[k].classList.remove("playing");
          var p = target.play();
          if (p && typeof p.then === "function") p.catch(function () {});
          musicBtn.classList.add("playing");
        }
        pos = randomPositionAvoidCenter();
        musicBtn.style.left = pos.left + "%";
        musicBtn.style.top = pos.top + "%";
      }
    });
  }

  dom.linkYesterday.addEventListener("click", function (e) {
    e.preventDefault();
    if (viewingIndex > 1) {
      viewingIndex -= 1;
      render();
    }
  });

  dom.linkTomorrow.addEventListener("click", function (e) {
    e.preventDefault();
    if (viewingIndex < 8) {
      viewingIndex += 1;
      render();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "ArrowLeft" && viewingIndex > 1) {
      e.preventDefault();
      viewingIndex -= 1;
      render();
    } else if (e.key === "ArrowRight" && viewingIndex < 8) {
      e.preventDefault();
      viewingIndex += 1;
      render();
    }
  });

  document.body.addEventListener("dblclick", function (ev) {
    if (!dom.photoWrap || (ev.target !== dom.photoWrap && !ev.target.closest(".photo-wrap img"))) return;
    var container = dom.musicHeartsFloat;
    if (!container) return;
    var hearts = container.querySelectorAll(".heart-emoji");
    for (var h = 0; h < hearts.length; h++) {
      removeEl(hearts[h]);
    }
    var yMin = YELLOW_HEART_COUNT_MIN != null ? YELLOW_HEART_COUNT_MIN : 3;
    var yMax = YELLOW_HEART_COUNT_MAX != null ? YELLOW_HEART_COUNT_MAX : 5;
    var yellowHeartCount = yMin + Math.floor(secureRandom() * (yMax - yMin + 1));
    for (var i = 0; i < yellowHeartCount; i++) {
      addYellowHeart(container);
    }
  });

  function injectAudioElements() {
    var container = dom.musicHeartsFloat;
    if (!container || !MUSIC_TRACKS.length) return;
    var parent = container.parentNode;
    if (!parent) return;
    cachedAudioList.length = 0;
    var ref = container;
    for (var i = 0; i < MUSIC_TRACKS.length; i++) {
      var track = MUSIC_TRACKS[i];
      var el = document.createElement("audio");
      el.id = track.id;
      el.src = track.src;
      el.loop = true;
      parent.insertBefore(el, ref.nextSibling);
      cachedAudioList.push(el);
      ref = el;
    }
  }

  if (CONFIG.page && CONFIG.page.title) {
    document.title = CONFIG.page.title;
  }
  if (CONFIG.page && CONFIG.page.lang) {
    document.documentElement.lang = CONFIG.page.lang;
  }

  injectAudioElements();
  initStarfield();
  initFloatNames();
  initMusicHeartsFloat();
  render();
  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      setTimeout(function () {
        document.body.classList.add("loaded");
      }, 400);
    });
  });
})();
