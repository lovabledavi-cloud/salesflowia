import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarClock,
  Settings,
  LogOut,
  BarChart3,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  onSignOut: () => void;
  userEmail?: string;
  activeView: "dashboard" | "table" | "kanban" | "followups";
  onViewChange: (view: "dashboard" | "table" | "kanban" | "followups") => void;
  pendingFollowups?: number;
}

const AdminSidebar = ({
  onSignOut,
  userEmail,
  activeView,
  onViewChange,
  pendingFollowups = 0,
}: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    {
      id: "dashboard" as const,
      label: "Dashboard",
      icon: BarChart3,
    },
    {
      id: "table" as const,
      label: "Leads",
      icon: Users,
    },
    {
      id: "kanban" as const,
      label: "Kanban",
      icon: Kanban,
    },
    {
      id: "followups" as const,
      label: "Follow-ups",
      icon: CalendarClock,
      badge: pendingFollowups > 0 ? pendingFollowups : undefined,
    },
  ];

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <Logo size="sm" />}
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={activeView === item.id}
                    onClick={() => onViewChange(item.id)}
                    tooltip={item.label}
                    className={cn(
                      "transition-colors",
                      activeView === item.id && "bg-primary/10 text-primary border-l-2 border-primary"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {!isCollapsed && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {!isCollapsed && item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        {!isCollapsed && userEmail && (
          <p className="text-xs text-muted-foreground truncate mb-2">
            {userEmail}
          </p>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
