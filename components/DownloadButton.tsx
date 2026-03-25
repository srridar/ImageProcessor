"use client";

type Props = {
  imageUrl: string;
  fileName?: string;
};

export default function DownloadButton({imageUrl,fileName = "passport-photo.jpg"}: Props) {
  const handleDownload = async () => {
    try {
      const res = await fetch(imageUrl);
      const blob = await res.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download image");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded transition"
    >
      Download Photo 📥
    </button>
  );
}
