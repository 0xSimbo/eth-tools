import {
  BigNumber,
  Wallet,
  Signer,
  TypedDataDomain,
  TypedDataField,
} from "ethers";

import { _TypedDataEncoder, verifyTypedData } from "ethers/lib/utils";

import { TypedDataSigner } from "@ethersproject/abstract-signer";

export type Bid712Schema = {
  bidder: `0x${string}`;
  salt: BigNumber;
  paymentToken: `0x${string}`;
  bidAmount: BigNumber;
  collection: `0x${string}`;
  tokenId: BigNumber;
  expiration: BigNumber;
};

const types = {
  Bid: [
    {
      name: "bidder",
      type: "address",
    },
    {
      name: "salt",
      type: "uint256",
    },
    {
      name: "paymentToken",
      type: "address",
    },
    {
      name: "bidAmount",
      type: "uint256",
    },
    {
      name: "collection",
      type: "address",
    },
    {
      name: "tokenId",
      type: "uint256",
    },
    {
      name: "expiration",
      type: "uint256",
    },
  ],
};

const domain = {
  name: "ExampleContract",
  version: "1",
  chainId: 1,
  verifyingContract: "0x1234567890123456789012345678901234567890",
};

export class EIP712 {
  public domain: TypedDataDomain;
  public types: Record<string, TypedDataField[]>;
  constructor() {
    this.domain = domain;
    this.types = types;
  }

  async signBid({
    walletOrSigner,
    Bid,
  }: {
    walletOrSigner: Wallet | Signer | TypedDataSigner;
    Bid: Bid712Schema;
  }): Promise<string> {
    const signer = walletOrSigner as unknown as TypedDataSigner;
    const signature = await signer._signTypedData(this.domain, this.types, Bid);
    return signature;
  }

  deriveBidHash(Bid: Bid712Schema): string {
    return _TypedDataEncoder.hash(this.domain, this.types, Bid);
  }

  async verifyBid({
    Bid,
    signature,
    addressToCheck,
  }: {
    Bid: Bid712Schema;
    signature: string;
    addressToCheck: `0x${string}`;
  }): Promise<{ signer: `0x${string}`; isValid: boolean }> {
    const address = await verifyTypedData(
      this.domain,
      this.types,
      Bid,
      signature
    );
    return {
      signer: address as `0x${string}`,
      isValid: address === addressToCheck,
    };
  }
}
