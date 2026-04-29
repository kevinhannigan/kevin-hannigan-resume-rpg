import Phaser from 'phaser';
import { GB_COLORS, GAME_WIDTH, GAME_HEIGHT } from '../constants';
import type { DialogueLine } from '../types';

const BOX_W = 304;
const BOX_H = 64;
const BOX_X = (GAME_WIDTH - BOX_W) / 2;
const BOX_Y = GAME_HEIGHT - BOX_H - 8;
const TEXT_X = BOX_X + 12;
const TEXT_Y = BOX_Y + 10;
const TEXT_W = BOX_W - 24;
const CHARS_PER_TICK = 2;
const TICK_MS = 30;

export class DialogueManager {
  private scene: Phaser.Scene;
  private container!: Phaser.GameObjects.Container;
  private bgImage!: Phaser.GameObjects.Image;
  private speakerText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private bodyText!: Phaser.GameObjects.Text;
  private arrow!: Phaser.GameObjects.Image;
  private queue: DialogueLine[] = [];
  private currentLine = '';
  private displayedChars = 0;
  private isTyping = false;
  private isOpen = false;
  private timer?: Phaser.Time.TimerEvent;
  private resolveCallback?: () => void;
  private onCompleteCallback?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.createUI();
  }

  private createUI() {
    this.container = this.scene.add.container(0, 0).setDepth(1000).setScrollFactor(0).setVisible(false);

    this.bgImage = this.scene.add.image(BOX_X, BOX_Y, 'dialogue_box').setOrigin(0, 0);
    this.container.add(this.bgImage);

    this.speakerText = this.scene.add.text(TEXT_X, BOX_Y + 4, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#081820',
      wordWrap: { width: TEXT_W },
    });
    this.container.add(this.speakerText);

    this.bodyText = this.scene.add.text(TEXT_X, TEXT_Y + 8, '', {
      fontFamily: '"Press Start 2P", monospace',
      fontSize: '7px',
      color: '#346856',
      wordWrap: { width: TEXT_W },
      lineSpacing: 6,
    });
    this.container.add(this.bodyText);

    this.arrow = this.scene.add.image(BOX_X + BOX_W - 16, BOX_Y + BOX_H - 12, 'arrow_indicator').setOrigin(0, 0);
    this.container.add(this.arrow);

    this.scene.tweens.add({
      targets: this.arrow,
      y: this.arrow.y + 3,
      duration: 400,
      yoyo: true,
      repeat: -1,
    });
  }

  async showSequence(lines: DialogueLine[], onComplete?: () => void): Promise<void> {
    this.onCompleteCallback = onComplete;
    this.queue = [...lines];
    this.container.setVisible(true);
    this.isOpen = true;

    while (this.queue.length > 0) {
      const line = this.queue.shift()!;
      await this.showLine(line);
    }

    this.close();
    this.onCompleteCallback?.();
  }

  private showLine(line: DialogueLine): Promise<void> {
    return new Promise((resolve) => {
      this.resolveCallback = resolve;
      this.currentLine = line.text;
      this.displayedChars = 0;
      this.isTyping = true;

      if (line.speaker) {
        this.speakerText.setText(line.speaker);
      } else {
        this.speakerText.setText('');
      }
      this.bodyText.setText('');
      this.arrow.setVisible(false);

      this.timer = this.scene.time.addEvent({
        delay: line.speed ?? TICK_MS,
        callback: this.typeChar,
        callbackScope: this,
        loop: true,
      });
    });
  }

  private typeChar() {
    this.displayedChars = Math.min(this.displayedChars + CHARS_PER_TICK, this.currentLine.length);
    this.bodyText.setText(this.currentLine.substring(0, this.displayedChars));

    if (this.displayedChars >= this.currentLine.length) {
      this.isTyping = false;
      this.timer?.remove();
      this.arrow.setVisible(true);
    }
  }

  advance() {
    if (!this.isOpen) return;

    if (this.isTyping) {
      this.displayedChars = this.currentLine.length;
      this.bodyText.setText(this.currentLine);
      this.isTyping = false;
      this.timer?.remove();
      this.arrow.setVisible(true);
    } else {
      this.resolveCallback?.();
    }
  }

  close() {
    this.isOpen = false;
    this.container.setVisible(false);
    this.timer?.remove();
  }

  getIsOpen(): boolean {
    return this.isOpen;
  }

  destroy() {
    this.timer?.remove();
    this.container.destroy();
  }
}
