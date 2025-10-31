import Phaser from 'phaser';

/**
 * PreloadScene - Initial scene for loading game assets
 * This is a placeholder for the full game implementation
 */
export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    // Placeholder - assets will be loaded here in future stories
    console.log('[16BitFit] PreloadScene: Starting asset preload...');
  }

  create(): void {
    console.log('[16BitFit] PreloadScene: Assets loaded, ready for combat!');

    // Add placeholder text
    this.add.text(
      this.scale.width / 2,
      this.scale.height / 2,
      '16BitFit Game Engine\nReady!',
      {
        fontSize: '24px',
        color: '#9bbc0f', // Game Boy green
        align: 'center',
      }
    ).setOrigin(0.5);
  }
}
