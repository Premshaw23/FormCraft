// components/responses/ExportCSVButton.jsx
"use client";
import React, { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { exportResponsesToCSV } from "@/lib/services/responseService";
import toast from "react-hot-toast";

const ExportCSVButton = ({ formId, formTitle, formFields }) => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);

      // Generate CSV
      const csv = await exportResponsesToCSV(formId, formFields);

      if (!csv) {
        toast.error("No responses to export");
        return;
      }

      // Create download link
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Set filename with current date
      const date = new Date().toISOString().split("T")[0];
      const filename = `${formTitle
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase()}_responses_${date}.csv`;

      link.href = url;
      link.download = filename;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);

      toast.success("CSV exported successfully!");
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast.error("Failed to export CSV");
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white 
                 font-semibold rounded-lg hover:scale-105 transition-all 
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                 flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
    >
      {exporting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Exporting...
        </>
      ) : (
        <>
          <Download className="w-5 h-5" />
          Export CSV
        </>
      )}
    </button>
  );
};

export default ExportCSVButton;
