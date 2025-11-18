"use client";
import { Settings, LogOut, User } from "lucide-react";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useUserStore } from "@/stores/userStore";
import Loading from "@/components/loading/Loading";
import Image from "next/image";

export default function Navbar() {

  const [open, setOpen] = useState(false);
  const user = useUserStore((state) => state.user);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };


  if (!user) return <Loading></Loading>;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              
            </div>
           
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">

          {/* User Menu */}
          <div className="relative">
            <button
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              onClick={() => setOpen(!open)}
            >
               <div className="flex items-center justify-center">
                                   <div className="w-10 h-10 min-w-9 min-h-9 rounded-full border border-[#0073B1] overflow-hidden">
                                     <Image
                                       src={
                                         user?.image ||
                                         "https://ui-avatars.com/api/?name=User+Name&background=0073B1&color=fff"
                                       }
                                       alt="User"
                                       width={164}
                                       height={164}
                                       className="w-full h-full object-cover"
                                     />
                                   </div>
                                </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
                
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </button>
                </div>
                
                <div className="border-t border-gray-100 py-1 cursor-pointer">
                  <button 
                    onClick={handleLogout}
                    className="cursor-pointer flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
