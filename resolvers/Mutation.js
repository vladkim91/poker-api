const {
  checkIfValid,
  cardConversions,
  assignCombinationsToPlayers
} = require('./functions/functions.js');

const { compareHandStrength } = require('./functions/compareHandStrength.js');

exports.Mutation = {
  calcWinner: (parent, { input }, context) => {
    const data = [];
    for (let i = 0; i < input.playerInput.length; i++) {
      if (!checkIfValid(input.playerInput[i])) {
        throw new Error('Invalid Cards');
      }

      const [players, communityCards] = cardConversions.splitTheString(
        input.playerInput[i].split('/')
      );

      assignCombinationsToPlayers(players, ...communityCards);

      const checkWinner = () => {
        const winnerIdx = compareHandStrength(players, ...communityCards);
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

      function createPlayId(length) {
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
      data.push({
        winners: checkWinner(),
        players: players,
        id: createPlayId(20)
      });
    }
    return data;
  }
};
