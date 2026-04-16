import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Circle,
  FlaskConical,
  LayoutDashboard,
  Lock,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { useUserState } from "../../context/UserStateContext";
import { phases } from "../../data/learningContent";

export default function SideNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { userState } = useUserState();
  const [phasesExpanded, setPhasesExpanded] = useState(true);

  const isNavActive = (to: string) => pathname === to;
  const isPhasesActive = () =>
    pathname === "/phases" || pathname.startsWith("/phase/");
  const isPhaseActive = (phaseId: string) =>
    pathname.startsWith(`/phase/${phaseId}`);

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-border bg-sidebar">
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-5">
          {/* Main nav */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1">
              Navigation
            </p>
            <nav className="space-y-0.5">
              <Link
                to="/dashboard"
                data-ocid="sidenav.dashboard.link"
                className={`flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isNavActive("/dashboard")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 shrink-0" />
                Dashboard
              </Link>
            </nav>
          </div>

          {/* Phases (collapsible) */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/40 px-2 mb-1">
              Learning
            </p>
            <nav className="space-y-0.5">
              {/* Phases parent row — navigates to /phases AND toggles sub-list */}
              <div className="flex items-center rounded-sm overflow-hidden">
                <Link
                  to="/phases"
                  data-ocid="sidenav.phases.link"
                  className={`flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium flex-1 transition-colors ${
                    isPhasesActive()
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  Phases
                </Link>
                <button
                  type="button"
                  onClick={() => setPhasesExpanded((v) => !v)}
                  data-ocid="sidenav.phases.toggle"
                  aria-label="Toggle phases list"
                  className={`px-2 py-2 transition-colors ${
                    isPhasesActive()
                      ? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80"
                      : "text-sidebar-foreground/40 hover:text-sidebar-foreground/70 hover:bg-sidebar-accent/50"
                  }`}
                >
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-200 ${phasesExpanded ? "rotate-0" : "-rotate-90"}`}
                  />
                </button>
              </div>

              {/* Phase child items */}
              {phasesExpanded && (
                <div className="ml-3 pl-3 border-l border-sidebar-border/50 space-y-0.5 mt-0.5">
                  {phases.map((phase, i) => {
                    const active = isPhaseActive(phase.id);
                    const sessionCount = phase.sessions.length;
                    const completedCount = phase.sessions.filter((s) =>
                      userState.completedSessionIds.includes(s.id),
                    ).length;
                    const allDone = completedCount === sessionCount;

                    const prevPhase = i > 0 ? phases[i - 1] : null;
                    const prevPhaseDone = prevPhase
                      ? prevPhase.sessions.every((s) =>
                          userState.completedSessionIds.includes(s.id),
                        )
                      : true;
                    const isLocked = !prevPhaseDone && completedCount === 0;

                    return (
                      <Link
                        key={phase.id}
                        to="/phase/$phaseId"
                        params={{ phaseId: phase.id }}
                        data-ocid={`sidenav.phase.link.${i + 1}`}
                        className={`flex items-center gap-2 px-2 py-1.5 text-xs rounded-sm transition-colors group ${
                          active
                            ? "bg-accent/15 text-accent font-medium"
                            : isLocked
                              ? "text-sidebar-foreground/25 cursor-default pointer-events-none"
                              : "text-sidebar-foreground/55 hover:text-sidebar-foreground hover:bg-sidebar-accent/40"
                        }`}
                      >
                        <span className="text-sm shrink-0 leading-none">
                          {phase.icon}
                        </span>
                        <span className="truncate flex-1 leading-snug">
                          {phase.title}
                        </span>
                        {isLocked ? (
                          <Lock className="h-2.5 w-2.5 text-sidebar-foreground/25 shrink-0" />
                        ) : allDone ? (
                          <CheckCircle2 className="h-2.5 w-2.5 text-accent shrink-0" />
                        ) : completedCount > 0 ? (
                          <Circle className="h-2.5 w-2.5 text-accent/50 shrink-0" />
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
              )}
            </nav>
          </div>

          {/* LangSmith */}
          <div>
            <nav className="space-y-0.5">
              <Link
                to="/langsmith"
                data-ocid="sidenav.langsmith.link"
                className={`flex items-center gap-2.5 px-2.5 py-2 text-sm font-medium rounded-sm transition-colors ${
                  isNavActive("/langsmith")
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <FlaskConical className="h-4 w-4 shrink-0" />
                LangSmith
              </Link>
            </nav>
          </div>
        </div>
      </ScrollArea>

      {/* Bottom: balance + upgrade */}
      <div className="p-3 border-t border-sidebar-border space-y-2">
        <div className="px-2.5 py-1.5 rounded-sm bg-sidebar-accent/30 border border-sidebar-border flex items-center justify-between text-xs">
          <span className="text-sidebar-foreground/60 font-medium">
            Balance
          </span>
          <span className="font-mono text-accent font-semibold">
            ₹{userState.balance}
          </span>
        </div>
        <button
          type="button"
          data-ocid="sidenav.upgrade.button"
          className="w-full flex items-center justify-center gap-2 px-2.5 py-2 text-sm font-semibold rounded-sm bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
        >
          <Zap className="h-4 w-4 shrink-0" />
          Upgrade
        </button>
      </div>
    </aside>
  );
}
