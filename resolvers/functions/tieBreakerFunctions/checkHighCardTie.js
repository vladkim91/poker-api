
const { getCardByValue, findWinningFive } = require('../functions')
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
// Reverse card value to playing cards

const checkHighCardTie = (
  indices,
  strengthArray,
  highestStrength,
  players,
  cc
) => {
  const winnerScores = [];
  // Map winner combined hand arrays to winner scores array
  // console.log(indices, strengthArray, highestStrength, players, cc);

  for (
    let i = 0;
    i < strengthArray.filter((e) => e === highestStrength).length;
    i++
  ) {
    // convert player hands into points arrays
    winnerScores.push(
      players[indices[i]].hand
        .concat(...cc)
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

    // Find max value of current set of hands
    const maxValue = Math.max(...cards);


    // return index or indices of the players with the best winning combination
    // IF 1 PLAYERS WINS

    if (
      !cards.every((card) => card == maxValue) &&
      cards.filter((card) => card == maxValue).length == 1
    ) {
      // add winning combo to the player with the best hand
      if (players[cards.indexOf(maxValue)].winningCombination.length == 0) {
        players[cards.indexOf(maxValue)].winningCombination.push(
          ...findWinningFive(players, cards.indexOf(maxValue), ...cc)
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
          players[idx].winningCombination.push(...findWinningFive(players, idx, ...cc));
          const values = [...findWinningFive(players, idx, ...cc)].map(
            (card) => cardRanking[card[0]]
          );
          players[idx].winningComboValues.push(...values);
        }
      });

      // Rank the score of 5 best cards and compare them

      function findTimeBreakerWinners(playerIndices) {
        // This will hold the index of the player with the currently winning hand
        let winningIndex = playerIndices[0];

        // Go through each card position starting from the highest
        for (let cardPos = 0; cardPos < 5; cardPos++) {
          let maxCardValue = players[winningIndex].winningComboValues[cardPos];
          let winners = [winningIndex];

          // Compare this card with the same card from other players' hands
          for (let i = 1; i < playerIndices.length; i++) {
            let currentIndex = playerIndices[i];
            let currentCardValue =
              players[currentIndex].winningComboValues[cardPos];

            // If we find a higher card, update the max value and reset the winners array
            if (currentCardValue > maxCardValue) {
              maxCardValue = currentCardValue;
              winningIndex = currentIndex;
              winners = [currentIndex];
            } else if (currentCardValue === maxCardValue) {
              // If the card values are the same, add this player to the winners array
              winners.push(currentIndex);
            }
          }

          // If there's only one winner and we're not at the last card, break early
          if (winners.length === 1 && cardPos < 4) {
            return winningIndex;
          } else if (winners.length > 1 && cardPos === 4) {
            // If it's the last card and there's more than one winner, it's a tie
            return winners; // Return the indices of all tied players
          }
        }

        // If somehow we get here, default to the first player (shouldn't happen with proper input)
        return winningIndex;
      }
      return findTimeBreakerWinners(winnersIndices);
    }
  }

  const assignWinningCombinationsToAll = (playerIndices) => {
    playerIndices.forEach((idx) => {
      const bestFiveCardsToValuesSorted = [...players[idx].hand.concat(...cc)]
        .map((card) => {
          return [cardRanking[card[0]], card[1]]; // Map card to its rank and suit
        })
        .sort((a, b) => b[0] - a[0]) // Sort cards by rank in descending order
        .slice(0, 5) // Take the top 5 cards
        .map((card) => {
          return getCardByValue(card[0]) + card[1]; // Convert card ranks back to card representations
        });

      // Only add the combination if it hasn't been added already
      if (players[idx].winningCombination.length === 0) {
        players[idx].winningCombination.push(...bestFiveCardsToValuesSorted);
        const values = bestFiveCardsToValuesSorted.map(
          (card) => cardRanking[card[0]]
        );
        players[idx].winningComboValues.push(...values);
      }
    });
  };

  // Before returning indices, call the function to assign winning combinations to all involved players
  assignWinningCombinationsToAll(indices);
  return indices;
};

module.exports = { checkHighCardTie };
