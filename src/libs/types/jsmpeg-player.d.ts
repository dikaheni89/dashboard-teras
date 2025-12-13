// src/libs/types/jsmpeg-player.d.ts
declare module '@cycjimmy/jsmpeg-player' {
  interface PlayerOptions {
    canvas?: HTMLCanvasElement;
    autoplay?: boolean;
    loop?: boolean;
    audio?: boolean;
    videoBufferSize?: number;
    onSourceEstablished?: (player: Player) => void;
    onSourceCompleted?: (player: Player) => void;
    protocols?: string[];
  }

  export class Player {
    constructor(url: string | WebSocket, options?: PlayerOptions);

    // Kontrol dasar
    play(): void;
    pause(): void;
    stop(): void;
    destroy(): void;

    // Status
    isPlaying: boolean;
    isStopped: boolean;
  }
}

