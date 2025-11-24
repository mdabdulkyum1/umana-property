
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import UpdateUserModal from "./UpdateUserModal";
import PaymentModal from "./PaymentModal";
import toast from "react-hot-toast";
import { userService } from "@/app/services/userService";
import { useSession } from "next-auth/react";
import Link from "next/link";


export interface IUser {
  id: string;
  name?: string;
  email?: string;
  phone: string;
  role: string;
  image?: string;
  hasPayment: boolean;
  createdAt: string;
}

interface Props {
  initialUsers: IUser[];
}

export default function UsersTable({ initialUsers }: Props) {
    const { data: session } = useSession();

  const [users, setUsers] = useState<IUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

   const token = session?.accessToken;

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      await userService.deleteUser(token as string,id); 
      setUsers(users.filter((u) => u.id !== id));
      toast.success("User deleted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete user");
    }
  };

  const openUpdateModal = (user: IUser) => {
    setSelectedUser(user);
    setUpdateModalOpen(true);
  };

  const openPaymentModal = (user: IUser) => {
    setSelectedUser(user);
    setPaymentModalOpen(true);
  };

  return (
    <>
      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, phone or email"
          className="px-4 py-2 rounded-lg bg-white border w-full sm:w-1/2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="px-4 py-2 rounded-lg bg-white border w-full sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="ADMIN">Admin</option>
          <option value="USER">User</option>
        </select>
      </div>

      {/* Users Table */}
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
                  <td className="px-4 py-3 text-center">
                    {user.hasPayment ? (
                      <span className="text-green-500 text-xl">✓</span>
                    ) : (
                      <span className="text-red-500 text-xl">✕</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => openUpdateModal(user)}
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
                <td colSpan={9} className="text-center py-6 text-gray-500 italic">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modals */}
      {updateModalOpen && selectedUser && (
        <UpdateUserModal
          user={selectedUser}
          token={token as string}
          onClose={() => setUpdateModalOpen(false)}
          onUpdate={(updated) => {
            setUsers(users.map((u) => (u.id === updated.id ? updated : u)));
            setUpdateModalOpen(false);
          }}
        />
      )}

      {paymentModalOpen && selectedUser && (
        <PaymentModal
          user={selectedUser}
          token={token as string}
          onClose={() => setPaymentModalOpen(false)}
          onPaymentSuccess={async () => {
            
            const updatedUsers = await userService.getAllUsers(token as string);
            setUsers(updatedUsers);
          }}
        />
      )}
    </>
  );
}
