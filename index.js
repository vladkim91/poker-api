const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { typeDefs } = require('./schema');
const { Query } = require('./resolvers/Query');
const { Mutation } = require('./resolvers/Mutation');
const { db } = require('./db');

// Define resolvers
const resolvers = {
  Query,
  Mutation
};

// Create Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers
});

// Start the server with context
async function startServer() {
  const { url } = await startStandaloneServer(server, {
    context: async () => ({ db }),
    listen: { port: 4000 }
  });
  console.log(`🚀 Server started at ${url}`);
}

startServer().catch((err) => console.error(err));
