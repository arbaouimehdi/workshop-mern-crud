import App, { Container } from "next/app";
import React from "react";
import Link from "next/link";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";

class MyApp extends App {
  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ApolloProvider client={apolloClient}>
        <div>
          <Link href="/">
            <a>Home Page</a>
          </Link>
          &nbsp;|&nbsp;
          <Link href="/posts">
            <a>Posts List</a>
          </Link>
          &nbsp;|&nbsp;
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </div>
        <Component {...pageProps} />
      </ApolloProvider>
    );
  }
}

export default withApolloClient(MyApp);
