export const TILE_SIZE = 16;
export const GAME_WIDTH = 320;
export const GAME_HEIGHT = 288;
export const TILES_X = GAME_WIDTH / TILE_SIZE;
export const TILES_Y = GAME_HEIGHT / TILE_SIZE;
export const STEP_DURATION = 140;

export const GB_COLORS = {
  DARKEST: 0x081820,
  DARK: 0x346856,
  LIGHT: 0x88c070,
  LIGHTEST: 0xe0f8d0,
} as const;

export const GB_HEX = {
  DARKEST: '#081820',
  DARK: '#346856',
  LIGHT: '#88c070',
  LIGHTEST: '#e0f8d0',
} as const;

export const TILE = {
  VOID: 0,
  GROUND: 1,
  WALL: 2,
  GRASS: 3,
  WATER: 4,
  PATH: 5,
  DOOR: 6,
  DESK: 7,
  COMPUTER: 8,
  WHITEBOARD: 9,
  BOOKSHELF: 10,
  SIGN: 11,
  TREE: 12,
  BUILDING: 13,
  TRACKS: 14,
  FACTORY_FLOOR: 15,
  CONVEYOR: 16,
  CRATE: 17,
  ELEVATOR: 18,
  TROPHY: 19,
  LAB_BENCH: 20,
  FENCE: 21,
  FLOOR_ALT: 22,
  CARPET: 23,
  COUNTER: 24,
  SERVER: 25,
  PIPE: 26,
  WINDOW_TILE: 27,
  LEDGE_H: 28,
  ITEM_BALL: 29,
  UPVOTE_PAD: 30,
  DOWNVOTE_PAD: 31,
  RESET_PAD: 32,
  KARMA_DOOR: 33,
  KARMA_BRIDGE: 34,
  KARMA_BRIDGE_OFF: 35,
  MOD_STATUE: 36,
  ROULETTE_TABLE: 37,
  WALKWAY_R: 38,
  WALKWAY_L: 39,
  WALKWAY_U: 40,
  WALKWAY_D: 41,
  WALKWAY_STOP: 42,
  AIRPORT_CRATE: 43,
} as const;

export const WALKABLE_TILES = new Set([
  TILE.GROUND, TILE.GRASS, TILE.PATH, TILE.DOOR, TILE.TRACKS,
  TILE.FACTORY_FLOOR, TILE.ELEVATOR, TILE.FLOOR_ALT, TILE.CARPET,
  TILE.LEDGE_H, TILE.UPVOTE_PAD, TILE.DOWNVOTE_PAD, TILE.RESET_PAD,
  TILE.KARMA_BRIDGE,
  TILE.WALKWAY_R, TILE.WALKWAY_L, TILE.WALKWAY_U, TILE.WALKWAY_D, TILE.WALKWAY_STOP,
]);

export const INTERACTIVE_TILES = new Set([
  TILE.COMPUTER, TILE.WHITEBOARD, TILE.SIGN, TILE.BOOKSHELF, TILE.ITEM_BALL,
  TILE.TROPHY, TILE.DESK, TILE.CRATE, TILE.SERVER,
]);

export enum Direction {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right',
}

export const DIR_OFFSET: Record<Direction, { x: number; y: number }> = {
  [Direction.UP]: { x: 0, y: -1 },
  [Direction.DOWN]: { x: 0, y: 1 },
  [Direction.LEFT]: { x: -1, y: 0 },
  [Direction.RIGHT]: { x: 1, y: 0 },
};

export const CHAPTERS = [
  'uw_campus',
  'interview_trail',
  'baker_tilly',
  'deloitte_tower',
  'reddit_hq',
  'hall_of_fame',
] as const;

export type ChapterId = (typeof CHAPTERS)[number];
