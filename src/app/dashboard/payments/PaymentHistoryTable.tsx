"use client";

interface Payment {
  id: string;
  amount: number;
  fine: number;
  paymentDate: string;
  isPaid: boolean;
  paymentMethod?: string | null;
  cycleId?: string | null;
}

interface PaymentHistoryTableProps {
  payments: Payment[];
}

export default function PaymentHistoryTable({ payments }: PaymentHistoryTableProps) {
  if (!payments || payments.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-xl p-6 text-center text-gray-500">
        You have no payment history yet.
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="overflow-x-auto bg-white border border-gray-300 rounded-xl p-4">
      <table className="w-full text-sm text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-300 bg-gray-100">
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Amount (BDT)</th>
            <th className="px-4 py-2">Fine (BDT)</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p, i) => (
            <tr
              key={p.id}
              className="border-b border-gray-200 hover:bg-gray-50 transition"
            >
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{p.amount} BDT</td>
              <td
                className={`px-4 py-2 ${
                  p.fine > 0 ? "text-red-500 font-medium" : "text-gray-800"
                }`}
              >
                {p.fine} BDT
              </td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs ${
                    p.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {p.isPaid ? "Paid" : "Pending"}
                </span>
              </td>
              <td className="px-4 py-2">
                {new Date(p.paymentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}

          {/* total row */}
          <tr className="border-t border-gray-300 bg-gray-50 font-semibold">
            <td className="px-4 py-3" colSpan={1}>
              Total
            </td>
            <td className="px-4 py-3">
              {totalAmount} BDT
            </td>
            <td className="px-4 py-3" colSpan={3}></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
