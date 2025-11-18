"use client";

import { paymentService } from "@/app/services/paymentService";
import { useSession } from "next-auth/react";
import { useState } from "react";

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
  const token = (session)?.accessToken;

  const [rows, setRows] = useState(payments);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [updatedFine, setUpdatedFine] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const openModal = (payment: Payment) => {
    setCurrentPayment(payment);
    setUpdatedFine(payment.fine);
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!currentPayment) return;
    if (updatedFine === null || updatedFine === undefined) {
      alert("Please provide fine amount.");
      return;
    }

    if (updatedFine === currentPayment.fine) {
      alert("No changes to save.");
      return;
    }

    if (!token) {
      alert("No token found. Please login again.");
      return;
    }

    try {
      setLoading(true);

      await paymentService.updatePayments(token, currentPayment.id, {
        fine: updatedFine,
      });

      const updatedRows = rows.map((p) =>
        p.id === currentPayment.id ? { ...p, fine: updatedFine } : p
      );
      setRows(updatedRows);

      setModalOpen(false);
      setCurrentPayment(null);
      alert(`Payment fine updated successfully!`);
    } catch (error) {
      console.error(error);
      alert("Failed to update payment fine.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
                <td className="px-4 py-2">{payment.isPaid ? "Yes" : "No"}</td>
                <td className="px-4 py-2">
                  {new Date(payment.paymentDate).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center gap-5">
                      <button
                          onClick={() => openModal(payment)}
                          disabled={payment?.fine === 0}
                          className={`px-3 py-1 rounded text-xs text-white 
                            bg-blue-500 hover:bg-blue-600 cursor-pointer
                            disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
                            >
                          Update Fine
                       </button>
                      <button
                          className={`px-3 py-1 rounded text-xs text-white 
                            bg-blue-500 hover:bg-blue-600 cursor-pointer`}
                            >
                          Update Payment
                       </button>

                  </div>
                   
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal – only Fine */}
      {modalOpen && currentPayment && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Update Fine
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Payment ID:{" "}
              <span className="font-mono text-xs">{currentPayment.id}</span>
            </p>
            <p className="text-sm text-gray-600 mb-4">
              Amount: <span className="font-semibold">{currentPayment.amount}</span>
            </p>

            <div className="mb-4">
              <label className="block text-left text-gray-700 text-sm mb-1">
                Fine Amount
              </label>
              <input
                type="number"
                value={updatedFine ?? 0}
                onChange={(e) => setUpdatedFine(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSave}
                disabled={loading}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm text-white"
              >
                {loading ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setCurrentPayment(null);
                }}
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
