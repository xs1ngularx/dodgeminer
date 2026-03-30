import { GameLevels } from '../data/levels.js';
import UIManager from '../managers/UIManager.js';

export default class LevelsScene extends Phaser.Scene {
    constructor() { super('LevelsScene'); }

    init(data) {
        this.previousScene = data.from || 'MenuScene'; 
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.image(170, 320, 'menu-bg').setScale(0.52);

        // Call the TopBar UI
        //this.uiManager = new UIManager(this);

        // Fetch current progress
        const unlockedLevel = parseInt(localStorage.getItem('dodgeMiner_unlocked')) || 1;

        this.add.sprite(width / 2, 120, 'ui-levels-button')
        .setScale(0.5);

        // Grid Settings
        const cols = 3;
        const spacingX = 100;
        const spacingY = 100;
        const startX = width / 2 - spacingX; // Centers a 3-column grid
        const startY = 228;

        console.log(unlockedLevel);

        // Generate the Grid
        GameLevels.forEach((level, index) => {
            const x = startX + (index % cols) * spacingX;
            const y = startY + Math.floor(index / cols) * spacingY;

            const isUnlocked = level.id <= unlockedLevel;

            // Button Box
            const btnColor = isUnlocked ? 0x4CAF50 : 0x555555;
            const btn = this.add.rectangle(x, y, 70, 70, btnColor);
            
            // Level Number
            this.add.text(x, y, level.id, { fontSize: '28px', color: isUnlocked ? '#fff' : '#888' }).setOrigin(0.5);

            if (isUnlocked) {
                btn.setInteractive();
                btn.on('pointerdown', () => {
                    // Save the selection and return to menu
                    localStorage.setItem('dodgeMiner_selected', level.id);
                    this.scene.start('MenuScene');
                });
            } else {
                // Optional: Add a little lock icon text
                this.add.text(x, y + 20, '🔒', { fontSize: '14px' }).setOrigin(0.5);
            }
        });

        // Back Button

        const backBtn = this.add.sprite(0, 0, 'ui-back-button')
        .setOrigin(0).setScale(0.15).setInteractive();

        backBtn.on('pointerdown', () => {
            this.scene.start(this.previousScene);
        });
    }

    

    
}