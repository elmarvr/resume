import type { AppProps } from "next/app";
import Head from "next/head";
import { Global as EmGlobal, css } from "@emotion/react";
import { GlobalStyles as TwGlobalStyles } from "twin.macro";

const EmGlobalStyles = () => (
  <EmGlobal
    styles={css`
      body {
        overflow-x: hidden;
        height: auto;
      }
    `}
  />
);

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, minimum-scale=1"
        />
      </Head>
      <TwGlobalStyles />
      <EmGlobalStyles />
      <Component {...pageProps} />
    </>
  );
};

export default App;
