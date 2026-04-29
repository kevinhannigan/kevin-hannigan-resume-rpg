import Phaser from 'phaser';
import { maps } from '../maps/index';
import { dialogues } from '../content/dialogue';
import { encounters } from '../content/encounters';
import { chapters } from '../content/chapters';
import { processDex } from '../content/processdex';
import { progressManager } from '../managers/ProgressManager';
import { DialogueManager } from '../managers/DialogueManager';
import {
  GB_COLORS,
  GB_HEX,
  TILE_SIZE,
  TILE,
  WALKABLE_TILES,
  INTERACTIVE_TILES,
  Direction,
  DIR_OFFSET,
  STEP_DURATION,
  GAME_WIDTH,
  GAME_HEIGHT,
  type ChapterId,
} from '../constants';
import type { MapData, TriggerZone, DialogueSequence, NPCData } from '../types';

const TITLE_FONT = '"Press Start 2P", monospace';

const TILE_TEXTURE_KEYS: Record<number, string> = {
  [TILE.VOID]: 'tile_void',
  [TILE.GROUND]: 'tile_ground',
  [TILE.WALL]: 'tile_wall',
  [TILE.GRASS]: 'tile_grass',
  [TILE.WATER]: 'tile_water',
  [TILE.PATH]: 'tile_path',
  [TILE.DOOR]: 'tile_door',
  [TILE.DESK]: 'tile_desk',
  [TILE.COMPUTER]: 'tile_computer',
  [TILE.WHITEBOARD]: 'tile_whiteboard',
  [TILE.BOOKSHELF]: 'tile_bookshelf',
  [TILE.SIGN]: 'tile_sign',
  [TILE.TREE]: 'tile_tree',
  [TILE.BUILDING]: 'tile_building',
  [TILE.TRACKS]: 'tile_tracks',
  [TILE.FACTORY_FLOOR]: 'tile_factory',
  [TILE.CONVEYOR]: 'tile_conveyor',
  [TILE.CRATE]: 'tile_crate',
  [TILE.ELEVATOR]: 'tile_elevator',
  [TILE.TROPHY]: 'tile_trophy',
  [TILE.LAB_BENCH]: 'tile_lab',
  [TILE.FENCE]: 'tile_fence',
  [TILE.FLOOR_ALT]: 'tile_floor_alt',
  [TILE.CARPET]: 'tile_carpet',
  [TILE.COUNTER]: 'tile_counter',
  [TILE.SERVER]: 'tile_server',
  [TILE.PIPE]: 'tile_pipe',
  [TILE.WINDOW_TILE]: 'tile_window',
  [TILE.ITEM_BALL]: 'tile_item_ball',
  [TILE.UPVOTE_PAD]: 'tile_upvote',
  [TILE.DOWNVOTE_PAD]: 'tile_downvote',
  [TILE.RESET_PAD]: 'tile_reset',
  [TILE.KARMA_DOOR]: 'tile_karma_door',
  [TILE.KARMA_BRIDGE]: 'tile_bridge_on',
  [TILE.KARMA_BRIDGE_OFF]: 'tile_bridge_off',
  [TILE.MOD_STATUE]: 'tile_mod_statue',
  [TILE.ROULETTE_TABLE]: 'tile_roulette',
};

const DIR_TEXTURE: Record<Direction, string> = {
  [Direction.DOWN]: 'player_down',
  [Direction.UP]: 'player_up',
  [Direction.LEFT]: 'player_left',
  [Direction.RIGHT]: 'player_right',
};

const DIR_STEP_TEXTURE: Record<Direction, string> = {
  [Direction.DOWN]: 'player_down_step',
  [Direction.UP]: 'player_up_step',
  [Direction.LEFT]: 'player_left_step',
  [Direction.RIGHT]: 'player_right_step',
};

const EXPECTED_BADGES = [
  'Systems Badge',
  'Offer Letter',
  'Manufacturing Badge',
  'Consulting Badge',
  'Scale Badge',
];

type PausePanel = 'main' | 'badges' | 'processdex';

export default class WorldScene extends Phaser.Scene {
  private mapId!: string;
  private map!: MapData;
  private player!: Phaser.GameObjects.Sprite;
  private playerGridX = 0;
  private playerGridY = 0;
  private facing: Direction = Direction.DOWN;
  private isMoving = false;
  private isTransitioning = false;
  private stepToggle = false;
  private dialogueManager!: DialogueManager;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyW!: Phaser.Input.Keyboard.Key;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyS!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private keyEsc!: Phaser.Input.Keyboard.Key;
  private keyEnter!: Phaser.Input.Keyboard.Key;
  private keySpace!: Phaser.Input.Keyboard.Key;
  private pauseOpen = false;
  private pauseContainer?: Phaser.GameObjects.Container;
  private pausePanel: PausePanel = 'main';
  private pauseMenuIndex = 0;
  private pauseMenuLabels: string[] = [];
  private pauseMenuTexts: Phaser.GameObjects.Text[] = [];
  private pauseArrow?: Phaser.GameObjects.Image;
  private pauseDetailText?: Phaser.GameObjects.Text;
  private firedTriggers = new Set<string>();
  private pendingChapterIntro?: ChapterId;
  private npcSprites = new Map<string, Phaser.GameObjects.Sprite>();
  private npcGridPositions = new Map<string, { x: number; y: number }>();
  private trainerActive = false;
  private defeatedTrainers = new Set<string>();
  private interactHint?: Phaser.GameObjects.Image;
  private overrideSpawnX?: number;
  private overrideSpawnY?: number;
  private previousMapId?: string;
  private grassSteps = 0;

  // Karma puzzle state
  private karmaCurrent = 0;
  private karmaConsumedPads = new Set<string>();
  private karmaGateSprites = new Map<string, Phaser.GameObjects.Image>();
  private karmaPadSprites = new Map<string, Phaser.GameObjects.Image>();
  private karmaHud?: Phaser.GameObjects.Text;

  // Roulette / Casino state
  private rouletteOpen = false;
  private rouletteContainer?: Phaser.GameObjects.Container;
  private roulettePhase: 'wager' | 'color' | 'spinning' | 'result' = 'wager';
  private rouletteWager = 0;
  private rouletteMenuIndex = 0;
  private rouletteMenuOptions: { label: string; value: number | string }[] = [];
  private rouletteMenuTexts: Phaser.GameObjects.Text[] = [];
  private rouletteArrow?: Phaser.GameObjects.Image;
  private rouletteChosenColor: 'RED' | 'BLACK' = 'RED';
  private sharePriceHud?: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'WorldScene' });
  }

  init(data: { mapId: string; chapterIntro?: ChapterId; spawnX?: number; spawnY?: number }) {
    const newMapId = data.mapId;
    if (newMapId !== this.previousMapId) {
      this.defeatedTrainers.clear();
      this.firedTriggers.clear();
    }
    this.previousMapId = newMapId;
    this.mapId = newMapId;
    this.pendingChapterIntro = data.chapterIntro;
    this.overrideSpawnX = data.spawnX;
    this.overrideSpawnY = data.spawnY;
  }

  create() {
    this.isMoving = false;
    this.isTransitioning = false;
    this.trainerActive = false;
    this.pauseOpen = false;
    this.stepToggle = false;
    this.grassSteps = 0;
    this.firedTriggers.clear();
    this.npcSprites.clear();
    this.pauseContainer = undefined;
    this.pauseArrow = undefined;
    this.pauseDetailText = undefined;
    this.pauseMenuTexts = [];
    this.rouletteOpen = false;
    this.rouletteContainer = undefined;
    this.rouletteMenuTexts = [];
    this.rouletteArrow = undefined;
    (this.map as MapData | undefined) = undefined!;
    (this.player as Phaser.GameObjects.Sprite | undefined) = undefined!;

    // Work NPCs in casino are always re-fightable
    if (this.mapId === 'reddit_casino') {
      this.defeatedTrainers.clear();
    }

    if (this.mapId === 'hall_of_fame') {
      this.scene.start('HallOfFameScene');
      return;
    }

    if (this.pendingChapterIntro) {
      const cid = this.pendingChapterIntro;
      this.pendingChapterIntro = undefined;
      this.showChapterIntroThenBuild(cid);
      return;
    }

    this.buildWorld();
  }

  private showChapterIntroThenBuild(chapterId: ChapterId) {
    const ch = chapters[chapterId];
    const overlay = this.add.container(0, 0).setDepth(4000).setScrollFactor(0);
    overlay.add(
      this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, GB_COLORS.DARKEST),
    );
    overlay.add(
      this.add
        .text(GAME_WIDTH / 2, 110, ch.title, {
          fontFamily: TITLE_FONT,
          fontSize: '10px',
          color: GB_HEX.LIGHTEST,
        })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(GAME_WIDTH / 2, 140, ch.subtitle, {
          fontFamily: TITLE_FONT,
          fontSize: '8px',
          color: GB_HEX.LIGHT,
        })
        .setOrigin(0.5),
    );
    overlay.add(
      this.add
        .text(GAME_WIDTH / 2, 168, ch.year || '—', {
          fontFamily: TITLE_FONT,
          fontSize: '8px',
          color: GB_HEX.DARK,
        })
        .setOrigin(0.5),
    );

    this.time.delayedCall(2000, () => {
      overlay.destroy();
      this.buildWorld();
    });
  }

  private buildWorld() {
    let map = maps[this.mapId];
    if (!map) {
      console.error('Unknown map:', this.mapId);
      this.scene.start('MenuScene');
      return;
    }

    // Deloitte tower: clone objects layer and open floor gates based on progress
    if (this.mapId === 'deloitte_lobby') {
      map = {
        ...map,
        layers: { ground: map.layers.ground, objects: map.layers.objects.map(row => [...row]) },
      };
      const obj = map.layers.objects;
      const floorGates: [number, string][] = [
        [23, 'enc_dt_meta_done'],
        [15, 'enc_dt_cloudflare_done'],
        [7, 'enc_dt_revenue_done'],
      ];
      for (const [y, flag] of floorGates) {
        if (progressManager.getFlag(flag)) {
          for (let x = 5; x <= 8; x++) obj[y]![x] = 0;
        }
      }
    }

    this.map = map;
    this.firedTriggers.clear();
    this.npcSprites.clear();

    if (map.resetFlags?.length) {
      for (const flag of map.resetFlags) {
        progressManager.setFlag(flag, false);
      }
    }

    this.dialogueManager = new DialogueManager(this);

    this.cameras.main.setBackgroundColor(GB_COLORS.DARKEST);
    this.cameras.main.setBounds(0, 0, map.width * TILE_SIZE, map.height * TILE_SIZE);
    this.cameras.main.setZoom(1);

    this.renderMapLayers(map);

    const spawn = map.playerSpawn;
    this.playerGridX = this.overrideSpawnX ?? spawn.x;
    this.playerGridY = this.overrideSpawnY ?? spawn.y;
    this.overrideSpawnX = undefined;
    this.overrideSpawnY = undefined;
    this.facing =
      spawn.facing === 'up'
        ? Direction.UP
        : spawn.facing === 'left'
          ? Direction.LEFT
          : spawn.facing === 'right'
            ? Direction.RIGHT
            : Direction.DOWN;

    this.player = this.add
      .sprite(this.playerGridX * TILE_SIZE, this.playerGridY * TILE_SIZE, DIR_TEXTURE[this.facing])
      .setOrigin(0, 0)
      .setDepth(20);

    this.npcGridPositions.clear();
    map.npcs.forEach((npc: NPCData) => {
      const s = this.add
        .sprite(npc.x * TILE_SIZE, npc.y * TILE_SIZE, npc.sprite)
        .setOrigin(0, 0)
        .setDepth(15);
      this.npcSprites.set(npc.id, s);
      this.npcGridPositions.set(npc.id, { x: npc.x, y: npc.y });
    });

    this.cameras.main.startFollow(this.player, true, 0.25, 0.25);
    this.cameras.main.setDeadzone(2, 2);

    const kb = this.input.keyboard!;
    this.cursors = kb.createCursorKeys();
    this.keyW = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyS = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyEsc = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    this.keySpace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.interactHint = this.add.image(0, 0, 'arrow_indicator').setOrigin(0.5, 1).setDepth(100).setVisible(false);
    this.tweens.add({
      targets: this.interactHint,
      y: '-=3',
      duration: 400,
      yoyo: true,
      repeat: -1,
    });

    // Karma puzzle HUD (only visible on karma maps)
    this.karmaHud = this.add
      .text(4, 4, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: GB_HEX.LIGHTEST,
        backgroundColor: GB_HEX.DARKEST,
        padding: { x: 4, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    this.initKarma();
    if (this.map.karma) this.updateKarmaHud();

    // Share price HUD (casino maps)
    this.sharePriceHud = this.add
      .text(4, 4, '', {
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '8px',
        color: GB_HEX.LIGHTEST,
        backgroundColor: GB_HEX.DARKEST,
        padding: { x: 4, y: 3 },
      })
      .setScrollFactor(0)
      .setDepth(200)
      .setVisible(false);

    if (this.mapId === 'reddit_casino') {
      this.initCasino();
    }

    this.events.once('shutdown', () => {
      this.dialogueManager?.destroy();
      this.pauseContainer?.destroy();
      this.rouletteContainer?.destroy();
    });
  }

  private itemBallSprites: Map<string, Phaser.GameObjects.Image> = new Map();

  private isItemCollected(x: number, y: number): boolean {
    const io = this.map.interactives.find(
      (i) => i.x === x && i.y === y && i.tile === TILE.ITEM_BALL && i.setFlag,
    );
    return !!io && progressManager.getFlag(io.setFlag!);
  }

  private renderMapLayers(map: MapData) {
    const { ground, objects } = map.layers;
    this.itemBallSprites.clear();
    this.karmaGateSprites.clear();
    this.karmaPadSprites.clear();
    const karma = map.karma;

    for (let y = 0; y < map.height; y++) {
      for (let x = 0; x < map.width; x++) {
        const gv = ground[y][x];
        const gkey = TILE_TEXTURE_KEYS[gv] ?? 'tile_void';
        this.add
          .image(x * TILE_SIZE, y * TILE_SIZE, gkey)
          .setOrigin(0, 0)
          .setDepth(0);

        const ov = objects[y][x];
        if (ov !== 0) {
          if (ov === TILE.ITEM_BALL && this.isItemCollected(x, y)) continue;
          const okey = TILE_TEXTURE_KEYS[ov] ?? 'tile_void';
          const img = this.add
            .image(x * TILE_SIZE, y * TILE_SIZE, okey)
            .setOrigin(0, 0)
            .setDepth(1);
          if (ov === TILE.ITEM_BALL) {
            this.itemBallSprites.set(`${x},${y}`, img);
          }
          // Track karma gate sprites for dynamic texture swapping
          if (karma && (ov === TILE.KARMA_DOOR || ov === TILE.KARMA_BRIDGE || ov === TILE.KARMA_BRIDGE_OFF)) {
            const gate = karma.gates.find(g => g.x === x && g.y === y);
            if (gate) this.karmaGateSprites.set(gate.id, img);
          }
        }

        // Track karma pad sprites (pads are on walkable ground layer)
        if (karma && (gv === TILE.UPVOTE_PAD || gv === TILE.DOWNVOTE_PAD || gv === TILE.RESET_PAD)) {
          const pad = karma.pads.find(p => p.x === x && p.y === y);
          if (pad) {
            const groundImg = this.add
              .image(x * TILE_SIZE, y * TILE_SIZE, TILE_TEXTURE_KEYS[gv]!)
              .setOrigin(0, 0)
              .setDepth(1);
            this.karmaPadSprites.set(pad.id, groundImg);
          }
        }
      }
    }
  }

  private applyPlayerFrame(stepping = false) {
    const key = stepping ? DIR_STEP_TEXTURE[this.facing] : DIR_TEXTURE[this.facing];
    this.player.setTexture(key);
  }

  private isWalkable(tx: number, ty: number): boolean {
    const map = this.map;
    if (tx < 0 || ty < 0 || tx >= map.width || ty >= map.height) return false;
    for (const [, pos] of this.npcGridPositions) {
      if (pos.x === tx && pos.y === ty) return false;
    }
    const obj = map.layers.objects[ty][tx];
    if (obj === TILE.ITEM_BALL && this.isItemCollected(tx, ty)) {
      // Collected items are walkable
    } else if ((obj === TILE.KARMA_DOOR || obj === TILE.KARMA_BRIDGE_OFF) && !this.isKarmaGateOpen(tx, ty)) {
      return false;
    } else if ((obj === TILE.KARMA_DOOR || obj === TILE.KARMA_BRIDGE_OFF) && this.isKarmaGateOpen(tx, ty)) {
      // Open karma gate/bridge is walkable
    } else if (obj !== 0 && !(WALKABLE_TILES as Set<number>).has(obj)) {
      return false;
    }
    const g = map.layers.ground[ty][tx];
    return (WALKABLE_TILES as Set<number>).has(g);
  }

  private tryMove(dx: number, dy: number, dir: Direction) {
    if (this.isMoving || this.isTransitioning || this.trainerActive || this.pauseOpen || this.rouletteOpen || this.dialogueManager.getIsOpen()) return;

    this.facing = dir;
    this.applyPlayerFrame();

    const tx = this.playerGridX + dx;
    const ty = this.playerGridY + dy;
    if (!this.isWalkable(tx, ty)) return;

    this.isMoving = true;
    this.stepToggle = !this.stepToggle;
    this.applyPlayerFrame(this.stepToggle);

    this.playerGridX = tx;
    this.playerGridY = ty;

    this.tweens.add({
      targets: this.player,
      x: tx * TILE_SIZE,
      y: ty * TILE_SIZE,
      duration: STEP_DURATION,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.isMoving = false;
        this.applyPlayerFrame(false);
        this.checkKarmaPad();
        this.checkTriggers();
        if (!this.isTransitioning && !this.dialogueManager.getIsOpen()) {
          this.checkTrainerSight();
        }
        if (!this.isTransitioning && !this.dialogueManager.getIsOpen() && !this.trainerActive) {
          this.checkWildGrass();
        }
      },
    });
  }

  private checkTriggers() {
    const px = this.playerGridX;
    const py = this.playerGridY;
    for (const z of this.map.triggers) {
      if (z.oneShot && this.firedTriggers.has(z.id)) continue;
      if (px < z.x || px >= z.x + z.width || py < z.y || py >= z.y + z.height) continue;
      this.handleTrigger(z);
      if (z.oneShot) this.firedTriggers.add(z.id);
    }
  }

  private checkTrainerSight() {
    if (this.trainerActive || this.dialogueManager.getIsOpen()) return;
    const px = this.playerGridX;
    const py = this.playerGridY;
    for (const npc of this.map.npcs) {
      if (!npc.sightRange || npc.sightRange <= 0) continue;
      if (this.defeatedTrainers.has(npc.id)) continue;

      const dir = npc.facing;
      let inSight = false;
      const nx = npc.x;
      const ny = npc.y;

      if (dir === 'down' && px === nx && py > ny && py <= ny + npc.sightRange) inSight = true;
      if (dir === 'up' && px === nx && py < ny && py >= ny - npc.sightRange) inSight = true;
      if (dir === 'right' && py === ny && px > nx && px <= nx + npc.sightRange) inSight = true;
      if (dir === 'left' && py === ny && px < nx && px >= nx - npc.sightRange) inSight = true;

      if (!inSight) continue;

      let blocked = false;
      const dx = dir === 'right' ? 1 : dir === 'left' ? -1 : 0;
      const dy = dir === 'down' ? 1 : dir === 'up' ? -1 : 0;
      let cx = nx + dx;
      let cy = ny + dy;
      while (cx !== px || cy !== py) {
        if (!this.isWalkable(cx, cy)) { blocked = true; break; }
        cx += dx;
        cy += dy;
      }
      if (blocked) continue;

      this.triggerTrainerEncounter(npc);
      return;
    }
  }

  // ─── Karma Puzzle System ────────────────────────────────

  private initKarma() {
    const cfg = this.map.karma;
    if (!cfg) return;
    this.karmaCurrent = cfg.karmaStart;
    this.karmaConsumedPads.clear();
    this.evaluateKarmaGates();
  }

  private checkKarmaPad() {
    const cfg = this.map.karma;
    if (!cfg) return;
    const px = this.playerGridX;
    const py = this.playerGridY;
    for (const pad of cfg.pads) {
      if (pad.x !== px || pad.y !== py) continue;

      if (pad.type === 'reset') {
        this.resetKarmaRoom();
        const seq = dialogues['karma_reset'];
        if (seq) void this.dialogueManager.showSequence(seq.lines);
        return;
      }

      if (pad.oneTime && this.karmaConsumedPads.has(pad.id)) continue;

      if (pad.type === 'upvote') this.karmaCurrent += 1;
      if (pad.type === 'downvote') this.karmaCurrent -= 1;

      if (pad.oneTime) {
        this.karmaConsumedPads.add(pad.id);
        const sprite = this.karmaPadSprites.get(pad.id);
        if (sprite) {
          sprite.setTexture(pad.type === 'upvote' ? 'tile_upvote_off' : 'tile_downvote_off');
        }
      }

      this.evaluateKarmaGates();
      this.updateKarmaHud();
    }
  }

  private evaluateKarmaGates() {
    const cfg = this.map.karma;
    if (!cfg) return;
    for (const gate of cfg.gates) {
      const open = this.karmaCurrent === gate.requiredKarma;
      const sprite = this.karmaGateSprites.get(gate.id);
      if (gate.type === 'door') {
        sprite?.setTexture(open ? 'tile_karma_door_open' : 'tile_karma_door');
      } else {
        sprite?.setTexture(open ? 'tile_bridge_on' : 'tile_bridge_off');
      }
    }
  }

  private isKarmaGateOpen(tx: number, ty: number): boolean {
    const cfg = this.map.karma;
    if (!cfg) return true;
    for (const gate of cfg.gates) {
      if (gate.x === tx && gate.y === ty) {
        return this.karmaCurrent === gate.requiredKarma;
      }
    }
    return true;
  }

  private resetKarmaRoom() {
    const cfg = this.map.karma;
    if (!cfg) return;
    this.karmaCurrent = cfg.karmaStart;
    this.karmaConsumedPads.clear();

    for (const pad of cfg.pads) {
      if (pad.type === 'upvote') {
        this.karmaPadSprites.get(pad.id)?.setTexture('tile_upvote');
      } else if (pad.type === 'downvote') {
        this.karmaPadSprites.get(pad.id)?.setTexture('tile_downvote');
      }
    }

    this.evaluateKarmaGates();
    this.updateKarmaHud();
  }

  private updateKarmaHud() {
    if (!this.karmaHud) return;
    const k = this.karmaCurrent;
    this.karmaHud.setText(`KARMA ${k >= 0 ? '+' : ''}${k}`);
    this.karmaHud.setVisible(true);
  }

  // ─── Casino / Roulette System ──────────────────────────

  private initCasino() {
    if (!progressManager.getFlag('reddit_found_money')) {
      progressManager.setFlag('reddit_found_money');
      progressManager.setSharePrice(20);
      this.time.delayedCall(500, () => {
        const seq = dialogues['reddit_find_money'];
        if (seq) void this.dialogueManager.showSequence(seq.lines);
      });
    }
    this.updateSharePriceHud();

    // Check win condition on re-entry (e.g. after a work battle that hit $200)
    if (progressManager.getSharePrice() >= 200) {
      this.time.delayedCall(800, () => {
        this.triggerCasinoWin();
      });
    }
  }

  private updateSharePriceHud() {
    if (!this.sharePriceHud) return;
    const price = progressManager.getSharePrice();
    this.sharePriceHud.setText(`RDDT $${price}`);
    this.sharePriceHud.setVisible(this.mapId === 'reddit_casino');
  }

  private openRouletteGame() {
    if (progressManager.getSharePrice() >= 200) {
      this.triggerCasinoWin();
      return;
    }
    this.rouletteOpen = true;
    this.roulettePhase = 'wager';
    this.rouletteMenuIndex = 0;
    this.buildRoulettePanel();
  }

  private closeRouletteGame() {
    this.rouletteOpen = false;
    this.rouletteContainer?.destroy();
    this.rouletteContainer = undefined;
    this.rouletteMenuTexts = [];
    this.rouletteArrow = undefined;
    this.updateSharePriceHud();
  }

  private buildRoulettePanel() {
    this.rouletteContainer?.destroy();
    this.rouletteContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);

    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5);
    this.rouletteContainer.add(bg);

    const price = progressManager.getSharePrice();

    const title = this.add.text(GAME_WIDTH / 2, 42, 'r/WSB ROULETTE', {
      fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARKEST,
    }).setOrigin(0.5);
    this.rouletteContainer.add(title);

    const priceText = this.add.text(GAME_WIDTH / 2, 62, `RDDT: $${price}`, {
      fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARK,
    }).setOrigin(0.5);
    this.rouletteContainer.add(priceText);

    if (this.roulettePhase === 'wager') {
      this.buildWagerMenu(price);
    } else if (this.roulettePhase === 'color') {
      this.buildColorMenu();
    } else if (this.roulettePhase === 'result') {
      this.buildResultDisplay();
    }
  }

  private buildWagerMenu(price: number) {
    this.rouletteMenuOptions = [];
    this.rouletteMenuTexts = [];

    const prompt = this.add.text(GAME_WIDTH / 2, 86, price > 0 ? 'Place your bet:' : 'You\'re broke!', {
      fontFamily: TITLE_FONT, fontSize: '6px', color: GB_HEX.DARKEST,
    }).setOrigin(0.5);
    this.rouletteContainer!.add(prompt);

    if (price > 0) {
      if (price >= 5) this.rouletteMenuOptions.push({ label: 'Bet $5', value: 5 });
      if (price >= 10) this.rouletteMenuOptions.push({ label: 'Bet $10', value: 10 });
      if (price >= 25) this.rouletteMenuOptions.push({ label: 'Bet $25', value: 25 });
      if (price >= 50) this.rouletteMenuOptions.push({ label: 'Bet $50', value: 50 });
      this.rouletteMenuOptions.push({ label: `ALL IN ($${price})`, value: price });
      this.rouletteMenuOptions.push({ label: 'Walk Away', value: 'exit' });
    } else {
      this.rouletteMenuOptions.push({ label: 'Work (earn $50)', value: 'work' });
      this.rouletteMenuOptions.push({ label: 'Walk Away', value: 'exit' });
    }

    const startY = 108;
    const gap = 22;
    this.rouletteMenuOptions.forEach((opt, i) => {
      const t = this.add.text(GAME_WIDTH / 2 + 8, startY + i * gap, opt.label, {
        fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARK,
      }).setOrigin(0, 0.5);
      this.rouletteContainer!.add(t);
      this.rouletteMenuTexts.push(t);
    });

    if (this.rouletteMenuIndex >= this.rouletteMenuOptions.length) {
      this.rouletteMenuIndex = 0;
    }

    this.rouletteArrow = this.add.image(GAME_WIDTH / 2 - 72, startY, 'arrow_indicator')
      .setOrigin(0.5).setScrollFactor(0);
    this.rouletteContainer!.add(this.rouletteArrow);
    this.refreshRouletteHighlight();
  }

  private buildColorMenu() {
    this.rouletteMenuOptions = [
      { label: 'RED', value: 'RED' },
      { label: 'BLACK', value: 'BLACK' },
    ];
    this.rouletteMenuTexts = [];

    const betText = this.add.text(GAME_WIDTH / 2, 86, `Bet: $${this.rouletteWager}`, {
      fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARKEST,
    }).setOrigin(0.5);
    this.rouletteContainer!.add(betText);

    const prompt = this.add.text(GAME_WIDTH / 2, 108, 'Pick a color:', {
      fontFamily: TITLE_FONT, fontSize: '6px', color: GB_HEX.DARKEST,
    }).setOrigin(0.5);
    this.rouletteContainer!.add(prompt);

    const startY = 136;
    const gap = 28;
    this.rouletteMenuOptions.forEach((opt, i) => {
      const t = this.add.text(GAME_WIDTH / 2 + 8, startY + i * gap, opt.label, {
        fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARK,
      }).setOrigin(0, 0.5);
      this.rouletteContainer!.add(t);
      this.rouletteMenuTexts.push(t);
    });

    this.rouletteMenuIndex = 0;
    this.rouletteArrow = this.add.image(GAME_WIDTH / 2 - 72, startY, 'arrow_indicator')
      .setOrigin(0.5).setScrollFactor(0);
    this.rouletteContainer!.add(this.rouletteArrow);
    this.refreshRouletteHighlight();
  }

  private buildResultDisplay() {
    // Already built in spinRoulette callback
  }

  private refreshRouletteHighlight() {
    if (!this.rouletteArrow || this.rouletteMenuTexts.length === 0) return;
    let startY: number;
    let gap: number;
    if (this.roulettePhase === 'color') { startY = 136; gap = 28; }
    else if (this.roulettePhase === 'result') { startY = 180; gap = 22; }
    else { startY = 108; gap = 22; }
    this.rouletteArrow.setY(startY + this.rouletteMenuIndex * gap);
    this.rouletteMenuTexts.forEach((t, i) => {
      t.setColor(i === this.rouletteMenuIndex ? GB_HEX.DARKEST : GB_HEX.DARK);
    });
  }

  private rouletteNavigate(delta: number) {
    if (!this.rouletteOpen || !this.rouletteContainer) return;
    const n = this.rouletteMenuOptions.length;
    if (n === 0) return;
    this.rouletteMenuIndex = (this.rouletteMenuIndex + delta + n) % n;
    this.refreshRouletteHighlight();
  }

  private rouletteConfirm() {
    if (!this.rouletteOpen) return;
    const opt = this.rouletteMenuOptions[this.rouletteMenuIndex];
    if (!opt) return;

    if (this.roulettePhase === 'wager') {
      if (opt.value === 'exit') {
        this.closeRouletteGame();
        return;
      }
      if (opt.value === 'work') {
        this.startWorkBattle();
        return;
      }
      this.rouletteWager = opt.value as number;
      this.roulettePhase = 'color';
      this.rouletteMenuIndex = 0;
      this.buildRoulettePanel();
    } else if (this.roulettePhase === 'color') {
      this.rouletteChosenColor = opt.value as 'RED' | 'BLACK';
      this.spinRoulette();
    } else if (this.roulettePhase === 'result') {
      const price = progressManager.getSharePrice();
      if (price >= 200) {
        this.closeRouletteGame();
        this.triggerCasinoWin();
        return;
      }
      this.roulettePhase = 'wager';
      this.rouletteMenuIndex = 0;
      this.buildRoulettePanel();
    }
  }

  private spinRoulette() {
    this.roulettePhase = 'spinning';
    this.rouletteContainer?.destroy();
    this.rouletteContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);

    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5);
    this.rouletteContainer.add(bg);

    this.rouletteContainer.add(
      this.add.text(GAME_WIDTH / 2, 42, 'r/WSB ROULETTE', {
        fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5)
    );

    const spinText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 20, 'Spinning...', {
      fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARKEST,
    }).setOrigin(0.5);
    this.rouletteContainer.add(spinText);

    const flashText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10, '', {
      fontFamily: TITLE_FONT, fontSize: '10px', color: GB_HEX.DARK,
    }).setOrigin(0.5);
    this.rouletteContainer.add(flashText);

    let flashes = 0;
    const flashTimer = this.time.addEvent({
      delay: 150,
      repeat: 9,
      callback: () => {
        flashText.setText(flashes % 2 === 0 ? 'RED' : 'BLACK');
        flashes++;
      },
    });

    const won = Math.random() < 0.5;
    const resultColor = won ? this.rouletteChosenColor : (this.rouletteChosenColor === 'RED' ? 'BLACK' : 'RED');

    this.time.delayedCall(1700, () => {
      flashTimer.remove(false);
      this.showRouletteResult(won, resultColor);
    });
  }

  private showRouletteResult(won: boolean, resultColor: string) {
    const wager = this.rouletteWager;
    if (won) {
      progressManager.addSharePrice(wager);
    } else {
      progressManager.addSharePrice(-wager);
    }
    const newPrice = progressManager.getSharePrice();
    this.updateSharePriceHud();

    this.roulettePhase = 'result';
    this.rouletteContainer?.destroy();
    this.rouletteContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);

    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5);
    this.rouletteContainer.add(bg);

    this.rouletteContainer.add(
      this.add.text(GAME_WIDTH / 2, 42, 'r/WSB ROULETTE', {
        fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5)
    );

    this.rouletteContainer.add(
      this.add.text(GAME_WIDTH / 2, 72, `Ball lands on ${resultColor}!`, {
        fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5)
    );

    const outcomeMsg = won ? `You win $${wager}!` : `You lose $${wager}!`;
    this.rouletteContainer.add(
      this.add.text(GAME_WIDTH / 2, 96, outcomeMsg, {
        fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5)
    );

    this.rouletteContainer.add(
      this.add.text(GAME_WIDTH / 2, 120, `RDDT: $${newPrice}`, {
        fontFamily: TITLE_FONT, fontSize: '8px', color: GB_HEX.DARKEST,
      }).setOrigin(0.5)
    );

    let statusMsg = '';
    if (newPrice >= 200) {
      statusMsg = 'TARGET REACHED!';
    } else if (newPrice <= 0) {
      statusMsg = 'You\'re broke!';
    }
    if (statusMsg) {
      this.rouletteContainer.add(
        this.add.text(GAME_WIDTH / 2, 146, statusMsg, {
          fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARKEST,
        }).setOrigin(0.5)
      );
    }

    this.rouletteMenuOptions = [{ label: 'Continue', value: 'continue' }];
    this.rouletteMenuTexts = [];

    const btnY = 180;
    const t = this.add.text(GAME_WIDTH / 2 + 8, btnY, 'Continue', {
      fontFamily: TITLE_FONT, fontSize: '7px', color: GB_HEX.DARK,
    }).setOrigin(0, 0.5);
    this.rouletteContainer.add(t);
    this.rouletteMenuTexts.push(t);

    this.rouletteMenuIndex = 0;
    this.rouletteArrow = this.add.image(GAME_WIDTH / 2 - 72, btnY, 'arrow_indicator')
      .setOrigin(0.5).setScrollFactor(0);
    this.rouletteContainer.add(this.rouletteArrow);
    this.refreshRouletteHighlight();
  }

  private startWorkBattle() {
    this.closeRouletteGame();
    const workEncounters = ['reddit_work_sox', 'reddit_work_integration', 'reddit_work_close'];
    const idx = Phaser.Math.Between(0, workEncounters.length - 1);
    const encounterId = workEncounters[idx];

    this.isTransitioning = true;
    this.cameras.main.fadeOut(220, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('EncounterScene', {
        encounterId,
        returnMap: this.mapId,
        returnX: this.playerGridX,
        returnY: this.playerGridY,
      });
    });
  }

  private triggerCasinoWin() {
    if (progressManager.getFlag('reddit_casino_won')) {
      this.transitionToMap('hall_of_fame');
      return;
    }
    progressManager.setFlag('reddit_casino_won');
    progressManager.addBadge('Scale Badge');

    void this.dialogueManager.showSequence([
      { text: 'RDDT share price hit $200! TO THE MOON!' },
      { text: 'Diamond hands paid off. The Reddit IPO is a success!' },
      { text: 'Kevin received the SCALE BADGE!' },
      { text: 'Finance Applications Manager — order management, integrations, SOX, data pipelines.' },
      { text: 'Month-end close: 12 days to 3. Revenue: $200M to $2.2B+.' },
    ], () => {
      this.transitionToMap('hall_of_fame');
    });
  }

  private checkWildGrass() {
    if (progressManager.getFlag('snoo_caught')) return;
    if (this.mapId !== 'reddit_campus') return;
    const g = this.map.layers.ground[this.playerGridY]?.[this.playerGridX];
    if (g !== TILE.GRASS) { this.grassSteps = 0; return; }
    this.grassSteps++;
    if (this.grassSteps >= 5) {
      this.grassSteps = 0;
      this.isTransitioning = true;
      this.cameras.main.fadeOut(220, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('EncounterScene', {
          encounterId: 'reddit_wild_snoo',
          returnMap: this.mapId,
          returnX: this.playerGridX,
          returnY: this.playerGridY,
        });
      });
    }
  }

  private triggerTrainerEncounter(npc: NPCData) {
    this.trainerActive = true;
    this.isMoving = true;

    const sprite = this.npcSprites.get(npc.id);
    if (!sprite) { this.trainerActive = false; this.isMoving = false; return; }

    const pos = this.npcGridPositions.get(npc.id);
    if (!pos) { this.trainerActive = false; this.isMoving = false; return; }

    // "!" exclamation bubble above the trainer (Pokemon-style)
    const exclam = this.add.text(
      sprite.x + TILE_SIZE / 2,
      sprite.y - 4,
      '!',
      { fontFamily: TITLE_FONT, fontSize: '12px', color: GB_HEX.DARKEST },
    ).setOrigin(0.5, 1).setDepth(50);

    const bg = this.add.rectangle(
      exclam.x, exclam.y - exclam.height / 2,
      14, 14,
      GB_COLORS.LIGHTEST,
    ).setDepth(49).setStrokeStyle(1, GB_COLORS.DARKEST);

    const dx = npc.facing === 'right' ? 1 : npc.facing === 'left' ? -1 : 0;
    const dy = npc.facing === 'down' ? 1 : npc.facing === 'up' ? -1 : 0;

    const targetX = this.playerGridX - dx;
    const targetY = this.playerGridY - dy;
    const stepsX = Math.abs(targetX - pos.x);
    const stepsY = Math.abs(targetY - pos.y);
    const steps = Math.max(stepsX, stepsY);

    // Pause briefly showing "!" then walk toward the player
    this.time.delayedCall(500, () => {
      exclam.destroy();
      bg.destroy();

      if (steps <= 0) {
        this.finishTrainerApproach(npc);
        return;
      }

      pos.x = targetX;
      pos.y = targetY;

      this.tweens.add({
        targets: sprite,
        x: targetX * TILE_SIZE,
        y: targetY * TILE_SIZE,
        duration: STEP_DURATION * steps,
        ease: 'Linear',
        onComplete: () => {
          this.finishTrainerApproach(npc);
        },
      });
    });
  }

  private finishTrainerApproach(npc: NPCData) {
    this.isMoving = false;
    this.trainerActive = false;
    this.defeatedTrainers.add(npc.id);

    if (npc.encounterId) {
      const enc = encounters[npc.encounterId];
      if (enc) {
        if (npc.interactedFlag) progressManager.setFlag(npc.interactedFlag);
        if (npc.dialogueKey) {
          const seq = dialogues[npc.dialogueKey];
          if (seq?.setFlag) progressManager.setFlag(seq.setFlag);
        }
        this.isTransitioning = true;
        this.cameras.main.fadeOut(220, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('EncounterScene', {
            encounterId: npc.encounterId!,
            returnMap: this.mapId,
            returnX: this.playerGridX,
            returnY: this.playerGridY,
          });
        });
        return;
      }
    }

    const seq = dialogues[npc.dialogueKey];
    if (seq) {
      void this.dialogueManager.showSequence(seq.lines, () => {
        if (seq.setFlag) progressManager.setFlag(seq.setFlag);
        if (npc.interactedFlag) progressManager.setFlag(npc.interactedFlag);
      });
    }
  }

  private handleTrigger(z: TriggerZone) {
    switch (z.type) {
      case 'transition':
        if (z.setFlag) progressManager.setFlag(z.setFlag);
        if (z.target) this.transitionToMap(z.target, z.spawnX, z.spawnY);
        break;
      case 'encounter': {
        const eid = z.encounterId;
        if (!eid) break;
        const enc = encounters[eid];
        if (!enc) break;
        if (enc.setFlag && progressManager.getFlag(enc.setFlag)) break;
        this.isTransitioning = true;
        this.cameras.main.fadeOut(220, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
          this.scene.start('EncounterScene', {
            encounterId: eid,
            returnMap: this.mapId,
            returnX: this.playerGridX,
            returnY: this.playerGridY,
          });
        });
        break;
      }
      case 'gate':
        if (z.requiredFlags?.length && !progressManager.hasAllFlags(z.requiredFlags)) {
          if (z.dialogueKey) {
            const seq = dialogues[z.dialogueKey];
            if (seq) this.playDialogue(seq);
          }
        } else if (z.target) {
          this.transitionToMap(z.target, z.spawnX, z.spawnY);
        }
        break;
      case 'cutscene':
      case 'item':
        if (z.requiredFlags?.length && !progressManager.hasAllFlags(z.requiredFlags)) break;
        if (z.dialogueKey) {
          const seq = dialogues[z.dialogueKey];
          if (seq) this.playDialogue(seq);
        }
        if (z.setFlag) progressManager.setFlag(z.setFlag);
        break;
      default:
        break;
    }
  }

  private transitionToMap(targetMapId: string, spawnX?: number, spawnY?: number) {
    const next = maps[targetMapId];
    if (!next) return;
    this.isTransitioning = true;
    const prevChapter = this.map.chapterId;
    progressManager.setCurrentChapter(next.chapterId);
    progressManager.setCurrentMap(targetMapId);
    const needIntro = prevChapter !== next.chapterId;
    this.cameras.main.fadeOut(240, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (targetMapId === 'hall_of_fame') {
        this.scene.start('HallOfFameScene');
        return;
      }
      this.scene.start('WorldScene', {
        mapId: targetMapId,
        chapterIntro: needIntro ? next.chapterId : undefined,
        spawnX,
        spawnY,
      });
    });
  }

  private playDialogue(seq: DialogueSequence) {
    void this.dialogueManager.showSequence(seq.lines, () => {
      if (seq.setFlag) progressManager.setFlag(seq.setFlag);
    });
  }

  private tryInteract() {
    if (this.isMoving || this.pauseOpen || this.rouletteOpen || this.dialogueManager.getIsOpen()) return;
    const off = DIR_OFFSET[this.facing];
    const fx = this.playerGridX + off.x;
    const fy = this.playerGridY + off.y;

    const npc = this.map.npcs.find((n) => {
      const gp = this.npcGridPositions.get(n.id);
      const nx = gp ? gp.x : n.x;
      const ny = gp ? gp.y : n.y;
      return nx === fx && ny === fy;
    });
    if (npc) {
      // Roulette dealer opens the casino game instead of dialogue
      if (npc.id === 'npc_roulette_dealer') {
        this.openRouletteGame();
        return;
      }

      if (npc.requiredFlags?.length && !progressManager.hasAllFlags(npc.requiredFlags)) {
        const blockedKey = npc.blockedDialogueKey;
        if (blockedKey) {
          const seq = dialogues[blockedKey];
          if (seq) void this.dialogueManager.showSequence(seq.lines);
        }
        return;
      }
      if (npc.encounterId && !this.defeatedTrainers.has(npc.id)) {
        const enc = encounters[npc.encounterId];
        if (enc) {
          this.defeatedTrainers.add(npc.id);
          if (npc.interactedFlag) progressManager.setFlag(npc.interactedFlag);
          if (npc.dialogueKey) {
            const dseq = dialogues[npc.dialogueKey];
            if (dseq?.setFlag) progressManager.setFlag(dseq.setFlag);
          }
          this.isTransitioning = true;
          this.cameras.main.fadeOut(220, 0, 0, 0);
          this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('EncounterScene', {
              encounterId: npc.encounterId!,
              returnMap: this.mapId,
              returnX: this.playerGridX,
              returnY: this.playerGridY,
            });
          });
          return;
        }
      }
      if (npc.afterInteractDialogueKey && npc.interactedFlag && progressManager.getFlag(npc.interactedFlag)) {
        const afterSeq = dialogues[npc.afterInteractDialogueKey];
        if (afterSeq) void this.dialogueManager.showSequence(afterSeq.lines);
        return;
      }
      const seq = dialogues[npc.dialogueKey];
      if (seq) {
        void this.dialogueManager.showSequence(seq.lines, () => {
          if (seq.setFlag) progressManager.setFlag(seq.setFlag);
          if (npc.interactedFlag) progressManager.setFlag(npc.interactedFlag);
          if (npc.showReceivedPokemon) {
            this.showReceivedPokemonOverlay(npc.showReceivedPokemon, () => {});
          }
        });
      }
      return;
    }

    const io = this.map.interactives.find((i) => i.x === fx && i.y === fy);
    if (io) {
      if (io.tile === TILE.ITEM_BALL && io.setFlag && progressManager.getFlag(io.setFlag)) return;
      if (io.requiredFlags?.length && !progressManager.hasAllFlags(io.requiredFlags)) return;
      const seq = dialogues[io.dialogueKey];
      if (seq) {
        void this.dialogueManager.showSequence(seq.lines, () => {
          if (seq.setFlag) progressManager.setFlag(seq.setFlag);
          if (io.setFlag) progressManager.setFlag(io.setFlag);
          if (io.tile === TILE.ITEM_BALL) {
            const sprite = this.itemBallSprites.get(`${io.x},${io.y}`);
            sprite?.destroy();
            this.itemBallSprites.delete(`${io.x},${io.y}`);
          }
        });
      }
      return;
    }

    const g = this.map.layers.ground[fy]?.[fx];
    const o = this.map.layers.objects[fy]?.[fx];
    const tileForInteract = o !== 0 && o !== undefined ? o : g;
    if (tileForInteract !== undefined && (INTERACTIVE_TILES as Set<number>).has(tileForInteract)) {
      const match = this.map.interactives.find(
        (i) => i.x === fx && i.y === fy && i.tile === tileForInteract,
      );
      if (match) {
        if (match.tile === TILE.ITEM_BALL && match.setFlag && progressManager.getFlag(match.setFlag)) return;
        if (match.requiredFlags?.length && !progressManager.hasAllFlags(match.requiredFlags)) return;
        const seq = dialogues[match.dialogueKey];
        if (seq) {
          void this.dialogueManager.showSequence(seq.lines, () => {
            if (seq.setFlag) progressManager.setFlag(seq.setFlag);
            if (match.setFlag) progressManager.setFlag(match.setFlag);
            if (match.tile === TILE.ITEM_BALL) {
              const sprite = this.itemBallSprites.get(`${match.x},${match.y}`);
              sprite?.destroy();
              this.itemBallSprites.delete(`${match.x},${match.y}`);
            }
          });
        }
      }
    }
  }

  private togglePause() {
    if (this.dialogueManager.getIsOpen()) return;
    this.pauseOpen = !this.pauseOpen;
    if (this.pauseOpen) {
      this.pausePanel = 'main';
      this.pauseMenuIndex = 0;
      this.openPauseMenu();
    } else {
      this.closePauseMenu();
    }
  }

  private openPauseMenu() {
    this.pauseContainer?.destroy();
    this.pauseContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);
    const bg = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5);
    this.pauseContainer.add(bg);
    this.pauseMenuLabels = [
      'RESUME',
      'BADGES',
      'PROCESSDEX',
      'RESUME (PDF)',
      'CONTACT',
    ];
    this.pauseMenuTexts = [];
    const startY = 72;
    const gap = 22;
    this.pauseMenuLabels.forEach((label, i) => {
      const t = this.add
        .text(GAME_WIDTH / 2 + 8, startY + i * gap, label, {
          fontFamily: TITLE_FONT,
          fontSize: '7px',
          color: GB_HEX.DARK,
        })
        .setOrigin(0, 0.5);
      this.pauseContainer!.add(t);
      this.pauseMenuTexts.push(t);
    });
    this.pauseArrow = this.add
      .image(GAME_WIDTH / 2 - 72, startY, 'arrow_indicator')
      .setOrigin(0.5)
      .setScrollFactor(0);
    this.pauseContainer.add(this.pauseArrow);
    this.refreshPauseHighlight();
  }

  private closePauseMenu() {
    this.pauseContainer?.destroy();
    this.pauseContainer = undefined;
    this.pauseMenuTexts = [];
    this.pauseArrow = undefined;
    this.pauseDetailText = undefined;
    this.pausePanel = 'main';
  }

  private refreshPauseHighlight() {
    if (!this.pauseArrow || this.pauseMenuTexts.length === 0) return;
    const startY = 72;
    const gap = 22;
    this.pauseArrow.setY(startY + this.pauseMenuIndex * gap);
    this.pauseMenuTexts.forEach((t, i) => {
      t.setColor(i === this.pauseMenuIndex ? GB_HEX.DARKEST : GB_HEX.DARK);
    });
  }

  private pauseNavigate(delta: number) {
    if (!this.pauseOpen || !this.pauseContainer) return;
    if (this.pausePanel === 'main') {
      const n = this.pauseMenuLabels.length;
      this.pauseMenuIndex = (this.pauseMenuIndex + delta + n) % n;
      this.refreshPauseHighlight();
    }
  }

  private pauseConfirm() {
    if (!this.pauseOpen) return;
    if (this.pausePanel === 'badges' || this.pausePanel === 'processdex') {
      this.pausePanel = 'main';
      this.pauseMenuIndex = 1;
      this.rebuildPauseMain();
      return;
    }
    const choice = this.pauseMenuLabels[this.pauseMenuIndex];
    switch (choice) {
      case 'RESUME':
        this.togglePause();
        break;
      case 'BADGES':
        this.showPauseBadges();
        break;
      case 'PROCESSDEX':
        this.showPauseProcessDex();
        break;
      case 'RESUME (PDF)':
        this.game.events.emit('open_link', '/Kevin_Hannigan_Resume.pdf');
        break;
      case 'CONTACT':
        this.game.events.emit('open_link', 'mailto:kevin@example.com');
        break;
      default:
        break;
    }
  }

  private rebuildPauseMain() {
    this.openPauseMenu();
  }

  private showPauseBadges() {
    this.pausePanel = 'badges';
    this.pauseContainer?.destroy();
    this.pauseContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);
    this.pauseContainer.add(this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5));
    const owned = new Set(progressManager.getBadges());
    const lines = EXPECTED_BADGES.map((b) => `${owned.has(b) ? '★' : '·'} ${b}`);
    this.pauseDetailText = this.add
      .text(72, 56, `BADGES\n\n${lines.join('\n')}`, {
        fontFamily: TITLE_FONT,
        fontSize: '6px',
        color: GB_HEX.DARKEST,
        lineSpacing: 8,
      })
      .setOrigin(0, 0);
    this.pauseContainer.add(this.pauseDetailText);
    this.pauseContainer.add(
      this.add
        .text(72, 248, 'ENTER: back', {
          fontFamily: TITLE_FONT,
          fontSize: '6px',
          color: GB_HEX.DARK,
        })
        .setOrigin(0, 0.5),
    );
    this.pauseMenuTexts = [];
  }

  private showPauseProcessDex() {
    this.pausePanel = 'processdex';
    this.pauseContainer?.destroy();
    this.pauseContainer = this.add.container(0, 0).setDepth(3500).setScrollFactor(0);
    this.pauseContainer.add(this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, 'menu_bg').setOrigin(0.5));
    const ids = progressManager.getProcessDex();
    const lines =
      ids.length === 0
        ? '(empty)'
        : ids
            .map((id) => {
              const e = processDex[id];
              return e ? e.title : id;
            })
            .join('\n');
    this.pauseDetailText = this.add
      .text(56, 48, `PROCESSDEX\n\n${lines}`, {
        fontFamily: TITLE_FONT,
        fontSize: '5px',
        color: GB_HEX.DARKEST,
        lineSpacing: 6,
        wordWrap: { width: 200 },
      })
      .setOrigin(0, 0);
    this.pauseContainer.add(this.pauseDetailText);
    this.pauseContainer.add(
      this.add
        .text(72, 248, 'ENTER: back', {
          fontFamily: TITLE_FONT,
          fontSize: '6px',
          color: GB_HEX.DARK,
        })
        .setOrigin(0, 0.5),
    );
    this.pauseMenuTexts = [];
  }

  update() {
    if (!this.map || !this.player) return;

    if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
      this.togglePause();
      return;
    }

    if (this.pauseOpen) {
      if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) || Phaser.Input.Keyboard.JustDown(this.keyW)) {
        this.pauseNavigate(-1);
      } else if (
        Phaser.Input.Keyboard.JustDown(this.cursors.down!) ||
        Phaser.Input.Keyboard.JustDown(this.keyS)
      ) {
        this.pauseNavigate(1);
      } else if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.pauseConfirm();
      }
      return;
    }

    if (this.rouletteOpen) {
      if (this.roulettePhase !== 'spinning') {
        if (Phaser.Input.Keyboard.JustDown(this.cursors.up!) || Phaser.Input.Keyboard.JustDown(this.keyW)) {
          this.rouletteNavigate(-1);
        } else if (Phaser.Input.Keyboard.JustDown(this.cursors.down!) || Phaser.Input.Keyboard.JustDown(this.keyS)) {
          this.rouletteNavigate(1);
        } else if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
          this.rouletteConfirm();
        } else if (Phaser.Input.Keyboard.JustDown(this.keyEsc)) {
          this.closeRouletteGame();
        }
      }
      return;
    }

    if (this.dialogueManager.getIsOpen()) {
      if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
        this.dialogueManager.advance();
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyEnter) || Phaser.Input.Keyboard.JustDown(this.keySpace)) {
      this.tryInteract();
      return;
    }

    const dir = this.readDirectionInput();
    if (dir !== null) {
      const off = DIR_OFFSET[dir];
      this.tryMove(off.x, off.y, dir);
    }

    this.updateInteractHint();
  }

  private readDirectionInput(): Direction | null {
    if (this.cursors.left!.isDown || this.keyA.isDown) return Direction.LEFT;
    if (this.cursors.right!.isDown || this.keyD.isDown) return Direction.RIGHT;
    if (this.cursors.up!.isDown || this.keyW.isDown) return Direction.UP;
    if (this.cursors.down!.isDown || this.keyS.isDown) return Direction.DOWN;
    return null;
  }

  private updateInteractHint() {
    if (!this.interactHint || this.pauseOpen || this.rouletteOpen || this.dialogueManager.getIsOpen()) {
      this.interactHint?.setVisible(false);
      return;
    }
    const off = DIR_OFFSET[this.facing];
    const fx = this.playerGridX + off.x;
    const fy = this.playerGridY + off.y;
    const hasNpc = this.map.npcs.some((n) => n.x === fx && n.y === fy);
    const hasInteractive = this.map.interactives.some(
      (i) => i.x === fx && i.y === fy &&
        !(i.tile === TILE.ITEM_BALL && i.setFlag && progressManager.getFlag(i.setFlag)),
    );
    if (hasNpc || hasInteractive) {
      this.interactHint.setPosition(fx * TILE_SIZE + TILE_SIZE / 2, fy * TILE_SIZE - 2);
      this.interactHint.setVisible(true);
    } else {
      this.interactHint.setVisible(false);
    }
  }

  private showReceivedPokemonOverlay(
    info: NonNullable<NPCData['showReceivedPokemon']>,
    onDone: () => void,
  ) {
    const FONT = '"Press Start 2P", monospace';
    const cx = GAME_WIDTH / 2;
    const cy = 75;

    const container = this.add.container(0, 0).setDepth(100);

    const bg = this.add.rectangle(cx, cy, 200, 110, GB_COLORS.LIGHTEST)
      .setStrokeStyle(3, GB_COLORS.DARKEST).setDepth(100);
    const inner = this.add.rectangle(cx, cy, 192, 102, GB_COLORS.LIGHTEST)
      .setStrokeStyle(1, GB_COLORS.DARKEST).setDepth(100);
    container.add([bg, inner]);

    const portrait = this.add.image(cx - 60, cy - 10, info.sprite)
      .setOrigin(0.5).setDepth(101);
    container.add(portrait);

    const lx = cx - 15;
    const mkText = (x: number, y: number, text: string, size = '6px', color: string = GB_HEX.DARKEST) => {
      const t = this.add.text(x, y, text, { fontFamily: FONT, fontSize: size, color }).setDepth(101);
      container.add(t);
      return t;
    };

    mkText(lx, cy - 40, info.name, '8px');
    mkText(lx, cy - 28, `Lv ${info.level}`, '6px', GB_HEX.DARK);
    mkText(lx, cy - 16, `Type: ${info.type}`, '6px', GB_HEX.DARK);

    info.moves.forEach((move, i) => {
      const prefix = i === 0 ? 'ATK: ' : 'SP: ';
      mkText(lx, cy - 4 + i * 12, `${prefix}${move}`, '6px', GB_HEX.DARK);
    });

    const hpY = cy - 4 + info.moves.length * 12 + 4;
    mkText(lx, hpY, 'HP', '6px', GB_HEX.DARK);
    const barBg = this.add.rectangle(lx + 16, hpY + 3, 50, 5, GB_COLORS.DARK)
      .setOrigin(0, 0.5).setDepth(101);
    const barFill = this.add.rectangle(lx + 17, hpY + 3, 48, 3, GB_COLORS.DARKEST)
      .setOrigin(0, 0.5).setDepth(102);
    container.add([barBg, barFill]);

    const dismiss = () => {
      this.input.keyboard!.off('keydown', keyHandler);
      this.input.off('pointerdown', dismiss);
      container.destroy(true);
      onDone();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.code === 'Enter' || e.code === 'Space') dismiss();
    };

    this.time.delayedCall(400, () => {
      this.input.keyboard!.on('keydown', keyHandler);
      this.input.once('pointerdown', dismiss);
    });
  }
}
