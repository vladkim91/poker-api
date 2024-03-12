const {
  checkIfValid,
  splitTheString,
  assignCombinationsToPlayers
} = require('./function.js');

exports.Mutation = {
  calcWinner: (parent, { input }, context) => {
    const cardRanking = {
      2: 0,
      3: 1,
      4: 2,
      5: 3,
      6: 4,
      7: 5,
      8: 6,
      9: 7,
      T: 8,
      J: 9,
      Q: 10,
      K: 11,
      A: 12
    };

    if (!checkIfValid(input)) throw new Error('Invalid Cards');

    const [players, communityCards] = splitTheString(input.players.split('/'));

    // add  madeHands object to everplayer player

    assignCombinationsToPlayers(players, communityCards);
    /**
     * find identical hand strength and return a winner
     * @returns index of the winner
     */
    const compareHandStrength = () => {
      // Reverse card value to playing cards
      const getCardByValue = (value) => {
        return Object.keys(cardRanking).find(
          (key) => cardRanking[key] === value
        );
      };
      // Isolate hand strength from array of all players
      const strengthArray = Object.values(players).map((e) => e.handStrength);

      console.log(strengthArray);
      // Find the highest strength
      const highestStrength = Math.max(...strengthArray);
      // Check if there are more than 1 players with the highest strength hand
      if (strengthArray.filter((e) => e === highestStrength).length > 1) {
        const winnersIndices = [];
        // add indices of the highest strength hand players to the array
        for (let i in strengthArray) {
          if (strengthArray[i] == highestStrength) {
            winnersIndices.push(+i);
          }
        }

        const checkHighCardTie = (indices) => {
          const winnerScores = [];
          // Map winner combined hand arrays to winner scores array
          for (
            let i = 0;
            i < strengthArray.filter((e) => e === highestStrength).length;
            i++
          ) {
            // convert player hands into points arrays
            winnerScores.push(
              players[indices[i]].hand
                .concat(...communityCards)
                .map((card) => cardRanking[card[0]])
                .sort((a, b) => b - a)
            );
          }
          // Loop throogh the first 5 cards with highest value
          for (let j = 0; j < 5; j++) {
            const cards = [];
            // Add ith cards from every player to the array
            for (let i = 0; i < indices.length; i++) {
              cards.push(winnerScores[i][j]);
            }
            console.log(cards, 'cards');

            // Find max value of current set of hands
            const maxValue = Math.max(...cards);

            const findWinningFive = (cards, idx) => {
              const everyCard = [
                ...players[idx].hand.concat(...communityCards)
              ];

              // find 5 best cards
              // console.log(everyCard);
              const bestFiveCardsToValuesSorted = everyCard
                .map((card) => {
                  return [cardRanking[card[0]], card[1]];
                  // return cardRanking(card[0]) + card[1];
                })
                .sort((a, b) => b[0] - a[0])
                .slice(0, 5)
                .map((card) => {
                  return getCardByValue(card[0]) + card[1];
                });
              return bestFiveCardsToValuesSorted;
            };
            // return index or indices of the players with the best winning combination
            // IF 1 PLAYERS WINS
            if (
              !cards.every((card) => card == maxValue) &&
              cards.filter((card) => card == maxValue).length == 1
            ) {
              // add winning combo to the player with the best hand
              if (
                players[cards.indexOf(maxValue)].winningCombination.length == 0
              ) {
                players[cards.indexOf(maxValue)].winningCombination.push(
                  ...findWinningFive(cards, cards.indexOf(maxValue))
                );
              }

              // returns index of the winner
              return cards.indexOf(maxValue);
            } else if (
              //
              // IF THERE'S MORE than 1 winner with highest value
              !cards.every((card) => card == maxValue) &&
              cards.filter((card) => card == maxValue).length > 1
            ) {
              const winnersIndices = cards
                .map((card, idx) => {
                  if (card !== maxValue) return null;
                  else return idx;
                })
                .filter((idx) => idx !== null);
              // Isolate the best 5 cards from all players and assign it to winning combination
              winnersIndices.forEach((idx) => {
                if (players[idx].winningCombination.length == 0) {
                  players[idx].winningCombination.push(
                    ...findWinningFive(cards, idx)
                  );
                }
              });

              // Rank the score of 5 best cards and compare them
              const highestFiveCardScore = new Array(winnersIndices.length);

              for (let i = 0; i < winnersIndices.length; i++) {
                highestFiveCardScore[i] = players[
                  winnersIndices[i]
                ].winningCombination
                  .map((card) => cardRanking[card[0]])
                  .reduce((acc, cur) => acc + cur, 0);
              }

              // if (
              //   highestFiveCardScore.filter(
              //     (e) => e === Math.max(...highestFiveCardScore)
              //   )
              // ) {
              //   return (
              //     winnersIndices[
              //       highestFiveCardScore.indexOf(
              //         Math.max(...highestFiveCardScore)
              //       )
              //     ],
              //     winnersIndices
              //   );
              // }

              // Check if not equal

              if (
                highestFiveCardScore.length !==
                new Set(highestFiveCardScore).size
              ) {
                return winnersIndices;
              } else {
                return highestFiveCardScore.indexOf(
                  Math.max(...highestFiveCardScore)
                );
              }
              // Check if every combination is equal
            } else if (cards.every((card) => card == maxValue)) {
              winnersIndices.forEach((idx) => {
                if (players[idx].winningCombination.length == 0) {
                  players[idx].winningCombination.push(
                    ...findWinningFive(cards, idx)
                  );
                }
              });
            }
          }
          // return all players
          return indices;
        };

        const checkPairTie = (indices) => {
          for (let idx of indices) {
            console.log(players[idx]);
          }
          return indices;
        };

        // Run the check for highest scoring combination
        switch (highestStrength) {
          case 0:
            return checkHighCardTie(winnersIndices);
          case 1:
            return checkPairTie(winnersIndices);
        }
      } else {
        let winnerId;
        let maxStrength = -1;
        for (let player of players) {
          if (player.handStrength > maxStrength) {
            maxStrength = player.handStrength;
            winnerId = player.id;
          }
        }

        return players.findIndex((player) => player.id === winnerId);
      }
    };

    /**
     *Packages winners and players into and object and returns data request Object
     *@returns data package with winner and all players
     */

    const checkWinner = () => {
      const winnerIdx = compareHandStrength();
      if (typeof winnerIdx == 'object') {
        const winners = [];
        for (let i of winnerIdx) {
          winners.push(players[i]);
        }

        return winners;
      } else if (typeof winnerIdx == 'number') {
        return [players[winnerIdx]];
      }
    };

    function createId(length) {
      let result = '';
      const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
        counter += 1;
      }
      return result;
    }
    const data = { winners: checkWinner(), players: players, id: createId(20) };

    return data;
  }
};
