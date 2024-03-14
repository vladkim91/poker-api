const {
  checkIfValid,
  splitTheString,
  assignCombinationsToPlayers
} = require('./functions/functions.js');

const { compareHandStrength } = require('./functions/compareHandStrength.js');

exports.Mutation = {
  calcWinner: (parent, { input }, context) => {


    const data = []
    for (let i = 0; i < input.playerInput.length; i++) {
      // console.log(input.playerInput[i])
      if (!checkIfValid(input.playerInput[i])) throw new Error('Invalid Cards');
      // console.log(input.playerInput[i])
      // if (!checkIfValid(arr[i])) throw new Error('Invalid Cards');

      const [players, communityCards] = splitTheString(input.playerInput[i].split('/'));
      // const [players, communityCards] = splitTheString(arr[i].players.split('/'));

      // add  madeHands object to everplayer player

      assignCombinationsToPlayers(players, communityCards);

      /**
       *Packages winners and players into and object and returns data request Object
       *@returns data package with winner and all players
       */

      const checkWinner = () => {
        const winnerIdx = compareHandStrength(players, communityCards);
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
      // const data = { winners: checkWinner(), players: players, id: createId(20) };
      data.push({ winners: checkWinner(), players: players, id: createId(20) })
    }
    return data;
  }
};

