import type { ReactNode } from "react";

import { SidebarProvider } from "@/components/ui/sidebar";

import { DocsSidebar } from "./components/docs-sidebar";

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider className="min-h-[calc(100svh-4rem)] font-body">
      <div className="mx-auto flex w-full max-w-6xl px-6">
        <DocsSidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </SidebarProvider>
  );
}
