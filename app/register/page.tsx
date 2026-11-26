import Link from "next/link";
import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#1F2933]">Create account</h1>
      <p className="mb-6 text-[#6B7280]">
        Register with a role so case ownership and referrals work correctly.
      </p>
      <RegisterForm />
      <p className="mt-4 text-sm text-[#6B7280]">
        Already registered?{" "}
        <Link href="/login" className="font-medium text-[#0F6B6B] hover:underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
