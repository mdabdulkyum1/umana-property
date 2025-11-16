import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { userService } from "@/app/services/userService";
import Link from "next/link";
import PaymentsTable from "./components/PaymentsTable";
import { redirect } from "next/navigation";
import Image from "next/image";

interface UserDetailsPageProps {
  params: { id: string };
}

export default async function UserDetailsPage({ params }: UserDetailsPageProps) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session) return redirect("/login");

  const token = session?.accessToken;
  if (!token) throw new Error("Token missing in session");

  const user = await userService.getUserById(token, id);

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 px-4 py-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between max-w-5xl mx-auto mb-6">
        <h1 className="text-2xl font-semibold">User Details</h1>
        <Link
          href="/dashboard/users"
          className="text-sm px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 border border-gray-300"
        >
          ← Back to Users
        </Link>
      </div>

      {/* User Info */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl border border-gray-300 p-6 flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border border-gray-300">
          <Image
            src={user.image || "/default-avatar.png"}
            alt={user.name || "User Avatar"}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user.name || "Unknown"}</h2>
          <p className="text-gray-600">{user.phone}</p>
        </div>
      </div>

      {/* Payments Table */}
      <div className="max-w-5xl mx-auto mt-6">
        <PaymentsTable payments={user.payments} userId={user.id} />
      </div>
    </div>
  );
}
