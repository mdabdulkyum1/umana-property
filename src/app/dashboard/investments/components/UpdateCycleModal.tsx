import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { InvestmentCycle } from "@/app/services/investmentService";
import { CycleUpdatePayload } from "@/app/services/investmentService";

const schema = z.object({
  name: z.string().optional(),
  totalDeposit: z.coerce.number().optional(),
  totalProfit: z.coerce.number().optional(),
  isInvested: z.boolean().optional(),
  distributed: z.boolean().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface UpdateCycleModalProps {
  cycle: InvestmentCycle;
  onClose: () => void;
  onSubmit: (data: CycleUpdatePayload) => Promise<void>;
}

export default function UpdateCycleModal({ cycle, onClose, onSubmit }: UpdateCycleModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: cycle.name || "",
      totalDeposit: cycle.totalDeposit || 0,
      totalProfit: cycle.totalProfit || 0,
      isInvested: cycle.isInvested ?? false,
      distributed: cycle.distributed ?? false,
      endDate: cycle.endDate ? cycle.endDate.split("T")[0] : "",
    },
  });

  // ✅ Proper conversion before submit
  const handleFormSubmit = async (data: FormData) => {
    const payload: CycleUpdatePayload = {
      name: data.name?.trim() || undefined,
      totalDeposit: data.totalDeposit ?? undefined,
      totalProfit: data.totalProfit ?? undefined,
      isInvested: data.isInvested ?? false,
      distributed: data.distributed ?? false,
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };

    await onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update Cycle</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cycle Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Q4 2025"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

          {/* Total Deposit */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Total Deposit</label>
            <input
              type="number"
              step="any"
              {...register("totalDeposit")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Total Profit */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Total Profit</label>
            <input
              type="number"
              step="any"
              {...register("totalProfit")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Is Invested */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              {...register("isInvested")}
              id="isInvested"
              className="h-4 w-4"
            />
            <label htmlFor="isInvested" className="text-sm font-medium">Is Invested</label>
          </div>

          {/* Distributed */}
          <div className="mb-4 flex items-center gap-2">
            <input
              type="checkbox"
              {...register("distributed")}
              id="distributed"
              className="h-4 w-4"
            />
            <label htmlFor="distributed" className="text-sm font-medium">Distributed</label>
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.endDate && (
              <p className="text-red-500 text-xs mt-1">{errors.endDate.message}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
