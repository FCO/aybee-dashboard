import { ApolloClient }     from 'apollo-client';
import { createHttpLink }   from 'apollo-link-http';
import { setContext }       from 'apollo-link-context';
import { InMemoryCache }    from 'apollo-cache-inmemory';

let conf;

try {
    conf = require('./vars.json');
} catch(e) {
    conf = {}
}

const uri = conf.graphqlurl || 'http://localhost:5000/graphql'
const httpLink = createHttpLink({ uri });

console.log({ uri })

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  let resp = {
    headers: {
      ...headers,
    }
  }
  if(token) resp.headers.authorization = `Bearer ${token}`
  return resp
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client
