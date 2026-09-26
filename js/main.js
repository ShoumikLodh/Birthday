/* engine: loop, camera, input, interaction */

const W = 1280, H = 720;
const cv = document.getElementById('game');
const ctx = cv.getContext('2d');

const el = {
  title: document.getElementById('title-screen'),
  start: document.getElementById('start-btn'),
  caption: document.getElementById('caption'),
  capTitle: document.getElementById('caption-title'),
  capBody: document.getElementById('caption-body'),
  distance: document.getElementById('distance'),
  touch: document.getElementById('touch-controls'),
  ending: document.getElementById('ending'),
  endTitle: document.getElementById('ending-title'),
  endBody: document.getElementById('ending-body')
};

const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const ME_BODY = [86, 126, 168];
const HER_BODY = [226, 124, 118];
const me = new Character({ body: ME_BODY, hair: [38, 40, 54], skin: [226, 186, 152] });
const her = new Character({ body: HER_BODY, hair: [52, 34, 38], skin: [236, 198, 166], isHer: true });

const game = {
  running: false,
  cam: 0,
  t: 0,
  x: 120,
  vx: 0,
  speed: 245,
  captionOpen: false,
  activeProp: null,
  ended: false,
  kissT: -1,
  kissDone: false,
  myJumpIn: 0,
  lean: 0,
  herLean: 0
};

const keys = { left: false, right: false };
let interactQueued = false;
let jumpQueued = false;
let kissQueued = false;

/* she always goes first */
const JUMP_LAG = 0.2;
const KISS = { in: 0.45, hold: 0.62, out: 0.5 };
const KISS_TOTAL = KISS.in + KISS.hold + KISS.out;

/* ---------------- canvas sizing ---------------- */

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr;
  cv.height = H * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const s = Math.min(window.innerWidth / W, window.innerHeight / H);
  cv.style.width = Math.floor(W * s) + 'px';
  cv.style.height = Math.floor(H * s) + 'px';
}
window.addEventListener('resize', resize);
resize();

/* ---------------- input ---------------- */

window.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = true;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = true;
  if (e.key === 'e' || e.key === 'E' || e.key === ' ' || e.key === 'Enter') {
    e.preventDefault();
    interactQueued = true;
  }
  if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
    e.preventDefault();
    if (!e.repeat) jumpQueued = true;
  }
  if (e.key === 'k' || e.key === 'K') {
    e.preventDefault();
    if (!e.repeat) kissQueued = true;
  }
});

window.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') keys.left = false;
  if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') keys.right = false;
});

function hold(id, dir) {
  const b = document.getElementById(id);
  const on = (e) => { e.preventDefault(); keys[dir] = true; };
  const off = (e) => { e.preventDefault(); keys[dir] = false; };
  b.addEventListener('pointerdown', on);
  b.addEventListener('pointerup', off);
  b.addEventListener('pointercancel', off);
  b.addEventListener('pointerleave', off);
}
hold('tc-left', 'left');
hold('tc-right', 'right');
function tap(id, fn) {
  document.getElementById(id).addEventListener('pointerdown', (e) => {
    e.preventDefault();
    fn();
  });
}
tap('tc-act', () => { interactQueued = true; });
tap('tc-jump', () => { jumpQueued = true; });
tap('tc-kiss', () => { kissQueued = true; });

/* tapping anywhere dismisses an open caption */
cv.addEventListener('pointerdown', () => { if (game.captionOpen) interactQueued = true; });

el.start.addEventListener('click', () => {
  el.title.classList.add('gone');
  if (isTouch) el.touch.classList.remove('hidden');
  game.running = true;
});

/* ---------------- captions ---------------- */

function openCaption(key) {
  const c = CAPTIONS[key];
  if (!c) return;
  el.capTitle.textContent = c.title;
  el.capBody.textContent = c.body;
  el.caption.classList.remove('hidden');
  game.captionOpen = true;
}

function closeCaption() {
  el.caption.classList.add('hidden');
  game.captionOpen = false;

  /* boarding happens after you have read the goodbye */
  if (game.pendingFlight) {
    const p = game.pendingFlight;
    game.pendingFlight = null;
    const ride = p.ride || ((p.kind === 'bus' || p.kind === 'scooty') ? p.kind : 'flight');
    Cutscene.start(p.x, p.to, p.dur, ride);
  }
}

function tryInteract() {
  if (game.captionOpen) { closeCaption(); return; }
  if (Cutscene.running) return;

  const p = Props.nearest(game.x);
  if (p) {
    p.done = true;
    if (p.kind === 'dussehra') {
      for (let i = 0; i < 3; i++) Props.burst(p, U.rand(-170, 170), U.rand(-165, -65));
    }
    if (p.to) game.pendingFlight = p;
    if (p.kind === 'finale') { showEnding(); return; }
    openCaption(p.key);
  }
}

function busy() {
  return Cutscene.running || game.captionOpen || game.ended;
}

/* she jumps, then a beat later, so do I */
function tryJump() {
  if (busy() || game.kissT >= 0) return;
  her.jump();
  game.myJumpIn = JUMP_LAG;
}

function tryKiss() {
  if (busy() || game.kissT >= 0) return;

  if (World.gapAt(game.x) < 4) {
    game.kissT = 0;
    game.kissDone = false;
  } else {
    /* too far to reach, so we blow one instead */
    spawnHeart(game.x, World.hisY(game.x) - 66, 1);
    spawnHeart(her.worldX, World.herY(her.worldX) - 66, -1);
  }
}

/* the earliest flight you have not taken yet - you cannot walk past it */
function nextGate() {
  for (const p of PROPS) if (p.gate && !p.done) return p;
  return null;
}

function showEnding() {
  el.endTitle.textContent = ENDING.title;
  el.endBody.innerHTML = '';
  ENDING.lines.forEach((ln) => {
    const para = document.createElement('p');
    para.textContent = ln;
    el.endBody.appendChild(para);
  });
  el.ending.classList.remove('hidden');
  game.ended = true;
}

/* ---------------- loop ---------------- */

let last = performance.now();

function frame(now) {
  const dt = Math.min((now - last) / 1000, 0.05);
  last = now;
  game.t += dt;

  if (interactQueued) { interactQueued = false; if (game.running) tryInteract(); }
  if (jumpQueued) { jumpQueued = false; if (game.running) tryJump(); }
  if (kissQueued) { kissQueued = false; if (game.running) tryKiss(); }

  if (game.running) update(dt);
  render();

  requestAnimationFrame(frame);
}

function update(dt) {
  if (Cutscene.running) {
    Cutscene.update(dt, game);
    game.vx = 0;
    me.moving = false;
    me.facing = 1;
    me.update(dt, 0);
  } else {
    const canMove = !game.captionOpen && !game.ended && game.kissT < 0;
    let dir = 0;
    if (canMove) {
      if (keys.left) dir -= 1;
      if (keys.right) dir += 1;
    }

    game.vx = dir * game.speed;
    game.x = U.clamp(game.x + game.vx * dt, 60, World.END - 60);

    /* you have to actually get on the plane */
    const gate = nextGate();
    if (gate && game.x > gate.x) game.x = gate.x;

    me.moving = dir !== 0;
    me.facing = dir < 0 ? -1 : 1;
    me.update(dt, game.vx);
  }

  /* what we are wearing depends on which memory we are standing in */
  const look = World.lookAt(game.x);
  if (look) {
    me.body = look.him.body;   me.garment = look.him.garment;
    her.body = look.her.body;  her.garment = look.her.garment;
  } else {
    me.body = ME_BODY;   me.garment = World.gapAt(game.x) > 200 ? 'corporate' : 'casual';
    her.body = HER_BODY; her.garment = 'casual';
  }

  /* my jump lands a beat after hers */
  if (game.myJumpIn > 0) {
    game.myJumpIn -= dt;
    if (game.myJumpIn <= 0) { me.jump(); game.myJumpIn = 0; }
  }

  /* holding hands, for the whole time we are in the same place */
  game.holding = game.x > 8900 && game.x < 12900 && World.gapAt(game.x) < 4;

  /* she keeps pace: beside me when the paths are one, straight across when they are not */
  const gapN = World.gapAt(game.x) / World.MAX_GAP;
  let lead = game.holding ? 34 : 92 * (1 - gapN);

  game.lean = 0;
  game.herLean = 0;

  if (game.kissT >= 0) {
    game.kissT += dt;
    const k = game.kissT;

    if (k < KISS.in) {
      lead = U.lerp(lead, 23, U.easeInOut(k / KISS.in));
      her.moving = true;
    } else if (k < KISS.in + KISS.hold) {
      lead = 23;
      her.moving = false;
      game.lean = 3;
      game.herLean = -3;
      if (!game.kissDone) {
        game.kissDone = true;
        const fy = World.hisY(game.x) - 74;
        for (let i = 0; i < 3; i++) spawnHeart(game.x + 8 + i * 5, fy - i * 6, -1);
      }
    } else {
      lead = U.lerp(23, lead, U.easeInOut((k - KISS.in - KISS.hold) / KISS.out));
      her.moving = true;
    }

    her.facing = -1;
    me.facing = 1;
    if (game.kissT > KISS_TOTAL) game.kissT = -1;
  } else {
    her.moving = Cutscene.running ? true : me.moving;
    her.facing = Cutscene.running ? 1 : me.facing;
  }

  her.update(dt, Cutscene.running ? 210 : (game.kissT >= 0 ? 150 : game.vx));
  her.worldX = game.x + lead;

  /* camera eases toward me */
  game.cam += (game.x - game.cam) * U.clamp(dt * 6, 0, 1);

  /* near the things we do together, we stop being busy at each other */
  const near = Cutscene.running ? null : Props.nearest(game.x);
  const relaxed = !!(near && near.lane === 'gap');
  const cyc = relaxed ? (Math.sin(game.t * 1.15) + 1) / 2 : 0;
  if (relaxed && game.prevKiss > 0.9 && cyc <= 0.9) {
    spawnHeart(game.x, World.hisY(game.x) - 62, 1);
    spawnHeart(her.worldX, World.herY(her.worldX) - 62, -1);
  }
  game.prevKiss = cyc;
  game.kiss = cyc;

  updateHearts(dt);
  updateHUD();
  Props.update(dt, game.t);
}

/* ---------------- blown kisses ---------------- */

const hearts = [];

function spawnHeart(wx, y, dirY) {
  hearts.push({ x: wx, y: y, vx: U.rand(-10, 10), vy: dirY * U.rand(64, 92), life: 3.2, max: 3.2 });
}

function updateHearts(dt) {
  for (let i = hearts.length - 1; i >= 0; i--) {
    const h = hearts[i];
    h.life -= dt;
    h.x += h.vx * dt;
    h.y += h.vy * dt;
    if (h.life <= 0) hearts.splice(i, 1);
  }
}

function drawHearts(cam) {
  for (const h of hearts) {
    const a = U.clamp(h.life / h.max, 0, 1);
    const r = 8 * (0.55 + a * 0.45);
    const x = h.x - cam + W / 2;
    ctx.save();
    ctx.translate(x + Math.sin(h.life * 3) * 4, h.y);
    ctx.beginPath();
    ctx.moveTo(0, r * 0.78);
    ctx.bezierCurveTo(-r * 1.35, -r * 0.3, -r * 0.5, -r * 1.25, 0, -r * 0.5);
    ctx.bezierCurveTo(r * 0.5, -r * 1.25, r * 1.35, -r * 0.3, 0, r * 0.78);
    ctx.closePath();
    ctx.fillStyle = 'rgba(246,132,142,' + (a * 0.88) + ')';
    ctx.fill();
    ctx.restore();
  }
}

function updateHUD() {
  const gap = World.gapAt(game.x);
  const km = Math.round((gap / World.MAX_GAP) * 5847);
  if (km > 20) {
    el.distance.textContent = km.toLocaleString('en-US') + ' km apart';
    el.distance.classList.add('show');
  } else {
    el.distance.classList.remove('show');
  }
}

/* ---------------- render ---------------- */

function render() {
  const cam = game.cam;
  const dark = World.darkness(cam);
  const gapN = World.gapAt(cam) / World.MAX_GAP;

  World.drawSky(ctx, cam, W, H);
  World.drawStars(ctx, cam, W, H, game.t);
  World.drawCelestial(ctx, cam, W, H);
  World.drawRegionBands(ctx, cam, W, H);
  World.drawClouds(ctx, cam, W, H, game.t);

  const city = World.cityAt(cam);

  ctx.save();
  ctx.globalAlpha = (1 - gapN * 0.82) * (1 - city);
  World.drawHills(ctx, cam, W, H);
  ctx.restore();

  World.drawSkyline(ctx, cam, W, H, game.t);

  World.drawPaths(ctx, cam, W, H, game.t);
  Props.drawScenery(ctx, cam, W, H, game.t, dark);
  Props.draw(ctx, cam, W, H, game.t, game.x);
  Props.drawTraffic(ctx, cam, W, game.t);

  /* characters */
  const myScreenX = game.x - cam + W / 2;
  const herScreenX = her.worldX - cam + W / 2;

  const riding = Cutscene.running &&
    (Cutscene.kind === 'bus' || Cutscene.kind === 'scooty' || Cutscene.kind === 'timeskip');

  let herHand = null;
  if (!riding) {
    herHand = her.draw(ctx, herScreenX,
      World.herY(her.worldX || game.x) - her.jumpY(), game.t,
      { hold: game.holding ? -1 : 0, kiss: game.kiss || 0, toward: -1,
        lean: game.herLean || 0 });
  }

  let myHand = null;
  if (Cutscene.kind === 'timeskip') {
    Cutscene.draw(ctx, cam, W, game.t, (c) => {
      me.draw(c, -17, -13, game.t);
      her.draw(c, 17, -13, game.t);
    });
  } else if (Cutscene.running) {
    Cutscene.draw(ctx, cam, W, game.t, (c) => me.draw(c, 0, -13, game.t));
  } else {
    myHand = me.draw(ctx, myScreenX, World.hisY(game.x) - me.jumpY(), game.t,
      { hold: game.holding ? 1 : 0, kiss: game.kiss || 0, toward: 1,
        lean: game.lean || 0 });
  }

  drawHearts(cam);

  if (myHand && herHand) {
    U.line(ctx, myHand.x, myHand.y, herHand.x, herHand.y, 'rgba(255,206,158,0.9)', 5.5);
    U.circle(ctx, (myHand.x + herHand.x) / 2, (myHand.y + herHand.y) / 2, 4.2, 'rgba(255,230,196,0.95)');
  }

  World.drawStormTint(ctx, cam, W, H);
  World.drawRain(ctx, cam, W, H, game.t);

  drawPrompt(cam);
}

function drawPrompt(cam) {
  if (game.captionOpen || !game.running || Cutscene.running) return;
  const p = Props.nearest(game.x);
  if (!p) return;

  const sx = p.x - cam + W / 2;
  const sy = World.hisY(p.x) - 140 + Math.sin(game.t * 2.4) * 5;
  const label = isTouch ? 'tap' : 'E';

  ctx.save();
  ctx.globalAlpha = 0.94;
  U.rr(ctx, sx - 26, sy - 17, 52, 34, 17, 'rgba(18,20,32,0.82)');
  ctx.strokeStyle = 'rgba(255,217,160,0.65)';
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.fillStyle = '#ffd9a0';
  ctx.font = '700 15px Quicksand, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, sx, sy + 1);
  ctx.restore();
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

her.worldX = game.x + 92;
requestAnimationFrame(frame);
