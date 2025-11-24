"use client";

import { imageUpload } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { userService } from "@/app/services/userService";


export default function DashboardProfile() {
  const { data: session } = useSession();
  const user = useUserStore((state) => state.user);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return alert("Please select an image first!");
    try {
      setLoading(true);
      const image = await imageUpload(selectedFile);
      console.log(image, " image ????")
      if (!image) throw new Error("Image upload failed!");

      const res = await userService.updatePhoto(session?.accessToken as string, image);

      if (res) alert("Profile photo updated successfully!");
      
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Something went wrong while uploading image!");
    } finally {
      setLoading(false);
    }
  };

  return (
   <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 text-center">Profile</h1>

      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-6">
        <div className="relative group w-28 h-28 sm:w-32 sm:h-32">
          <Image
            src={
              preview ||
              user?.image ||
              "/mnt/data/63bf6912-f8cc-46ef-9089-97b49fd51cdd.png"
            }
            alt="Profile"
            fill
            className="rounded-full object-cover border"
          />
          <label className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center text-white font-medium text-sm transition">
            Change
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex flex-col justify-center">
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50 w-full sm:w-auto"
            onClick={handleImageUpload}
            disabled={loading || !selectedFile}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      {/* User Info */}
      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Name:</label>
          <input
            type="text"
            className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            defaultValue={user?.name || ""}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">Email:</label>
          <input
            type="email"
            className="border rounded-lg p-2 w-full bg-gray-100 cursor-not-allowed"
            value={user?.email || ""}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
