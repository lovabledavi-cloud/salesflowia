import { motion } from "framer-motion";
import { LayoutGrid, Table } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "table" | "kanban";

interface ViewToggleProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="inline-flex items-center rounded-lg border border-border bg-muted p-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("table")}
        className={`relative px-3 h-8 ${
          view === "table"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {view === "table" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-background rounded-md shadow-sm"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <Table className="w-4 h-4" />
          <span className="hidden sm:inline">Tabela</span>
        </span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange("kanban")}
        className={`relative px-3 h-8 ${
          view === "kanban"
            ? "text-foreground"
            : "text-muted-foreground hover:text-foreground"
        }`}
      >
        {view === "kanban" && (
          <motion.div
            layoutId="viewToggle"
            className="absolute inset-0 bg-background rounded-md shadow-sm"
            initial={false}
            transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          <span className="hidden sm:inline">Kanban</span>
        </span>
      </Button>
    </div>
  );
};

export default ViewToggle;
