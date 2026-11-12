/* ==========================================================================
   Patte mein basa Suraj — animatic player
   Timeline engine for the 12-shot Madhubani reel. No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  var scenes = window.REEL_SCENES || [];
  var TOTAL = window.REEL_TOTAL || 75;
  if (!scenes.length) return;

  var $ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  var app = $("#app");
  var stageScenes = $("#scenes");
  var shade = $("#foldShade");
  var shotId = $("#shotId");
  var shotName = $("#shotName");
  var cueLine = $("#cueLine");
  var scrub = $("#scrub");
  var ticks = $("#ticks");
  var playBtn = $("#play");
  var nowEl = $("#now");
  var nowRange = $("#nowRange");
  var nowTitle = $("#nowTitle");
  var nowCue = $("#nowCue");
  var cueName = $("#cueName");
  var shotlist = $("#shotlist");

  var SHORTS = [
    'Kelwa ke paat — veins nadi ki lehron mein badalti hain.',
    'Gudiya ki aankh mein chhota suraj; Maa ka phool.',
    'Soop sajta hai — har beat par ek nayi cheez.',
    'Ghat ki raah — haath thaame, daura sambhaale.',
    'Ghat ka wide reveal — diye kinare par.',
    'Sandhya arghya — soop ke theek peeche suraj.',
    'Suraj doobta hai…',
    '…aur diye ki lau ban jaata hai.',
    'Neend mein subah — wahi raasta, naya aasmaan.',
    'Usha arghya — pehli kiran, sone ka paani.',
    'Teen peedhiyan, ek pranam.',
    'Boond phir se — seamless loop.'
  ];

  var panels = [];
  var active = -1;
  var t = 0;
  var playing = false;
  var last = 0;
  var lastUI = -1;

  /* ------------------------------------------------------------ build DOM */

  var titleCard =
    '<div class="titlecard">' +
    '<div class="deva">छठ — <span>आस्था की रोशनी</span><br />पीढ़ी-दर-पीढ़ी</div>' +
    '<div class="en">faith · light · handed down</div>' +
    "</div>";

  scenes.forEach(function (s, i) {
    var panel = document.createElement("div");
    panel.className = "scene";
    panel.dataset.scene = String(i);
    panel.innerHTML = s.svg + (s.titleCard ? titleCard : "");
    stageScenes.appendChild(panel);
    panels.push(panel);
    s.panel = panel;
    s.els = Array.prototype.slice.call(panel.querySelectorAll("[data-at]"));
    s.card = panel.querySelector(".titlecard");

    var row = document.createElement("button");
    row.type = "button";
    row.className = "shot";
    row.dataset.scene = String(i);
    row.innerHTML =
      '<span class="t">' + fmt(s.t0) + "–" + fmt(s.t1) + "</span>" +
      '<span class="n">' + s.title + "<small>" + s.note + "</small></span>";
    row.addEventListener("click", function () {
      seek(s.t0 + 0.001);
      setPlaying(false);
    });
    shotlist.appendChild(row);
    s.row = row;
  });

  /* ticks + scrub range */
  scrub.max = String(TOTAL);
  scenes.forEach(function (s, i) {
    if (i === 0) return;
    var tick = document.createElement("i");
    tick.style.left = (s.t0 / TOTAL) * 100 + "%";
    ticks.appendChild(tick);
  });
  $("#shotCount").textContent = scenes.length + " shots";

  /* ------------------------------------------------------------- helpers */

  function fmt(sec) {
    sec = Math.max(0, sec);
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ":" + (s < 10 ? "0" : "") + s;
  }

  function indexAt(time) {
    for (var i = scenes.length - 1; i >= 0; i--) {
      if (time >= scenes[i].t0) return i;
    }
    return 0;
  }

  function easeOut(p) {
    return 1 - Math.pow(1 - p, 3);
  }

  /* ------------------------------------------------------------- playback */

  function setActive(i, animate) {
    if (i === active) return;
    panels.forEach(function (p, idx) {
      if (idx !== i) {
        p.classList.remove("on", "fold-in");
        p.classList.remove("is-active");
      }
    });

    var p = panels[i];
    p.classList.add("on", "is-active");

    if (animate) {
      p.classList.remove("fold-in");
      void p.offsetWidth;
      p.classList.add("fold-in");
      shade.classList.remove("run");
      void shade.offsetWidth;
      shade.classList.add("run");
    }

    scenes[i].els.forEach(function (el) {
      el.style.setProperty("--p", "0");
    });

    active = i;
    var sc = scenes[i];
    shotId.firstElementChild.textContent =
      String(i + 1).padStart(2, "0") + " / " + String(scenes.length).padStart(2, "0");
    shotName.textContent = sc.title;
    cueLine.innerHTML = SHORTS[i] || sc.cue;
    cueName.textContent = sc.title;
    nowRange.textContent = fmt(sc.t0) + " – " + fmt(sc.t1);
    nowTitle.textContent = sc.title;
    nowCue.textContent = sc.cue;
    scenes.forEach(function (s, idx) {
      s.row.classList.toggle("active", idx === i);
    });
    var row = sc.row;
    if (row) {
      var box = shotlist;
      var top = row.offsetTop - box.offsetTop;
      if (top < box.scrollTop || top + row.offsetHeight > box.scrollTop + box.clientHeight) {
        box.scrollTo({ top: Math.max(0, top - 40), behavior: "smooth" });
      }
    }
  }

  function seek(time, animate) {
    t = Math.max(0, Math.min(TOTAL - 0.001, time));
    var i = indexAt(t);
    setActive(i, animate !== false);
    render();
  }

  function setPlaying(next) {
    playing = next;
    playBtn.textContent = playing ? "❚❚ Pause" : "▶ Play";
    playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    document.body.classList.toggle("idle", playing && app.classList.contains("clean"));
  }

  /* --------------------------------------------------------------- render */

  function render() {
    var i = indexAt(t);
    if (i !== active) setActive(i, true);
    var sc = scenes[i];
    var local = t - sc.t0;
    var dur = sc.t1 - sc.t0;

    if (sc.panel) {
      sc.panel.style.setProperty("--local", local.toFixed(2));
      for (var k = 0; k < sc.els.length; k++) {
        var el = sc.els[k];
        var at = parseFloat(el.dataset.at) || 0;
        var d = parseFloat(el.dataset.dur) || 0.75;
        var p = Math.max(0, Math.min(1, (local - at) / d));
        el.style.setProperty("--p", easeOut(p).toFixed(3));
      }
      if (sc.card) {
        if (local > dur * 0.22) sc.card.classList.add("show");
        else sc.card.classList.remove("show");
      }
    }

    if (nowEl && Math.floor(t * 4) !== lastUI) {
      lastUI = Math.floor(t * 4);
      nowEl.textContent = fmt(t);
    }
    if (document.activeElement !== scrub) scrub.value = String(t);
  }

  function frame(now) {
    if (!last) last = now;
    var dt = Math.min(0.12, (now - last) / 1000);
    last = now;
    if (playing) {
      t += dt;
      if (t >= TOTAL) {
        t = 0;
        setActive(0, true);
      }
    }
    render();
    requestAnimationFrame(frame);
  }

  /* ------------------------------------------------------------- controls */

  playBtn.addEventListener("click", function () {
    if (!playing && t >= TOTAL - 0.05) t = 0;
    setPlaying(!playing);
  });

  $("#prev").addEventListener("click", function () {
    var i = indexAt(t);
    var jump = t - scenes[i].t0 > 0.7 ? scenes[i].t0 : scenes[Math.max(0, i - 1)].t0;
    seek(jump);
  });

  $("#next").addEventListener("click", function () {
    var i = indexAt(t);
    seek(i + 1 < scenes.length ? scenes[i + 1].t0 : TOTAL - 0.01);
  });

  $("#restart").addEventListener("click", function () {
    seek(0);
    setPlaying(true);
  });

  $("#clean").addEventListener("click", toggleClean);
  $("#export").addEventListener("click", exportFrame);

  scrub.addEventListener("input", function () {
    setPlaying(false);
    seek(parseFloat(scrub.value), false);
  });

  stageScenes.parentElement.addEventListener("click", function (e) {
    if (e.target.closest("button, input")) return;
    setPlaying(!playing);
  });

  /* rasterise the current shot to a 1080x1920 PNG */
  function exportFrame() {
    var sc = scenes[active];
    if (!sc) return;
    var svg = sc.panel.querySelector("svg");
    if (!svg) return;
    var clone = svg.cloneNode(true);
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("width", "1080");
    clone.setAttribute("height", "1920");
    var style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.textContent =
      "[data-at]{opacity:var(--p,0)}.enter{transform:translateY(calc((1 - var(--p,0)) * 26px))}";
    clone.insertBefore(style, clone.firstChild);

    var xml = new XMLSerializer().serializeToString(clone);
    var url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml;charset=utf-8" }));
    var img = new Image();
    img.onload = function () {
      try {
        var canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1920;
        canvas.getContext("2d").drawImage(img, 0, 0, 1080, 1920);
        canvas.toBlob(function (blob) {
          var a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download =
            "patte-mein-basa-suraj_" +
            String(active + 1).padStart(2, "0") +
            "_" +
            sc.title.toLowerCase().replace(/[^a-z0-9]+/g, "-") +
            ".png";
          a.click();
          setTimeout(function () {
            URL.revokeObjectURL(a.href);
          }, 4000);
        }, "image/png");
      } catch (err) {
        console.warn("export failed", err);
      }
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }

  function toggleClean() {
    app.classList.toggle("clean");
    document.body.classList.toggle("idle", app.classList.contains("clean") && playing);
  }

  document.addEventListener("keydown", function (e) {
    if (e.target.matches("input, textarea")) return;
    var k = e.key;
    if (k === " ") {
      e.preventDefault();
      setPlaying(!playing);
    } else if (k === "ArrowRight") {
      seek(t + 2);
    } else if (k === "ArrowLeft") {
      seek(t - 2);
    } else if (k === "[") {
      var i = indexAt(t);
      seek(scenes[Math.max(0, i - 1)].t0);
    } else if (k === "]") {
      var j = indexAt(t);
      seek(j + 1 < scenes.length ? scenes[j + 1].t0 : TOTAL - 0.01);
    } else if (k === "h" || k === "H") {
      toggleClean();
    } else if (k === "c" || k === "C") {
      app.classList.toggle("captions-off");
    } else if (k === "r" || k === "R") {
      seek(0);
      setPlaying(true);
    } else if (k === "p" || k === "P") {
      exportFrame();
    } else if (k === "f" || k === "F") {
      if (document.fullscreenElement) document.exitFullscreen();
      else if (app.requestFullscreen) app.requestFullscreen();
    }
  });

  /* deep link: ?t=33 or ?shot=6 */
  var params = new URLSearchParams(location.search);
  if (params.has("t")) t = Math.max(0, Math.min(TOTAL - 0.01, parseFloat(params.get("t")) || 0));
  else if (params.has("shot")) {
    var n = Math.max(1, Math.min(scenes.length, parseInt(params.get("shot"), 10) || 1));
    t = scenes[n - 1].t0;
  }

  setActive(indexAt(t), false);
  render();
  requestAnimationFrame(frame);

  window.REEL_PLAYER = {
    seek: seek,
    play: function () { setPlaying(true); },
    pause: function () { setPlaying(false); },
    get time() { return t; },
    get playing() { return playing; },
  };
})();
