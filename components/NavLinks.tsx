"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const publicLinks = [{ href: "/", label: "Home" }];

const protectedLinks = [
  { href: "/cases", label: "Cases" },
  { href: "/profile", label: "Profile" },
];

export default function NavLinks({ isLoggedIn }: { isLoggedIn: boolean }) {
  const pathname = usePathname();
  const links = isLoggedIn
    ? [...publicLinks, ...protectedLinks]
    : publicLinks;

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap gap-2 text-sm">
        {links.map((link) => {
          const isActive =
            link.href === "/"
              ? pathname === "/"
              : pathname === link.href || pathname.startsWith(`${link.href}/`);

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-md px-3 py-1.5 font-medium ${
                  isActive
                    ? "bg-white text-[#0F6B6B]"
                    : "text-white/90 hover:bg-white/15"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
