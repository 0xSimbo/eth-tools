import React from "react";
import View from "./View";
import { createPublicClient, http, PublicClient } from "viem";

enum Chain {
  mainnet = 0x1,
  base = 8453,
  blast = 81457,
  polygon = 137,
  arbitrum = 42161,
  optimism = 10,
  avalanche = 43114,
  binance = 56,
  //testnets
  sepolia = 11155111,
  blast_sepolia = 168587773,
}
export type GasStat = {
  label: string;
  src: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  chain: Chain;
  testnet?: boolean;
};

type Mini = {
  chain: Chain;
  src: string;
  label: string;
  client: PublicClient;
  testnet?: boolean;
};

const minis: Mini[] = [
  {
    chain: Chain.mainnet,
    src: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    label: "Eth Mainnet",
    client: createPublicClient({
      transport: http("https://eth.llamarpc.com"),
    }),
  },
  {
    chain: Chain.base,
    src: "https://icons.llamao.fi/icons/chains/rsz_base.jpg",
    label: "Base Mainnet",
    client: createPublicClient({
      transport: http("https://base.llamarpc.com"),
    }),
  },
  {
    chain: Chain.blast,
    src: "https://mintlify.s3-us-west-1.amazonaws.com/metalayerlabs/logo/dark.svg",
    label: "Blast Mainnet",
    client: createPublicClient({
      transport: http("https://rpc.blast.io"),
    }),
  },
  {
    chain: Chain.polygon,
    src: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg",
    label: "Polygon Mainnet",
    client: createPublicClient({
      transport: http("https://polygon.llamarpc.com"),
    }),
  },
  {
    chain: Chain.blast,
    src: "https://cryptologos.cc/logos/arbitrum-arb-logo.png?v=031",
    label: "Arbitrum One",
    client: createPublicClient({
      transport: http("https://arbitrum.llamarpc.com"),
    }),
  },
  {
    chain: Chain.optimism,
    src: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg",
    label: "Optimism Mainnet",
    client: createPublicClient({
      transport: http("https://optimism.llamarpc.com"),
    }),
  },
  {
    chain: Chain.avalanche,
    src: "https://icons.llamao.fi/icons/chains/rsz_optimism.jpg",
    label: "Avalanche C-Chain",
    client: createPublicClient({
      transport: http("https://avalanche.drpc.org	"),
    }),
  },
  {
    chain: Chain.binance,
    src: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg",
    label: "Binance Mainnet",
    client: createPublicClient({
      transport: http("https://binance.llamarpc.com"),
    }),
  },
  //Test networks
  {
    chain: Chain.sepolia,
    src: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg",
    label: "Eth Sepolia",
    client: createPublicClient({
      transport: http("https://rpc2.sepolia.org"),
    }),
    testnet: true,
  },
  {
    chain: Chain.blast_sepolia,
    src: "https://mintlify.s3-us-west-1.amazonaws.com/metalayerlabs/logo/dark.svg",
    label: "Blast Sepolia",
    client: createPublicClient({
      transport: http("https://sepolia.blast.io"),
    }),
    testnet: true,
  },
];

export const revalidate = 60;

const GasPrices = async () => {
  let gasStats: GasStat[] = [];
  for (const mini of minis) {
    const { client } = mini;
    const { maxFeePerGas, maxPriorityFeePerGas } =
      await client.estimateFeesPerGas();
    gasStats.push({
      label: mini.label,
      maxFeePerGas: maxFeePerGas?.toString() || "0",
      maxPriorityFeePerGas: maxPriorityFeePerGas?.toString() || "0",
      chain: mini.chain,
      src: mini.src,
      testnet: mini.testnet,
    });
  }

  return <View gasStats={gasStats} />;
};

export default GasPrices;
