import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { logout } from "@/lib/actions/auth";
import ProfileForm from "@/components/ProfileForm";
import { prisma } from "@/lib/prisma";
import type { Role } from "@/lib/types";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold text-[#1F2933]">Profile</h1>
      <p className="mb-6 text-[#6B7280]">
        View and update your name and organization contact details.
      </p>
      <ProfileForm
        name={user.name}
        email={user.email}
        role={user.role as Role}
        org={user.org}
      />
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
