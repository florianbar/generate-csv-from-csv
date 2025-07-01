"use client";

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
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" name="csv" />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
