"use client";

const WALLET_ADDRESSES = {
  MAIN: { name: "Main", id: "0.0.1452054" },
  SECONDARY: { name: "Secondary", id: "0.0.1874847" },
  TATA_STAKING: { name: "Tata Staking", id: "0.0.1874888" },
  EDF_STAKING: { name: "EDF Staking", id: "0.0.1977756" },
};

export default function Home() {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/api/csv", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transformed.csv";
    a.click();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-sm w-full">
        <div className="mb-6">
          <h1>Hedera CSV Generator</h1>
          <p>Convert a Hedera CSV into a valid Koinly CSV.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="wallet_id">Wallet ID</label>
          <select name="wallet_id">
            <option value="" disabled>
              Select a wallet
            </option>
            {Object.entries(WALLET_ADDRESSES).map(([key, value]) => (
              <option key={key} value={value.id}>
                {value.name} - {value.id}
              </option>
            ))}
          </select>

          <label htmlFor="csv">Upload CSV</label>
          <input type="file" name="csv" />

          <label htmlFor="output-name">Output name</label>
          <input type="text" name="output-name" />

          <div className="flex justify-end">
            <button type="submit">Generate CSV</button>
          </div>
        </form>
      </div>
    </div>
  );
}
