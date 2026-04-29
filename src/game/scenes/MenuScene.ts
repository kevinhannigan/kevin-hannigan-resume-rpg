import Phaser from 'phaser';
import { GB_COLORS, GB_HEX } from '../constants';
import { progressManager } from '../managers/ProgressManager';

const TITLE_FONT = '"Press Start 2P", monospace';

export default class MenuScene extends Phaser.Scene {
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(GB_COLORS.DARKEST);

    const kb = this.input.keyboard!;
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.add
      .text(160, 48, 'KEVIN HANNIGAN', {
        fontFamily: TITLE_FONT,
        fontSize: '10px',
        color: GB_HEX.LIGHTEST,
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(160, 72, 'Interactive Resume', {
        fontFamily: TITLE_FONT,
        fontSize: '8px',
        color: GB_HEX.LIGHT,
      })
      .setOrigin(0.5, 0.5);

    const prompt = this.add
      .text(160, 200, 'Press ENTER or SPACE to Start', {
        fontFamily: TITLE_FONT,
        fontSize: '8px',
        color: GB_HEX.LIGHTEST,
      })
      .setOrigin(0.5, 0.5);

    this.tweens.add({
      targets: prompt,
      alpha: 0.35,
      duration: 700,
      yoyo: true,
      repeat: -1,
    });
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      progressManager.reset();
      this.scene.start('WorldScene', { mapId: 'uw_campus_exterior' });
    }
  }
}
