import {
  createHttpLink,
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
} from "@apollo/client";
import "bootstrap/dist/css/bootstrap.min.css";
import { createBrowserHistory } from "history";
import ReactDOM from "react-dom";
import { Router } from "react-router";
import App from "./App";
import { PaginatedPosts } from "./generated/graphql";
import "./index.css";

const history = createBrowserHistory();

const url = "http://localhost:4001/graphql";

const httpLink = createHttpLink({
  uri: url,
  credentials: "include",
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          posts: {
            keyArgs: [],
            merge(
              existing: PaginatedPosts | undefined,
              incoming: PaginatedPosts
            ): PaginatedPosts {
              return {
                ...incoming,
                posts: [...(existing?.posts || []), ...incoming.posts],
              };
            },
          },
        },
      },
    },
  }),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <Router history={history}>
      <App />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
