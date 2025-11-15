/**
 * Archetype Constants
 * Character archetypes for user selection
 */

export interface Archetype {
  id: string;
  name: string;
  description: string;
  spriteSource: any; // In real implementation, use actual sprite images
  stats: {
    strength: number;
    agility: number;
    endurance: number;
    intelligence: number;
  };
}

// Placeholder sprite (will be replaced with actual sprites)
const placeholderSprite = { uri: 'https://via.placeholder.com/80' };

export const ARCHETYPES: Archetype[] = [
  {
    id: 'warrior',
    name: 'Warrior',
    description: 'High strength, balanced endurance',
    spriteSource: placeholderSprite,
    stats: {
      strength: 90,
      agility: 60,
      endurance: 80,
      intelligence: 50,
    },
  },
  {
    id: 'rogue',
    name: 'Rogue',
    description: 'High agility, quick strikes',
    spriteSource: placeholderSprite,
    stats: {
      strength: 60,
      agility: 90,
      endurance: 65,
      intelligence: 70,
    },
  },
  {
    id: 'monk',
    name: 'Monk',
    description: 'Balanced stats, versatile fighter',
    spriteSource: placeholderSprite,
    stats: {
      strength: 70,
      agility: 75,
      endurance: 75,
      intelligence: 65,
    },
  },
  {
    id: 'powerlifter',
    name: 'Powerlifter',
    description: 'Maximum strength, heavy hitter',
    spriteSource: placeholderSprite,
    stats: {
      strength: 95,
      agility: 45,
      endurance: 85,
      intelligence: 55,
    },
  },
  {
    id: 'runner',
    name: 'Runner',
    description: 'High endurance, stamina focused',
    spriteSource: placeholderSprite,
    stats: {
      strength: 55,
      agility: 80,
      endurance: 95,
      intelligence: 60,
    },
  },
];

export const getArchetypeById = (id: string): Archetype | undefined => {
  return ARCHETYPES.find((archetype) => archetype.id === id);
};
