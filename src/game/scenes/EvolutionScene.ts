import Phaser from 'phaser';
import { GB_COLORS, GB_HEX, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import { progressManager } from '../managers/ProgressManager';
import type { BuckyForm } from '../types';

const FONT = '"Press Start 2P", monospace';

const FORM_LABELS: Record<BuckyForm, string> = {
  badger: 'BUCKY',
  consultant: 'CONSULTANT',
  product_manager: 'PRODUCT MGR',
};

const FORM_FRONT_SPRITE: Record<BuckyForm, string> = {
  badger: 'badger_battle_front',
  consultant: 'consultant_battle_front',
  product_manager: 'pm_battle_front',
};

interface EvoData {
  fromForm: BuckyForm;
  toForm: BuckyForm;
  returnMap: string;
  returnX?: number;
  returnY?: number;
}

export default class EvolutionScene extends Phaser.Scene {
  private fromForm!: BuckyForm;
  private toForm!: BuckyForm;
  private returnMap!: string;
  private returnX?: number;
  private returnY?: number;

  constructor() {
    super({ key: 'EvolutionScene' });
  }

  init(data: EvoData) {
    this.fromForm = data.fromForm;
    this.toForm = data.toForm;
    this.returnMap = data.returnMap;
    this.returnX = data.returnX;
    this.returnY = data.returnY;
  }

  create() {
    this.cameras.main.setBackgroundColor(GB_COLORS.DARKEST);

    const oldKey = FORM_FRONT_SPRITE[this.fromForm];
    const newKey = FORM_FRONT_SPRITE[this.toForm];
    const fromLabel = FORM_LABELS[this.fromForm];
    const toLabel = FORM_LABELS[this.toForm];

    const cx = GAME_WIDTH / 2;
    const cy = GAME_HEIGHT / 2 - 16;

    const oldSprite = this.add.image(cx, cy, oldKey).setOrigin(0.5).setDepth(5);
    const newSprite = this.add.image(cx, cy, newKey).setOrigin(0.5).setDepth(5).setAlpha(0);

    const text = this.add.text(cx, GAME_HEIGHT - 50, '', {
      fontFamily: FONT, fontSize: '8px', color: GB_HEX.LIGHTEST,
      wordWrap: { width: GAME_WIDTH - 32 },
      align: 'center',
    }).setOrigin(0.5, 0).setDepth(10);

    const flash = this.add.rectangle(cx, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, GB_COLORS.LIGHTEST)
      .setAlpha(0).setDepth(20);

    // Phase 1: "What? BUCKY is evolving!"
    text.setText(`What? ${fromLabel}\nis evolving!`);

    this.time.delayedCall(1600, () => {
      // Phase 2: Flashing alternation — starts slow, speeds up
      let toggleCount = 0;
      const maxToggles = 18;
      let showingNew = false;

      const doToggle = () => {
        if (toggleCount >= maxToggles) {
          // Phase 3: White flash then resolve to new form
          oldSprite.setAlpha(0);
          newSprite.setAlpha(0);
          this.tweens.add({
            targets: flash,
            alpha: 1,
            duration: 200,
            yoyo: true,
            hold: 300,
            onYoyo: () => {
              oldSprite.setVisible(false);
              newSprite.setAlpha(1);
            },
            onComplete: () => {
              flash.setAlpha(0);
              // Phase 4: Congratulations text
              progressManager.setBuckyForm(this.toForm);
              text.setText(`Congratulations!\n${fromLabel} evolved\ninto ${toLabel}!`);

              this.time.delayedCall(3000, () => {
                this.cameras.main.fadeOut(500, 0, 0, 0);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                  this.scene.start('WorldScene', {
                    mapId: this.returnMap,
                    spawnX: this.returnX,
                    spawnY: this.returnY,
                  });
                });
              });
            },
          });
          return;
        }

        showingNew = !showingNew;
        oldSprite.setAlpha(showingNew ? 0 : 1);
        newSprite.setAlpha(showingNew ? 1 : 0);

        // Scale pulse on each toggle
        const active = showingNew ? newSprite : oldSprite;
        this.tweens.add({
          targets: active,
          scaleX: 1.08,
          scaleY: 1.08,
          duration: 60,
          yoyo: true,
        });

        toggleCount++;
        // Accelerating: starts at 400ms, ends at ~100ms
        const delay = Math.max(100, 400 - toggleCount * 18);
        this.time.delayedCall(delay, doToggle);
      };

      doToggle();
    });

    // Input to speed through (after evolution completes)
    const kb = this.input.keyboard!;
    const enterKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    const spaceKey = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.events.on('update', () => {
      if (
        progressManager.getBuckyForm() === this.toForm &&
        (Phaser.Input.Keyboard.JustDown(enterKey) || Phaser.Input.Keyboard.JustDown(spaceKey))
      ) {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('WorldScene', {
            mapId: this.returnMap,
            spawnX: this.returnX,
            spawnY: this.returnY,
          });
        });
      }
    });
  }
}
