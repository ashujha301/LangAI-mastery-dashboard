import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  Code2,
  FileText,
  Info,
  Layers,
  Lock,
  PlayCircle,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/layout/Footer";
import { useUserState } from "../context/UserStateContext";
import { usePhase } from "../hooks/useQueries";
import type { Session } from "../types/learning";

// ─── Helpers ─────────────────────────────────────────────────────────────────

type StatusType = "completed" | "current" | "locked" | "not-started";

function getStatus(
  session: Session,
  sessionIndex: number,
  phaseSessions: Session[],
  currentSessionId: string,
  completedSessionIds: string[],
): StatusType {
  if (completedSessionIds.includes(session.id)) return "completed";
  if (currentSessionId === session.id) return "current";
  // First session is always unlocked
  if (sessionIndex === 0) return "not-started";
  // Lock if the previous session is not completed
  const prev = phaseSessions[sessionIndex - 1];
  if (prev && !completedSessionIds.includes(prev.id)) return "locked";
  return "not-started";
}

const SESSION_TYPE_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  theory: {
    label: "Theory",
    icon: <FileText className="h-3 w-3" />,
  },
  code: {
    label: "Theory + Code",
    icon: <Code2 className="h-3 w-3" />,
  },
  default: {
    label: "Theory",
    icon: <FileText className="h-3 w-3" />,
  },
};

// ─── Session Card ─────────────────────────────────────────────────────────────

interface SessionCardProps {
  session: Session;
  index: number;
  phaseId: string;
  status: StatusType;
  onNavigate: () => void;
}

function SessionCard({
  session,
  index,
  phaseId,
  status,
  onNavigate,
}: SessionCardProps) {
  const typeCfg =
    SESSION_TYPE_CONFIG[session.type] ?? SESSION_TYPE_CONFIG.default;
  const isCurrent = status === "current";
  const isCompleted = status === "completed";
  const isLocked = status === "locked";

  if (isLocked) {
    return (
      <div
        data-ocid={`phase.session.item.${index + 1}`}
        className="h-full cursor-not-allowed"
        aria-disabled="true"
      >
        <Card className="h-full opacity-50 border-border/40 bg-muted/20 select-none">
          <CardContent className="p-4 flex flex-col gap-3 h-full">
            {/* Top row: number + lock badge */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border border-border bg-transparent text-muted-foreground">
                <Lock className="h-3 w-3" />
                Locked
              </div>
            </div>

            {/* Session title */}
            <div className="flex-1">
              <p className="font-display font-semibold text-sm text-muted-foreground leading-snug line-clamp-2">
                {session.title}
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 flex items-center gap-1.5">
                <Lock className="h-3 w-3 shrink-0" />
                Complete previous session to unlock this
              </p>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/30">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
                  {typeCfg.icon}
                  {typeCfg.label}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/60">
                  <Clock className="h-3 w-3" />
                  {session.estimatedMinutes}m
                </span>
              </div>
              <Lock className="h-3.5 w-3.5 text-muted-foreground/30 shrink-0" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Link
      to="/phase/$phaseId/session/$sessionId"
      params={{ phaseId, sessionId: session.id }}
      onClick={onNavigate}
      data-ocid={`phase.session.item.${index + 1}`}
    >
      <Card
        className={[
          "group transition-smooth cursor-pointer h-full",
          isCurrent
            ? "border-accent/60 bg-accent/5 shadow-[0_0_0_1px_oklch(var(--accent)/0.3)]"
            : "hover:border-accent/30 hover:bg-card/80",
          isCompleted ? "opacity-75 hover:opacity-100" : "",
        ].join(" ")}
      >
        <CardContent className="p-4 flex flex-col gap-3 h-full">
          {/* Top row: number + status badge */}
          <div className="flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div
              className={[
                "inline-flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border",
                isCompleted
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : isCurrent
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-border bg-transparent text-muted-foreground",
              ].join(" ")}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : isCurrent ? (
                <PlayCircle className="h-3 w-3" />
              ) : (
                <span className="h-2 w-2 rounded-full border border-current opacity-60" />
              )}
              {isCompleted
                ? "Completed"
                : isCurrent
                  ? "In Progress"
                  : "Not Started"}
            </div>
          </div>

          {/* Session title */}
          <div className="flex-1">
            <p className="font-display font-semibold text-sm text-foreground leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
              {session.title}
            </p>
            {session.description && (
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                {session.description}
              </p>
            )}
          </div>

          {/* Bottom row: type + duration + arrow */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-border/50">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                {typeCfg.icon}
                {typeCfg.label}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <Clock className="h-3 w-3" />
                {session.estimatedMinutes}m
              </span>
            </div>
            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-accent group-hover:translate-x-0.5 transition-all duration-200 shrink-0" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PhasePage() {
  const { phaseId } = useParams({ from: "/layout/phase/$phaseId" });
  const phase = usePhase(phaseId);
  const { userState, updateProgress } = useUserState();

  if (!phase) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Phase not found.</p>
        <Button asChild size="sm" className="mt-4" variant="outline">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const completedCount = phase.sessions.filter((s) =>
    userState.completedSessionIds.includes(s.id),
  ).length;
  const pct =
    phase.sessions.length > 0
      ? Math.round((completedCount / phase.sessions.length) * 100)
      : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-6 py-8 space-y-8">
      {/* Back button */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Link
          to="/phases"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          data-ocid="phase.back.link"
        >
          <ArrowLeft className="h-4 w-4" />
          All Phases
        </Link>
      </motion.div>

      {/* Phase header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        className="bg-card border border-border rounded-lg p-6"
      >
        <div className="flex items-start gap-4">
          <div className="text-4xl shrink-0 mt-0.5">{phase.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-display text-2xl font-bold text-foreground">
                {phase.title}
              </h1>
              <Badge
                variant="outline"
                className="text-xs border-border text-muted-foreground font-mono"
              >
                <Layers className="h-3 w-3 mr-1" />
                {phase.sessions.length} sessions
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {phase.description}
            </p>

            {/* Progress bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {completedCount} of {phase.sessions.length} sessions completed
                </span>
                <span className="font-mono font-medium text-foreground">
                  {pct}%
                </span>
              </div>
              <Progress value={pct} className="h-1.5" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sequential unlock info banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.12 }}
        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-accent/8 border border-accent/20 text-sm"
        data-ocid="phase.unlock_info_banner"
      >
        <Info className="h-4 w-4 text-accent shrink-0" />
        <p className="text-foreground/80">
          <span className="font-semibold text-foreground">
            Sessions unlock sequentially
          </span>{" "}
          — complete each session to unlock the next one.
        </p>
      </motion.div>

      {/* Sessions section */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground">
            Sessions
          </h2>
        </motion.div>

        {/* 2-col grid on desktop, 1-col on mobile */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
          data-ocid="phase.sessions.list"
        >
          {phase.sessions.map((session, i) => {
            const status = getStatus(
              session,
              i,
              phase.sessions,
              userState.currentSessionId,
              userState.completedSessionIds,
            );
            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.2 + i * 0.07,
                  ease: "easeOut",
                }}
              >
                <SessionCard
                  session={session}
                  index={i}
                  phaseId={phase.id}
                  status={status}
                  onNavigate={() => updateProgress(phase.id, session.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
