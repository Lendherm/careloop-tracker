import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#1F2933]">Sign in</h1>
      <p className="mb-6 text-[#6B7280]">
        Access your CareLoop cases and profile.
      </p>
      <LoginForm />
      <p className="mt-4 text-sm text-[#6B7280]">
        Need an account?{" "}
        <Link href="/register" className="font-medium text-[#0F6B6B] hover:underline">
          Register
        </Link>
      </p>
    </main>
  );
}
