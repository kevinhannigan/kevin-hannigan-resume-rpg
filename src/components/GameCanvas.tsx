'use client';

import { useEffect, useRef } from 'react';

const CONTAINER_ID = 'game-container';

export default function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    let game: Phaser.Game | null = null;

    async function boot() {
      const Phaser = (await import('phaser')).default;
      const { createGameConfig } = await import('@/game/config');

      if (gameRef.current) return;

      const config = createGameConfig(CONTAINER_ID);
      game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.on('open_link', (url: string) => {
        if (url.startsWith('mailto:') || url.startsWith('http')) {
          window.open(url, '_blank', 'noopener');
        } else {
          window.open(url, '_blank');
        }
      });
    }

    boot();

    return () => {
      if (game) {
        game.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full bg-[#081820]">
      <div
        id={CONTAINER_ID}
        className="w-full max-w-3xl aspect-[320/288]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
