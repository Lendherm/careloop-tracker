import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { headingClass, linkClass } from "@/components/styles";
import { getActiveUser } from "@/lib/session";

export const metadata: Metadata = { title: "Sign in" };

async function LoginContent() {
  if (await getActiveUser()) redirect("/cases");

  return (
    <div className="max-w-md">
      <h1 className={headingClass}>Sign in</h1>
      <LoginForm />
      <p className="mt-5 text-sm text-muted">
        New here?{" "}
        <Link href="/register" className={linkClass}>
          Request an account
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md" aria-busy="true">
          <h1 className={headingClass}>Sign in</h1>
          <p className="mt-5 text-sm text-muted" role="status">
            Checking your session...
          </p>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
