"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Printer, Download, CheckCircle2 } from "lucide-react";
import PrintableContractReceipt, { ReceiptData } from "./PrintableContractReceipt";
import html2canvas from "html2canvas";

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receiptData: ReceiptData;
}

export default function ReceiptModal({
  isOpen,
  onClose,
  receiptData,
}: ReceiptModalProps) {
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById("receipt-printable-contract");
    if (!element) return;

    setDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Kids-Oasis-Contract-${receiptData.receiptId || "Certificate"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.warn("Failed to download contract canvas:", err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible"
      >
        {/* CSS Print Rules forcing exact print color rendering of the contract */}
        <style jsx global>{`
          @media print {
            body {
              background: #ffffff !important;
              color: #000000 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body * {
              visibility: hidden !important;
            }
            #receipt-printable-contract,
            #receipt-printable-contract * {
              visibility: visible !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            #receipt-printable-contract {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              margin: 0 !important;
              padding: 24px !important;
              box-shadow: none !important;
              border: 6px double #1e1b4b !important;
              background: #ffffff !important;
              color: #0f172a !important;
            }
            .print\\:hidden {
              display: none !important;
            }
          }
        `}</style>

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 print:shadow-none print:border-none print:w-full print:max-w-none print:my-0"
        >
          {/* Top Control Bar (Hidden on Print) */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between print:hidden">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Official Educational Contract Certificate
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={downloading}
                onClick={handleDownloadPDF}
                className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-extrabold hover:bg-indigo-100 transition flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" /> {downloading ? "Generating..." : "Download Contract"}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Print PDF
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Standalone Printable Contract Component */}
          <div className="p-4 sm:p-6 bg-slate-50/50 dark:bg-slate-950/50 overflow-y-auto max-h-[80vh] print:p-0 print:max-h-none print:bg-white">
            <PrintableContractReceipt data={receiptData} />
          </div>

          {/* Bottom Action Footer (Hidden on Print) */}
          <div className="p-4 bg-slate-100 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center print:hidden">
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
              Verified by Kids-Oasis Platform & Stripe Gateway
            </span>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white text-xs font-extrabold transition shadow-sm"
            >
              Close Contract
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
