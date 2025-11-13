import { InvestmentCycle } from "@/app/services/investmentService";
import { useState } from "react";


interface DistributeProfitModalProps {
  cycle: InvestmentCycle;
  onClose: () => void;
  onSubmit: (profit: number) => Promise<void>;
}

export default function DistributeProfitModal({ cycle, onClose, onSubmit }: DistributeProfitModalProps) {
  const [profit, setProfit] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const amount = parseFloat(profit);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid profit amount");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(amount);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Distribute Profit</h2>
        <p className="text-sm text-gray-600 mb-4">
          Cycle: <strong>{cycle.name || "Unnamed"}</strong>
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Profit (৳)
          </label>
          <input
            type="number"
            step="0.01"
            value={profit}
            onChange={(e) => setProfit(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0.00"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !profit}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Distributing..." : "Distribute"}
          </button>
        </div>
      </div>
    </div>
  );
}