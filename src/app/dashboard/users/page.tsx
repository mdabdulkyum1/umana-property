"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { userService } from "@/app/services/userService";
import { paymentService } from "@/app/services/paymentService";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface IUser {
  id: string;
  name?: string;
  fatherName?: string;
  email?: string;
  phone: string;
  image?: string;
  role: string;
  createdAt: string;
}

const UsersPage = () => {
  const { data: session } = useSession();
   const router = useRouter(); // ✅
  const token = session?.accessToken;
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [amount, setAmount] = useState("");

 useEffect(() => {
    if (status === "loading") return; 
    if (session?.user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [session, router]);

  // ✅ fetch users (memoized)
  const fetchUsers = useCallback(async () => {
    try {
      if (!token) return;
      const fetchedUsers = await userService.getAllUsers(token);
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ✅ Filtered users list (memoized)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  // ✅ Delete user
  const handleDelete = useCallback((id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    setUsers((prev) => prev.filter((u) => u.id !== id));
    // You can call backend delete endpoint here
  }, []);

  // ✅ Open modal for payment
  const openPaymentModal = useCallback((user: IUser) => {
    setSelectedUser(user);
    setAmount("");
    setShowModal(true);
  }, []);

  // ✅ Handle payment submit
  const handlePaymentSubmit = useCallback(async () => {
    if (!token || !selectedUser) return;
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      await paymentService.payment(token, {
        userId: selectedUser.id,
        amount: Number(amount),
      });
      alert("✅ Payment successful!");
      setShowModal(false);
    } catch (error) {
      console.error("❌ Payment error:", error);
      alert("❌ Failed to process payment.");
    }
  }, [token, amount, selectedUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading users...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#111924] text-white p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">All Users</h1>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone or email"
          className="px-4 py-2 rounded-lg bg-[#121E2E] border border-slate-700 w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 rounded-lg bg-[#121E2E] border border-slate-700 w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* 📋 Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-700">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-[#121E2E] text-gray-300 uppercase text-xs">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Profile</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className="border-t border-slate-800 hover:bg-[#1A2639] transition"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">
                    <Image
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User"}
                      width={40}
                      height={40}
                      className="rounded-full object-cover border border-slate-600"
                    />
                  </td>
                  <td className="px-4 py-3">{user.name || "Unknown"}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.email || "—"}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => alert(`Update ${user.name}`)}
                      className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-xs"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => openPaymentModal(user)}
                      className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
                    >
                      Pay
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-6 text-gray-400 italic">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 💰 Payment Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-[#1a2433] p-6 rounded-xl shadow-xl w-96 text-center">
            <h2 className="text-xl font-semibold mb-4 text-white">
              Send Payment to {selectedUser.name || "User"}
            </h2>

            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 mb-4 bg-[#121E2E] border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <div className="flex justify-center gap-4">
              <button
                onClick={handlePaymentSubmit}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-sm"
              >
                Confirm
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm"
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
