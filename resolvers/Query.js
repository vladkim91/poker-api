exports.Query = {
  players: (parent, args, { db }) => {
    return db.players;
  },
  messages: (parent, args, { db }) => {
    return db.messages;
  }
};
