"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CardTitle, CardHeader, CardContent, Card } from "@/components/ui/card";
import { SVGProps, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PiTrashThin } from "react-icons/pi";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyBlock, dracula } from "react-code-blocks";
import { isAddress } from "ethers/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { formatGwei } from "viem";
import { PiMagnifyingGlass } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type GasStat } from "./page";
export default function Component({ gasStats }: { gasStats: GasStat[] }) {
  const [filterInput, setFilterInput] = useState("");
  const [showTestnets, setShowTestnets] = useState(false);
  const filteredGasStats = useMemo(() => {
    return gasStats.filter((gasStat) => {
      if (!showTestnets && gasStat.testnet) {
        return false;
      }
      return gasStat.label.toLowerCase().includes(filterInput.toLowerCase());
    });
  }, [filterInput, gasStats, showTestnets]);
  return (
    <div className="flex flex-1 flex-col h-screen overflow-y-scroll">
      <div className="mx-auto prose prose-lg max-w-5xl py-8 lg:py-12  w-full flex flex-col gap-y-4">
        <h1 className="text-3xl font-bold">Gas Prices</h1>

        <div className="flex flex-row items-center gap-4">
          <Input
            value={filterInput}
            onChange={(e) => setFilterInput(e.target.value)}
            placeholder="Filter by chain"
            className="flex-1"
          />
          <Button
            onClick={() => {
              toast("Searching for " + filterInput);
            }}
          >
            <PiMagnifyingGlass />
          </Button>
        </div>

        <div className="flex flex-row items-center gap-4">
          <Label>Show Testnets</Label>
          <input
            type="checkbox"
            checked={showTestnets}
            onChange={() => setShowTestnets(!showTestnets)}
          />
        </div>

        <div className="grid md:grid-cols-2 items-center justify-around w-full b gap-4">
          {filteredGasStats.map((gasStat, index) => (
            <div className="border p-4 rounded-lg">
              <div className="flex flex-row items-center gap-4">
                <img
                  src={gasStat.src}
                  className="w-8 h-8 rounded-full bg-black"
                />
                <h2 className="text-xl">{gasStat.label}</h2>
              </div>
              <div className="flex flex-row items-center gap-4 mt-2">
                <Badge>Chain ID: {gasStat.chain}</Badge>
                <Badge>
                  Gas Price:{" "}
                  {Number(formatGwei(BigInt(gasStat.maxFeePerGas))).toFixed(2)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
