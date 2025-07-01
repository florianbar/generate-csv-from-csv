import { NextRequest, NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

export async function POST(request: NextRequest) {
  try {
    // Get the CSV data from the request body
    const formData = await request.formData();
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

    // Transform the data according to the specified structure
    const transformedData = records.map((record: any) => ({
      account_id: record["#from_account_id"],
      amount: parseFloat(record["#amount"]) || 0,
    }));

    // Convert back to CSV
    const outputCsv = stringify(transformedData, {
      header: true,
      columns: ["account_id", "amount"],
    });

    // Return the transformed CSV
    return new NextResponse(outputCsv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="transformed.csv"',
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
