import { GameLevels } from '../data/levels.js';
import UIManager from '../managers/UIManager.js';

export default class MenuScene extends Phaser.Scene {
    constructor() { super('MenuScene'); }

    preload() {
        
    }

    create() {
        const { width, height } = this.cameras.main;

        // 1. Load Save Data (Defaults to 1 if no save exists)
        let sfxEnabled = localStorage.getItem('dodgeMiner_sfx') !== 'false';

        this.unlockedLevel = parseInt(localStorage.getItem('dodgeMiner_unlocked')) || 1;
        
        this.selectedLevelId = parseInt(localStorage.getItem('dodgeMiner_selected')) || this.unlockedLevel;
        
        // Menu Background
        this.add.image(170, 320, 'menu-bg')
        .setScale(0.52);

        // Call the TopBar UI
        //this.uiManager = new UIManager(this);

        // Title
        let menuTitle = this.add.sprite(180, 170, 'ui-game-title').setOrigin(0.5).setScale(0.2);

        this.tweens.add({
            targets: menuTitle,
            scaleX: 0.225,
            scaleY: 0.225,
            duration: 4000,   // 1 second per motion
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Toggle Button
        const sfxText = this.add.text(10, 15, sfxEnabled ? '🔊' : '🔇', { 
            fontSize: '56px', 
            color: '#ffffff' 
        }).setOrigin(0).setScale(0.5).setInteractive();

        // Play Button
        const playBtn = this.add.sprite(180, 310, 'ui-play-button')
        .setInteractive().setScale(0.15);

        // Level Indicator
        let levelText = this.add.text(width / 2, height * 0.5 + 22, `Lvl ${this.selectedLevelId}`, {
            //fontFamily: 'Arial',
            fontSize: '120px',
            color: '#ffffff',
            fontStyle: "bold"
        }).setOrigin(0.5).setScale(0.2);

        this.tweens.add({
            targets: [playBtn],
            scaleX: 0.1675,
            scaleY: 0.1675,
            duration: 1000,   // 1 second per motion
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });

        // Levels Scene Button
        const levelsBtn = this.add.sprite(180, 470, 'ui-levels-button')
        .setInteractive().setScale(0.6);

        // Shop Scene Button
        const shopBtn = this.add.sprite(180, 554, 'ui-shop-button')
        .setInteractive().setScale(0.6);

        // --- Interactions ---
        sfxText.on('pointerdown', () => {
            sfxEnabled = !sfxEnabled; // Flip the boolean
            
            // Save the new state
            localStorage.setItem('dodgeMiner_sfx', sfxEnabled);
            
            // Update the text visual
            sfxText.setText(sfxEnabled ? '🔊' : '🔇');
            
            // Optional: Play a test sound immediately so the player knows it works
            if (sfxEnabled) {
                this.sound.play('deny-purchase'); 
            }
        });

        playBtn.on('pointerdown', () => {
            // Find the specific config for the selected level
            const levelConfig = GameLevels.find(l => l.id === this.selectedLevelId);
            this.tweens.add({
                targets: playBtn,
                scale: 0.13,
                duration: 50,
                yoyo: true,
                onComplete: () => {
                    
                    
                    this.scene.start('MineScene', levelConfig);
                }
            });
            
        });
        levelsBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: levelsBtn,
                scale: 0.56,
                duration: 80,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('LevelsScene', { from: 'MenuScene' })
                }
            });
        });
        shopBtn.on('pointerdown', () => {
            this.tweens.add({
                targets: shopBtn,
                scale: 0.56,
                duration: 80,
                yoyo: true,
                onComplete: () => {
                    this.scene.start('ShopScene', { from: 'MenuScene' })
                }
            });
        });
    }
}