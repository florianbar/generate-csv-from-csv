export interface KoinlyRecord {
  "Koinly Date": string;
  Amount: string;
  Currency: string;
  Label: KoinlyRecordLabel;
  TxHash: string;
}

export type KoinlyRecordLabel = "" | "Reward";
