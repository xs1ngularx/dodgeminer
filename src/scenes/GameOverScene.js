export default class GameOverScene extends Phaser.Scene {
    constructor() { super('GameOverScene'); }

    create() {
        this.add.rectangle(180, 400, 360, 800, 0x000000, 0.8);

        this.add.text(180, 200, 'WASTED', { fontSize: '48px', fill: '#f00' }).setOrigin(0.5);

        const retryBtn = this.add.text(180, 330, 'TRY AGAIN', { fontSize: '24px', fill: '#fff' })
            .setOrigin(0.5).setInteractive();

        const menuBtn = this.add.text(180, 470, 'MAIN MENU', { fontSize: '24px', fill: '#888' })
            .setOrigin(0.5).setInteractive();
        
        const shopBtn = this.add.text(180, 400, 'SHOP', { fontSize: '24px', fill: '#0ff' })
            .setOrigin(0.5).setInteractive();

        retryBtn.on('pointerdown', () => {
            this.scene.start('MineScene'); // Updated
        });

        menuBtn.on('pointerdown', () => {
            this.scene.start('MenuScene');
            this.scene.stop('MineScene'); // Updated
        });

        shopBtn.on('pointerdown', () => {
            this.scene.start('ShopScene');
            this.scene.stop('MineScene'); // Updated
        });
    }
}