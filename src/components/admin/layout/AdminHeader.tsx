import { format, getMonth, getYear, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Menu, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { AdminView, DateRange } from "@/types/crm";
import MonthYearFilter from "../dashboard/MonthYearFilter";

interface AdminHeaderProps {
  activeView: AdminView;
  userName?: string;
  dateRange?: DateRange;
  onDateRangeChange?: (range: DateRange) => void;
  selectedMonth?: number;
  selectedYear?: number;
  onMonthYearChange?: (month: number, year: number) => void;
  actions?: React.ReactNode;
}

const VIEW_TITLES: Record<AdminView, { title: string; subtitle: string }> = {
  dashboard: {
    title: "Dashboard",
    subtitle: "Acompanhe os principais indicadores de performance.",
  },
  pipeline: {
    title: "Pipeline de Vendas",
    subtitle: "Gerencie o funil de vendas da sua equipe.",
  },
  leads: {
    title: "Leads",
    subtitle: "Visualize e gerencie todos os leads.",
  },
  meetings: {
    title: "Reuniões",
    subtitle: "Calendário de reuniões e agendamentos.",
  },
  followups: {
    title: "Follow-ups",
    subtitle: "Acompanhe os follow-ups agendados.",
  },
  team: {
    title: "Equipe",
    subtitle: "Gerencie os membros da sua equipe.",
  },
  goals: {
    title: "Metas",
    subtitle: "Defina e acompanhe metas mensais.",
  },
  reports: {
    title: "Relatórios",
    subtitle: "Analise o desempenho em detalhes.",
  },
  settings: {
    title: "Configurações",
    subtitle: "Gerencie seu perfil e preferências.",
  },
};

const QUICK_FILTERS = [
  { label: "Hoje", days: 0 },
  { label: "7 dias", days: 7 },
  { label: "30 dias", days: 30 },
];

const AdminHeader = ({
  activeView,
  userName,
  dateRange,
  onDateRangeChange,
  selectedMonth,
  selectedYear,
  onMonthYearChange,
  actions,
}: AdminHeaderProps) => {
  const viewConfig = VIEW_TITLES[activeView];
  const greeting = userName ? `Olá, ${userName.split(" ")[0]}!` : "Olá!";
  const showGreeting = activeView === "dashboard";

  const currentMonth = selectedMonth || getMonth(new Date()) + 1;
  const currentYear = selectedYear || getYear(new Date());

  const handleQuickFilter = (days: number) => {
    if (!onDateRangeChange) return;
    
    if (days === 0) {
      const today = new Date();
      onDateRangeChange({ from: today, to: today });
    } else {
      const to = new Date();
      const from = new Date();
      from.setDate(from.getDate() - days);
      onDateRangeChange({ from, to });
    }
  };

  const isQuickFilterActive = (days: number) => {
    if (!dateRange?.from || !dateRange?.to) return false;
    
    const today = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    
    const fromMatch = format(dateRange.from, "yyyy-MM-dd") === format(from, "yyyy-MM-dd");
    const toMatch = format(dateRange.to, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    
    if (days === 0) {
      return format(dateRange.from, "yyyy-MM-dd") === format(today, "yyyy-MM-dd") &&
             format(dateRange.to, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");
    }
    
    return fromMatch && toMatch;
  };

  const handleMonthChange = (month: number, year: number) => {
    if (onMonthYearChange) {
      onMonthYearChange(month, year);
    }
    // Also update the date range to match the selected month
    if (onDateRangeChange) {
      const monthDate = new Date(year, month - 1, 1);
      onDateRangeChange({
        from: startOfMonth(monthDate),
        to: endOfMonth(monthDate),
      });
    }
  };

  return (
    <header className="sticky top-0 z-10 py-4 px-4 md:px-8 bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="md:hidden">
            <Menu className="w-5 h-5" />
          </SidebarTrigger>
          
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              {showGreeting ? greeting : viewConfig.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {viewConfig.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Month/Year filter for dashboard and goals */}
          {(activeView === "dashboard" || activeView === "goals") && onMonthYearChange && (
            <div className="hidden md:block">
              <MonthYearFilter
                selectedMonth={currentMonth}
                selectedYear={currentYear}
                onMonthYearChange={handleMonthChange}
              />
            </div>
          )}

          {/* Quick date filters for dashboard */}
          {activeView === "dashboard" && onDateRangeChange && (
            <div className="hidden lg:flex items-center gap-1 bg-muted/50 p-1 rounded-lg">
              {QUICK_FILTERS.map((filter) => (
                <Button
                  key={filter.days}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQuickFilter(filter.days)}
                  className={cn(
                    "h-8 px-3 text-sm font-medium transition-all",
                    isQuickFilterActive(filter.days)
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
          )}

          {/* Additional actions */}
          {actions}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
