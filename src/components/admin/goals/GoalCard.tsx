import { LucideIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface GoalCardProps {
  title: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
  current: number;
  goal: number;
  isCurrency?: boolean;
  compact?: boolean;
}

const GoalCard = ({
  title,
  icon: Icon,
  iconColor,
  iconBg,
  current,
  goal,
  isCurrency = false,
  compact = false,
}: GoalCardProps) => {
  const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

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

  if (compact) {
    return (
      <div className="bg-muted/50 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Icon className={`h-4 w-4 ${iconColor}`} />
          <span className="text-xs text-muted-foreground">{title}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-lg font-bold">{formatValue(current)}</span>
          {goal > 0 && (
            <span className="text-xs text-muted-foreground">/ {formatGoal(goal)}</span>
          )}
        </div>
        {goal > 0 && (
          <Progress value={progress} className="h-1" />
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBg}`}>
          <Icon className={`h-4 w-4 ${iconColor}`} />
        </div>
        {goal > 0 && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
            progress >= 100 
              ? "bg-emerald/20 text-emerald" 
              : progress >= 70
                ? "bg-amber-500/20 text-amber-500"
                : "bg-muted text-muted-foreground"
          }`}>
            {progress.toFixed(0)}%
          </span>
        )}
      </div>

      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-2xl font-bold">{formatValue(current)}</span>
        {goal > 0 && (
          <span className="text-sm text-muted-foreground">/ {formatGoal(goal)}</span>
        )}
      </div>

      {goal > 0 && (
        <Progress 
          value={progress} 
          className={`h-1.5 ${progress >= 100 ? "[&>div]:bg-emerald" : ""}`} 
        />
      )}

      {goal === 0 && (
        <p className="text-xs text-muted-foreground">Meta não definida</p>
      )}
    </div>
  );
};

export default GoalCard;
