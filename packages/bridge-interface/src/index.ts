/**
 * Bridge Interface for Hybrid Velocity Bridge
 * Defines the protocol for communication between React Native shell and Phaser game engine
 */

// Bridge message types
export enum BridgeMessageType {
  // Shell -> Game
  INIT_GAME = 'INIT_GAME',
  START_COMBAT = 'START_COMBAT',
  PAUSE_GAME = 'PAUSE_GAME',
  RESUME_GAME = 'RESUME_GAME',
  UPDATE_PLAYER_DATA = 'UPDATE_PLAYER_DATA',

  // Game -> Shell
  GAME_READY = 'GAME_READY',
  COMBAT_COMPLETE = 'COMBAT_COMPLETE',
  GAME_ERROR = 'GAME_ERROR',
  REQUEST_DATA = 'REQUEST_DATA',
}

// Base bridge message
export interface BridgeMessage<T = any> {
  type: BridgeMessageType;
  payload?: T;
  timestamp: number;
  id: string;
}

// Specific message payloads
export interface InitGamePayload {
  playerId: string;
  avatarData: any;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface CombatCompletePayload {
  victory: boolean;
  experience_gained: number;
  damage_dealt: number;
  damage_received: number;
  duration: number;
}

// Bridge client interface
export interface BridgeClient {
  send(message: BridgeMessage): void;
  onMessage(callback: (message: BridgeMessage) => void): void;
  disconnect(): void;
}
