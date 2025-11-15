/**
 * Design Tokens Test Suite
 *
 * Validates that all design tokens are exported correctly and match specifications.
 */

import { tokens } from '../tokens';

describe('Design Tokens', () => {
  describe('Color Tokens', () => {
    it('should export color tokens', () => {
      expect(tokens.colors).toBeDefined();
      expect(tokens.colors.background).toBeDefined();
      expect(tokens.colors.text).toBeDefined();
      expect(tokens.colors.border).toBeDefined();
      expect(tokens.colors.interactive).toBeDefined();
      expect(tokens.colors.feedback).toBeDefined();
      expect(tokens.colors.dmg).toBeDefined();
    });

    it('should have correct DMG Classic palette colors', () => {
      expect(tokens.colors.background.primary).toBe('#0F380F');
      expect(tokens.colors.text.primary).toBe('#9BBC0F');
      expect(tokens.colors.dmg.darkest).toBe('#0F380F');
      expect(tokens.colors.dmg.dark).toBe('#306230');
      expect(tokens.colors.dmg.light).toBe('#8BAC0F');
      expect(tokens.colors.dmg.lightest).toBe('#9BBC0F');
    });
  });

  describe('Spacing Tokens', () => {
    it('should export spacing tokens', () => {
      expect(tokens.spacing).toBeDefined();
      expect(tokens.spacing[0]).toBe(0);
      expect(tokens.spacing[1]).toBe(4);
      expect(tokens.spacing[2]).toBe(8);
      expect(tokens.spacing[3]).toBe(16);
      expect(tokens.spacing[4]).toBe(24);
      expect(tokens.spacing[5]).toBe(32);
    });

    it('should export component spacing shortcuts', () => {
      expect(tokens.component.buttonPaddingX).toBe(24);
      expect(tokens.component.buttonPaddingY).toBe(16);
      expect(tokens.component.inputPaddingX).toBe(16);
      expect(tokens.component.screenPaddingX).toBe(24);
    });
  });

  describe('Border Tokens', () => {
    it('should export border width tokens', () => {
      expect(tokens.border.width.none).toBe(0);
      expect(tokens.border.width.thin).toBe(2);
      expect(tokens.border.width.default).toBe(3);
      expect(tokens.border.width.thick).toBe(4);
    });

    it('should have zero border radius for retro aesthetic', () => {
      expect(tokens.border.radius).toBe(0);
    });
  });

  describe('Shadow Tokens', () => {
    it('should export shadow tokens', () => {
      expect(tokens.shadow.small).toBeDefined();
      expect(tokens.shadow.medium).toBeDefined();
      expect(tokens.shadow.large).toBeDefined();
    });

    it('should have correct medium shadow properties', () => {
      expect(tokens.shadow.medium.shadowOffset).toEqual({ width: 4, height: 4 });
      expect(tokens.shadow.medium.shadowOpacity).toBe(1);
      expect(tokens.shadow.medium.shadowRadius).toBe(0); // Hard edge
      expect(tokens.shadow.medium.shadowColor).toBe('#0F380F');
    });

    it('should have zero shadow radius for pixel-perfect hard shadows', () => {
      expect(tokens.shadow.small.shadowRadius).toBe(0);
      expect(tokens.shadow.medium.shadowRadius).toBe(0);
      expect(tokens.shadow.large.shadowRadius).toBe(0);
    });
  });

  describe('Icon Size Tokens', () => {
    it('should export icon size tokens', () => {
      expect(tokens.iconSize.xs).toBe(16);
      expect(tokens.iconSize.sm).toBe(24);
      expect(tokens.iconSize.md).toBe(32);
      expect(tokens.iconSize.lg).toBe(48);
      expect(tokens.iconSize.xl).toBe(64);
      expect(tokens.iconSize.xxl).toBe(80);
    });
  });

  describe('Touch Target Tokens', () => {
    it('should export touch target size tokens', () => {
      expect(tokens.touchTarget.minimum).toBe(44);
      expect(tokens.touchTarget.comfortable).toBe(48);
    });
  });

  describe('Opacity Tokens', () => {
    it('should export opacity scale', () => {
      expect(tokens.opacity.invisible).toBe(0);
      expect(tokens.opacity.muted).toBe(0.4);
      expect(tokens.opacity.solid).toBe(1);
    });
  });

  describe('Z-Index Tokens', () => {
    it('should export z-index scale', () => {
      expect(tokens.zIndex.base).toBe(0);
      expect(tokens.zIndex.modal).toBe(1200);
      expect(tokens.zIndex.tooltip).toBe(1500);
    });
  });
});
