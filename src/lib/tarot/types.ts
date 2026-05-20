export type Orientation = "upright" | "reversed";

export type SpreadId = "single" | "three-card";

export interface CardDefinition {
  id: string;
  nameEn: string;
  nameZh: string;
  image: string;
  arcana: "major" | "minor";
  suit: string | null;
  number: string;
}

export interface SpreadPosition {
  id: string;
  label: string;
}

export interface SpreadDefinition {
  id: SpreadId;
  name: string;
  positions: SpreadPosition[];
}

export interface DrawnCard {
  cardId: string;
  orientation: Orientation;
  positionId: string;
}

export interface DrawResult {
  cards: DrawnCard[];
}

export type Rng = () => number;
