import {
  Users,
  CalendarClock,
  LogOut,
  BarChart3,
  Target,
  FileBarChart,
  GitBranch,
  UserCircle,
  CalendarCheck,
  Settings,
  ChevronsLeft,
  ChevronsRight,
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
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Logo from "@/components/Logo";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AdminView, AppRole, ROLE_CONFIG } from "@/types/crm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface AdminSidebarProps {
  onSignOut: () => void;
  userEmail?: string;
  userName?: string;
  userAvatar?: string;
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  pendingFollowups?: number;
  pendingMeetings?: number;
  userRole?: AppRole | null;
  isAdmin?: boolean;
  isManager?: boolean;
  isSdr?: boolean;
  isCloser?: boolean;
}

interface MenuItem {
  id: AdminView;
  label: string;
  icon: typeof BarChart3;
  hasBadge?: boolean;
  hasMeetingBadge?: boolean;
  // Role-based visibility
  visibleFor?: AppRole[];
}

interface MenuGroup {
  label: string;
  items: MenuItem[];
}

// Full menu structure with role visibility
const allMenuGroups: MenuGroup[] = [
  {
    label: "VISÃO GERAL",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: BarChart3,
      },
      {
        id: "reports",
        label: "Relatórios",
        icon: FileBarChart,
        visibleFor: ["admin", "manager"],
      },
    ],
  },
  {
    label: "GESTÃO",
    items: [
      {
        id: "pipeline",
        label: "Pipeline",
        icon: GitBranch,
        visibleFor: ["admin", "manager", "sdr", "closer"],
      },
      {
        id: "leads",
        label: "Leads",
        icon: Users,
        visibleFor: ["admin", "manager", "sdr"],
      },
      {
        id: "meetings",
        label: "Reuniões",
        icon: CalendarCheck,
        hasMeetingBadge: true,
      },
      {
        id: "followups",
        label: "Follow-ups",
        icon: CalendarClock,
        hasBadge: true,
        visibleFor: ["admin", "manager", "sdr"],
      },
    ],
  },
  {
    label: "EQUIPE",
    items: [
      {
        id: "team",
        label: "Time",
        icon: UserCircle,
        visibleFor: ["admin", "manager"],
      },
      {
        id: "goals",
        label: "Metas",
        icon: Target,
      },
    ],
  },
  {
    label: "CONTA",
    items: [
      {
        id: "settings",
        label: "Configurações",
        icon: Settings,
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
  userRole,
  isAdmin = false,
  isManager = false,
  isSdr = false,
  isCloser = false,
}: AdminSidebarProps) => {
  const { state, toggleSidebar } = useSidebar();
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

  // Filter menu items based on user role
  const getFilteredMenuGroups = (): MenuGroup[] => {
    // Admin and Manager see everything
    if (isAdmin || isManager) {
      return allMenuGroups;
    }

    return allMenuGroups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => {
          // If no visibility restriction, everyone can see
          if (!item.visibleFor) return true;
          // Check if user has any of the allowed roles
          if (isSdr && item.visibleFor.includes("sdr")) return true;
          if (isCloser && item.visibleFor.includes("closer")) return true;
          return false;
        }),
      }))
      .filter((group) => group.items.length > 0);
  };

  const filteredMenuGroups = getFilteredMenuGroups();

  // Get display role
  const getDisplayRole = () => {
    if (isAdmin) return "admin";
    if (isManager) return "manager";
    if (isSdr) return "sdr";
    if (isCloser) return "closer";
    return null;
  };

  const displayRole = getDisplayRole();

  return (
    <Sidebar collapsible="icon" className="border-r border-border bg-sidebar">
      <SidebarHeader className="p-4">
        <div className="flex items-center justify-between gap-2">
          {!isCollapsed && <Logo size="sm" />}
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-9 w-9"
                  title={isCollapsed ? "Expandir menu" : "Recolher menu"}
                >
                  {isCollapsed ? (
                    <ChevronsRight className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronsLeft className="h-5 w-5 text-muted-foreground" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {isCollapsed ? "Expandir menu (Ctrl+B)" : "Recolher menu (Ctrl+B)"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2">
        {filteredMenuGroups.map((group, groupIndex) => (
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
                  const showMeetingBadge = item.hasMeetingBadge && pendingMeetings > 0;

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
                        {!isCollapsed && showMeetingBadge && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-medium text-primary-foreground">
                            {pendingMeetings > 9 ? "9+" : pendingMeetings}
                          </span>
                        )}
                        {isCollapsed && showBadge && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                            {pendingFollowups > 9 ? "9+" : pendingFollowups}
                          </span>
                        )}
                        {isCollapsed && showMeetingBadge && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {pendingMeetings > 9 ? "9+" : pendingMeetings}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
            {groupIndex < filteredMenuGroups.length - 1 && <SidebarSeparator className="my-2" />}
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
                {displayRole && (
                  <Badge 
                    variant="secondary" 
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      ROLE_CONFIG[displayRole].color,
                      "text-white"
                    )}
                  >
                    {ROLE_CONFIG[displayRole].label}
                  </Badge>
                )}
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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

      <SidebarRail />
    </Sidebar>
  );
};

export default AdminSidebar;