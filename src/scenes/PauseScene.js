export default class PauseScene extends Phaser.Scene {
    constructor() { super('PauseScene'); }

    create() {
        this.add.rectangle(180, 400, 360, 800, 0x000000, 0.7);

        const resumeBtn = this.add.text(180, 280, 'RESUME', { fontSize: '24px', fill: '#fff' }).setOrigin(0.5).setInteractive();
        const menuBtn = this.add.text(180, 360, 'MAIN MENU', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5).setInteractive();

        resumeBtn.on('pointerdown', () => {
            this.scene.resume('MineScene'); // Updated
            this.scene.stop();
        });

        menuBtn.on('pointerdown', () => {
            this.scene.stop('MineScene'); // Updated
            this.scene.start('MenuScene');
        });
    }
}