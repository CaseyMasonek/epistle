import {
  Calendar,
  ChartBarIcon,
  Home,
  Inbox,
  LayoutDashboard,
  MailCheckIcon,
  MailIcon,
  MailQuestionMark,
  MailsIcon,
  Search,
  Section,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import clsx from "clsx";
import { usePathname } from "next/navigation";


// Menu items.
const items = [
  {
    title: "Primary",
    icon: Inbox,
    q: 'category:primary'
  },
  {
    title: "All Mail",
    icon: MailsIcon,
    q: 'in:anywhere'
  },
  {
    title: "Junk",
    icon: MailQuestionMark,
    q: 'in:spam'
  },
];

export function AppSidebar({ setQuery, query }: { setQuery: (params: any) => void; query: { page: string, search: string } | undefined }) {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-full flex items-center justify-center h-11">
          <h1 className="text-2xl">App Name</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            Main features
          </SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href="#">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </a>
              </SidebarMenuButton>
              <SidebarMenuButton asChild>
                <a href="#">
                  <ChartBarIcon />
                  <span>Analytics</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Inboxes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a onClick={() => setQuery({ ...query, page: item.q })} className={clsx(query?.page == item.q ? "bg-accent" : "")}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
