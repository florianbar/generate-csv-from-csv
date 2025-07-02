"use client";

import { Formik, Form, Field } from "formik";
import { object, string } from "yup";

interface FormValues {
  wallet_id: string;
  csv: File | string;
  outputName: string;
}

const WALLET_ADDRESSES = {
  MAIN: { name: "Main", id: "0.0.1452054" },
  SECONDARY: { name: "Secondary", id: "0.0.1874847" },
  TATA_STAKING: { name: "Tata Staking", id: "0.0.1874888" },
  EDF_STAKING: { name: "EDF Staking", id: "0.0.1977756" },
};

const formSchema = object({
  wallet_id: string().required("Wallet ID is required"),
  csv: string().required("CSV is required"),
  outputName: string().required("Output name is required"),
});

export default function Home() {
  const handleSubmit = async (values: FormValues) => {
    const formData = new FormData();
    formData.append("wallet_id", values.wallet_id);
    if (values.csv) {
      formData.append("csv", values.csv);
    }
    formData.append("output-name", values.outputName);

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

        <Formik
          initialValues={{ wallet_id: "", csv: "", outputName: "" }}
          onSubmit={handleSubmit}
          validationSchema={formSchema}
        >
          {({ errors, touched }) => (
            <Form className="space-y-4">
              <div>
                <label htmlFor="wallet_id">Wallet ID</label>
                <Field as="select" name="wallet_id">
                  <option value="" disabled>
                    Select a wallet
                  </option>
                  {Object.entries(WALLET_ADDRESSES).map(([key, value]) => (
                    <option key={key} value={value.id}>
                      {value.name} - {value.id}
                    </option>
                  ))}
                </Field>
                <div className="error">
                  {errors.wallet_id && touched.wallet_id ? (
                    <div>{errors.wallet_id}</div>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="csv">Upload CSV</label>
                <Field as="input" type="file" name="csv" />
                <div className="error">
                  {errors.csv && touched.csv ? <div>{errors.csv}</div> : null}
                </div>
              </div>

              <div>
                <label htmlFor="output-name">Output name</label>
                <Field as="input" type="text" name="outputName" />
                <div className="error">
                  {errors.outputName && touched.outputName ? (
                    <div>{errors.outputName}</div>
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
