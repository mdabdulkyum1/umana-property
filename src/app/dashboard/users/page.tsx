"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { userService } from "@/app/services/userService";

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
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.warn("No token found");
        setLoading(false);
        return;
      }

      const fetchedUsers = await userService.getAllUsers(token);
      setUsers(fetchedUsers || []);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      // Backend delete function here (optional)
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (error) {
      console.error("❌ Error deleting user:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        Loading users...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#111924] text-white p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center">
        All Registered Users
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-[#121E2E] p-5 rounded-2xl shadow-lg hover:shadow-blue-500/30 transition"
            >
              <div className="flex flex-col items-center">
                <Image
                  height={50}
                  width={50}
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User"}
                  className="w-20 h-20 rounded-full border border-slate-500 mb-3 object-cover"
                />
                <h2 className="text-lg font-semibold">{user.name || "Unknown"}</h2>
                <p className="text-sm text-gray-400">{user.phone}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => alert(`Update ${user.name}`)}
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-400">
            No users found
          </p>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
