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

      console.log(res, " res ????")

      if (res) alert("Profile photo updated successfully!");
      
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Something went wrong while uploading image!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <div className="flex items-center space-x-6">
        <Image
          src={
            preview || user?.image ||
            "https://ui-avatars.com/api/?name=User+Name&background=0073B1&color=fff"
          }
          alt="Profile"
          width={100}
          height={100}
          className="w-24 h-24 rounded-full object-cover border"
        />

        <div>
          <label className="block mb-2 font-medium">Change Image:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div>
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
            onClick={handleImageUpload}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name:</label>
          <input
            className="border rounded p-2 w-full"
            defaultValue={user?.name || "N/A"}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email:</label>
          <input
            className="border rounded p-2 w-full bg-gray-100"
            value={user?.email || "N/A"}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
