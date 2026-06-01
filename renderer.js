// =============================================================================
//  RENDERER.JS — App logic
// =============================================================================

// ─────────────────────────────────────────────────────────────────────────────
//  SETTINGS — EDIT THESE
// ─────────────────────────────────────────────────────────────────────────────

// The name shown in the greeting and on special day screens
var RECIPIENT_NAME = 'Ichayan'; // <── EDIT THIS

// =============================================================================

(function () {
  'use strict';

  // ── Date helpers ──────────────────────────────────────────

  function getDayOfYear(date) {
    var start = new Date(date.getFullYear(), 0, 1);
    return Math.floor((date - start) / 86400000) + 1;
  }

  // ── Today ─────────────────────────────────────────────────

  var now             = new Date();
  var IS_BIRTHDAY     = (now.getMonth() + 1 === 6  && now.getDate() === 4);
  var IS_ANNIVERSARY  = (now.getMonth() + 1 === 1  && now.getDate() === 17);

  // ── Verse helpers ──────────────────────────────────────────

  function getTodaysEntry() {
    var v = window.VERSES;
    if (!v || !v.length) return null;
    return v[(getDayOfYear(now) - 1) % v.length];
  }

  function getRandomEntry() {
    var v = window.VERSES;
    if (!v || !v.length) return null;
    return v[Math.floor(Math.random() * v.length)];
  }

  function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function displayEntry(entry, animate) {
    if (!entry) return;
    if (animate) {
      var card = document.getElementById('letterCard');
      // Only animate if we're showing the front face
      if (card && !card.classList.contains('flipped')) {
        card.style.transition = 'none';
        card.style.transform  = 'rotateY(6deg) scale(0.97)';
        setTimeout(function () {
          card.style.transition = '';
          card.style.transform  = '';
        }, 30);
      }
    }
    setText('verseReference', entry.reference);
    setText('verseText',      entry.verse);
  }

  // ── Photo on card back ─────────────────────────────────────

  // ── Birthday screen ────────────────────────────────────────

  function showBirthdayScreen() {
    var overlay = document.getElementById('birthdayOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    setTimeout(runConfetti, 450);
  }

  // ── Anniversary screen (January 17) ───────────────────────

  function showAnniversaryScreen() {
    var overlay = document.getElementById('anniversaryOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    setTimeout(runConfetti, 450);
  }

  // ── Confetti ───────────────────────────────────────────────

  var cfState = { active: false, pieces: [] };
  var CF_COLORS = ['#F7C873','#F4A460','#C084E0','#DDA0DD','#90EE90','#87CEEB','#FFB6C1','#B89FE0'];

  function spawnPieces(canvas) {
    for (var i = 0; i < 120; i++) {
      cfState.pieces.push({
        x: Math.random() * canvas.width,
        y: Math.random() * -canvas.height * 0.5,
        w: Math.random() * 10 + 4,
        h: Math.random() * 5 + 3,
        color: CF_COLORS[Math.floor(Math.random() * CF_COLORS.length)],
        rot: Math.random() * Math.PI * 2,
        rv:  (Math.random() - 0.5) * 0.08,
        vx:  (Math.random() - 0.5) * 1.8,
        vy:  Math.random() * 2.5 + 1.2,
        op: 1
      });
    }
  }

  function runConfetti() {
    var canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    var ctx = canvas.getContext('2d');
    cfState.active = true;
    spawnPieces(canvas);

    (function tick() {
      if (!cfState.active) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      cfState.pieces = cfState.pieces.filter(function (p) {
        return p.y < canvas.height + 30 && p.op > 0.05;
      });
      cfState.pieces.forEach(function (p) {
        p.x += p.vx; p.y += p.vy; p.rot += p.rv;
        if (p.y > canvas.height * 0.75) p.op -= 0.012;
        ctx.save();
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.globalAlpha = Math.max(0, p.op);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      if (cfState.pieces.length < 60) spawnPieces(canvas);
      requestAnimationFrame(tick);
    })();
  }

  // ── Envelope open / card flip ──────────────────────────────

  var envelopeOpened = false;
  var cardFlipped    = false;

  function openEnvelope() {
    if (envelopeOpened) return;
    envelopeOpened = true;

    var envelope   = document.getElementById('envelope');
    var container  = document.getElementById('letterContainer');
    var hint       = document.getElementById('openHint');

    // 1. Open the flap (CSS handles via .opened class)
    if (envelope) envelope.classList.add('opened');

    // 2. After a short delay, rise the letter
    setTimeout(function () {
      if (container) container.classList.add('risen');
      if (hint)      hint.classList.add('hidden');
    }, 260);

  }

  function flipCard() {
    var card = document.getElementById('letterCard');
    if (!card) return;
    cardFlipped = !cardFlipped;
    card.classList.toggle('flipped', cardFlipped);
  }

  function initSpecialCard(id) {
    var card = document.getElementById(id);
    if (!card) return;
    card.addEventListener('click', function () {
      card.classList.toggle('flipped');
    });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') card.classList.toggle('flipped');
    });
  }

  function initInteractions() {
    // Open envelope on click/key
    var envelope = document.getElementById('envelope');
    if (envelope) {
      envelope.addEventListener('click', openEnvelope);
      envelope.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') openEnvelope();
      });
    }

    // Flip card on click/key (only when risen)
    var container = document.getElementById('letterContainer');
    var card      = document.getElementById('letterCard');
    if (card && container) {
      card.addEventListener('click', function () {
        if (container.classList.contains('risen')) flipCard();
      });
      card.addEventListener('keydown', function (e) {
        if ((e.key === 'Enter' || e.key === ' ') && container.classList.contains('risen')) {
          flipCard();
        }
      });
    }

  }

  // ── Init ──────────────────────────────────────────────────

  // ── Floating hearts ───────────────────────────────────────

  function spawnFloatingHearts() {
    var layer  = document.getElementById('heartsLayer');
    if (!layer) return;

    var colors = [
      'rgba(192,132,224,0.45)',
      'rgba(155,114,207,0.35)',
      'rgba(216,180,245,0.50)',
      'rgba(220,150,220,0.40)',
      'rgba(180,159,224,0.45)',
      'rgba(240,200,250,0.55)'
    ];

    var count = 30;
    for (var i = 0; i < count; i++) {
      (function(i) {
        var h     = document.createElement('div');
        h.className = 'fheart';
        var size  = 8 + Math.random() * 14;
        var left  = Math.random() * 100;
        var dur   = 10 + Math.random() * 14;
        var delay = -(Math.random() * dur);
        var color = colors[Math.floor(Math.random() * colors.length)];

        h.style.cssText = [
          'left:'               + left  + 'vw',
          'font-size:'          + size  + 'px',
          'color:'              + color,
          'animation-duration:' + dur   + 's',
          'animation-delay:'    + delay + 's'
        ].join(';');

        layer.appendChild(h);
      })(i);
    }
  }

  // ── Greeting ───────────────────────────────────────────────

  function setGreeting() {
    var hour = now.getHours();
    var text;
    if (hour >= 5 && hour < 12) {
      text = 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      text = 'Good Afternoon';
    } else {
      text = 'Good Evening';
    }
    var el = document.getElementById('greeting');
    if (el) el.innerHTML = text + ', <span>' + RECIPIENT_NAME + '</span>';
  }

  // ── Init ──────────────────────────────────────────────────

  function init() {
    spawnFloatingHearts();
    setGreeting();
    displayEntry(getTodaysEntry(), false);
    initInteractions();

    if (IS_BIRTHDAY)    { showBirthdayScreen();    initSpecialCard('birthdayCard'); }
    if (IS_ANNIVERSARY) { showAnniversaryScreen(); initSpecialCard('anniversaryCard'); }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
