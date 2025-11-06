"use client";

import { Suspense } from "react";
import RegisterForm from "../components/RegisterForm";

function RegisterPageContent() {

  return (
    <div>
      <RegisterForm />
    </div>
  );
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-gray-500 text-lg animate-pulse">
            Loading registration form...
          </div>
        </div>
      }
    >
      <RegisterPageContent />
    </Suspense>
  );
}
