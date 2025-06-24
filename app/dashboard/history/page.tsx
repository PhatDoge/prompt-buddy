"use client";

import { PromptHistory } from "@/components/PromptHistory";
import { History } from "lucide-react";

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-8 h-8 text-indigo-600" />
        <h1 className="text-3xl font-bold text-gray-800">Prompt History</h1>
      </div>
      <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 border border-gray-200/90">
        <PromptHistory />
      </div>
    </div>
  );
}
