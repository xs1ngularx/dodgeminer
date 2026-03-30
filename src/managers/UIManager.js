export default class UIManager {
    constructor(scene) {
        this.scene = scene;
        const { width, height } = scene.scale;

        this.uiCam = scene.cameras.add(0, 0, width, height);
        this.uiContainer = scene.add.container(0, 0);
        scene.cameras.main.ignore(this.uiContainer);

        this.buildUI(width);
        this.setupEvents();
    }

    buildUI(screenWidth) {
        this.goldText = this.scene.add.text(90, 25, this.scene.registry.get('gold'), { 
            fontSize: '14px', fill: '#ffd700', fontStyle: 'bold' 
        }).setOrigin(0.5);
        
        this.uiBar = this.scene.add.rectangle(0, 0, screenWidth, 50, 0x654321).setOrigin(0, 0).setScale(1);
        this.uiGear = this.scene.add.sprite(25, 25, 'ui-gear-icon')
        .setInteractive().setScale(0.12);
        this.uiGear.on('pointerdown', () => this.pauseGame());

        this.barBg = this.scene.add.rectangle(screenWidth - 130, 25, 100, 15, 0x222222).setOrigin(0, 0.5);
        this.barFill = this.scene.add.rectangle(screenWidth - 130, 25, 100, 15, 0x00ff00).setOrigin(0, 0.5);

        this.uiContainer.add([this.uiBar, this.uiGear, this.barBg, this.barFill, this.goldText]);
        this.uiContainer.setDepth(100);
    }

    setupEvents() {
        const handleGoldChanged = (goldAmount) => {
            this.goldText.setText('Gold: ' + goldAmount);
        };
        
        const handleEnergyChanged = (energyPct) => {
            this.scene.tweens.add({
                targets: this.barFill,
                width: 100 * energyPct,
                duration: 200,
                ease: 'Power2'
            });

            if (energyPct > 0.6) this.barFill.fillColor = 0x00ff00;
            else if (energyPct > 0.3) this.barFill.fillColor = 0xffff00;
            else this.barFill.fillColor = 0xff0000;
        };

        this.scene.events.on('gold_changed', handleGoldChanged);
        this.scene.events.on('energy_changed', handleEnergyChanged);

        this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.scene.events.off('gold_changed', handleGoldChanged);
            this.scene.events.off('energy_changed', handleEnergyChanged);
        });
    }

    pauseGame() {
        this.scene.tweens.add({
            targets: this.uiGear,
            scale: 0.1,
            duration: 50,
            yoyo: true,
            onComplete: () => {
                this.scene.scene.pause();
                this.scene.scene.launch('PauseScene');
            }
        });
    }

    getElementsToIgnore() { return [this.uiContainer]; }
}