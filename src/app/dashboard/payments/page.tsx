
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";

import { paymentService } from "@/app/services/paymentService";
import PaymentHistoryTable from "./PaymentHistoryTable";

export default async function PaymentHistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const token = (session)?.accessToken;
  if (!token) {
    throw new Error("Token missing in session");
  }

  const payments = await paymentService.getMyPayments(token);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Payment History</h1>
          <p className="text-sm text-gray-600">
            All your payments recorded in the system.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="text-sm px-4 py-2 rounded bg-white border border-gray-300 hover:bg-gray-50"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto">
        <PaymentHistoryTable payments={payments} />
      </div>
    </div>
  );
}
