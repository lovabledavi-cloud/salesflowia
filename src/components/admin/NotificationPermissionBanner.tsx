import { useState, useEffect } from 'react';
import { Bell, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationPermissionBannerProps {
  onRequestPermission: () => Promise<boolean>;
}

export const NotificationPermissionBanner = ({ 
  onRequestPermission 
}: NotificationPermissionBannerProps) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      // Show banner after 3 seconds
      const timeout = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(timeout);
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    const granted = await onRequestPermission();
    setLoading(false);
    if (granted) {
      setShow(false);
    }
  };

  const handleDismiss = () => {
    setShow(false);
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-card border border-border rounded-lg shadow-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-foreground">
                Ativar Notificações
              </h4>
              <p className="text-xs text-muted-foreground mt-1">
                Receba alertas de follow-ups e nunca perca uma oportunidade de venda.
              </p>
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={handleEnable}
                  disabled={loading}
                  className="text-xs"
                >
                  {loading ? 'Ativando...' : 'Ativar'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDismiss}
                  className="text-xs"
                >
                  Depois
                </Button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
