"use client";

import { paymentService } from "@/app/services/paymentService";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

interface Payment {
  id: string;
  amount: number;
  fine: number;
  paymentDate: string;
  isPaid: boolean;
}

interface PaymentsTableProps {
  payments: Payment[];
  userId: string;
}

export default function PaymentsTable({ payments }: PaymentsTableProps) {
  const { data: session } = useSession();
  const token = session?.accessToken as string | undefined;

  const [rows, setRows] = useState<Payment[]>(payments);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Update Payment modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [updatedAmount, setUpdatedAmount] = useState<number | null>(null);
  const [loadingModal, setLoadingModal] = useState(false);

  // --- Fine = 0 ---
  const handleClearFine = async (payment: Payment) => {
    if (!token) {
      toast.error("No token found. Please login again.");
      return;
    }

    if (payment.fine === 0) {
      toast("Fine already cleared.", { icon: "ℹ️" });
      return;
    }

    try {
      setLoadingId(payment.id);

      await paymentService.updatePayments(token, payment.id, { fine: 0 });

      setRows((prev) =>
        prev.map((p) =>
          p.id === payment.id
            ? {
                ...p,
                fine: 0,
                amount: p.amount + p.fine,
              }
            : p
        )
      );

      toast.success("Fine cleared successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to clear fine.");
    } finally {
      setLoadingId(null);
    }
  };

  // --- Update Payment Modal ---
  const openUpdateModal = (payment: Payment) => {
    setCurrentPayment(payment);
    setUpdatedAmount(payment.amount);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentPayment(null);
    setUpdatedAmount(null);
  };

  const handleSaveAmount = async () => {
    if (!currentPayment || updatedAmount === null || !token) return;

    if (updatedAmount === currentPayment.amount) {
      toast("No changes to save.", { icon: "ℹ️" });
      return;
    }

    try {
      setLoadingModal(true);

      await paymentService.updatePayments(token, currentPayment.id, {
        amount: updatedAmount as number,
      });

      setRows((prev) =>
        prev.map((p) =>
          p.id === currentPayment.id
            ? { ...p, amount: updatedAmount }
            : p
        )
      );

      toast.success("Payment amount updated successfully!");
      closeModal();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update payment.");
    } finally {
      setLoadingModal(false);
    }
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-center" />

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-xl p-4">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 bg-gray-100">
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Fine</th>
              <th className="px-4 py-2">Paid</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((payment, i) => (
              <tr
                key={payment.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-4 py-2">{i + 1}</td>
                <td className="px-4 py-2">{payment.amount}</td>
                <td
                  className={`px-4 py-2 ${
                    payment.fine > 0 ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  {payment.fine}
                </td>
                <td className="px-4 py-2">
                  {payment.isPaid ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
                      Paid
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-medium text-yellow-700">
                      Pending
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleClearFine(payment)}
                      disabled={payment.fine === 0 || loadingId === payment.id}
                      className={`px-3 py-1 rounded text-xs text-white 
                        bg-blue-500 hover:bg-blue-600 cursor-pointer
                        disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
                    >
                      {loadingId === payment.id ? "Clearing..." : "Clear Fine"}
                    </button>

                    <button
                      onClick={() => openUpdateModal(payment)}
                      className={`px-3 py-1 rounded text-xs text-white 
                        bg-emerald-500 hover:bg-emerald-600 cursor-pointer`}
                    >
                      Update Payment
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-gray-500 text-sm"
                >
                  No payments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- Update Payment Modal --- */}
      {modalOpen && currentPayment && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Update Payment
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Payment ID:{" "}
              <span className="font-mono text-xs">{currentPayment.id}</span>
            </p>

            <div className="mb-4">
              <label className="block text-left text-gray-700 text-sm mb-1">
                Amount
              </label>
              <input
                type="number"
                value={updatedAmount ?? 0}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSaveAmount}
                disabled={loadingModal}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm text-white"
              >
                {loadingModal ? "Saving..." : "Save"}
              </button>
              <button
                onClick={closeModal}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
