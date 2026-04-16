import { Button } from "@/components/ui/button";
import { phases } from "@/data/learningContent";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChevronDown,
  Code2,
  GraduationCap,
  Layers,
  Lock,
  Sparkles,
  Terminal,
  Workflow,
  Zap,
} from "lucide-react";
import { useState } from "react";

// ── Learning path visualization ───────────────────────────────────────────────

const LEARNING_NODES = [
  {
    id: "lc",
    label: "AI Fundamentals",
    icon: "🧠",
    color: "cyan",
    col: 0,
    row: 0,
  },
  {
    id: "pt",
    label: "Prompt Engineering",
    icon: "📝",
    color: "blue",
    col: 1,
    row: 1,
  },
  {
    id: "chain",
    label: "Chains & LCEL",
    icon: "⛓️",
    color: "blue",
    col: 1,
    row: 2,
  },
  {
    id: "lg",
    label: "LangGraph Graphs",
    icon: "🕸️",
    color: "violet",
    col: 0,
    row: 3,
  },
  {
    id: "agent",
    label: "AI Agents",
    icon: "🤖",
    color: "violet",
    col: 1,
    row: 4,
  },
  {
    id: "prod",
    label: "Production AI",
    icon: "🚀",
    color: "fuchsia",
    col: 0,
    row: 5,
  },
];

const NODE_COLORS: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  cyan: {
    bg: "bg-cyan-500/15",
    border: "border-cyan-500/40",
    text: "text-cyan-300",
  },
  blue: {
    bg: "bg-blue-500/15",
    border: "border-blue-500/40",
    text: "text-blue-300",
  },
  violet: {
    bg: "bg-violet-500/15",
    border: "border-violet-500/40",
    text: "text-violet-300",
  },
  fuchsia: {
    bg: "bg-fuchsia-500/15",
    border: "border-fuchsia-500/40",
    text: "text-fuchsia-300",
  },
};

function AnimatedPathwayMap() {
  return (
    <div className="relative w-full max-w-xs mx-auto lg:max-w-sm">
      <style>{`
        @keyframes map-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes node-in { from{opacity:0;transform:scale(0.85) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes pulse-ring { 0%,100%{opacity:0.4;transform:scale(1)} 50%{opacity:0.1;transform:scale(1.3)} }
        @keyframes line-draw { from{stroke-dashoffset:80} to{stroke-dashoffset:0} }
      `}</style>

      <div
        className="relative rounded-2xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-sm"
        style={{ animation: "map-float 6s ease-in-out infinite" }}
      >
        <div className="mb-3 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-white/50 uppercase tracking-widest">
            Your Learning Path
          </span>
          <span className="rounded-full bg-cyan-400/20 px-2 py-0.5 text-[11px] font-bold text-cyan-300">
            3 Phases
          </span>
        </div>

        {/* Phase nodes */}
        <div className="space-y-2">
          {LEARNING_NODES.map((node, i) => {
            const colors = NODE_COLORS[node.color];
            return (
              <div
                key={node.id}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 ${colors.bg} ${colors.border}`}
                style={{ animation: `node-in 0.4s ease-out ${i * 0.12}s both` }}
              >
                <div className="shrink-0 w-7 h-7 rounded-md bg-white/10 flex items-center justify-center text-base">
                  {node.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-semibold truncate ${colors.text}`}
                  >
                    {node.label}
                  </p>
                  <div className="mt-1 h-0.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        node.color === "cyan"
                          ? "bg-cyan-400"
                          : node.color === "blue"
                            ? "bg-blue-400"
                            : node.color === "violet"
                              ? "bg-violet-400"
                              : "bg-fuchsia-400"
                      }`}
                      style={{
                        width: i < 3 ? "100%" : i < 5 ? "60%" : "20%",
                        transition: "width 1s ease",
                      }}
                    />
                  </div>
                </div>
                {i < 3 && (
                  <span className="shrink-0 text-[10px] font-bold text-white/30">
                    ✓
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-[11px] text-white/40">LangAI Mastery</span>
          <span className="text-[11px] font-semibold text-cyan-400">
            30+ Sessions
          </span>
        </div>
      </div>

      {/* Glow blob behind the card */}
      <div
        className="absolute inset-0 -z-10 rounded-2xl blur-2xl opacity-20"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, oklch(70% 0.19 185), transparent 70%)",
        }}
      />
    </div>
  );
}

// ── Features data ─────────────────────────────────────────────────────────────

const FEATURES = [
  {
    id: "path",
    icon: Layers,
    title: "Structured Learning Path",
    description:
      "Progressive phases from LangChain basics to advanced LangGraph agents. Each concept builds on the last.",
    accent: "from-cyan-500/20 to-blue-500/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    id: "code",
    icon: Code2,
    title: "Interactive Code Editor",
    description:
      "Write and test LangChain/LangGraph code directly in your browser with Monaco Editor and instant feedback.",
    accent: "from-blue-500/20 to-violet-500/10 border-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    id: "langsmith",
    icon: Terminal,
    title: "LangSmith Integration",
    description:
      "Connect your account to track and debug every code run with full traces. See your agent's thinking in real time.",
    accent: "from-violet-500/20 to-fuchsia-500/10 border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: "theory",
    icon: BookOpen,
    title: "Theory + Practice",
    description:
      "Each session combines theory explanations, coding exercises, quizzes, and Q&A in a single focused flow.",
    accent: "from-fuchsia-500/20 to-pink-500/10 border-fuchsia-500/20",
    iconColor: "text-fuchsia-400",
  },
  {
    id: "sequential",
    icon: Lock,
    title: "Sequential Progression",
    description:
      "Sessions unlock as you complete them, ensuring you build solid knowledge step by step. No skipping ahead.",
    accent: "from-amber-500/20 to-orange-500/10 border-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    id: "projects",
    icon: Workflow,
    title: "Real-World Projects",
    description:
      "Build actual LangChain chains, LangGraph workflows, and complete AI agents — ready for production.",
    accent: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
  },
];

// ── Stats data ────────────────────────────────────────────────────────────────

const STATS = [
  { id: "sessions", value: "30+", label: "Sessions", sub: "Across 3 phases" },
  {
    id: "phases",
    value: "3",
    label: "Learning Phases",
    sub: "Structured journey",
  },
  {
    id: "exercises",
    value: "100+",
    label: "Code Exercises",
    sub: "Hands-on practice",
  },
  {
    id: "langsmith",
    value: "∞",
    label: "LangSmith Traces",
    sub: "With your own key",
  },
];

// ── Curriculum accordion ──────────────────────────────────────────────────────

function CurriculumAccordion() {
  const [openPhase, setOpenPhase] = useState<string | null>(null);

  return (
    <div className="space-y-3 w-full max-w-2xl mx-auto">
      {phases.map((phase) => {
        const isOpen = openPhase === phase.id;
        return (
          <div
            key={phase.id}
            className="rounded-xl border border-border bg-card overflow-hidden"
            data-ocid={`curriculum.phase.${phase.order}`}
          >
            <button
              type="button"
              className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-muted/30 transition-colors"
              onClick={() => setOpenPhase(isOpen ? null : phase.id)}
              data-ocid={`curriculum.phase.toggle.${phase.order}`}
              aria-expanded={isOpen}
            >
              <span className="text-2xl shrink-0">{phase.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-display font-semibold text-foreground text-base leading-snug">
                  {phase.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {phase.subtitle}
                </p>
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-full mr-2">
                {phase.sessions.length} sessions
              </span>
              <ChevronDown
                className={`shrink-0 h-4 w-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isOpen && (
              <div className="border-t border-border bg-muted/20 px-5 py-4">
                <ol className="space-y-2">
                  {phase.sessions.map((session, idx) => (
                    <li
                      key={session.id}
                      className="flex items-center gap-3 text-sm"
                      data-ocid={`curriculum.session.${phase.order}.${idx + 1}`}
                    >
                      <span className="shrink-0 w-5 h-5 rounded-full bg-accent/15 text-accent text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-foreground/80">
                        {session.title}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
      data-ocid="landing.page"
    >
      {/* ── Fixed nav ─────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between px-5 lg:px-10 backdrop-blur-md border-b border-white/10"
        style={{ background: "rgba(15, 10, 30, 0.85)" }}
      >
        <Link
          to="/"
          className="flex items-center gap-2"
          data-ocid="landing.logo.link"
        >
          <div className="w-7 h-7 rounded-md bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
            <GraduationCap className="h-4 w-4 text-cyan-400" />
          </div>
          <span className="font-display font-bold text-lg text-white tracking-tight">
            LangAI<span className="text-cyan-400"> Mastery</span>
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-white/70 hover:text-white hover:bg-white/10"
            data-ocid="landing.login_button"
          >
            <Link to="/dashboard">Sign In</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-cyan-500 text-white hover:bg-cyan-400 font-semibold shadow-lg shadow-cyan-500/20"
            data-ocid="landing.primary_button"
          >
            <Link to="/dashboard">
              Get Started <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* ── Section 1: Hero ────────────────────────────────────────── */}
      <section
        className="relative h-screen snap-start flex flex-col justify-center overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #0f0a1e 0%, #1a1040 50%, #0d1a2e 100%)",
        }}
        data-ocid="landing.hero.section"
      >
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 39px, rgba(255,255,255,0.8) 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, rgba(255,255,255,0.8) 40px)",
          }}
        />
        {/* Ambient glow blobs */}
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(70% 0.19 185), transparent)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, oklch(65% 0.18 300), transparent)",
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 lg:px-10 pt-14">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-fade-up">
              <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
                <Sparkles className="h-3 w-3" />
                LangChain · LangGraph · LangSmith
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
                <span className="text-white">Master AI with</span>
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #22d3ee, #818cf8, #c084fc)",
                  }}
                >
                  LangAI Mastery
                </span>
              </h1>
              <p className="mt-6 text-base text-white/65 max-w-lg leading-relaxed">
                A structured, hands-on learning path from beginner to
                production-ready AI agent developer. Theory, coding practice,
                quizzes, and real traces — all in one place with LangAI Mastery.
              </p>
              <div
                className="mt-8 flex flex-col sm:flex-row gap-3"
                data-ocid="landing.cta.section"
              >
                <Button
                  size="lg"
                  asChild
                  className="bg-cyan-500 text-white hover:bg-cyan-400 font-semibold px-8 text-base shadow-xl shadow-cyan-500/25 transition-all duration-200"
                  data-ocid="landing.start_learning.primary_button"
                >
                  <Link to="/dashboard">
                    Start Learning Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white/80 bg-transparent hover:bg-white/8 hover:text-white hover:border-white/40 px-8 text-base transition-all duration-200"
                  data-ocid="landing.view_curriculum.secondary_button"
                  onClick={() => {
                    document
                      .querySelector('[data-ocid="landing.curriculum.section"]')
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  View Curriculum
                </Button>
              </div>

              {/* Social proof micro-row */}
              <div className="mt-10 flex items-center gap-6">
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Zap className="h-3 w-3 text-cyan-500/60" />
                  <span>30+ sessions</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Brain className="h-3 w-3 text-violet-400/60" />
                  <span>3 phases</span>
                </div>
                <div className="flex items-center gap-2 text-white/40 text-xs">
                  <Terminal className="h-3 w-3 text-fuchsia-400/60" />
                  <span>LangSmith tracing</span>
                </div>
              </div>
            </div>

            <div className="hidden lg:block animate-slide-in-right animate-stagger-2">
              <AnimatedPathwayMap />
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/25">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/25 to-transparent" />
        </div>
      </section>

      {/* ── Section 2: Features ────────────────────────────────────── */}
      <section
        className="h-screen snap-start flex flex-col justify-center bg-background"
        data-ocid="landing.features.section"
      >
        <div className="max-w-5xl mx-auto w-full px-6 lg:px-10">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Everything you need
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              Built for serious learners.
              <br />
              <span className="text-muted-foreground">
                Not just passive readers.
              </span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.id}
                  className={`group p-5 rounded-xl border bg-gradient-to-br ${f.accent} hover:scale-[1.02] transition-all duration-200`}
                  data-ocid={`landing.feature.card.${i + 1}`}
                >
                  <div className="mb-3">
                    <Icon className={`h-5 w-5 ${f.iconColor}`} />
                  </div>
                  <h3 className="font-display font-bold text-foreground text-sm mb-2">
                    {f.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 3: Curriculum ──────────────────────────────────── */}
      <section
        className="h-screen snap-start flex flex-col justify-center bg-muted/30 overflow-y-auto"
        data-ocid="landing.curriculum.section"
      >
        <div className="max-w-4xl mx-auto w-full px-6 lg:px-10 py-20">
          <div className="text-center mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent mb-3">
              Course Curriculum
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
              What You&apos;ll Learn
            </h2>
            <p className="mt-3 text-sm text-muted-foreground max-w-lg mx-auto">
              Three phases that take you from zero to building production-grade
              AI agents with LangAI Mastery.
            </p>
          </div>
          <CurriculumAccordion />
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-4 py-2 rounded-full">
              <Lock className="h-3 w-3" />
              Sessions unlock sequentially — complete each one to progress to
              the next
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Stats ───────────────────────────────────────── */}
      <section
        className="h-screen snap-start flex flex-col justify-center bg-primary text-primary-foreground"
        data-ocid="landing.stats.section"
      >
        <div className="max-w-4xl mx-auto w-full px-6 lg:px-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/60 mb-12">
            By the numbers
          </p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-16">
            {STATS.map((s) => (
              <div
                key={s.id}
                className="space-y-1"
                data-ocid={`landing.stat.${s.id}`}
              >
                <p className="font-display text-4xl lg:text-6xl font-bold text-accent leading-none">
                  {s.value}
                </p>
                <p className="font-display text-sm lg:text-base font-semibold text-primary-foreground mt-2">
                  {s.label}
                </p>
                <p className="text-xs text-primary-foreground/60">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Value statement */}
          <div className="max-w-2xl mx-auto bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8">
            <div className="text-4xl mb-4">💡</div>
            <p className="font-display text-lg lg:text-xl font-medium text-primary-foreground/90 leading-relaxed">
              By completing this course, you'll be able to design, build, and
              deploy intelligent AI agents using LangAI Mastery's full
              curriculum — from simple chains to complex multi-agent systems.
            </p>
            <p className="mt-4 text-sm text-primary-foreground/50">
              Connect your LangSmith account to track every run and debug your
              agents in real time.
            </p>
          </div>
        </div>
      </section>

      {/* ── Section 5: Final CTA ─────────────────────────────────────── */}
      <section
        className="h-screen snap-start flex flex-col justify-between"
        style={{
          background: "linear-gradient(135deg, #0f0a1e 0%, #0d1a2e 100%)",
        }}
        data-ocid="landing.final_cta.section"
      >
        <div className="flex-1 flex flex-col items-center justify-center px-6 lg:px-10 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
            <Sparkles className="h-3 w-3" />
            Free to start · No credit card needed
          </div>
          <h2
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight max-w-3xl bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #ffffff 0%, #22d3ee 50%, #c084fc 100%)",
            }}
          >
            Ready to build
            <br />
            AI agents?
          </h2>
          <p className="mt-6 text-base text-white/55 max-w-lg leading-relaxed">
            Join the structured learning path and go from zero to building
            production LangGraph applications.
          </p>
          <Button
            size="lg"
            asChild
            className="mt-10 bg-cyan-500 text-white hover:bg-cyan-400 font-bold px-12 text-base h-14 rounded-full shadow-2xl shadow-cyan-500/30 transition-all duration-200 hover:scale-105"
            data-ocid="landing.final_cta.primary_button"
          >
            <Link to="/dashboard">
              Begin Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <p className="mt-5 text-xs text-white/30">
            3 phases · 30+ sessions · LangChain + LangGraph + LangSmith
          </p>{" "}
        </div>

        <footer className="py-5 px-6 lg:px-10 border-t border-white/10">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-cyan-500/15 border border-cyan-500/25 flex items-center justify-center">
                <GraduationCap className="h-3.5 w-3.5 text-cyan-400" />
              </div>
              <span className="font-display font-bold text-sm text-white">
                LangAI Mastery
              </span>
            </div>
            <p className="text-xs text-white/40 text-center">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-white/60 transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
