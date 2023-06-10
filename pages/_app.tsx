import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { polygonMumbai } from "viem/chains";
import { WagmiConfig, createConfig, configureChains } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/franfran20/memyselffandai",
  cache: new InMemoryCache(),
});

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [polygonMumbai],
  [
    //@ts-ignore
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
    publicProvider(),
  ]
);

const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={config}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </WagmiConfig>
  );
}
