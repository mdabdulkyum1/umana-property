import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CycleCreatePayload } from "@/app/services/investmentService";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateCycleModalProps {
  onClose: () => void;
  onSubmit: (data: CycleCreatePayload) => Promise<void>;
}

export default function CreateCycleModal({ onClose, onSubmit }: CreateCycleModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const handleFormSubmit = async (data: FormData) => {
  const payload: CycleCreatePayload = {
    name: data.name,
    startDate: data.startDate
      ? new Date(data.startDate).toISOString()
      : new Date().toISOString(),
    endDate: data.endDate
      ? new Date(data.endDate).toISOString()
      : undefined,
      isInvested: true
  };

  await onSubmit(payload);
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Create Investment Cycle</h2>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Cycle Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Cycle Name</label>
            <input
              {...register("name")}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Q4 2025"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              {...register("startDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {/* End Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              {...register("endDate")}
              className="w-full px-3 py-2 border rounded-md"
            />
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
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
