"use client";

import { useSession } from "next-auth/react";
import { format } from "date-fns";
import { useEffect, useState, useMemo } from "react";
import Loading from "@/components/loading/Loading";
import { Search, Filter, Download } from "lucide-react";
import { dashboardService } from "@/app/services/dashboardService";

// ==================== TYPES ====================
interface DashboardSummary {
  totalUsers: number;
  totalPaidAmount: number;
  totalUnassignedPaid: number;
  totalInCycles: number;
  openCycles: number;
  systemBalance: number;
}

interface UserOverview {
  id: string;
  name: string;
  fatherName: string;
  phone: string;
  image: string | null;
  createdAt: string;
  totalPaid: number;
  pendingCount: number;
  unassignedPaid: number;
  lastPaymentDate: string | null;
  totalFine: number;
}

// ==================== COLORS (typed) ====================
export const colors = {
  blue: "bg-blue-100 text-blue-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  purple: "bg-purple-100 text-purple-800",
  indigo: "bg-indigo-100 text-indigo-800",
  pink: "bg-pink-100 text-pink-800",
} as const;

export type ColorKey = keyof typeof colors;

// ==================== CURRENCY ====================
const formatBDT = (amount: number) => `৳${amount.toFixed(2)}`;

// ==================== CSV EXPORT ====================
const exportToCSV = (data: UserOverview[], filename: string) => {
  const headers = [
    "#",
    "Name",
    "Father",
    "Phone",
    "Paid",
    "Pending",
    "Fine",
    "Last Payment",
    "Joined",
  ];

  const rows = data.map((u, idx) => [
    idx + 1,
    u.name,
    u.fatherName,
    u.phone,
    u.totalPaid,
    u.pendingCount,
    u.totalFine,
    u.lastPaymentDate ? format(new Date(u.lastPaymentDate), "MMM dd") : "—",
    format(new Date(u.createdAt), "MMM dd, yyyy"),
  ]);

  const csvContent =
    "data:text/csv;charset=utf-8," +
    [headers, ...rows].map((e) => e.join(",")).join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// ==================== MAIN COMPONENT ====================
export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [users, setUsers] = useState<UserOverview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "pending" | "fine">("all");

  const accessToken = session?.accessToken as string | undefined;

  // ==================== FETCH DATA ====================
  useEffect(() => {
    const fetchData = async () => {
      if (!accessToken) return;

      try {
        setLoading(true);
        setError(null);

        const [summaryData, usersData] = await Promise.all([
          dashboardService.getDashboardSummery(accessToken),
          dashboardService.getAllUsers(accessToken),
        ]);

        setSummary(summaryData);
        setUsers(usersData);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Failed to load dashboard";
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated" && accessToken) {
      fetchData();
    }
  }, [status, accessToken]);

  // ==================== FILTERED DATA ====================
  const filteredUsers = useMemo(() => {
    return users
      .filter((u) => {
        const matchesSearch =
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.fatherName.toLowerCase().includes(search.toLowerCase()) ||
          u.phone.includes(search);

        const matchesFilter =
          filter === "all" ||
          (filter === "paid" && u.totalPaid > 0) ||
          (filter === "pending" && u.pendingCount > 0) ||
          (filter === "fine" && u.totalFine > 0);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, search, filter]);

  // ==================== RENDER STATES ====================
  if (status === "loading" || loading) return <Loading />;
  if (!session) return <p className="text-center text-red-600">Please sign in</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {session.user?.name ?? "User"}!
          </h1>
          <p className="text-gray-600 mt-1">
            Role: <span className="font-medium">{session.user?.role ?? "USER"}</span>
          </p>
        </header>

        {/* Summary Cards */}
        {summary && (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-10">
            <StatCard title="Total Users" value={summary.totalUsers} color="blue" />
            <StatCard title="Total Paid" value={formatBDT(summary.totalPaidAmount)} color="green" />
            <StatCard title="Unassigned" value={formatBDT(summary.totalUnassignedPaid)} color="yellow" />
            <StatCard title="In Cycles" value={formatBDT(summary.totalInCycles)} color="purple" />
            <StatCard title="Open Cycles" value={summary.openCycles} color="indigo" />
            <StatCard title="Balance" value={formatBDT(summary.systemBalance)} color="pink" />
          </section>
        )}

        {/* Search + Filter + Export */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name, father, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-600" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as "all" | "paid" | "pending" | "fine")}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Users</option>
              <option value="paid">Has Paid</option>
              <option value="pending">Has Pending</option>
              <option value="fine">Has Fine</option>
            </select>
          </div>

          {/* CSV Export */}
          <button
            onClick={() => exportToCSV(filteredUsers, "users-overview")}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        {/* Users Table */}
        <Section title={`Users Overview (${filteredUsers.length})`}>
          {filteredUsers.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No users found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <Th className="w-12">#</Th>
                    <Th>Name</Th>
                    <Th>Father</Th>
                    <Th>Phone</Th>
                    <Th className="text-right">Paid</Th>
                    <Th className="text-center">Pending</Th>
                    <Th className="text-right">Fine</Th>
                    <Th>Last Payment</Th>
                    <Th>Joined</Th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((u, index) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <Td className="text-center font-medium text-gray-600">
                        {index + 1}
                      </Td>
                      <Td className="font-medium">{u.name}</Td>
                      <Td>{u.fatherName}</Td>
                      <Td>{u.phone}</Td>
                      <Td className="text-right font-medium text-green-600">
                        {formatBDT(u.totalPaid)}
                      </Td>
                      <Td className="text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.pendingCount > 0
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {u.pendingCount}
                        </span>
                      </Td>
                      <Td className="text-right text-red-600 font-medium">
                        {formatBDT(u.totalFine)}
                      </Td>
                      <Td className="text-sm">
                        {u.lastPaymentDate
                          ? format(new Date(u.lastPaymentDate), "MMM dd")
                          : "—"}
                      </Td>
                      <Td className="text-xs text-gray-500">
                        {format(new Date(u.createdAt), "MMM dd, yyyy")}
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Section>
      </div>
    </div>
  );
}

/* ==================== UI COMPONENTS ==================== */

function StatCard({
  title,
  value,
}: {
  title: string;
  value: string | number;
  color: ColorKey;
}) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="mt-2 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <th
    className={`px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}
  >
    {children}
  </th>
);

const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-900 ${className}`}>
    {children}
  </td>
);