import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Profile from "@/components/Profile";
import ProfileForm from "@/components/ProfileForm";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/profile";

export const metadata: Metadata = { title: "Profile · CareLoop Tracker" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const profile = await getProfile(session.user.id);
  if (!profile) redirect("/login"); // account was deleted

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <section aria-labelledby="profile-heading" className="space-y-4">
        <h1 id="profile-heading" className="text-2xl font-semibold">
          Your profile
        </h1>
        <Profile profile={profile} />
      </section>

      <section aria-labelledby="edit-heading" className="space-y-4">
        <h2 id="edit-heading" className="text-2xl font-semibold">
          Edit details
        </h2>
        <p className="text-sm text-muted">
          Email and role can&apos;t be changed here.
        </p>
        <ProfileForm profile={profile} />
      </section>
    </div>
  );
}
