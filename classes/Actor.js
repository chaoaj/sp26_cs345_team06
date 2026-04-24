class Actor extends Entity {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.facingLeft = false;
    this.maxHealth = 3;
    this.health = this.maxHealth;
  }

  update() {
    this.applyPhysics();
    this.move();
  }

  takeDamage(amount = 1) {
    this.health -= amount;
    if (this.health <= 0) {
      this.die();
    }
  }

  die() {}
  draw() {}
}