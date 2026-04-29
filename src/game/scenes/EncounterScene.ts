import Phaser from 'phaser';
import { encounters } from '../content/encounters';
import { progressManager } from '../managers/ProgressManager';
import { GB_COLORS, GB_HEX, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import type { BuckyForm } from '../types';

const FONT = '"Press Start 2P", monospace';
const TYPE_MS = 28;
const CHARS_PER_TICK = 2;

const FORM_BACK_SPRITE: Record<BuckyForm, string> = {
  badger: 'badger_battle_back',
  consultant: 'consultant_battle_back',
  product_manager: 'pm_battle_back',
};

const FORM_NAME: Record<BuckyForm, string> = {
  badger: 'BUCKY',
  consultant: 'CONSULTANT',
  product_manager: 'PRODUCT MGR',
};

const SNOO_BACK_SPRITE = 'snoo_battle_back';
const SNOO_NAME = 'SNOO';
const SNOO_LEVEL = 40;

const REDDIT_ENCOUNTER_IDS = new Set<string>([]);

interface EvoTrigger {
  fromForm: BuckyForm;
  toForm: BuckyForm;
  requiredFlags: string[];
}

const EVOLUTION_TRIGGERS: EvoTrigger[] = [
  {
    fromForm: 'badger',
    toForm: 'consultant',
    requiredFlags: ['encounter_communication_done', 'encounter_enterprise_done'],
  },
  {
    fromForm: 'consultant',
    toForm: 'product_manager',
    requiredFlags: ['enc_dt_meta_done', 'enc_dt_cloudflare_done', 'enc_dt_revenue_done'],
  },
];

export default class EncounterScene extends Phaser.Scene {
  private encounterId!: string;
  private returnMap!: string;
  private returnX?: number;
  private returnY?: number;
  private bodyText!: Phaser.GameObjects.Text;
  private optionTexts: Phaser.GameObjects.Text[] = [];
  private optionIndex = 0;
  private optionArrow?: Phaser.GameObjects.Image;
  private typeTimer?: Phaser.Time.TimerEvent;
  private phase:
    | 'intro'
    | 'question'
    | 'pick'
    | 'response'
    | 'attack'
    | 'victory'
    | 'catch'
    | 'finishing' = 'intro';
  private currentLine = '';
  private displayed = 0;
  private typing = false;
  private pendingTypeCallback?: () => void;

  private enemySprite?: Phaser.GameObjects.Image;
  private buckySprite?: Phaser.GameObjects.Image;
  private enemyHpBar?: Phaser.GameObjects.Graphics;
  private buckyHpBar?: Phaser.GameObjects.Graphics;
  private enemyHpWidth = 80;
  private buckyHpWidth = 80;
  private enemyNameText?: Phaser.GameObjects.Text;
  private enemyLevelText?: Phaser.GameObjects.Text;
  private advanceArrow?: Phaser.GameObjects.Image;
  private moveBoxContainer?: Phaser.GameObjects.Container;
  private currentMoves: { label: string; response: string }[] = [];
  private lastPickedLabel?: string;

  private hpBarFill?: Phaser.GameObjects.Graphics;
  private hpLabel?: Phaser.GameObjects.Text;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'EncounterScene' });
  }

  init(data: { encounterId: string; returnMap: string; returnX?: number; returnY?: number }) {
    this.encounterId = data.encounterId;
    this.returnMap = data.returnMap;
    this.returnX = data.returnX;
    this.returnY = data.returnY;
  }

  create() {
    this.phase = 'intro';
    this.optionTexts = [];
    this.optionIndex = 0;
    this.typing = false;

    const enc = encounters[this.encounterId];
    if (!enc) {
      this.scene.start('WorldScene', { mapId: this.returnMap });
      return;
    }

    this.cameras.main.setBackgroundColor(GB_COLORS.LIGHTEST);

    // Battle field — top half lighter, bottom half slightly different
    this.add.rectangle(GAME_WIDTH / 2, 70, GAME_WIDTH, 140, GB_COLORS.LIGHTEST).setDepth(0);
    this.add.rectangle(GAME_WIDTH / 2, 70, GAME_WIDTH, 2, GB_COLORS.DARK).setY(139).setDepth(1);

    // Enemy platform (top-right)
    this.add.ellipse(220, 82, 100, 16, GB_COLORS.DARK).setDepth(1);

    // Bucky platform (bottom-left)
    this.add.ellipse(80, 130, 100, 16, GB_COLORS.DARK).setDepth(1);

    // Determine player and enemy sprites based on context
    const isWildSnoo = this.encounterId === 'reddit_wild_snoo';
    const useSnoo = !isWildSnoo && REDDIT_ENCOUNTER_IDS.has(this.encounterId) && progressManager.getFlag('snoo_caught');
    const enemyTexture = isWildSnoo ? 'snoo_battle_front' : (enc.enemySprite || 'enemy_battle');

    // Enemy sprite — slides in from right
    this.enemySprite = this.add.image(GAME_WIDTH + 40, 56, enemyTexture)
      .setOrigin(0.5, 1).setScale(0.85).setDepth(5);

    // Player sprite — slides in from left (Snoo for Reddit battles, Bucky otherwise)
    const form = progressManager.getBuckyForm();
    const playerSprite = useSnoo ? SNOO_BACK_SPRITE : FORM_BACK_SPRITE[form];
    this.buckySprite = this.add.image(-40, 128, playerSprite)
      .setOrigin(0.5, 1).setDepth(5);

    // Enemy info box (top-left)
    this.add.rectangle(8, 8, 140, 40, GB_COLORS.LIGHTEST).setOrigin(0, 0).setDepth(8)
      .setStrokeStyle(2, GB_COLORS.DARKEST);
    this.enemyNameText = this.add.text(14, 12, enc.enemyName, {
      fontFamily: FONT, fontSize: '7px', color: GB_HEX.DARKEST,
    }).setDepth(9);
    this.enemyLevelText = this.add.text(14, 24, `Lv${enc.enemyLevel ?? 5}`, {
      fontFamily: FONT, fontSize: '6px', color: GB_HEX.DARK,
    }).setDepth(9);
    // Enemy HP bar background
    this.add.rectangle(14, 34, this.enemyHpWidth, 6, GB_COLORS.DARK).setOrigin(0, 0).setDepth(9);
    this.enemyHpBar = this.add.graphics().setDepth(10);
    this.drawHpBar(this.enemyHpBar, 14, 34, this.enemyHpWidth, 1.0);

    // Player info box (bottom-right) — Snoo or Bucky form
    this.add.rectangle(GAME_WIDTH - 148, 94, 140, 44, GB_COLORS.LIGHTEST).setOrigin(0, 0).setDepth(8)
      .setStrokeStyle(2, GB_COLORS.DARKEST);
    const playerName = useSnoo ? SNOO_NAME : FORM_NAME[form];
    const playerLevel = useSnoo ? SNOO_LEVEL : form === 'product_manager' ? 50 : form === 'consultant' ? 25 : 10;
    this.add.text(GAME_WIDTH - 142, 98, playerName, {
      fontFamily: FONT, fontSize: '7px', color: GB_HEX.DARKEST,
    }).setDepth(9);
    this.add.text(GAME_WIDTH - 142, 110, `Lv${playerLevel}`, {
      fontFamily: FONT, fontSize: '6px', color: GB_HEX.DARK,
    }).setDepth(9);
    this.add.rectangle(GAME_WIDTH - 142, 122, this.buckyHpWidth, 6, GB_COLORS.DARK)
      .setOrigin(0, 0).setDepth(9);
    this.buckyHpBar = this.add.graphics().setDepth(10);
    this.drawHpBar(this.buckyHpBar, GAME_WIDTH - 142, 122, this.buckyHpWidth, 1.0);

    // Text box at bottom — Pokemon double-border style
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH - 16, 104, GB_COLORS.LIGHTEST)
      .setDepth(15).setStrokeStyle(3, GB_COLORS.DARKEST);
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT - 60, GAME_WIDTH - 24, 96, GB_COLORS.LIGHTEST)
      .setDepth(15).setStrokeStyle(1, GB_COLORS.DARKEST);

    this.bodyText = this.add.text(20, GAME_HEIGHT - 106, '', {
      fontFamily: FONT, fontSize: '7px', color: GB_HEX.DARKEST,
      wordWrap: { width: GAME_WIDTH - 44 }, lineSpacing: 8,
    }).setOrigin(0, 0).setDepth(20);

    this.advanceArrow = this.add.image(GAME_WIDTH - 24, GAME_HEIGHT - 18, 'arrow_indicator')
      .setOrigin(0.5).setDepth(25).setVisible(false);
    this.tweens.add({
      targets: this.advanceArrow,
      y: this.advanceArrow.y + 3,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // Slide sprites in
    this.tweens.add({
      targets: this.enemySprite,
      x: 220,
      duration: 600,
      ease: 'Power2',
    });
    this.tweens.add({
      targets: this.buckySprite,
      x: 80,
      duration: 600,
      ease: 'Power2',
      onComplete: () => {
        if (enc.isCatchEncounter) {
          this.runCatchSequence(enc);
        } else {
          this.startTypewriter(`Wild ${enc.enemyName} appeared!`, () => {
            this.showDescriptionThenOptions(enc);
          });
        }
      },
    });

    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.events.once('shutdown', () => {
      this.clearTypeTimer();
    });
  }

  update() {
    if (this.phase === 'pick') {
      if (!this.currentMoves.length) return;
      let row = Math.floor(this.optionIndex / 2);
      let col = this.optionIndex % 2;
      let changed = false;

      if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) { row = Math.max(0, row - 1); changed = true; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) { row = Math.min(1, row + 1); changed = true; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) { col = Math.max(0, col - 1); changed = true; }
      if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) { col = Math.min(1, col + 1); changed = true; }

      if (changed) {
        this.optionIndex = row * 2 + col;
        this.refreshOptions();
      }
      if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.onOptConfirm();
      }
    } else if (this.phase !== 'finishing') {
      if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.onOptConfirm();
      }
    }
  }

  private drawHpBar(gfx: Phaser.GameObjects.Graphics, x: number, y: number, maxW: number, pct: number) {
    gfx.clear();
    const w = Math.max(0, Math.floor(maxW * pct));
    const color = pct > 0.5 ? GB_COLORS.DARKEST : pct > 0.2 ? GB_COLORS.DARK : GB_COLORS.DARK;
    gfx.fillStyle(color, 1);
    gfx.fillRect(x, y, w, 6);
  }

  private createBossHpBar() {
    const x = 16;
    const y = 50;
    const w = 200;
    const h = 10;
    this.add.rectangle(x, y, w, h, GB_COLORS.DARK).setOrigin(0, 0).setStrokeStyle(2, GB_COLORS.DARKEST);
    this.hpBarFill = this.add.graphics();
    this.hpBarFill.fillStyle(GB_COLORS.LIGHT, 1);
    this.hpBarFill.fillRect(x + 1, y + 1, w - 2, h - 2);
    this.hpLabel = this.add
      .text(x + w / 2, y - 10, '12 DAYS', {
        fontFamily: FONT, fontSize: '6px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5, 1);

    const innerW = w - 2;
    const hpState = { fill: innerW };
    this.tweens.add({
      targets: hpState,
      fill: innerW * (3 / 12),
      duration: 2200,
      ease: 'Cubic.easeOut',
      onUpdate: () => {
        this.hpBarFill?.clear();
        this.hpBarFill?.fillStyle(GB_COLORS.LIGHT, 1);
        this.hpBarFill?.fillRect(x + 1, y + 1, hpState.fill, h - 2);
      },
      onComplete: () => {
        this.hpLabel?.setText('3 DAYS');
      },
    });
  }

  private clearTypeTimer() {
    this.typeTimer?.remove(false);
    this.typeTimer = undefined;
  }

  private startTypewriter(text: string, onDone: () => void) {
    this.clearTypeTimer();
    this.currentLine = text;
    this.displayed = 0;
    this.typing = true;
    this.pendingTypeCallback = onDone;
    this.bodyText.setText('');
    this.advanceArrow?.setVisible(false);

    this.typeTimer = this.time.addEvent({
      delay: TYPE_MS,
      loop: true,
      callback: () => {
        this.displayed = Math.min(this.displayed + CHARS_PER_TICK, this.currentLine.length);
        this.bodyText.setText(this.currentLine.slice(0, this.displayed));
        if (this.displayed >= this.currentLine.length) {
          this.typing = false;
          this.clearTypeTimer();
          this.advanceArrow?.setVisible(true);
        }
      },
    });
  }

  private getMovePositions() {
    const col1X = 36;
    const col2X = GAME_WIDTH / 2 + 16;
    const row1Y = GAME_HEIGHT - 86;
    const row2Y = GAME_HEIGHT - 46;
    return [
      { x: col1X, y: row1Y }, { x: col2X, y: row1Y },
      { x: col1X, y: row2Y }, { x: col2X, y: row2Y },
    ];
  }

  private showDescriptionThenOptions(enc: (typeof encounters)[string]) {
    if (enc.description) {
      this.startTypewriter(enc.description, () => {
        this.showOptions(enc);
      });
    } else {
      this.showOptions(enc);
    }
  }

  private showOptions(enc: (typeof encounters)[string]) {
    if (!enc.moves?.length) {
      this.runAttackAnimation(enc);
      return;
    }

    this.currentMoves = enc.moves.slice(0, 4).map((m) => ({
      label: m.label,
      response: m.response,
    }));

    this.phase = 'pick';
    this.optionTexts.forEach((t) => t.destroy());
    this.optionTexts = [];
    this.optionArrow?.destroy();
    this.moveBoxContainer?.destroy(true);

    this.bodyText.setText('');

    this.moveBoxContainer = this.add.container(0, 0).setDepth(21);

    const positions = this.getMovePositions();

    this.currentMoves.forEach((move, i) => {
      const t = this.add.text(positions[i].x, positions[i].y, move.label, {
        fontFamily: FONT, fontSize: '7px', color: GB_HEX.DARK,
      }).setOrigin(0, 0.5).setDepth(23);
      this.optionTexts.push(t);
      this.moveBoxContainer!.add(t);
    });

    this.optionArrow = this.add.image(positions[0].x - 12, positions[0].y, 'arrow_indicator')
      .setOrigin(0.5).setDepth(23);
    this.moveBoxContainer.add(this.optionArrow);

    this.optionIndex = 0;
    this.refreshOptions();
  }

  private refreshOptions() {
    if (!this.currentMoves.length) return;
    const positions = this.getMovePositions();
    this.optionArrow?.setPosition(positions[this.optionIndex].x - 12, positions[this.optionIndex].y);
    this.optionTexts.forEach((t, i) => {
      t.setColor(i === this.optionIndex ? GB_HEX.DARKEST : GB_HEX.DARK);
    });
  }

  private onOptConfirm() {
    const enc = encounters[this.encounterId];
    if (!enc) return;

    if (this.typing) {
      this.displayed = this.currentLine.length;
      this.bodyText.setText(this.currentLine);
      this.typing = false;
      this.clearTypeTimer();
      this.advanceArrow?.setVisible(true);
      return;
    }

    if (this.pendingTypeCallback) {
      this.advanceArrow?.setVisible(false);
      const cb = this.pendingTypeCallback;
      this.pendingTypeCallback = undefined;
      cb();
      return;
    }

    if (this.phase === 'pick' && this.currentMoves.length > 0) {
      const move = this.currentMoves[this.optionIndex];
      this.lastPickedLabel = move.label;
      this.phase = 'attack';
      this.destroyMoveBox();

      this.runAttackAnimation(enc, move.response);
    }
  }

  private destroyMoveBox() {
    this.moveBoxContainer?.destroy(true);
    this.moveBoxContainer = undefined;
    this.optionTexts = [];
    this.optionArrow = undefined;
    this.currentMoves = [];
  }

  private runAttackAnimation(enc: (typeof encounters)[string], responseText?: string) {
    this.phase = 'attack';
    const form = progressManager.getBuckyForm();
    const isWildSnoo = this.encounterId === 'reddit_wild_snoo';
    const useSnoo = !isWildSnoo && REDDIT_ENCOUNTER_IDS.has(this.encounterId) && progressManager.getFlag('snoo_caught');
    const name = useSnoo ? SNOO_NAME : FORM_NAME[form];
    const moveLabel = responseText ? this.lastPickedLabel ?? 'ATTACK' : 'ATTACK';

    this.startTypewriter(`${name} used ${moveLabel}!`, () => {
      this.time.delayedCall(300, () => {
        this.buckyAttackAnim(() => {
          this.flashSprite(this.enemySprite!, () => {
            this.animateHpBar(this.enemyHpBar!, 14, 34, this.enemyHpWidth, 1.0, 0.0, () => {
              this.startTypewriter("It's super effective!", () => {
                this.time.delayedCall(400, () => {
                  this.enemyFaintAnim(() => {
                    if (responseText) {
                      this.startTypewriter(responseText, () => this.runVictory(enc));
                    } else {
                      this.runVictory(enc);
                    }
                  });
                });
              });
            });
          });
        });
      });
    });
  }

  private buckyAttackAnim(onDone: () => void) {
    if (!this.buckySprite) { onDone(); return; }
    const origX = this.buckySprite.x;
    const origY = this.buckySprite.y;
    this.tweens.add({
      targets: this.buckySprite,
      x: origX + 30,
      y: origY - 15,
      duration: 120,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => onDone(),
    });
  }

  private enemyAttackAnim(onDone: () => void) {
    if (!this.enemySprite) { onDone(); return; }
    const origX = this.enemySprite.x;
    const origY = this.enemySprite.y;
    this.tweens.add({
      targets: this.enemySprite,
      x: origX - 30,
      y: origY + 15,
      duration: 120,
      ease: 'Power2',
      yoyo: true,
      onComplete: () => onDone(),
    });
  }

  private flashSprite(sprite: Phaser.GameObjects.Image, onDone: () => void) {
    let flashes = 0;
    const timer = this.time.addEvent({
      delay: 80,
      repeat: 5,
      callback: () => {
        sprite.setVisible(flashes % 2 === 0);
        flashes++;
        if (flashes > 5) {
          sprite.setVisible(true);
          timer.remove(false);
          onDone();
        }
      },
    });
  }

  private animateHpBar(
    gfx: Phaser.GameObjects.Graphics,
    x: number, y: number, maxW: number,
    fromPct: number, toPct: number,
    onDone: () => void,
  ) {
    const state = { pct: fromPct };
    this.tweens.add({
      targets: state,
      pct: toPct,
      duration: 600,
      ease: 'Linear',
      onUpdate: () => this.drawHpBar(gfx, x, y, maxW, state.pct),
      onComplete: () => onDone(),
    });
  }

  private enemyFaintAnim(onDone: () => void) {
    if (!this.enemySprite) { onDone(); return; }
    this.tweens.add({
      targets: this.enemySprite,
      y: this.enemySprite.y + 60,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => onDone(),
    });
  }

  private runVictory(enc: (typeof encounters)[string]) {
    this.phase = 'victory';
    const lines = [...enc.victoryText];
    const playNext = () => {
      if (lines.length === 0) {
        this.finishEncounter(enc);
        return;
      }
      const line = lines.shift()!;
      this.startTypewriter(line, playNext);
    };
    playNext();
  }

  private checkEvolution(): EvoTrigger | null {
    const currentForm = progressManager.getBuckyForm();
    for (const evo of EVOLUTION_TRIGGERS) {
      if (evo.fromForm !== currentForm) continue;
      if (progressManager.hasAllFlags(evo.requiredFlags)) return evo;
    }
    return null;
  }

  private finishEncounter(enc: (typeof encounters)[string]) {
    this.phase = 'finishing';
    if (enc.setFlag) progressManager.setFlag(enc.setFlag);
    if (enc.processDexEntry) progressManager.addProcessDexEntry(enc.processDexEntry);
    if (enc.badgeReward) progressManager.addBadge(enc.badgeReward);
    if (enc.moneyReward) progressManager.addSharePrice(enc.moneyReward);

    if (enc.nextEncounterId) {
      this.chainToNextRound(enc.nextEncounterId);
      return;
    }

    const evo = this.checkEvolution();

    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (evo) {
        this.scene.start('EvolutionScene', {
          fromForm: evo.fromForm,
          toForm: evo.toForm,
          returnMap: this.returnMap,
          returnX: this.returnX,
          returnY: this.returnY,
        });
      } else {
        this.scene.start('WorldScene', {
          mapId: this.returnMap,
          spawnX: this.returnX,
          spawnY: this.returnY,
        });
      }
    });
  }

  // ─── Encounter Chain (Bucky stays, new opponent slides in) ───

  private chainToNextRound(nextEncounterId: string) {
    const nextEnc = encounters[nextEncounterId];
    if (!nextEnc) return;

    this.encounterId = nextEncounterId;
    this.destroyMoveBox();

    // Reset Bucky HP bar to full
    this.buckyHpWidth = 80;
    if (this.buckyHpBar) {
      this.drawHpBar(this.buckyHpBar, GAME_WIDTH - 142, 122, 80, 1.0);
    }

    // Update enemy info
    this.enemyNameText?.setText(nextEnc.enemyName);
    this.enemyLevelText?.setText(`Lv${nextEnc.enemyLevel ?? 5}`);

    // Reset enemy HP
    this.enemyHpWidth = 80;
    if (this.enemyHpBar) {
      this.drawHpBar(this.enemyHpBar, 14, 34, 80, 1.0);
    }

    // Destroy old enemy sprite, create new one offscreen
    this.enemySprite?.destroy();
    const nextTexture = nextEnc.enemySprite || 'enemy_battle';
    this.enemySprite = this.add.image(GAME_WIDTH + 40, 56, nextTexture)
      .setOrigin(0.5, 1).setScale(0.85).setDepth(5);

    // Brief pause then slide new opponent in
    this.time.delayedCall(400, () => {
      this.tweens.add({
        targets: this.enemySprite,
        x: 220,
        duration: 600,
        ease: 'Power2',
        onComplete: () => {
          this.phase = 'intro';
          this.startTypewriter(`${nextEnc.enemyName} steps up!`, () => {
            this.showDescriptionThenOptions(nextEnc);
          });
        },
      });
    });
  }

  // ─── Catch Sequence (Poké Ball throw → shake → stats) ───

  private runCatchSequence(enc: (typeof encounters)[string]) {
    this.phase = 'catch';
    this.startTypewriter(`A wild ${enc.enemyName} appeared!`, () => {
      this.time.delayedCall(600, () => {
        const form = progressManager.getBuckyForm();
        const name = FORM_NAME[form];
        this.startTypewriter('KEVIN wants to be a Snoo and used POKÉ BALL!', () => {
          this.time.delayedCall(300, () => this.throwPokeBall(enc));
        });
      });
    });
  }

  private throwPokeBall(enc: (typeof encounters)[string]) {
    const ball = this.add.image(80, 120, 'pokeball').setOrigin(0.5).setDepth(50).setScale(0.5);

    // Arc the ball from player to enemy
    this.tweens.add({
      targets: ball,
      x: 220,
      y: { value: 30, ease: 'Sine.easeOut' },
      duration: 500,
      ease: 'Linear',
      onComplete: () => {
        // Snoo shrinks into ball
        if (this.enemySprite) {
          this.tweens.add({
            targets: this.enemySprite,
            scaleX: 0, scaleY: 0, alpha: 0,
            duration: 400,
            ease: 'Back.easeIn',
            onComplete: () => this.dropAndShakeBall(ball, enc),
          });
        } else {
          this.dropAndShakeBall(ball, enc);
        }
      },
    });
  }

  private dropAndShakeBall(ball: Phaser.GameObjects.Image, enc: (typeof encounters)[string]) {
    // Ball drops to center
    this.tweens.add({
      targets: ball,
      x: GAME_WIDTH / 2,
      y: 80,
      duration: 300,
      ease: 'Bounce.easeOut',
      onComplete: () => this.shakeBall(ball, 0, enc),
    });
  }

  private shakeBall(ball: Phaser.GameObjects.Image, count: number, enc: (typeof encounters)[string]) {
    if (count >= 3) {
      this.time.delayedCall(300, () => {
        this.startTypewriter(`Gotcha! ${enc.enemyName} was caught!`, () => {
          this.time.delayedCall(800, () => this.showCaughtStats(ball, enc));
        });
      });
      return;
    }
    this.tweens.add({
      targets: ball,
      angle: -15,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.tweens.add({
          targets: ball,
          angle: 15,
          duration: 100,
          yoyo: true,
          onComplete: () => {
            ball.setAngle(0);
            this.time.delayedCall(400, () => this.shakeBall(ball, count + 1, enc));
          },
        });
      },
    });
  }

  private showCaughtStats(ball: Phaser.GameObjects.Image, enc: (typeof encounters)[string]) {
    ball.destroy();

    // Stats overlay
    const cx = GAME_WIDTH / 2;
    const cy = 75;
    this.add.rectangle(cx, cy, 200, 110, GB_COLORS.LIGHTEST)
      .setStrokeStyle(3, GB_COLORS.DARKEST).setDepth(30);
    this.add.rectangle(cx, cy, 192, 102, GB_COLORS.LIGHTEST)
      .setStrokeStyle(1, GB_COLORS.DARKEST).setDepth(30);

    // Snoo portrait
    this.add.image(cx - 60, cy - 10, 'snoo_battle_front')
      .setOrigin(0.5).setDepth(31);

    const lx = cx - 15;
    const makeText = (x: number, y: number, text: string, size = '6px', color: string = GB_HEX.DARKEST) =>
      this.add.text(x, y, text, { fontFamily: FONT, fontSize: size, color }).setDepth(31);

    makeText(lx, cy - 40, 'SNOO', '8px');
    makeText(lx, cy - 28, `Lv ${enc.enemyLevel}`, '6px', GB_HEX.DARK);
    makeText(lx, cy - 16, 'Type: TECH', '6px', GB_HEX.DARK);
    makeText(lx, cy - 4, 'ATK: UPVOTE', '6px', GB_HEX.DARK);
    makeText(lx, cy + 8, 'SP: KARMA BLAST', '6px', GB_HEX.DARK);

    // HP bar
    makeText(lx, cy + 22, 'HP', '6px', GB_HEX.DARK);
    this.add.rectangle(lx + 16, cy + 25, 50, 5, GB_COLORS.DARK).setOrigin(0, 0.5).setDepth(31);
    this.add.rectangle(lx + 17, cy + 25, 48, 3, GB_COLORS.DARKEST).setOrigin(0, 0.5).setDepth(32);

    this.time.delayedCall(400, () => {
      this.phase = 'victory';
      const lines = [...enc.victoryText];
      const playNext = () => {
        if (lines.length === 0) {
          this.finishEncounter(enc);
          return;
        }
        this.startTypewriter(lines.shift()!, playNext);
      };
      playNext();
    });
  }
}
