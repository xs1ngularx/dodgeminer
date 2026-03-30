export default class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'miner');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setSize(100, 300); // Adjusted for your 100x100 sprite
        //this.body.setOffset(30, 20);
        this.setScale(0.2);
        this.setDepth(10);
        this.play('drill');

        this.maxEnergy = scene.registry.get('maxEnergy');
        this.energy = this.maxEnergy;
        this.drainRate = 4; 
        
        this.isMoving = false;
        this.isInvincible = false;
        this.isDead = false;

        // The exact X coordinates for our 3 lanes
        this.lanes = [60, 180, 300]; 
        this.currentLane = 1; // Start in the middle
    }

    update(delta) {
        if (this.isDead) return;
        this.energy -= this.drainRate * (delta / 1000);
        this.emitEnergyUpdate();
        if (this.energy <= 0) this.die();
    }

    shiftLane(direction) {
        if (this.isMoving || this.isDead) return;

        // Calculate new lane index (0, 1, or 2)
        const targetLane = this.currentLane + direction;
        
        // Prevent moving off screen
        if (targetLane < 0 || targetLane > 2) return;

        this.isMoving = true;
        this.currentLane = targetLane;
        this.play(direction === -1 ? 'drillLeft' : 'drillRight');

        this.scene.tweens.add({
            targets: this,
            x: this.lanes[this.currentLane],
            duration: 200,
            onComplete: () => { 
                this.isMoving = false;
                this.play('drill');
            }
        });
    }

    takeDamage() {
        if (this.isInvincible || this.isDead) return;
        this.energy = this.energy * 0.7; 
        this.isInvincible = true;
        
        this.emitEnergyUpdate();
        this.scene.cameras.main.shake(200, 0.02);

        this.scene.tweens.add({
            targets: this,
            alpha: 0.3, duration: 100, yoyo: true, repeat: 5,
            onComplete: () => {
                this.alpha = 1;
                this.isInvincible = false;
            }
        });

        if (this.energy <= 0) this.die();
    }

    emitEnergyUpdate() {
        const currentPct = Math.max(0, this.energy) / this.maxEnergy;
        this.scene.events.emit('energy_changed', currentPct);
    }

    die() {
        this.isDead = true;
        this.scene.events.emit('player_died');
    }
}