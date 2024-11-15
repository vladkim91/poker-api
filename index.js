const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const http = require('http');
const cors = require('cors');
const { typeDefs } = require('./schema');
const { Query } = require('./resolvers/Query');
const { Mutation } = require('./resolvers/Mutation');
const { db } = require('./db');

const resolvers = {
  Query,
  Mutation
};

// Create an Apollo Server instance with introspection enabled
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true
});

async function startServer() {
  // Initialize an Express application
  const app = express();

  // Apply CORS middleware
  app.use(
    cors({
      origin: ['https://studio.apollographql.com', '*'],
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true
    })
  );

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware to the Express app
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ db })
    })
  );

  // Create an HTTP server
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 4000;

  // Start listening on the specified port
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => console.error(err));
