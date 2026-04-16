import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Lock,
} from "lucide-react";
import { motion } from "motion/react";
import Footer from "../components/layout/Footer";
import { useUserState } from "../context/UserStateContext";
import { phases } from "../data/learningContent";

export default function PhasesPage() {
  const { userState } = useUserState();

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-accent/15 border border-accent/25 flex items-center justify-center">
            <BookOpen className="h-4.5 w-4.5 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Learning Phases
          </h1>
        </div>
        <p className="text-sm text-muted-foreground ml-12">
          Three phases from LangChain basics to production-ready AI agents.
          Complete each phase to unlock the next.
        </p>
      </motion.div>

      {/* Phase cards */}
      <div className="space-y-4" data-ocid="phases.list">
        {phases.map((phase, i) => {
          const completedCount = phase.sessions.filter((s) =>
            userState.completedSessionIds.includes(s.id),
          ).length;
          const totalCount = phase.sessions.length;
          const pct =
            totalCount > 0
              ? Math.round((completedCount / totalCount) * 100)
              : 0;
          const allDone = completedCount === totalCount;

          // Phase is locked if the previous phase is not completed
          const prevPhase = i > 0 ? phases[i - 1] : null;
          const prevPhaseDone = prevPhase
            ? prevPhase.sessions.every((s) =>
                userState.completedSessionIds.includes(s.id),
              )
            : true;
          const isLocked = !prevPhaseDone && completedCount === 0;

          // Find the next unlocked session in this phase
          const nextSession = phase.sessions.find(
            (s) => !userState.completedSessionIds.includes(s.id),
          );

          return (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              data-ocid={`phases.item.${i + 1}`}
            >
              <div
                className={`rounded-xl border bg-card overflow-hidden transition-all duration-200 ${
                  isLocked
                    ? "opacity-60 border-border/40"
                    : allDone
                      ? "border-green-500/30"
                      : "border-border hover:border-accent/40 hover:shadow-sm"
                }`}
              >
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    {/* Phase icon */}
                    <div className="text-3xl shrink-0 mt-0.5">{phase.icon}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 flex-wrap mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h2 className="font-display text-lg font-bold text-foreground leading-tight">
                            {phase.title}
                          </h2>
                          {allDone && (
                            <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          )}
                          {isLocked && (
                            <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs border-border text-muted-foreground font-mono shrink-0"
                        >
                          <Layers className="h-3 w-3 mr-1" />
                          {totalCount} sessions
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                        {phase.description}
                      </p>

                      {/* Progress */}
                      <div className="space-y-1.5 mb-4">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            {completedCount} of {totalCount} completed
                          </span>
                          <span className="font-mono font-semibold text-foreground">
                            {pct}%
                          </span>
                        </div>
                        <Progress value={pct} className="h-1.5" />
                      </div>

                      {/* Sessions preview */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {phase.sessions.slice(0, 6).map((s, si) => {
                          const done = userState.completedSessionIds.includes(
                            s.id,
                          );
                          return (
                            <span
                              key={s.id}
                              className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                                done
                                  ? "bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400"
                                  : "bg-muted/60 border-border text-muted-foreground"
                              }`}
                            >
                              {done ? (
                                <CheckCircle2 className="h-2.5 w-2.5" />
                              ) : (
                                <span className="h-2 w-2 rounded-full border border-current opacity-50" />
                              )}
                              {si + 1}
                            </span>
                          );
                        })}
                        {phase.sessions.length > 6 && (
                          <span className="text-[10px] text-muted-foreground px-2 py-0.5">
                            +{phase.sessions.length - 6} more
                          </span>
                        )}
                      </div>

                      {/* CTA */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {isLocked ? (
                          <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                            Complete the previous phase to unlock
                          </div>
                        ) : (
                          <>
                            <Button
                              asChild
                              size="sm"
                              className="bg-accent text-accent-foreground hover:bg-accent/90 gap-1.5"
                              data-ocid={`phases.item.continue_button.${i + 1}`}
                            >
                              <Link
                                to="/phase/$phaseId"
                                params={{ phaseId: phase.id }}
                              >
                                {allDone
                                  ? "Review Phase"
                                  : completedCount > 0
                                    ? "Continue"
                                    : "Start Phase"}
                                <ArrowRight className="h-3.5 w-3.5" />
                              </Link>
                            </Button>
                            {nextSession && !allDone && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                Next: {nextSession.title}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <Footer />
    </div>
  );
}
