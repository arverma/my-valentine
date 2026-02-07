(function () {
  "use strict";

  var PERSONAL = {
    fromName: "Aman",
    toName: "Moni",
    photoUrl: "we.jpg",
    easterEgg: "I love you!"
  };

  var DAY_GLOW = {
    1: "#b84060",
    2: "#c44d6c",
    3: "#a06050",
    4: "#d07080",
    5: "#c09050",
    6: "#c85a5a",
    7: "#b05070",
    8: "#d04060"
  };

  function hexToRgb(hex) {
    var n = parseInt(hex.slice(1), 16);
    return (n >> 16) + ", " + ((n >> 8) & 255) + ", " + (n & 255);
  }

  var DAYS = [
    { nameEn: "Rose Day", date: 7, videoId: "oDSfEuErIEc" },
    { nameEn: "Propose Day", date: 8, videoId: "RnObnYXbJr8" },
    { nameEn: "Chocolate Day", date: 9, videoId: "h2tv4PmSaKU" },
    { nameEn: "Teddy Day", date: 10, videoId: "Bxl2MunBIt8" },
    { nameEn: "Promise Day", date: 11, videoId: "43VHF4Q6wfU" },
    { nameEn: "Hug Day", date: 12, videoId: "BwGQIv_m_wg" },
    { nameEn: "Kiss Day", date: 13, videoId: "1i0Jo8ml2pg" },
    { nameEn: "Valentine's Day", date: 14, videoId: "yYHGvhs06Xc" }
  ];

  /**
   * Emojis per Valentine's week day (1 = Rose Day … 8 = Valentine's Day).
   * Edit this to change or add emojis for each day.
   */
  var EMOJI_CONFIG = {
    1: ["🌹", "🌷", "❤️"],
    2: ["❤️", "💕", "💗", "💖", "💝", "💍"],
    3: ["🍫", "🍬", "💕", "❤️"],
    4: ["🧸", "❤️", "💕"],
    5: ["💝", "🤝", "❤️", "💕", "⭐"],
    6: ["🤗", "❤️", "💕", "🫂"],
    7: ["💋", "❤️", "💕", "💗"],
    8: ["❤️", "💕", "💗", "💖", "🌹", "💝", "🌷"]
  };

  var EMOJI_COUNT = 20;
  var FLOAT_EMOJI_DURATION_MIN = 22;
  var FLOAT_EMOJI_DURATION_MAX = 28;
  var FLOAT_EMOJI_DELAY_MAX = 28;

  var MUSIC_TRACKS = [
    { id: "track1", src: "music/1.webm", emoji: "🎵" },
    { id: "track3", src: "music/3.webm", emoji: "🎧" },
    { id: "track4", src: "music/4.webm", emoji: "🎤" }
  ];

  var YELLOW_HEART_COUNT_MIN = 3;
  var YELLOW_HEART_COUNT_MAX = 5;
  var RED_HEART_BURST = { emoji: "❤️", color: "#e74c3c" };

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randomPositionAvoidCenter() {
    var left = randomBetween(5, 95);
    var top = randomBetween(5, 95);
    if (left >= 40 && left <= 60) left = left < 50 ? 35 : 65;
    if (top >= 30 && top <= 70) top = top < 50 ? 25 : 75;
    return { left: left, top: top };
  }

  function initFloatNames() {
    var container = document.getElementById("floatNames");
    if (!container || !PERSONAL.fromName || !PERSONAL.toName) return;
    var names = [PERSONAL.fromName, PERSONAL.toName];
    var count = 10;
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
      container.appendChild(span);
    }
  }

  function initStarfield() {
    var container = document.getElementById("starfield");
    if (!container) return;
    var count = 60;
    for (var i = 0; i < count; i++) {
      var star = document.createElement("span");
      star.className = "star";
      star.style.left = randomBetween(0, 100) + "%";
      star.style.top = randomBetween(0, 100) + "%";
      star.style.width = star.style.height = randomBetween(1, 2.5) + "px";
      star.style.animationDelay = randomBetween(0, 4) + "s";
      star.style.opacity = randomBetween(0.25, 0.85);
      container.appendChild(star);
    }
  }

  function renderEmojis(dayIndex) {
    var container = document.getElementById("floatEmojis");
    var list = EMOJI_CONFIG[dayIndex] || EMOJI_CONFIG[1];
    container.innerHTML = "";
    for (var i = 0; i < EMOJI_COUNT; i++) {
      var span = document.createElement("span");
      span.className = "float-emoji";
      var x = randomBetween(1, 99);
      var duration = randomBetween(FLOAT_EMOJI_DURATION_MIN, FLOAT_EMOJI_DURATION_MAX);
      var delay = -randomBetween(0, FLOAT_EMOJI_DELAY_MAX);
      var drift = randomBetween(-20, 20);
      span.setAttribute("style",
        "left: " + x + "%; " +
        "animation-duration: " + duration.toFixed(1) + "s; " +
        "animation-delay: " + delay.toFixed(1) + "s; " +
        "--drift: " + drift.toFixed(0) + "px;"
      );
      span.textContent = pickRandom(list);
      container.appendChild(span);
    }
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
        onReady: onYTPlayerReady
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

  function setDayGlow(dayIndex) {
    var color = DAY_GLOW[dayIndex] || DAY_GLOW[1];
    document.documentElement.style.setProperty("--day-glow", color);
    document.documentElement.style.setProperty("--day-glow-rgb", hexToRgb(color));
    document.documentElement.style.setProperty("--day-glow-shadow", "rgba(" + hexToRgb(color) + ", 0.35)");
  }

  function render() {
    var dayMetaEl = document.getElementById("dayMeta");
    var dayLabelEl = document.getElementById("dayLabel");
    var videoWrap = document.getElementById("videoWrap");
    var videoPlaceholder = document.getElementById("videoPlaceholder");
    var linkYesterdayEl = document.getElementById("linkYesterday");
    var photoWrap = document.getElementById("photoWrap");

    if (PERSONAL.photoUrl) {
      photoWrap.innerHTML = "<img src=\"" + PERSONAL.photoUrl + "\" alt=\"\" class=\"photo\">";
      photoWrap.style.display = "block";
    } else {
      photoWrap.innerHTML = "";
      photoWrap.style.display = "none";
    }

    if (todayIndex === 0 && viewingIndex === 1) {
      setDayGlow(1);
      renderEmojis(1);
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = "";
      if (videoWrap) videoWrap.style.display = "none";
      if (videoPlaceholder) {
        videoPlaceholder.textContent = "वैलेंटाइन वीक जल्द आ रहा है।";
        videoPlaceholder.style.display = "block";
      }
      linkYesterdayEl.style.display = "none";
      document.getElementById("navSep").style.display = "none";
      document.getElementById("linkTomorrow").style.display = "none";
      return;
    }

    if (todayIndex === 9 && viewingIndex === 8) {
      setDayGlow(8);
      renderEmojis(8);
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = "";
      if (videoWrap) videoWrap.style.display = "none";
      if (videoPlaceholder) {
        videoPlaceholder.textContent = "अगले साल मिलते हैं।";
        videoPlaceholder.style.display = "block";
      }
      linkYesterdayEl.style.display = "inline";
      document.getElementById("navSep").style.display = "inline";
      document.getElementById("linkTomorrow").style.display = "none";
      return;
    }

    if (viewingIndex >= 1 && viewingIndex <= 8) {
      setDayGlow(viewingIndex);
      renderEmojis(viewingIndex);
      var day = DAYS[viewingIndex - 1];
      var linkTomorrowEl = document.getElementById("linkTomorrow");
      var navSepEl = document.getElementById("navSep");
      dayMetaEl.textContent = "";
      dayLabelEl.textContent = day.nameEn + " — " + day.date + " February";
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
      linkTomorrowEl.style.display = "none";
      navSepEl.style.display = "none";
      if (viewingIndex === 8 && !confettiShown && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        fireConfetti();
        confettiShown = true;
      }
    }
  }

  function showILoveYouToast() {
    var text = PERSONAL.easterEgg || "I love you!";
    var toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.textContent = text;
    var photoWrap = document.getElementById("photoWrap");
    if (photoWrap) {
      var rect = photoWrap.getBoundingClientRect();
      toast.style.left = (rect.left + rect.width / 2) + "px";
      toast.style.top = (rect.bottom + 12) + "px";
    } else {
      toast.style.left = "50%";
      toast.style.top = "auto";
      toast.style.bottom = "2rem";
    }
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add("toast-show");
      });
    });
    setTimeout(function () {
      toast.classList.remove("toast-show");
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3500);
  }

  function fireConfetti() {
    var wrap = document.createElement("div");
    wrap.className = "confetti-wrap";
    var count = 30;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "confetti-particle";
      p.textContent = "♥";
      p.style.setProperty("--delay", randomBetween(0, 0.35) + "s");
      p.style.setProperty("--tx", (randomBetween(-100, 100)) + "px");
      p.style.setProperty("--ty", (randomBetween(-150, -250)) + "px");
      p.style.setProperty("--rot", randomBetween(0, 360) + "deg");
      p.style.color = pickRandom(["#e8b4bc", "#f0c8d0", "#d06070", "#ffb6c1"]);
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }, 2800);
  }

  function fireHeartBurst(originX, originY, color, emoji) {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var wrap = document.createElement("div");
    wrap.className = "heart-burst-wrap";
    wrap.style.left = originX + "px";
    wrap.style.top = originY + "px";
    wrap.style.transform = "translate(-50%, -50%)";
    var count = 25;
    for (var i = 0; i < count; i++) {
      var p = document.createElement("span");
      p.className = "heart-burst-particle";
      p.textContent = emoji || "♥";
      p.style.setProperty("--delay", randomBetween(0, 0.2) + "s");
      p.style.setProperty("--tx", (randomBetween(-120, 120)) + "px");
      p.style.setProperty("--ty", (randomBetween(-180, -80)) + "px");
      p.style.setProperty("--rot", randomBetween(0, 360) + "deg");
      p.style.color = color;
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function () {
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
    }, 2600);
  }

  function initMusicHeartsFloat() {
    var container = document.getElementById("musicHeartsFloat");
    if (!container) return;
    var i, pos, btn, trackId;
    for (i = 0; i < MUSIC_TRACKS.length; i++) {
      pos = randomPositionAvoidCenter();
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "music-emoji";
      btn.setAttribute("aria-label", "Play track " + (i + 1));
      btn.textContent = MUSIC_TRACKS[i].emoji;
      btn.style.left = pos.left + "%";
      btn.style.top = pos.top + "%";
      trackId = MUSIC_TRACKS[i].id;
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var id = ev.currentTarget.getAttribute("data-track-id");
        var target = document.getElementById(id);
        if (!target) return;
        if (ev.currentTarget.classList.contains("playing")) {
          target.pause();
          target.currentTime = 0;
          ev.currentTarget.classList.remove("playing");
        } else {
          var allAudios = document.querySelectorAll(".music-hearts-float ~ audio");
          for (var j = 0; j < allAudios.length; j++) {
            allAudios[j].pause();
            allAudios[j].currentTime = 0;
          }
          document.querySelectorAll(".music-emoji").forEach(function (b) { b.classList.remove("playing"); });
          var p = target.play();
          if (p && typeof p.then === "function") p.catch(function () {});
          ev.currentTarget.classList.add("playing");
        }
        pos = randomPositionAvoidCenter();
        ev.currentTarget.style.left = pos.left + "%";
        ev.currentTarget.style.top = pos.top + "%";
      });
      btn.setAttribute("data-track-id", trackId);
      container.appendChild(btn);
    }
    var yellowHeartCount = YELLOW_HEART_COUNT_MIN + Math.floor(Math.random() * (YELLOW_HEART_COUNT_MAX - YELLOW_HEART_COUNT_MIN + 1));
    for (i = 0; i < yellowHeartCount; i++) {
      pos = randomPositionAvoidCenter();
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "heart-emoji";
      btn.setAttribute("aria-label", "Heart burst");
      btn.textContent = "💛";
      btn.style.left = pos.left + "%";
      btn.style.top = pos.top + "%";
      btn.addEventListener("click", function (ev) {
        ev.stopPropagation();
        fireHeartBurst(ev.clientX, ev.clientY, RED_HEART_BURST.color, RED_HEART_BURST.emoji);
        pos = randomPositionAvoidCenter();
        ev.currentTarget.style.left = pos.left + "%";
        ev.currentTarget.style.top = pos.top + "%";
      });
      container.appendChild(btn);
    }
  }

  document.getElementById("linkYesterday").addEventListener("click", function (e) {
    e.preventDefault();
    if (viewingIndex > 1) {
      viewingIndex -= 1;
      render();
    }
  });

  document.getElementById("linkTomorrow").addEventListener("click", function (e) {
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
    }
  });

  document.body.addEventListener("click", function (ev) {
    var photoWrap = document.getElementById("photoWrap");
    if (photoWrap && (ev.target === photoWrap || ev.target.closest(".photo-wrap img"))) {
      showILoveYouToast();
    }
  });

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
