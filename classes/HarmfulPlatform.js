class HarmfulPlatform extends BrickPlatform {
    constructor(x, y, w, h, damage = 1) {
        super(x, y, w, h, lavaImage);
        this.damage = damage;
        this.isHarmful = true;
    }
}
