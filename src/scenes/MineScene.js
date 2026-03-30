import Player from '../entities/Player.js';
import UIManager from '../managers/UIManager.js';

export default class MineScene extends Phaser.Scene {
    constructor() {
        super('MineScene');
        this.lanes = [60, 180, 300]; // Matches the Player.js lanes
    }

    init(data) {
        this.levelData = data; 
        // data will look like: { patterns: [...], speed: 300, bg: 'dirt-bg', goal: 10000 }
    }
    
    create() {
        const { width, height } = this.cameras.main;

        // 1. Scrolling Background
        this.bg = this.add.tileSprite(0, 0, width, height, this.levelData.bg).setOrigin(0);

        // 1. Create a Graphics object to draw our tunnel
        this.tunnelGraphics = this.add.graphics();
        this.tunnelGraphics.setDepth(1); // Above background, below player/obstacles

        // 2. Array to store the exact coordinates of our dug path
        this.pathPoints = [];

        // 2. Object Pools (Instead of Tilemap)
        this.ores = this.physics.add.group();
        this.mines = this.physics.add.group();

        // 3. Player (Locked at y: 150 near the top)
        this.player = new Player(this, this.lanes[1], 150);
        this.uiManager = new UIManager(this);
        
        // 4. Game Speed & Spawner Variables
        this.scrollSpeed = this.levelData.speed || 300; // Pixels per second
        this.nextSpawnY = height; // Start spawning just below the screen
        this.distanceTraveled = 0;
        this.levelLength = this.levelData.goal || 8000; // Win condition

        // 5. Collisions
        this.physics.add.overlap(this.player, this.ores, this.collectOre, null, this);
        this.physics.add.overlap(this.player, this.mines, this.hitMine, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.setupPointerInput(width);

        this.events.once('player_died', () => {
            this.time.delayedCall(300, () => {
                this.scene.pause();
                this.scene.launch('GameOverScene');
            });
        });
    }

    spawnPattern() {
        // 3. Use the specific patterns for this level
        const patterns = this.levelData.patterns;
        const pattern = patterns[Math.floor(Math.random() * patterns.length)];
        
        pattern.items.forEach(data => {
            const x = this.lanes[data.lane];
            const y = this.cameras.main.height + data.y; 
            
            if (data.type === 'ore') {
                const ore = this.add.sprite(x, y, 'game-ore').setOrigin(0.5).setScale(0.2);
                ore.setDepth(5);
                this.physics.add.existing(ore);
                this.ores.add(ore);
            } else if (data.type === 'mine') {
                const mine = this.add.sprite(x, y, 'game-obstacle').setOrigin(0.5).setScale(0.1);
                mine.setDepth(5);
                this.physics.add.existing(mine);
                this.mines.add(mine);
            }
        });

        // Set the tracker so we know when to spawn the next chunk
        this.nextSpawnY += pattern.height;
    }

    collectOre(player, ore) {
        ore.destroy(); // Remove it from the screen
        let currentGold = this.registry.get('gold') + 1;
        this.registry.set('gold', currentGold);

        localStorage.setItem('dodgeMiner_gold', currentGold);

        this.events.emit('gold_changed', currentGold);
    }

    hitMine(player, mine) {
        mine.destroy(); // Blow up the mine
        player.takeDamage();
    }
    
    setupPointerInput(screenWidth) {
        this.input.on('pointerdown', (pointer) => {
            if (pointer.y > 50) {
                const direction = pointer.x < (screenWidth / 2) ? -1 : 1;
                this.player.shiftLane(direction);
            }
        });
    }

    update(time, delta) {
        if (this.player.isDead) return;

        // Win Condition
        if (this.distanceTraveled >= this.levelLength){
            console.log("Maquina");
            this.scene.pause();
            this.scene.launch('LevelCompleteScene', this.levelData);
        }

        this.player.update(delta);

        // Calculate how far things should move this frame
        const moveDistance = this.scrollSpeed * (delta / 1000);

        // 1. Scroll the background texture UP (which makes it look like we are going down)
        this.bg.tilePositionY += moveDistance;
        this.distanceTraveled += moveDistance;

        // 1. Move all existing path points UP with the world
        for (let i = 0; i < this.pathPoints.length; i++) {
            this.pathPoints[i].y -= moveDistance;
        }

        // 2. Remove points that have scrolled off the top of the screen
        // This keeps our array tiny and performant (usually under 50 points)
        this.pathPoints = this.pathPoints.filter(point => point.y > -100);

        // 3. Record the player's current position as the newest point
        // We add an offset to Y so the tunnel starts slightly behind the drill bit
        this.pathPoints.push({ 
            x: this.lanes[this.player.currentLane], 
            y: this.player.y + 35 
        });

        // 4. Draw the continuous tunnel line
        this.tunnelGraphics.clear(); // Wipe the previous frame
        
        // Set line style: Width (e.g., 60px), Color (Hex), Alpha (Opacity)
        // Choose a very dark brown hex code for the tunnel interior
        this.tunnelGraphics.lineStyle(60, 0x1a0f04, 1); 
        
        this.tunnelGraphics.beginPath();
        
        // Start drawing from the oldest point at the top of the screen
        if (this.pathPoints.length > 0) {
            this.tunnelGraphics.moveTo(this.pathPoints[0].x, this.pathPoints[0].y);
            
            // Connect the dots all the way down to the player
            for (let i = 1; i < this.pathPoints.length; i++) {
                this.tunnelGraphics.lineTo(this.pathPoints[i].x, this.pathPoints[i].y);
            }
        }
        
        this.tunnelGraphics.strokePath(); // Render the line
        
        // 2. Move all spawned obstacles UP toward the player
        this.ores.children.iterate(ore => {
            if (ore) {
                ore.y -= moveDistance;
                if (ore.y < -50) ore.destroy(); // Cleanup once it passes the top of the screen
            }
        });

        this.mines.children.iterate(mine => {
            if (mine) {
                mine.y -= moveDistance;
                if (mine.y < -50) mine.destroy(); // Cleanup
            }
        });
    
        // 3. Spawner Logic
        // As the "camera" theoretically moves down, the target spawn Y gets closer
        this.nextSpawnY -= moveDistance;
        if (this.nextSpawnY <= this.cameras.main.height) {
            this.spawnPattern();
        }

        // 4. Input
        if (!this.player.isMoving) {
            if (this.cursors.left.isDown) this.player.shiftLane(-1);
            else if (this.cursors.right.isDown) this.player.shiftLane(1);
        }

        
    }
}