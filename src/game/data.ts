import elementsData from '../game-data/elements.json';
import typesData from '../game-data/types.json';

export type Role = 'Tank' | 'Healer' | 'DPS';

export type BaseStats = {
  hp: number;
  defense: number;
  attack: number;
  mind: number;
  speed: number;
  luck: number;
  intelligence: number;
  spellEnergy: number;
};

export function getElements(): string[] {
  return elementsData.elements;
}

export function getElementMultiplier(attacker: string, defender: string): number {
  const row = (elementsData.multipliers as Record<string, Record<string, number>>)[attacker];
  if (!row) return 1.0;
  return row[defender] ?? 1.0;
}

export function getTypes(): { name: string; role: Role; baseStats: BaseStats }[] {
  return typesData.types as { name: string; role: Role; baseStats: BaseStats }[];
}

export function getTypeBaseStats(typeName: string): BaseStats {
  const entry = getTypes().find((t) => t.name === typeName);
  if (!entry) throw new Error(`Unknown type: ${typeName}`);
  return entry.baseStats;
}

export function getTypeRole(typeName: string): Role {
  const entry = getTypes().find((t) => t.name === typeName);
  if (!entry) throw new Error(`Unknown type: ${typeName}`);
  return entry.role;
}

export function getTypeMultiplier(attackerType: string, defenderType: string): number {
  const m = typesData.multipliers as Record<string, Record<string, number>>;
  const row = m[attackerType];
  if (!row) return (typesData.defaultMultiplier as number) ?? 1.0;
  return row[defenderType] ?? ((typesData.defaultMultiplier as number) ?? 1.0);
}