/* the two of us */

function Character(opts) {
  this.x = 0;
  this.y = 0;
  this.body = opts.body;
  this.hair = opts.hair;
  this.skin = opts.skin;
  this.isHer = !!opts.isHer;
  this.facing = 1;
  this.phase = 0;
  this.moving = false;
  this.jumpT = -1;
}

Character.JUMP_DUR = 0.64;
Character.JUMP_H = 50;

Character.prototype.jump = function () {
  if (this.jumpT < 0) this.jumpT = 0;
};

Character.prototype.airborne = function () { return this.jumpT >= 0; };

Character.prototype.jumpY = function () {
  if (this.jumpT < 0) return 0;
  return Math.sin(Math.PI * U.clamp(this.jumpT / Character.JUMP_DUR, 0, 1)) * Character.JUMP_H;
};

Character.prototype.update = function (dt, speed) {
  if (this.jumpT >= 0) {
    this.jumpT += dt;
    if (this.jumpT > Character.JUMP_DUR) this.jumpT = -1;
  }
  if (this.moving) {
    this.phase += dt * U.clamp(Math.abs(speed) / 120, 0.4, 2.2) * 7;
  } else {
    this.phase += dt * 1.4;
  }
};

/* x, y = screen position of the feet. opts.hold = -1|1 reaches a hand that way. */
Character.prototype.draw = function (ctx, x, y, t, opts) {
  const hold = (opts && opts.hold) || 0;
  const swing = this.moving ? Math.sin(this.phase) * 0.52 : 0;
  const bob = this.moving ? Math.abs(Math.sin(this.phase)) * 1.6 : Math.sin(t * 2) * 1.1;
  const f = this.facing;

  const feetY = y;
  const hipY = feetY - 26 - bob;
  const shoulderY = feetY - 54 - bob;
  const headY = feetY - 68 - bob;

  const g = this.garment || 'casual';
  const corp = g === 'corporate';
  const shirt = corp ? [246, 247, 250] : this.body;
  const bodyCol = U.rgb(shirt);
  const hairCol = U.rgb(this.hair);
  const skinCol = U.rgb(this.skin);
  const legCol = corp ? U.rgb([48, 52, 72])
    : g === 'kurta' ? U.rgb([234, 231, 223])
    : g === 'coat' ? U.rgb([54, 56, 72])
    : g === 'frock' ? U.rgb(this.skin)
    : U.rgb(U.mix(this.body, [12, 14, 26], 0.45));

  ctx.save();

  /* contact shadow */
  ctx.beginPath();
  ctx.ellipse(x, feetY + 3, 15, 4, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(8,10,22,0.25)';
  ctx.fill();

  /* legs */
  const legLen = 27;
  const air = this.jumpT >= 0;
  const legAngles = air ? [0.38, 0.13] : [swing, -swing];
  legAngles.forEach((sw) => {
    const fx = x + Math.sin(sw) * legLen * f;
    const fy = hipY + Math.cos(sw) * legLen;
    U.line(ctx, x, hipY, fx, fy, legCol, 6.5);
  });

  /* arms */
  const armLen = 21;
  const armCol = corp
    ? 'rgba(240,241,246,0.96)'
    : U.rgb(U.mix(this.body, [255, 255, 255], 0.12));
  const kiss = (opts && opts.kiss) || 0;
  const busyArm = hold || kiss > 0;
  const swings = air ? [-0.62, -0.46]
    : busyArm ? [-swing * 0.85]
    : [-swing * 0.85, swing * 0.85];
  swings.forEach((sw) => {
    const ax = x + Math.sin(sw) * armLen * f;
    const ay = shoulderY + Math.cos(sw) * armLen;
    U.line(ctx, x, shoulderY, ax, ay, armCol, 5.5);
  });

  /* torso */
  if (g === 'kurta') {
    ctx.beginPath();
    ctx.moveTo(x - 10, shoulderY - 3);
    ctx.lineTo(x + 10, shoulderY - 3);
    ctx.lineTo(x + 13, hipY + 13);
    ctx.lineTo(x - 13, hipY + 13);
    ctx.closePath();
    ctx.fillStyle = bodyCol;
    ctx.fill();
    /* mandarin collar and placket */
    U.rr(ctx, x - 5, shoulderY - 6, 10, 6, 2, U.rgb(U.mix(shirt, [0, 0, 0], 0.2)));
    U.line(ctx, x + 2, shoulderY + 1, x + 2, shoulderY + 19,
      U.rgb(U.mix(shirt, [0, 0, 0], 0.24)), 1.4);
  } else if (g === 'coat') {
    ctx.beginPath();
    ctx.moveTo(x - 11, shoulderY - 3);
    ctx.lineTo(x + 11, shoulderY - 3);
    ctx.lineTo(x + 12, hipY + 5);
    ctx.lineTo(x - 12, hipY + 5);
    ctx.closePath();
    ctx.fillStyle = bodyCol;
    ctx.fill();
    /* lapels and a belt */
    const trim = U.rgb(U.mix(shirt, [0, 0, 0], 0.26));
    U.poly(ctx, [[x - 8, shoulderY - 3], [x, shoulderY + 10], [x + 8, shoulderY - 3]], trim);
    U.rr(ctx, x - 12, shoulderY + 20, 24, 4, 2, trim);
  } else if (g === 'frock') {
    U.rr(ctx, x - 9, shoulderY - 3, 18, 19, 7, bodyCol);
    ctx.beginPath();
    ctx.moveTo(x - 9, shoulderY + 13);
    ctx.lineTo(x + 9, shoulderY + 13);
    ctx.lineTo(x + 18, hipY + 11);
    ctx.lineTo(x - 18, hipY + 11);
    ctx.closePath();
    ctx.fillStyle = bodyCol;
    ctx.fill();
    U.rr(ctx, x - 10, shoulderY + 10, 20, 4, 2, U.rgb(U.mix(shirt, [0, 0, 0], 0.16)));
  } else {
    U.rr(ctx, x - 10, shoulderY - 3, 20, 32, 8, bodyCol);
  }

  /* office shirt gets a collar and a tie */
  if (corp) {
    U.poly(ctx, [[x - 7, shoulderY - 3], [x, shoulderY + 6], [x + 7, shoulderY - 3]],
      'rgba(226,229,238,0.95)');
    U.poly(ctx, [[x - 3, shoulderY + 3], [x + 3, shoulderY + 3], [x + 2, shoulderY + 8], [x - 2, shoulderY + 8]],
      'rgba(150,44,52,0.97)');
    U.poly(ctx, [[x - 4, shoulderY + 8], [x + 4, shoulderY + 8], [x + 2.5, shoulderY + 25], [x - 2.5, shoulderY + 25]],
      'rgba(168,52,58,0.97)');
  }

  /* the whole head leans when she comes in close */
  const lean = (opts && opts.lean) || 0;
  ctx.save();
  ctx.translate(lean, lean === 0 ? 0 : -1);

  /* her hair falls behind the head */
  if (this.isHer) {
    U.rr(ctx, x - 11 - f * 2, headY - 6, 22, 30, 10, hairCol);
  }

  U.circle(ctx, x, headY, 11, skinCol);

  /* hair on top */
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, headY, 11.5, Math.PI * (this.isHer ? 0.95 : 1.05), Math.PI * (this.isHer ? 2.05 : 1.95));
  ctx.closePath();
  ctx.fillStyle = hairCol;
  ctx.fill();
  ctx.restore();

  if (this.isHer) {
    /* a small bun, so she reads instantly at a glance */
    U.circle(ctx, x - f * 11, headY - 6, 5.5, hairCol);
  }
  ctx.restore();

  /* the arm that reaches across, drawn in front so the join is visible */
  let hand = null;
  if (hold) {
    hand = { x: x + hold * 17, y: shoulderY + 18 };
    U.line(ctx, x, shoulderY + 1, hand.x, hand.y, armCol, 5.5);
  } else if (kiss > 0) {
    const d = (opts && opts.toward) || f;
    hand = {
      x: U.lerp(x + d * 27, x + d * 7, kiss),
      y: U.lerp(shoulderY + 11, headY + 5, kiss)
    };
    U.line(ctx, x, shoulderY + 1, hand.x, hand.y, armCol, 5.5);
    U.circle(ctx, hand.x, hand.y, 3.4, skinCol);
  }

  ctx.restore();
  return hand;
};
