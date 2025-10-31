import Phaser from 'phaser';
import { PreloadScene } from './scenes/PreloadScene';

/**
 * Game Engine Configuration
 * This will be loaded in a React Native WebView
 */
export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#0f380f', // Game Boy darkest green
  scene: [PreloadScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0, x: 0 },
      debug: false,
    },
  },
  pixelArt: true, // Crisp pixel rendering
  antialias: false, // Disable antialiasing for pixel-perfect graphics
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

/**
 * Initialize the Phaser game
 * This function will be called from the WebView bridge
 */
export function initGame(containerId: string = 'game-container'): Phaser.Game {
  const config = { ...gameConfig, parent: containerId };
  return new Phaser.Game(config);
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).GameEngine = {
    initGame,
    gameConfig,
  };
}
