"use client";

import { usePathname } from "next/navigation";
import HeaderAuth from "./header-auth";

export default function HeaderRight() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  if (isHome) return <HeaderAuth />;

  return <div className="min-w-[140px]" />;
}