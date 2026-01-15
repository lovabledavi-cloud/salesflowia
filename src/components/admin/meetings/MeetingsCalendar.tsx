import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  isToday,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  Phone,
  MapPin,
  Clock,
  User,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Lead, TeamMember } from "@/types/crm";

interface MeetingsCalendarProps {
  leads: Lead[];
  teamMembers: TeamMember[];
  onSelectMeeting: (lead: Lead) => void;
  onMarkCompleted: (leadId: string, completed: boolean) => void;
  onMarkNoShow: (leadId: string, noShow: boolean) => void;
}

const MeetingsCalendar = ({
  leads,
  teamMembers,
  onSelectMeeting,
  onMarkCompleted,
  onMarkNoShow,
}: MeetingsCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const meetingsWithDates = useMemo(() => {
    return leads.filter((l) => l.meeting_scheduled && l.meeting_date);
  }, [leads]);

  const getMeetingsForDay = (day: Date) => {
    return meetingsWithDates.filter((m) =>
      isSameDay(new Date(m.meeting_date!), day)
    );
  };

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const getTeamMember = (id: string | null) => {
    if (!id) return null;
    return teamMembers.find((m) => m.id === id) || null;
  };

  const getMeetingTypeIcon = (lead: Lead) => {
    // Default to video if no specific type stored
    return <Video className="h-3 w-3" />;
  };

  const getMeetingStatusColor = (lead: Lead) => {
    if (lead.no_show) return "bg-destructive/20 text-destructive border-destructive/30";
    if (lead.meeting_completed) return "bg-emerald/20 text-emerald border-emerald/30";
    return "bg-blue-500/20 text-blue-500 border-blue-500/30";
  };

  // Stats
  const stats = useMemo(() => {
    const thisMonth = meetingsWithDates.filter((m) =>
      isSameMonth(new Date(m.meeting_date!), currentMonth)
    );
    return {
      total: thisMonth.length,
      completed: thisMonth.filter((m) => m.meeting_completed).length,
      noShow: thisMonth.filter((m) => m.no_show).length,
      pending: thisMonth.filter((m) => !m.meeting_completed && !m.no_show).length,
    };
  }, [meetingsWithDates, currentMonth]);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CalendarIcon className="h-4 w-4 text-blue-500" />
            <span className="text-sm text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-muted-foreground">Pendentes</span>
          </div>
          <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-emerald" />
            <span className="text-sm text-muted-foreground">Realizadas</span>
          </div>
          <p className="text-2xl font-bold text-emerald">{stats.completed}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card border border-border rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-muted-foreground">No-Show</span>
          </div>
          <p className="text-2xl font-bold text-destructive">{stats.noShow}</p>
        </motion.div>
      </div>

      {/* Calendar */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
          </h2>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Week days header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayMeetings = getMeetingsForDay(day);
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <div
                key={index}
                className={`min-h-[100px] border-b border-r border-border p-1 ${
                  !isCurrentMonth ? "bg-muted/30" : ""
                } ${isToday(day) ? "bg-primary/5" : ""}`}
              >
                <div
                  className={`text-xs font-medium mb-1 p-1 ${
                    isToday(day)
                      ? "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                      : isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {format(day, "d")}
                </div>

                <div className="space-y-1">
                  {dayMeetings.slice(0, 3).map((meeting) => {
                    const teamMember = getTeamMember(meeting.assigned_to);
                    return (
                      <TooltipProvider key={meeting.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => onSelectMeeting(meeting)}
                              className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded border truncate flex items-center gap-1 ${getMeetingStatusColor(
                                meeting
                              )}`}
                            >
                              {getMeetingTypeIcon(meeting)}
                              <span className="truncate">{meeting.name}</span>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-[200px]">
                            <div className="space-y-1">
                              <p className="font-medium">{meeting.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(meeting.meeting_date!), "HH:mm", {
                                  locale: ptBR,
                                })}
                              </p>
                              {teamMember && (
                                <p className="text-xs flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {teamMember.name}
                                </p>
                              )}
                              {meeting.no_show && (
                                <Badge variant="destructive" className="text-[10px]">
                                  No-Show
                                </Badge>
                              )}
                              {meeting.meeting_completed && (
                                <Badge className="bg-emerald text-white text-[10px]">
                                  Realizada
                                </Badge>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    );
                  })}
                  {dayMeetings.length > 3 && (
                    <p className="text-[10px] text-muted-foreground text-center">
                      +{dayMeetings.length - 3} mais
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MeetingsCalendar;
