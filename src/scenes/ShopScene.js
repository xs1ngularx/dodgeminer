import UIManager from '../managers/UIManager.js';

export default class ShopScene extends Phaser.Scene {
    constructor() { super('ShopScene'); }

    init(data) {
        this.previousScene = data.from || 'MenuScene'; 
    }

    create() {
        const { width, height } = this.scale;

        // Background
        this.add.image(170, 320, 'menu-bg').setScale(0.52);

        // Call the TopBar UI
        //this.uiManager = new UIManager(this);
        
        // Title
        this.add.sprite(width / 2, 120, 'ui-shop-button')
        .setScale(0.5);

        // Gold Meter
        /*this.goldText = this.add.text(width / 2, 130, 'Gold: ' + this.getSavedData('dodgeMiner_gold', 0), { 
            fontSize: '24px', fill: '#ffd700' 
        }).setOrigin(0.5);*/

        // --- THE UPGRADE CATALOG ---
        // To add a new upgrade, just add another object to this array. The code handles the rest!
        const shopItems = [
            {
                id: 'energy',
                name: 'Max Energy',
                regKeyVal: 'dodgeMiner_maxEnergy',
                regKeyCost: 'dodgeMiner_energyCost',
                defaultVal: 50, // Starting energy if no save exists
                defaultCost: 15, // Starting cost
                valMultiplier: 1.05,
                costMultiplier: 1.04
            }
            // Future Example: 
            // { id: 'drill', name: 'Drill Speed', regKeyVal: 'dodgeMiner_drillSpeed', ... }
        ];

        // Loop through the catalog and generate the UI buttons dynamically
        shopItems.forEach((item, index) => {
            const yPosition = 250 + (index * 100); // Spaces them out automatically
            this.createUpgradeCard(width / 2, yPosition, item);
        });

        // --- NAVIGATION & ADMIN ---

        const backBtn = this.add.sprite(0, 0, 'ui-back-button')
        .setOrigin(0).setScale(0.15).setInteractive();
        
        const resetBtn = this.add.text(width / 2, height - 40, 'WIPE ALL PROGRESS', { 
            fontSize: '72px',
            //fill: '#555',
            color: '#ff0000',
            fontStyle: 'bold',
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }).setOrigin(0.5).setScale(0.2).setInteractive();

        // --- Button Interactions ---

        backBtn.on('pointerdown', () => {
            this.scene.start(this.previousScene);
        });

        resetBtn.on('pointerdown', () => {
            if (confirm("Are you sure? This will delete all gold and upgrades!")) {
                this.resetGameData();
            }
        });
    }

    // --- HELPER METHODS ---

    // Safely fetch data from LocalStorage with a fallback default
    getSavedData(key, defaultValue) {
        let val = localStorage.getItem(key);
        return val ? parseFloat(val) : defaultValue;
    }

    resetGameData() {
        Object.keys(localStorage).forEach(key => {
            if (key.startsWith('dodgeMiner_')) {
                localStorage.removeItem(key);
            }
        });
        window.location.reload(); 
    }

    createUpgradeCard(x, y, config) {
        let sfxEnabled = localStorage.getItem('dodgeMiner_sfx') !== 'false';
        
        let currentVal = this.getSavedData(config.regKeyVal, config.defaultVal);
        let currentCost = this.getSavedData(config.regKeyCost, config.defaultCost);
        let playerGold = this.getSavedData('dodgeMiner_gold', 0);
        let canAfford = playerGold >= currentCost;

        this.add.sprite(x, y, 'ui-upgrade-card')
        .setScale(0.7);
        const box = this.add.sprite(x + 78, y + 34, 'ui-back-button')
        .setScale(0.15).setInteractive();
        //if (canAfford) box.setStrokeStyle(2, 0x00ff00);

        // Keep references to the text objects so we can edit them dynamically
        const titleText = this.add.text(x, y - 15, `${config.name}\n(Current: ${currentVal.toFixed(0)})`, { 
            fontSize: '16px', fill: '#fff', align: 'center' 
        }).setOrigin(0.5);
        
        const costText = this.add.text(x, y + 20, `Cost: ${currentCost} Gold`, { 
            fontSize: '18px', fill: canAfford ? '#00ff00' : '#ff0000' 
        }).setOrigin(0.5);

        box.on('pointerdown', () => {
            playerGold = this.getSavedData('dodgeMiner_gold', 0); // Re-check gold at the moment of click

            if (playerGold >= currentCost) {
                // 1. Math
                playerGold -= currentCost;
                currentVal *= config.valMultiplier;
                currentCost = Math.ceil(currentCost * config.costMultiplier);

                // 2. Save to LocalStorage immediately
                localStorage.setItem('dodgeMiner_gold', playerGold);
                localStorage.setItem(config.regKeyVal, currentVal);
                localStorage.setItem(config.regKeyCost, currentCost);
                
                // 3. Update Registry so the game uses the new values right away
                this.registry.set('gold', playerGold);
                this.registry.set(config.regKeyVal.replace('dodgeMiner_', ''), currentVal);

                // 4. Update UI Text visually without reloading the scene!
                this.goldText.setText('Gold: ' + playerGold);
                titleText.setText(`${config.name}\n(Current: ${currentVal.toFixed(0)})`);
                costText.setText(`Cost: ${currentCost} Gold`);
                
                // 5. Update Box Color if they can't afford the NEXT upgrade
                if (playerGold < currentCost) {
                    box.setStrokeStyle(0); // Remove green border
                    costText.setColor('#ff0000'); // Turn text red
                }

                if (sfxEnabled) this.sound.play('buy'); // Changed to your success sound
                
            } else {
                if (sfxEnabled) this.sound.play('deny-purchase');
                this.cameras.main.shake(100, 0.01);
            }
        });
    }
}