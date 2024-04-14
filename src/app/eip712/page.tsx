import Image from "next/image";
import View, { ContractConfig } from "./View";
export default function Home({
  searchParams,
}: {
  searchParams: {
    typeHashes: string;
    contractName: string | undefined;
    version: string | undefined;
    chainId: number | undefined;
    verifyingContract: string | undefined;
  };
}) {
  const defaultContractConfig = {
    contractName: searchParams.contractName || "ExampleContract",
    version: searchParams.version || "1",
    chainId: searchParams.chainId || 1,
    contractAddress:
      searchParams.verifyingContract ||
      "0x1234567890123456789012345678901234567890",
  };
  const typeHashesArray = searchParams.typeHashes
    ? searchParams.typeHashes.split("<>")
    : [];
  return (
    <View
      defaultContractConfig={defaultContractConfig}
      defaultTypeHashes={typeHashesArray}
    />
  );
}
