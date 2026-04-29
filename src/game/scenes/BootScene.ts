import Phaser from 'phaser';
import { generateAssets } from '../AssetGenerator';
import { progressManager } from '../managers/ProgressManager';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  create() {
    generateAssets(this);
    progressManager.load();

    const href =
      'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
    const existing = document.querySelector(`link[href="${href}"]`);
    if (!existing) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }

    const proceed = () => this.scene.start('MenuScene');

    if (typeof document !== 'undefined' && document.fonts?.load) {
      document.fonts
        .load('10px "Press Start 2P"')
        .then(proceed)
        .catch(() => this.time.delayedCall(400, proceed));
    } else {
      this.time.delayedCall(500, proceed);
    }
  }
}
