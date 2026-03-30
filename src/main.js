import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import MineScene from './scenes/MineScene.js';
import PauseScene from './scenes/PauseScene.js';
import ShopScene from './scenes/ShopScene.js';
import LevelsScene from './scenes/LevelsScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import LevelCompleteScene from './scenes/LevelCompleteScene.js';

const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 360,
        height: 720
    },
    backgroundColor: '#1a1a1a',
    //pixelArt: true,
    physics: { default: 'arcade' },
    // Notice that all imported scenes are added to this array
    scene: [
        PreloadScene, 
        MenuScene, 
        MineScene, 
        PauseScene, 
        GameOverScene, 
        LevelCompleteScene, 
        ShopScene,
        LevelsScene
    ]
};

const game = new Phaser.Game(config);