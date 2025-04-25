import AuthLayout from '@/components/AuthLayout';
import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Sign Up | ExportPitch AI",
  description:
    "Sign up to your ExportPitch AI account to access your personalized export pitch training",
  robots: {
    index: false,
    follow: true,
  },
};

export default function Page() {
  return (
    <AuthLayout
          title="Sign up to your account"
          description="Welcome! Start your export pitch training journey"
          backUrl="/"
          backLabel="Back to home"
        >
          <SignUp
             appearance={{
              elements: {
                formButtonPrimary: "bg-yellow-400 hover:bg-yellow-500 text-black",
                footerActionLink: "text-yellow-500 hover:text-yellow-600",
                card: "shadow-none",
              },
            }}
          />
        </AuthLayout>
  )
}