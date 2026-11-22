"use client";

import { ReactNode } from "react";
import { AdminDataProvider } from "@/lib/admin-data";

export function AdminProviders({ children }: { children: ReactNode }) {
  return <AdminDataProvider>{children}</AdminDataProvider>;
}