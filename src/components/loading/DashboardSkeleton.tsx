
export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header skeleton */}
        <div>
          <div className="h-7 w-52 bg-gray-200 rounded-md mb-3" />
          <div className="h-4 w-40 bg-gray-200 rounded-md" />
        </div>

        {/* Stat cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="h-4 w-24 bg-gray-200 rounded-md mb-3" />
              <div className="h-6 w-20 bg-gray-200 rounded-md" />
            </div>
          ))}
        </div>

        {/* Search + filter + export skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="h-10 w-full sm:w-72 bg-gray-200 rounded-lg" />
          <div className="h-10 w-40 bg-gray-200 rounded-lg" />
          <div className="h-10 w-36 bg-gray-200 rounded-lg" />
        </div>

        {/* Table skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-5 w-48 bg-gray-200 rounded-md mb-4" />

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  {Array.from({ length: 9 }).map((_, i) => (
                    <th key={i} className="px-4 py-3">
                      <div className="h-3 w-16 bg-gray-200 rounded-md" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 6 }).map((_, row) => (
                  <tr key={row} className="border-t">
                    {Array.from({ length: 9 }).map((_, col) => (
                      <td key={col} className="px-4 py-3">
                        <div className="h-4 w-20 bg-gray-200 rounded-md" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
