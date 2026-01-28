import { useState, useMemo } from "react";
import { format, subMonths, getMonth, getYear, setMonth, setYear } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface MonthYearFilterProps {
  selectedMonth: number;
  selectedYear: number;
  onMonthYearChange: (month: number, year: number) => void;
}

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const MonthYearFilter = ({ selectedMonth, selectedYear, onMonthYearChange }: MonthYearFilterProps) => {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(selectedYear);

  const currentDate = new Date();
  const currentMonth = getMonth(currentDate) + 1;
  const currentYear = getYear(currentDate);

  const handleMonthClick = (month: number) => {
    onMonthYearChange(month, viewYear);
    setOpen(false);
  };

  const handleQuickSelect = (monthsAgo: number) => {
    const date = subMonths(new Date(), monthsAgo);
    onMonthYearChange(getMonth(date) + 1, getYear(date));
    setOpen(false);
  };

  const getDisplayText = () => {
    const monthName = months[selectedMonth - 1];
    return `${monthName} ${selectedYear}`;
  };

  const isCurrentMonth = selectedMonth === currentMonth && selectedYear === currentYear;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-between gap-2 min-w-[180px] bg-card border-border hover:bg-muted/50",
            isCurrentMonth && "border-primary/50"
          )}
        >
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{getDisplayText()}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover" align="start">
        <div className="flex">
          {/* Quick select sidebar */}
          <div className="border-r border-border p-2 space-y-1 bg-muted/30 min-w-[120px]">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start text-sm h-8",
                isCurrentMonth && "bg-primary/10 text-primary"
              )}
              onClick={() => handleQuickSelect(0)}
            >
              Este mês
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={() => handleQuickSelect(1)}
            >
              Mês passado
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={() => handleQuickSelect(2)}
            >
              2 meses atrás
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm h-8"
              onClick={() => handleQuickSelect(3)}
            >
              3 meses atrás
            </Button>
          </div>
          
          {/* Month grid */}
          <div className="p-3 min-w-[280px]">
            {/* Year navigation */}
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewYear(viewYear - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="font-semibold">{viewYear}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewYear(viewYear + 1)}
                disabled={viewYear >= currentYear}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Months grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const monthNum = index + 1;
                const isSelected = monthNum === selectedMonth && viewYear === selectedYear;
                const isFuture = viewYear > currentYear || (viewYear === currentYear && monthNum > currentMonth);
                const isCurrent = monthNum === currentMonth && viewYear === currentYear;
                
                return (
                  <Button
                    key={month}
                    variant={isSelected ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "h-9 text-xs",
                      isSelected && "bg-primary text-primary-foreground",
                      isCurrent && !isSelected && "border border-primary/50",
                      isFuture && "opacity-40 cursor-not-allowed"
                    )}
                    disabled={isFuture}
                    onClick={() => handleMonthClick(monthNum)}
                  >
                    {month.substring(0, 3)}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default MonthYearFilter;
