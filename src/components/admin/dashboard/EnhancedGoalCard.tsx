import { useMemo } from "react";
import { motion } from "framer-motion";
import { LucideIcon, Trophy, Sparkles, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface EnhancedGoalCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  current: number;
  goal: number;
  isCurrency?: boolean;
  showTrend?: boolean;
  trendValue?: number;
  compact?: boolean;
}

const EnhancedGoalCard = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  current,
  goal,
  isCurrency = false,
  showTrend = false,
  trendValue = 0,
  compact = false,
}: EnhancedGoalCardProps) => {
  const { progress, exceeded, exceededBy, status } = useMemo(() => {
    if (goal === 0) {
      return { progress: 0, exceeded: false, exceededBy: 0, status: "no-goal" as const };
    }
    const rawProgress = (current / goal) * 100;
    const exceeded = rawProgress >= 100;
    const exceededBy = exceeded ? rawProgress - 100 : 0;
    
    let status: "no-goal" | "low" | "medium" | "high" | "completed" | "exceeded";
    if (rawProgress >= 120) status = "exceeded";
    else if (rawProgress >= 100) status = "completed";
    else if (rawProgress >= 70) status = "high";
    else if (rawProgress >= 40) status = "medium";
    else status = "low";
    
    return { progress: Math.min(rawProgress, 100), exceeded, exceededBy, status };
  }, [current, goal]);

  const formatValue = (value: number) => {
    if (isCurrency) {
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    }
    return value.toString();
  };

  const formatGoal = (value: number) => {
    if (isCurrency) {
      if (value >= 1000) {
        return `R$ ${(value / 1000).toFixed(0)}k`;
      }
      return formatValue(value);
    }
    return value.toString();
  };

  const getStatusColor = () => {
    switch (status) {
      case "exceeded":
        return "text-amber-500";
      case "completed":
        return "text-emerald";
      case "high":
        return "text-emerald/80";
      case "medium":
        return "text-amber-500";
      case "low":
        return "text-muted-foreground";
      default:
        return "text-muted-foreground";
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case "exceeded":
        return "bg-gradient-to-r from-emerald to-amber-500";
      case "completed":
        return "bg-emerald";
      case "high":
        return "bg-emerald/80";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-primary";
      default:
        return "bg-muted";
    }
  };

  const getBorderColor = () => {
    if (status === "exceeded") return "border-amber-500/50";
    if (status === "completed") return "border-emerald/50";
    return "border-border";
  };

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn(
          "relative bg-muted/50 rounded-lg p-3 overflow-hidden",
          status === "exceeded" && "ring-1 ring-amber-500/30"
        )}
      >
        {status === "exceeded" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute top-1 right-1"
          >
            <Sparkles className="h-3 w-3 text-amber-500" />
          </motion.div>
        )}
        
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        
        <div className="flex items-baseline gap-1 mb-2">
          <span className={cn("text-lg font-bold", status === "exceeded" && "text-amber-500")}>
            {formatValue(current)}
          </span>
          {goal > 0 && (
            <span className="text-xs text-muted-foreground">/ {formatGoal(goal)}</span>
          )}
        </div>
        
        {goal > 0 && (
          <div className="relative">
            <Progress value={progress} className="h-1.5" />
            {status === "exceeded" && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(exceededBy, 50)}%` }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="absolute top-0 right-0 h-1.5 bg-gradient-to-r from-emerald to-amber-500 rounded-r-full"
              />
            )}
          </div>
        )}
        
        {status === "exceeded" && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[10px] text-amber-500 font-medium mt-1"
          >
            +{exceededBy.toFixed(0)}% acima da meta! 🏆
          </motion.p>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative bg-card border rounded-xl p-4 hover:shadow-lg transition-all overflow-hidden",
        getBorderColor(),
        status === "exceeded" && "ring-1 ring-amber-500/20"
      )}
    >
      {/* Celebration effect for exceeded goals */}
      {status === "exceeded" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          className="absolute inset-0 bg-gradient-to-br from-amber-500 to-emerald"
        />
      )}
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className={cn("p-2 rounded-lg", iconBg)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
          
          {goal > 0 && (
            <div className="flex items-center gap-1">
              {status === "exceeded" && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Trophy className="h-4 w-4 text-amber-500" />
                </motion.div>
              )}
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                status === "exceeded" && "bg-amber-500/20 text-amber-500",
                status === "completed" && "bg-emerald/20 text-emerald",
                status === "high" && "bg-emerald/15 text-emerald/80",
                status === "medium" && "bg-amber-500/20 text-amber-500",
                (status === "low" || status === "no-goal") && "bg-muted text-muted-foreground"
              )}>
                {status === "exceeded" ? `${((current / goal) * 100).toFixed(0)}%` : `${progress.toFixed(0)}%`}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-1">{title}</p>
        
        <div className="flex items-baseline gap-2 mb-3">
          <span className={cn(
            "text-2xl font-bold",
            status === "exceeded" && "text-amber-500",
            status === "completed" && "text-emerald"
          )}>
            {formatValue(current)}
          </span>
          {goal > 0 && (
            <span className="text-sm text-muted-foreground">/ {formatGoal(goal)}</span>
          )}
        </div>

        {goal > 0 ? (
          <div className="space-y-1.5">
            <div className="relative h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn("h-full rounded-full", getProgressColor())}
              />
            </div>
            
            {status === "exceeded" && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1.5 text-xs"
              >
                <Sparkles className="h-3 w-3 text-amber-500" />
                <span className="text-amber-500 font-medium">
                  Meta ultrapassada em {exceededBy.toFixed(0)}%!
                </span>
              </motion.div>
            )}
            
            {status === "completed" && !exceeded && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-emerald font-medium"
              >
                Meta atingida! 🎉
              </motion.p>
            )}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">Meta não definida</p>
        )}

        {showTrend && trendValue !== 0 && (
          <div className={cn(
            "flex items-center gap-1 mt-2 text-xs",
            trendValue > 0 ? "text-emerald" : "text-destructive"
          )}>
            <TrendingUp className={cn("h-3 w-3", trendValue < 0 && "rotate-180")} />
            <span>{trendValue > 0 ? "+" : ""}{trendValue.toFixed(1)}% vs mês anterior</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedGoalCard;
