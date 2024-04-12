import {
  BigNumber,
  Wallet,
  Signer,
  TypedDataDomain,
  TypedDataField,
} from "ethers";

import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { randomBytes } from "ethers/lib/utils";

export type UpdateAgreement712Schema = {
  previousAgreementAddress: `0x${string}`;
  offeror: `0x${string}`;
  promisor: `0x${string}`;
  implementation: `0x${string}`;
  salt: BigNumber;
  controller: `0x${string}`;
  metadata: string;
  dataHash: `0x${string}`;
};

export type Agreement712Schema = {
  offeror: `0x${string}`;
  promisor: `0x${string}`;
  implementation: `0x${string}`;
  salt: BigNumber;
  controller: `0x${string}`;
  metadata: string;
  dataHash: `0x${string}`;
};

const types = {
  UpdateAgreement: [
    {
      name: "previousAgreementAddress",
      type: "address",
    },
    {
      name: "offeror",
      type: "address",
    },
    {
      name: "promisor",
      type: "address",
    },
    {
      name: "implementation",
      type: "address",
    },
    {
      name: "salt",
      type: "uint256",
    },
    {
      name: "controller",
      type: "address",
    },
    {
      name: "metadata",
      type: "string",
    },
    {
      name: "dataHash",
      type: "bytes32",
    },
  ],
  Agreement: [
    {
      name: "offeror",
      type: "address",
    },
    {
      name: "promisor",
      type: "address",
    },
    {
      name: "implementation",
      type: "address",
    },
    {
      name: "salt",
      type: "uint256",
    },
    {
      name: "controller",
      type: "address",
    },
    {
      name: "metadata",
      type: "string",
    },
    {
      name: "dataHash",
      type: "bytes32",
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

  async signUpdateAgreement({
    walletOrSigner,
    UpdateAgreement,
  }: {
    walletOrSigner: Wallet | Signer | TypedDataSigner;
    UpdateAgreement: UpdateAgreement712Schema;
  }): Promise<string> {
    const signer = walletOrSigner as unknown as TypedDataSigner;
    const signature = await signer._signTypedData(
      this.domain,
      this.types,
      UpdateAgreement
    );
    return signature;
  }

  async signAgreement({
    walletOrSigner,
    Agreement,
  }: {
    walletOrSigner: Wallet | Signer | TypedDataSigner;
    Agreement: Agreement712Schema;
  }): Promise<string> {
    const signer = walletOrSigner as unknown as TypedDataSigner;
    const signature = await signer._signTypedData(
      this.domain,
      this.types,
      Agreement
    );
    return signature;
  }
}
