class SpikeTrap extends Trap {
  constructor(x, y, w, h, damage = 1, spikeCount = 5) {
    super(x, y, w, h, damage);
    this.spikeCount = spikeCount;
  }

  draw() {
    fill(180, 180, 180);
    noStroke();

    // const left = this.x - this.width / 2;
    // const top = this.y - this.height / 2;
    // const spikeWidth = this.width / this.spikeCount;

    // for (let i = 0; i < this.spikeCount; i++) {
    //   const x1 = left + i * spikeWidth;
    //   const x2 = x1 + spikeWidth / 2;
    //   const x3 = x1 + spikeWidth;

    //   triangle(x1, top + this.height, x2, top, x3, top + this.height);
    // }
    image(spikeTrap, this.x, this.y, this.width, this.height);
  }
}
