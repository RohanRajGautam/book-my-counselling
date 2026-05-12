"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  UserRound,
  WalletCards,
  Plus,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const mentorNavItems = [
  {
    icon: LayoutDashboard,
    href: "/mentor",
    label: "Dashboard",
  },
  {
    icon: CalendarDays,
    href: "/mentor/my-sessions",
    label: "My Sessions",
  },
  {
    icon: UserRound,
    href: "/mentor/profile-setting",
    label: "Profile Settings",
  },
  {
    icon: WalletCards,
    href: "/mentor/my-earnings",
    label: "Earnings",
  },
];

export function MentorSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar
      className="border-r border-gray-100 bg-white"
      style={{ "--sidebar-width": "180px" } as React.CSSProperties}
    >
      {/* Header */}
      <SidebarHeader className="px-5 pt-6 pb-4 border-none">
        <div>
          <p className="text-[13.5px] font-bold text-gray-900 leading-tight">
            Book My Counselling
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Expert Mentor Panel
          </p>
        </div>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-3 py-1">
        <SidebarMenu className="space-y-0.5">
          {mentorNavItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/mentor"
                ? pathname === "/mentor"
                : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={isActive}
                  className={cn(
                    "h-9 rounded-lg px-3 text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-[#EEF0FD] text-[#3B4DD4] hover:bg-[#EEF0FD] hover:text-[#3B4DD4]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-2.5">
                    <Icon
                      size={16}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      className={cn(
                        isActive ? "text-[#3B4DD4]" : "text-gray-400"
                      )}
                    />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="px-3 pb-6 space-y-1 border-none">
        {/* New Session Button */}
        <Link
          href="/mentor/new-session"
          className="flex items-center justify-center gap-2 w-full rounded-xl bg-[#3B4DD4] hover:bg-[#3342C0] active:scale-[0.98] text-white text-[13px] font-semibold py-[10px] transition-colors mb-2"
        >
          <Plus size={15} strokeWidth={2.5} />
          New Session
        </Link>

        <SidebarMenu className="space-y-0.5">
          {/* Help Center */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 rounded-lg px-3 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
            >
              <Link href="/mentor/help" className="flex items-center gap-2.5">
                <HelpCircle size={16} strokeWidth={1.8} className="text-gray-400" />
                <span>Help Center</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* Logout */}
          <SidebarMenuItem>
            <SidebarMenuButton
              className="h-9 rounded-lg px-3 text-[13px] font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors cursor-pointer"
              onClick={() => {
                // handle logout here
              }}
            >
              <div className="flex items-center gap-2.5">
                <LogOut size={16} strokeWidth={1.8} className="text-gray-400" />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
