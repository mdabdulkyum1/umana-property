'use client';

import { useState, useEffect, useCallback } from 'react';
import StatsCards from './components/StatsCards';
import CycleTable from './components/CycleTable';
import CreateCycleModal from './components/CreateCycleModal';
import UpdateCycleModal from './components/UpdateCycleModal';
import DistributeProfitModal from './components/DistributeProfitModal';
import { investmentService, InvestmentCycle, CycleCreatePayload, CycleUpdatePayload } from '@/app/services/investmentService';
import { useSession } from 'next-auth/react';

export default function InvestmentPage() {
  const { data: session } = useSession();
  const token = session?.accessToken as string;

  const [cycles, setCycles] = useState<InvestmentCycle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCycle, setSelectedCycle] = useState<InvestmentCycle | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [showDistribute, setShowDistribute] = useState(false);

  const loadCycles = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const data = await investmentService.getAllCycles(token);
      setCycles(data);
    } catch (error) {
      console.error('Error loading cycles:', error);
    } finally {
      setLoading(false);
    }
  }, [token]); 

  const handleCreate = async (payload: CycleCreatePayload) => {
    if (!token) return;
    try {
      await investmentService.createInvestment(token, payload);
      setShowCreate(false);
      loadCycles();
    } catch (error) {
      console.error('Error creating cycle:', error);
    }
  };

  const handleUpdate = async (id: string, payload: CycleUpdatePayload) => {
    if (!token) return;
    try {
      await investmentService.updateCycle(token, id, payload);
      setShowUpdate(false);
      loadCycles();
    } catch (error) {
      console.error('Error updating cycle:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await investmentService.deleteCycle(token, id);
      loadCycles();
    } catch (error) {
      console.error('Error deleting cycle:', error);
    }
  };

  const markAsInvested = async (id: string) => {
    if (!token) return;
    try {
      await investmentService.markAsInvested(token, id);
      loadCycles();
    } catch (error) {
      console.error('Error marking invested:', error);
    }
  };

  const distributeProfit = async (id: string, profit: number) => {
    if (!token) return;
    try {
      await investmentService.distributeProfit(token, id, { totalProfit: profit });
      loadCycles();
    } catch (error) {
      console.error('Error distributing profit:', error);
    }
  };

  const assignPaidPayments = async (id: string) => {
    if (!token) return;
    try {
      await investmentService.assignPaidPayments(token, id);
      loadCycles();
    } catch (error) {
      console.error('Error assigning paid payments:', error);
    }
  };

  useEffect(() => {
    if (token) loadCycles();
  }, [token, loadCycles]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Investment Cycles</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          Create New Cycle
        </button>
      </div>

      <StatsCards cycles={cycles} />
      <CycleTable
        cycles={cycles}
        loading={loading}
        onEdit={(c) => { setSelectedCycle(c); setShowUpdate(true); }}
        onDelete={handleDelete}
        onMarkInvested={markAsInvested}
        onDistribute={(c) => { setSelectedCycle(c); setShowDistribute(true); }}
        onAssignPaid={assignPaidPayments}
      />

      {showCreate && (
        <CreateCycleModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {showUpdate && selectedCycle && (
        <UpdateCycleModal
          cycle={selectedCycle}
          onClose={() => setShowUpdate(false)}
          onSubmit={(payload) => handleUpdate(selectedCycle.id, payload)}
        />
      )}

      {showDistribute && selectedCycle && (
        <DistributeProfitModal
          cycle={selectedCycle}
          onClose={() => setShowDistribute(false)}
          onSubmit={async (profit) => {
            await distributeProfit(selectedCycle.id, profit);
            setShowDistribute(false);
          }}
        />
      )}
    </div>
  );
}
