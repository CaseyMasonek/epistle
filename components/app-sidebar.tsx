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


// Menu items.
const items = [
  {
    title: "Primary",
    url: "#",
    icon: Inbox,
  },
  {
    title: "All Mail",
    url: "#",
    icon: MailsIcon,
  },
  {
    title: "Junk",
    url: "#",
    icon: MailQuestionMark,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="w-full flex items-center justify-center h-11">
          <h1 className="text-2xl">Eloquent</h1>
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
                    <a href={item.url}>
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
