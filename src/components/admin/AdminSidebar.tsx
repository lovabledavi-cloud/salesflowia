import {
  LayoutDashboard,
  Users,
  Kanban,
  CalendarClock,
  LogOut,
  BarChart3,
  Target,
  FileBarChart,
  GitBranch,
  UserCircle,
  CalendarCheck,
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
import { AdminView } from "@/types/crm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface AdminSidebarProps {
  onSignOut: () => void;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  pendingFollowups?: number;
  pendingMeetings?: number;
}

const menuGroups = [
  {
    label: "VISÃO GERAL",
    items: [
      {
        id: "dashboard" as AdminView,
        label: "Dashboard",
        icon: BarChart3,
      },
      {
        id: "reports" as AdminView,
        label: "Relatórios",
        icon: FileBarChart,
      },
    ],
  },
  {
    label: "GESTÃO",
    items: [
      {
        id: "pipeline" as AdminView,
        label: "Pipeline",
        icon: GitBranch,
      },
      {
        id: "leads" as AdminView,
        label: "Leads",
        icon: Users,
      },
      {
        id: "kanban" as AdminView,
        label: "Kanban",
        icon: Kanban,
      },
      {
        id: "meetings" as AdminView,
        label: "Reuniões",
        icon: CalendarCheck,
        hasMeetingBadge: true,
      },
      {
        id: "followups" as AdminView,
        label: "Follow-ups",
        icon: CalendarClock,
        hasBadge: true,
      },
    ],
  },
  {
    label: "EQUIPE",
    items: [
      {
        id: "team" as AdminView,
        label: "Time",
        icon: UserCircle,
      },
      {
        id: "goals" as AdminView,
        label: "Metas",
        icon: Target,
      },
    ],
  },
];

const AdminSidebar = ({
  onSignOut,
  userEmail,
  userName,
  userAvatar,
  activeView,
  onViewChange,
  pendingFollowups = 0,
  pendingMeetings = 0,
}: AdminSidebarProps) => {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  return (
    <Sidebar className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && <Logo size="sm" />}
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {menuGroups.map((group, groupIndex) => (
          <SidebarGroup key={group.label}>
            {!isCollapsed && (
              <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground tracking-wider px-2">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = activeView === item.id;
                  const showBadge = item.hasBadge && pendingFollowups > 0;

                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        isActive={isActive}
                        onClick={() => onViewChange(item.id)}
                        tooltip={item.label}
                        className={cn(
                          "relative transition-all duration-200 rounded-lg",
                          isActive
                            ? "bg-primary/10 text-primary font-medium before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-1 before:rounded-r-full before:bg-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4", isActive && "text-primary")} />
                        {!isCollapsed && (
                          <span className="flex-1">{item.label}</span>
                        )}
                        {!isCollapsed && showBadge && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1.5 text-xs font-medium text-destructive-foreground">
                            {pendingFollowups > 9 ? "9+" : pendingFollowups}
                          </span>
                        )}
                        {isCollapsed && showBadge && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                            {pendingFollowups > 9 ? "9+" : pendingFollowups}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < menuGroups.length - 1 && <SidebarSeparator className="my-2" />}
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
        {/* User Info */}
        <div className={cn(
          "flex items-center gap-3 mb-3 p-2 rounded-lg bg-muted/30",
          isCollapsed && "justify-center p-1"
        )}>
          <Avatar className={cn("h-9 w-9", isCollapsed && "h-8 w-8")}>
            <AvatarImage src={userAvatar} alt={userName || userEmail} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
              {getInitials(userName, userEmail)}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              {userName && (
                <p className="text-sm font-medium text-foreground truncate">
                  {userName}
                </p>
              )}
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">CONECTADO</span>
              </div>
            </div>
          )}
        </div>

        {/* Sign out button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onSignOut}
          className={cn(
            "w-full gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10",
            isCollapsed ? "justify-center px-2" : "justify-start"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Sair</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
