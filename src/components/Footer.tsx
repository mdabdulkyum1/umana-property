"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMail, FiInfo, FiShield } from "react-icons/fi";
import { useSession } from "next-auth/react";

export default function Footer() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide footer for dashboard routes
  const hideNavbar = pathname.startsWith("/dashboard");

  const footerItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  if (hideNavbar) return null;

  return (
    <motion.footer
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <motion.div variants={footerItemVariants}>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              About Umana Property
            </h3>
            <p className="text-gray-300">
              Umana Property is a modern referral platform where you can earn credits by
              referring friends. Join our community and start sharing today!
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={footerItemVariants}>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  Products
                </Link>
              </li>

              {/* ✅ Show Dashboard only if logged in */}
              {session && (
                <li>
                  <Link
                    href="/dashboard"
                    className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                  >
                    Dashboard
                  </Link>
                </li>
              )}

              {/* ✅ Show Login/Register only if NOT logged in */}
              {!session && (
                <>
                  <li>
                    <Link
                      href="/login"
                      className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/register"
                      className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>

          {/* Contact Section */}
          <motion.div variants={footerItemVariants}>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <FiMail className="text-indigo-600 w-4 h-4" />
                </div>
                <a
                  href="mailto:support@neo-market.com"
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  support@neo-market.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiInfo className="text-purple-600 w-4 h-4" />
                </div>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiShield className="text-green-600 w-4 h-4" />
                </div>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-indigo-400 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          variants={footerItemVariants}
          className="mt-8 pt-8 border-t border-gray-700 text-center"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} Umana Property. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/terms"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-sm"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-sm"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookies"
                className="text-gray-400 hover:text-indigo-400 transition-colors duration-200 text-sm"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
