"use client";

import { Formik, Form, Field } from "formik";
import { object, string, number } from "yup";

interface FormValues {
  tax_year: number;
  wallet_id: string;
  csv: File | null;
  output_name: string;
}

const WALLET_ADDRESSES = {
  MAIN: { name: "Main", id: "0.0.1452054" },
  SECONDARY: { name: "Secondary", id: "0.0.1874847" },
  TATA_STAKING: { name: "Tata Staking", id: "0.0.1874888" },
  EDF_STAKING: { name: "EDF Staking", id: "0.0.1977756" },
};

const TAX_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

const formSchema = object({
  tax_year: number().required("Tax year is required"),
  wallet_id: string().required("Wallet ID is required"),
  csv: object().required("CSV is required"),
  output_name: string().required("Output name is required"),
});

export default function Home() {
  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("wallet_id", values.wallet_id);
    if (values.csv) {
      formData.append("csv", values.csv.files[0]);
    }
    formData.append("output_name", values.output_name);

    const response = await fetch("/api/csv/hedera", {
      method: "POST",
      body: formData,
    });

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${values.output_name}.csv`;
    a.click();
  };

  function getOutputName(walletId: string, taxYear: number): string {
    const walletName =
      Object.values(WALLET_ADDRESSES).find((wallet) => wallet.id === walletId)
        ?.name || "";
    return `hedera_${walletName
      .replace(" ", "-")
      .toLowerCase()}_${walletId}_${taxYear}`;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="max-w-sm w-full">
        <div className="mb-6">
          <h1>Hedera CSV Generator</h1>
          <p>Convert a Hedera CSV into a valid Koinly CSV.</p>
        </div>

        <Formik
          initialValues={{
            wallet_id: "",
            tax_year: 2025,
            csv: null,
            output_name: "",
          }}
          onSubmit={handleSubmit}
          validationSchema={formSchema}
        >
          {({ errors, touched, values, setFieldValue }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="wallet_id">Wallet ID</label>
                <select
                  id="wallet_id"
                  name="wallet_id"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const walletId = e.target.value;
                    setFieldValue(
                      "output_name",
                      getOutputName(walletId, values.tax_year)
                    );
                    setFieldValue("wallet_id", e.target.value);
                  }}
                >
                  <option value="">Select a wallet</option>
                  {Object.entries(WALLET_ADDRESSES).map(([key, value]) => (
                    <option key={key} value={value.id}>
                      {value.name} - {value.id}
                    </option>
                  ))}
                </select>
                <div className="error">
                  {errors.wallet_id && touched.wallet_id ? (
                    <div>{errors.wallet_id}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="csv">Upload CSV</label>
                <input
                  id="csv"
                  name="csv"
                  type="file"
                  accept=".csv"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setFieldValue("csv", { files: [file] });
                    }
                  }}
                />
                <div className="error">
                  {errors.csv && touched.csv ? <div>{errors.csv}</div> : null}
                </div>
              </div>

              <div>
                <label htmlFor="tax_year">Tax Year</label>
                <select
                  id="tax_year"
                  name="tax_year"
                  value={values.tax_year}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const taxYear = e.target.value;
                    setFieldValue(
                      "output_name",
                      getOutputName(values.wallet_id, parseInt(taxYear))
                    );
                    setFieldValue("tax_year", taxYear);
                  }}
                >
                  <option value="">Select a tax year</option>
                  {TAX_YEARS.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <div className="error">
                  {errors.tax_year && touched.tax_year ? (
                    <div>{errors.tax_year}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="output_name">Output name</label>
                <Field
                  id="output_name"
                  type="text"
                  name="output_name"
                  as="input"
                />
                <div className="error">
                  {errors.output_name && touched.output_name ? (
                    <div>{errors.output_name}</div>
                  ) : null}
                </div>
              </div>

              <div className="flex justify-end">
                <button type="submit">Generate CSV</button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
