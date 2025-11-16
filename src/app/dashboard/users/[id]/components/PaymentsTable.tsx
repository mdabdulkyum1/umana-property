"use client";

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

export default function PaymentsTable({ payments, userId }: PaymentsTableProps) {
  const [rows, setRows] = useState(payments);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
  const [updatedAmount, setUpdatedAmount] = useState<number | null>(null);
  const [updatedFine, setUpdatedFine] = useState<number | null>(null);

  const openModal = (payment: Payment) => {
    setCurrentPayment(payment);
    setUpdatedAmount(payment.amount);
    setUpdatedFine(payment.fine);
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!currentPayment) return;

    const updatedData: Partial<{ amount: number; fine: number }> = {};
    if (updatedAmount !== currentPayment.amount) updatedData.amount = updatedAmount!;
    if (updatedFine !== currentPayment.fine) updatedData.fine = updatedFine!;

    if (Object.keys(updatedData).length === 0) {
      alert("No changes to save.");
      return;
    }

    // Update local table
    const updatedRows = rows.map(p =>
      p.id === currentPayment.id ? { ...p, ...updatedData } : p
    );
    setRows(updatedRows);
    setModalOpen(false);

    // Here you can call API to save updates
    console.log("Data to send to API:", updatedData);
    alert(`Payment ${currentPayment.id} updated!`);
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
                  <button
                    onClick={() => openModal(payment)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {modalOpen && currentPayment && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Update Payment
            </h2>

            <div className="mb-3">
              <label className="block text-left text-gray-700 text-sm mb-1">Amount</label>
              <input
                type="number"
                value={updatedAmount!}
                onChange={(e) => setUpdatedAmount(Number(e.target.value))}
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label className="block text-left text-gray-700 text-sm mb-1">Fine</label>
              <input
                type="number"
                value={updatedFine!}
                onChange={(e) => setUpdatedFine(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleSave}
                className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-sm text-white"
              >
                Save
              </button>
              <button
                onClick={() => setModalOpen(false)}
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
