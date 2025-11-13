import { InvestmentCycle } from "@/app/services/investmentService";
import { DollarSign, Users, CheckCircle, TrendingUp } from "lucide-react";


interface StatsCardsProps {
  cycles: InvestmentCycle[];
}

export default function StatsCards({ cycles }: StatsCardsProps) {
  const totalDeposit = cycles.reduce((sum, c) => sum + c.totalDeposit, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Cycles</p>
            <p className="text-2xl font-bold">{cycles.length}</p>
          </div>
          <Users className="w-10 h-10 text-blue-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Invested</p>
            <p className="text-2xl font-bold">{cycles.filter(c => c.isInvested).length}</p>
          </div>
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Distributed</p>
            <p className="text-2xl font-bold">{cycles.filter(c => c.distributed).length}</p>
          </div>
          <TrendingUp className="w-10 h-10 text-purple-600" />
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Deposit</p>
            <p className="text-2xl font-bold">৳{totalDeposit.toLocaleString()}</p>
          </div>
          <DollarSign className="w-10 h-10 text-yellow-600" />
        </div>
      </div>
    </div>
  );
}