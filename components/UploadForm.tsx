"use client";

import { useState } from "react";
import Preview from "./Preview";

type Props = {
  onResult: (imageUrl: string) => void; // send result to parent
};

export default function UploadForm({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [bgColor, setBgColor] = useState("white");
  const [photoCount, setPhotoCount] = useState(4);
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setResult(null);
    }
  };

  const handleSubmit = async () => {
    if (!file) return alert("Please select an image");

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("bgColor", bgColor);
      formData.append("photoCount", photoCount.toString());

      const res = await fetch("/api/process", {
        method: "POST",
        body: formData,
      });

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      setResult(imageUrl);
      onResult(imageUrl); // send to parent if needed
    } catch (error) {
      console.error(error);
      alert("Processing failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      {/* Upload */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
        className="border p-2 w-full"
      />

      {/* Background selection */}
      <div className="flex gap-4">
        <button
          onClick={() => setBgColor("white")}
          className={`px-4 py-2 border ${
            bgColor === "white" ? "bg-gray-200" : ""
          }`}
        >
          White
        </button>
        <button
          onClick={() => setBgColor("blue")}
          className={`px-4 py-2 border ${
            bgColor === "blue" ? "bg-blue-200" : ""
          }`}
        >
          Blue
        </button>
      </div>

      {/* Photo count */}
      <div className="flex flex-col items-center gap-2 w-full">
        <label className="font-medium">Number of Photos</label>
        <select
          value={photoCount}
          onChange={(e) => setPhotoCount(Number(e.target.value))}
          className="border px-4 py-2 w-full"
        >
          <option value={1}>1 Photo</option>
          <option value={2}>2 Photos</option>
          <option value={4}>4 Photos</option>
          <option value={6}>6 Photos</option>
          <option value={8}>8 Photos</option>
        </select>
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded w-full"
      >
        {loading ? "Processing..." : "Generate Photo"}
      </button>

      {/* Preview */}
      <Preview
        originalImage={preview}
        processedImage={result}
        loading={loading}
      />
    </div>
  );
}