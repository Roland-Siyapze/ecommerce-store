import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const saleorApiUrl =
  process.env.REACT_APP_SALEOR_API_URL || 'http://localhost:8000/graphql/';

const httpLink = new HttpLink({
  uri: saleorApiUrl,
  credentials: 'include', // Include cookies if needed
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('auth_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : '', // Saleor expects JWT prefix or Bearer depending on version, wait Saleor 3+ expects Bearer
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  connectToDevTools: true, // Enable Apollo DevTools for debugging
});

export default client;
