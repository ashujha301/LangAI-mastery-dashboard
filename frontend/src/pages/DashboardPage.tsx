import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Clock,
  PlayCircle,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/layout/Footer";
import { useUserState } from "../context/UserStateContext";
import { useCurrentProgress, usePhases } from "../hooks/useQueries";

export default function DashboardPage() {
  const allPhases = usePhases();
  const { userState } = useUserState();
  const {
    currentPhase,
    currentSession,
    completedSessionIds,
    totalCompleted,
    totalSessions,
    progressPct,
  } = useCurrentProgress();

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: "easeOut" as const, delay },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 lg:px-6 py-8 space-y-8">
      {/* Welcome header */}
      <motion.div {...fadeUp(0)}>
        <h1 className="font-display text-2xl font-bold text-foreground">
          Hey 👋
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Your LangChain + LangGraph mastery path
        </p>
      </motion.div>

      {/* Current Progress Card */}
      <motion.div {...fadeUp(0.08)} data-ocid="dashboard.progress_card">
        <Card className="border-accent/25 bg-gradient-to-br from-card via-card to-accent/5 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            {/* Top accent strip */}
            <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-accent to-accent/60" />

            <div className="p-6 space-y-5">
              {/* Header row — phase name + balance */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-accent/15 shrink-0 mt-0.5">
                    {currentSession ? (
                      <PlayCircle className="h-5 w-5 text-accent" />
                    ) : (
                      <Brain className="h-5 w-5 text-accent" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-accent uppercase tracking-widest mb-0.5">
                      {currentSession
                        ? "Continue where you left off"
                        : "Ready to start"}
                    </p>
                    <h2 className="font-display text-lg font-bold text-foreground leading-tight">
                      {currentSession?.title ?? "LangChain Basics"}
                    </h2>
                    {currentPhase && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {currentPhase.icon} {currentPhase.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* Balance pill */}
                <div
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-xs font-medium text-foreground shrink-0"
                  data-ocid="dashboard.balance_pill"
                >
                  <Wallet className="h-3.5 w-3.5 text-accent" />
                  <span>₹{userState.balance}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Overall Progress</span>
                  <span className="font-mono text-foreground">
                    {totalCompleted}/{totalSessions} sessions
                  </span>
                </div>
                <Progress
                  value={progressPct}
                  className="h-2"
                  data-ocid="dashboard.progress_bar"
                />
              </div>

              {/* Continue / Start button */}
              {currentSession && currentPhase ? (
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto transition-smooth"
                  data-ocid="dashboard.continue_button"
                >
                  <Link
                    to="/phase/$phaseId/session/$sessionId"
                    params={{
                      phaseId: currentPhase.id,
                      sessionId: currentSession.id,
                    }}
                  >
                    Continue Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold w-full sm:w-auto transition-smooth"
                  data-ocid="dashboard.start_button"
                >
                  <Link to="/phase/$phaseId" params={{ phaseId: "phase-1" }}>
                    Begin Phase 1
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Phase overview */}
      <motion.div {...fadeUp(0.16)}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base font-semibold text-foreground">
            Learning Phases
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {allPhases.length} phases
          </span>
        </div>

        <div className="space-y-3" data-ocid="dashboard.phases.list">
          {allPhases.map((phase, i) => {
            const sessionCount = phase.sessions.length;
            const completed = phase.sessions.filter((s) =>
              completedSessionIds.includes(s.id),
            ).length;
            const pct =
              sessionCount > 0
                ? Math.round((completed / sessionCount) * 100)
                : 0;
            const isCurrent = currentPhase?.id === phase.id;
            const isDone = completed === sessionCount && sessionCount > 0;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut" as const,
                  delay: 0.2 + i * 0.07,
                }}
              >
                <Link
                  to="/phase/$phaseId"
                  params={{ phaseId: phase.id }}
                  data-ocid={`dashboard.phase.item.${i + 1}`}
                >
                  <Card
                    className={`transition-smooth hover:border-accent/40 hover:bg-card/80 ${
                      isCurrent
                        ? "border-accent/50 bg-accent/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {/* Phase icon */}
                        <span className="text-xl shrink-0 mt-0.5">
                          {phase.icon}
                        </span>

                        {/* Phase info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-sm text-foreground truncate">
                              {phase.title}
                            </p>
                            {isCurrent && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 shrink-0">
                                Current
                              </span>
                            )}
                            {isDone && (
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                            )}
                          </div>

                          {phase.description && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                              {phase.description}
                            </p>
                          )}

                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              <span className="font-mono">
                                {sessionCount} sessions
                              </span>
                            </div>
                            {sessionCount > 0 && (
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Progress
                                  value={pct}
                                  className="h-1.5 flex-1"
                                />
                                <span className="text-xs text-muted-foreground font-mono shrink-0">
                                  {completed}/{sessionCount}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Empty state — only when zero progress */}
      {totalCompleted === 0 && (
        <motion.div {...fadeUp(0.35)} data-ocid="dashboard.empty_state">
          <Card className="border-dashed border-border/60">
            <CardContent className="p-8 text-center">
              <BookOpen className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground">
                No sessions completed yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Start with Phase 1 — each session builds on the last.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Footer />
    </div>
  );
}
