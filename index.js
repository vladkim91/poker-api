const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const http = require('http');
const cors = require('cors');
const { json } = require('body-parser');
const { typeDefs } = require('./schema');
const { Query } = require('./resolvers/Query');
const { Mutation } = require('./resolvers/Mutation');
const { db } = require('./db');

const resolvers = {
  Query,
  Mutation
};

// Create an Apollo Server instance
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true // Allow introspection for Apollo Studio
});

async function startServer() {
  // Initialize Express app
  const app = express();

  // Apply CORS middleware
  app.use(
    cors({
      origin: ['https://studio.apollographql.com'], // Allow Apollo Studio origin
      methods: ['GET', 'POST', 'OPTIONS'], // Allow required methods
      credentials: true // Allow cookies and credentials
    })
  );

  // Parse incoming JSON requests
  app.use(json());

  // Handle preflight requests (OPTIONS)
  app.options('*', cors());

  // Start Apollo Server
  await server.start();

  // Apply Apollo middleware
  app.use(
    '/graphql',
    expressMiddleware(server, {
      context: async () => ({ db })
    })
  );

  // Create HTTP server
  const httpServer = http.createServer(app);
  const PORT = process.env.PORT || 8080;

  // Start the server
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server is running at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => console.error(err));
