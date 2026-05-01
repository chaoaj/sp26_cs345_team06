
// Laser puzzle system — three cooperating classes:
//
// Laser(x, y, direction, color)
//   Emits a beam from (x, y) in a given direction.
//   Each frame call: laser.update(mirrors, collectors, blockers)
//   Then call:       laser.draw()
//   direction: "right" | "left" | "up" | "down"
//
// LaserCollector(x, y, w, h, callback, releaseCallback)
//   Target that fires callback when a laser beam hits it.
//   Works the same as Button — callback on activate, releaseCallback on deactivate.
//   Call: collector.draw()
//
// LaserMirror(x, y, size, angle)
//   Reflects the beam. angle: 45 or -45 (degrees, mirrors the beam direction).
//   Call: mirror.draw()
//
// Typical usage in sketch.js:
//   const collector = new LaserCollector(800, height-60, 30, 30, () => openDoor());
//   const mirror    = new LaserMirror(600, height-120, 24, 45);
//   const laser     = new Laser(400, height-120, "right", color(255,50,50));
//   // in draw loop:
//   laser.update([mirror], [collector], platforms);
//   laser.draw();
//   collector.draw();
//   mirror.draw();

// ─── Laser ────────────────────────────────────────────────────────────────────

class Laser {
  constructor(x, y, direction = "right", beamColor = null, maxBounces = 4, maxLength = 2000) {
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.beamColor = beamColor || color(255, 50, 50);
    this.maxBounces = maxBounces;
    this.maxLength = maxLength;

    // Computed each frame by update()
    this.segments = [];
  }

  // Call once per frame before draw().
  // mirrors: array of LaserMirror, collectors: array of LaserCollector,
  // blockers: array of AABB objects with x/y/w/h that stop the beam.
  update(mirrors = [], collectors = [], blockers = []) {
    this.segments = [];

    // Mark all collectors as not hit this frame
    for (const c of collectors) {
      c._hitThisFrame = false;
    }

    let cx = this.x;
    let cy = this.y;
    let dir = this.direction;
    let remaining = this.maxLength;
    let lastReflectedMirror = null;

    for (let bounce = 0; bounce <= this.maxBounces; bounce++) {
      const { dx, dy } = this._dirVec(dir);

      // Find the closest mirror, collector, or blocker along this ray
      let closest = null;
      let closestDist = remaining;
      let closestType = null;

      for (const mirror of mirrors) {
        if (mirror === lastReflectedMirror) {
          continue;
        }

        const d = this._rayBoxIntersect(cx, cy, dx, dy, mirror.x, mirror.y, mirror.size, mirror.size);
        if (d !== null && d < closestDist) {
          closestDist = d;
          closest = mirror;
          closestType = "mirror";
        }
      }

      for (const collector of collectors) {
        const d = this._rayBoxIntersect(cx, cy, dx, dy, collector.x, collector.y, collector.w, collector.h);
        if (d !== null && d < closestDist) {
          closestDist = d;
          closest = collector;
          closestType = "collector";
        }
      }

      for (const blocker of blockers) {
        if (!blocker || typeof blocker.w !== "number" || typeof blocker.h !== "number") {
          continue;
        }

        const d = this._rayBoxIntersect(cx, cy, dx, dy, blocker.x, blocker.y, blocker.w, blocker.h);
        if (d !== null && d < closestDist) {
          closestDist = d;
          closest = blocker;
          closestType = "blocker";
        }
      }

      const ex = cx + dx * closestDist;
      const ey = cy + dy * closestDist;
      this.segments.push({ x1: cx, y1: cy, x2: ex, y2: ey });
      remaining -= closestDist;

      if (closestType === "collector") {
        closest._hitThisFrame = true;
        break;
      }

      if (closestType === "blocker") {
        break;
      }

      if (closestType === "mirror") {
        dir = closest.reflect(dir);
        cx = closest.x;
        cy = closest.y;
        lastReflectedMirror = closest;
      } else {
        lastReflectedMirror = null;
        break;
      }
    }

    // Fire callbacks based on hit state changes
    for (const c of collectors) {
      const wasHit = c.isHit;
      c.isHit = c._hitThisFrame;

      if (c.isHit && !wasHit && c.callback) {
        c.callback();
      }
      if (!c.isHit && wasHit && c.releaseCallback) {
        c.releaseCallback();
      }
    }
  }

  draw() {
    push();
    for (const seg of this.segments) {
      // Outer glow
      stroke(red(this.beamColor), green(this.beamColor), blue(this.beamColor), 60);
      strokeWeight(6);
      line(seg.x1, seg.y1, seg.x2, seg.y2);
      // Core beam
      stroke(this.beamColor);
      strokeWeight(2);
      line(seg.x1, seg.y1, seg.x2, seg.y2);
    }

    // Emitter body
    noStroke();
    fill(60);
    rectMode(CENTER);
    rect(this.x, this.y, 16, 16, 3);
    fill(this.beamColor);
    circle(this.x, this.y, 8);
    pop();
  }

  _dirVec(dir) {
    switch (dir) {
      case "right": return { dx: 1,  dy: 0  };
      case "left":  return { dx: -1, dy: 0  };
      case "up":    return { dx: 0,  dy: -1 };
      case "down":  return { dx: 0,  dy: 1  };
      default:      return { dx: 1,  dy: 0  };
    }
  }

  // Returns the distance along the ray (dx,dy) from (rx,ry) to the AABB
  // centred at (bx,by) with size (bw,bh), or null if no intersection.
  _rayBoxIntersect(rx, ry, dx, dy, bx, by, bw, bh) {
    const halfW = bw / 2;
    const halfH = bh / 2;
    const left   = bx - halfW;
    const right  = bx + halfW;
    const top    = by - halfH;
    const bottom = by + halfH;

    let tmin = -Infinity;
    let tmax = Infinity;

    if (dx !== 0) {
      const t1 = (left  - rx) / dx;
      const t2 = (right - rx) / dx;
      tmin = Math.max(tmin, Math.min(t1, t2));
      tmax = Math.min(tmax, Math.max(t1, t2));
    } else {
      if (rx < left || rx > right) return null;
    }

    if (dy !== 0) {
      const t1 = (top    - ry) / dy;
      const t2 = (bottom - ry) / dy;
      tmin = Math.max(tmin, Math.min(t1, t2));
      tmax = Math.min(tmax, Math.max(t1, t2));
    } else {
      if (ry < top || ry > bottom) return null;
    }

    if (tmax < 0 || tmin > tmax) return null;
    const t = tmin >= 0 ? tmin : tmax;
    return t >= 0 ? t : null;
  }
}

// ─── LaserCollector ───────────────────────────────────────────────────────────

class LaserCollector {
  constructor(x, y, w = 30, h = 30, callback = null, releaseCallback = null) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.callback = callback;
    this.releaseCallback = releaseCallback;
    this.isHit = false;
    this._hitThisFrame = false;
  }

  draw() {
    push();
    rectMode(CENTER);
    noStroke();

    // Outer ring
    stroke(this.isHit ? color(255, 220, 80) : color(100, 100, 100));
    strokeWeight(2);
    noFill();
    ellipse(this.x, this.y, this.w + 6, this.h + 6);

    // Inner fill
    fill(this.isHit ? color(255, 200, 50) : color(50, 50, 50));
    noStroke();
    ellipse(this.x, this.y, this.w, this.h);
    pop();
  }
}

// ─── LaserMirror ──────────────────────────────────────────────────────────────

class LaserMirror {
  // angle: 45  → reflects right→up, up→right, left→down, down→left
  //        -45 → reflects right→down, down→right, left→up, up→left
  // Moveable: falls with gravity, lands on platforms, pushed by player/boxes.
  // Call update(platforms) each frame, then draw().
  // In Level.js pass it alongside boxes in updatePuzzleElements.
  constructor(x, y, size = 24, angle = 45) {
    this.x = x;
    this.y = y;
    this.size = size;
    // w/h aliases so Level collision helpers treat it the same as a Box
    this.w = size;
    this.h = size;
    this.angle = angle;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.gravity = 0.6;
    this.isOnGround = false;
  }

  update(platforms) {
    this.yVelocity += this.gravity;
    this.x += this.xVelocity;
    this.y += this.yVelocity;
    this.xVelocity = 0;
    this.isOnGround = false;

    for (const platform of platforms) {
      this._resolvePlatformCollision(platform);
    }
  }

  _resolvePlatformCollision(platform) {
    if (platform.isVisible === false) return;
    const platLeft   = platform.x - platform.w / 2;
    const platRight  = platform.x + platform.w / 2;
    const platTop    = platform.y - platform.h / 2;
    const platBottom = platform.y + platform.h / 2;
    const platformXVelocity = typeof platform.xVelocity === "number" ? platform.xVelocity : 0;
    const platformYVelocity = typeof platform.yVelocity === "number" ? platform.yVelocity : 0;
    const myLeft   = this.x - this.size / 2;
    const myRight  = this.x + this.size / 2;
    const myTop    = this.y - this.size / 2;
    const myBottom = this.y + this.size / 2;

    // No overlap — nothing to do
    if (myRight <= platLeft || myLeft >= platRight ||
        myBottom <= platTop || myTop >= platBottom) {
      return;
    }

    // Compute penetration depth on each axis
    const overlapLeft   = myRight  - platLeft;   // pushed from right side of platform
    const overlapRight  = platRight - myLeft;     // pushed from left side of platform
    const overlapTop    = myBottom - platTop;     // pushed from top of platform (landing)
    const overlapBottom = platBottom - myTop;     // pushed from bottom of platform (head bump)

    const minX = Math.min(overlapLeft, overlapRight);
    const minY = Math.min(overlapTop, overlapBottom);

    if (minY <= minX) {
      // Vertical resolution
      if (overlapTop <= overlapBottom) {
        // Landing on top
        this.y -= overlapTop;
        this.yVelocity = 0;
        this.isOnGround = true;
        this.x += platformXVelocity;
        this.y += platformYVelocity;
      } else {
        // Hitting the underside
        this.y += overlapBottom;
        this.yVelocity = 0;
      }
    } else {
      // Horizontal resolution
      if (overlapLeft <= overlapRight) {
        this.x -= overlapLeft;
        this.xVelocity = 0;
      } else {
        this.x += overlapRight;
        this.xVelocity = 0;
      }
    }
  }

  reflect(dir) {
    if (this.angle === 45) {
      const map = { right: "up", up: "right", left: "down", down: "left" };
      return map[dir] || dir;
    } else {
      const map = { right: "down", down: "right", left: "up", up: "left" };
      return map[dir] || dir;
    }
  }

  draw() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(70, 70, 80, 180);
    rect(this.x, this.y, this.size, this.size, 3);

    translate(this.x, this.y);
    rotate(radians(this.angle));
    stroke(180, 220, 255);
    strokeWeight(2);
    const half = this.size / 2 - 3;
    line(-half, 0, half, 0);
    noStroke();
    fill(100, 160, 220, 120);
    rect(0, 0, this.size - 6, 4, 2);
    pop();
  }

}
class StaticLaserMirror extends LaserMirror {
  constructor(x, y, size = 24, angle = 45) {
    super(x, y, size, angle);
    // Make it immovable
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.gravity = 0;
    this.isOnGround = true;
  }

  update(platforms) {
    // Do nothing: static, not affected by gravity or collisions
  }

  // Optionally override draw if you want a different appearance
  draw() {
    push();
    rectMode(CENTER);
    noStroke();
    fill(120, 120, 180, 200); // Slightly different color for static
    rect(this.x, this.y, this.size, this.size, 3);

    translate(this.x, this.y);
    rotate(radians(this.angle));
    stroke(220, 220, 255);
    strokeWeight(2);
    const half = this.size / 2 - 3;
    line(-half, 0, half, 0);
    noStroke();
    fill(160, 200, 255, 140);
    rect(0, 0, this.size - 6, 4, 2);
    pop();
  }
}
