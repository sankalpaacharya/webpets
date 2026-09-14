"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { DOCS_NAV } from "../nav";

/**
 * On desktop the sidebar is a sticky column inside the page container so it
 * lines up with the navbar. On mobile it becomes the off-canvas sheet.
 */
export function DocsSidebar() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  return (
    <Sidebar
      collapsible={isMobile ? "offcanvas" : "none"}
      className={
        isMobile
          ? "top-16 h-[calc(100svh-4rem)]"
          : "sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 border-r border-border md:flex"
      }
    >
      <SidebarContent className="gap-2 py-6 md:pr-4">
        {DOCS_NAV.map((group) => (
          <SidebarGroup key={group.label} className="px-0">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={pathname === item.href}>
                      <Link href={item.href}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
