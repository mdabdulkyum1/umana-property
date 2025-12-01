"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#F7F9FA] text-[#212121]">
      {/* ===== HERO SECTION ===== */}
      <section className="flex flex-col md:flex-row items-center justify-between pt-32 pb-20 px-6 max-w-6xl mx-auto">
        {/* Left Side Content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 space-y-6"
        >
          <h2 className="text-4xl md:text-6xl font-bold leading-tight text-[#0073B1]">
            Umana Property <br />
            <span className="text-[#2867B2]">Investment Group</span>
          </h2>

          <p className="text-[#334E58] text-lg leading-relaxed">
            A trusted community-driven investment platform where every member contributes,
            grows, and earns together. We manage collective funds transparently to create
            sustainable financial success for all members.
          </p>

          <div className="flex space-x-4 pt-4">
            <a
              href="/register"
              className="bg-[#0073B1] text-white px-6 py-3 rounded-2xl font-medium hover:bg-[#005F8F] transition flex items-center gap-2"
            >
              Join Now <ArrowRight size={18} />
            </a>
            <a
              href="/login"
              className="border border-[#0073B1] text-[#0073B1] px-6 py-3 rounded-2xl font-medium hover:bg-[#0073B1] hover:text-white transition"
            >
              Member Login
            </a>
          </div>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:w-1/2 mt-10 md:mt-0 flex justify-center"
        >
          <Image
            width={500}
            height={300}
            src="https://i.ibb.co/gLhRRj15/umana-banner.png"
            alt="Investment Illustration"
            className="w-full max-w-md drop-shadow-xl rounded-lg"
          />
        </motion.div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="bg-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-[#0073B1]">About Us</h3>
          <p className="text-[#334E58] text-lg max-w-3xl mx-auto leading-relaxed">
            At Umana Property Investment Group, we believe in collective growth and 
            transparent management. Every member’s contribution helps build long-term 
            financial stability and community trust. Our vision is to create a 
            sustainable investment network where everyone benefits.
          </p>
        </div>
      </section>

      {/* ===== FEATURES SECTION ===== */}
      <section id="features" className="py-20 bg-[#F3F6F8] px-6">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h3 className="text-3xl font-bold text-[#0073B1]">Why Choose Us?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Transparent Investment",
                desc: "Every transaction and report is visible to all members in real-time.",
              },
              {
                title: "Monthly Growth",
                desc: "Track your deposits, profits, and overall growth every month.",
              },
              {
                title: "Secure System",
                desc: "We ensure all data and transactions are fully secured and encrypted.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition"
              >
                <h4 className="text-xl font-semibold text-[#0073B1] mb-2">
                  {item.title}
                </h4>
                <p className="text-[#334E58]">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="bg-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h3 className="text-3xl font-bold text-[#0073B1]">Get in Touch</h3>
          <p className="text-[#334E58] max-w-2xl mx-auto">
            Have questions about joining or managing your investment? 
            Contact us anytime and we{"’"}ll get back to you shortly.
          </p>

          <div className="flex justify-center pt-4">
            <a
              href="mailto:kyummdabdul@gmail.com"
              className="bg-[#0073B1] text-white px-8 py-3 rounded-2xl font-medium hover:bg-[#005F8F] transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0073B1] text-white text-center py-6">
        <p className="text-sm">
          © {new Date().getFullYear()} Umana Property Investment Group. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
