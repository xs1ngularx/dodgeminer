export default class PreloadScene extends Phaser.Scene {
    constructor() { super('PreloadScene'); }
    
    preload() {
        this.load.image('dirt-bg', 'assets/dirt-bg.png');
        this.load.spritesheet('miner', 'assets/miner.png', { frameWidth: 512, frameHeight: 512 });
        this.load.image('ui-gear-icon', 'assets/ui-gear-icon.png');
        this.load.image('game-ore', '/assets/game-ore.png');
        this.load.image('game-obstacle', '/assets/game-obstacle.png');
        this.load.image('menu-bg', '/assets/menu-bg.png');
        this.load.image('ui-game-title', '/assets/ui-game-title.png');
        this.load.image('ui-play-button', '/assets/ui-play-button.png');
        this.load.image('ui-levels-button', '/assets/ui-levels-button.png');
        this.load.image('ui-shop-button', '/assets/ui-shop-button.png');
        this.load.image('ui-back-button', '/assets/ui-back-button.png');
        this.load.image('ui-upgrade-card', '/assets/ui-upgrade-card.png');

        // Audio Assets
        this.load.audio('deny-purchase', '/assets/deny-purchase.mp3');
    }
    
    create() {
        const defaultStats = { gold: 0, maxEnergy: 50, energyCost: 5 };
        
        for (const [key, defaultValue] of Object.entries(defaultStats)) {
            const savedValue = localStorage.getItem('dodgeMiner_' + key);
            if (savedValue !== null) {
                this.registry.set(key, parseInt(savedValue, 10));
            } else {
                this.registry.set(key, defaultValue);
            }
        }

        this.registry.events.on('changedata', (parent, key, data) => {
            localStorage.setItem('dodgeMiner_' + key, data.toString());
        });

        this.anims.create({
            key: 'drill',
            frames: this.anims.generateFrameNumbers('miner', { start: 0, end: 1 }),
            frameRate: 3, repeat: -1
        });
        this.anims.create({
            key: 'drillLeft',
            frames: this.anims.generateFrameNumbers('miner', { start: 4, end: 4 }),
            frameRate: 3, repeat: -1
        });
        this.anims.create({
            key: 'drillRight',
            frames: this.anims.generateFrameNumbers('miner', { start: 5, end: 5 }),
            frameRate: 3, repeat: -1
        });
        
        this.scene.start('MenuScene');
    }
}
