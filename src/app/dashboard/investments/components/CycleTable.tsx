import { format } from "date-fns";
import { Edit, Trash2 } from "lucide-react";
import { InvestmentCycle } from "@/app/services/investmentService";

interface CycleTableProps {
  cycles: InvestmentCycle[];
  onEdit: (cycle: InvestmentCycle) => void;
  onDelete: (id: string) => void;
  onMarkInvested: (id: string) => void;
  onDistribute: (cycle: InvestmentCycle) => void;
  onAssignPaid: (id: string) => void;
  loading: boolean;
}

export default function CycleTable({
  cycles,
  onEdit,
  onDelete,
  onMarkInvested,
  onDistribute,
  onAssignPaid,
  loading,
}: CycleTableProps) {
  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (cycles.length === 0) return <p className="text-center py-8 text-gray-500">No cycles found</p>;

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Profit</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cycles.map((cycle) => (
            <tr key={cycle.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {cycle.name || "Unnamed"}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                ৳{cycle.totalDeposit.toLocaleString()}
              </td>
              <td className="px-6 py-4 text-sm text-gray-700">
                ৳{cycle.totalProfit.toLocaleString()}
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  {cycle.isInvested ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Invested</span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                  )}
                  {cycle.distributed && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">Distributed</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                {format(new Date(cycle.startDate), "dd MMM yyyy")}
                {cycle.endDate && ` to ${format(new Date(cycle.endDate), "dd MMM yyyy")}`}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => onEdit(cycle)} className="text-blue-600 hover:text-blue-900">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => onDelete(cycle.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {!cycle.isInvested && (
                    <button onClick={() => onMarkInvested(cycle.id)} className="text-green-600 text-xs">
                      Mark Invested
                    </button>
                  )}
                  {cycle.isInvested && !cycle.distributed && (
                    <button onClick={() => onDistribute(cycle)} className="text-purple-600 text-xs">
                      Distribute
                    </button>
                  )}
                  <button onClick={() => onAssignPaid(cycle.id)} className="text-indigo-600 text-xs">
                    Assign Paid
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
