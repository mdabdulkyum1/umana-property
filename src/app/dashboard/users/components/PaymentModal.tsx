"use client";


import { useState } from "react";
import toast from "react-hot-toast";
import { paymentService } from "@/app/services/paymentService";
import { IUser } from "./UsersTable";

interface PaymentModalProps {
  user: IUser;
  token: string;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

export default function PaymentModal({
  user,
  token,
  onClose,
  onPaymentSuccess,
}: PaymentModalProps) {
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false);

  const handlePaymentSubmit = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (isPaying) return;

    try {
      setIsPaying(true);

      await paymentService.payment(token, {
        userId: user.id,
        amount: Number(amount),
      });

      toast.success("✅ Payment successful!");
      setAmount("");
      onPaymentSuccess();
      onClose();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("❌ Failed to process payment.");
    } finally {
      setIsPaying(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Send Payment to {user.name || "User"}
        </h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 mb-4 bg-gray-100 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <div className="flex justify-center gap-4">
          <button
            onClick={handlePaymentSubmit}
            disabled={isPaying}
            className={`px-4 py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2 ${
              isPaying
                ? "bg-green-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isPaying ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              "Confirm"
            )}
          </button>

          <button
            onClick={() => !isPaying && onClose()}
            disabled={isPaying}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm text-gray-900"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
