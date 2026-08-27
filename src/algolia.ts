import { algoliasearch } from "algoliasearch";

// @ts-ignore: algoliasearch v5 type issue with default export in current build setup
const searchClient = algoliasearch(
  process.env.REACT_APP_ALGOLIA_APP_ID as string,
  process.env.REACT_APP_ALGOLIA_SEARCH_KEY as string
);

export default searchClient;