import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { isToday, isPast, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useFollowupNotifications = () => {
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador não suporta notificações');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }, []);

  const showNotification = useCallback((title: string, body: string, tag?: string) => {
    if (Notification.permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/favicon.png',
        badge: '/favicon.png',
        tag: tag || 'followup',
        requireInteraction: true,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  }, []);

  const checkFollowups = useCallback(async () => {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*')
      .not('next_followup_date', 'is', null)
      .in('status', ['novo', 'contactado']);

    if (error) {
      console.error('Erro ao buscar follow-ups:', error);
      return;
    }

    const now = new Date();
    let overdueCount = 0;
    let todayCount = 0;

    leads?.forEach((lead) => {
      if (lead.next_followup_date) {
        const followupDate = parseISO(lead.next_followup_date);
        
        if (isPast(followupDate) && !isToday(followupDate)) {
          overdueCount++;
        } else if (isToday(followupDate)) {
          todayCount++;
        }
      }
    });

    if (overdueCount > 0) {
      showNotification(
        '⚠️ Follow-ups Atrasados',
        `Você tem ${overdueCount} follow-up${overdueCount > 1 ? 's' : ''} atrasado${overdueCount > 1 ? 's' : ''}!`,
        'overdue-followups'
      );
    }

    if (todayCount > 0 && overdueCount === 0) {
      showNotification(
        '📅 Follow-ups de Hoje',
        `Você tem ${todayCount} follow-up${todayCount > 1 ? 's' : ''} agendado${todayCount > 1 ? 's' : ''} para hoje.`,
        'today-followups'
      );
    }
  }, [showNotification]);

  const scheduleCheck = useCallback(() => {
    // Check every 30 minutes
    const interval = setInterval(checkFollowups, 30 * 60 * 1000);
    
    // Initial check after 5 seconds
    setTimeout(checkFollowups, 5000);

    return () => clearInterval(interval);
  }, [checkFollowups]);

  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      if (granted) {
        return scheduleCheck();
      }
    });
  }, [requestNotificationPermission, scheduleCheck]);

  return {
    requestNotificationPermission,
    showNotification,
    checkFollowups,
  };
};
