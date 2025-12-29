import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LeadStatus } from "@/components/admin/LeadStatusBadge";

interface Lead {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  status: LeadStatus;
  notes: string | null;
  created_at: string;
  next_followup_date: string | null;
  followup_notes: string | null;
  last_contact_date: string | null;
}

interface UseRealtimeLeadsProps {
  onNewLead: (lead: Lead) => void;
  onUpdateLead: (lead: Lead) => void;
  onDeleteLead: (leadId: string) => void;
  enabled?: boolean;
}

export const useRealtimeLeads = ({
  onNewLead,
  onUpdateLead,
  onDeleteLead,
  enabled = true,
}: UseRealtimeLeadsProps) => {
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(
        "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2teleRT0jOXkooJaQYGU08Oys3JhPT+O1OK1gkw8daHU3K+BUDhIl8nLrH9fT2uNxdG4hFpOaZ7R3bWMYE9nlcLOvqB8XF2AucfGsaWCcG9phau3srColIB6dnRycXNxcXFvb21raWdlY2FfXVtZV1VTUVBOTEpIR0VDQkA+PTw6OTc2NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQA="
      );
    }
    audioRef.current.play().catch(() => {
      // Ignore autoplay errors
    });
  }, []);

  useEffect(() => {
    if (!enabled) return;

    console.log("Setting up realtime subscription for leads...");

    const channel = supabase
      .channel("leads-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("New lead received:", payload);
          const newLead = payload.new as Lead;
          
          onNewLead(newLead);
          playNotificationSound();
          
          toast({
            title: "🎉 Novo Lead!",
            description: `${newLead.name} acabou de se cadastrar.`,
            duration: 5000,
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("Lead updated:", payload);
          onUpdateLead(payload.new as Lead);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "leads",
        },
        (payload) => {
          console.log("Lead deleted:", payload);
          onDeleteLead(payload.old.id);
        }
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
      });

    return () => {
      console.log("Cleaning up realtime subscription...");
      supabase.removeChannel(channel);
    };
  }, [enabled, onNewLead, onUpdateLead, onDeleteLead, toast, playNotificationSound]);
};

export default useRealtimeLeads;
