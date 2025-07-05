export interface HederaRecord {
  "#date": string;
  "#from_account_id": string;
  "#to_account_id": string;
  "#amount": string;
  "#transaction_id": string;
  "#transaction_type": string;
}

export interface HederaWallet {
  name: string;
  id: string;
  staking?: boolean;
}
