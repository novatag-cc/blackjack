import { Injectable } from '@angular/core';
import { CardModel } from '@bj-models/card.model';
import { MainDeckModel } from '@bj-models/main-deck.model';
import { PlayerDeckModel } from '@bj-models/player-deck.model';

/**
 * Centraliza operacoes relacionadas aos baralhos do jogo.
 *
 * Responsabilidades:
 * - montar e embaralhar o baralho principal;
 * - criar baralhos individuais por jogador;
 * - sacar cartas do baralho principal para um jogador.
 */
@Injectable({
  providedIn: 'root'
})
export class DeckService {

  /** Naipes utilizados para gerar o baralho principal. */
  private suits: string[] = ['S', 'D', 'C', 'H'];

  /** Faces utilizadas para gerar o baralho principal. */
  private faces: string[] = ['A', 'K', 'Q', 'J', '0', '9', '8', '7', '6', '5', '4', '3', '2'];

  /** Baralho principal da partida. */
  mainDeck = new MainDeckModel({ cards: [] });

  /** Mapeia o identificador do jogador para seu respectivo baralho. */
  playersDecks: { [key: string]: MainDeckModel | PlayerDeckModel } = {};

  /**
   * Cria um baralho padrao de 52 cartas e embaralha antes de retornar.
   *
   * Regras:
   * - `A` vale `[1, 11]`;
   * - `K`, `Q`, `J` e `0` (10) valem `[10]`;
   * - demais cartas numericas valem o proprio numero.
   *
   * @returns Instancia de `MainDeckModel` pronta para compra de cartas.
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
   * Cria e registra o baralho de um jogador.
   * @param player Identificador unico do jogador.
   * @returns Baralho do jogador criado vazio.
   */
  createPlayerDeck(player: string): PlayerDeckModel {
    const deck = new PlayerDeckModel({ cards: [] });
    this.playersDecks[player] = deck;
    return deck;
  }

  /**
   * Compra uma carta do baralho principal para o jogador.
   *
   * A compra so acontece quando o total atual do jogador for menor que 21.
   *
   * @param playerDeck Baralho do jogador que recebera a carta.
   * @param isFaceUp Define se a carta chega virada para cima. Padrao: `true`.
   */
  drawCard(playerDeck: PlayerDeckModel, isFaceUp = true) {
    if (playerDeck.totalPoints < 21) {
      const card = this.mainDeck.drawCard();
      card.isFaceUp = isFaceUp;
      playerDeck.addCard(card);
    }
  }
}
