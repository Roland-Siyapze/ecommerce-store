import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

const saleorApiUrl =
  process.env.REACT_APP_SALEOR_API_URL || 'http://localhost:8000/graphql/';

const client = new ApolloClient({
  link: new HttpLink({
    uri: saleorApiUrl,
    credentials: 'include', // Include cookies if needed
  }),
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable Apollo DevTools for debugging
});

export default client;
