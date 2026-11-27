import type { Role } from "@prisma/client";

export interface NavItem {
  href: string;
  label: string;
  /** If omitted, every signed-in role sees the link. */
  roles?: readonly Role[];
}

const NAV_ITEMS: readonly NavItem[] = [
  { href: "/cases", label: "Cases" },
  { href: "/coordinator", label: "Chase queue", roles: ["COORDINATOR"] },
  { href: "/dashboard", label: "Dashboard", roles: ["COORDINATOR"] },
  { href: "/profile", label: "Profile" },
];

export function getNavItems(role: Role): NavItem[] {
  return NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(role));
}
