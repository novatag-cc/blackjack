import { Injectable } from '@angular/core';
import { CardModel } from '@bj-models/card.model';
import { MainDeckModel } from '@bj-models/main-deck.model';
import { PlayerDeckModel } from '@bj-models/player-deck.model';

/**
 * Handles deck creation and card drawing for the Blackjack game.
 */
@Injectable({
  providedIn: 'root'
})
export class DeckService {
  /** Suits used to generate a standard 52-card deck. */
  private suits: string[] = ['S', 'D', 'C', 'H'];

  /** Faces used to generate a standard 52-card deck. */
  private faces: string[] = ['A', 'K', 'Q', 'J', '0', '9', '8', '7', '6', '5', '4', '3', '2'];

  /** Main game deck from which cards are drawn. */
  mainDeck = new MainDeckModel({ cards: [] });

  /** Player decks indexed by player identifier. */
  playersDecks: { [key: string]: MainDeckModel | PlayerDeckModel } = {};

  /**
   * Builds and shuffles the main deck.
   *
   * Card values:
   * - Ace: `[1, 11]`
   * - King/Queen/Jack/Ten: `[10]`
   * - Number cards: `[face value]`
   */
  createMainDeck(): MainDeckModel {
    const cards = [];

    for (const i in this.suits) {
      for (const j in this.faces) {
        cards.push(new CardModel({
          suit: this.suits[i],
          face: this.faces[j],
          image: `https://deckofcardsapi.com/static/img/${this.faces[j]}${this.suits[i]}.svg`,
          value: ((card): number[] => {
            switch (card) {
              case 'A':
                return [1, 11];
              case 'K':
              case 'Q':
              case 'J':
              case '0':
                return [10];
              default:
                return [parseInt(card, 10)];
            }
          })(this.faces[j])
        }));
      }
      this.mainDeck.cards = cards;
    }

    this.mainDeck.shuffle();

    return this.mainDeck;
  }

  /**
   * Creates and stores an empty deck for a player.
   */
  createPlayerDeck(player: string): PlayerDeckModel {
    const deck = new PlayerDeckModel({ cards: [] });
    this.playersDecks[player] = deck;
    return deck;
  }

  /**
   * Draws one card from the main deck into a player deck.
   * The draw only happens when the player has less than 21 points.
   */
  drawCard(playerDeck: PlayerDeckModel, isFaceUp = true) {
    if (playerDeck.totalPoints < 21) {
      const card = this.mainDeck.drawCard();
      card.isFaceUp = isFaceUp;
      playerDeck.addCard(card);
    }
  }
}
