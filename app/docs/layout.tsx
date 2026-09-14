import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { DocsSidebar } from "./components/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] font-body">
      <DocsSidebar />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </SidebarProvider>
  );
}
