// Engine pro prší.

// Konstanty
/*
a - srdce, s - listy, d - žaludy, f - kule
7, 8, 9, x - 10, k - král, a - eso, s - spodek, f - svršek
*/
const CARD_COUNT = 38;
const TYPES = [
    "a", "s", "d", "f", "?"
];

const SYMBOLS = {
    "a": "♥",
    "s": "♠",
    "d": "🌰",
    "f": "●",
    "?": "❔"
}

const COLORS = {
    "a": "red",
    "s": "lime",
    "d": "brown",
    "f": "orange",
    "?": "black"
}

const VALUES = [
    "7", "8", "9", "x", "k", "a", "s", "f", "?"
];

const MAX_LINES = 20;

class Card {
    constructor(card) {
        this.type = card.charAt(0);
        this.value = card.charAt(1);
        this.alive = true;

        // Check if card is valid, else throw error
        if (!TYPES.includes(this.type) || !VALUES.includes(this.value)) {
            printLn("<span style='color: red'>Neplatná karta " + card + "</span>");
            throw new Error("Invalid card " + card);
        }

        if (this.value == "f")
            this.alive = false;
    }

    getSymbol() {
        return SYMBOLS[this.type];
    }

    getColor() {
        return COLORS[this.type];
    }

    getCard() {
        return this.type + this.value;
    }

    isAlive() {
        return this.alive;
    }

    kill() {
        this.alive = false;
    }

    isSpecial() {
        return this.value === "7" || this.value === "a" || this.value === "f";
    }

    toHtml() { // return span with set color
        return `<span style="color: ${this.getColor()}">${this.getSymbol()}${this.value}</span>`;
    }

    canCounter(card) {
        return this.value === card.value;
    }
}

const UNKNOWN_CARD = "??";
const UNKNOWN_CARD_OBJ = new Card(UNKNOWN_CARD);
class Player {
    constructor() {
        this.hand = [UNKNOWN_CARD_OBJ, UNKNOWN_CARD_OBJ, UNKNOWN_CARD_OBJ, UNKNOWN_CARD_OBJ];
    }

    addCard(card) {
        this.hand.push(card);
    }

    removeCard(card) {
        this.hand.splice(this.hand.indexOf(card), 1);
    }

    getPlayableCards(card) {
        return this.hand.filter(c => c.type === card.type || c.value === card.value || c.value == "f").sort((a, b) => {
            // if it is "a" or "7" it should be prioritized
            if (a.value === "a" || a.value === "7") {
                return -1;
            } else if (b.value === "a" || b.value === "7") {
                return 1;
            } else {
                return 0;
            }
        });
    }

    removeUnknown() {
        // removes just one unknown card
        this.hand.splice(this.hand.indexOf(UNKNOWN_CARD_OBJ), 1);
    }
}

class Game {
    constructor(playerCount, layedOutCard) {
        this.players = [];
        for (let i = 0; i < playerCount; i++) {
            this.players.push(new Player());
        }
        this.layedOutCards = [layedOutCard];

        // Create drawing deck, fill it with unknown cards. There is set number of cards, each player starts with 4 and 1 is layed out.
        this.deck = [];
        for (let i = 0; i < CARD_COUNT - playerCount * 4 - 1; i++) {
            this.deck.push(UNKNOWN_CARD_OBJ);
        }
        printLn("V lízacím balíčku je " + this.deck.length + " karet");
        printLn("Na stole je " + layedOutCard.toHtml());

        this.currentPlayer = parseInt(prompt("Jaký začíná hráč? 0 - vy a pokračuje se ve směru hry"));
    }

    localPlayer() {
        return this.players[0];
    }

    async startGame() {
        // If card is 7 or a, ask if it counts
        if (this.topCard().isSpecial()) {
            await new Promise((resolve) => {
                printLn("Počítá se " + this.topCard().toHtml() + "? Jestli ano zadejte kartu na spodu lízacího balíčku, jestli ne tak ??.");
                addConsumer(1, (cards) => {
                    var card = cards[0];
                    if (card.getCard() === UNKNOWN_CARD) {
                        this.topCard().kill();
                        printLn("Karta " + this.topCard().toHtml() + " neplatí");
                    } else {
                        printLn("Karta " + this.topCard().toHtml() + " platí");
                        // Change the bottom of the deck to the inputed card (index 0)
                        this.deck[0] = card;
                        if (this.topCard().value == "f") {
                            // Svršek, mění barvu
                            this.topCard().type = card.type;
                        }
                    }
                    resolve();
                });
            });
        }

        this.running = true;
        while (this.running) {
            // For loop for players
            for (let i = 0; i < this.players.length; i++) {
                this.currentPlayer = i;
                // Print the next card in the deck
                printLn("Další karta v lízacím balíčku: " + this.deck[this.deck.length - 1].toHtml());

                if (i == 0) {
                    await this.playLocal();
                } else {
                    await this.playOther();
                }
            }

            // Print what is on the table and in each players hand
            printLn("Na stole je: " + this.layedOutCards.map(c => c.toHtml()).join(" "));
            for (let j = 0; j < this.players.length; j++) {
                printLn(" - Hráč " + j + " má karty: " + this.players[j].hand.map(c => c.toHtml()).join(" "));
            }

            // Check if anyone has 0 cards, if true remove them from the game
            for (let j = 0; j < this.players.length; j++) {
                if (this.players[j].hand.length == 0) {
                    printLn("Hráč " + j + " vyhrál!");
                    this.running = false;
                    break;
                }
            }
        }

        printLn("Konec...");
    }

    topCard() {
        return this.layedOutCards[this.layedOutCards.length - 1];
    }

    changeTop(color) {
        this.topCard().type = color;
    }

    async playLocal() {
        printLn("Jste na tahu");
        printLn("Vaše karty: " + this.localPlayer().hand.map(c => c.toHtml()).join(" "));
        var playable = this.localPlayer().getPlayableCards(this.layedOutCards[this.layedOutCards.length - 1]);

        var top = this.topCard();
        // Zjištění zda-li je nahoře speciální karta
        if (top.isSpecial() && top.isAlive()) {
            if (top.value === "7") {
                // Musí se zahrát sedm, nebo se berou 2
                var counterCards = playable.filter(c => top.canCounter(c));
                if (counterCards.length === 0) {
                    var draws = this.countAliveSevens() * 2;
                    printLn("Musíte si líznout " + draws + " karet")
                    await await this.draw(draws);
                    top.kill();
                } else {
                    printLn("Můžete zahrát sedmičku");
                    // Vyber sedmičku podle násl. pravidel
                    // Pokud má jednu sedmičku, vyberte ji
                    // Pokud má více sedmiček, vyberte takovou, jakou barvu má ještě v ruce (pokud takovou má)

                    if (counterCards.length === 1) {
                        printLn("Zahrajte následující sedmičku: " + counterCards[0].toHtml());
                        this.localPlayer().removeCard(counterCards[0]);
                        this.layedOutCards.push(counterCards[0]);
                    } else {
                        var colors = this.localPlayer().hand.map(c => c.type);
                        var color = counterCards.filter(c => colors.includes(c.type));

                        if (color.length > 0) {
                            printLn("Zahrajte následující sedmičku: " + color[0].toHtml());
                            this.localPlayer().removeCard(color[0]);
                            this.layedOutCards.push(color[0]);
                        } else {
                            printLn("Zahrajte následující sedmičku: " + counterCards[0].toHtml());
                            this.localPlayer().removeCard(counterCards[0]);
                            this.layedOutCards.push(counterCards[0]);
                        }
                    }
                }
            } else if (top.value === "a") {
                // Musí se zahrát eso, nebo stojíte
                var counterCards = playable.filter(c => top.canCounter(c));
                if (counterCards.length === 0) {
                    printLn("Nemáte eso, musíte stát");
                    top.kill();
                } else {
                    printLn("Můžete zahrát eso");
                    // Stejná logika jako u sedmičky
                    if (counterCards.length === 1) {
                        printLn("Zahrajte následující eso: " + counterCards[0].toHtml());
                        this.localPlayer().removeCard(counterCards[0]);
                        this.layedOutCards.push(counterCards[0]);
                    } else {
                        var colors = this.localPlayer().hand.map(c => c.type);
                        var color = counterCards.filter(c => colors.includes(c.type));

                        if (color.length > 0) {
                            printLn("Zahrajte následující eso: " + color[0].toHtml());
                            this.localPlayer().removeCard(color[0]);
                            this.layedOutCards.push(color[0]);
                        } else {
                            printLn("Zahrajte následující eso: " + counterCards[0].toHtml());
                            this.localPlayer().removeCard(counterCards[0]);
                            this.layedOutCards.push(counterCards[0]);
                        }
                    }
                }
            }
        } else {
            // Pokud je nahoře normální karta
            if (playable.length === 0) {
                printLn("Nemáte žádnou hratelnou kartu, lízněte si");
                await this.draw(1);
                printLn("Dolízáno");
            } else {
                printLn("Můžete zahrát: " + playable.map(c => c.toHtml()).join(" "));
                // Stejná logika jako u sedmičky
                if (playable.length === 1) {
                    printLn("Zahrajte následující kartu: " + playable[0].toHtml());
                    // Pokud se jedná o svrška, tak změn barvu na takovou, kterou má hráč
                    if (playable[0].value == "f") {
                        var colors = this.localPlayer().hand.map(c => c.type).filter(c => c !== playable[0].type);

                        if (colors.length > 0) {
                            printLn("Změnte barvu na: " + colors[0]);
                            playable[0].type = colors[0];
                        } else {
                            printLn("Nechte barvu");
                        }
                    }
                    this.localPlayer().removeCard(playable[0]);
                    this.layedOutCards.push(playable[0]);
                } else {
                    var colors = this.localPlayer().hand.map(c => c.type);
                    var color = playable.filter(c => colors.includes(c.type));

                    if (color.length > 0) {
                        printLn("Zahrajte následující kartu: " + color[0].toHtml());
                        this.localPlayer().removeCard(color[0]);
                        this.layedOutCards.push(color[0]);
                    } else {
                        printLn("Zahrajte následující kartu: " + playable[0].toHtml());
                        this.localPlayer().removeCard(playable[0]);
                        this.layedOutCards.push(playable[0]);
                    }
                }
            }
        }
    }

    countAliveSevens() {
        let counter = 0;
        for (let i = this.layedOutCards.length - 1; i > 0; i--) {
            const card = this.layedOutCards[i];
            if (card.isSpecial() && card.isAlive() && card.value == 7) {
                counter++;
            } else {
                break;
            }
        }
        return counter;
    }

    async playOther() {
        // Prints out players hand, than the topCard if it is special, then ask for a card or ??. Else ask for card that the player played
        printLn("Hráč " + this.currentPlayer + " má karty: " + this.players[this.currentPlayer].hand.map(c => c.toHtml()).join(" "));
        var top = this.topCard();

        if (top.isSpecial() && top.isAlive()) {
            if (top.value === "7") {
                printLn("Hráč " + this.currentPlayer + " musí zahrát sedmičku nebo líznout karty");
                printLn("Zadejte kartu, kterou přebyl, nebo ?? pokud si líže");

                await new Promise((resolve) => {
                    addConsumer(1, (cards) => {
                        var c = cards[0];
                        if (c.getCard() === UNKNOWN_CARD) {
                            var draws = this.countAliveSevens() * 2;
                            printLn("Hráč " + this.currentPlayer + " si lízne karty: " + draws);
                            this.draw(draws);
                            top.kill();
                        } else {
                            printLn("Hráč zahrál " + c.toHtml());
                            this.players[this.currentPlayer].removeCard(c);
                            this.layedOutCards.push(c);
                        }
                        resolve();
                    });
                });

            } else if (top.value === "a") {
                printLn("Hráč " + this.currentPlayer + " musí zahrát eso nebo stát");
                printLn("Zadejte kartu, kterou přebyl, nebo ?? pokud stojí");

                await new Promise((resolve) => {
                    addConsumer(1, (cards) => {
                        var c = cards[0];
                        if (c.getCard() === UNKNOWN_CARD) {
                            printLn("Hráč " + this.currentPlayer + " stojí");
                            top.kill();
                        } else {
                            printLn("Hráč zahrál " + c.toHtml());
                            this.players[this.currentPlayer].removeCard(c);
                            this.layedOutCards.push(c);
                        }
                        resolve();
                    });
                });

            }
        } else {
            printLn("Hráč " + this.currentPlayer + " může zahrát: " + this.players[this.currentPlayer].getPlayableCards(top).map(c => c.toHtml()).join(" "));
            printLn("Zadejte kartu, kterou hráč zahrál, nebo ?? pokud si líže");

            await new Promise((resolve) => {
                addConsumer(1, (cards) => {
                    var c = cards[0];
                    if (c.getCard() !== UNKNOWN_CARD) {
                        printLn("Hráč zahrál " + c.toHtml());
                        // if player has the card, remove it. Else remove ??
                        if (this.players[this.currentPlayer].hand.includes(c)) {
                            this.players[this.currentPlayer].removeCard(c);
                        } else {
                            this.players[this.currentPlayer].removeUnknown();
                        }
                        this.layedOutCards.push(c);
                    } else {
                        printLn("Hráč si líže");
                        this.draw(1);
                    }
                    resolve();
                });
            });
        }
    }


    draw(num) {
        return new Promise(async (resolve, reject) => {
            const drawCard = async () => {
                for (let i = 0; i < num; i++) {
                    if (this.deck.length > 0) {
                        await this.drawCardUnsafe();
                    } else {
                        printLn("Lízací balíček je prázdný, otáčím odhozené karty. Znám celý balíček :)");
                        this.deck = this.layedOutCards.slice(0, this.layedOutCards.length - 1).reverse();
                        // If it is still empty, game is over
                        if (this.deck.length > 0) {
                            await this.drawCardUnsafe();
                        } else {
                            printLn("Hra skončila, nelze si lízat karty. Tohle je edge case, který by se neměl stát."); // TODO: Handle game over
                            reject(new Error("Edge case: No cards to draw, game over.")); // Handle edge case
                            return;
                        }
                        break;
                    }
                }
                resolve(); // Resolve once drawing is done
            };

            try {
                await drawCard(); // Initiate drawing logic
            } catch (error) {
                reject(error); // Reject if any error occurs during the draw process
            }
        });
    }


    async drawCardUnsafe() {
        var card = this.deck.pop();

        if (this.currentPlayer == 0) {
            if (card.getCard() == UNKNOWN_CARD) {
                // Make user input the card
                printLn("Zadejte kartu, kterou jste si lízli");
                await new Promise((resolve) => {
                    addConsumer(1, (cards) => {
                        var card = cards[0];
                        // add to hand
                        this.players[this.currentPlayer].addCard(card);
                        printLn("Lízáte kartu: " + card.toHtml());
                        resolve();
                    });
                });
            } else {
                printLn("Lízáte kartu: " + card.toHtml());
            }
        } else {
            printLn("Hráč " + this.currentPlayer + " lízá kartu " + card.toHtml());
            this.players[this.currentPlayer].addCard(card);
        }
    }
}

let game;
function initGame(playerCount, playerHand, layedOutCard) {
    game = new Game(playerCount, layedOutCard);
    game.localPlayer().hand = playerHand;
    game.startGame();
}

/*
Input output handling
*/
const output = document.getElementById("output");
const input = document.getElementById("input");
let consumerQueue = [];
class CardConsumer {
    constructor(count, listener) {
        this.count = count;
        this.cards = [];
        this.listener = listener;
    }

    supply(card) {
        if (this.cards.length < this.count) {
            // Add cards to the deck
            this.cards.push(card);
        }

        if (this.cards.length == this.count) {
            this.listener(this.cards);
            return true;
        }
    }
}

function addConsumer(count, listener) {
    consumerQueue.push(new CardConsumer(count, listener));
}

function supplyTopConsumer(card) {
    if (consumerQueue.length > 0) {
        const consumer = consumerQueue[0];
        if (consumer.supply(card)) {
            consumerQueue.shift();
        }
    }
}

input.addEventListener("input", (e) => {
    const text = e.target.value.trim();

    if (text.length > 0 && text.length % 2 == 0) {
        e.target.value = "";
        let lastCard = text.substring(text.length - 2, text.length); // last two characters
        if (lastCard.startsWith("!")) {
            if (lastCard.endsWith("q")) {
                location.reload();
            } else {
                printLn("Změna barvy na " + lastCard.charAt(1));
                game.changeTop(lastCard.charAt(1));
            }
        } else {
            supplyTopConsumer(new Card(lastCard));
        }
    }
});

function printLn(str) {
    const ln = document.createElement("div");
    ln.className = "line";
    ln.innerHTML = str;

    output.appendChild(ln);

    // Remove first line if we have more than MAX_LINES
    if (output.childNodes.length > MAX_LINES) {
        output.removeChild(output.firstChild);
    }
}

/*
Start
*/
printLn("Zadejte vaši ruku (4 karty)");
addConsumer(4, (cards) => {
    const playerCount = parseInt(prompt("Zadejte počet hráčů")); // TODO: Get player count
    printLn("Ruka:" + cards.map(c => c.toHtml()).join(" "));
    // První vyložená karta
    printLn("Zadejte 1. kartu v odhazovacím balíčku");
    addConsumer(1, (card) =>
        initGame(playerCount, cards, card[0])
    );
});