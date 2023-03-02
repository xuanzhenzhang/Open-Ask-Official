// const {
//   ApolloClient,
//   InMemoryCache,
//   gql,
//   HttpLink,
//   from,
// } = require("@apollo/client");
// const { onError } = require("@apollo/client/link/error");
// const { fetch } = require("node-fetch");

const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} = require("@apollo/client");

const LENS_API_URL = "https://api.lens.dev";

const apolloClient = new ApolloClient({
  link: createHttpLink({
    uri: LENS_API_URL,
    fetch: fetch,
  }),
  cache: new InMemoryCache(),
});

module.exports = { apolloClient };

// const apolloClient = new ApolloClient({
//   uri: LENS_API_URL,
//   cache: new InMemoryCache(),
// });

// const errorLink = onError(({ graphQLErrors, operation, forward }) => {
//   if (graphQLErrors) {
//     // Handle Errors
//   }
//   forward(operation);
// });

// const httpLink = new HttpLink({
//   uri: LENS_API_URL,
// });

// const apolloClient = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: from([errorLink, httpLink]),
// });

// module.exports = { apolloClient };

// const { createClient } = require("urql");

// const urqlClient = createClient({
//   url: LENS_API_URL,
// });

// module.exports = { apolloClient, urqlClient };
