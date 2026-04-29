import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GB_COLORS } from './constants';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import WorldScene from './scenes/WorldScene';
import EncounterScene from './scenes/EncounterScene';
import EvolutionScene from './scenes/EvolutionScene';
import HallOfFameScene from './scenes/HallOfFameScene';

export function createGameConfig(parent: string): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent,
    backgroundColor: `#${GB_COLORS.DARKEST.toString(16).padStart(6, '0')}`,
    pixelArt: true,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [BootScene, MenuScene, WorldScene, EncounterScene, EvolutionScene, HallOfFameScene],
    input: {
      keyboard: true,
    },
  };
}
