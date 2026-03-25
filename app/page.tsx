"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Check, Loader2, Camera, Image as ImageIcon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [bgColor, setBgColor] = useState("white");
  const [photoCount, setPhotoCount] = useState(4);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;
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

      if (!res.ok) throw new Error("Processing failed");

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      sessionStorage.setItem("processedImage", imageUrl);
      router.push("/result");
    } catch (err) {
      console.error(err);
      alert("Error processing image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-slate-100 via-white to-blue-50 flex items-center justify-center p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,112,184,0.07)] border border-slate-100 overflow-hidden"
      >
     
        <div className="bg-slate-900 p-4 text-white relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="bg-blue-500 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI Photo Studio</h1>
              <p className="text-slate-400 text-sm">Professional Passport Grids in Seconds</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles size={120} />
          </div>
        </div>

        <div className="p-7 space-y-7">
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">Step 01: Upload Portrait</label>
            <div className="group relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div className={`border-2 border-dashed rounded-4xl p-8 transition-all duration-300 flex flex-col items-center justify-center gap-4 
                ${preview ? 'border-blue-400 bg-blue-50/20' : 'border-slate-200 group-hover:border-blue-300 bg-slate-50'}`}>

                {preview ? (
                  <div className="relative w-32 h-40 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-bold">Change</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-white rounded-2xl shadow-sm text-slate-400 group-hover:text-blue-500 transition-colors">
                      <Upload className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-semibold text-slate-600">Drag & Drop or Click</p>
                      <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG (Max 5MB)</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Background Selection */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">Step 02: Canvas Color</label>
            <div className="grid grid-cols-2 gap-4">
              {['white', 'blue'].map((color) => (
                <button
                  key={color}
                  onClick={() => setBgColor(color)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 flex items-center justify-center gap-3 font-bold
                    ${bgColor === color ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-slate-100 text-slate-500 hover:border-slate-200'}`}
                >
                  <div className={`w-4 h-4 rounded-full border shadow-sm ${color === 'white' ? 'bg-white border-slate-300' : 'bg-[#0047AB] border-transparent'}`} />
                  <span className="capitalize">{color}</span>
                  {bgColor === color && <Check className="absolute top-2 right-2 w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Layout Selection */}
          <div className="space-y-3">
            <label className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600 px-1">Step 03: Photo Layout</label>
            <div className="relative">
              <select
                value={photoCount}
                onChange={(e) => setPhotoCount(Number(e.target.value))}
                className="w-full appearance-none bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-bold text-slate-700 focus:outline-none focus:border-blue-400 transition-colors cursor-pointer"
              >
                {[2, 4, 6, 8].map(n => <option key={n} value={n}>{n} Passport Photos (Grid)</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ImageIcon size={20} />
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className={`w-full py-5 rounded-3xl font-black text-lg tracking-tight transition-all duration-300 flex items-center justify-center gap-3
              ${loading || !file
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 hover:-translate-y-1 active:translate-y-0'}`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Loader2 className="animate-spin" /> Processing AI...
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  Generate Professional Grid
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.div>
    </div>
  );
}


export default Home;