import { algoliasearch } from 'algoliasearch';

const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID || 'AH8QFD8X1H', // Application ID
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY || process.env.ALGOLIA_API_KEY || '', // Search API Key
);

export default searchClient;
