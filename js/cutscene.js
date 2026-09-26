/* scripted journeys: the plane across the gap, the bus up into the hills */

const Cutscene = {
  active: null,

  start(fromX, toX, dur, kind) {
    this.active = { fromX: fromX, toX: toX, dur: dur || 6.4, t: 0, kind: kind || 'flight' };
  },

  get running() { return this.active !== null; },
  get kind() { return this.active ? this.active.kind : null; },

  update(dt, game) {
    const c = this.active;
    if (!c) return;
    c.t += dt;
    const s = U.clamp(c.t / c.dur, 0, 1);
    game.x = U.lerp(c.fromX, c.toX, U.easeInOut(s));
    if (s >= 1) this.active = null;
  },

  pose(cam, W) {
    const c = this.active;
    if (!c) return null;

    const s = U.clamp(c.t / c.dur, 0, 1);
    const wx = U.lerp(c.fromX, c.toX, U.easeInOut(s));
    const groundA = World.hisY(c.fromX);
    const groundB = World.hisY(c.toX);

    if (c.kind === 'bus') {
      return {
        x: wx - cam + W / 2,
        y: U.lerp(groundA, groundB, s),
        rot: 0, airborne: false, s: s
      };
    }

    if (c.kind === 'timeskip') {
      /* the plane only exists in the last third, coming down out of the cloud */
      const a = U.clamp((s - 0.62) / 0.38, 0, 1);
      const e = U.easeInOut(a);
      return {
        x: U.lerp(-360, W / 2, e),
        y: U.lerp(-120, World.PATH_Y - 14, U.easeInOut(Math.pow(a, 0.8))),
        rot: U.lerp(0.34, 0, U.smoothstep(0.55, 1, a)),
        airborne: a > 0 && a < 0.97,
        a: a, s: s
      };
    }

    if (c.kind === 'scooty') {
      const wob = this.wobble(c.t, s);
      return {
        x: wx - cam + W / 2,
        y: U.lerp(groundA, groundB, s) + wob.shake,
        rot: wob.tilt, wob: wob, airborne: false, s: s
      };
    }

    const base = U.lerp(groundA, groundB, U.smoothstep(0.14, 0.92, s));
    const u = U.clamp((s - 0.12) / 0.78, 0, 1);

    return {
      x: wx - cam + W / 2,
      y: base - Math.sin(Math.PI * u) * 165,
      rot: -Math.cos(Math.PI * u) * 0.26 * (u > 0 && u < 1 ? 1 : 0),
      airborne: u > 0.02 && u < 0.98,
      s: s
    };
  },

  draw(ctx, cam, W, t, rider) {
    const c = this.active;
    const p = this.pose(cam, W);
    if (!p) return;

    if (c.kind === 'timeskip') {
      this.timeskip(ctx, cam, W, t, p, rider);
      return;
    }

    if (c.kind === 'bus') {
      ctx.save();
      ctx.translate(p.x, p.y + Math.sin(t * 7) * 1.4);
      this.bus(ctx, t);
      ctx.restore();
      return;
    }

    if (c.kind === 'scooty') {
      /* the rocks that cause it, so you can see each one coming */
      for (let i = 0; i < this.BUMPS.length; i++) {
        const bwx = U.lerp(c.fromX, c.toX, this.BUMPS[i]);
        const bx = bwx - cam + W / 2;
        if (bx < -60 || bx > W + 60) continue;
        const by = World.hisY(bwx);
        U.poly(ctx, [[bx - 15, by], [bx - 9, by - 10], [bx + 3, by - 12],
          [bx + 13, by - 5], [bx + 16, by]], 'rgba(116,112,110,0.96)');
        U.poly(ctx, [[bx - 9, by - 10], [bx + 3, by - 12], [bx - 2, by - 5]],
          'rgba(162,158,152,0.9)');
      }

      /* gravel kicking up behind the back wheel */
      for (let i = 0; i < 10; i++) {
        const a = (t * 2.2 + i * 0.37) % 1;
        const gx = p.x - 34 - a * 52;
        const gy = p.y - 10 + Math.sin(i * 2.1) * 6 - a * 14;
        U.circle(ctx, gx, gy, 2.2 * (1 - a), 'rgba(196,184,164,' + ((1 - a) * 0.6 * p.wob.hit) + ')');
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      this.scooty(ctx, t, p.wob);
      ctx.restore();
      return;
    }

    if (p.airborne) {
      for (let i = 1; i < 16; i++) {
        const back = U.clamp(c.t / c.dur - i * 0.012, 0, 1);
        const wx = U.lerp(c.fromX, c.toX, U.easeInOut(back));
        const base = U.lerp(World.hisY(c.fromX), World.hisY(c.toX), U.smoothstep(0.14, 0.92, back));
        const u = U.clamp((back - 0.12) / 0.78, 0, 1);
        const y = base - Math.sin(Math.PI * u) * 165;
        U.circle(ctx, wx - cam + W / 2 - 52, y + 4, 6 * (1 - i / 20),
          'rgba(250,252,255,' + ((1 - i / 16) * 0.3) + ')');
      }
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    this.plane(ctx);
    if (rider) rider(ctx);
    ctx.restore();
  },

  plane(ctx) {
    const shell = 'rgba(246,249,255,0.97)';
    const trim = 'rgba(206,222,244,0.95)';
    U.poly(ctx, [[-6, 2], [24, -36], [38, -36], [16, 2]], trim);
    U.rr(ctx, -52, -11, 104, 22, 11, shell);
    U.poly(ctx, [[52, -10], [80, 0], [52, 10]], shell);
    U.poly(ctx, [[-52, -8], [-34, -34], [-22, -34], [-34, -8]], trim);
    U.poly(ctx, [[-6, 4], [24, 34], [38, 34], [16, 4]], 'rgba(228,238,252,0.95)');
    for (let i = 0; i < 5; i++) {
      U.circle(ctx, -30 + i * 15, -2, 3.2, 'rgba(150,186,226,0.75)');
    }
  },

  /* mist, then the years going past, then a plane out of the cloud */
  timeskip(ctx, cam, W, t, p, rider) {
    const s = p.s;
    const H = 720;
    const mist = U.smoothstep(0, 0.2, s) * (1 - U.smoothstep(0.66, 0.95, s));
    const rush = U.smoothstep(0.14, 0.3, s) * (1 - U.smoothstep(0.58, 0.72, s));

    /* haze swallowing everything */
    if (mist > 0.01) {
      ctx.save();
      ctx.globalAlpha = mist;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, 'rgba(214,220,230,0.94)');
      g.addColorStop(0.55, 'rgba(232,234,238,0.97)');
      g.addColorStop(1, 'rgba(206,212,224,0.94)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);

      for (let i = 0; i < 16; i++) {
        let cx = (U.hash(i * 4.1) * 2000 - t * (120 + U.hash(i) * 240)) % 2000;
        if (cx < 0) cx += 2000;
        const cy = 60 + U.hash(i * 7.3) * 560;
        const sc = 0.8 + U.hash(i * 2.9) * 1.6;
        ctx.globalAlpha = mist * (0.25 + U.hash(i * 5.5) * 0.4);
        U.circle(ctx, cx - 340, cy, 52 * sc, 'rgba(255,255,255,0.9)');
        U.circle(ctx, cx - 340 + 46 * sc, cy + 14 * sc, 40 * sc, 'rgba(255,255,255,0.9)');
        U.circle(ctx, cx - 340 - 44 * sc, cy + 10 * sc, 36 * sc, 'rgba(255,255,255,0.9)');
      }
      ctx.restore();
    }

    /* time going past */
    if (rush > 0.01) {
      ctx.save();
      ctx.globalAlpha = rush;

      /* day flicking over to night, over and over */
      const cycle = (Math.sin(t * 5.5) + 1) / 2;
      ctx.fillStyle = 'rgba(30,36,68,' + (cycle * 0.3) + ')';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = 'rgba(255,214,150,' + ((1 - cycle) * 0.16) + ')';
      ctx.fillRect(0, 0, W, H);

      /* streaks */
      for (let i = 0; i < 70; i++) {
        const sp = 900 + U.hash(i * 3.7) * 2600;
        let sx = (U.hash(i * 1.9) * 2400 - t * sp) % 2400;
        if (sx < 0) sx += 2400;
        const sy = U.hash(i * 6.1) * H;
        const len = 60 + U.hash(i * 8.3) * 260;
        ctx.globalAlpha = rush * (0.12 + U.hash(i * 2.2) * 0.3);
        U.line(ctx, sx - 500, sy, sx - 500 - len, sy, 'rgba(255,255,255,0.9)', 1 + U.hash(i) * 2.4);
      }

      /* ghosts of places going by */
      for (let i = 0; i < 10; i++) {
        const sp = 620 + U.hash(i * 5.1) * 900;
        let sx = (U.hash(i * 9.4) * 2600 - t * sp) % 2600;
        if (sx < 0) sx += 2600;
        const bh = 90 + U.hash(i * 3.3) * 240;
        ctx.globalAlpha = rush * 0.16;
        ctx.fillStyle = 'rgba(90,100,130,0.9)';
        ctx.fillRect(sx - 620, World.PATH_Y + 40 - bh, 44 + U.hash(i * 7.7) * 60, bh);
      }

      /* a clock running away with itself */
      const cx = W * 0.5, cy = 250;
      ctx.globalAlpha = rush * 0.3;
      ctx.beginPath();
      ctx.arc(cx, cy, 96, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(70,80,110,0.9)';
      ctx.lineWidth = 5;
      ctx.stroke();
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2;
        U.line(ctx, cx + Math.cos(a) * 80, cy + Math.sin(a) * 80,
          cx + Math.cos(a) * 92, cy + Math.sin(a) * 92, 'rgba(70,80,110,0.9)', 3);
      }
      const mh = t * 5.2, hh = t * 0.44;
      U.line(ctx, cx, cy, cx + Math.cos(mh - Math.PI / 2) * 76, cy + Math.sin(mh - Math.PI / 2) * 76,
        'rgba(60,70,100,0.95)', 4);
      U.line(ctx, cx, cy, cx + Math.cos(hh - Math.PI / 2) * 50, cy + Math.sin(hh - Math.PI / 2) * 50,
        'rgba(60,70,100,0.95)', 6);
      ctx.restore();
    }

    /* and then a plane comes down out of it */
    if (p.a > 0) {
      ctx.save();
      ctx.globalAlpha = U.smoothstep(0, 0.16, p.a);
      for (let i = 1; i < 14; i++) {
        const b = U.clamp(p.a - i * 0.022, 0, 1);
        const e = U.easeInOut(b);
        U.circle(ctx,
          U.lerp(-360, W / 2, e) - 54,
          U.lerp(-120, World.PATH_Y - 14, U.easeInOut(Math.pow(b, 0.8))) + 4,
          7 * (1 - i / 18), 'rgba(250,252,255,' + ((1 - i / 14) * 0.3) + ')');
      }
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      this.plane(ctx);
      if (rider) rider(ctx);
      ctx.restore();
    }
  },

  /* where the bad patches are, spaced out along the ride */
  BUMPS: [0.12, 0.36, 0.60, 0.85],

  wobble(t, s) {
    let hit = 0, grab = 0;
    for (let i = 0; i < this.BUMPS.length; i++) {
      const d = s - this.BUMPS[i];
      /* the jolt itself is brief and sharp */
      hit += Math.exp(-Math.pow(d / 0.022, 2));
      /* she braces just before it, and stays holding well after */
      const g = d < 0
        ? Math.exp(-Math.pow(d / 0.045, 2))
        : Math.exp(-d / 0.055);
      if (g > grab) grab = g;
    }
    hit = U.clamp(hit, 0, 1);

    const rattle = Math.sin(t * 38) * 0.62 + Math.sin(t * 23.5) * 0.38;
    const idle = Math.sin(t * 27) * 0.3;

    return {
      tilt: hit * rattle * 0.2 + idle * 0.011,
      shake: hit * rattle * 8 + idle * 0.7,
      grab: U.clamp(grab, 0, 1),
      hit: hit
    };
  },

  /* the rented scooty. wob = null draws it parked and empty. */
  scooty(ctx, t, wob) {
    const shell = [92, 170, 178];
    const dark = [46, 52, 66];
    const grab = wob ? wob.grab : 0;

    /* wheels */
    [-30, 32].forEach((wx) => {
      U.circle(ctx, wx, -12, 12, 'rgba(38,42,54,0.96)');
      U.circle(ctx, wx, -12, 4.5, 'rgba(146,152,168,0.9)');
    });

    /* frame */
    U.rr(ctx, -22, -26, 38, 7, 3, U.rgb(dark, 0.95));
    U.rr(ctx, -42, -32, 40, 14, 5, U.rgb(shell, 0.96));
    U.rr(ctx, -44, -46, 44, 17, 8, U.rgb(dark, 0.96));
    U.rr(ctx, 14, -64, 22, 44, 9, U.rgb(shell, 0.96));
    ctx.beginPath();
    ctx.arc(32, -12, 19, Math.PI * 1.15, Math.PI * 1.9);
    ctx.strokeStyle = U.rgb(shell, 0.95);
    ctx.lineWidth = 5;
    ctx.stroke();

    /* bars, lamp, mirror */
    U.line(ctx, 26, -64, 44, -70, U.rgb(dark, 0.95), 4);
    U.circle(ctx, 45, -70, 3, U.rgb(dark, 0.95));
    U.circle(ctx, 30, -54, 6, 'rgba(255,226,166,0.95)');
    U.line(ctx, 36, -70, 39, -82, U.rgb(dark, 0.9), 2);
    U.circle(ctx, 39, -84, 3.4, 'rgba(206,222,238,0.9)');

    if (!wob) return;

    /* me, driving */
    const hx = -2;
    U.line(ctx, hx + 2, -44, hx + 12, -30, 'rgba(70,78,104,0.95)', 5.5);
    U.line(ctx, hx + 12, -30, hx + 16, -24, 'rgba(70,78,104,0.95)', 5);
    U.rr(ctx, hx - 9, -76, 18, 32, 8, U.rgb([86, 126, 168], 0.97));
    U.line(ctx, hx + 6, -70, 27, -64, U.rgb([98, 138, 180], 0.95), 5);
    U.circle(ctx, hx + 1, -85, 9, U.rgb([226, 186, 152], 0.97));
    ctx.beginPath();
    ctx.arc(hx + 1, -85, 9.4, Math.PI * 1.02, Math.PI * 1.98);
    ctx.closePath();
    ctx.fillStyle = U.rgb([38, 40, 54], 0.96);
    ctx.fill();

    /* her, behind. when it gets bad she is all the way in. */
    const lean = grab * 13;
    const sx = -30 + lean;
    U.line(ctx, sx + 1, -44, sx + 6, -30, 'rgba(150,80,84,0.95)', 5.5);
    U.line(ctx, sx + 6, -30, sx + 2, -23, 'rgba(150,80,84,0.95)', 5);

    /* torso pitches forward into me */
    ctx.save();
    ctx.translate(sx, -44);
    ctx.rotate(grab * 0.26);
    U.rr(ctx, -9, -31, 18, 31, 8, U.rgb([226, 124, 118], 0.97));
    ctx.restore();

    /* one hand on the rail when calm, both round my waist when not */
    const skin = U.rgb([236, 174, 160], 0.97);
    const ax = U.lerp(sx - 19, hx - 2, grab);
    const ay = U.lerp(-42, -62, grab);
    U.line(ctx, sx + 4, -70 + grab * 6, ax, ay, skin, 5.4);
    U.circle(ctx, ax, ay, 3.4, skin);
    if (grab > 0.18) {
      ctx.save();
      ctx.globalAlpha = U.clamp((grab - 0.18) / 0.28, 0, 1);
      U.line(ctx, sx + 4, -62 + grab * 6, hx + 1, -50, skin, 5.4);
      U.circle(ctx, hx + 1, -50, 3.4, skin);
      ctx.restore();
    }

    /* and she tucks her head into my shoulder */
    const headX = sx + 1 + grab * 6;
    const headY = -83 + grab * 7;
    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate(grab * 0.3);
    U.rr(ctx, -10, -6, 20, 27, 9, U.rgb([52, 34, 38], 0.96));
    U.circle(ctx, 0, 0, 8.6, U.rgb([236, 198, 166], 0.97));
    ctx.beginPath();
    ctx.arc(0, 0, 9, Math.PI * 0.95, Math.PI * 2.05);
    ctx.closePath();
    ctx.fillStyle = U.rgb([52, 34, 38], 0.96);
    ctx.fill();
    U.circle(ctx, -10, -6, 5.4, U.rgb([52, 34, 38], 0.96));
    ctx.restore();

    /* shock lines on the hit itself */
    if (wob.hit > 0.3) {
      ctx.save();
      ctx.globalAlpha = (wob.hit - 0.3) / 0.7;
      for (let i = 0; i < 3; i++) {
        U.line(ctx, sx - 26 - i * 6, -80 + i * 9, sx - 38 - i * 6, -80 + i * 9,
          'rgba(252,244,232,0.75)', 2.2);
      }
      ctx.restore();
    }
  },

  /* the bus, with the two of us in a window */
  bus(ctx, t) {
    U.rr(ctx, -130, -104, 260, 96, 12, 'rgba(228,180,92,0.97)');
    U.rr(ctx, -130, -46, 260, 12, 4, 'rgba(196,142,68,0.9)');
    U.rr(ctx, -124, -114, 248, 14, 6, 'rgba(210,160,78,0.95)');

    for (let i = 0; i < 5; i++) {
      const wx = -114 + i * 48;
      U.rr(ctx, wx, -90, 38, 34, 5, 'rgba(178,214,238,0.85)');
      if (i !== 1) {
        U.circle(ctx, wx + 19, -70, 8, 'rgba(70,74,102,0.5)');
        U.circle(ctx, wx + 19, -82, 5.5, 'rgba(84,88,116,0.55)');
      }
    }

    /* our window - her head resting on his shoulder */
    const ox = -66;
    U.circle(ctx, ox + 11, -68, 8.5, U.rgb([86, 126, 168], 0.95));
    U.circle(ctx, ox + 11, -80, 6, U.rgb([226, 186, 152], 0.95));
    U.circle(ctx, ox + 26, -69, 8, U.rgb([226, 124, 118], 0.95));
    U.circle(ctx, ox + 25, -80, 5.6, U.rgb([236, 198, 166], 0.95));
    U.circle(ctx, ox + 30, -81, 5, U.rgb([52, 34, 38], 0.95));

    U.rr(ctx, 48, -108, 70, 12, 3, 'rgba(48,56,84,0.9)');
    U.circle(ctx, -76, -4, 17, 'rgba(38,42,58,0.95)');
    U.circle(ctx, -76, -4, 7, 'rgba(126,132,152,0.9)');
    U.circle(ctx, 76, -4, 17, 'rgba(38,42,58,0.95)');
    U.circle(ctx, 76, -4, 7, 'rgba(126,132,152,0.9)');

    U.rr(ctx, -90, -130, 54, 18, 4, 'rgba(180,126,92,0.95)');
    U.rr(ctx, -26, -126, 40, 14, 4, 'rgba(146,158,120,0.95)');
    U.rr(ctx, 22, -128, 46, 16, 4, 'rgba(188,150,110,0.95)');
  }
};
