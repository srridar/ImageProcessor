"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState("white");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async () => {
    if (!file) return alert("Please upload an image");

    setLoading(true);

    const formData = new FormData();
    formData.append("image", file);
    formData.append("bgColor", bgColor);

    const res = await fetch("/api/process", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    if (data.imageUrl) {
      router.push(`/result?image=${encodeURIComponent(data.imageUrl)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <h1 className="text-3xl font-bold">📷 Passport Photo Maker</h1>

      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="border p-2"
      />

      {/* Background Selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setBgColor("white")}
          className={`px-4 py-2 border ${
            bgColor === "white" ? "bg-black text-white" : ""
          }`}
        >
          White
        </button>

        <button
          onClick={() => setBgColor("blue")}
          className={`px-4 py-2 border ${
            bgColor === "blue" ? "bg-blue-600 text-white" : ""
          }`}
        >
          Blue
        </button>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-green-600 text-white rounded"
      >
        {loading ? "Processing..." : "Generate Photo"}
      </button>
    </div>
  );
}