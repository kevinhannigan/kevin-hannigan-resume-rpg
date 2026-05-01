import { ChapterId } from './constants';

export interface NPCData {
  id: string;
  x: number;
  y: number;
  sprite: string;
  facing: 'up' | 'down' | 'left' | 'right';
  dialogueKey: string;
  name?: string;
  interactedFlag?: string;
  sightRange?: number;
  encounterId?: string;
  requiredFlags?: string[];
  blockedDialogueKey?: string;
  afterInteractDialogueKey?: string;
  processDexEntry?: string;
  showReceivedPokemon?: {
    name: string;
    level: number;
    type: string;
    sprite: string;
    moves: string[];
  };
}

export interface TriggerZone {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'transition' | 'encounter' | 'cutscene' | 'gate' | 'item';
  target?: string;
  spawnX?: number;
  spawnY?: number;
  encounterId?: string;
  requiredFlags?: string[];
  requiredFlagsMinCount?: number;
  setFlag?: string;
  dialogueKey?: string;
  oneShot?: boolean;
}

export interface InteractiveObject {
  id: string;
  x: number;
  y: number;
  tile: number;
  dialogueKey: string;
  setFlag?: string;
  requiredFlags?: string[];
}

export interface KarmaPad {
  id: string;
  type: 'upvote' | 'downvote' | 'reset';
  x: number;
  y: number;
  oneTime: boolean;
}

export interface KarmaGate {
  id: string;
  type: 'door' | 'bridge';
  x: number;
  y: number;
  requiredKarma: number;
}

export interface KarmaConfig {
  karmaStart: number;
  pads: KarmaPad[];
  gates: KarmaGate[];
}

export interface MapData {
  id: string;
  chapterId: ChapterId;
  name: string;
  width: number;
  height: number;
  layers: {
    ground: number[][];
    objects: number[][];
  };
  playerSpawn: { x: number; y: number; facing: 'up' | 'down' | 'left' | 'right' };
  npcs: NPCData[];
  triggers: TriggerZone[];
  interactives: InteractiveObject[];
  resetFlags?: string[];
  karma?: KarmaConfig;
}

export interface DialogueLine {
  speaker?: string;
  text: string;
  speed?: number;
}

export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  setFlag?: string;
}

export interface EncounterData {
  id: string;
  title: string;
  enemyName: string;
  enemyLevel: number;
  description: string;
  question?: string;
  moves?: { label: string; response: string }[];
  victoryText: string[];
  defeatText?: string[];
  badgeReward?: string;
  processDexEntry?: string;
  setFlag?: string;
  nextEncounterId?: string;
  isCatchEncounter?: boolean;
  enemySprite?: string;
  moneyReward?: number;
}

export interface ChapterData {
  id: ChapterId;
  title: string;
  subtitle: string;
  year: string;
  summary: string;
  badge?: string;
  maps: string[];
}

export interface ProcessDexEntry {
  id: string;
  title: string;
  category: string;
  problem: string;
  systems: string;
  result: string;
  chapter: ChapterId;
}

export type BuckyForm = 'badger' | 'consultant' | 'product_manager';

export interface SaveData {
  currentChapter: ChapterId;
  currentMap: string;
  flags: Record<string, boolean>;
  badges: string[];
  processDex: string[];
  tumiItems: string[];
  playTime: number;
  buckyForm: BuckyForm;
  sharePrice: number;
}
