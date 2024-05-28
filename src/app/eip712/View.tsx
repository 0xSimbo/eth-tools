"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiTrashThin } from "react-icons/pi";
import { Label } from "@/components/ui/label";
import { CopyBlock, dracula } from "react-code-blocks";
import { isAddress } from "ethers/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const getEthersTypestringFromSolidityType = (type: string): string => {
  //if it starts with uint
  if (type === "uint") return "BigNumber";
  if (type.startsWith("uint")) {
    const bits = type.slice(4);
    const bitsAsNum = parseInt(bits);
    if (bitsAsNum > 128) return "BigNumber";
    return "number";
  }
  if (type === "address") return "`0x${string}`";
  if (type === "uint256") return "BigNumber";
  if (type === "uint8") return "number";
  if (type === "bytes32") return "`0x${string}`";
  if (type === "bool") return "boolean";
  if (type === "string") return "string";
  if (type === "bytes") return "`0x${string}`";
  return "any";
};
const codeSelections = ["ethersV5", "viem"] as const;
type CodeSelection = (typeof codeSelections)[number];
const ZeroXString = "`0x${string}`";

export type ContractConfig = {
  contractName: string;
  version: string;
  chainId: number;
  contractAddress: string;
};
export default function Component({
  defaultTypeHashes,
  defaultContractConfig,
}: {
  defaultTypeHashes: string[] | undefined;
  defaultContractConfig: ContractConfig;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const updateSearchParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, value);
    replace(`${pathname}?${params.toString()}`);
  };
  const [typeHashes, setTypeHashes] = useState<string[]>(
    defaultTypeHashes || []
  );
  const [code, setCode] = useState<string[]>([]);
  const [contractConfig, setContractConfig] = useState<ContractConfig>(
    defaultContractConfig
  );

  const [codegenType, setCodegenType] = useState<CodeSelection>("ethersV5");

  const setContractConfigNameFromEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractConfig((prev) => {
      return { ...prev, contractName: e.target.value };
    });
    updateSearchParams("verifyingContract", e.target.value);
  };
  const setContractConfigVersionFromEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractConfig((prev) => {
      return { ...prev, version: e.target.value };
    });
    updateSearchParams("version", e.target.value);
  };
  const setContractConfigChainIdFromEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setContractConfig((prev) => {
      return { ...prev, chainId: parseInt(e.target.value) };
    });
    updateSearchParams("chainId", e.target.value);
  };
  const setContractConfigContractAddressFromEvent = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    //if length is not 42, throw error and sonner
    if (e.target.value.length !== 42) {
      toast.error("Invalid address");
    }
    setContractConfig((prev) => {
      return { ...prev, contractAddress: e.target.value };
    });
    updateSearchParams("contractAddress", e.target.value);
  };

  useEffect(() => {
    const typeHashesString = typeHashes.join("<>");
    updateSearchParams("typeHashes", typeHashesString);
  }, [typeHashes]);

  const getCodeFromTypehashes = () => {
    //If the last one is empty, remove it
    if (typeHashes[typeHashes.length - 1] === "") {
      setTypeHashes((prev) => {
        const newHashes = [...prev];
        newHashes.pop();
        return newHashes;
      });
    }
    //If the contractConfig.contractAddress is not 42, throw error
    if (!isAddress(contractConfig.contractAddress)) {
      toast.error("Invalid contract address");
      return;
    }
    let typescriptTypes: string[] = [];
    let eip712ClassMiddleCodes: string[] = [];

    const keyMap: Map<string, boolean> = new Map(); //TODO: maybe handle more complex cases where same key but different types
    const eip712Types: {
      [key: string]: Array<{ name: string; type: string }>;
    } = {};
    for (const type of typeHashes) {
      const parts = type.split("(");
      const key = parts[0];
      if (keyMap.has(key)) {
        toast.error("Duplicate key `" + key + "`");
        return;
      } else {
        keyMap.set(key, true);
      }
      const typeName = key + "712Schema";
      let typStr = `export type ${typeName} = { \n`;

      const insideElements = parts[1].split(",");
      eip712Types[key] = insideElements.map((element) => {
        const [type, _name] = element.split(" ");
        //if it ends with ) and its the last element, remove the )
        const name = _name.endsWith(")") ? _name.slice(0, -1) : _name;

        typStr += `${name}: ${getEthersTypestringFromSolidityType(type)};\n`;
        return { name, type };
      });
      typStr += "}\n\n";
      const functionStr = `async sign${key}({
        walletOrSigner,
        ${key}}:{
            walletOrSigner: Wallet | Signer | TypedDataSigner;
            ${key}: ${typeName};
        }): Promise<string> {
            const signer = walletOrSigner as unknown as TypedDataSigner;
            const signature = await signer._signTypedData(this.domain,this.types,${key});
            return signature;
        }
        \n
         derive${key}Hash(${key}: ${typeName}): string {
          return _TypedDataEncoder.hash(this.domain, this.types, ${key});
        }
        \n

        async verify${key}({
          ${key},
          signature,
          addressToCheck,
        }: {
          ${key}: ${typeName};
          signature: string;
          addressToCheck: ${ZeroXString};
        }): Promise<{ signer: ${ZeroXString}; isValid: boolean }
        > {
          const address = await verifyTypedData(
            this.domain,
            this.types,
            ${key},
            signature
          );
          return {
            signer: address as ${ZeroXString},
            isValid: address === addressToCheck,
          };
        }
        
        `;
      eip712ClassMiddleCodes.push(functionStr);

      typescriptTypes.push(typStr);
    }

    let importCode = `import {
        BigNumber,
        Wallet,
        Signer,
        TypedDataDomain,
        TypedDataField,
      } from "ethers"; \n
      import { _TypedDataEncoder, verifyTypedData } from "ethers/lib/utils";\n
import { TypedDataSigner } from "@ethersproject/abstract-signer";\n\n`;

    let classStartCode = `export class EIP712 {
        public domain: TypedDataDomain;
        public types: Record<string, TypedDataField[]>;
        constructor() {
          this.domain = domain;
          this.types = types;
        }\n\n`;

    //set the code as a string
    const codePart1 = `const types = ${JSON.stringify(eip712Types, null, 2)};`;
    const mockDomain = {
      name: contractConfig.contractName,
      version: contractConfig.version,
      chainId: contractConfig.chainId,
      verifyingContract: contractConfig.contractAddress,
    };
    const codePart2 = `const domain = ${JSON.stringify(mockDomain, null, 2)};\n\n`;
    const _typesCode = typescriptTypes.join("\n\n");
    const classCode =
      classStartCode + eip712ClassMiddleCodes.join("\n\n") + "\n}";
    const _code = [
      importCode,
      _typesCode,
      codePart1,
      "\n\n",
      codePart2,
      classCode,
    ];

    //const viem code =
    //     import { account, walletClient } from './config'
    // import { domain, types } from './data'

    // const signature = await walletClient.signTypedData({
    //   account,
    //   domain,
    //   types,
    //   primaryType: 'Mail',
    //   message: {
    //     from: {
    //       name: 'Cow',
    //       wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
    //     },
    //     to: {
    //       name: 'Bob',
    //       wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
    //     },
    //     contents: 'Hello, Bob!',
    //   },
    // })
    toast.success("Code generated");
    setCode(_code);
  };

  const processOrThrowTypehash = (type: string): boolean => {
    //make sure it starts with one word that then has a ( after
    // const regex = /^[a-zA-Z0-9_]+\(.*\)$/;
    // if (!regex.test(type)) {
    //   toast.error("Invalid type");
    //   return false;
    // }

    if (type == "") return true;
    if (type.startsWith(`"`)) {
      toast.error("Cannot start with a quote");
      return false;
    }

    //make sure it ends with a )
    const regex = /\(.*\)$/;
    if (!regex.test(type)) {
      toast.error("Must end in a parentheses");
      return false;
    }

    //split it on the (
    const parts = type.split("(");
    //make sure there are no whitespaces in parts[0]
    if (parts[0].includes(" ")) {
      toast.error("First word cannot contain spaces");
      return false;
    }

    //Make sure after each , there is no space
    const secondPart = parts[1];
    if (secondPart.includes(", ")) {
      toast.error("No spaces after commas");
      return false;
    }

    //Make sure there is a max of 1 whitespace per between all second parts
    if (secondPart.includes("  ")) {
      toast.error("No double spaces in between elements");
      return false;
    }

    //Make sure there is exactly one whitespace in all the splits of teh commas in the second parts
    const insideElements = secondPart.split(",");
    for (const element of insideElements) {
      console.log(insideElements);
      //make sure there are exactly two words in the element
      if (element.split(" ").length !== 2) {
        toast.error(`Invalid element ${element}`);
        return false;
      }
    }

    toast.success("Valid type");
    return true;
  };
  function handleFirstTypeChange(
    e: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) {
    const type = e.target.value;
    const works = processOrThrowTypehash(type);
    //set the 0
    setTypeHashes((prev) => {
      const newHashes = [...prev];
      newHashes[index || 0] = type;
      return newHashes;
    });
  }

  const addEmptyType = () => {
    //if the most recent element is empty, don't add another one
    if (typeHashes[typeHashes.length - 1] === "") {
      toast.error("Fill out the previous type first");
      return;
    }
    setTypeHashes((prev) => {
      return [...prev, ""];
    });
  };

  const removeIndex = (index: number) => {
    setTypeHashes((prev) => {
      const newHashes = [...prev];
      newHashes.splice(index, 1);
      return newHashes;
    });
  };

  return (
    <div className="flex flex-1 flex-col h-screen overflow-y-scroll">
      <div className="mx-auto prose prose-lg max-w-5xl py-8 lg:py-12 flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">EIP-712 Code Generator</h1>
        <p>
          The Ethereum Improvement Proposal 712, or EIP-712, defines a standard
          way to hash and sign structured data. It provides a flexible and
          secure method for signing messages, which is particularly useful for
          applications such as decentralized finance (DeFi), non-fungible tokens
          (NFTs), and identity verification.
        </p>
        <h2 className="text-xl mt-4">Check and generate your EIP712 Types</h2>
        <Input
          type="text"
          placeholder="Enter type"
          value={typeHashes[0]}
          onChange={handleFirstTypeChange}
        />

        {typeHashes.slice(1).map((type, index) => {
          return (
            <div className="flex gap-2 items-center">
              <Input
                key={index + 1}
                type="text"
                placeholder="Enter type"
                value={type}
                onChange={(e) => handleFirstTypeChange(e, index + 1)}
              />
              <PiTrashThin
                className="h-6 w-6 text-slate-700 hover:text-slate-900 duration-75 cursor-pointer"
                onClick={() => removeIndex(index + 1)}
              />
            </div>
          );
        })}
        <Button onClick={addEmptyType}>Add Type</Button>
        <p>
          EIP-712 uses a domain separator to define the signing domain for a
          message. This domain includes the contract name, version, and chain
          ID, ensuring that the message is specific to the intended domain.
        </p>
        <Label>Contract Name</Label>
        <Input
          value={contractConfig.contractName}
          onChange={setContractConfigNameFromEvent}
        />
        <Label>Version</Label>
        <Input
          value={contractConfig.version}
          onChange={setContractConfigVersionFromEvent}
        />
        <Label>Chain ID</Label>
        <Input
          value={contractConfig.chainId.toString()}
          onChange={setContractConfigChainIdFromEvent}
        />
        <Label>Contract Address</Label>
        <Input
          value={contractConfig.contractAddress}
          onChange={setContractConfigContractAddressFromEvent}
        />

        <Label>Framework</Label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ethers v5" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Framework</SelectLabel>
              <SelectItem value="ethersV5">Ethers v5</SelectItem>
              <SelectItem disabled value="viem">
                Viem (Coming Soon)
              </SelectItem>
              {/* <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem> */}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button onClick={getCodeFromTypehashes}>Generate Code</Button>

        {code.length > 0 && (
          // <div className="bg-black text-white p-4 flex flex-col gap-y-4 rounded-lg text-xs">
          //   <pre>
          //     {code.map((c) => {
          //       return c;
          //     })}
          //   </pre>
          // </div>

          <div className=" p-4 flex flex-col gap-y-4 rounded-lg text-xs">
            <CopyBlock
              text={code.join("\n")}
              language="typescript"
              showLineNumbers={false}
              wrapLongLines={true}
              theme={dracula}
            />
          </div>
        )}
      </div>
    </div>
  );
}
