import type { MapData } from '../types';
import { TILE as T } from '../constants';

function grid(width: number, height: number, fill: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

function stampRect(
  layer: number[][],
  x0: number,
  y0: number,
  w: number,
  h: number,
  tile: number,
) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      if (y >= 0 && y < layer.length && x >= 0 && x < layer[0]!.length) {
        layer[y]![x] = tile;
      }
    }
  }
}

function wallBox(layer: number[][], x0: number, y0: number, w: number, h: number) {
  for (let y = y0; y < y0 + h; y++) {
    for (let x = x0; x < x0 + w; x++) {
      const edge = x === x0 || x === x0 + w - 1 || y === y0 || y === y0 + h - 1;
      if (edge && y >= 0 && y < layer.length && x >= 0 && x < layer[0]!.length) {
        layer[y]![x] = T.WALL;
      }
    }
  }
}

function makeUwCampusExterior(): MapData {
  const w = 20;
  const h = 18;
  const ground = grid(w, h, T.GRASS);
  const objects = grid(w, h, 0);

  stampRect(ground, 5, 0, 10, 4, T.PATH);
  for (let y = 4; y < h; y++) {
    ground[y]![9] = T.PATH;
    ground[y]![10] = T.PATH;
  }
  stampRect(ground, 6, 14, 8, 4, T.PATH);

  for (const y of [6, 7, 11, 12]) {
    objects[y]![2] = T.TREE;
    objects[y]![17] = T.TREE;
  }
  objects[4]![6] = T.TREE;
  objects[8]![16] = T.TREE;

  for (let x = 4; x <= 15; x++) objects[0]![x] = T.BUILDING;
  for (let x = 4; x <= 8; x++) objects[1]![x] = T.BUILDING;
  objects[1]![9] = T.WINDOW_TILE;
  objects[1]![10] = T.WINDOW_TILE;
  for (let x = 11; x <= 15; x++) objects[1]![x] = T.BUILDING;
  for (let x = 4; x <= 8; x++) objects[2]![x] = T.BUILDING;
  objects[2]![9] = T.DOOR;
  objects[2]![10] = T.DOOR;
  for (let x = 11; x <= 15; x++) objects[2]![x] = T.BUILDING;

  objects[5]![7] = T.SIGN;

  return {
    id: 'uw_campus_exterior',
    chapterId: 'uw_campus',
    name: 'UW Campus — Engineering Quad',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 9, y:7, facing: 'down' },
    npcs: [],
    triggers: [
      {
        id: 'tr_uw_door',
        x: 9,
        y: 2,
        width: 2,
        height: 1,
        type: 'transition',
        target: 'uw_engineering',
        spawnX: 9,
        spawnY: 11,
      },
    ],
    interactives: [
      {
        id: 'int_uw_ext_sign',
        x: 7,
        y: 5,
        tile: T.SIGN,
        dialogueKey: 'uw_sign',
      },
    ],
  };
}

function makeUwEngineering(): MapData {
  const w = 20;
  const h = 15;
  const ground = grid(w, h, T.CARPET);
  const objects = grid(w, h, 0);

  wallBox(objects, 0, 0, w, h);
  objects[h - 1]![9] = T.DOOR;
  objects[h - 1]![10] = T.DOOR;

  // Main corridor
  stampRect(ground, 8, 1, 3, h - 2, T.FLOOR_ALT);

  // === LEFT WING: Professor's Office, Computer, Lab ===

  // Professor's office area (y=1-3)
  objects[1]![1] = T.BOOKSHELF; objects[1]![2] = T.BOOKSHELF; objects[1]![3] = T.BOOKSHELF; objects[1]![4] = T.BOOKSHELF;
  //objects[2]![1] = T.DESK; 
  objects[3]![1] = T.BOOKSHELF; objects[3]![2] = T.BOOKSHELF; objects[3]![3] = T.BOOKSHELF; objects[3]![4] = T.BOOKSHELF;

  // Single interactive computer (y=4)
  objects[5]![5] = T.COMPUTER;

  // IE Lab benches (y=6-8)
  objects[6]![1] = T.LAB_BENCH; objects[6]![2] = T.LAB_BENCH;
  objects[6]![4] = T.LAB_BENCH; objects[6]![5] = T.LAB_BENCH;
  objects[8]![1] = T.LAB_BENCH; objects[8]![2] = T.LAB_BENCH;
  objects[8]![4] = T.LAB_BENCH; objects[8]![5] = T.LAB_BENCH;

  // === RIGHT WING: Whiteboards, Kraft Corner, Awards ===

  // 3 interactive whiteboards on wall (y=1, x=13,15,17)
  objects[1]![7] = T.WHITEBOARD;
  objects[1]![9] = T.WHITEBOARD;
  objects[1]![11] = T.WHITEBOARD;
  // Study desk below whiteboards
  objects[1]![17] = T.BOOKSHELF; objects[1]![15] = T.BOOKSHELF; objects[1]![16] = T.BOOKSHELF; objects[1]![17] = T.BOOKSHELF; objects[1]![18] = T.BOOKSHELF;
  objects[3]![17] = T.BOOKSHELF; objects[3]![15] = T.BOOKSHELF; objects[3]![16] = T.BOOKSHELF; objects[3]![17] = T.BOOKSHELF; objects[3]![18] = T.BOOKSHELF;

  // Awards & library (y=8-9)
  objects[8]![13] = T.TROPHY;
  objects[5]![13] = T.TROPHY;

  // Lab directions sign in corridor
  //objects[10]![8] = T.SIGN;

  return {
    id: 'uw_engineering',
    chapterId: 'uw_campus',
    name: 'College of Engineering',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 9, y: 11, facing: 'up' },
    resetFlags: ['uw_talked_professor', 'uw_inspected_computer', 'uw_graduated'],
    npcs: [
      {
        id: 'npc_uw_professor',
        x: 9,
        y: 3,
        sprite: 'npc_professor',
        facing: 'down',
        dialogueKey: 'uw_professor_intro',
        name: 'Prof. Johnson',
        interactedFlag: 'uw_talked_professor',
        requiredFlags: ['uw_inspected_computer'],
        blockedDialogueKey: 'uw_professor_blocked',
        afterInteractDialogueKey: 'uw_professor_done',
        showReceivedPokemon: {
          name: 'BUCKY',
          level: 5,
          type: 'GROUND',
          sprite: 'badger_battle_front',
          moves: ['JUMP AROUND', 'ENGINEERING'],
        },
      },
    ],
    triggers: [
      {
        id: 'cs_uw_graduation',
        x: 9,
        y: 13,
        width: 2,
        height: 1,
        type: 'cutscene',
        dialogueKey: 'uw_graduation',
        oneShot: true,
        requiredFlags: [
          'uw_talked_professor',
          'uw_inspected_computer',
        ],
      },
      {
        id: 'tr_uw_leave_campus',
        x: 9,
        y: 14,
        width: 2,
        height: 1,
        type: 'gate',
        target: 'interview_trail',
        spawnX: 8,
        spawnY: 22,
        requiredFlags: ['uw_talked_professor', 'uw_inspected_computer'],
        dialogueKey: 'uw_gate_blocked',
      },
    ],
    interactives: [
      { id: 'int_uw_wb', x: 7, y: 1, tile: T.WHITEBOARD, dialogueKey: 'uw_whiteboard' },
      { id: 'int_uw_wb2', x: 9, y: 1, tile: T.WHITEBOARD, dialogueKey: 'uw_wb_supply_chain' },
      { id: 'int_uw_wb3', x: 11, y: 1, tile: T.WHITEBOARD, dialogueKey: 'uw_wb_simulation' },
      { id: 'int_uw_pc', x: 5, y: 5, tile: T.COMPUTER, dialogueKey: 'uw_computer' },
      { id: 'int_uw_trophy', x: 13, y: 8, tile: T.TROPHY, dialogueKey: 'uw_trophy' },
      { id: 'int_uw_trophy2', x: 13, y: 5, tile: T.TROPHY, dialogueKey: 'uw_trophy2' },
      { id: 'int_uw_kraft', x: 17, y: 4, tile: T.SIGN, dialogueKey: 'uw_kraft_internship' },
     // { id: 'int_uw_lab_sign', x: 8, y: 10, tile: T.SIGN, dialogueKey: 'uw_lab_sign' },
    ],
  };
}


function makeInterviewTrail(): MapData {
  const w = 16;
  const h = 24;
  const ground = grid(w, h, T.GRASS);
  const objects = grid(w, h, 0);

  for (let y = 0; y < h; y++) {
    objects[y]![0] = T.TREE;
    objects[y]![1] = T.TREE;
    objects[y]![w - 2] = T.TREE;
    objects[y]![w - 1] = T.TREE;
  }

  // S-curve path
  stampRect(ground, 5, 18, 6, 6, T.PATH);
  stampRect(ground, 6, 12, 2, 7, T.PATH);
  stampRect(ground, 6, 11, 4, 2, T.PATH);
  stampRect(ground, 8, 6, 2, 7, T.PATH);
  stampRect(ground, 7, 0, 6, 7, T.PATH);

  // Chokepoint: force onto x=7 at y=15 for trainer sight
  objects[16]![4] = T.TREE; objects[16]![5] = T.TREE;
  objects[17]![4] = T.TREE; objects[17]![5] = T.TREE;
  objects[16]![8] = T.TREE; objects[16]![9] = T.TREE;
  objects[17]![8] = T.TREE; objects[17]![9] = T.TREE;

  // Variety trees
  objects[11]![3] = T.TREE; objects[11]![4] = T.TREE;
  objects[10]![11] = T.TREE; objects[10]![12] = T.TREE;
  objects[5]![3] = T.TREE; objects[5]![4] = T.TREE;
  objects[3]![12] = T.TREE; objects[4]![12] = T.TREE;

  // Tall grass patches alongside path
  for (let y = 14; y <= 18; y++) { objects[y]![2] = 0; objects[y]![3] = 0; }
  for (let y = 7; y <= 11; y++) { objects[y]![12] = 0; objects[y]![13] = 0; }

  objects[21]![5] = T.SIGN;

  // Train ticket item ball
  objects[8]![9] = T.ITEM_BALL;

  // Train station
  for (let x = 7; x <= 12; x++) objects[0]![x] = T.BUILDING;
  objects[1]![7] = T.BUILDING; objects[1]![8] = T.BUILDING;
  objects[1]![6] = T.TRACKS; objects[1]![5] = T.TRACKS; objects[1]![4] = T.TRACKS;objects[1]![3] = T.TRACKS; objects[1]![2] = T.TRACKS;objects[1]![1] = T.TRACKS;
  objects[1]![9] = T.DOOR;
  objects[1]![10] = T.DOOR;
  objects[1]![11] = T.BUILDING;
  objects[1]![12] = T.BUILDING;
  objects[2]![12] = T.SIGN;

  return {
    id: 'interview_trail',
    chapterId: 'interview_trail',
    name: 'Career Fair Trail',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 8, y: 22, facing: 'up' },
    npcs: [
      {
        id: 'npc_iv_recruiter',
        x: 7,
        y: 15,
        sprite: 'npc_interviewer',
        facing: 'down',
        dialogueKey: 'interviewer_1',
        name: 'Senior Recruiter',
        interactedFlag: 'interview_trainer_done',
        sightRange: 4,
        encounterId: 'interview_communication',
      },
    ],
    triggers: [
      {
        id: 'cs_chicago_train',
        x: 9,
        y: 2,
        width: 2,
        height: 1,
        type: 'cutscene',
        dialogueKey: 'chicago_train',
        oneShot: true,
        requiredFlags: ['encounter_communication_done', 'encounter_enterprise_done'],
      },
      {
        id: 'tr_interview_to_factory',
        x: 9,
        y: 1,
        width: 2,
        height: 1,
        type: 'gate',
        target: 'baker_tilly_factory',
        requiredFlags: ['encounter_communication_done', 'encounter_enterprise_done', 'train_ticket_found'],
        dialogueKey: 'interview_gate_blocked',
      },
    ],
    interactives: [
      { id: 'int_interview_sign', x: 5, y: 21, tile: T.SIGN, dialogueKey: 'interview_sign' },
      { id: 'int_train_sign', x: 12, y: 2, tile: T.SIGN, dialogueKey: 'chicago_train_sign' },
      { id: 'int_train_ticket', x: 9, y: 8, tile: T.ITEM_BALL, dialogueKey: 'train_ticket_found', setFlag: 'train_ticket_found' },
    ],
  };
}

function makeBakerTillyFactory(): MapData {
  const w = 18;
  const h = 18;
  const ground = grid(w, h, T.FACTORY_FLOOR);
  const objects = grid(w, h, 0);

  wallBox(objects, 0, 0, w, h);

  objects[h - 1]![8] = T.DOOR;
  objects[h - 1]![9] = T.DOOR;

  objects[0]![8] = T.DOOR;
  objects[0]![9] = T.DOOR;


  //objects[2]![4] = T.WHITEBOARD; objects[2]![13] = T.WHITEBOARD;
  //objects[3]![4] = T.DESK; objects[3]![13] = T.DESK;

  // Maze blocker 
  objects[0][0] = T.CRATE;
objects[0][1] = T.CRATE;
objects[0][2] = T.CRATE;
objects[0][3] = T.CRATE;
objects[0][4] = T.CRATE;
objects[0][5] = T.CRATE;
objects[0][6] = T.CRATE;
objects[0][7] = T.CRATE;
objects[0][10] = T.CRATE;
objects[0][11] = T.CRATE;
objects[0][12] = T.CRATE;
objects[0][13] = T.CRATE;
objects[0][14] = T.CRATE;
objects[0][15] = T.CRATE;
objects[0][16] = T.CRATE;
objects[0][17] = T.CRATE;

objects[1][0] = T.CRATE;
objects[1][6] = T.CRATE;
//objects[1][14] = T.CRATE;
objects[1][17] = T.CRATE;

objects[2][0] = T.CRATE;
objects[2][2] = T.CRATE;
objects[2][3] = T.CRATE;
objects[2][4] = T.CRATE;
objects[2][5] = T.CRATE;
objects[2][6] = T.CRATE;
objects[2][7] = T.CRATE;
objects[2][8] = T.CRATE;
objects[2][9] = T.CRATE;
objects[2][10] = T.CRATE;
objects[2][11] = T.CRATE;
objects[2][12] = T.CRATE;
objects[2][14] = T.CRATE;
objects[2][17] = T.CRATE;

objects[3][0] = T.CRATE;
objects[3][10] = T.CRATE;
objects[3][11] = T.CRATE;
objects[3][12] = T.CRATE;
objects[3][14] = T.CRATE;
objects[3][15] = T.CRATE;
objects[3][16] = T.CRATE;
objects[3][17] = T.CRATE;

objects[4][0] = T.CRATE;
objects[4][1] = T.CRATE;
objects[4][2] = T.CRATE;
objects[4][3] = T.CRATE;
objects[4][5] = T.CRATE;
objects[4][6] = T.CRATE;
objects[4][7] = T.CRATE;
objects[4][8] = T.CRATE;
objects[4][9] = T.CRATE;
objects[4][10] = T.CRATE;
objects[4][11] = T.CRATE;
objects[4][12] = T.CRATE;
objects[4][14] = T.CRATE;
objects[4][17] = T.CRATE;

objects[5][0] = T.CRATE;
objects[5][1] = T.CRATE;
objects[5][12] = T.CRATE;
objects[5][14] = T.CRATE;
objects[5][17] = T.CRATE;

objects[6][0] = T.CRATE;
objects[6][1] = T.CRATE;
objects[6][3] = T.CRATE;
objects[6][4] = T.CRATE;
objects[6][5] = T.CRATE;
objects[6][6] = T.CRATE;
objects[6][8] = T.CRATE;
objects[6][9] = T.CRATE;
objects[6][10] = T.CRATE;
objects[6][12] = T.CRATE;
objects[6][14] = T.CRATE;
objects[6][17] = T.CRATE;

objects[7][0] = T.CRATE;
objects[7][3] = T.CRATE;
objects[7][6] = T.CRATE;
objects[7][14] = T.CRATE;
objects[7][17] = T.CRATE;

objects[8][0] = T.CRATE;
objects[8][1] = T.CRATE;
objects[8][3] = T.CRATE;
objects[8][6] = T.CRATE;
objects[8][7] = T.CRATE;
objects[8][8] = T.CRATE;
objects[8][9] = T.CRATE;
objects[8][10] = T.CRATE;
objects[8][11] = T.CRATE;
objects[8][12] = T.CRATE;
objects[8][13] = T.CRATE;
objects[8][14] = T.CRATE;
objects[8][17] = T.CRATE;

objects[9][0] = T.CRATE;
objects[9][1] = T.CRATE;
objects[9][3] = T.CRATE;
objects[9][7] = T.CRATE;
objects[9][8] = T.CRATE;
objects[9][9] = T.CRATE;
objects[9][10] = T.CRATE;
objects[9][11] = T.CRATE;
objects[9][17] = T.CRATE;

objects[10][0] = T.CRATE;
objects[10][1] = T.CRATE;
objects[10][3] = T.CRATE;
objects[10][7] = T.CRATE;
objects[10][13] = T.CRATE;
objects[10][14] = T.CRATE;
objects[10][15] = T.CRATE;
objects[10][17] = T.CRATE;

objects[11][0] = T.CRATE;
objects[11][1] = T.CRATE;
objects[11][3] = T.CRATE;
objects[11][5] = T.CRATE;
objects[11][6] = T.CRATE;
objects[11][7] = T.CRATE;
objects[11][9] = T.CRATE;
objects[11][10] = T.CRATE;
objects[11][11] = T.CRATE;
objects[11][12] = T.CRATE;
objects[11][13] = T.CRATE;
objects[11][17] = T.CRATE;

objects[12][0] = T.CRATE;
objects[12][1] = T.CRATE;
objects[12][9] = T.CRATE;
objects[12][17] = T.CRATE;

objects[13][0] = T.CRATE;
objects[13][1] = T.CRATE;
objects[13][2] = T.CRATE;
objects[13][3] = T.CRATE;
objects[13][4] = T.CRATE;
objects[13][5] = T.CRATE;
objects[13][6] = T.CRATE;
objects[13][7] = T.CRATE;
objects[13][9] = T.CRATE;
objects[13][17] = T.CRATE;

objects[14][0] = T.CRATE;
objects[14][7] = T.CRATE;
objects[14][9] = T.CRATE;
objects[14][17] = T.CRATE;

objects[15][0] = T.CRATE;
objects[15][7] = T.CRATE;
//objects[15][9] = T.CRATE;
objects[15][17] = T.CRATE;


objects[16][0] = T.CRATE;
objects[16][17] = T.CRATE;

objects[17][0] = T.CRATE;
objects[17][1] = T.CRATE;
objects[17][2] = T.CRATE;
objects[17][3] = T.CRATE;
objects[17][4] = T.CRATE;
objects[17][5] = T.CRATE;
objects[17][6] = T.CRATE;
objects[17][7] = T.CRATE;
objects[17][10] = T.CRATE;
objects[17][11] = T.CRATE;
objects[17][12] = T.CRATE;
objects[17][13] = T.CRATE;
objects[17][14] = T.CRATE;
objects[17][15] = T.CRATE;
objects[17][16] = T.CRATE;
objects[17][17] = T.CRATE;
 

 // objects[10]![7] = T.PIPE; objects[10]![10] = T.PIPE;
 // objects[6]![7] = T.COUNTER; objects[6]![10] = T.COUNTER;

  return {
    id: 'baker_tilly_factory',
    chapterId: 'baker_tilly',
    name: 'Baker Tilly — Plant Floor',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 8, y: 16, facing: 'up' },
    npcs: [
      {
        id: 'npc_bt_intro',
        x: 9,
        y: 15,
        sprite: 'npc_manager',
        facing: 'down',
        dialogueKey: 'bt_intro',
        name: 'Plant Manager',
      },
      {
        id: 'npc_bt_edi',
        x: 4,
        y: 11,
        sprite: 'npc_generic',
        facing: 'down',
        dialogueKey: 'bt_edi',
        name: 'Receiving Clerk',
        interactedFlag: 'enc_bt_edi_done',
        sightRange: 2,
        encounterId: 'bt_edi',
      },
      {
        id: 'npc_bt_mrp',
        x: 11,
        y: 6,
        sprite: 'npc_generic',
        facing: 'down',
        dialogueKey: 'bt_mrp',
        name: 'Planner',
        interactedFlag: 'enc_bt_mrp_done',
        sightRange: 2,
        encounterId: 'bt_mrp',
      },
      {
        id: 'npc_bt_boss',
        x: 14,
        y: 1,
        sprite: 'npc_manager',
        facing: 'down',
        dialogueKey: 'bt_boss',
        name: 'Plant Controller',
        interactedFlag: 'bt_boss_talked',
      },
    ],
    triggers: [
      {
        id: 'tr_bt_exit',
        x: 8,
        y: 0,
        width: 2,
        height: 1,
        type: 'gate',
        target: 'deloitte_terminal',
        requiredFlags: ['enc_bt_edi_done', 'enc_bt_mrp_done', 'bt_boss_talked'],
        dialogueKey: 'bt_gate_blocked',
      },
    ],
    interactives: [],
  };
}

function makeDeloitteAirport(): MapData {
  const w = 21;
  const h = 23;
  const ground = grid(w, h, T.FACTORY_FLOOR);
  const objects = grid(w, h, 0);

  // Border: AIRPORT_CRATE all around
  for (let x = 0; x < w; x++) { objects[0]![x] = T.AIRPORT_CRATE; objects[h - 1]![x] = T.AIRPORT_CRATE; }
  for (let y = 1; y < h - 1; y++) { objects[y]![0] = T.AIRPORT_CRATE; objects[y]![w - 1] = T.AIRPORT_CRATE; }

  // Top and bottom carpet strips (gate agent rows)
  stampRect(ground, 1, 1, w - 2, 1, T.CARPET);
  stampRect(ground, 1, h - 2, w - 2, 1, T.CARPET);

  // Right wall openings: entrance (row 4) and exit (row 14)
  objects[4]![w - 1] = T.DOOR;
  objects[15]![w - 1] = T.DOOR;

  // ─── Maze walls ────────────────────────────────────────────────────────
  // Row 1: gate agents at 4, 13
  objects[1]![17] = T.AIRPORT_CRATE;
  // Row 2
  objects[2]![17] = T.AIRPORT_CRATE;
  objects[2]![6] = T.AIRPORT_CRATE;
  // Row 3
  objects[3]![2] = T.AIRPORT_CRATE; objects[3]![3] = T.AIRPORT_CRATE; objects[3]![4] = T.AIRPORT_CRATE;
  objects[3]![6] = T.AIRPORT_CRATE; objects[3]![8] = T.AIRPORT_CRATE; objects[3]![10] = T.AIRPORT_CRATE;
  objects[3]![12] = T.AIRPORT_CRATE; objects[3]![14] = T.AIRPORT_CRATE; objects[3]![17] = T.AIRPORT_CRATE;
  // Row 4
  objects[4]![14] = T.AIRPORT_CRATE; objects[4]![15] = T.AIRPORT_CRATE;
  objects[4]![16] = T.AIRPORT_CRATE; objects[4]![17] = T.AIRPORT_CRATE;
  // Row 5
  objects[5]![1] = T.AIRPORT_CRATE; objects[5]![2] = T.AIRPORT_CRATE;
  objects[5]![5] = T.AIRPORT_CRATE; objects[5]![6] = T.AIRPORT_CRATE; objects[5]![7] = T.AIRPORT_CRATE;
  objects[5]![8] = T.AIRPORT_CRATE; objects[5]![9] = T.AIRPORT_CRATE; objects[5]![11] = T.AIRPORT_CRATE;
  // Row 6
  objects[6]![2] = T.AIRPORT_CRATE; objects[6]![11] = T.AIRPORT_CRATE;
  // Row 7
  objects[7]![2] = T.AIRPORT_CRATE; objects[7]![4] = T.AIRPORT_CRATE; objects[7]![5] = T.AIRPORT_CRATE;
  objects[7]![7] = T.AIRPORT_CRATE; objects[7]![9] = T.AIRPORT_CRATE; objects[7]![11] = T.AIRPORT_CRATE;
  objects[7]![15] = T.AIRPORT_CRATE; objects[7]![16] = T.AIRPORT_CRATE; objects[7]![17] = T.AIRPORT_CRATE;

  // Row 8
  objects[8]![5] = T.AIRPORT_CRATE; objects[8]![6] = T.AIRPORT_CRATE; objects[8]![7] = T.AIRPORT_CRATE;
  objects[8]![9] = T.AIRPORT_CRATE; objects[8]![11] = T.AIRPORT_CRATE; objects[8]![15] = T.AIRPORT_CRATE;
  // Row 9
  objects[9]![1] = T.AIRPORT_CRATE; objects[9]![2] = T.AIRPORT_CRATE; objects[9]![3] = T.AIRPORT_CRATE;
  objects[9]![12] = T.AIRPORT_CRATE; objects[9]![13] = T.AIRPORT_CRATE; objects[9]![14] = T.AIRPORT_CRATE;
  objects[9]![15] = T.AIRPORT_CRATE; objects[9]![17] = T.AIRPORT_CRATE; objects[9]![18] = T.AIRPORT_CRATE;
  objects[9]![19] = T.AIRPORT_CRATE;
  // Row 10
  objects[10]![12] = T.AIRPORT_CRATE; objects[10]![13] = T.AIRPORT_CRATE;
  objects[10]![17] = T.AIRPORT_CRATE; objects[10]![18] = T.AIRPORT_CRATE; objects[10]![19] = T.AIRPORT_CRATE;
  // Row 11
  objects[11]![2] = T.AIRPORT_CRATE; objects[11]![3] = T.AIRPORT_CRATE;
  objects[11]![5] = T.AIRPORT_CRATE; objects[11]![6] = T.AIRPORT_CRATE; objects[11]![7] = T.AIRPORT_CRATE;
  objects[11]![17] = T.AIRPORT_CRATE; objects[11]![18] = T.AIRPORT_CRATE; objects[11]![19] = T.AIRPORT_CRATE;
  // Row 12
  objects[12]![5] = T.AIRPORT_CRATE; objects[12]![6] = T.AIRPORT_CRATE; objects[12]![7] = T.AIRPORT_CRATE;
  objects[12]![8] = T.AIRPORT_CRATE; objects[12]![9] = T.AIRPORT_CRATE;
  objects[12]![17] = T.AIRPORT_CRATE; objects[12]![18] = T.AIRPORT_CRATE; objects[12]![19] = T.AIRPORT_CRATE;
  // Row 13
  objects[13]![2] = T.AIRPORT_CRATE; objects[13]![3] = T.AIRPORT_CRATE; objects[13]![4] = T.AIRPORT_CRATE;
  objects[13]![7] = T.AIRPORT_CRATE;
  objects[13]![17] = T.AIRPORT_CRATE; objects[13]![18] = T.AIRPORT_CRATE; objects[13]![19] = T.AIRPORT_CRATE;
  // Row 14
  objects[14]![14] = T.AIRPORT_CRATE; objects[14]![15] = T.AIRPORT_CRATE;
  objects[14]![17] = T.AIRPORT_CRATE; objects[14]![18] = T.AIRPORT_CRATE; objects[14]![19] = T.AIRPORT_CRATE;

  // Row 15
  objects[15]![2] = T.AIRPORT_CRATE; objects[15]![3] = T.AIRPORT_CRATE;
  objects[15]![5] = T.AIRPORT_CRATE; objects[15]![7] = T.AIRPORT_CRATE;
  objects[15]![9] = T.AIRPORT_CRATE; objects[15]![15] = T.AIRPORT_CRATE;
  // Row 16
  objects[16]![2] = T.AIRPORT_CRATE; objects[16]![7] = T.AIRPORT_CRATE;
  objects[16]![9] = T.AIRPORT_CRATE; objects[16]![10] = T.AIRPORT_CRATE; objects[16]![11] = T.AIRPORT_CRATE;
  objects[16]![12] = T.AIRPORT_CRATE; objects[16]![13] = T.AIRPORT_CRATE;
  // Row 17
  objects[17]![3] = T.AIRPORT_CRATE; objects[17]![5] = T.AIRPORT_CRATE; objects[17]![7] = T.AIRPORT_CRATE;
  objects[17]![15] = T.AIRPORT_CRATE;
  objects[17]![17] = T.AIRPORT_CRATE; objects[17]![18] = T.AIRPORT_CRATE; objects[17]![19] = T.AIRPORT_CRATE;
  // Row 18
  objects[18]![3] = T.AIRPORT_CRATE; objects[18]![5] = T.AIRPORT_CRATE; objects[18]![7] = T.AIRPORT_CRATE;
  objects[18]![15] = T.AIRPORT_CRATE;
  objects[18]![17] = T.AIRPORT_CRATE; objects[18]![18] = T.AIRPORT_CRATE; objects[18]![19] = T.AIRPORT_CRATE;
  // Row 19
  objects[19]![3] = T.AIRPORT_CRATE; objects[19]![5] = T.AIRPORT_CRATE; objects[19]![7] = T.AIRPORT_CRATE;
  objects[19]![11] = T.AIRPORT_CRATE; objects[19]![12] = T.AIRPORT_CRATE; objects[19]![13] = T.AIRPORT_CRATE;
  objects[19]![14] = T.AIRPORT_CRATE; objects[19]![15] = T.AIRPORT_CRATE;
  objects[19]![17] = T.AIRPORT_CRATE; objects[19]![18] = T.AIRPORT_CRATE; objects[19]![19] = T.AIRPORT_CRATE;
  // Row 20
  objects[20]![7] = T.AIRPORT_CRATE; objects[20]![8] = T.AIRPORT_CRATE; objects[20]![9] = T.AIRPORT_CRATE;
  objects[20]![17] = T.AIRPORT_CRATE; objects[20]![18] = T.AIRPORT_CRATE; objects[20]![19] = T.AIRPORT_CRATE;
  // Row 21: carpet strip (gate agents at 4, 12) — border handles cols 0 & 20
  objects[21]![4] = T.AIRPORT_CRATE; objects[21]![5] = T.AIRPORT_CRATE; objects[21]![6] = T.AIRPORT_CRATE;
  objects[21]![7] = T.AIRPORT_CRATE; objects[21]![8] = T.AIRPORT_CRATE; objects[21]![9] = T.AIRPORT_CRATE;
  objects[21]![10] = T.AIRPORT_CRATE; objects[21]![11] = T.AIRPORT_CRATE;

  objects[21]![13] = T.AIRPORT_CRATE; objects[21]![14] = T.AIRPORT_CRATE; objects[21]![15] = T.AIRPORT_CRATE;
  objects[21]![16] = T.AIRPORT_CRATE; objects[21]![17] = T.AIRPORT_CRATE; objects[21]![18] = T.AIRPORT_CRATE;
  objects[21]![19] = T.AIRPORT_CRATE;

  // ─── Directional walkway tiles (ground layer) ──────────────────────────
  // Stop pads
  ground[4]![2] = T.WALKWAY_STOP;
  ground[6]![7] = T.WALKWAY_STOP;
  ground[7]![13] = T.WALKWAY_STOP;
  ground[10]![13] = T.WALKWAY_STOP;
  ground[13]![14] = T.WALKWAY_STOP;
  ground[8]![15] = T.WALKWAY_STOP;
  ground[11]![8] = T.WALKWAY_STOP;
  ground[2]![14] = T.WALKWAY_STOP;
  ground[6]![15] = T.WALKWAY_STOP;
  ground[19]![9] = T.WALKWAY_STOP;
  ground[20]![14] = T.WALKWAY_STOP;

  // Left-pushing pads (<<)
  ground[4]![4] = T.WALKWAY_L;
  ground[4]![8] = T.WALKWAY_L;
  ground[4]![10] = T.WALKWAY_L;
  ground[4]![12] = T.WALKWAY_L;
  ground[5]![17] = T.WALKWAY_L;
  ground[6]![17] = T.WALKWAY_L;
  ground[13]![13] = T.WALKWAY_L;
  ground[14]![13] = T.WALKWAY_L;
  ground[14]![4] = T.WALKWAY_L;
  ground[14]![8] = T.WALKWAY_L;
  ground[17]![13] = T.WALKWAY_L;
  ground[18]![13] = T.WALKWAY_L;

  // Down-pushing pads (vv)
  ground[5]![13] = T.WALKWAY_D;
  ground[9]![9] = T.WALKWAY_D;
  ground[11]![15] = T.WALKWAY_D;
  ground[17]![9] = T.WALKWAY_D;
  ground[9]![11] = T.WALKWAY_D;
  ground[13]![11] = T.WALKWAY_D;

  // Right-pushing pads (>>)
  ground[6]![4] = T.WALKWAY_R;
  ground[7]![13] = T.WALKWAY_R;
  ground[9]![5] = T.WALKWAY_R;
  ground[10]![4] = T.WALKWAY_R;
  ground[12]![10] = T.WALKWAY_R;
  ground[12]![12] = T.WALKWAY_R;
  ground[20]![10] = T.WALKWAY_R;
  ground[11]![11] = T.WALKWAY_R;
  ground[11]![13] = T.WALKWAY_R;

  // Up-pushing pads (^^)
  ground[5]![10] = T.WALKWAY_U;
  ground[6]![12] = T.WALKWAY_U;
  ground[7]![8] = T.WALKWAY_U;
  ground[8]![12] = T.WALKWAY_U;
  ground[10]![8] = T.WALKWAY_U;
  ground[10]![10] = T.WALKWAY_U;
  ground[9]![16] = T.WALKWAY_U;
  ground[11]![4] = T.WALKWAY_U;
  ground[11]![16] = T.WALKWAY_U;
  ground[14]![10] = T.WALKWAY_U;
  ground[12]![14] = T.WALKWAY_U;
  ground[13]![16] = T.WALKWAY_U;
  ground[17]![4] = T.WALKWAY_U;
  ground[17]![6] = T.WALKWAY_U;
  ground[19]![6] = T.WALKWAY_U;
  ground[18]![8] = T.WALKWAY_U;

  return {
    id: 'deloitte_terminal',
    chapterId: 'deloitte_tower',
    name: 'O\'Hare Terminal — Deloitte Status Run',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 19, y: 4, facing: 'left' },
    npcs: [
      {
        id: 'npc_gate_meta',
        x: 4,
        y: 1,
        sprite: 'npc_generic',
        facing: 'down',
        dialogueKey: 'dt_gate_meta',
        name: 'Gate A: Meta',
        interactedFlag: 'enc_dt_meta_done',
        processDexEntry: 'agile_delivery',
      },
      {
        id: 'npc_gate_cloudflare',
        x: 13,
        y: 1,
        sprite: 'npc_generic',
        facing: 'down',
        dialogueKey: 'dt_gate_cloudflare',
        name: 'Gate B: Cloudflare',
        interactedFlag: 'enc_dt_cloudflare_done',
        processDexEntry: 'integration_platform',
      },
      {
        id: 'npc_gate_warehousing',
        x: 3,
        y: 21,
        sprite: 'npc_generic',
        facing: 'up',
        dialogueKey: 'dt_gate_warehousing',
        name: 'Gate C: Warehousing',
        interactedFlag: 'enc_dt_warehousing_done',
        processDexEntry: 'cost_modeling',
      },
      {
        id: 'npc_gate_revenue',
        x: 12,
        y: 21,
        sprite: 'npc_generic',
        facing: 'up',
        dialogueKey: 'dt_gate_revenue',
        name: 'Gate D: Revenue',
        interactedFlag: 'enc_dt_revenue_done',
        processDexEntry: 'revenue_recognition',
      },
      {
        id: 'npc_dt_pilot',
        x: 16,
        y: 15,
        sprite: 'npc_partner',
        facing: 'left',
        dialogueKey: 'dt_pilot',
        name: 'Captain',
        requiredFlags: ['enc_dt_meta_done', 'enc_dt_cloudflare_done', 'enc_dt_warehousing_done', 'enc_dt_revenue_done'],
        blockedDialogueKey: 'dt_pilot_blocked',
        interactedFlag: 'dt_partner_talked',
      },
    ],
    triggers: [
      {
        id: 'cs_dt_intro',
        x: 18,
        y: 4,
        width: 2,
        height: 1,
        type: 'cutscene',
        dialogueKey: 'dt_airport_intro',
        oneShot: true,
      },
      {
        id: 'tr_dt_exit',
        x: w - 1,
        y: 15,
        width: 1,
        height: 1,
        type: 'gate',
        target: 'reddit_campus',
        spawnX: 8,
        spawnY: 12,
        requiredFlags: ['enc_dt_meta_done', 'enc_dt_cloudflare_done', 'enc_dt_warehousing_done', 'enc_dt_revenue_done', 'dt_complete'],
        dialogueKey: 'dt_elevator_blocked',
      },
    ],
    interactives: [],
  };
}

// ─── Reddit Puzzle Dungeon ─────────────────────────────────────────────────

function makeRedditCampus(): MapData {
  const w = 16;
  const h = 14;
  const ground = grid(w, h, T.GRASS);
  const objects = grid(w, h, 0);

  // Tree border
  for (let y = 0; y < h; y++) {
    objects[y]![0] = T.TREE; objects[y]![1] = T.TREE;
    objects[y]![w - 2] = T.TREE; objects[y]![w - 1] = T.TREE;
  }
  for (let x = 0; x < w; x++) objects[0]![x] = T.TREE;

  // Scatter trees
  objects[4]![4] = T.TREE; objects[4]![11] = T.TREE;
  objects[7]![3] = T.TREE; objects[7]![12] = T.TREE;
  objects[10]![5] = T.TREE; objects[10]![10] = T.TREE;

  // Building at top
  for (let x = 5; x <= 10; x++) objects[1]![x] = T.BUILDING;
  objects[2]![5] = T.BUILDING; objects[2]![10] = T.BUILDING;
  objects[2]![7] = T.DOOR; objects[2]![8] = T.DOOR;

  // Sign
  objects[h - 2]![3] = T.SIGN;

  return {
    id: 'reddit_campus',
    chapterId: 'reddit_hq',
    name: 'r/WallStreetBets — Grounds',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 8, y: 12, facing: 'up' },
    npcs: [],
    triggers: [
      {
        id: 'tr_enter_reddit',
        x: 7,
        y: 2,
        width: 2,
        height: 1,
        type: 'gate',
        target: 'reddit_casino',
        requiredFlags: ['snoo_caught'],
        dialogueKey: 'reddit_needs_snoo',
      },
    ],
    interactives: [
      { id: 'int_reddit_sign', x: 3, y: 12, tile: T.SIGN, dialogueKey: 'reddit_grounds_sign' },
    ],
  };
}

function makeRedditCasino(): MapData {
  const w = 14;
  const h = 12;
  const ground = grid(w, h, T.FLOOR_ALT);
  const objects = grid(w, h, 0);

  wallBox(objects, 0, 0, w, h);

  // Entrance (bottom center)
  objects[h - 1]![6] = T.DOOR;
  objects[h - 1]![7] = T.DOOR;

  // Roulette table (top center, behind dealer)
  objects[2]![5] = T.ROULETTE_TABLE;
  objects[2]![6] = T.ROULETTE_TABLE;
  objects[2]![7] = T.ROULETTE_TABLE;
  objects[2]![8] = T.ROULETTE_TABLE;

  // Trophies along top
  objects[1]![2] = T.TROPHY;
  objects[1]![3] = T.TROPHY;
  objects[1]![10] = T.TROPHY;
  objects[1]![11] = T.TROPHY;

  // Desks for work stations
  objects[5]![1] = T.DESK;
  objects[5]![12] = T.DESK;
  objects[9]![12] = T.DESK;

  // Signs
  objects[7]![1] = T.SIGN;
  objects[7]![12] = T.SIGN;

  // Carpet path from entrance to table
  stampRect(ground, 5, 3, 4, 8, T.CARPET);

  return {
    id: 'reddit_casino',
    chapterId: 'reddit_hq',
    name: 'r/WallStreetBets — The Casino',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 6, y: 10, facing: 'up' },
    npcs: [
      {
        id: 'npc_roulette_dealer',
        x: 6,
        y: 3,
        sprite: 'npc_manager',
        facing: 'down',
        dialogueKey: 'reddit_casino_dealer',
        name: 'Pit Boss',
      },
      {
        id: 'npc_work_sox',
        x: 2,
        y: 5,
        sprite: 'npc_generic',
        facing: 'right',
        dialogueKey: 'reddit_work_sox_npc',
        name: 'SOX Analyst',
        encounterId: 'reddit_work_sox',
      },
      {
        id: 'npc_work_integration',
        x: 11,
        y: 5,
        sprite: 'npc_generic',
        facing: 'left',
        dialogueKey: 'reddit_work_integration_npc',
        name: 'Integration Dev',
        encounterId: 'reddit_work_integration',
      },
      {
        id: 'npc_work_close',
        x: 11,
        y: 9,
        sprite: 'npc_generic',
        facing: 'left',
        dialogueKey: 'reddit_work_close_npc',
        name: 'Close Manager',
        encounterId: 'reddit_work_close',
      },
    ],
    triggers: [
      {
        id: 'tr_casino_back',
        x: 6,
        y: h - 1,
        width: 2,
        height: 1,
        type: 'gate',
        target: 'reddit_campus',
        spawnX: 7,
        spawnY: 3,
        requiredFlags: [],
        dialogueKey: 'reddit_room_locked',
      },
    ],
    interactives: [
      { id: 'int_casino_sign_l', x: 1, y: 7, tile: T.SIGN, dialogueKey: 'reddit_casino_rules' },
      { id: 'int_casino_sign_r', x: 12, y: 7, tile: T.SIGN, dialogueKey: 'reddit_casino_lore' },
    ],
  };
}

function makeHallOfFame(): MapData {
  const w = 20;
  const h = 15;
  const ground = grid(w, h, T.FLOOR_ALT);
  const objects = grid(w, h, 0);

  wallBox(objects, 0, 0, w, h);

  objects[h - 1]![9] = T.DOOR;
  objects[h - 1]![10] = T.DOOR;

  for (let x = 3; x <= 6; x++) {
    objects[3]![x] = T.TROPHY;
    objects[3]![x + 8] = T.TROPHY;
  }
  objects[5]![9] = T.LAB_BENCH;
  objects[5]![10] = T.LAB_BENCH;
  objects[7]![4] = T.BOOKSHELF;
  objects[7]![14] = T.BOOKSHELF;
  stampRect(ground, 7, 8, 6, 3, T.CARPET);

  return {
    id: 'hall_of_fame',
    chapterId: 'hall_of_fame',
    name: 'Hall of Fame',
    width: w,
    height: h,
    layers: { ground, objects },
    playerSpawn: { x: 9, y: 12, facing: 'down' },
    npcs: [
      {
        id: 'npc_hof_greeter',
        x: 9,
        y: 7,
        sprite: 'npc_generic',
        facing: 'down',
        dialogueKey: 'hall_of_fame_intro',
        name: 'Guide',
      },
    ],
    triggers: [],
    interactives: [],
  };
}

export const maps: Record<string, MapData> = {
  uw_campus_exterior: makeUwCampusExterior(),
  uw_engineering: makeUwEngineering(),
  interview_trail: makeInterviewTrail(),
  baker_tilly_factory: makeBakerTillyFactory(),
  deloitte_terminal: makeDeloitteAirport(),
  reddit_campus: makeRedditCampus(),
  reddit_casino: makeRedditCasino(),
  hall_of_fame: makeHallOfFame(),
};
