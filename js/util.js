/* shared math + drawing helpers */
const U = {
  lerp(a, b, t) { return a + (b - a) * t; },

  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

  smoothstep(e0, e1, x) {
    const t = U.clamp((x - e0) / (e1 - e0 || 1), 0, 1);
    return t * t * (3 - 2 * t);
  },

  easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; },

  easeOut(t) { return 1 - Math.pow(1 - t, 3); },

  /* interpolate a numeric track: keys = [{x, v}, ...] sorted by x */
  track(keys, x) {
    if (x <= keys[0].x) return keys[0].v;
    const last = keys[keys.length - 1];
    if (x >= last.x) return last.v;
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (x >= a.x && x <= b.x) {
        return U.lerp(a.v, b.v, U.smoothstep(a.x, b.x, x));
      }
    }
    return last.v;
  },

  /* same, but v is an [r,g,b] array */
  colorTrack(keys, x) {
    if (x <= keys[0].x) return keys[0].v.slice();
    const last = keys[keys.length - 1];
    if (x >= last.x) return last.v.slice();
    for (let i = 0; i < keys.length - 1; i++) {
      const a = keys[i], b = keys[i + 1];
      if (x >= a.x && x <= b.x) {
        const t = U.smoothstep(a.x, b.x, x);
        return [
          U.lerp(a.v[0], b.v[0], t),
          U.lerp(a.v[1], b.v[1], t),
          U.lerp(a.v[2], b.v[2], t)
        ];
      }
    }
    return last.v.slice();
  },

  rgb(c, a) {
    return a === undefined
      ? `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`
      : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  },

  mix(a, b, t) {
    return [U.lerp(a[0], b[0], t), U.lerp(a[1], b[1], t), U.lerp(a[2], b[2], t)];
  },

  /* deterministic pseudo-random from an integer seed - keeps scenery stable */
  hash(n) {
    let h = Math.sin(n * 127.1) * 43758.5453;
    return h - Math.floor(h);
  },

  rand(a, b) { return a + Math.random() * (b - a); },

  circle(ctx, x, y, r, fill) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
  },

  rr(ctx, x, y, w, h, r, fill) {
    const rad = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.arcTo(x + w, y, x + w, y + h, rad);
    ctx.arcTo(x + w, y + h, x, y + h, rad);
    ctx.arcTo(x, y + h, x, y, rad);
    ctx.arcTo(x, y, x + w, y, rad);
    ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  },

  poly(ctx, pts, fill) {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  },

  line(ctx, x1, y1, x2, y2, stroke, w, cap) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = stroke;
    ctx.lineWidth = w || 2;
    ctx.lineCap = cap || 'round';
    ctx.stroke();
  }
};
