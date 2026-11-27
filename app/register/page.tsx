import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/RegisterForm";
import { headingClass, linkClass } from "@/components/styles";
import { getActiveUser } from "@/lib/session";

export const metadata: Metadata = { title: "Request an account" };

async function RegisterContent() {
  if (await getActiveUser()) redirect("/cases");

  return (
    <div className="max-w-md">
      <h1 className={headingClass}>Request an account</h1>
      <p className="mt-1 text-muted">
        A coordinator reviews every request before you can sign in.
      </p>
      <RegisterForm />
      <p className="mt-5 text-sm text-muted">
        Already approved?{" "}
        <Link href="/login" className={linkClass}>
          Sign in
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md" aria-busy="true">
          <h1 className={headingClass}>Request an account</h1>
          <p className="mt-1 text-muted">
            A coordinator reviews every request before you can sign in.
          </p>
          <p className="mt-5 text-sm text-muted" role="status">
            Checking your session...
          </p>
        </div>
      }
    >
      <RegisterContent />
    </Suspense>
  );
}
