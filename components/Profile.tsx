import { ROLE_LABELS } from "@/lib/roles";
import type { ProfileDTO } from "@/lib/types";

interface ProfileProps {
  profile: ProfileDTO;
}

export default function Profile({ profile }: ProfileProps) {
  const joined = new Date(profile.createdAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const rows: { label: string; value: string }[] = [
    { label: "Name", value: profile.name },
    { label: "Email", value: profile.email },
    { label: "Role", value: ROLE_LABELS[profile.role] },
    { label: "Organisation", value: profile.org ?? "Not set" },
    { label: "Member since", value: joined },
  ];

  return (
    <dl className="divide-y divide-black/10 border-y border-black/10">
      {rows.map((row) => (
        <div key={row.label} className="grid grid-cols-3 gap-4 py-3">
          <dt className="text-sm text-muted">{row.label}</dt>
          <dd className="col-span-2 text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
