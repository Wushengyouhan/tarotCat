import deckManifest from "@/data/tarot/deck-manifest.json";
import type { CardDefinition } from "@/lib/tarot/types";

const cards: CardDefinition[] = deckManifest.cards.map((card) => ({
  id: card.id,
  nameEn: card.nameEn,
  nameZh: card.nameZh,
  image: card.image,
  arcana: card.arcana as CardDefinition["arcana"],
  suit: card.suit,
  number: card.number,
}));

const byId = new Map(cards.map((card) => [card.id, card]));

export class Deck {
  getCardById(id: string): CardDefinition | undefined {
    return byId.get(id);
  }

  allCards(): CardDefinition[] {
    return [...cards];
  }
}

export const defaultDeck = new Deck();
