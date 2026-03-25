"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, ArrowLeft, CheckCircle, Share2, Printer, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ResultPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedImage = sessionStorage.getItem("processedImage");

    if (savedImage) {
      setImageUrl(savedImage);
    } else {
      router.push("/");
    }
  }, []);

  const downloadImage = async () => {
    if (!imageUrl) return;
    setIsDownloading(true);

    // Slight delay to show the "Processing" state on the button for better UX
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = imageUrl;
      a.download = `passport-photo-grid-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setIsDownloading(false);
    }, 800);
  };

  if (!imageUrl) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
        />
        <p className="mt-4 text-slate-500 font-medium animate-pulse">Fetching your photo...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push("/")}
          className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors mb-8 font-medium"
        >
          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={20} />
          </div>
          Back to Editor
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3 space-y-4"
          >
            <div className="relative group bg-white p-4 rounded-4xl shadow-2xl shadow-blue-100 border border-white">
              <div className="absolute top-4 right-4 z-10">
                <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-blue-600 shadow-sm border border-blue-100 flex items-center gap-1">
                  <Sparkles size={12} /> High Definition
                </span>
              </div>

              <div className="overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center min-h-100">
                <motion.img
                  layoutId="main-image"
                  src={imageUrl}
                  alt="Processed Passport Grid"
                  className="w-full h-auto object-contain max-h-[70vh] hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
            <p className="text-center text-slate-400 text-sm italic">
              Preview quality is reduced. Download for full 300 DPI resolution.
            </p>
          </motion.div>

          {/* Right Side: Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white/70 backdrop-blur-xl p-8 rounded-4xl border border-white shadow-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-emerald-100 p-1 rounded-full text-emerald-600">
                  <CheckCircle size={20} fill="currentColor" className="text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Ready to Print</h1>
              </div>
              <p className="text-slate-500 mb-8">
                Your background was removed and photos were aligned into a professional grid.
              </p>

              <div className="space-y-4">
                <button
                  onClick={downloadImage}
                  disabled={isDownloading}
                  className="w-full relative overflow-hidden bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <AnimatePresence mode="wait">
                    {isDownloading ? (
                      <motion.div
                        key="loading"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Preparing File...
                      </motion.div>
                    ) : (
                      <motion.div
                        key="idle"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Download size={20} />
                        Download JPG
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
{/* 
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                    <Printer size={18} /> Print
                  </button>
                  <button className="flex items-center justify-center gap-2 p-4 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                    <Share2 size={18} /> Share
                  </button>
                </div> */}
              </div>
            </div>

            {/* Print Tips Card */}
            <div className="bg-blue-900 text-blue-100 p-6 rounded-[2rem] shadow-lg">
              <p className="text-sm opacity-80 leading-relaxed">
                For best results, print on  <span className="text-orange-400 font-semibold">Glossy Photo Paper</span> and ensure the scale is set to **100% (Actual Size)** in your printer settings.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}