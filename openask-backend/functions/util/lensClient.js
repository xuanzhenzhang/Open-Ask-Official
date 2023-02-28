const { ApolloClient, InMemoryCache, gql } = require("@apollo/client");
const LENS_API_URL = "https://api-mumbai.lens.dev/";

const apolloClient = new ApolloClient({
  uri: LENS_API_URL,
  cache: new InMemoryCache(),
});

module.exports = { apolloClient };
