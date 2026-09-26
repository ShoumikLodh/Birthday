/* =====================================================================
   PARALLEL PATHS - world definition
   ---------------------------------------------------------------------
   EDIT YOUR MEMORY TEXT IN THE `CAPTIONS` BLOCK BELOW.
   Everything else is geometry and drawing.
   ===================================================================== */

const CAPTIONS = {
  ferris: {
    title: "JLN!",
    body: "\"Hey I can hold your hand if you are having difficulty in walking\" and a whole lot of yapping about my job - just enough to catch your interest :P"
  },
  dussehra: {
    title: "Dussehra",
    body: "The 2nd date, filled with chaos all around but a sense of tranquility being there with you. First time I felt protective towards u >.<"
  },
  picnic: {
    title: "the picnic",
    body: "Matching fits, yummy food, annoying distractions and our very own kid for the day \ud83d\udc3f\ufe0f"
  },
  food: {
    title: "good food",
    body: "You introducing me to cafes, sushi, and so many amazing dishes. Going out and trying yummy stuff will never get old with you <3"
  },
  momo: {
    title: "MKT",
    body: "MKT, the birthplace for all our memories. I will always associate MKT with you. Coming late, staying overnight, getting late night snacks, laphing, buff xD. Trying so many restaurants, and most importantly the feeling of coming and leaving together to our very own safe house."
  },
  train: {
    title: "metro station",
    body: "Our meetup spot for months, Sec 52 and Botanical. Hours of waiting and anticipation to see the other person. Travelling that extra 15 mins to spend more time together, and exploring soo many different places when we were short on budget!"
  },
  flight: {
    title: "the departure",
    body: "The day came, the one we dreaded for months. It broke us, but it made us stronger."
  },
  call: {
    title: "Video Calls",
    body: "Just getting to see your beautiful face through VCs. The pain of not getting to touch you, to feel you, to smell your hair or to rest my head on your belly. These are unparalleled. Can't tell you how much it made me miss you. (your connection makes it so much worse, like I just wanna look at your fit pls let me \ud83d\ude2d)"
  },
  anime: {
    title: "ANIME!!!",
    body: "Hehe i introduced you to some really good ones, but we have bonded so much over these, over the past 2 years. I'm glad it happened the way it did. Looking forward to watching more with you, and poking each other for another episode :P"
  },
  bday: {
    title: "a birthday through a screen",
    body: "Happy birthday!!!! I could not be there, but my heart and love lies with you Priya. I try and do small things, but if they could make you even a tiny bit special, thats all i need. I really look forward to celebrating your birthday together one day and me making your day the bestttt"
  },
  toher: {
    title: "India!!!",
    body: "The day we look most forward to, for months. The first glance of you outside the airport makes me blush. You look so good, and i feel crazyyyy in lovee. The best time of the year fssss"
  },
  bus: {
    title: "The first trip",
    body: "Such a special trip. Mussoorie and you gave me unforgettable memories that i'll take to the grave. It made me feel special, happy and so much in love. I am glad we planned it and it happened!!"
  },
  view: {
    title: "The peace",
    body: "Mountains, peace, starry night, twinkly valleys and you by my side. It was perfect."
  },
  scooty: {
    title: "the scooty",
    body: "Umm, we both know how this went. (Can't wait to scare the living shit out of you again ;))"
  },
  coffee: {
    title: "Pahado ki Chai",
    body: "wow wanted to get pahado ki chai, maggi for so long. I am so happy we could check this off our list"
  },
  goodbye: {
    title: "Time to leave",
    body: "Like all beautiful things, this one also had to come to a temporary end. Had to go back to being adults. Hardest airport goodbye ever, I cant believe I made it through that honestly. CANNOT do that again."
  },
  dream: {
    title: "the one we keep talking about",
    body: "countless hopes and ambitions, yet one name kept coming up always!"
  },
  haze: {
    title: "and then the years",
    body: "Years pass by. We keep flying and reach greater heights. But now it was time to bridge this gap. The dream we always had~"
  },
  liberty: {
    title: "she was the first thing we saw",
    body: "we finally made it, what a sight for sore eyes."
  },
  taxi: {
    title: "yellow",
    body: "We put our hands up like you had seen it a thousand times in the romcoms, even though we wanted to explore the streets on foot!"
  },
  empire: {
    title: "the one in the middle",
    body: "The huge buildings, the building we used to point at on a screen."
  }
};

/* ---------------------------------------------------------------
   THE LAST THING SHE READS. WRITE THIS ONE YOURSELF.
   --------------------------------------------------------------- */
const ENDING = {
  title: "happy birthday",
  lines: [
    "We started on the same path and then it split, and for a long time the best I could do was walk alongside you with a whole ocean in between.",
    "ups and downs, arguments and misunderstandings but you still made me feel like I was yours as you mine",
    "So here is the rest of it, the future unfolded. Same path, no gap, for good.",
    "Hope you like the gift, a look into the future. Happy birthday. I love you."
  ]
};

const World = {
  END: 19000,
  PATH_Y: 455,
  MAX_GAP: 380,
  RIBBON_H: 34,

  /* how far apart the two paths run, across the whole story */
  gapKeys: [
    { x: 0,     v: 0 },
    { x: 5150,  v: 0 },
    { x: 5700,  v: 380 },   // he flies out, the paths split
    { x: 8250,  v: 380 },
    { x: 8850,  v: 0 },     // he flies to her
    { x: 12900, v: 0 },     // city, bus, mountains, scooty
    { x: 13500, v: 380 },   // and back again
    { x: 15400, v: 380 },
    { x: 16100, v: 0 },     // the years close the gap
    { x: 19000, v: 0 }
  ],

  /* rain: both goodbyes, and a grey drizzle before new york */
  rainKeys: [
    { x: 0,     v: 0 },
    { x: 4650,  v: 0 },
    { x: 5050,  v: 1 },
    { x: 5650,  v: 1 },
    { x: 6300,  v: 0 },
    { x: 12750, v: 0 },
    { x: 12950, v: 1 },
    { x: 13550, v: 1 },
    { x: 14150, v: 0 },
    { x: 19000, v: 0 }
  ],

  skyTop: [
    { x: 0,     v: [124, 180, 224] },
    { x: 900,   v: [112, 168, 214] },
    { x: 1250,  v: [70, 80, 140] },
    { x: 1550,  v: [30, 34, 74] },
    { x: 1900,  v: [26, 30, 64] },
    { x: 2300,  v: [96, 140, 200] },
    { x: 2650,  v: [88, 124, 188] },
    { x: 3000,  v: [44, 50, 96] },
    { x: 3650,  v: [22, 26, 56] },
    { x: 4450,  v: [38, 48, 92] },
    { x: 4900,  v: [34, 38, 58] },
    { x: 5200,  v: [24, 28, 44] },
    { x: 5700,  v: [40, 48, 72] },
    { x: 6400,  v: [118, 166, 208] },
    { x: 8250,  v: [112, 162, 210] },
    { x: 8900,  v: [120, 172, 214] },
    { x: 9800,  v: [116, 164, 206] },
    { x: 10400, v: [102, 148, 204] },
    { x: 11300, v: [72, 96, 166] },
    { x: 12300, v: [56, 68, 132] },
    { x: 12950, v: [30, 34, 52] },
    { x: 13400, v: [24, 28, 44] },
    { x: 13950, v: [42, 50, 74] },
    { x: 14700, v: [118, 166, 208] },
    { x: 15100, v: [126, 142, 176] },
    { x: 15700, v: [152, 158, 172] },
    { x: 16150, v: [58, 68, 108] },
    { x: 16500, v: [22, 26, 48] },
    { x: 17300, v: [18, 22, 42] },
    { x: 19000, v: [16, 20, 38] }
  ],

  skyBot: [
    { x: 0,     v: [198, 224, 238] },
    { x: 900,   v: [216, 228, 236] },
    { x: 1250,  v: [214, 150, 120] },
    { x: 1550,  v: [76, 54, 96] },
    { x: 1900,  v: [62, 46, 84] },
    { x: 2300,  v: [248, 206, 160] },
    { x: 2650,  v: [246, 188, 144] },
    { x: 3000,  v: [112, 78, 112] },
    { x: 3650,  v: [56, 44, 78] },
    { x: 4450,  v: [126, 108, 132] },
    { x: 4900,  v: [74, 78, 98] },
    { x: 5200,  v: [54, 58, 76] },
    { x: 5700,  v: [88, 94, 116] },
    { x: 6400,  v: [206, 222, 232] },
    { x: 8250,  v: [212, 226, 234] },
    { x: 8900,  v: [222, 232, 238] },
    { x: 9800,  v: [214, 224, 230] },
    { x: 10400, v: [236, 206, 172] },
    { x: 11300, v: [250, 176, 120] },
    { x: 12300, v: [246, 148, 110] },
    { x: 12950, v: [62, 66, 84] },
    { x: 13400, v: [54, 58, 76] },
    { x: 13950, v: [90, 96, 118] },
    { x: 14700, v: [206, 222, 232] },
    { x: 15100, v: [204, 210, 218] },
    { x: 15700, v: [208, 210, 216] },
    { x: 16150, v: [136, 138, 158] },
    { x: 16500, v: [58, 60, 92] },
    { x: 17300, v: [48, 52, 82] },
    { x: 19000, v: [44, 48, 78] }
  ],

  /* what we were wearing, memory by memory */
  LOOKS: [
    { from: 0,    to: 1250,
      him: { body: [36, 38, 46],    garment: 'kurta' },
      her: { body: [238, 148, 180], garment: 'kurta' } },
    { from: 1250, to: 1990,
      him: { body: [62, 104, 178],  garment: 'kurta' },
      her: { body: [246, 245, 241], garment: 'kurta' } },
    { from: 1990, to: 2720,
      him: { body: [242, 242, 238], garment: 'kurta' },
      her: { body: [249, 247, 244], garment: 'frock' } },
    { from: 16150, to: 19000,
      him: { body: [46, 50, 70],    garment: 'coat' },
      her: { body: [198, 146, 96],  garment: 'coat' } }
  ],

  lookAt(x) {
    for (let i = 0; i < this.LOOKS.length; i++) {
      const L = this.LOOKS[i];
      if (x >= L.from && x <= L.to) return L;
    }
    return null;
  },

  gapAt(x)  { return U.track(this.gapKeys, x); },
  rainAt(x) { return U.track(this.rainKeys, x); },
  /* japan runs along the top, india along the bottom */
  hisY(x)   { return this.PATH_Y - this.gapAt(x) / 2; },
  herY(x)   { return this.PATH_Y + this.gapAt(x) / 2; },
  /* 0 until the two ribbons are fully formed - gates the country dressing */
  formed(x) { return U.smoothstep(0.86, 1, this.gapAt(x) / this.MAX_GAP); },

  /* how much new york there is on screen */
  cityAt(x) { return U.smoothstep(16000, 16560, x); },

  /* 0 = bright day, 1 = full night */
  darkness(x) {
    const b = U.colorTrack(this.skyBot, x);
    const lum = (b[0] * 0.3 + b[1] * 0.55 + b[2] * 0.15) / 255;
    return U.clamp(1 - (lum - 0.2) / 0.6, 0, 1);
  },

  /* ---------------- background ---------------- */

  drawSky(ctx, cam, W, H) {
    const top = U.colorTrack(this.skyTop, cam);
    const bot = U.colorTrack(this.skyBot, cam);
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, U.rgb(top));
    g.addColorStop(1, U.rgb(bot));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  },

  drawStars(ctx, cam, W, H, t) {
    const a = this.darkness(cam) * (1 - this.rainAt(cam));
    if (a < 0.05) return;
    for (let i = 0; i < 90; i++) {
      let sx = (U.hash(i * 3.1) * 2400 - cam * 0.08) % 1400;
      if (sx < 0) sx += 1400;
      const y = U.hash(i * 7.7) * 360;
      const tw = 0.55 + 0.45 * Math.sin(t * 1.6 + i);
      const r = 0.7 + U.hash(i * 2.3) * 1.3;
      U.circle(ctx, sx, y, r, 'rgba(255,252,240,' + (a * tw * 0.9) + ')');
    }
  },

  drawCelestial(ctx, cam, W, H) {
    const dark = this.darkness(cam);
    const x = W * 0.5 + Math.sin(cam * 0.00035) * W * 0.42;
    const y = 190 - Math.cos(cam * 0.00035) * 90;

    if (dark > 0.5) {
      ctx.save();
      ctx.globalAlpha = (dark - 0.5) * 2;
      const glow = ctx.createRadialGradient(x, y, 6, x, y, 90);
      glow.addColorStop(0, 'rgba(240,238,225,0.5)');
      glow.addColorStop(1, 'rgba(240,238,225,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 90, y - 90, 180, 180);
      U.circle(ctx, x, y, 26, 'rgba(245,242,228,0.95)');
      U.circle(ctx, x + 10, y - 7, 22, U.rgb(U.colorTrack(this.skyTop, cam), 0.92));
      ctx.restore();
    } else {
      ctx.save();
      ctx.globalAlpha = U.clamp(1 - dark * 2, 0, 1);
      const glow = ctx.createRadialGradient(x, y, 10, x, y, 150);
      glow.addColorStop(0, 'rgba(255,238,198,0.55)');
      glow.addColorStop(1, 'rgba(255,238,198,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(x - 150, y - 150, 300, 300);
      U.circle(ctx, x, y, 34, 'rgba(255,244,214,0.96)');
      ctx.restore();
    }
  },

  drawClouds(ctx, cam, W, H, t) {
    const dark = this.darkness(cam);
    const overcast = Math.max(
      U.smoothstep(13500, 14200, cam) * (1 - U.smoothstep(15500, 16100, cam)),
      this.rainAt(cam)
    );
    const base = 0.3 + overcast * 0.5;
    const tint = dark > 0.5 ? [86, 92, 122] : [255, 255, 255];
    const count = 9 + Math.round(overcast * 7);

    for (let i = 0; i < count; i++) {
      const span = 2600;
      let cx = (U.hash(i * 5.3) * span - cam * 0.18 + t * 5) % span;
      if (cx < 0) cx += span;
      const x = cx - 300;
      const y = 60 + U.hash(i * 9.1) * 200 - overcast * 20;
      const s = 0.6 + U.hash(i * 4.4) * 0.9 + overcast * 0.3;

      ctx.save();
      ctx.globalAlpha = base * (0.5 + U.hash(i * 6.6) * 0.5);
      U.circle(ctx, x, y, 34 * s, U.rgb(tint));
      U.circle(ctx, x + 34 * s, y + 6 * s, 26 * s, U.rgb(tint));
      U.circle(ctx, x - 32 * s, y + 8 * s, 22 * s, U.rgb(tint));
      U.circle(ctx, x + 12 * s, y - 16 * s, 24 * s, U.rgb(tint));
      ctx.restore();
    }
  },

  /* a sea of buildings, all lit up */
  drawSkyline(ctx, cam, W, H, t) {
    const city = this.cityAt(cam);
    if (city < 0.02) return;

    ctx.save();
    ctx.globalAlpha = city;
    const layers = [
      { par: 0.08, base: [30, 34, 60], lo: 150, hi: 330, step: 78, lit: 0.2, wa: 0.3 },
      { par: 0.2,  base: [19, 23, 44], lo: 210, hi: 450, step: 104, lit: 0.3, wa: 0.62 }
    ];

    layers.forEach((L, li) => {
      const off = cam * L.par;
      const start = Math.floor(off / L.step) - 1;
      const n = Math.ceil(W / L.step) + 3;

      for (let i = start; i < start + n; i++) {
        const bx = i * L.step - off;
        const w = L.step - 10 - U.hash(i * 2.3 + li) * 16;
        const h = L.lo + U.hash(i * 5.7 + li * 3.1) * (L.hi - L.lo);
        const by = this.PATH_Y + 44 - h;

        ctx.fillStyle = U.rgb(L.base, 0.97);
        ctx.fillRect(bx, by, w, h);
        /* a lit crown on some of them */
        if (U.hash(i * 8.8 + li) > 0.7) {
          ctx.fillStyle = 'rgba(255,190,96,0.5)';
          ctx.fillRect(bx + w * 0.3, by - 4, w * 0.4, 4);
        }

        const cols = Math.max(2, Math.floor(w / 19));
        const rows = Math.floor(h / 27);
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const hv = U.hash(i * 13.1 + r * 3.37 + c * 7.71 + li * 21);
            if (hv < 1 - L.lit) continue;
            const flick = hv > 0.97 ? 0.45 + 0.55 * Math.abs(Math.sin(t * 1.3 + hv * 40)) : 1;
            ctx.fillStyle = 'rgba(255,204,118,' + (L.wa * flick) + ')';
            ctx.fillRect(bx + 7 + c * 19, by + 12 + r * 27, 8, 13);
          }
        }
      }
    });
    ctx.restore();
  },

  drawHills(ctx, cam, W, H) {
    const dark = this.darkness(cam);
    const skyB = U.colorTrack(this.skyBot, cam);
    const alpine = U.smoothstep(9950, 10450, cam) * (1 - U.smoothstep(12650, 13150, cam));

    const layers = [
      { par: 0.14, h: 120, tint: 0.16, y: 430 },
      { par: 0.3,  h: 90,  tint: 0.3,  y: 470 }
    ];

    layers.forEach((L, li) => {
      const col = U.mix(skyB, dark > 0.5 ? [16, 18, 40] : [58, 74, 104], L.tint + 0.24);
      ctx.fillStyle = U.rgb(col);
      ctx.beginPath();
      ctx.moveTo(-50, H);

      const step = 150;
      const off = cam * L.par;
      const start = Math.floor(off / step) - 1;

      for (let i = start; i < start + 14; i++) {
        const px = i * step - off;
        const peak = L.h * (0.55 + U.hash(i * (li + 3) * 1.7) * 0.8) * (1 + alpine * 1.5);
        ctx.lineTo(px, L.y - peak);
        ctx.lineTo(px + step * 0.5, L.y - peak * 0.35);
      }

      ctx.lineTo(W + 80, H);
      ctx.closePath();
      ctx.fill();

      if (alpine > 0.02 && li === 0) {
        ctx.save();
        ctx.globalAlpha = alpine * 0.9;
        for (let i = start; i < start + 14; i++) {
          const px = i * step - off;
          const peak = L.h * (0.55 + U.hash(i * 3 * 1.7) * 0.8) * (1 + alpine * 1.5);
          const ty = L.y - peak;
          U.poly(ctx, [[px, ty], [px + 17, ty + 26], [px - 15, ty + 26]], 'rgba(248,246,240,0.92)');
        }
        ctx.restore();
      }
    });
  },

  /* ---------------- two countries, while we are apart ---------------- */

  drawRegionBands(ctx, cam, W, H) {
    const a = this.formed(cam) * 0.92;
    if (a < 0.03) return;

    /* my side - japan, along the top */
    const jy = this.hisY(cam);
    const jTop = jy - 172;
    const wash = ctx.createLinearGradient(0, jTop, 0, jy + this.RIBBON_H);
    wash.addColorStop(0, 'rgba(252,252,254,0.02)');
    wash.addColorStop(0.55, 'rgba(252,252,254,' + (0.24 * a) + ')');
    wash.addColorStop(1, 'rgba(252,252,254,0.03)');
    ctx.fillStyle = wash;
    ctx.fillRect(0, jTop, W, jy + this.RIBBON_H - jTop);

    /* hinomaru */
    const dx = W * 0.5;
    const dy = jy - 100;
    const R = 92;
    const halo = ctx.createRadialGradient(dx, dy, R * 0.8, dx, dy, R * 1.9);
    halo.addColorStop(0, 'rgba(188,0,45,' + (0.2 * a) + ')');
    halo.addColorStop(1, 'rgba(188,0,45,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(dx - R * 1.9, dy - R * 1.9, R * 3.8, R * 3.8);
    U.circle(ctx, dx, dy, R, 'rgba(188,0,45,' + (0.46 * a) + ')');
    U.circle(ctx, dx, dy, R * 0.92, 'rgba(206,16,58,' + (0.2 * a) + ')');

    /* her side - india, along the bottom */
    const hy = this.herY(cam);
    const top = hy - 170;
    const stripes = [[255, 153, 51], [252, 250, 245], [19, 136, 8]];
    stripes.forEach((c, i) => {
      const y0 = top + i * 56;
      const g = ctx.createLinearGradient(0, y0, 0, y0 + 56);
      g.addColorStop(0, U.rgb(c, 0.05 * a));
      g.addColorStop(0.5, U.rgb(c, 0.15 * a));
      g.addColorStop(1, U.rgb(c, 0.05 * a));
      ctx.fillStyle = g;
      ctx.fillRect(0, y0, W, 56);
    });
    U.circle(ctx, W * 0.5, top + 84, 26, 'rgba(0,0,128,' + (0.16 * a) + ')');
    ctx.beginPath();
    ctx.arc(W * 0.5, top + 84, 26, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,128,' + (0.3 * a) + ')';
    ctx.lineWidth = 2.5;
    ctx.stroke();
    for (let k = 0; k < 12; k++) {
      const ang = (k / 12) * Math.PI * 2;
      U.line(ctx, W * 0.5, top + 84,
        W * 0.5 + Math.cos(ang) * 25, top + 84 + Math.sin(ang) * 25,
        'rgba(0,0,128,' + (0.22 * a) + ')', 1.4);
    }
  },

  /* ---------------- rain ---------------- */

  drawRain(ctx, cam, W, H, t) {
    const r = this.rainAt(cam);
    if (r < 0.01) return;

    const count = Math.round(300 * r);
    ctx.save();
    ctx.strokeStyle = 'rgba(206,222,246,0.5)';
    ctx.lineWidth = 1.3;
    ctx.lineCap = 'butt';
    ctx.beginPath();

    for (let i = 0; i < count; i++) {
      const span = 1500;
      const sp = 0.75 + U.hash(i * 1.9) * 0.6;
      let x = (U.hash(i * 3.3) * span - cam * 0.5 + t * 90) % span;
      if (x < 0) x += span;
      let y = (U.hash(i * 7.1) * H + t * 900 * sp) % (H + 40);
      x -= 110;
      ctx.moveTo(x, y);
      ctx.lineTo(x - 6, y + 21 * sp);
    }

    ctx.globalAlpha = 0.24 + r * 0.4;
    ctx.stroke();
    ctx.restore();
  },

  drawStormTint(ctx, cam, W, H) {
    const r = this.rainAt(cam);
    if (r < 0.01) return;
    ctx.fillStyle = 'rgba(12,16,30,' + (0.28 * r) + ')';
    ctx.fillRect(0, 0, W, H);

    const v = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.95);
    v.addColorStop(0, 'rgba(8,10,22,0)');
    v.addColorStop(1, 'rgba(8,10,22,' + (0.5 * r) + ')');
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);
  },

  /* ---------------- the paths ---------------- */

  drawPaths(ctx, cam, W, H, t) {
    const gap = this.gapAt(cam);
    const split = gap > 2;
    const dark = this.darkness(cam);
    const band = U.mix(U.colorTrack(this.skyTop, cam), dark > 0.5 ? [12, 14, 28] : [44, 52, 76], 0.72);

    if (split) this.drawVoid(ctx, cam, W, H, t, gap);

    const ribbon = (y, warm) => {
      const sh = ctx.createLinearGradient(0, y + this.RIBBON_H, 0, y + this.RIBBON_H + 46);
      sh.addColorStop(0, 'rgba(8,10,22,0.28)');
      sh.addColorStop(1, 'rgba(8,10,22,0)');
      ctx.fillStyle = sh;
      ctx.fillRect(0, y + this.RIBBON_H, W, 46);

      ctx.fillStyle = U.rgb(band);
      ctx.fillRect(0, y, W, this.RIBBON_H);

      ctx.fillStyle = split
        ? (warm ? 'rgba(255,196,150,0.75)' : 'rgba(168,214,240,0.7)')
        : 'rgba(255,222,180,0.8)';
      ctx.fillRect(0, y, W, 2.5);
    };

    if (split) {
      ribbon(this.hisY(cam), false);
      ribbon(this.herY(cam), true);
    } else {
      ribbon(this.PATH_Y, false);
    }
  },

  drawVoid(ctx, cam, W, H, t, gap) {
    const top = this.hisY(cam) + this.RIBBON_H;
    const bot = this.herY(cam);
    const h = bot - top;
    if (h <= 0) return;

    const a = U.clamp(gap / this.MAX_GAP, 0, 1);
    const g = ctx.createLinearGradient(0, top, 0, bot);
    g.addColorStop(0, 'rgba(10,14,32,' + (0.16 * a) + ')');
    g.addColorStop(0.5, 'rgba(10,14,32,' + (0.3 * a) + ')');
    g.addColorStop(1, 'rgba(10,14,32,' + (0.16 * a) + ')');
    ctx.fillStyle = g;
    ctx.fillRect(0, top, W, h);

    for (let i = 0; i < 26; i++) {
      const span = 1500;
      let px = (U.hash(i * 11.3) * span - cam * 0.5 + t * 14) % span;
      if (px < 0) px += span;
      const py = top + 14 + U.hash(i * 5.9) * (h - 28);
      const tw = 0.4 + 0.6 * Math.sin(t * 1.1 + i * 1.7);
      U.circle(ctx, px - 100, py, 1.4, 'rgba(226,236,255,' + (a * tw * 0.5) + ')');
    }
  }
};
