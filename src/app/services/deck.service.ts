import { Injectable } from '@angular/core';
import { CardModel } from '@bj-models/card.model';
import { MainDeckModel } from '@bj-models/main-deck.model';
import { PlayerDeckModel } from '@bj-models/player-deck.model';
@Injectable({
  providedIn: 'root'
})
export class DeckService {
  private suits: string[] = ['S', 'D', 'C', 'H'];
  private faces: string[] = ['A', 'K', 'Q', 'J', '0', '9', '8', '7', '6', '5', '4', '3', '2'];
  mainDeck = new MainDeckModel({ cards: [] });
  playersDecks: { [key: string]: MainDeckModel | PlayerDeckModel } = {};

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

  createPlayerDeck(player: string): PlayerDeckModel {
    const deck = new PlayerDeckModel({ cards: [] });
    this.playersDecks[player] = deck;
    return deck;
  }

  drawCard(playerDeck: PlayerDeckModel, isFaceUp = true) {
    if (playerDeck.totalPoints < 21) {
      const card = this.mainDeck.drawCard();
      card.isFaceUp = isFaceUp;
      playerDeck.addCard(card);
    }
  }
}
