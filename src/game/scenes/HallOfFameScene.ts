import Phaser from 'phaser';
import { progressManager } from '../managers/ProgressManager';
import { GB_COLORS, GB_HEX, GAME_WIDTH, GAME_HEIGHT } from '../constants';

const FONT = '"Press Start 2P", monospace';

const BADGE_LABELS = [
  { id: 'Systems Badge', label: 'Systems' },
  { id: 'Offer Letter', label: 'Offer Letter' },
  { id: 'Manufacturing Badge', label: 'Manufacturing' },
  { id: 'Consulting Badge', label: 'Consulting' },
  { id: 'Scale Badge', label: 'Scale' },
];

const SKILLS = [
  'Industrial & Systems Engineering',
  'ERP/CRM Implementation',
  'Agile/Scrum',
  'React/Python/PHP',
  'Integration Architecture',
  'Financial Systems',
  'Data Pipelines',
  'SOX Compliance',
];

const CERTS = ['Lean Six Sigma', 'NetSuite Administrator', 'Salesforce CPQ', 'Workato'];

const TIMELINE = [
  '2012–2016  UW — Industrial & Systems Engineering',
  '2016–2017  Baker Tilly — ERP / manufacturing',
  '2017–2021  Deloitte Digital — CRM/ERP implementation & integrations',
  '2021–now   Reddit — Finance Applications',
];

export default class HallOfFameScene extends Phaser.Scene {
  private content!: Phaser.GameObjects.Container;
  private scrollMaxY = 0;
  private scrollUpKey!: Phaser.Input.Keyboard.Key;
  private scrollDownKey!: Phaser.Input.Keyboard.Key;

  constructor() {
    super({ key: 'HallOfFameScene' });
  }

  create() {
    this.cameras.main.setBackgroundColor(GB_COLORS.DARKEST);

    this.add
      .text(GAME_WIDTH / 2, 16, 'HALL OF FAME', {
        fontFamily: FONT,
        fontSize: '10px',
        color: GB_HEX.LIGHTEST,
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.content = this.add.container(0, 0).setDepth(5);
    let y = 40;

    this.content.add(
      this.add
        .text(16, y, 'BADGE CASE', {
          fontFamily: FONT,
          fontSize: '8px',
          color: GB_HEX.LIGHT,
        })
        .setOrigin(0, 0),
    );
    y += 22;

    const owned = new Set(progressManager.getBadges());
    BADGE_LABELS.forEach((b, i) => {
      const bx = 24 + (i % 5) * 56;
      const by = y + Math.floor(i / 5) * 36;
      const key = owned.has(b.id) ? 'badge_filled' : 'badge_empty';
      this.content.add(this.add.image(bx, by, key).setOrigin(0, 0));
      this.content.add(
        this.add
          .text(bx, by + 28, b.label, {
            fontFamily: FONT,
            fontSize: '5px',
            color: GB_HEX.DARK,
            align: 'center',
          })
          .setOrigin(0, 0),
      );
    });
    y += 52;

    y += 8;
    this.content.add(
      this.add
        .text(16, y, 'SKILLS', {
          fontFamily: FONT,
          fontSize: '8px',
          color: GB_HEX.LIGHT,
        })
        .setOrigin(0, 0),
    );
    y += 20;
    SKILLS.forEach((s) => {
      this.content.add(
        this.add
          .text(20, y, `· ${s}`, {
            fontFamily: FONT,
            fontSize: '5px',
            color: GB_HEX.LIGHTEST,
            wordWrap: { width: GAME_WIDTH - 32 },
          })
          .setOrigin(0, 0),
      );
      y += 14;
    });

    y += 10;
    this.content.add(
      this.add
        .text(16, y, 'CERTIFICATIONS', {
          fontFamily: FONT,
          fontSize: '8px',
          color: GB_HEX.LIGHT,
        })
        .setOrigin(0, 0),
    );
    y += 20;
    CERTS.forEach((c) => {
      this.content.add(
        this.add
          .text(20, y, `· ${c}`, {
            fontFamily: FONT,
            fontSize: '5px',
            color: GB_HEX.LIGHTEST,
          })
          .setOrigin(0, 0),
      );
      y += 14;
    });

    y += 10;
    this.content.add(
      this.add
        .text(16, y, 'CAREER TIMELINE', {
          fontFamily: FONT,
          fontSize: '8px',
          color: GB_HEX.LIGHT,
        })
        .setOrigin(0, 0),
    );
    y += 20;
    TIMELINE.forEach((t) => {
      this.content.add(
        this.add
          .text(20, y, t, {
            fontFamily: FONT,
            fontSize: '5px',
            color: GB_HEX.LIGHTEST,
            wordWrap: { width: GAME_WIDTH - 40 },
          })
          .setOrigin(0, 0),
      );
      y += 16;
    });

    y += 24;
    const mkBtn = (label: string, py: number, onClick: () => void) => {
      const t = this.add
        .text(GAME_WIDTH / 2, py, label, {
          fontFamily: FONT,
          fontSize: '6px',
          color: GB_HEX.DARKEST,
          backgroundColor: GB_HEX.LIGHTEST,
          padding: { x: 8, y: 6 },
        })
        .setOrigin(0.5, 0)
        .setInteractive({ useHandCursor: true })
        .on('pointerup', onClick);
      this.content.add(t);
      return py + 28;
    };

    y = mkBtn('Resume PDF', y, () => {
      this.game.events.emit('open_link', '/Kevin_Hannigan_Resume.pdf');
    });
    y = mkBtn('LinkedIn', y, () => {
      this.game.events.emit('open_link', 'https://www.linkedin.com/in/kevin-hannigan/');
    });
    y = mkBtn('Email Kevin', y, () => {
      this.game.events.emit('open_link', 'mailto:kevin@example.com');
    });
    y = mkBtn('Replay', y, () => {
      progressManager.reset();
      this.scene.start('MenuScene');
    });

    const bottom = y + 24;
    this.scrollMaxY = Math.max(0, bottom - GAME_HEIGHT + 48);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT - 10, 'UP/DOWN: scroll', {
        fontFamily: FONT,
        fontSize: '5px',
        color: GB_HEX.DARK,
      })
      .setOrigin(0.5, 1)
      .setScrollFactor(0)
      .setDepth(100);

    this.scrollUpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.scrollDownKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
  }

  update() {
    let dy = 0;
    if (this.scrollUpKey?.isDown) dy += 2.5;
    if (this.scrollDownKey?.isDown) dy -= 2.5;
    if (dy !== 0 && this.content) {
      const ny = Phaser.Math.Clamp(this.content.y + dy, -this.scrollMaxY, 0);
      this.content.y = ny;
    }
  }
}
