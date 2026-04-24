class SpikeTrap extends Trap {
  constructor(x, y, w, h, damage = 1, spikeCount = 5) {
    super(x, y, w, h, damage);
    this.spikeCount = spikeCount;
  }

  draw() {
    fill(180, 180, 180);
    noStroke();
    image(spikeTrap, this.x, this.y, this.w, this.h);
  }
}
