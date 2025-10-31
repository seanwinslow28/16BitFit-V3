/**
 * Hybrid Velocity Bridge Client
 * Handles communication between React Native shell and Phaser game engine
 * Placeholder - will be implemented in bridge story
 */

import type { BridgeClient, BridgeMessage } from '@packages/bridge-interface';

export class HybridBridge implements BridgeClient {
  send(message: BridgeMessage): void {
    console.log('[Bridge] Sending message:', message);
    // Implementation will be added in bridge story
  }

  onMessage(callback: (message: BridgeMessage) => void): void {
    console.log('[Bridge] Message handler registered');
    // Implementation will be added in bridge story
  }

  disconnect(): void {
    console.log('[Bridge] Disconnecting');
    // Implementation will be added in bridge story
  }
}
