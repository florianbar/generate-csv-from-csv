import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { HederaRecord } from "@/types/hedera";
import { KoinlyRecord } from "@/types/koinly";

export async function POST(request: NextRequest) {
  try {
    // Get the CSV data from the request body
    const formData = await request.formData();
    const walletId = formData.get("wallet_id") as string;
    const outputName = formData.get("output_name") as string;
    const csvFile = formData.get("csv") as File;

    console.log("Received walletId:", walletId);
    console.log("Received outputName:", outputName);
    console.log("Received csvFile:", csvFile);

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

    // Transform the data according to the specified structure
    const transformedData = records.map((record: HederaRecord) => {
      return {
        "Koinly Date": record["#date"],
        Amount: record["#amount"],
        Currency: "HBAR",
        Label: "",
        TxHash: record["#transaction_id"],
      } as KoinlyRecord;
    });

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

// Also support GET request to show usage instructions
export async function GET() {
  return NextResponse.json({
    message: "CSV Transformation API",
    usage: {
      method: "POST",
      endpoint: "/api/csv",
      body: 'FormData with "csv" field containing the CSV file',
      input: "CSV with columns: #from_account_id, #amount",
      output: "CSV with columns: account_id, amount",
    },
  });
}
