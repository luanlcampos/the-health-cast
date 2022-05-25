import "../styles/globals.scss";
import { AuthProvider } from "../firebase/auth";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>The Health Cast</title>
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;
