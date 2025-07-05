import { HederaWallet } from "@/types/hedera";

export const WALLETS: Record<string, HederaWallet> = {
  "0.0.1452054": { name: "Main", id: "0.0.1452054" },
  "0.0.1874847": { name: "Secondary", id: "0.0.1874847" },
  "0.0.1874888": { name: "Tata Staking", id: "0.0.1874888", staking: true },
  "0.0.1977756": { name: "EDF Staking", id: "0.0.1977756", staking: true },
};

export const STAKING_REWARD_ACCOUNT = "0.0.800";
