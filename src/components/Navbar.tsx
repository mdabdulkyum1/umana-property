"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";


export default function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const user = useUserStore((state) => state.user);
  const isLoggedIn = status === "authenticated";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const mobileMenuVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto", transition: { duration: 0.3 } },
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    setIsMobileMenuOpen(false);
  };

  const hideNavbar = pathname.startsWith("/dashboard");

  if (!hideNavbar) {
    return ( 
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-[#E1E9EE]"
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="">
          <Link
            href="/"
            className="transition-colors duration-300"
          >
            <Image src="/logo.png" alt="Umana Property logo" width={85} height={85} />
          </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <motion.div variants={navItemVariants} initial="hidden" animate="visible">
              <Link
                href="/"
                className="text-[#212121] font-medium hover:text-[#0073B1] transition-colors"
              >
                Home
              </Link>
            </motion.div>

            {isLoggedIn && (
              <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                <Link
                  href="/dashboard"
                  className="text-[#212121] font-medium hover:text-[#0073B1] transition-colors"
                >
                  Dashboard
                </Link>
              </motion.div>
            )}

            {isLoggedIn ? (
              <>
                <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                  <div className="flex items-center justify-center">
                     <div className="w-9 h-9 min-w-9 min-h-9 rounded-full border border-[#0073B1] overflow-hidden">
                       <Image
                         src={
                           user?.image ||
                           "https://ui-avatars.com/api/?name=User+Name&background=0073B1&color=fff"
                         }
                         alt="User"
                         width={144}
                         height={144}
                         className="w-full h-full object-cover"
                         title={session.user?.name || "User"}
                       />
                     </div>
                </div>


                </motion.div>

                <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                  <button
                    onClick={handleLogout}
                    className="text-[#212121] hover:text-[#D32F2F] font-medium transition-colors"
                  >
                    Logout
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                  <Link
                    href="/login"
                    className="text-[#212121] font-medium hover:text-[#0073B1] transition-colors"
                  >
                    Login
                  </Link>
                </motion.div>

                <motion.div variants={navItemVariants} initial="hidden" animate="visible">
                  <Link
                    href="/register"
                    className="bg-[#0073B1] text-white px-6 py-2 rounded-2xl font-medium hover:bg-[#005F8F] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#212121]"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          variants={mobileMenuVariants}
          initial="hidden"
          animate={isMobileMenuOpen ? "visible" : "hidden"}
          className="md:hidden bg-[#F3F6F8] border-t border-[#E1E9EE]"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-[#212121] hover:text-[#0073B1] font-medium transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Home
            </Link>

            {isLoggedIn && (
              <Link
                href="/dashboard"
                className="text-[#212121] hover:text-[#0073B1] font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="text-[#212121] hover:text-[#D32F2F] font-medium text-left transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-[#212121] hover:text-[#0073B1] font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="bg-[#0073B1] text-white px-6 py-2 rounded-2xl text-center font-medium hover:bg-[#005F8F] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </motion.div>
      </motion.nav>
    );
  }
}
