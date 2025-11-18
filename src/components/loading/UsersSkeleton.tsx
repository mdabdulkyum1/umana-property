
export default function UsersSkeleton() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6 animate-pulse">
      {/* Title */}
      <div className="h-8 w-40 bg-gray-300 rounded mb-6 mx-auto" />

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="h-10 w-full sm:w-1/2 bg-gray-300 rounded-lg" />
        <div className="h-10 w-full sm:w-40 bg-gray-300 rounded-lg" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              {Array.from({ length: 8 }).map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 bg-gray-300 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-t border-gray-200 hover:bg-gray-50 transition"
              >
                {/* # */}
                <td className="px-4 py-3">
                  <div className="h-4 w-6 bg-gray-200 rounded" />
                </td>

                {/* Profile (circle) */}
                <td className="px-4 py-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                </td>

                {/* Name */}
                <td className="px-4 py-3">
                  <div className="h-4 w-24 bg-gray-200 rounded" />
                </td>

                {/* Phone */}
                <td className="px-4 py-3">
                  <div className="h-4 w-28 bg-gray-200 rounded" />
                </td>

                {/* Email */}
                <td className="px-4 py-3">
                  <div className="h-4 w-32 bg-gray-200 rounded" />
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <div className="h-4 w-16 bg-gray-200 rounded" />
                </td>

                {/* Created */}
                <td className="px-4 py-3">
                  <div className="h-4 w-20 bg-gray-200 rounded" />
                </td>

                {/* Actions (3 buttons) */}
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2 justify-center">
                    <div className="h-7 w-14 bg-gray-200 rounded-full" />
                    <div className="h-7 w-14 bg-gray-200 rounded-full" />
                    <div className="h-7 w-14 bg-gray-200 rounded-full" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
