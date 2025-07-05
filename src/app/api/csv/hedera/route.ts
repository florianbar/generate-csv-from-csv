import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { HederaRecord } from "@/types/hedera";
import { KoinlyRecord } from "@/types/koinly";
import { convertDateFormat } from "@/utils/hedera";
import { STAKING_REWARD_ACCOUNT, WALLETS } from "@/constants/hedera";
import {
  convertFormattedStringToNumber,
  convertNumberToFormattedString,
} from "@/utils/numbers";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const walletId = formData.get("wallet_id") as string;
    const outputName = formData.get("output_name") as string;
    const csvFile = formData.get("csv") as File;

    if (!csvFile) {
      return NextResponse.json(
        { error: "No CSV file provided" },
        { status: 400 }
      );
    }

    // Read the CSV file content
    const csvContent = await csvFile.text();

    // Parse the CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    // Group records by transaction ID
    const groupedRecords = records.reduce(
      (acc: Record<string, HederaRecord[]>, record: HederaRecord) => {
        const txId = record["#transaction_id"];
        if (!acc[txId]) {
          acc[txId] = [];
        }
        acc[txId].push(record);
        return acc;
      },
      {} as Record<string, HederaRecord[]>
    );

    // console.log("groupedRecords :::::", Object.values(groupedRecords)[0]);

    const transformedData: KoinlyRecord[] = [];

    const groupedRecordValues = Object.values(groupedRecords);
    for (let i = 0; i < groupedRecordValues.length; i++) {
      const recordGroup = groupedRecordValues[i] as HederaRecord[];

      // console.log("Processing group :::::", recordGroup);

      for (let j = 0; j < recordGroup.length; j++) {
        const recordGroupItem = recordGroup[j];

        const Currency = "HBAR";
        const TxHash = recordGroupItem["#transaction_id"];

        // Deposits
        if (recordGroupItem["#to_account_id"] === walletId) {
          let rewardRecord: HederaRecord | undefined = undefined;

          // If the wallet is a staking wallet, find the reward record
          if (WALLETS[walletId]?.staking) {
            rewardRecord = recordGroup.find((record: HederaRecord) => {
              return record["#from_account_id"] === STAKING_REWARD_ACCOUNT;
            });
          }

          const rewardAmount: number = rewardRecord
            ? convertFormattedStringToNumber(rewardRecord["#amount"])
            : 0;
          const depositAmount: number = convertFormattedStringToNumber(
            recordGroupItem["#amount"]
          );

          // Record the deposit
          transformedData.push({
            "Koinly Date": convertDateFormat(recordGroupItem["#date"]),
            Amount: `+${convertNumberToFormattedString(
              depositAmount - rewardAmount
            )}`,
            Currency,
            Label: "",
            TxHash,
          });

          // Record the reward
          if (rewardAmount > 0) {
            transformedData.push({
              "Koinly Date": convertDateFormat(recordGroupItem["#date"]),
              Amount: `+${convertNumberToFormattedString(rewardAmount)}`,
              Currency,
              Label: "Reward",
              TxHash,
            });
          }
        }
      }
    }

    // Convert back to CSV
    const outputCsv = stringify(transformedData, {
      header: true,
      columns: ["Koinly Date", "Amount", "Currency", "Label", "TxHash"],
    });

    // Return the transformed CSV
    return new NextResponse(outputCsv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${outputName}.csv"`,
      },
    });
  } catch (error) {
    console.error("Error processing CSV:", error);
    return NextResponse.json(
      { error: "Failed to process CSV file" },
      { status: 500 }
    );
  }
}
