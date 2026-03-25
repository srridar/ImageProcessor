"use client";

type Props = {
  originalImage?: string | null;
  processedImage?: string | null;
  loading?: boolean;
};

export default function Preview({
  originalImage,
  processedImage,
  loading = false,
}: Props) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <h2 className="text-xl font-semibold">Preview</h2>

      {/* Loading */}
      {loading && (
        <div className="text-gray-500 animate-pulse">
          Processing image...
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-6">
        {/* Original Image */}
        {originalImage && (
          <div className="flex flex-col items-center">
            <p className="mb-2 font-medium">Original</p>
            <img
              src={originalImage}
              alt="Original"
              className="w-48 h-48 object-cover border rounded"
            />
          </div>
        )}

        {/* Processed Image */}
        {processedImage && !loading && (
          <div className="flex flex-col items-center">
            <p className="mb-2 font-medium">Processed</p>
            <img
              src={processedImage}
              alt="Processed"
              className="w-48 h-48 object-cover border rounded"
            />
          </div>
        )}
      </div>
    </div>
  );
}