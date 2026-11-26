import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-[#1F2933]">Profile</h1>
      <dl className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Name</dt>
          <dd className="text-lg text-[#1F2933]">{session.user.name}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Email</dt>
          <dd className="text-lg text-[#1F2933]">{session.user.email}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Role</dt>
          <dd className="text-lg text-[#1F2933]">{session.user.role}</dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-[#6B7280]">Organization</dt>
          <dd className="text-lg text-[#1F2933]">
            {session.user.org || "Not set"}
          </dd>
        </div>
      </dl>
      <p className="mt-4 text-sm text-[#6B7280]">
        Profile edit form lands in Week 04/05 with Chawanangwa&apos;s UI work.
      </p>
      <form action={logout} className="mt-6">
        <button
          type="submit"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-[#1F2933] hover:bg-slate-50"
        >
          Sign out
        </button>
      </form>
    </main>
  );
}
