/* interactive memories + roadside scenery */

const PROPS = [
  /* ---- together ---- */
  { x: 900,   key: 'ferris',    kind: 'ferris',    spin: 0, anim: 0, done: false },
  { x: 1550,  key: 'dussehra',  kind: 'dussehra',  parts: [], burstT: 0, anim: 0, done: false, rate: 0.26 },
  { x: 2300,  key: 'picnic',    kind: 'picnic',    anim: 0, done: false,
              sq: { x: -70, tx: 50, dir: 1, pause: 0.8, hop: 0, twitch: 0 } },
  { x: 3000,  key: 'food',      kind: 'street',    anim: 0, done: false },
  { x: 3650,  key: 'momo',      kind: 'momo',      anim: 0, done: false },
  { x: 4450,  key: 'train',     kind: 'train',     anim: 0, done: false },

  /* ---- he flies out ---- */
  { x: 5050,  key: 'flight',    kind: 'flight',    anim: 0, done: false,
              gate: true, to: 5760, dur: 5.6 },

  /* ---- apart ---- */
  { x: 6300,  key: 'call',      kind: 'call',   lane: 'gap', anim: 0, done: false },
  { x: 7100,  key: 'anime',     kind: 'anime',  lane: 'gap', anim: 0, done: false },
  { x: 7900,  key: 'bday',      kind: 'bday',   lane: 'gap', anim: 0, done: false, conf: [] },

  /* ---- he flies to her ---- */
  { x: 8250,  key: 'toher',     kind: 'flight',    anim: 0, done: false,
              gate: true, to: 8910, dur: 5.8 },

  /* ---- the bus takes us out of the city ---- */
  { x: 9400,  key: 'bus',       kind: 'bus',       anim: 0, done: false,
              gate: true, to: 10160, dur: 6.2 },

  /* ---- the mountains ---- */
  { x: 10600, key: 'view',      kind: 'view',      anim: 0, done: false },
  { x: 11050, key: 'scooty',    kind: 'scooty',    anim: 0, done: false,
              gate: true, to: 12050, dur: 11.5 },
  { x: 12400, key: 'coffee',    kind: 'coffee',    anim: 0, done: false },

  /* ---- and back ---- */
  { x: 12900, key: 'goodbye',   kind: 'flight',    anim: 0, done: false,
              gate: true, to: 13560, dur: 5.6 },

  /* ---- apart, still talking about the same city ---- */
  { x: 14250, key: 'dream',     kind: 'dream',  lane: 'gap', anim: 0, done: false },

  /* ---- the years go past ---- */
  { x: 15000, key: 'haze',      kind: 'haze',      anim: 0, done: false,
              gate: true, to: 16250, dur: 15, ride: 'timeskip', rate: 0.3 },

  /* ---- new york ---- */
  { x: 16600, key: 'liberty',   kind: 'liberty',   anim: 0, done: false },
  { x: 17300, key: 'taxi',      kind: 'taxi',      anim: 0, done: false },
  { x: 18000, key: 'empire',    kind: 'empire',    anim: 0, done: false },
  { x: 18700, key: 'finale',    kind: 'finale',    anim: 0, done: false }
];

const TRIGGER_R = 95;

const Props = {
  update(dt, t) {
    for (const p of PROPS) {
      if (p.done && p.anim < 1) p.anim = U.clamp(p.anim + dt * (p.rate || 0.55), 0, 1);

      if (p.kind === 'ferris') {
        p.spin += dt * (0.22 + p.anim * 0.75);
      }

      if (p.kind === 'bday') {
        for (let i = p.conf.length - 1; i >= 0; i--) {
          const q = p.conf[i];
          q.life -= dt;
          q.x += q.vx * dt;
          q.y += q.vy * dt;
          q.r += q.vr * dt;
          if (q.life <= 0 || q.y > 215) p.conf.splice(i, 1);
        }
        if (p.done && p.conf.length < 80) {
          p.spawn = (p.spawn || 0) - dt;
          if (p.spawn <= 0) {
            p.spawn = 0.05;
            const cols = [[246, 168, 92], [232, 110, 126], [122, 186, 202], [242, 206, 110], [178, 226, 190]];
            p.conf.push({
              x: U.rand(-200, 200), y: -205,
              vx: U.rand(-18, 18), vy: U.rand(42, 96),
              r: U.rand(0, 6.2), vr: U.rand(-3.2, 3.2),
              life: U.rand(2.6, 4.4),
              col: cols[Math.floor(Math.random() * cols.length)]
            });
          }
        }
      }

      if (p.kind === 'picnic') {
        const s = p.sq;
        if (s.pause > 0) {
          s.pause -= dt;
          s.hop = 0;
          s.twitch += dt;
        } else {
          const d = s.tx - s.x;
          s.dir = d < 0 ? -1 : 1;
          s.x += s.dir * 52 * dt;
          s.hop = Math.abs(Math.sin(t * 11)) * 9;
          if (Math.abs(d) < 5) {
            s.tx = U.rand(-120, 120);
            s.pause = U.rand(0.5, 2.1);
          }
        }
      }

      if (p.kind === 'dussehra') {
        for (let i = p.parts.length - 1; i >= 0; i--) {
          const q = p.parts[i];
          q.life -= dt;
          q.x += q.vx * dt;
          q.y += q.vy * dt;
          q.vy += 42 * dt;
          q.vx *= 0.994;
          if (q.life <= 0) p.parts.splice(i, 1);
        }
        if (p.done) {
          p.burstT -= dt;
          if (p.burstT <= 0) {
            p.burstT = U.rand(0.55, 1.15);
            this.burst(p, U.rand(-210, 210), U.rand(-175, -55));
          }
        }
      }
    }
  },

  burst(p, ox, oy) {
    const hues = [[255, 176, 120], [255, 226, 150], [180, 214, 255], [246, 150, 186], [178, 246, 210]];
    const col = hues[Math.floor(Math.random() * hues.length)];
    const n = 26 + Math.floor(Math.random() * 14);
    const sp = U.rand(80, 145);
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + U.rand(-0.1, 0.1);
      const s = sp * U.rand(0.55, 1.15);
      p.parts.push({
        x: ox, y: oy,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: U.rand(0.9, 1.7),
        max: 1.7,
        col: col
      });
    }
  },

  nearest(px) {
    let best = null, bd = TRIGGER_R;
    for (const p of PROPS) {
      const d = Math.abs(p.x - px);
      if (d < bd) { bd = d; best = p; }
    }
    return best;
  },

  draw(ctx, cam, W, H, t, playerX) {
    const dark = World.darkness(cam);
    for (const p of PROPS) {
      const sx = p.x - cam + W / 2;
      if (sx < -600 || sx > W + 600) continue;
      const baseY = p.lane === 'gap' ? World.PATH_Y : World.hisY(p.x);

      const near = 1 - U.clamp((Math.abs(p.x - playerX) - 110) / 430, 0, 1);
      this.memoryGlow(ctx, sx, baseY, t, near, p);

      const fn = this['draw_' + p.kind];
      if (fn) fn.call(this, ctx, sx, baseY, t, p, dark);
    }
  },

  /* every memory is a warm pool of light you walk into */
  memoryGlow(ctx, x, y, t, near, p) {
    const warmth = 0.34 + near * 0.66;
    const R = 300 + near * 90;

    const g = ctx.createRadialGradient(x, y - 70, 10, x, y - 70, R);
    g.addColorStop(0, 'rgba(255,198,132,' + (0.24 * warmth) + ')');
    g.addColorStop(0.45, 'rgba(255,176,116,' + (0.12 * warmth) + ')');
    g.addColorStop(1, 'rgba(255,170,110,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - R, y - 70 - R, R * 2, R * 2);

    /* a brighter pool spilled on the path itself */
    if (p.lane !== 'gap') {
      const f = ctx.createLinearGradient(x - 190, 0, x + 190, 0);
      f.addColorStop(0, 'rgba(255,206,146,0)');
      f.addColorStop(0.5, 'rgba(255,206,146,' + (0.2 * warmth) + ')');
      f.addColorStop(1, 'rgba(255,206,146,0)');
      ctx.fillStyle = f;
      ctx.fillRect(x - 190, y, 380, World.RIBBON_H);
    }

    /* embers drifting up */
    const n = 12;
    for (let i = 0; i < n; i++) {
      const seed = p.x * 0.01 + i;
      const cycle = (t * (0.16 + U.hash(seed * 2.1) * 0.2) + U.hash(seed)) % 1;
      const ex = x + (U.hash(seed * 3.7) - 0.5) * 300;
      const ey = y - 10 - cycle * 190;
      const a = Math.sin(cycle * Math.PI) * 0.75 * warmth;
      U.circle(ctx, ex + Math.sin(t * 1.3 + i) * 8, ey, 1.8, 'rgba(255,214,158,' + a + ')');
    }
  },

  /* ---------------- ferris wheel ---------------- */

  draw_ferris(ctx, x, y, t, p, dark) {
    const hubY = y - 208;
    const R = 122;
    const glow = 0.35 + p.anim * 0.65;

    /* legs */
    const frame = 'rgba(232,238,248,' + (0.5 + dark * 0.35) + ')';
    U.line(ctx, x - 74, y, x, hubY, frame, 5);
    U.line(ctx, x + 74, y, x, hubY, frame, 5);
    U.line(ctx, x - 44, y - 104, x + 44, y - 104, frame, 3.5);
    U.rr(ctx, x - 40, y - 8, 80, 10, 4, 'rgba(228,234,246,0.55)');

    /* rim */
    ctx.beginPath();
    ctx.arc(x, hubY, R, 0, Math.PI * 2);
    ctx.strokeStyle = frame;
    ctx.lineWidth = 4;
    ctx.stroke();

    /* spokes + cabins */
    const N = 12;
    for (let i = 0; i < N; i++) {
      const a = p.spin + (i / N) * Math.PI * 2;
      const cx = x + Math.cos(a) * R;
      const cy = hubY + Math.sin(a) * R;
      U.line(ctx, x, hubY, cx, cy, 'rgba(232,238,248,0.34)', 2);

      const warm = [255, 198, 132];
      const cool = [180, 210, 240];
      const col = U.mix(cool, warm, 0.4 + 0.6 * Math.sin(i * 1.7));

      if (dark > 0.25) {
        const g = ctx.createRadialGradient(cx, cy + 6, 1, cx, cy + 6, 26);
        g.addColorStop(0, U.rgb(col, 0.5 * dark * glow));
        g.addColorStop(1, U.rgb(col, 0));
        ctx.fillStyle = g;
        ctx.fillRect(cx - 26, cy - 20, 52, 52);
      }
      U.rr(ctx, cx - 7, cy + 1, 14, 12, 4, U.rgb(col, 0.95));
    }

    U.circle(ctx, x, hubY, 9, 'rgba(240,244,252,0.9)');

    /* the boat that swings back and forth */
    const bx = x + 276;
    const pivY = y - 198;
    U.line(ctx, bx - 58, y, bx, pivY, frame, 5);
    U.line(ctx, bx + 58, y, bx, pivY, frame, 5);
    U.line(ctx, bx - 32, y - 106, bx + 32, y - 106, frame, 3);
    U.circle(ctx, bx, pivY, 7, 'rgba(240,244,252,0.9)');

    const ang = Math.sin(t * 0.8) * 0.76;
    const ex = bx + Math.sin(ang) * 128;
    const ey = pivY + Math.cos(ang) * 128;
    U.line(ctx, bx, pivY, ex, ey, 'rgba(226,232,246,0.55)', 4);

    ctx.save();
    ctx.translate(ex, ey);
    ctx.rotate(ang);
    ctx.beginPath();
    ctx.moveTo(-50, -14);
    ctx.quadraticCurveTo(0, 32, 50, -14);
    ctx.quadraticCurveTo(0, 9, -50, -14);
    ctx.closePath();
    ctx.fillStyle = 'rgba(216,104,84,0.96)';
    ctx.fill();
    U.poly(ctx, [[-50, -14], [-64, -36], [-43, -17]], 'rgba(216,104,84,0.96)');
    U.poly(ctx, [[50, -14], [64, -36], [43, -17]], 'rgba(216,104,84,0.96)');
    U.line(ctx, -50, -14, 50, -14, 'rgba(248,224,182,0.9)', 3.4);
    for (let i = 0; i < 6; i++) {
      const rx = -37 + i * 15;
      U.circle(ctx, rx, -21, 5, U.rgb([72, 78, 106], 0.85));
      U.circle(ctx, rx, -30, 3.7, U.rgb([228, 190, 156], 0.9));
    }
    ctx.restore();

    /* flower beds all around it */
    [-330, -196, -52, 132, 248, 396].forEach((off, i) => {
      this.flowers(ctx, x + off, y, t, 17 + i * 5, 7);
    });

    /* the crowd underneath both rides */
    const spots = [
      { off: -182, seed: 71, sc: 0.78 }, { off: -78, seed: 83, sc: 0.86 },
      { off: 96, seed: 97, sc: 0.84 },   { off: 186, seed: 101, sc: 0.78 },
      { off: 358, seed: 113, sc: 0.76 }
    ];
    const cshirts = [[214, 128, 96], [126, 150, 188], [176, 118, 150],
      [138, 166, 128], [206, 176, 104]];
    spots.forEach((sp) => {
      const n = 2 + Math.floor(U.hash(sp.seed * 1.7) * 3);
      for (let i = 0; i < n; i++) {
        this.figure(ctx, x + sp.off + i * 22, y, t, sp.seed + i, dark, {
          shirt: cshirts[Math.floor(U.hash(sp.seed * 2.9 + i) * cshirts.length)],
          scale: sp.sc + U.hash(sp.seed * 4.3 + i) * 0.1,
          face: U.hash(sp.seed * 6.1 + i) > 0.5 ? 1 : -1
        });
      }
    });
  },

  /* ---------------- dussehra ---------------- */

  draw_dussehra(ctx, x, y, t, p, dark) {
    const burn = p.anim;
    const EH = 252;

    /* the fire throws light over the whole ground */
    if (burn > 0.02) {
      const gl = ctx.createRadialGradient(x, y - 90, 20, x, y - 90, 420);
      gl.addColorStop(0, 'rgba(255,164,72,' + (0.4 * burn) + ')');
      gl.addColorStop(0.5, 'rgba(246,120,54,' + (0.16 * burn) + ')');
      gl.addColorStop(1, 'rgba(240,110,50,0)');
      ctx.fillStyle = gl;
      ctx.fillRect(x - 420, y - 510, 840, 840);
    }

    this.ravana(ctx, x, y, t, burn, dark);

    /* flames climbing him */
    if (burn > 0.01) {
      const reach = 40 + burn * EH * 1.02;
      this.flames(ctx, x, y - 6, 96, reach, t, Math.min(1, burn * 1.6));
      for (let i = 0; i < 14; i++) {
        const a = (t * 0.32 + U.hash(i * 5.3)) % 1;
        const sxp = x + (U.hash(i * 2.7) - 0.5) * 150 + Math.sin(t + i) * 16;
        U.circle(ctx, sxp, y - 40 - a * (EH + 130), 11 + a * 20,
          'rgba(78,72,74,' + ((1 - a) * 0.3 * burn) + ')');
      }
      for (let i = 0; i < 22; i++) {
        const a = (t * 0.7 + U.hash(i * 7.9)) % 1;
        const exx = x + (U.hash(i * 3.9) - 0.5) * 120 + Math.sin(t * 2 + i) * 14;
        U.circle(ctx, exx, y - 20 - a * 300, 1.8 * (1 - a),
          'rgba(255,190,110,' + ((1 - a) * 0.85 * burn) + ')');
      }
    }

    /* the ground, packed */
    const rows = [
      { off: -300, seed: 11, sc: 0.74 }, { off: -196, seed: 23, sc: 0.8 },
      { off: -110, seed: 37, sc: 0.86 }, { off: 118, seed: 41, sc: 0.86 },
      { off: 208, seed: 53, sc: 0.8 },   { off: 312, seed: 67, sc: 0.74 }
    ];
    const shirts = [[214, 128, 96], [126, 150, 188], [176, 118, 150],
      [138, 166, 128], [206, 176, 104], [232, 214, 226]];
    rows.forEach((r) => {
      const n = 3 + Math.floor(U.hash(r.seed * 1.9) * 3);
      for (let i = 0; i < n; i++) {
        const ox = x + r.off + i * 23;
        this.figure(ctx, ox, y, t, r.seed + i, dark, {
          shirt: shirts[Math.floor(U.hash(r.seed * 3.3 + i) * shirts.length)],
          scale: r.sc + U.hash(r.seed * 5.1 + i) * 0.1,
          face: ox < x ? 1 : -1
        });
      }
    });

    for (const q of p.parts) {
      const a = U.clamp(q.life / q.max, 0, 1);
      U.circle(ctx, x + q.x, y - 200 + q.y, 2.1 * (0.4 + a), U.rgb(q.col, a * 0.95));
    }
  },

  /* the effigy */
  ravana(ctx, x, y, t, burn, dark) {
    const col = (base, a) => U.rgb(U.mix(base, [34, 28, 26], U.clamp(burn * 1.15, 0, 0.88)), a || 0.96);

    U.rr(ctx, x - 60, y - 11, 120, 11, 3, col([118, 94, 74]));
    U.poly(ctx, [[x - 44, y - 10], [x + 44, y - 10], [x + 33, y - 76], [x - 33, y - 76]],
      col([238, 210, 122]));
    U.rr(ctx, x - 40, y - 152, 80, 80, 8, col([198, 60, 56]));
    U.poly(ctx, [[x - 40, y - 122], [x + 40, y - 134], [x + 40, y - 117], [x - 40, y - 105]],
      col([244, 196, 74]));
    U.rr(ctx, x - 43, y - 80, 86, 13, 4, col([244, 196, 74]));
    for (let i = 0; i < 3; i++) {
      U.circle(ctx, x - 22 + i * 22, y - 112, 6, col([250, 226, 150]));
    }

    /* arms, sword, shield */
    U.line(ctx, x - 34, y - 142, x - 84, y - 178, col([198, 60, 56]), 13);
    U.line(ctx, x + 34, y - 142, x + 84, y - 178, col([198, 60, 56]), 13);
    U.circle(ctx, x - 88, y - 181, 8, col([228, 188, 152]));
    U.circle(ctx, x + 88, y - 181, 8, col([228, 188, 152]));
    U.line(ctx, x + 88, y - 181, x + 103, y - 246, col([216, 222, 234]), 5);
    U.rr(ctx, x + 84, y - 190, 12, 6, 2, col([180, 148, 90]));
    U.circle(ctx, x - 91, y - 184, 21, col([182, 150, 90]));
    U.circle(ctx, x - 91, y - 184, 9, col([236, 208, 130]));

    U.rr(ctx, x - 47, y - 160, 94, 19, 8, col([168, 44, 46]));

    /* ten heads: a row behind, the big one in front */
    const hy = y - 190;
    for (let i = 4; i >= 1; i--) {
      [-1, 1].forEach((sg) => {
        this.ravanaHead(ctx, x + sg * i * 18, hy + i * 4, 11, col, false);
      });
    }
    this.ravanaHead(ctx, x, hy - 18, 20, col, true);
  },

  ravanaHead(ctx, x, y, r, col, main) {
    U.poly(ctx, [
      [x - r, y - r * 0.75], [x + r, y - r * 0.75], [x + r * 0.72, y - r * 1.95],
      [x + r * 0.26, y - r * 1.2], [x, y - r * 2.15],
      [x - r * 0.26, y - r * 1.2], [x - r * 0.72, y - r * 1.95]
    ], col([244, 198, 76]));
    U.circle(ctx, x, y, r, col([230, 190, 146]));
    U.circle(ctx, x - r * 0.36, y - r * 0.12, r * 0.15, 'rgba(28,22,20,0.85)');
    U.circle(ctx, x + r * 0.36, y - r * 0.12, r * 0.15, 'rgba(28,22,20,0.85)');
    if (main) {
      U.line(ctx, x - r * 0.62, y + r * 0.32, x - r * 0.08, y + r * 0.5,
        'rgba(38,28,24,0.85)', r * 0.19);
      U.line(ctx, x + r * 0.62, y + r * 0.32, x + r * 0.08, y + r * 0.5,
        'rgba(38,28,24,0.85)', r * 0.19);
      U.rr(ctx, x - r * 0.3, y + r * 0.58, r * 0.6, r * 0.22, 2, 'rgba(116,38,34,0.85)');
    }
  },

  flames(ctx, x, baseY, w, h, t, intensity) {
    const cols = [[255, 198, 92], [246, 140, 58], [228, 88, 46]];
    ctx.save();
    for (let i = 0; i < 20; i++) {
      const fx = x + (U.hash(i * 3.3) - 0.5) * w;
      const ph = t * 3.4 + i * 1.7;
      const fh = h * (0.45 + 0.55 * Math.abs(Math.sin(ph))) * (0.5 + U.hash(i * 1.4) * 0.6);
      ctx.globalAlpha = intensity * (0.4 + 0.45 * Math.abs(Math.sin(ph * 1.3)));
      U.poly(ctx, [[fx - 10, baseY], [fx + 10, baseY], [fx + Math.sin(ph) * 5, baseY - fh]],
        U.rgb(cols[i % 3], 0.9));
    }
    ctx.restore();
  },

  /* ---------------- the restaurant street ---------------- */

  draw_street(ctx, x, y, t, p, dark) {
    const shops = [
      { w: 96,  h: 178, wall: [62, 58, 82],  sign: [236, 122, 92],  rows: 3 },
      { w: 82,  h: 136, wall: [74, 64, 86],  sign: [242, 190, 96],  rows: 2 },
      { w: 108, h: 206, wall: [54, 52, 76],  sign: [122, 186, 202], rows: 4 },
      { w: 88,  h: 150, wall: [70, 60, 84],  sign: [226, 108, 126], rows: 2 },
      { w: 100, h: 186, wall: [58, 56, 80],  sign: [246, 166, 92],  rows: 3 }
    ];

    let total = 0;
    shops.forEach((s) => (total += s.w + 8));
    let cx = x - total / 2;

    shops.forEach((s, i) => {
      const bx = cx;
      const by = y - s.h;
      cx += s.w + 8;

      /* body */
      U.rr(ctx, bx, by, s.w, s.h, 3, U.rgb(s.wall, 0.97));
      U.rr(ctx, bx - 4, by - 8, s.w + 8, 12, 3, U.rgb(U.mix(s.wall, [0, 0, 0], 0.25), 0.97));

      /* lit windows */
      const cols = Math.max(2, Math.floor(s.w / 34));
      for (let r = 0; r < s.rows; r++) {
        for (let c = 0; c < cols; c++) {
          const lit = U.hash(i * 13.7 + r * 3.1 + c * 7.9) > 0.22;
          const wx = bx + 12 + c * ((s.w - 24) / cols);
          const wy = by + 22 + r * 34;
          const glow = lit ? 0.5 + dark * 0.45 : 0.1;
          U.rr(ctx, wx, wy, (s.w - 24) / cols - 8, 20, 2, 'rgba(255,214,152,' + glow + ')');
        }
      }

      /* shop sign, vertical like a food street */
      const sgx = bx + s.w - 16;
      U.rr(ctx, sgx, by + 30, 13, 62, 3, U.rgb(s.sign, 0.93));
      if (dark > 0.2) {
        const g = ctx.createRadialGradient(sgx + 6, by + 60, 2, sgx + 6, by + 60, 54);
        g.addColorStop(0, U.rgb(s.sign, 0.3 * dark));
        g.addColorStop(1, U.rgb(s.sign, 0));
        ctx.fillStyle = g;
        ctx.fillRect(sgx - 48, by + 6, 108, 108);
      }

      /* ground floor: awning, warm doorway, stools */
      const ay = y - 52;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(bx - 3, ay);
      ctx.lineTo(bx + s.w + 3, ay);
      ctx.lineTo(bx + s.w - 6, ay + 20);
      ctx.lineTo(bx + 6, ay + 20);
      ctx.closePath();
      ctx.clip();
      const stripeA = s.sign;
      const stripeB = [246, 240, 230];
      for (let k = 0; k < 10; k++) {
        ctx.fillStyle = U.rgb(k % 2 ? stripeA : stripeB, 0.95);
        ctx.fillRect(bx - 3 + k * 13, ay - 2, 13, 26);
      }
      ctx.restore();

      /* doorway light spilling onto the path */
      U.rr(ctx, bx + 14, y - 32, s.w - 28, 32, 2, 'rgba(255,206,150,' + (0.45 + dark * 0.4) + ')');
      const spill = ctx.createLinearGradient(0, y, 0, y + World.RIBBON_H);
      spill.addColorStop(0, 'rgba(255,206,150,0.3)');
      spill.addColorStop(1, 'rgba(255,206,150,0)');
      ctx.fillStyle = spill;
      ctx.fillRect(bx + 8, y, s.w - 16, World.RIBBON_H);

      /* hanging lantern */
      if (i % 2 === 0) {
        U.line(ctx, bx + 18, ay, bx + 18, ay + 14, 'rgba(220,226,240,0.45)', 1.3);
        U.circle(ctx, bx + 18, ay + 20, 7, 'rgba(240,120,96,' + (0.55 + dark * 0.4) + ')');
      }
    });

    this.steam(ctx, x - 110, y - 62, t, 1.2);
    this.steam(ctx, x + 40, y - 58, t + 1.5, 1.0);
    this.steam(ctx, x + 150, y - 64, t + 2.7, 0.9);
  },

  /* ---------------- the picnic ---------------- */

  /* one leafy tree */
  tree(ctx, x, y, t, dark, scale) {
    const s = scale || 1;
    const leaf = dark > 0.5 ? [46, 74, 62] : [104, 152, 112];
    U.line(ctx, x, y, x, y - 78 * s, 'rgba(92,72,62,0.85)', 7 * s);
    U.line(ctx, x, y - 52 * s, x - 22 * s, y - 74 * s, 'rgba(92,72,62,0.7)', 4 * s);
    U.line(ctx, x, y - 58 * s, x + 20 * s, y - 78 * s, 'rgba(92,72,62,0.7)', 4 * s);
    U.circle(ctx, x, y - 100 * s, 32 * s, U.rgb(leaf, 0.94));
    U.circle(ctx, x - 28 * s, y - 82 * s, 22 * s, U.rgb(leaf, 0.9));
    U.circle(ctx, x + 28 * s, y - 80 * s, 20 * s, U.rgb(leaf, 0.9));
    U.circle(ctx, x + 6 * s, y - 126 * s, 18 * s, U.rgb(leaf, 0.85));
  },

  /* little flowers, swaying */
  flowers(ctx, x, y, t, seed, n) {
    const cols = [[246, 152, 178], [252, 220, 118], [250, 250, 244],
      [244, 158, 96], [198, 156, 226]];
    for (let i = 0; i < n; i++) {
      const fx = x + (U.hash(seed * 1.7 + i) - 0.5) * 130;
      const h = 12 + U.hash(seed * 3.1 + i) * 17;
      const sway = Math.sin(t * 1.4 + i * 1.3 + seed) * 1.7;
      U.line(ctx, fx, y, fx + sway, y - h, 'rgba(92,146,96,0.9)', 2);
      U.line(ctx, fx, y - h * 0.5, fx + 5, y - h * 0.66, 'rgba(92,146,96,0.8)', 1.8);
      const c = cols[Math.floor(U.hash(seed * 5.3 + i) * cols.length)];
      const px = fx + sway, py = y - h;
      for (let k = 0; k < 5; k++) {
        const a = (k / 5) * Math.PI * 2;
        U.circle(ctx, px + Math.cos(a) * 3.4, py + Math.sin(a) * 3.4, 2.7, U.rgb(c, 0.95));
      }
      U.circle(ctx, px, py, 2.1, 'rgba(252,226,130,0.95)');
    }
  },

  draw_picnic(ctx, x, y, t, p, dark) {
    /* a few trees around us */
    this.tree(ctx, x - 250, y, t, dark, 1.15);
    this.tree(ctx, x - 132, y, t, dark, 0.78);
    this.tree(ctx, x + 132, y, t, dark, 1);
    this.tree(ctx, x + 268, y, t, dark, 0.88);
    this.flowers(ctx, x - 190, y, t, 61, 6);
    this.flowers(ctx, x + 206, y, t, 73, 6);

    /* checked blanket */
    const bw = 150, bh = 26;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - bw / 2, y);
    ctx.lineTo(x + bw / 2, y);
    ctx.lineTo(x + bw / 2 - 10, y - bh);
    ctx.lineTo(x - bw / 2 + 10, y - bh);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = 'rgba(238,226,212,0.96)';
    ctx.fillRect(x - bw / 2, y - bh, bw, bh);
    ctx.fillStyle = 'rgba(206,96,88,0.55)';
    for (let i = 0; i < 8; i++) ctx.fillRect(x - bw / 2 + i * 20, y - bh, 9, bh);
    for (let i = 0; i < 3; i++) ctx.fillRect(x - bw / 2, y - bh + i * 10, bw, 4);
    ctx.restore();

    /* basket */
    U.rr(ctx, x - 52, y - 34, 34, 22, 4, 'rgba(198,154,96,0.97)');
    ctx.beginPath();
    ctx.arc(x - 35, y - 34, 14, Math.PI, 0);
    ctx.strokeStyle = 'rgba(198,154,96,0.95)';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    U.rr(ctx, x - 54, y - 38, 38, 6, 3, 'rgba(176,132,80,0.97)');

    /* two cups and a small cake */
    U.rr(ctx, x + 6, y - 20, 12, 13, 3, 'rgba(250,246,238,0.97)');
    U.rr(ctx, x + 24, y - 20, 12, 13, 3, 'rgba(250,246,238,0.97)');
    U.rr(ctx, x + 46, y - 22, 26, 15, 4, 'rgba(246,222,196,0.97)');
    U.rr(ctx, x + 46, y - 26, 26, 6, 3, 'rgba(238,150,160,0.97)');
    U.circle(ctx, x + 59, y - 30, 3, 'rgba(226,88,96,0.95)');

    this.squirrel(ctx, x, y, t, p.sq, dark);
  },

  squirrel(ctx, x, y, t, s, dark) {
    const sx = x + s.x;
    const sy = y - 10 - s.hop;
    const f = s.dir;
    const fur = dark > 0.5 ? [124, 96, 78] : [166, 122, 88];
    const furL = U.mix(fur, [255, 240, 220], 0.28);
    const idle = s.pause > 0;
    const tw = idle ? Math.sin(s.twitch * 7) * 0.22 : 0;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.scale(f, 1);

    /* tail: big curl behind */
    ctx.beginPath();
    ctx.moveTo(-6, 2);
    ctx.quadraticCurveTo(-26 - tw * 8, -2, -22, -18);
    ctx.quadraticCurveTo(-19, -30, -7, -28);
    ctx.strokeStyle = U.rgb(fur, 0.95);
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.stroke();

    /* body */
    ctx.beginPath();
    ctx.ellipse(0, -4, 10, 8, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = U.rgb(fur, 0.97);
    ctx.fill();

    /* haunch */
    U.circle(ctx, -3, -2, 6, U.rgb(furL, 0.9));

    /* head */
    const hy = idle ? -16 : -13;
    U.circle(ctx, 7, hy, 6.2, U.rgb(fur, 0.97));
    /* ear */
    U.poly(ctx, [[5, hy - 5], [8, hy - 12], [10, hy - 5]], U.rgb(fur, 0.97));
    /* muzzle + eye */
    U.circle(ctx, 11.5, hy + 1.5, 3, U.rgb(furL, 0.95));
    U.circle(ctx, 9.5, hy - 1, 1.5, 'rgba(24,20,18,0.9)');

    /* legs */
    U.line(ctx, 2, 3, 4, 7, U.rgb(fur, 0.95), 3);
    U.line(ctx, -5, 3, -7, 7, U.rgb(fur, 0.95), 3);

    ctx.restore();
  },

  /* ---------------- momo stall + prayer flags ---------------- */

  draw_momo(ctx, x, y, t, p, dark) {
    /* prayer flags strung above the path */
    const cols = [[226, 92, 88], [242, 194, 96], [122, 174, 122], [104, 150, 214], [246, 246, 240]];
    const x1 = x - 190, x2 = x + 190, sag = 46;
    ctx.beginPath();
    ctx.moveTo(x1, y - 150);
    ctx.quadraticCurveTo(x, y - 150 + sag, x2, y - 150);
    ctx.strokeStyle = 'rgba(226,232,246,0.5)';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    for (let i = 0; i <= 14; i++) {
      const s = i / 14;
      const fx = U.lerp(x1, x2, s);
      const fy = y - 150 + Math.sin(Math.PI * s) * sag;
      const flut = Math.sin(t * 2.2 + i * 0.7) * 3;
      const c = cols[i % cols.length];
      U.poly(ctx, [
        [fx, fy],
        [fx + 13, fy + 2 + flut * 0.3],
        [fx + 5, fy + 21 + flut]
      ], U.rgb(c, 0.88));
    }

    this.stall(ctx, x, y, t, dark, [198, 126, 96], [244, 214, 178]);

    /* stacked bamboo steamers */
    for (let i = 0; i < 3; i++) {
      const sy = y - 60 - i * 9;
      U.rr(ctx, x - 20, sy, 40, 9, 4, U.rgb([222, 196, 150], 0.96));
      U.line(ctx, x - 18, sy + 4.5, x + 18, sy + 4.5, 'rgba(160,132,98,0.5)', 1);
    }
    this.steam(ctx, x - 6, y - 92, t, 1.3);
    this.steam(ctx, x + 10, y - 92, t + 0.9, 1.1);
    this.steam(ctx, x - 18, y - 92, t + 1.9, 0.9);
  },

  /* shared stall frame */
  stall(ctx, x, y, t, dark, awnA, awnB) {
    /* warm lantern glow */
    if (dark > 0.15) {
      const g = ctx.createRadialGradient(x, y - 70, 8, x, y - 70, 150);
      g.addColorStop(0, 'rgba(255,206,146,' + (0.3 * dark) + ')');
      g.addColorStop(1, 'rgba(255,206,146,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 150, y - 220, 300, 300);
    }

    /* posts */
    U.line(ctx, x - 44, y, x - 44, y - 112, 'rgba(206,214,232,0.7)', 4);
    U.line(ctx, x + 44, y, x + 44, y - 112, 'rgba(206,214,232,0.7)', 4);

    /* counter */
    U.rr(ctx, x - 50, y - 54, 100, 12, 4, 'rgba(228,232,244,0.9)');
    U.rr(ctx, x - 44, y - 42, 88, 42, 3, U.rgb([58, 64, 92], 0.9));

    /* striped awning */
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x - 62, y - 112);
    ctx.lineTo(x + 62, y - 112);
    ctx.lineTo(x + 50, y - 84);
    ctx.lineTo(x - 50, y - 84);
    ctx.closePath();
    ctx.clip();
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = U.rgb(i % 2 ? awnA : awnB, 0.95);
      ctx.fillRect(x - 62 + i * 14, y - 114, 14, 34);
    }
    ctx.restore();

    /* hanging bulb */
    U.line(ctx, x, y - 112, x, y - 96, 'rgba(220,226,240,0.5)', 1.4);
    U.circle(ctx, x, y - 93, 4.5, 'rgba(255,224,168,' + (0.55 + dark * 0.45) + ')');
  },

  steam(ctx, x, y, t, scale) {
    ctx.save();
    ctx.strokeStyle = 'rgba(244,248,255,0.4)';
    ctx.lineWidth = 2.4;
    ctx.lineCap = 'round';
    for (let k = 0; k < 2; k++) {
      ctx.beginPath();
      for (let i = 0; i <= 10; i++) {
        const s = i / 10;
        const py = y - s * 46 * scale;
        const px = x + Math.sin(t * 1.9 + s * 3.4 + k * 2.1) * 7 * s;
        if (i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
      }
      ctx.globalAlpha = 0.5 - k * 0.2;
      ctx.stroke();
    }
    ctx.restore();
  },

  /* ---------------- train station ---------------- */

  draw_train(ctx, x, y, t, p, dark) {
    /* roof on pillars */
    U.line(ctx, x - 120, y, x - 120, y - 132, 'rgba(206,214,232,0.7)', 5);
    U.line(ctx, x + 120, y, x + 120, y - 132, 'rgba(206,214,232,0.7)', 5);
    U.rr(ctx, x - 150, y - 146, 300, 16, 5, 'rgba(216,222,238,0.85)');

    /* sign */
    U.rr(ctx, x - 44, y - 122, 88, 24, 5, U.rgb([46, 58, 96], 0.95));
    ctx.fillStyle = 'rgba(232,240,255,0.8)';
    ctx.font = '600 13px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('•  •  •', x, y - 105);
    ctx.textAlign = 'left';

    /* the metro roundel on a post */
    const gx = x - 196, gcy = y - 128, R = 21;
    U.line(ctx, gx, y, gx, gcy + R, 'rgba(198,204,222,0.85)', 4);
    ctx.save();
    ctx.beginPath();
    ctx.arc(gx, gcy, R, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = 'rgba(234,120,38,0.97)';
    ctx.fillRect(gx - R, gcy - R, R * 2, R - 4.5);
    ctx.fillRect(gx - R, gcy + 4.5, R * 2, R - 4.5);
    ctx.restore();
    ctx.beginPath();
    ctx.arc(gx, gcy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(244,246,252,0.35)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    /* bench */
    U.rr(ctx, x + 56, y - 34, 52, 7, 3, 'rgba(222,228,242,0.8)');
    U.line(ctx, x + 64, y - 27, x + 64, y, 'rgba(222,228,242,0.6)', 3);
    U.line(ctx, x + 100, y - 27, x + 100, y, 'rgba(222,228,242,0.6)', 3);

    /* platform edge */
    for (let i = -7; i < 8; i++) {
      U.rr(ctx, x + i * 22 - 6, y + 8, 12, 5, 2, 'rgba(255,214,150,0.5)');
    }

    /* the metro slides in once you stop to look */
    const e = U.easeOut(p.anim);
    const tx = x + 520 - e * 520;
    if (p.anim > 0.001) {
      /* silver body with a rounded nose */
      U.rr(ctx, tx - 84, y - 96, 420, 88, 20, U.rgb([206, 213, 224], 0.98));
      U.rr(ctx, tx - 84, y - 96, 420, 9, 5, U.rgb([246, 249, 254], 0.85));
      /* the blue band down the side */
      U.rr(ctx, tx - 84, y - 44, 420, 11, 3, U.rgb([36, 96, 176], 0.95));
      U.rr(ctx, tx - 84, y - 31, 420, 4, 2, U.rgb([214, 74, 66], 0.8));

      /* doors and windows */
      for (let i = 0; i < 4; i++) {
        const dx = tx - 56 + i * 104;
        U.rr(ctx, dx, y - 84, 46, 62, 4, U.rgb([150, 166, 190], 0.5));
        U.line(ctx, dx + 23, y - 84, dx + 23, y - 22, 'rgba(120,138,166,0.6)', 1.6);
        U.rr(ctx, dx + 54, y - 80, 42, 30, 5, U.rgb([176, 212, 246], 0.55 + dark * 0.4));
      }
      /* cab window at the front */
      U.rr(ctx, tx + 284, y - 82, 44, 32, 7, U.rgb([176, 212, 246], 0.6 + dark * 0.35));
      U.circle(ctx, tx + 328, y - 34, 5, 'rgba(255,240,200,0.9)');
      U.rr(ctx, tx - 84, y - 12, 420, 7, 3, 'rgba(28,32,52,0.55)');
    }
  },

  /* ---------------- the flight ---------------- */

  draw_flight(ctx, x, y, t, p, dark) {
    /* gate structure */
    U.rr(ctx, x - 130, y - 128, 260, 14, 5, 'rgba(216,222,238,0.8)');
    U.line(ctx, x - 118, y, x - 118, y - 114, 'rgba(206,214,232,0.6)', 4);
    U.line(ctx, x + 118, y, x + 118, y - 114, 'rgba(206,214,232,0.6)', 4);
    U.rr(ctx, x - 52, y - 106, 104, 26, 5, U.rgb([46, 58, 96], 0.92));
    ctx.fillStyle = 'rgba(255,214,150,0.85)';
    ctx.font = '600 12px Quicksand, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('DEPARTURES', x, y - 88);
    ctx.textAlign = 'left';

    /* the plane waits at the gate until you board it */
    if (!p.done) {
      ctx.save();
      ctx.translate(x + 46, y - 34);
      ctx.scale(0.82, 0.82);
      Cutscene.plane(ctx);
      ctx.restore();
    }
  },

  /* ---------------- apart: the video call ---------------- */

  draw_call(ctx, x, y, t, p, dark) {
    const hy = World.herY(p.x) + World.RIBBON_H;
    const jy = World.hisY(p.x);
    const pulse = 0.55 + 0.45 * Math.sin(t * 2.2);
    const live = 0.4 + p.anim * 0.6;

    /* the line between us */
    ctx.save();
    ctx.setLineDash([9, 11]);
    ctx.lineDashOffset = -t * 34;
    U.line(ctx, x, hy + 62, x, jy - 62, 'rgba(180,222,255,' + (0.35 * live + 0.2 * pulse) + ')', 2);
    ctx.restore();

    /* packets travelling both ways */
    for (let i = 0; i < 6; i++) {
      const up = i % 2 === 0;
      let s = ((t * 0.34 + i * 0.17) % 1);
      if (up) s = 1 - s;
      const py = U.lerp(hy + 62, jy - 62, s);
      const c = up ? [255, 186, 170] : [174, 214, 250];
      U.circle(ctx, x, py, 3.1, U.rgb(c, 0.75 * live));
    }

    this.phone(ctx, x, hy + 34, t, [226, 124, 118], live, dark);
    this.phone(ctx, x, jy - 34, t, [86, 126, 168], live, dark);
  },

  /* a phone held up, with the other person on the screen */
  phone(ctx, x, y, t, who, live, dark) {
    const w = 46, h = 74;
    U.rr(ctx, x - w / 2 - 3, y - h / 2 - 3, w + 6, h + 6, 10, 'rgba(32,36,52,0.95)');
    U.rr(ctx, x - w / 2, y - h / 2, w, h, 7, 'rgba(206,232,250,' + (0.55 + live * 0.35) + ')');

    /* the face on the screen */
    U.circle(ctx, x, y - 10, 9, U.rgb(who, 0.95));
    ctx.beginPath();
    ctx.arc(x, y + 20, 17, Math.PI, 0);
    ctx.fillStyle = U.rgb(who, 0.9);
    ctx.fill();

    /* screen light */
    const g = ctx.createRadialGradient(x, y, 4, x, y, 86);
    g.addColorStop(0, 'rgba(190,226,255,' + (0.2 * live) + ')');
    g.addColorStop(1, 'rgba(190,226,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 86, y - 86, 172, 172);

    /* signal ticks */
    for (let i = 0; i < 3; i++) {
      const a = 0.25 + 0.55 * Math.max(0, Math.sin(t * 3 - i * 0.6));
      U.rr(ctx, x + w / 2 + 8, y - 10 + i * 7, 4, 5, 1, 'rgba(180,226,255,' + (a * live) + ')');
    }
  },

  /* ---------------- apart: watching something together ---------------- */

  draw_anime(ctx, x, y, t, p, dark) {
    const hy = World.herY(p.x) + World.RIBBON_H;
    const jy = World.hisY(p.x);
    const live = 0.45 + p.anim * 0.55;
    const w = 226, h = 132;

    /* light spilling onto both paths */
    [[hy, -1], [jy, 1]].forEach((L) => {
      const dir = L[1];
      const g = ctx.createLinearGradient(0, y, 0, L[0]);
      g.addColorStop(0, 'rgba(178,214,255,' + (0.22 * live) + ')');
      g.addColorStop(1, 'rgba(178,214,255,0)');
      ctx.fillStyle = g;
      U.poly(ctx, [
        [x - w / 2, y],
        [x + w / 2, y],
        [x + w / 2 + 70 * dir * 0.4 + 40, L[0]],
        [x - w / 2 - 70 * dir * 0.4 - 40, L[0]]
      ], g);
    });

    /* the screen */
    U.rr(ctx, x - w / 2 - 6, y - h / 2 - 6, w + 12, h + 12, 12, 'rgba(26,30,46,0.96)');

    ctx.save();
    U.rr(ctx, x - w / 2, y - h / 2, w, h, 7);
    ctx.clip();
    const sky = ctx.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    sky.addColorStop(0, 'rgba(96,142,206,0.95)');
    sky.addColorStop(0.62, 'rgba(238,186,166,0.95)');
    sky.addColorStop(1, 'rgba(250,214,170,0.95)');
    ctx.fillStyle = sky;
    ctx.fillRect(x - w / 2, y - h / 2, w, h);

    /* a little scene playing */
    U.circle(ctx, x + 52, y - 22, 15, 'rgba(255,238,198,0.95)');
    U.poly(ctx, [
      [x - w / 2, y + h / 2], [x - 40, y + 4], [x + 4, y + h / 2]
    ], 'rgba(58,72,96,0.9)');
    U.poly(ctx, [
      [x - 16, y + h / 2], [x + 34, y - 10], [x + w / 2, y + h / 2]
    ], 'rgba(40,52,74,0.92)');
    const bob = Math.sin(t * 1.5) * 1.5;
    U.circle(ctx, x - 12, y + 26 + bob, 5, 'rgba(28,34,50,0.95)');
    U.rr(ctx, x - 16, y + 32 + bob, 9, 16, 4, 'rgba(28,34,50,0.95)');

    /* subtitles */
    U.rr(ctx, x - 62, y + h / 2 - 20, 124, 8, 4, 'rgba(250,250,245,0.7)');
    U.rr(ctx, x - 38, y + h / 2 - 34, 76, 7, 3, 'rgba(250,250,245,0.5)');
    ctx.restore();

    /* both pressing play at the same time */
    const sync = 0.5 + 0.5 * Math.sin(t * 2.6);
    U.circle(ctx, x - 12, y + h / 2 + 22, 4, 'rgba(255,198,132,' + (0.4 + sync * 0.55) + ')');
    U.circle(ctx, x + 12, y + h / 2 + 22, 4, 'rgba(255,198,132,' + (0.4 + sync * 0.55) + ')');
    U.line(ctx, x - 8, y + h / 2 + 22, x + 8, y + h / 2 + 22,
      'rgba(255,198,132,' + (0.25 + sync * 0.3) + ')', 1.4);
  },

  /* ---------------- apart: a birthday over a screen ---------------- */

  draw_bday(ctx, x, y, t, p, dark) {
    const hy = World.herY(p.x) + World.RIBBON_H;
    const jy = World.hisY(p.x);
    const live = 0.4 + p.anim * 0.6;

    /* bunting strung across the gap */
    const cols = [[246, 168, 92], [232, 110, 126], [122, 186, 202], [242, 206, 110]];
    [hy + 26, jy - 26].forEach((by, row) => {
      const x1 = x - 180, x2 = x + 180, sag = 26;
      ctx.beginPath();
      ctx.moveTo(x1, by);
      ctx.quadraticCurveTo(x, by + sag * (row ? -1 : 1), x2, by);
      ctx.strokeStyle = 'rgba(226,232,246,0.45)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      for (let i = 0; i <= 11; i++) {
        const s = i / 11;
        const fx = U.lerp(x1, x2, s);
        const fy = by + Math.sin(Math.PI * s) * sag * (row ? -1 : 1);
        const c = cols[i % cols.length];
        const d = row ? -1 : 1;
        U.poly(ctx, [[fx - 7, fy], [fx + 7, fy], [fx, fy + 16 * d]], U.rgb(c, 0.9));
      }
    });

    /* balloons drifting up the gap */
    for (let i = 0; i < 7; i++) {
      const c = cols[i % cols.length];
      let s = (t * 0.1 + U.hash(i * 4.4)) % 1;
      const bx = x + (U.hash(i * 7.7) - 0.5) * 300;
      const by = U.lerp(jy - 40, hy + 40, s) + Math.sin(t + i) * 5;
      U.circle(ctx, bx, by, 11, U.rgb(c, 0.6 * live));
      U.line(ctx, bx, by + 11, bx + Math.sin(t * 1.4 + i) * 4, by + 30, U.rgb(c, 0.3 * live), 1.2);
    }

    /* the cake, floating in the middle of the distance */
    const cy = y + Math.sin(t * 1.1) * 4;
    U.rr(ctx, x - 44, cy - 6, 88, 34, 6, 'rgba(246,222,196,0.97)');
    U.rr(ctx, x - 44, cy - 14, 88, 12, 5, 'rgba(238,150,160,0.97)');
    U.rr(ctx, x - 50, cy + 26, 100, 8, 4, 'rgba(226,232,246,0.85)');
    for (let i = 0; i < 3; i++) {
      const cx2 = x - 22 + i * 22;
      U.rr(ctx, cx2 - 2, cy - 34, 4, 22, 2, 'rgba(250,246,238,0.95)');
      const fl = 0.7 + 0.3 * Math.sin(t * 9 + i * 2);
      U.circle(ctx, cx2, cy - 38, 4 * fl, 'rgba(255,196,110,0.95)');
      U.circle(ctx, cx2, cy - 40, 2.4 * fl, 'rgba(255,240,190,0.95)');
      const g = ctx.createRadialGradient(cx2, cy - 38, 1, cx2, cy - 38, 46);
      g.addColorStop(0, 'rgba(255,198,120,' + (0.28 * fl) + ')');
      g.addColorStop(1, 'rgba(255,198,120,0)');
      ctx.fillStyle = g;
      ctx.fillRect(cx2 - 46, cy - 84, 92, 92);
    }

    /* confetti */
    for (const q of p.conf) {
      ctx.save();
      ctx.translate(x + q.x, y + q.y);
      ctx.rotate(q.r);
      ctx.fillStyle = U.rgb(q.col, U.clamp(q.life / 2.4, 0, 1) * 0.95);
      ctx.fillRect(-3, -5, 6, 10);
      ctx.restore();
    }
  },

  /* ---------------- the meeting: bus ---------------- */

  draw_bus(ctx, x, y, t, p, dark) {
    /* the stop itself stays behind */
    U.line(ctx, x + 158, y, x + 158, y - 86, 'rgba(198,206,226,0.7)', 4);
    U.rr(ctx, x + 138, y - 104, 46, 22, 4, U.rgb([62, 96, 140], 0.95));
    U.rr(ctx, x + 146, y - 96, 30, 5, 2, 'rgba(236,242,252,0.7)');
    if (p.done) return;

    const sway = Math.sin(t * 1.6) * 1.2;
    const bx = x - 130, by = y - 104 + sway;

    U.rr(ctx, bx, by, 260, 96, 12, 'rgba(228,180,92,0.97)');
    U.rr(ctx, bx, by + 58, 260, 12, 4, 'rgba(196,142,68,0.9)');
    U.rr(ctx, bx + 6, by - 10, 248, 14, 6, 'rgba(210,160,78,0.95)');

    /* windows, with people in them */
    for (let i = 0; i < 5; i++) {
      const wx = bx + 16 + i * 48;
      U.rr(ctx, wx, by + 14, 38, 34, 5, 'rgba(178,214,238,0.85)');
      if (i !== 2) {
        U.circle(ctx, wx + 19, by + 34, 8, 'rgba(70,74,102,0.55)');
        U.circle(ctx, wx + 19, by + 22, 5.5, 'rgba(84,88,116,0.6)');
      }
    }

    /* destination board */
    U.rr(ctx, bx + 178, by - 4, 70, 12, 3, 'rgba(48,56,84,0.9)');

    /* wheels */
    U.circle(ctx, bx + 54, y - 4, 17, 'rgba(38,42,58,0.95)');
    U.circle(ctx, bx + 54, y - 4, 7, 'rgba(126,132,152,0.9)');
    U.circle(ctx, bx + 206, y - 4, 17, 'rgba(38,42,58,0.95)');
    U.circle(ctx, bx + 206, y - 4, 7, 'rgba(126,132,152,0.9)');

    /* roof luggage, because of course */
    U.rr(ctx, bx + 40, by - 26, 54, 18, 4, 'rgba(180,126,92,0.95)');
    U.rr(ctx, bx + 104, by - 22, 40, 14, 4, 'rgba(146,158,120,0.95)');
  },

  /* ---------------- the meeting: the rented scooty ---------------- */

  draw_scooty(ctx, x, y, t, p, dark) {
    /* the shack that rented it to us */
    U.rr(ctx, x - 150, y - 96, 104, 96, 4, U.rgb([206, 190, 166], 0.95));
    U.poly(ctx, [[x - 160, y - 96], [x - 36, y - 96], [x - 46, y - 118], [x - 150, y - 118]],
      U.rgb([148, 104, 78], 0.95));
    U.rr(ctx, x - 136, y - 78, 42, 30, 3, 'rgba(255,212,150,' + (0.4 + dark * 0.45) + ')');
    U.rr(ctx, x - 142, y - 112, 76, 14, 3, U.rgb([214, 108, 82], 0.95));
    U.rr(ctx, x - 134, y - 108, 60, 5, 2, 'rgba(250,244,232,0.7)');

    /* a couple of spare ones leaning */
    ctx.save();
    ctx.translate(x - 22, y);
    ctx.scale(0.72, 0.72);
    ctx.rotate(0.06);
    Cutscene.scooty(ctx, t, null);
    ctx.restore();

    if (p.done) return;
    ctx.save();
    ctx.translate(x + 74, y);
    ctx.scale(0.9, 0.9);
    Cutscene.scooty(ctx, t, null);
    ctx.restore();
  },

  /* ---------------- the meeting: the viewpoint ---------------- */

  draw_view(ctx, x, y, t, p, dark) {
    /* railing at the edge */
    U.line(ctx, x - 150, y, x - 150, y - 46, 'rgba(198,182,160,0.8)', 4);
    U.line(ctx, x + 150, y, x + 150, y - 46, 'rgba(198,182,160,0.8)', 4);
    U.line(ctx, x - 20, y, x - 20, y - 46, 'rgba(198,182,160,0.6)', 3);
    U.line(ctx, x + 60, y, x + 60, y - 46, 'rgba(198,182,160,0.6)', 3);
    U.line(ctx, x - 152, y - 44, x + 152, y - 44, 'rgba(206,190,168,0.85)', 4);
    U.line(ctx, x - 152, y - 26, x + 152, y - 26, 'rgba(206,190,168,0.6)', 3);

    /* viewfinder on a post */
    U.line(ctx, x + 108, y, x + 108, y - 58, 'rgba(120,128,146,0.85)', 5);
    ctx.save();
    ctx.translate(x + 108, y - 62);
    ctx.rotate(-0.24 + Math.sin(t * 0.7) * 0.06);
    U.rr(ctx, -10, -9, 44, 18, 8, 'rgba(96,104,126,0.95)');
    U.circle(ctx, 36, 0, 8, 'rgba(150,196,226,0.9)');
    ctx.restore();

    /* prayer-flag line, because the hills have them too */
    const x1 = x - 150, x2 = x + 60, sag = 30;
    const cols = [[226, 92, 88], [242, 194, 96], [122, 174, 122], [104, 150, 214], [246, 246, 240]];
    ctx.beginPath();
    ctx.moveTo(x1, y - 46);
    ctx.quadraticCurveTo((x1 + x2) / 2, y - 46 + sag, x2, y - 46);
    ctx.strokeStyle = 'rgba(226,232,246,0.4)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    for (let i = 0; i <= 9; i++) {
      const s = i / 9;
      const fx = U.lerp(x1, x2, s);
      const fy = y - 46 + Math.sin(Math.PI * s) * sag;
      const flut = Math.sin(t * 2.4 + i * 0.8) * 2.5;
      U.poly(ctx, [[fx, fy], [fx + 11, fy + 2], [fx + 4, fy + 17 + flut]],
        U.rgb(cols[i % cols.length], 0.85));
    }
  },

  /* ---------------- the meeting: coffee ---------------- */

  draw_coffee(ctx, x, y, t, p, dark) {
    /* a roadside chai shack */
    const g = ctx.createRadialGradient(x, y - 70, 10, x, y - 70, 210);
    g.addColorStop(0, 'rgba(255,190,120,0.26)');
    g.addColorStop(1, 'rgba(255,190,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 210, y - 280, 420, 420);

    /* corrugated tin roof on poles */
    U.line(ctx, x - 96, y, x - 96, y - 104, 'rgba(126,104,84,0.9)', 5);
    U.line(ctx, x + 96, y, x + 96, y - 104, 'rgba(126,104,84,0.9)', 5);
    U.poly(ctx, [[x - 118, y - 104], [x + 118, y - 104], [x + 104, y - 128], [x - 104, y - 128]],
      U.rgb([148, 120, 96], 0.96));
    for (let i = 0; i < 10; i++) {
      U.line(ctx, x - 112 + i * 23, y - 106, x - 104 + i * 23, y - 126,
        'rgba(96,78,62,0.4)', 1.6);
    }

    /* back wall, warmly lit */
    U.rr(ctx, x - 92, y - 100, 184, 100, 3, U.rgb([92, 74, 60], 0.94));
    U.rr(ctx, x - 62, y - 86, 56, 34, 3, 'rgba(255,206,142,' + (0.5 + dark * 0.42) + ')');

    /* counter */
    U.rr(ctx, x - 100, y - 52, 200, 13, 3, U.rgb([176, 138, 100], 0.97));
    U.rr(ctx, x - 92, y - 39, 184, 39, 2, U.rgb([120, 94, 72], 0.95));

    /* the big kettle on a flame */
    U.rr(ctx, x - 74, y - 64, 40, 13, 3, U.rgb([86, 88, 96], 0.96));
    U.circle(ctx, x - 54, y - 78, 17, U.rgb([164, 168, 178], 0.97));
    U.rr(ctx, x - 60, y - 98, 13, 8, 3, U.rgb([164, 168, 178], 0.97));
    ctx.beginPath();
    ctx.arc(x - 36, y - 80, 9, Math.PI * 1.4, Math.PI * 0.45);
    ctx.strokeStyle = U.rgb([164, 168, 178], 0.95);
    ctx.lineWidth = 3.5;
    ctx.stroke();
    for (let i = 0; i < 4; i++) {
      const fl = 0.6 + 0.4 * Math.sin(t * 8 + i * 1.7);
      U.poly(ctx, [[x - 68 + i * 9, y - 51], [x - 62 + i * 9, y - 51],
        [x - 65 + i * 9, y - 51 - 11 * fl]], 'rgba(248,150,60,0.9)');
    }
    this.steam(ctx, x - 54, y - 96, t, 1.1);

    /* glasses of chai lined up */
    for (let i = 0; i < 4; i++) {
      const cx2 = x + 2 + i * 19;
      U.poly(ctx, [[cx2 - 6, y - 52], [cx2 + 6, y - 52], [cx2 + 4, y - 70], [cx2 - 4, y - 70]],
        'rgba(236,240,246,0.9)');
      U.poly(ctx, [[cx2 - 5, y - 55], [cx2 + 5, y - 55], [cx2 + 4, y - 66], [cx2 - 4, y - 66]],
        U.rgb([196, 140, 82], 0.95));
    }
    this.steam(ctx, x + 22, y - 72, t + 0.8, 0.5);

    /* maggi, obviously */
    U.rr(ctx, x + 74, y - 62, 30, 11, 4, 'rgba(244,238,226,0.97)');
    U.rr(ctx, x + 76, y - 65, 26, 5, 2, U.rgb([232, 186, 78], 0.97));
    this.steam(ctx, x + 89, y - 68, t + 1.9, 0.45);
    U.rr(ctx, x + 60, y - 96, 22, 28, 2, U.rgb([224, 168, 56], 0.95));
    U.rr(ctx, x + 63, y - 90, 16, 5, 1, U.rgb([196, 64, 52], 0.95));

    /* a bench to sit on */
    U.rr(ctx, x + 122, y - 30, 64, 7, 3, U.rgb([158, 124, 92], 0.95));
    U.line(ctx, x + 132, y - 23, x + 132, y, U.rgb([158, 124, 92], 0.9), 4);
    U.line(ctx, x + 176, y - 23, x + 176, y, U.rgb([158, 124, 92], 0.9), 4);
  },

  /* ---------------- the city we kept describing to each other ---------------- */

  draw_dream(ctx, x, y, t, p, dark) {
    const hy = World.herY(p.x);
    const jy = World.hisY(p.x) + World.RIBBON_H;
    const live = 0.45 + p.anim * 0.55;
    const bob = Math.sin(t * 0.9) * 5;

    [[jy, 1], [hy, -1]].forEach((L) => {
      for (let i = 0; i < 4; i++) {
        const s2 = (i + 1) / 5;
        const py = U.lerp(L[0], y + bob, s2 * 0.8);
        U.circle(ctx, x + Math.sin(t + i) * 5, py, 3 + i * 1.6,
          'rgba(228,238,255,' + (0.3 * live) + ')');
      }
    });

    const w = 200, cy = y + bob;
    ctx.save();
    ctx.globalAlpha = live;
    U.circle(ctx, x - 58, cy + 10, 42, 'rgba(232,240,255,0.95)');
    U.circle(ctx, x + 58, cy + 10, 42, 'rgba(232,240,255,0.95)');
    U.circle(ctx, x - 16, cy - 20, 46, 'rgba(232,240,255,0.95)');
    U.circle(ctx, x + 34, cy - 14, 40, 'rgba(232,240,255,0.95)');
    U.rr(ctx, x - w / 2 + 10, cy - 18, w - 20, 80, 18, 'rgba(232,240,255,0.95)');

    const heights = [26, 44, 34, 58, 40, 70, 36, 48, 28];
    heights.forEach((bh, i) => {
      const bx = x - 78 + i * 18;
      U.rr(ctx, bx, cy + 26 - bh, 14, bh, 1, 'rgba(96,116,156,0.9)');
      for (let r = 0; r < Math.floor(bh / 12); r++) {
        if (U.hash(i * 3.1 + r) > 0.45) {
          U.rr(ctx, bx + 3, cy + 20 - bh + r * 12, 3, 4, 0.5, 'rgba(255,212,140,0.9)');
        }
      }
    });
    U.line(ctx, x - 82, cy + 26, x + 82, cy + 26, 'rgba(96,116,156,0.9)', 2);
    ctx.restore();
  },

  /* ---------------- walking into the years ---------------- */

  draw_haze(ctx, x, y, t, p, dark) {
    U.line(ctx, x - 60, y, x - 60, y - 62, 'rgba(206,212,226,0.8)', 4);
    U.rr(ctx, x - 92, y - 78, 64, 20, 4, U.rgb([70, 82, 116], 0.94));
    U.rr(ctx, x - 84, y - 71, 48, 5, 2, 'rgba(236,242,252,0.7)');

    ctx.save();
    for (let i = 0; i < 18; i++) {
      const sp = 14 + U.hash(i * 2.3) * 26;
      const fx = (U.hash(i * 5.7) * 620 + t * sp) % 620;
      const fy = y - 10 - U.hash(i * 3.9) * 190;
      const sc = 0.7 + U.hash(i * 7.1) * 1.5;
      ctx.globalAlpha = 0.16 + U.hash(i * 4.4) * 0.22;
      U.circle(ctx, x - 40 + fx, fy, 40 * sc, 'rgba(226,232,244,0.95)');
      U.circle(ctx, x - 40 + fx + 34 * sc, fy + 12 * sc, 30 * sc, 'rgba(226,232,244,0.95)');
    }
    ctx.restore();
  },

  /* ---------------- new york ---------------- */

  draw_liberty(ctx, x, y, t, p, dark) {
    const green = [116, 172, 152];
    const shade = [88, 140, 124];

    for (let i = 0; i < 4; i++) {
      const wy = y + 6 + i * 7;
      ctx.beginPath();
      ctx.moveTo(x - 220, wy);
      for (let k = 0; k <= 12; k++) {
        ctx.lineTo(x - 220 + k * 37, wy + Math.sin(t * 1.2 + k * 0.8 + i) * 2.4);
      }
      ctx.strokeStyle = 'rgba(70,96,128,' + (0.5 - i * 0.1) + ')';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    U.rr(ctx, x - 52, y - 86, 104, 86, 3, U.rgb([98, 104, 124], 0.96));
    U.rr(ctx, x - 60, y - 96, 120, 14, 3, U.rgb([86, 92, 112], 0.96));
    U.rr(ctx, x - 40, y - 150, 80, 56, 3, U.rgb([110, 116, 136], 0.96));
    for (let i = 0; i < 4; i++) {
      U.rr(ctx, x - 32 + i * 19, y - 142, 8, 40, 1, U.rgb([84, 90, 110], 0.9));
    }

    U.poly(ctx, [[x - 30, y - 150], [x + 30, y - 150], [x + 20, y - 246], [x - 16, y - 246]],
      U.rgb(green, 0.97));
    U.poly(ctx, [[x - 30, y - 150], [x - 6, y - 150], [x - 10, y - 246], [x - 16, y - 246]],
      U.rgb(shade, 0.9));

    U.line(ctx, x - 12, y - 236, x - 30, y - 206, U.rgb(green, 0.96), 9);
    ctx.save();
    ctx.translate(x - 34, y - 200);
    ctx.rotate(-0.34);
    U.rr(ctx, -11, -15, 22, 30, 2, U.rgb([134, 186, 166], 0.97));
    ctx.restore();

    U.line(ctx, x + 12, y - 240, x + 30, y - 300, U.rgb(green, 0.96), 9);
    U.rr(ctx, x + 25, y - 316, 12, 18, 3, U.rgb([158, 140, 96], 0.97));
    const fl = 0.75 + 0.25 * Math.sin(t * 5);
    U.circle(ctx, x + 31, y - 326, 9 * fl, 'rgba(255,198,110,0.95)');
    U.circle(ctx, x + 31, y - 330, 5 * fl, 'rgba(255,242,196,0.95)');
    const g = ctx.createRadialGradient(x + 31, y - 328, 3, x + 31, y - 328, 110);
    g.addColorStop(0, 'rgba(255,200,120,' + (0.3 * fl) + ')');
    g.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 79, y - 438, 220, 220);

    U.circle(ctx, x, y - 262, 17, U.rgb(green, 0.97));
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI + (i / 6) * Math.PI;
      U.poly(ctx, [
        [x + Math.cos(a) * 15, y - 262 + Math.sin(a) * 15],
        [x + Math.cos(a) * 30, y - 262 + Math.sin(a) * 30],
        [x + Math.cos(a + 0.16) * 15, y - 262 + Math.sin(a + 0.16) * 15]
      ], U.rgb(green, 0.95));
    }
  },

  draw_taxi(ctx, x, y, t, p, dark) {
    this.cab(ctx, x, y, t, 1, false);
    this.figure(ctx, x + 96, y, t, 41, dark,
      { shirt: [212, 210, 206], coat: [40, 44, 62], scale: 0.84 });
    this.figure(ctx, x - 120, y, t, 57, dark,
      { shirt: [212, 210, 206], coat: [92, 68, 60], scale: 0.82, face: -1 });
    U.line(ctx, x + 150, y, x + 150, y - 96, 'rgba(120,126,146,0.85)', 4);
    U.circle(ctx, x + 150, y - 100, 7, 'rgba(255,214,150,0.9)');
    const g = ctx.createRadialGradient(x + 150, y - 100, 3, x + 150, y - 100, 90);
    g.addColorStop(0, 'rgba(255,208,130,0.26)');
    g.addColorStop(1, 'rgba(255,208,130,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x + 60, y - 190, 180, 190);
  },

  cab(ctx, x, y, t, dir, moving) {
    const bounce = moving ? Math.sin(t * 9 + x * 0.01) * 0.8 : 0;
    ctx.save();
    ctx.translate(x, y + bounce);
    ctx.scale(dir, 1);

    U.rr(ctx, -62, -40, 124, 30, 7, U.rgb([246, 196, 42], 0.97));
    U.rr(ctx, -38, -62, 74, 26, 9, U.rgb([246, 196, 42], 0.97));
    U.rr(ctx, -32, -58, 30, 18, 4, 'rgba(158,196,220,0.85)');
    U.rr(ctx, 2, -58, 28, 18, 4, 'rgba(158,196,220,0.85)');
    for (let i = 0; i < 9; i++) {
      U.rr(ctx, -58 + i * 13, -28, 7, 6, 1,
        i % 2 ? 'rgba(32,34,44,0.9)' : 'rgba(250,250,248,0.9)');
    }
    U.rr(ctx, -14, -74, 28, 12, 3, U.rgb([250, 214, 80], 0.97));
    U.circle(ctx, 58, -30, 4.5, 'rgba(255,238,190,0.95)');
    U.circle(ctx, -60, -30, 4, 'rgba(238,96,80,0.9)');
    U.circle(ctx, -36, -8, 12, 'rgba(32,34,44,0.96)');
    U.circle(ctx, -36, -8, 4.5, 'rgba(150,154,170,0.9)');
    U.circle(ctx, 38, -8, 12, 'rgba(32,34,44,0.96)');
    U.circle(ctx, 38, -8, 4.5, 'rgba(150,154,170,0.9)');
    ctx.restore();
  },

  draw_empire(ctx, x, y, t, p, dark) {
    const body = [46, 52, 84];
    const tiers = [
      { w: 150, h: 150 }, { w: 116, h: 130 }, { w: 88, h: 150 },
      { w: 62, h: 120 }, { w: 40, h: 74 }
    ];
    let by = y;
    tiers.forEach((T, i) => {
      U.rr(ctx, x - T.w / 2, by - T.h, T.w, T.h, 2, U.rgb(body, 0.97));
      U.rr(ctx, x - T.w / 2 - 5, by - T.h - 6, T.w + 10, 8, 2, U.rgb([60, 66, 100], 0.97));
      const cols = Math.max(2, Math.floor(T.w / 17));
      const rows = Math.floor(T.h / 22);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (U.hash(i * 9.1 + r * 3.7 + c * 5.3) < 0.55) continue;
          ctx.fillStyle = 'rgba(255,206,120,0.62)';
          ctx.fillRect(x - T.w / 2 + 6 + c * 17, by - T.h + 10 + r * 22, 7, 11);
        }
      }
      by -= T.h + 6;
    });

    U.rr(ctx, x - 13, by - 54, 26, 56, 3, U.rgb([62, 68, 102], 0.97));
    U.line(ctx, x, by - 54, x, by - 116, 'rgba(180,190,220,0.9)', 5);
    const pulse = 0.6 + 0.4 * Math.sin(t * 2);
    U.circle(ctx, x, by - 120, 5 * pulse, 'rgba(255,226,160,0.95)');
    const g = ctx.createRadialGradient(x, by - 100, 6, x, by - 100, 150);
    g.addColorStop(0, 'rgba(255,206,130,' + (0.22 * pulse) + ')');
    g.addColorStop(1, 'rgba(255,206,130,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x - 150, by - 250, 300, 300);
  },

  draw_finale(ctx, x, y, t, p, dark) {
    U.line(ctx, x - 170, y, x - 170, y - 52, 'rgba(150,156,178,0.85)', 4);
    U.line(ctx, x + 170, y, x + 170, y - 52, 'rgba(150,156,178,0.85)', 4);
    U.line(ctx, x - 40, y, x - 40, y - 52, 'rgba(150,156,178,0.6)', 3);
    U.line(ctx, x + 70, y, x + 70, y - 52, 'rgba(150,156,178,0.6)', 3);
    U.line(ctx, x - 172, y - 50, x + 172, y - 50, 'rgba(164,170,190,0.9)', 4);
    U.line(ctx, x - 172, y - 30, x + 172, y - 30, 'rgba(164,170,190,0.6)', 3);

    const x1 = x - 170, x2 = x + 170;
    ctx.beginPath();
    ctx.moveTo(x1, y - 132);
    ctx.quadraticCurveTo(x, y - 96, x2, y - 132);
    ctx.strokeStyle = 'rgba(180,186,206,0.4)';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    for (let i = 0; i <= 14; i++) {
      const s2 = i / 14;
      const fx = U.lerp(x1, x2, s2);
      const fy = y - 132 + Math.sin(Math.PI * s2) * 36;
      const fl = 0.55 + 0.45 * Math.sin(t * 1.6 + i * 0.7);
      U.circle(ctx, fx, fy + 5, 4.2, 'rgba(255,212,146,' + (0.55 + fl * 0.4) + ')');
      const g = ctx.createRadialGradient(fx, fy + 5, 1, fx, fy + 5, 26);
      g.addColorStop(0, 'rgba(255,206,140,' + (0.2 * fl) + ')');
      g.addColorStop(1, 'rgba(255,206,140,0)');
      ctx.fillStyle = g;
      ctx.fillRect(fx - 26, fy - 21, 52, 52);
    }
  },

  /* taxis going past, all night */
  drawTraffic(ctx, cam, W, t) {
    const city = World.cityAt(cam);
    if (city < 0.04) return;
    ctx.save();
    ctx.globalAlpha = city;
    for (let i = 0; i < 6; i++) {
      const dir = U.hash(i * 5.7) > 0.45 ? 1 : -1;
      const sp = 110 + U.hash(i * 3.1) * 150;
      let o = (U.hash(i * 7.9) * 2750 + t * sp * dir) % 2750;
      if (o < 0) o += 2750;
      const wx = 16250 + o;
      const sx = wx - cam + W / 2;
      if (sx < -220 || sx > W + 220) continue;
      this.cab(ctx, sx, World.hisY(wx), t, dir, true);
    }
    ctx.restore();
  },

  /* ---------------- new york street ---------------- */

  sceneryNYC(ctx, x, y, pick, t, dark, seed) {
    if (pick < 0.3) {
      const n = 2 + Math.floor(U.hash(seed * 2.2) * 3);
      const coats = [[42, 46, 64], [86, 62, 58], [56, 58, 76], [120, 96, 74], [38, 52, 62]];
      for (let i = 0; i < n; i++) {
        this.figure(ctx, x + i * 26, y, t, seed * 4 + i, dark, {
          shirt: [212, 210, 206],
          coat: coats[Math.floor(U.hash(seed * 6.1 + i) * coats.length)],
          scale: 0.78 + U.hash(seed * 3.9 + i) * 0.12,
          face: U.hash(seed * 8.3 + i) > 0.5 ? 1 : -1,
          bag: U.hash(seed * 9.1 + i) > 0.6
        });
      }
    } else if (pick < 0.52) {
      U.line(ctx, x, y, x, y - 108, 'rgba(120,126,146,0.85)', 4);
      ctx.beginPath();
      ctx.arc(x + 10, y - 108, 10, Math.PI, Math.PI * 1.9);
      ctx.strokeStyle = 'rgba(120,126,146,0.85)';
      ctx.lineWidth = 4;
      ctx.stroke();
      U.circle(ctx, x + 19, y - 104, 6.5, 'rgba(255,214,150,0.92)');
      const g = ctx.createRadialGradient(x + 19, y - 104, 3, x + 19, y - 104, 110);
      g.addColorStop(0, 'rgba(255,206,130,0.28)');
      g.addColorStop(1, 'rgba(255,206,130,0)');
      ctx.fillStyle = g;
      ctx.fillRect(x - 91, y - 214, 220, 220);
    } else if (pick < 0.72) {
      U.rr(ctx, x - 34, y - 46, 68, 30, 4, U.rgb([200, 204, 212], 0.96));
      U.rr(ctx, x - 38, y - 52, 76, 8, 3, U.rgb([176, 60, 56], 0.96));
      U.line(ctx, x, y - 52, x, y - 92, 'rgba(160,166,184,0.8)', 3);
      ctx.beginPath();
      ctx.moveTo(x - 44, y - 92);
      ctx.quadraticCurveTo(x, y - 112, x + 44, y - 92);
      ctx.closePath();
      ctx.fillStyle = 'rgba(214,214,210,0.95)';
      ctx.fill();
      U.circle(ctx, x - 22, y - 10, 8, 'rgba(38,42,54,0.95)');
      U.circle(ctx, x + 22, y - 10, 8, 'rgba(38,42,54,0.95)');
      this.steam(ctx, x + 8, y - 50, t, 0.7);
    } else if (pick < 0.88) {
      U.rr(ctx, x - 44, y - 16, 88, 16, 3, U.rgb([52, 56, 72], 0.95));
      U.poly(ctx, [[x - 40, y - 16], [x + 40, y - 16], [x + 26, y - 70], [x - 26, y - 70]],
        U.rgb([30, 34, 46], 0.95));
      U.line(ctx, x - 30, y - 70, x - 30, y - 104, 'rgba(140,146,166,0.8)', 3);
      U.line(ctx, x + 30, y - 70, x + 30, y - 104, 'rgba(140,146,166,0.8)', 3);
      U.line(ctx, x - 32, y - 104, x + 32, y - 104, 'rgba(140,146,166,0.8)', 3);
      U.circle(ctx, x, y - 120, 13, 'rgba(96,152,208,0.9)');
      U.rr(ctx, x - 5, y - 127, 10, 15, 2, 'rgba(248,250,252,0.9)');
    } else {
      U.rr(ctx, x - 7, y - 28, 14, 28, 4, U.rgb([186, 62, 56], 0.96));
      U.rr(ctx, x - 11, y - 22, 22, 6, 2, U.rgb([186, 62, 56], 0.96));
      U.circle(ctx, x, y - 31, 6, U.rgb([186, 62, 56], 0.96));
      U.rr(ctx, x + 30, y - 44, 26, 44, 3, U.rgb([62, 96, 140], 0.95));
      U.rr(ctx, x + 34, y - 38, 18, 14, 2, 'rgba(206,214,230,0.8)');
    }
  },

  /* ---------------- roadside scenery between the memories ---------------- */

  drawScenery(ctx, cam, W, H, t, dark) {
    const step = 260;
    const start = Math.floor((cam - W) / step) - 1;

    for (let i = start; i < start + Math.ceil(W * 2 / step) + 2; i++) {
      const wx = i * step + U.hash(i * 2.7) * 120;
      if (wx < 0 || wx > World.END) continue;

      /* keep scenery clear of the memories */
      let clash = false;
      for (const p of PROPS) if (Math.abs(p.x - wx) < 230) { clash = true; break; }
      if (clash) continue;

      const sx = wx - cam + W / 2;
      if (sx < -80 || sx > W + 80) continue;

      const gap = World.gapAt(wx);
      const pick = U.hash(i * 5.1);

      /* only dress the countries once both ribbons have fully formed */
      const formed = World.formed(wx);
      if (formed > 0.04) {
        ctx.save();
        ctx.globalAlpha = formed;
        this.sceneryJP(ctx, sx, World.hisY(wx), pick, t, dark, i);
        this.sceneryIN(ctx, sx + 60, World.herY(wx), U.hash(i * 8.3), t, dark, i + 77);
        /* her streets are never empty */
        if (U.hash(i * 15.1) > 0.26) {
          this.inCrowd(ctx, sx - 104, World.herY(wx), t, i + 512, dark);
        }
        ctx.restore();
      } else if (wx > 16150) {
        this.sceneryNYC(ctx, sx, World.hisY(wx), pick, t, dark, i);
      } else if (wx > 8850 && wx < 9500) {
        this.sceneryCity(ctx, sx, World.hisY(wx), pick, t, dark, i);
      } else if (wx > 10150 && wx < 12950) {
        this.sceneryMeeting(ctx, sx, World.hisY(wx), pick, t, dark, i);
        /* the hills are busy - a second pass of people */
        if (U.hash(i * 12.9) > 0.35) {
          this.bystanders(ctx, sx + 118, World.hisY(wx), t, i + 301, dark);
        }
      } else {
        this.sceneryItem(ctx, sx, World.hisY(wx), pick, t, dark, i);
      }
    }
  },

  /* ---------------- my side: japan ---------------- */

  sceneryJP(ctx, x, y, pick, t, dark, seed) {
    if (pick >= 0.62 && pick < 0.82) {
      /* salarymen, on the way somewhere */
      const n = 2 + Math.floor(U.hash(seed * 2.4) * 2);
      for (let i = 0; i < n; i++) {
        const ox = x + (i - (n - 1) / 2) * 30;
        const face = U.hash(seed * 5.5 + i) > 0.5 ? 1 : -1;
        this.figure(ctx, ox, y, t, seed * 3 + i, dark, {
          shirt: [242, 243, 248], coat: [46, 50, 70], scale: 0.78, face: face,
          bag: U.hash(seed * 7.1 + i) > 0.45
        });
      }
      return;
    }
    if (pick >= 0.82) {
      if (U.hash(seed * 9.3) > 0.5) {
        /* the coast */
        U.poly(ctx, [[x - 90, y], [x + 90, y], [x + 62, y - 16], [x - 62, y - 16]],
          U.rgb([236, 220, 186], 0.9));
        const sea = dark > 0.5 ? [38, 62, 96] : [96, 156, 186];
        for (let i = 0; i < 3; i++) {
          const wy = y - 22 - i * 9;
          ctx.beginPath();
          ctx.moveTo(x - 86 + i * 8, wy);
          for (let k = 0; k <= 8; k++) {
            const px = x - 86 + i * 8 + k * 21;
            ctx.lineTo(px, wy + Math.sin(t * 1.5 + k * 0.9 + i) * 2.5);
          }
          ctx.strokeStyle = U.rgb(sea, 0.75 - i * 0.16);
          ctx.lineWidth = 3;
          ctx.lineCap = 'round';
          ctx.stroke();
        }
        U.line(ctx, x + 40, y, x + 40, y - 44, 'rgba(180,170,158,0.8)', 3);
        ctx.beginPath();
        ctx.moveTo(x + 6, y - 44);
        ctx.quadraticCurveTo(x + 40, y - 62, x + 74, y - 44);
        ctx.closePath();
        ctx.fillStyle = 'rgba(228,118,104,0.92)';
        ctx.fill();
        return;
      }
      /* a mountain, far off */
      const h = 122;
      const rock = dark > 0.5 ? [46, 54, 80] : [110, 126, 158];
      U.poly(ctx, [[x - 82, y], [x, y - h], [x + 82, y]], U.rgb(rock, 0.88));
      U.poly(ctx, [[x - 26, y - h + 40], [x, y - h], [x + 26, y - h + 40],
        [x + 12, y - h + 34], [x - 2, y - h + 44], [x - 14, y - h + 33]],
        'rgba(248,248,250,0.92)');
      return;
    }
    if (pick < 0.24) {
      /* torii */
      const h = 84 + U.hash(seed * 1.7) * 18;
      const red = 'rgba(196,72,46,0.95)';
      U.rr(ctx, x - 29, y - h, 7, h, 2, red);
      U.rr(ctx, x + 22, y - h, 7, h, 2, red);
      U.rr(ctx, x - 46, y - h - 12, 92, 8, 3, red);
      U.rr(ctx, x - 40, y - h - 2, 80, 6, 2, red);
      U.rr(ctx, x - 34, y - h + 16, 68, 5, 2, red);
    } else if (pick < 0.4) {
      /* pagoda */
      const tiers = 3;
      const bodyCol = 'rgba(222,216,206,0.92)';
      const roofCol = dark > 0.5 ? 'rgba(66,54,62,0.95)' : 'rgba(126,72,64,0.95)';
      for (let i = 0; i < tiers; i++) {
        const ty = y - 26 - i * 30;
        const w = 46 - i * 9;
        U.rr(ctx, x - w / 2, ty - 22, w, 24, 2, bodyCol);
        U.poly(ctx, [
          [x - w / 2 - 14, ty - 22],
          [x + w / 2 + 14, ty - 22],
          [x + w / 2 + 3, ty - 34],
          [x - w / 2 - 3, ty - 34]
        ], roofCol);
      }
      U.line(ctx, x, y - 116, x, y - 132, 'rgba(226,220,208,0.8)', 2.5);
    } else if (pick < 0.52) {
      /* cherry tree */
      const h = 48 + U.hash(seed * 3.1) * 22;
      U.line(ctx, x, y, x, y - h, 'rgba(84,66,62,0.8)', 4.5);
      U.line(ctx, x, y - h + 12, x - 16, y - h - 4, 'rgba(84,66,62,0.7)', 3);
      U.line(ctx, x, y - h + 16, x + 15, y - h - 2, 'rgba(84,66,62,0.7)', 3);
      const pink = dark > 0.5 ? [150, 104, 130] : [246, 186, 202];
      U.circle(ctx, x, y - h - 14, 18, U.rgb(pink, 0.93));
      U.circle(ctx, x - 18, y - h - 2, 13, U.rgb(pink, 0.88));
      U.circle(ctx, x + 18, y - h - 1, 12, U.rgb(pink, 0.88));
      U.circle(ctx, x + 4, y - h - 26, 11, U.rgb(pink, 0.8));
    } else {
      /* stone lantern */
      U.rr(ctx, x - 13, y - 12, 26, 12, 3, 'rgba(198,198,192,0.85)');
      U.rr(ctx, x - 8, y - 30, 16, 20, 3, 'rgba(210,210,204,0.85)');
      U.rr(ctx, x - 14, y - 46, 28, 17, 4, 'rgba(255,220,164,' + (0.4 + dark * 0.55) + ')');
      U.poly(ctx, [[x - 19, y - 46], [x + 19, y - 46], [x + 11, y - 57], [x - 11, y - 57]], 'rgba(198,198,192,0.9)');
      if (dark > 0.2) {
        const g = ctx.createRadialGradient(x, y - 38, 2, x, y - 38, 62);
        g.addColorStop(0, 'rgba(255,214,150,' + (0.24 * dark) + ')');
        g.addColorStop(1, 'rgba(255,214,150,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - 62, y - 100, 124, 124);
      }
    }
  },

  /* ---------------- her side: india ---------------- */

  sceneryIN(ctx, x, y, pick, t, dark, seed) {
    if (pick >= 0.58 && pick < 0.8) {
      /* the street she is busy on */
      this.rickshaw(ctx, x - 58, y, t, seed, dark);
      const n = 3 + Math.floor(U.hash(seed * 3.4) * 3);
      const shirts = [[214, 128, 96], [126, 150, 188], [176, 118, 150], [138, 166, 128], [206, 176, 104]];
      for (let i = 0; i < n; i++) {
        this.figure(ctx, x + 40 + i * 26, y, t, seed * 5 + i, dark, {
          shirt: shirts[Math.floor(U.hash(seed * 6.2 + i) * shirts.length)],
          scale: 0.74 + U.hash(seed * 2.8 + i) * 0.12,
          face: U.hash(seed * 7.4 + i) > 0.5 ? 1 : -1,
          bag: U.hash(seed * 8.1 + i) > 0.55,
          phone: U.hash(seed * 9.6 + i) > 0.7
        });
      }
      return;
    }
    if (pick >= 0.8) {
      /* the office she is still at */
      const h = 176 + U.hash(seed * 2.1) * 54;
      U.rr(ctx, x - 54, y - h, 108, h, 4, U.rgb(dark > 0.5 ? [52, 56, 78] : [124, 130, 152], 0.95));
      U.rr(ctx, x - 58, y - h - 8, 116, 12, 3, U.rgb(dark > 0.5 ? [42, 46, 66] : [106, 112, 134], 0.95));
      const rows = Math.floor(h / 38);
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < 3; c++) {
          const lit = U.hash(seed * 11.3 + r * 3.7 + c * 5.9) > 0.35;
          U.rr(ctx, x - 42 + c * 30, y - h + 16 + r * 38, 22, 24, 2,
            'rgba(255,214,152,' + (lit ? 0.45 + dark * 0.45 : 0.12) + ')');
        }
      }
      /* someone still at a desk */
      const dy = y - h + 16 + Math.floor(rows / 2) * 38;
      U.rr(ctx, x - 12, dy, 22, 24, 2, 'rgba(190,226,252,' + (0.5 + dark * 0.4) + ')');
      U.circle(ctx, x - 1, dy + 11, 4.6, 'rgba(66,72,98,0.8)');
      U.rr(ctx, x - 8, dy + 16, 14, 5, 1, 'rgba(66,72,98,0.7)');
      return;
    }
    if (pick < 0.22) {
      /* temple spire */
      const steps = 5;
      const ochre = dark > 0.5 ? [122, 94, 72] : [216, 164, 106];
      for (let i = 0; i < steps; i++) {
        const w = 44 - i * 7;
        const hy = y - 18 - i * 17;
        U.rr(ctx, x - w / 2, hy - 18, w, 20, 3, U.rgb(ochre, 0.93));
      }
      U.circle(ctx, x, y - 112, 9, U.rgb(ochre, 0.95));
      U.line(ctx, x, y - 120, x, y - 134, U.rgb(ochre, 0.9), 2.5);
      U.rr(ctx, x - 26, y - 20, 52, 20, 3, U.rgb(ochre, 0.88));
    } else if (pick < 0.38) {
      /* palm */
      const h = 62 + U.hash(seed * 2.9) * 26;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y - h * 0.6, x + 4, y - h);
      ctx.strokeStyle = 'rgba(112,88,64,0.85)';
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.stroke();
      const leaf = dark > 0.5 ? [40, 74, 58] : [82, 142, 96];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i - 2.5) * 0.52;
        const ex = x + 4 + Math.cos(a) * 34;
        const ey = y - h + Math.sin(a) * 26;
        ctx.beginPath();
        ctx.moveTo(x + 4, y - h);
        ctx.quadraticCurveTo((x + 4 + ex) / 2, (y - h + ey) / 2 - 12, ex, ey);
        ctx.strokeStyle = U.rgb(leaf, 0.9);
        ctx.lineWidth = 5;
        ctx.stroke();
      }
    } else if (pick < 0.5) {
      /* marigold garland between two poles */
      const px1 = x - 52, px2 = x + 52, ph = 74;
      U.line(ctx, px1, y, px1, y - ph, 'rgba(188,180,166,0.6)', 3);
      U.line(ctx, px2, y, px2, y - ph, 'rgba(188,180,166,0.6)', 3);
      const sag = 26;
      for (let i = 0; i <= 12; i++) {
        const s = i / 12;
        const fx = U.lerp(px1, px2, s);
        const fy = y - ph + Math.sin(Math.PI * s) * sag + Math.sin(t * 1.6 + i * 0.5) * 1.2;
        const c = i % 2 ? [246, 158, 52] : [232, 106, 46];
        U.circle(ctx, fx, fy, 4.4, U.rgb(c, 0.94));
      }
    } else {
      /* sandstone arch */
      const w = 30, h = 70;
      const stone = dark > 0.5 ? [120, 98, 86] : [212, 174, 134];
      ctx.save();
      ctx.fillStyle = U.rgb(stone, 0.93);
      ctx.beginPath();
      ctx.moveTo(x - w - 9, y);
      ctx.lineTo(x - w - 9, y - h);
      ctx.arc(x, y - h, w + 9, Math.PI, 0);
      ctx.lineTo(x + w + 9, y);
      ctx.lineTo(x + w, y);
      ctx.lineTo(x + w, y - h);
      ctx.arc(x, y - h, w, 0, Math.PI, true);
      ctx.lineTo(x - w, y);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      U.rr(ctx, x - w - 14, y - h - 34, (w + 14) * 2, 10, 3, U.rgb(stone, 0.9));
    }
  },

  rickshaw(ctx, x, y, t, seed, dark) {
    const bob = Math.sin(t * 2.4 + seed) * 0.8;
    const body = [236, 196, 64];
    const canopy = [42, 92, 62];

    U.rr(ctx, x - 26, y - 44 + bob, 52, 34, 6, U.rgb(body, 0.96));
    U.rr(ctx, x - 31, y - 61 + bob, 62, 21, 8, U.rgb(canopy, 0.95));
    U.poly(ctx, [[x + 26, y - 44 + bob], [x + 45, y - 31 + bob],
      [x + 45, y - 12 + bob], [x + 26, y - 12 + bob]], U.rgb(body, 0.96));
    U.rr(ctx, x + 29, y - 41 + bob, 13, 15, 3, 'rgba(198,226,244,0.8)');
    U.circle(ctx, x - 6, y - 33 + bob, 6, 'rgba(78,84,110,0.55)');
    U.circle(ctx, x - 16, y - 8, 9, 'rgba(38,42,58,0.95)');
    U.circle(ctx, x - 16, y - 8, 3.4, 'rgba(126,132,152,0.9)');
    U.circle(ctx, x + 39, y - 8, 8, 'rgba(38,42,58,0.95)');
    U.circle(ctx, x + 39, y - 8, 3, 'rgba(126,132,152,0.9)');
  },

  /* a handful of people on her street */
  inCrowd(ctx, x, y, t, seed, dark) {
    const n = 3 + Math.floor(U.hash(seed * 2.7) * 3);
    const shirts = [[214, 128, 96], [126, 150, 188], [176, 118, 150],
      [138, 166, 128], [206, 176, 104], [196, 140, 176]];
    for (let i = 0; i < n; i++) {
      this.figure(ctx, x + i * 25, y, t, seed * 6 + i, dark, {
        shirt: shirts[Math.floor(U.hash(seed * 4.3 + i) * shirts.length)],
        scale: 0.7 + U.hash(seed * 5.9 + i) * 0.14,
        face: U.hash(seed * 8.2 + i) > 0.5 ? 1 : -1,
        bag: U.hash(seed * 3.1 + i) > 0.62,
        phone: U.hash(seed * 9.4 + i) > 0.74
      });
    }
  },

  /* ---------------- landing in her city ---------------- */

  sceneryCity(ctx, x, y, pick, t, dark, seed) {
    if (pick < 0.34) {
      /* a row of shopfronts */
      const cols = [[216, 96, 74], [92, 140, 176], [222, 172, 72], [126, 158, 110]];
      for (let i = 0; i < 3; i++) {
        const bx = x - 90 + i * 66;
        const h = 96 + U.hash(seed * 2.3 + i) * 52;
        U.rr(ctx, bx, y - h, 58, h, 3, U.rgb(dark > 0.5 ? [60, 58, 76] : [206, 196, 184], 0.96));
        U.rr(ctx, bx - 2, y - h - 7, 62, 10, 3, U.rgb(cols[(i + seed | 0) % cols.length], 0.9));
        for (let r = 0; r < Math.floor(h / 44); r++) {
          U.rr(ctx, bx + 10, y - h + 16 + r * 44, 38, 24, 2,
            'rgba(255,214,152,' + (0.35 + dark * 0.45) + ')');
        }
        U.rr(ctx, bx + 6, y - 34, 46, 34, 2, 'rgba(255,198,132,' + (0.4 + dark * 0.4) + ')');
        U.rr(ctx, bx + 2, y - 44, 54, 11, 2, U.rgb(cols[(i + 1) % cols.length], 0.92));
      }
    } else if (pick < 0.62) {
      const n = 4 + Math.floor(U.hash(seed * 3.9) * 3);
      const shirts = [[214, 128, 96], [126, 150, 188], [176, 118, 150], [138, 166, 128], [206, 176, 104]];
      for (let i = 0; i < n; i++) {
        this.figure(ctx, x - 60 + i * 27, y, t, seed * 4 + i, dark, {
          shirt: shirts[Math.floor(U.hash(seed * 5.1 + i) * shirts.length)],
          scale: 0.72 + U.hash(seed * 3.3 + i) * 0.14,
          face: U.hash(seed * 6.8 + i) > 0.5 ? 1 : -1,
          bag: U.hash(seed * 7.7 + i) > 0.6
        });
      }
    } else if (pick < 0.86) {
      this.rickshaw(ctx, x, y, t, seed, dark);
      this.figure(ctx, x - 64, y, t, seed * 2.2, dark, { shirt: [188, 132, 104], scale: 0.76 });
    } else {
      /* fruit cart */
      U.rr(ctx, x - 40, y - 34, 80, 12, 3, U.rgb([176, 132, 84], 0.96));
      U.line(ctx, x - 30, y - 22, x - 30, y - 6, 'rgba(140,104,66,0.9)', 3);
      U.line(ctx, x + 30, y - 22, x + 30, y - 6, 'rgba(140,104,66,0.9)', 3);
      U.circle(ctx, x - 30, y - 4, 7, 'rgba(48,44,52,0.9)');
      U.circle(ctx, x + 30, y - 4, 7, 'rgba(48,44,52,0.9)');
      const fruit = [[228, 96, 74], [244, 176, 64], [138, 178, 92]];
      for (let i = 0; i < 9; i++) {
        U.circle(ctx, x - 32 + (i % 5) * 16, y - 40 - Math.floor(i / 5) * 9,
          6, U.rgb(fruit[i % 3], 0.94));
      }
      U.poly(ctx, [[x - 46, y - 58], [x + 46, y - 58], [x + 38, y - 74], [x - 38, y - 74]],
        'rgba(226,138,104,0.9)');
    }
  },

  /* ---------------- the meeting: green hills, buses, other people ---------------- */

  sceneryMeeting(ctx, x, y, pick, t, dark, seed) {
    if (pick < 0.32) {
      /* pine */
      const h = 84 + U.hash(seed * 1.7) * 48;
      const green = dark > 0.5 ? [34, 62, 52] : [62, 114, 80];
      U.line(ctx, x, y, x, y - h * 0.34, 'rgba(84,64,52,0.85)', 5);
      for (let i = 0; i < 4; i++) {
        const w = 33 - i * 6;
        const ty = y - h * 0.26 - i * (h * 0.19);
        U.poly(ctx, [[x - w, ty], [x + w, ty], [x, ty - h * 0.3]], U.rgb(green, 0.94));
      }
    } else if (pick < 0.54) {
      /* shrubs and a few wildflowers */
      const green = dark > 0.5 ? [38, 70, 56] : [84, 138, 96];
      U.circle(ctx, x, y - 15, 19, U.rgb(green, 0.93));
      U.circle(ctx, x - 21, y - 9, 13, U.rgb(green, 0.88));
      U.circle(ctx, x + 20, y - 10, 14, U.rgb(green, 0.88));
      const petal = [[246, 196, 108], [240, 140, 158], [250, 250, 244]];
      for (let i = 0; i < 5; i++) {
        const fx = x - 24 + U.hash(seed * 3.3 + i) * 48;
        const fy = y - 6 - U.hash(seed * 5.1 + i) * 22;
        U.circle(ctx, fx, fy, 2.6, U.rgb(petal[i % 3], 0.9));
      }
    } else if (pick < 0.84) {
      this.bystanders(ctx, x, y, t, seed, dark);
    } else {
      /* roadside rock */
      const g = dark > 0.5 ? [72, 74, 86] : [154, 150, 146];
      U.poly(ctx, [[x - 26, y], [x - 16, y - 21], [x + 8, y - 26], [x + 24, y - 8], [x + 27, y]],
        U.rgb(g, 0.9));
      U.poly(ctx, [[x - 16, y - 21], [x + 8, y - 26], [x + 2, y - 14]], U.rgb(U.mix(g, [255, 255, 255], 0.2), 0.8));
    }
  },

  /* one person, reused everywhere there is a crowd */
  figure(ctx, x, y, t, seed, dark, o) {
    o = o || {};
    const s = (o.scale || 0.78) * (0.94 + U.hash(seed * 4.1) * 0.14);
    const face = o.face || 1;
    const sway = Math.sin(t * 1.1 + seed * 2.3) * 1.3;
    const shirt = o.shirt || [126, 140, 176];
    const coat = o.coat || null;
    const legs = o.legs || (dark > 0.5 ? [46, 50, 70] : [62, 66, 88]);

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s * face, s);

    ctx.beginPath();
    ctx.ellipse(0, 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(8,10,22,0.18)';
    ctx.fill();

    U.line(ctx, -3, -18, -4, 0, U.rgb(legs, 0.9), 5);
    U.line(ctx, 3, -18, 5, 0, U.rgb(legs, 0.9), 5);
    U.rr(ctx, -8, -44 + sway * 0.3, 16, 28, 7, U.rgb(shirt, 0.94));

    if (coat) {
      U.rr(ctx, -10.5, -45 + sway * 0.3, 8, 29, 4, U.rgb(coat, 0.95));
      U.rr(ctx, 2.5, -45 + sway * 0.3, 8, 29, 4, U.rgb(coat, 0.95));
      U.line(ctx, -9, -39 + sway * 0.3, -13, -22, U.rgb(coat, 0.92), 4.5);
      U.line(ctx, 9, -39 + sway * 0.3, 13, -22, U.rgb(coat, 0.92), 4.5);
      U.poly(ctx, [[-2, -44], [2, -44], [1, -30], [-1, -30]], 'rgba(158,52,58,0.95)');
    } else {
      U.line(ctx, -8, -38 + sway * 0.3, -12, -22, U.rgb(shirt, 0.88), 4.5);
      U.line(ctx, 8, -38 + sway * 0.3, 12, -22, U.rgb(shirt, 0.88), 4.5);
    }

    U.circle(ctx, 0, -52 + sway * 0.3, 8, U.rgb(o.skin || [214, 176, 142], 0.93));
    ctx.beginPath();
    ctx.arc(0, -52 + sway * 0.3, 8.4, Math.PI * 1.02, Math.PI * 1.98);
    ctx.closePath();
    ctx.fillStyle = U.rgb(o.hair || (dark > 0.5 ? [30, 26, 32] : [46, 36, 38]), 0.93);
    ctx.fill();

    if (o.bag) {
      U.rr(ctx, 12, -27, 13, 15, 2, U.rgb([64, 54, 50], 0.95));
      U.line(ctx, 18, -27, 18, -33, 'rgba(40,34,32,0.9)', 1.6);
    }
    if (o.phone) U.rr(ctx, 11, -41, 5, 9, 1.5, 'rgba(206,228,248,0.92)');

    ctx.restore();
  },

  /* other people on the road, keeping their own distance */
  bystanders(ctx, x, y, t, seed, dark) {
    const n = 3 + Math.floor(U.hash(seed * 2.2) * 3);
    const shirts = [[126, 140, 176], [188, 116, 122], [132, 156, 132], [186, 160, 112], [156, 132, 176]];
    for (let i = 0; i < n; i++) {
      const ox = x + (i - (n - 1) / 2) * (24 + U.hash(seed + i) * 14);
      this.figure(ctx, ox, y, t, seed * 3 + i, dark, {
        shirt: shirts[Math.floor(U.hash(seed * 8.8 + i) * shirts.length)],
        scale: 0.7 + U.hash(seed * 4.1 + i) * 0.14,
        face: U.hash(seed * 6.3 + i) > 0.5 ? 1 : -1,
        bag: U.hash(seed * 9.9 + i) > 0.75
      });
    }
  },

  sceneryItem(ctx, x, y, pick, t, dark, seed) {
    if (pick < 0.42) {
      /* lamp post */
      const h = 74 + U.hash(seed * 1.3) * 22;
      U.line(ctx, x, y, x, y - h, 'rgba(206,214,232,0.55)', 3);
      U.line(ctx, x, y - h, x + 13, y - h, 'rgba(206,214,232,0.55)', 3);
      U.circle(ctx, x + 15, y - h + 2, 5, 'rgba(255,222,164,' + (0.4 + dark * 0.6) + ')');
      if (dark > 0.2) {
        const g = ctx.createRadialGradient(x + 15, y - h + 2, 2, x + 15, y - h + 2, 70);
        g.addColorStop(0, 'rgba(255,214,150,' + (0.22 * dark) + ')');
        g.addColorStop(1, 'rgba(255,214,150,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - 55, y - h - 68, 140, 140);
      }
    } else if (pick < 0.78) {
      /* small tree */
      const h = 42 + U.hash(seed * 3.7) * 26;
      U.line(ctx, x, y, x, y - h, 'rgba(92,76,68,0.75)', 4);
      const leaf = dark > 0.5 ? [44, 72, 66] : [96, 146, 118];
      U.circle(ctx, x, y - h - 10, 19, U.rgb(leaf, 0.92));
      U.circle(ctx, x - 13, y - h + 2, 13, U.rgb(leaf, 0.85));
      U.circle(ctx, x + 13, y - h + 3, 12, U.rgb(leaf, 0.85));
    } else if (pick < 0.9) {
      /* bench */
      U.rr(ctx, x - 22, y - 22, 44, 6, 3, 'rgba(216,222,238,0.6)');
      U.line(ctx, x - 15, y - 16, x - 15, y, 'rgba(216,222,238,0.45)', 2.5);
      U.line(ctx, x + 15, y - 16, x + 15, y, 'rgba(216,222,238,0.45)', 2.5);
    }
  }
};
