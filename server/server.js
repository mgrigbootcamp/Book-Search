const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const path = require('path');
const { serverContext } = require('./utils/auth')

// API Routes
const routes = require('./routes')

const { typeDefs, resolvers } = require('./schema');
const db = require('./config/connection');

async function startApolloServe(typeDefs, resolvers) {

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => {
      return serverContext(req)
    }
  });

  await server.start()
 
  const PORT = process.env.PORT || 3001;
  const app = express();

  // app.use(express.urlencoded({ extended: false }));
  // app.use(express.json());
  app.use(express.static(path.join(__dirname, '../client/build')));

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
  }

  // app.use(routes)

  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../client/build/index.html'));
  // });

  server.applyMiddleware({ 
    app,
  });

  await new Promise((resolve) => {
    return app.listen(PORT, resolve)
  });
  console.log(`API server running on port ${PORT}!`);
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);

  // db.once('open', async () => {
  //   await new Promise((resolve) => {
  //     return app.listen(PORT, resolve)
  //   });
  //   console.log(`API server running on port ${PORT}!`);
  //   console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
  // });

}

startApolloServe(typeDefs, resolvers)
