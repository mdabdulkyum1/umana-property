"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, UseFormRegisterReturn } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { authService } from "@/app/services/authService";
import { useAuthStore } from "@/stores/authStore";

// ✅ Validation Schema
const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required." }),
    fatherName: z.string().min(1, { message: "Father's name is required." }),
    phone: z.string().min(10, { message: "Valid phone number required." }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, { message: "Confirm Password is required." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

// ✅ Infer Type
type FormData = z.infer<typeof formSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const setAuthData = useAuthStore((state) => state.setAuthData);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const toastId = toast.loading("Creating account...");
    try {
      const res = await authService.registerUser({
        name: data.name,
        fatherName: data.fatherName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });

      setAuthData(res?.data?.id, res?.data?.email, data.password);
      toast.dismiss(toastId);
      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      toast.dismiss(toastId);
      const message =
        error instanceof Error ? error.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-700 to-indigo-600 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 9.75l9-6 9 6M4.5 10.5v10.125h15V10.5M8.25 21V12h7.5v9"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Umana Property
          </h1>
          <p className="text-gray-600">
            Create your investor account to get started
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <InputField
            label="Full Name"
            placeholder="Enter your full name"
            register={register("name")}
            error={errors.name?.message}
          />

          <InputField
            label="Father's Name"
            placeholder="Enter your father's name"
            register={register("fatherName")}
            error={errors.fatherName?.message}
          />

          <InputField
            label="Phone Number"
            placeholder="Enter your phone number"
            register={register("phone")}
            error={errors.phone?.message}
          />

          <InputField
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            register={register("email")}
            error={errors.email?.message}
          />

          <PasswordField
            label="Password"
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            register={register("password")}
            error={errors.password?.message}
          />

          <PasswordField
            label="Confirm Password"
            show={showConfirmPassword}
            toggle={() => setShowConfirmPassword(!showConfirmPassword)}
            register={register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />

          {/* Terms */}
          <div className="flex items-start space-x-2">
            <input
              type="checkbox"
              required
              className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label className="text-sm text-gray-600">
              I agree to the{" "}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-700 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-800 hover:to-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-all duration-200 shadow-lg"
          >
            Create Account
          </button>

          {/* Login */}
          <p className="text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}


interface InputFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  register: UseFormRegisterReturn;
  error?: string;
}

function InputField({
  label,
  type = "text",
  placeholder,
  register,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        {...register}
        className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
          error
            ? "border-red-300 bg-red-50 focus:ring-red-500"
            : "border-gray-300 hover:border-gray-400"
        }`}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}

interface PasswordFieldProps {
  label: string;
  show: boolean;
  toggle: () => void;
  register: UseFormRegisterReturn;
  error?: string;
}

function PasswordField({
  label,
  show,
  toggle,
  register,
  error,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          placeholder={`Enter ${label.toLowerCase()}`}
          {...register}
          className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${
            error
              ? "border-red-300 bg-red-50 focus:ring-red-500"
              : "border-gray-300 hover:border-gray-400"
          }`}
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
