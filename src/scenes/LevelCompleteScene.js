import { GameLevels } from '../data/levels.js';

export default class LevelCompleteScene extends Phaser.Scene {
    constructor() { super('LevelCompleteScene'); }

    init(data) {
        // Pass the level config here from MineScene when the player wins!
        // In MineScene: this.scene.launch('LevelCompleteScene', this.levelData);
        this.completedLevelId = data.id || 1; 
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(180, 400, 360, 800, 0x000000, 0.7);

        // Level Complete Text
        this.add.text(width / 2, height * 0.3, 'Level Complete', { fontSize: '40px', color: '#fff' }).setOrigin(0.5);

        // 1. Progress Logic
        let unlockedLevel = parseInt(localStorage.getItem('dodgeMiner_unlocked')) || 1;
        let nextLevelId = this.completedLevelId + 1;

        // Check if a next level actually exists in our data
        const nextLevelExists = GameLevels.some(l => l.id === nextLevelId);

        if (this.completedLevelId >= unlockedLevel && nextLevelExists) {
            // They beat their highest level! Unlock the next one.
            localStorage.setItem('dodgeMiner_unlocked', nextLevelId);
            
            // Auto-select the newly unlocked level
            localStorage.setItem('dodgeMiner_selected', nextLevelId);
        }

        // Continue Button
        const contBtn = this.add.text(this.cameras.main.width / 2, 400, 'CONTINUE', { fontSize: '28px' }).setOrigin(0.5).setInteractive();

        // Menu Button
        const menuBtn = this.add.text(180, 500, 'MAIN MENU', { fontSize: '24px', fill: '#f00' }).setOrigin(0.5).setInteractive();

        // --- Interactions ---
        
        contBtn.on('pointerdown', () => {
            this.scene.stop('MineScene'); 
        
            if (nextLevelExists) {
                // Find the specific config for the NEXT level
                const nextLevelConfig = GameLevels.find(l => l.id === nextLevelId);
                
                // Update the selected level in storage so the menu stays in sync
                localStorage.setItem('dodgeMiner_selected', nextLevelId);
                
                // Start the next level
                this.scene.start('MineScene', nextLevelConfig);
            } else {
                // If they just beat the final level in the game, send them to the menu
                this.scene.start('MenuScene');
            }
        });
        
        menuBtn.on('pointerdown', () => {
            this.scene.stop('MineScene'); // Updated
            this.scene.start('MenuScene');
        });
    }
}