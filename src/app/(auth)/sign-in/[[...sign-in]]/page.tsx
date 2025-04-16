import AuthLayout from "@/components/AuthLayout";
import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | ExportPitch AI",
  description:
    "Log in to your ExportPitch AI account to access your personalized export pitch training",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <AuthLayout
      title="Sign in to your account"
      description="Welcome back! Continue your export pitch training journey"
      backUrl="/"
      backLabel="Back to home"
    >
      <SignIn 
         appearance={{
          elements: {
            formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-black",
            footerActionLink: "text-yellow-500 hover:text-yellow-600",
            card: "shadow-none",
          },
        }}
      />
    </AuthLayout>
  );
}
