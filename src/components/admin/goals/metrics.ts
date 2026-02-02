import { AppRole, Lead } from "@/types/crm";

export interface CompanyActualMetrics {
  totalLeads: number;
  contactedLeads: number;
  convertedLeads: number;
  revenue: number;
  meetings: number;
}

export interface MemberGoalMetrics {
  leads: number;
  contacts: number;
  conversions: number;
  revenue: number;
  meetings: number;
  meetingsCompleted: number;
  noShows: number;
}

const isSameMonthYear = (
  dateStr: string | null | undefined,
  month: number,
  year: number
) => {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return d.getMonth() + 1 === month && d.getFullYear() === year;
};

const getContactDate = (lead: Lead) => lead.contacted_at ?? lead.last_contact_date;

const isWon = (lead: Lead) =>
  lead.pipeline_stage === "ganho" || lead.status === "convertido";

const hasAnyActivityInPeriod = (lead: Lead, month: number, year: number) => {
  return (
    isSameMonthYear(lead.created_at, month, year) ||
    isSameMonthYear(getContactDate(lead), month, year) ||
    isSameMonthYear(lead.meeting_date, month, year) ||
    isSameMonthYear(lead.closed_at, month, year)
  );
};

export const getCompanyActualMetricsForPeriod = (
  leads: Lead[],
  month: number,
  year: number
): CompanyActualMetrics => {
  const createdInPeriod = leads.filter((l) => isSameMonthYear(l.created_at, month, year));

  const contactedInPeriod = leads.filter((l) => {
    const contactDate = getContactDate(l);
    return !!contactDate && isSameMonthYear(contactDate, month, year);
  });

  const meetingsInPeriod = leads.filter((l) => {
    if (!l.meeting_scheduled) return false;
    // Prefer meeting_date; fallback to created_at when meeting_date isn't set.
    return isSameMonthYear(l.meeting_date ?? l.created_at, month, year);
  });

  const wonClosedInPeriod = leads.filter(
    (l) => isWon(l) && isSameMonthYear(l.closed_at, month, year)
  );

  const revenue = wonClosedInPeriod.reduce((acc, l) => acc + (l.value || 0), 0);

  return {
    totalLeads: createdInPeriod.length,
    contactedLeads: contactedInPeriod.length,
    meetings: meetingsInPeriod.length,
    convertedLeads: wonClosedInPeriod.length,
    revenue,
  };
};

export const getMemberMetricsForPeriod = (
  leads: Lead[],
  memberId: string,
  role: AppRole,
  month: number,
  year: number
): MemberGoalMetrics => {
  if (role === "sdr") {
    const leadsCreated = leads.filter(
      (l) => l.created_by === memberId && isSameMonthYear(l.created_at, month, year)
    ).length;

    const leadsContacted = leads.filter((l) => {
      if (l.contacted_by !== memberId) return false;
      const contactDate = getContactDate(l);
      return !!contactDate && isSameMonthYear(contactDate, month, year);
    }).length;

    const meetingsScheduled = leads.filter((l) => {
      if (l.meeting_scheduled_by !== memberId || !l.meeting_scheduled) return false;
      return isSameMonthYear(l.meeting_date ?? l.created_at, month, year);
    }).length;

    return {
      leads: leadsCreated,
      contacts: leadsContacted,
      conversions: 0,
      revenue: 0,
      meetings: meetingsScheduled,
      meetingsCompleted: 0,
      noShows: 0,
    };
  }

  if (role === "closer") {
    const assignedLeads = leads.filter((l) => l.assigned_to === memberId);
    const assignedActiveInPeriod = assignedLeads.filter((l) => hasAnyActivityInPeriod(l, month, year));

    const contacts = assignedLeads.filter((l) => {
      const contactDate = getContactDate(l);
      return !!contactDate && isSameMonthYear(contactDate, month, year);
    }).length;

    const meetings = assignedLeads.filter(
      (l) => l.meeting_scheduled && isSameMonthYear(l.meeting_date, month, year)
    ).length;

    const meetingsCompleted = assignedLeads.filter(
      (l) => l.meeting_completed && isSameMonthYear(l.meeting_date, month, year)
    ).length;

    const noShows = assignedLeads.filter(
      (l) => l.no_show && isSameMonthYear(l.meeting_date, month, year)
    ).length;

    const wonByMember = leads.filter(
      (l) => l.closed_by === memberId && isWon(l) && isSameMonthYear(l.closed_at, month, year)
    );

    return {
      leads: assignedActiveInPeriod.length,
      contacts,
      conversions: wonByMember.length,
      revenue: wonByMember.reduce((acc, l) => acc + (l.value || 0), 0),
      meetings,
      meetingsCompleted,
      noShows,
    };
  }

  // Manager/Admin view for a specific member (based on assigned_to)
  const memberLeads = leads.filter((l) => l.assigned_to === memberId);
  const leadsInPeriod = memberLeads.filter((l) => hasAnyActivityInPeriod(l, month, year));
  const contacts = memberLeads.filter((l) => {
    const contactDate = getContactDate(l);
    return !!contactDate && isSameMonthYear(contactDate, month, year);
  }).length;
  const wonInPeriod = memberLeads.filter(
    (l) => isWon(l) && isSameMonthYear(l.closed_at, month, year)
  );

  return {
    leads: leadsInPeriod.length,
    contacts,
    conversions: wonInPeriod.length,
    revenue: wonInPeriod.reduce((acc, l) => acc + (l.value || 0), 0),
    meetings: memberLeads.filter(
      (l) => l.meeting_scheduled && isSameMonthYear(l.meeting_date, month, year)
    ).length,
    meetingsCompleted: memberLeads.filter(
      (l) => l.meeting_completed && isSameMonthYear(l.meeting_date, month, year)
    ).length,
    noShows: memberLeads.filter((l) => l.no_show && isSameMonthYear(l.meeting_date, month, year)).length,
  };
};
