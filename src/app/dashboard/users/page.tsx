"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { userService } from "@/app/services/userService";
import { paymentService } from "@/app/services/paymentService";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UsersSkeleton from "@/components/loading/UsersSkeleton";
import toast from "react-hot-toast";

interface IUser {
  id: string;
  name?: string;
  fatherName?: string;
  email?: string;
  phone: string;
  image?: string;
  role: string;
  hasPayment: boolean;
  createdAt: string;
}

const UsersPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const token = session?.accessToken;

  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [amount, setAmount] = useState("");
  const [isPaying, setIsPaying] = useState(false); // ✅ double payment block

  // Only admin can access
  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.replace("/login");
      return;
    }
    if (session.user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [session, status, router]);

  const fetchUsers = useCallback(async () => {
    try {
      if (!token) return;
      const fetchedUsers = await userService.getAllUsers(token);
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch =
        user.name?.toLowerCase().includes(term) ||
        user.phone.includes(searchTerm) ||
        user.email?.toLowerCase().includes(term);

      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const handleDelete = useCallback(
    async (id: string) => {
      const confirmed = confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;

      // Optimistic update
      setUsers((prev) => prev.filter((u) => u.id !== id));

      if (!token) return;

      try {
        const result = await userService.deleteUser(token, id);

        if (result) {
          toast.success("User deleted successfully!");
        }
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast.error("Failed to delete user");
        // Optional: refetch to restore real state
        fetchUsers();
      }
    },
    [token, fetchUsers]
  );

  const openPaymentModal = useCallback((user: IUser) => {
    setSelectedUser(user);
    setAmount("");
    setIsPaying(false); // reset
    setShowModal(true);
  }, []);

  const handlePaymentSubmit = useCallback(async () => {
    if (!token || !selectedUser) return;
    if (!amount || Number(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    // Already processing → ignore extra clicks
    if (isPaying) return;

    try {
      setIsPaying(true);

      await paymentService.payment(token, {
        userId: selectedUser.id,
        amount: Number(amount),
      });

      toast.success("✅ Payment successful!");
      setShowModal(false);
      setAmount("");

      // Optional: refresh users so hasPayment updates
      await fetchUsers();
    } catch (error) {
      console.error("❌ Payment error:", error);
      toast.error("❌ Failed to process payment.");
    } finally {
      setIsPaying(false);
    }
  }, [token, amount, selectedUser, isPaying, fetchUsers]);

  if (loading) return <UsersSkeleton />;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">All Users</h1>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone or email"
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-white border border-gray-300 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-300 bg-white">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t border-gray-300 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>

                  <td className="px-4 py-3">
                    <Link href={`/dashboard/users/${user.id}`}>
                      <Image
                        src={user.image || "/default-avatar.png"}
                        alt={user.name || "User"}
                        width={40}
                        height={40}
                        className="rounded-full object-cover border border-gray-300 cursor-pointer"
                      />
                    </Link>
                  </td>

                  <td className="px-4 py-3">{user.name || "Unknown"}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.email || "—"}</td>
                  <td className="px-4 py-3">{user.role}</td>

                  {/* Status (hasPayment) */}
                  <td className="px-4 py-3 text-center">
                    {user.hasPayment ? (
                      <span
                        className="text-green-500 text-xl"
                        title="Has payment this month"
                      >
                        ✓
                      </span>
                    ) : (
                      <span
                        className="text-red-500 text-xl"
                        title="No payment this month"
                      >
                        ✕
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => alert(`Update ${user.name}`)}
                      className="bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded text-xs text-white"
                    >
                      Update
                    </button>

                    <button
                      onClick={() => openPaymentModal(user)}
                      className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded text-xs text-white"
                    >
                      Pay
                    </button>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-xs text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-6 text-gray-500 italic"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              Send Payment to {selectedUser.name || "User"}
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
                onClick={() => !isPaying && setShowModal(false)}
                disabled={isPaying}
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg text-sm text-gray-900"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
