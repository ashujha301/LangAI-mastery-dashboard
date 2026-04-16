import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link, useParams } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Eye,
  Lightbulb,
  Play,
  RotateCcw,
  Terminal,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useUserState } from "../context/UserStateContext";
import { useHints } from "../hooks/useHints";
import { useProgressActions, useSessionNavigation } from "../hooks/useQueries";

// ─── Stage types ──────────────────────────────────────────────────────────────
type Stage = "theory" | "code" | "quiz" | "qna" | "problem";

const STAGES: { id: Stage; label: string }[] = [
  { id: "theory", label: "Theory" },
  { id: "code", label: "Code" },
  { id: "quiz", label: "Quiz" },
  { id: "qna", label: "Q&A" },
  { id: "problem", label: "Challenge" },
];

// ─── Lightweight Markdown renderer ───────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre
          key={`code-${i}`}
          className="bg-secondary/40 border border-border rounded-md p-3 overflow-auto my-3 font-mono text-xs text-foreground leading-5"
        >
          <code data-lang={lang}>{codeLines.join("\n")}</code>
        </pre>,
      );
      i++;
      continue;
    }

    if (line.startsWith("#### "))
      elements.push(
        <h4
          key={`h4-${i}`}
          className="font-display text-sm font-semibold text-foreground mt-3 mb-1"
        >
          {line.slice(5)}
        </h4>,
      );
    else if (line.startsWith("### "))
      elements.push(
        <h3
          key={`h3-${i}`}
          className="font-display text-sm font-bold text-foreground mt-4 mb-1.5"
        >
          {line.slice(4)}
        </h3>,
      );
    else if (line.startsWith("## "))
      elements.push(
        <h2
          key={`h2-${i}`}
          className="font-display text-base font-bold text-foreground mt-5 mb-2"
        >
          {line.slice(3)}
        </h2>,
      );
    else if (line.startsWith("> "))
      elements.push(
        <blockquote
          key={`bq-${i}`}
          className="border-l-2 border-accent pl-3 italic text-muted-foreground text-sm my-2"
        >
          {line.slice(2)}
        </blockquote>,
      );
    else if (line.startsWith("- ") || line.startsWith("* "))
      elements.push(
        <li
          key={`li-${i}`}
          className="text-sm text-foreground/85 ml-4 leading-relaxed list-disc"
        >
          {inlineFormat(line.slice(2))}
        </li>,
      );
    else if (line.trim() === "")
      elements.push(<div key={`br-${i}`} className="h-1.5" />);
    else
      elements.push(
        <p
          key={`p-${i}`}
          className="text-sm text-foreground/85 leading-relaxed my-1.5"
        >
          {inlineFormat(line)}
        </p>,
      );

    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return (
        <strong key={`b-${part}`} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code
          key={`c-${part}`}
          className="font-mono text-xs bg-secondary/60 px-1 py-0.5 rounded text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      );
    return part;
  });
}

// ─── Stage Progress Bar ───────────────────────────────────────────────────────

function StageBar({
  stages,
  currentStage,
  onStageClick,
  hasCode,
  hasCodingProblem,
}: {
  stages: typeof STAGES;
  currentStage: Stage;
  onStageClick: (s: Stage) => void;
  hasCode: boolean;
  hasCodingProblem: boolean;
}) {
  const visibleStages = stages.filter((s) => {
    if (s.id === "code" && !hasCode) return false;
    if (s.id === "problem" && !hasCodingProblem) return false;
    return true;
  });

  const currentIdx = visibleStages.findIndex((s) => s.id === currentStage);

  return (
    <div
      className="flex items-center gap-1 flex-1 min-w-0"
      data-ocid="session.stage_bar"
    >
      {visibleStages.map((stage, idx) => {
        const isActive = stage.id === currentStage;
        const isDone = idx < currentIdx;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => onStageClick(stage.id)}
            data-ocid={`session.stage.${stage.id}`}
            className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
              ${isActive ? "bg-accent text-accent-foreground" : ""}
              ${isDone ? "bg-accent/15 text-accent" : ""}
              ${!isActive && !isDone ? "text-muted-foreground hover:text-foreground" : ""}
            `}
          >
            {isDone ? (
              <CheckCircle2 className="h-3 w-3 shrink-0" />
            ) : (
              <span
                className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? "bg-accent-foreground" : "bg-current opacity-50"}`}
              />
            )}
            {stage.label}
            {idx < visibleStages.length - 1 && (
              <ChevronRight className="h-3 w-3 text-muted-foreground/50 ml-0.5 -mr-1" />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Code Editor ─────────────────────────────────────────────────────────────

interface CodeEditorProps {
  code: string;
  onChange: (val: string) => void;
  output: string | null;
  isRunning: boolean;
  onRun: () => void;
  onReset: () => void;
  langsmithEnabled?: boolean;
  filename?: string;
}

function CodeEditor({
  code,
  onChange,
  output,
  isRunning,
  onRun,
  onReset,
  langsmithEnabled = false,
  filename = "solution.py",
}: CodeEditorProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card shrink-0">
        <div className="flex gap-1.5 mr-2">
          <span className="w-3 h-3 rounded-full bg-destructive/60" />
          <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <span className="w-3 h-3 rounded-full bg-accent/60" />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {filename}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="session.editor.copy_button"
          >
            {copied ? (
              <Check className="h-3 w-3 text-accent" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            data-ocid="session.editor.reset_button"
          >
            <RotateCcw className="h-3 w-3 mr-1" /> Reset
          </Button>
          <Button
            size="sm"
            onClick={onRun}
            disabled={isRunning}
            className="h-7 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90"
            data-ocid="session.editor.run_button"
          >
            <Play className="h-3 w-3 mr-1" />
            {isRunning ? "Running…" : "Run"}
          </Button>
        </div>
      </div>

      {/* Editor area */}
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 w-full bg-background font-mono text-sm text-foreground
          resize-none outline-none p-4 leading-6 min-h-0
          selection:bg-accent/30 caret-accent placeholder:text-muted-foreground/40"
        spellCheck={false}
        data-ocid="session.editor.textarea"
        style={{ tabSize: 4 }}
        placeholder="# Write your code here…"
      />

      {/* Terminal output */}
      <div className="shrink-0 border-t border-border">
        <div className="px-4 py-1.5 bg-secondary/30 border-b border-border flex items-center gap-2">
          <Terminal className="h-3 w-3 text-muted-foreground" />
          <span className="text-xs font-medium text-muted-foreground">
            Terminal
          </span>
          {langsmithEnabled && (
            <span className="ml-auto text-xs text-accent font-mono">
              LangSmith ✓
            </span>
          )}
        </div>
        <pre
          className="font-mono text-xs p-3 bg-background overflow-auto whitespace-pre-wrap min-h-[3rem] max-h-32"
          data-ocid="session.editor.output"
          style={{
            color: output?.startsWith("Error")
              ? "var(--destructive)"
              : "var(--foreground)",
          }}
        >
          {output !== null ? (
            output
          ) : (
            <span className="text-muted-foreground/40">
              Output will appear here after running…
            </span>
          )}
        </pre>
      </div>
    </div>
  );
}

// ─── Resizable Split Layout ───────────────────────────────────────────────────

interface ResizableSplitProps {
  left: React.ReactNode;
  right: React.ReactNode;
  height: string;
}

function ResizableSplit({ left, right, height }: ResizableSplitProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [leftPct, setLeftPct] = useState(50);
  const [codeCollapsed, setCodeCollapsed] = useState(false);
  const isDragging = useRef(false);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawPct = ((ev.clientX - rect.left) / rect.width) * 100;
      setLeftPct(Math.min(80, Math.max(20, rawPct)));
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex relative"
      style={{ height }}
      data-ocid="session.split_layout"
    >
      {/* Left pane */}
      <div
        className="flex flex-col overflow-hidden border-r border-border"
        style={{ width: codeCollapsed ? "100%" : `${leftPct}%` }}
      >
        {left}
      </div>

      {/* Drag handle + collapse button */}
      {!codeCollapsed && (
        <div
          className="relative flex items-center justify-center w-1.5 bg-border/40 hover:bg-accent/30 cursor-col-resize transition-colors duration-150 shrink-0 select-none z-10"
          onMouseDown={handleMouseDown}
          data-ocid="session.drag_handle"
          title="Drag to resize"
        >
          <button
            type="button"
            className="absolute top-1/2 -translate-y-1/2 z-20 w-6 h-10 rounded-sm bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors duration-150 shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              setCodeCollapsed(true);
            }}
            data-ocid="session.collapse_code_button"
            title="Collapse code panel"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Right pane */}
      {!codeCollapsed && (
        <div
          className="flex flex-col overflow-hidden"
          style={{ width: `${100 - leftPct}%` }}
        >
          {right}
        </div>
      )}

      {/* Expand button when collapsed */}
      {codeCollapsed && (
        <button
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-6 h-16 rounded-l-md bg-card border border-r-0 border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/50 transition-colors duration-150 shadow-md"
          onClick={() => setCodeCollapsed(false)}
          data-ocid="session.expand_code_button"
          title="Expand code panel"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SessionPage() {
  const { phaseId, sessionId } = useParams({
    from: "/layout/phase/$phaseId/session/$sessionId",
  });
  const { current, next, prev, phase } = useSessionNavigation(
    phaseId,
    sessionId,
  );
  const { userState } = useUserState();
  const { completeSession } = useProgressActions();
  const { revealHint, isRevealed, hintCost, balance } = useHints(sessionId);

  // ── Local state ──────────────────────────────────────────────────────────────
  const [stage, setStage] = useState<Stage>("theory");
  const [theoryStep, setTheoryStep] = useState(0);
  const [codeStep, setCodeStep] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizChecked, setQuizChecked] = useState(false);
  const [qnaOpen, setQnaOpen] = useState<string | null>(null);
  const [codingCode, setCodingCode] = useState("");
  const [codeStepCode, setCodeStepCode] = useState<Record<string, string>>({});
  const [codeOutput, setCodeOutput] = useState<Record<string, string | null>>(
    {},
  );
  const [codingOutput, setCodingOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [hintDialogOpen, setHintDialogOpen] = useState(false);
  const [pendingHintId, setPendingHintId] = useState<string | null>(null);
  const [pendingHintData, setPendingHintData] = useState<{
    code: string;
    explanation: string;
  } | null>(null);

  // LangSmith from user state
  const langsmithEnabled = !!(
    userState.useLangsmith && userState.langsmithApiKey
  );

  // Reset per session
  useEffect(() => {
    setStage("theory");
    setTheoryStep(0);
    setCodeStep(0);
    setQuizIdx(0);
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizChecked(false);
    setQnaOpen(null);
    setCodingOutput(null);
    setCodeOutput({});
    setCodingCode(current?.codingProblem?.starterCode ?? "");
    if (current) {
      const initialCode: Record<string, string> = {};
      for (const s of current.codeSteps) {
        initialCode[s.id] = s.starterCode;
      }
      setCodeStepCode(initialCode);
    }
  }, [current]);

  const mockRunCode = useCallback(
    (code: string, expectedOutput: string): string => {
      if (code.trim().length < 10)
        return "Error: code is too short to execute.";
      if (langsmithEnabled)
        return `[LangSmith] Tracing run...\n\n${expectedOutput}`;
      return expectedOutput;
    },
    [langsmithEnabled],
  );

  const runCodeStep = (stepId: string, expected: string) => {
    setIsRunning(true);
    setTimeout(() => {
      setCodeOutput((prev) => ({
        ...prev,
        [stepId]: mockRunCode(codeStepCode[stepId] ?? "", expected),
      }));
      setIsRunning(false);
    }, 800);
  };

  const runCodingProblem = () => {
    setIsRunning(true);
    setTimeout(() => {
      setCodingOutput(
        mockRunCode(codingCode, current?.codingProblem?.expectedOutput ?? ""),
      );
      setIsRunning(false);
    }, 800);
  };

  const handleShowHint = (
    hintId: string,
    hint: { code: string; explanation: string },
  ) => {
    setPendingHintData(hint);
    setPendingHintId(hintId);
    setHintDialogOpen(true);
  };

  const confirmRevealHint = () => {
    if (!pendingHintId) return;
    revealHint(pendingHintId);
  };

  if (!current || !phase) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Session not found.</p>
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  const isCompleted = userState.completedSessionIds.includes(sessionId);
  const hasCode = current.codeSteps.length > 0;
  const hasCodingProblem = current.codingProblem !== null;
  const showSplit = hasCode || hasCodingProblem;

  // Current code step data
  const codeStepData = current.codeSteps[codeStep];
  const editorIsForCodingProblem = stage === "problem";

  // ── Left pane content ─────────────────────────────────────────────────────────

  const leftPane = (
    <div className="flex flex-col h-full">
      {/* Top bar */}
      <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 border-b border-border bg-card">
        <Link
          to="/phase/$phaseId"
          params={{ phaseId }}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
          data-ocid="session.back.link"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="text-xs hidden sm:inline truncate max-w-[120px]">
            {phase.title}
          </span>
        </Link>
        <StageBar
          stages={STAGES}
          currentStage={stage}
          onStageClick={setStage}
          hasCode={hasCode}
          hasCodingProblem={hasCodingProblem}
        />
        {isCompleted && (
          <Badge
            variant="outline"
            className="text-accent border-accent/30 text-xs shrink-0"
          >
            <CheckCircle2 className="h-3 w-3 mr-1" /> Done
          </Badge>
        )}
      </div>

      {/* Session info strip */}
      <div className="shrink-0 px-5 pt-4 pb-2 border-b border-border bg-background/50">
        <h1 className="font-display text-base font-bold text-foreground leading-snug">
          {current.title}
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {current.description}
        </p>
      </div>

      {/* Scrollable content */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-5">
          {/* ── THEORY STAGE ─────────────────────────────────────────────────── */}
          {stage === "theory" && (
            <div
              className="space-y-4 animate-fade-up"
              data-ocid="session.theory.section"
            >
              {current.theorySteps.length > 1 && (
                <div className="flex items-center gap-2">
                  <Progress
                    value={
                      ((theoryStep + 1) / current.theorySteps.length) * 100
                    }
                    className="h-1.5 flex-1"
                  />
                  <span className="text-xs text-muted-foreground font-mono shrink-0">
                    {theoryStep + 1} / {current.theorySteps.length}
                  </span>
                </div>
              )}
              <h2 className="font-display text-base font-bold text-foreground">
                {current.theorySteps[theoryStep]?.title}
              </h2>
              <MarkdownContent
                content={current.theorySteps[theoryStep]?.content ?? ""}
              />

              <div className="flex items-center justify-between pt-4 border-t border-border mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheoryStep((s) => Math.max(0, s - 1))}
                  disabled={theoryStep === 0}
                  data-ocid="session.theory.prev_button"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev
                </Button>
                {theoryStep < current.theorySteps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setTheoryStep((s) => s + 1)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.theory.next_button"
                  >
                    Next <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setStage(hasCode ? "code" : "quiz")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.theory.continue_button"
                  >
                    {hasCode ? "Start Coding" : "Take Quiz"}
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── CODE STAGE — instructions for current code step ─────────────── */}
          {stage === "code" && codeStepData && (
            <div
              className="space-y-4 animate-fade-up"
              data-ocid="session.code.section"
            >
              {/* Step nav */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="font-mono font-semibold text-foreground">
                    {codeStep + 1}
                  </span>
                  <span>/ {current.codeSteps.length}</span>
                </div>
                <Progress
                  value={((codeStep + 1) / current.codeSteps.length) * 100}
                  className="h-1.5 flex-1"
                />
              </div>

              <h2 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
                <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent/20 text-accent text-xs font-bold shrink-0">
                  {codeStep + 1}
                </span>
                {codeStepData.title}
              </h2>

              <MarkdownContent content={codeStepData.instructions} />

              {/* Expected output preview */}
              {codeStepData.expectedOutput && (
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="px-3 py-1.5 bg-secondary/30 border-b border-border">
                    <span className="text-xs text-muted-foreground font-mono">
                      Expected output
                    </span>
                  </div>
                  <pre className="font-mono text-xs p-3 text-foreground/70 bg-background whitespace-pre-wrap">
                    {codeStepData.expectedOutput}
                  </pre>
                </div>
              )}

              {/* Hint + step status */}
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleShowHint(codeStepData.id, codeStepData.hint)
                  }
                  className="h-8 text-xs text-accent hover:bg-accent/10"
                  disabled={balance < hintCost && !isRevealed(codeStepData.id)}
                  data-ocid="session.codestep.hint_button"
                >
                  <Lightbulb className="h-3 w-3 mr-1.5" />
                  {isRevealed(codeStepData.id)
                    ? "View Hint"
                    : `Hint (₹${hintCost})`}
                  {!isRevealed(codeStepData.id) && balance < hintCost && (
                    <span className="ml-1 text-destructive/70 text-[10px]">
                      (low balance)
                    </span>
                  )}
                </Button>
                {codeOutput[codeStepData.id] !== undefined &&
                  codeOutput[codeStepData.id] !== null && (
                    <Badge
                      variant="outline"
                      className="text-accent border-accent/30 text-xs"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Output received
                    </Badge>
                  )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCodeStep((s) => Math.max(0, s - 1))}
                  disabled={codeStep === 0}
                  data-ocid="session.codestep.prev_button"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Prev Step
                </Button>
                {codeStep < current.codeSteps.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setCodeStep((s) => s + 1)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.codestep.next_button"
                  >
                    Next Step <ChevronRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setStage("quiz")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.code.take_quiz_button"
                  >
                    Take Quiz <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── QUIZ STAGE ───────────────────────────────────────────────────── */}
          {stage === "quiz" && (
            <div
              className="space-y-4 animate-fade-up"
              data-ocid="session.quiz.section"
            >
              {current.quiz.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground mb-4">
                    No quiz for this session.
                  </p>
                  <Button
                    size="sm"
                    onClick={() => setStage("qna")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.quiz.skip_button"
                  >
                    Continue to Q&A <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              ) : !quizSubmitted ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-mono">
                      Question {quizIdx + 1} of {current.quiz.length}
                    </span>
                    <Progress
                      value={((quizIdx + 1) / current.quiz.length) * 100}
                      className="h-1.5 flex-1"
                    />
                  </div>
                  <p className="font-medium text-sm text-foreground leading-relaxed">
                    {current.quiz[quizIdx].question}
                  </p>
                  <div className="space-y-2" data-ocid="session.quiz.options">
                    {current.quiz[quizIdx].options.map((opt, oi) => {
                      const isSelected =
                        quizAnswers[current.quiz[quizIdx].id] === oi;
                      const isCorrect =
                        quizChecked &&
                        oi === current.quiz[quizIdx].correctIndex;
                      const isWrong = quizChecked && isSelected && !isCorrect;
                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={quizChecked}
                          onClick={() =>
                            !quizChecked &&
                            setQuizAnswers((prev) => ({
                              ...prev,
                              [current.quiz[quizIdx].id]: oi,
                            }))
                          }
                          data-ocid={`session.quiz.option.${oi + 1}`}
                          className={`w-full text-left px-3.5 py-2.5 rounded-md border text-sm transition-all duration-150
                            ${isCorrect ? "border-accent bg-accent/10 text-foreground" : ""}
                            ${isWrong ? "border-destructive/50 bg-destructive/10 text-foreground" : ""}
                            ${isSelected && !quizChecked ? "border-accent bg-accent/10 text-foreground" : ""}
                            ${!isSelected && !quizChecked ? "border-border text-muted-foreground hover:border-accent/50 hover:text-foreground" : ""}
                            ${!isSelected && !isCorrect && quizChecked ? "border-border text-muted-foreground opacity-50" : ""}
                          `}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-flex items-center justify-center h-5 w-5 rounded-full border text-xs shrink-0
                              border-current opacity-70"
                            >
                              {String.fromCharCode(65 + oi)}
                            </span>
                            {opt}
                            {isCorrect && (
                              <Check className="ml-auto h-3.5 w-3.5 text-accent shrink-0" />
                            )}
                            {isWrong && (
                              <X className="ml-auto h-3.5 w-3.5 text-destructive shrink-0" />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {quizChecked && (
                    <div className="p-3 rounded-md bg-secondary/40 border border-border text-xs text-foreground/80 leading-relaxed">
                      <span className="font-semibold text-foreground">
                        Explanation:{" "}
                      </span>
                      {current.quiz[quizIdx].explanation}
                    </div>
                  )}
                  <div className="flex items-center justify-between pt-2 border-t border-border">
                    <span />
                    {!quizChecked ? (
                      <Button
                        size="sm"
                        onClick={() => setQuizChecked(true)}
                        disabled={
                          quizAnswers[current.quiz[quizIdx].id] === undefined
                        }
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        data-ocid="session.quiz.check_button"
                      >
                        Check Answer
                      </Button>
                    ) : quizIdx < current.quiz.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setQuizIdx((qi) => qi + 1);
                          setQuizChecked(false);
                        }}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        data-ocid="session.quiz.next_question_button"
                      >
                        Next Question{" "}
                        <ChevronRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setQuizSubmitted(true)}
                        className="bg-accent text-accent-foreground hover:bg-accent/90"
                        data-ocid="session.quiz.finish_button"
                      >
                        Finish Quiz <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-md bg-accent/10 border border-accent/20">
                    <CheckCircle2 className="h-6 w-6 text-accent shrink-0" />
                    <div>
                      <p className="font-display font-bold text-foreground text-sm">
                        Quiz Complete!
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {
                          current.quiz.filter(
                            (q) => quizAnswers[q.id] === q.correctIndex,
                          ).length
                        }
                        /{current.quiz.length} correct
                      </p>
                    </div>
                  </div>
                  {current.quiz.map((q) => {
                    const chosen = quizAnswers[q.id];
                    const correct = chosen === q.correctIndex;
                    return (
                      <div
                        key={q.id}
                        className={`p-3 rounded-md border text-xs space-y-1 ${correct ? "border-accent/30 bg-accent/5" : "border-destructive/30 bg-destructive/5"}`}
                      >
                        <p className="font-medium text-foreground">
                          {q.question}
                        </p>
                        <p
                          className={
                            correct ? "text-accent" : "text-destructive"
                          }
                        >
                          Your answer: {q.options[chosen] ?? "—"}
                          {!correct && (
                            <span className="ml-2 text-muted-foreground">
                              Correct: {q.options[q.correctIndex]}
                            </span>
                          )}
                        </p>
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    );
                  })}
                  <Button
                    size="sm"
                    onClick={() => setStage("qna")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                    data-ocid="session.quiz.next_section_button"
                  >
                    Continue to Q&A <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* ── Q&A STAGE ────────────────────────────────────────────────────── */}
          {stage === "qna" && (
            <div
              className="space-y-3 animate-fade-up"
              data-ocid="session.qna.section"
            >
              <div className="mb-1">
                <h2 className="font-display text-sm font-bold text-foreground">
                  Questions & Answers
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Tap each question to reveal the answer.
                </p>
              </div>
              {current.qna.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No Q&A for this session.
                </p>
              ) : (
                current.qna.map((item, i) => (
                  <div
                    key={item.id}
                    className="border border-border rounded-md overflow-hidden"
                    data-ocid={`session.qna.item.${i + 1}`}
                  >
                    <button
                      type="button"
                      className="w-full text-left px-4 py-3 flex items-center justify-between hover:bg-secondary/30 transition-colors"
                      onClick={() =>
                        setQnaOpen(qnaOpen === item.id ? null : item.id)
                      }
                      data-ocid={`session.qna.toggle.${i + 1}`}
                    >
                      <span className="text-sm font-medium text-foreground pr-4">
                        {item.question}
                      </span>
                      {qnaOpen === item.id ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}
                    </button>
                    {qnaOpen === item.id && (
                      <div className="px-4 pb-4 pt-2 border-t border-border bg-secondary/10">
                        <MarkdownContent content={item.answer} />
                      </div>
                    )}
                  </div>
                ))
              )}

              {/* Continue footer */}
              <div className="pt-4 border-t border-border space-y-2">
                {!isCompleted && !hasCodingProblem && (
                  <Button
                    onClick={() => completeSession(phaseId, sessionId)}
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.complete_button"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Complete
                  </Button>
                )}
                {hasCodingProblem && (
                  <Button
                    size="sm"
                    onClick={() => setStage("problem")}
                    className="bg-accent text-accent-foreground hover:bg-accent/90 w-full"
                    data-ocid="session.qna.next_section_button"
                  >
                    Try Coding Challenge{" "}
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── PROBLEM STAGE ────────────────────────────────────────────────── */}
          {stage === "problem" && current.codingProblem && (
            <div
              className="space-y-4 animate-fade-up"
              data-ocid="session.problem.section"
            >
              <div>
                <span className="text-xs text-accent font-mono uppercase tracking-wide">
                  Coding Challenge
                </span>
                <h2 className="font-display text-sm font-bold text-foreground mt-1">
                  {current.codingProblem.title}
                </h2>
              </div>

              <MarkdownContent content={current.codingProblem.prompt} />

              {current.codingProblem.expectedOutput && (
                <div className="border border-border rounded-md overflow-hidden">
                  <div className="px-3 py-1.5 bg-secondary/30 border-b border-border">
                    <span className="text-xs text-muted-foreground font-mono">
                      Expected output
                    </span>
                  </div>
                  <pre className="font-mono text-xs p-3 text-foreground/70 bg-background whitespace-pre-wrap">
                    {current.codingProblem.expectedOutput}
                  </pre>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleShowHint("coding", current.codingProblem!.hint)
                  }
                  className="h-8 text-xs text-accent hover:bg-accent/10"
                  disabled={balance < hintCost && !isRevealed("coding")}
                  data-ocid="session.coding.hint_button"
                >
                  <Lightbulb className="h-3 w-3 mr-1.5" />
                  {isRevealed("coding") ? "View Hint" : `Hint (₹${hintCost})`}
                </Button>
                {!isCompleted && (
                  <Button
                    size="sm"
                    onClick={() => completeSession(phaseId, sessionId)}
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    data-ocid="session.complete_button"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" /> Mark
                    Complete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Bottom prev/next session nav — ONLY Prev and Next buttons */}
      <div className="shrink-0 flex items-center justify-between px-4 py-2 border-t border-border bg-card">
        {prev ? (
          <Button
            asChild
            variant="ghost"
            size="sm"
            data-ocid="session.prev_session_button"
          >
            <Link
              to="/phase/$phaseId/session/$sessionId"
              params={{ phaseId: prev.phaseId, sessionId: prev.id }}
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Prev</span>
            </Link>
          </Button>
        ) : (
          <Button
            asChild
            variant="ghost"
            size="sm"
            data-ocid="session.back_to_phase_button"
          >
            <Link to="/phase/$phaseId" params={{ phaseId }}>
              <ArrowLeft className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Back to Phase</span>
            </Link>
          </Button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Balance:{" "}
            <span className="text-foreground font-mono">₹{balance}</span>
          </span>
        </div>
        {next ? (
          <Button
            asChild
            size="sm"
            className="bg-accent/10 text-accent hover:bg-accent/20 border border-accent/30"
            data-ocid="session.next_session_button"
          >
            <Link
              to="/phase/$phaseId/session/$sessionId"
              params={{ phaseId: next.phaseId, sessionId: next.id }}
            >
              <span className="text-xs">Next</span>
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Link>
          </Button>
        ) : (
          <div />
        )}
      </div>
    </div>
  );

  // ── Right pane (code editor) ───────────────────────────────────────────────

  const rightPane = (
    <div className="flex flex-col h-full">
      {/* Right pane header */}
      <div className="shrink-0 flex items-center gap-2 px-4 py-2.5 border-b border-border bg-card">
        <span className="text-xs text-muted-foreground">
          {stage === "problem"
            ? "Coding Challenge"
            : codeStepData
              ? `Step ${codeStep + 1}: ${codeStepData.title}`
              : "Code Editor"}
        </span>
        <div className="ml-auto flex items-center gap-1.5">
          {langsmithEnabled && (
            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-full font-mono">
              LangSmith ✓
            </span>
          )}
          <span className="text-xs text-muted-foreground font-mono">
            ₹{balance}
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {editorIsForCodingProblem ? (
          <CodeEditor
            code={codingCode}
            onChange={setCodingCode}
            output={codingOutput}
            isRunning={isRunning}
            onRun={runCodingProblem}
            onReset={() => setCodingCode(current.codingProblem!.starterCode)}
            langsmithEnabled={langsmithEnabled}
            filename="solution.py"
          />
        ) : codeStepData ? (
          <CodeEditor
            code={codeStepCode[codeStepData.id] ?? codeStepData.starterCode}
            onChange={(val) =>
              setCodeStepCode((prev) => ({ ...prev, [codeStepData.id]: val }))
            }
            output={codeOutput[codeStepData.id] ?? null}
            isRunning={isRunning}
            onRun={() =>
              runCodeStep(codeStepData.id, codeStepData.expectedOutput)
            }
            onReset={() =>
              setCodeStepCode((prev) => ({
                ...prev,
                [codeStepData.id]: codeStepData.starterCode,
              }))
            }
            langsmithEnabled={langsmithEnabled}
            filename={`step_${codeStep + 1}.py`}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground p-8">
            <Terminal className="h-10 w-10 opacity-30" />
            <p className="text-sm text-center opacity-60">
              {stage === "theory"
                ? "Code editor will be active during the Code stage."
                : "No code editor for this stage."}
            </p>
            {stage === "theory" && hasCode && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setStage("code")}
                data-ocid="session.goto_code_button"
              >
                Skip to Code <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // ── Main layout ───────────────────────────────────────────────────────────

  const pageHeight = "calc(100vh - 3.5rem)";

  return (
    <>
      {showSplit ? (
        // Resizable split-screen for sessions with code
        <ResizableSplit left={leftPane} right={rightPane} height={pageHeight} />
      ) : (
        // Full-width layout for pure theory sessions
        <div
          className="max-w-3xl mx-auto px-4 lg:px-6"
          style={{ minHeight: pageHeight }}
          data-ocid="session.fullwidth_layout"
        >
          {leftPane}
        </div>
      )}

      {/* Hint modal */}
      <Dialog
        open={hintDialogOpen}
        onOpenChange={(open) => {
          if (!open) setHintDialogOpen(false);
        }}
      >
        <DialogContent
          className="max-w-sm sm:max-w-md bg-card border-border mx-4"
          data-ocid="session.hint.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display text-base">Hint</DialogTitle>
          </DialogHeader>

          {pendingHintId && !isRevealed(pendingHintId) ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50 border border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertCircle className="h-4 w-4" />
                  This hint costs
                </div>
                <span className="hint-cost">₹{hintCost}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Your balance:</span>
                <span className="font-mono text-foreground">₹{balance}</span>
              </div>
              {balance < hintCost && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  Insufficient balance. Add more funds in Settings.
                </div>
              )}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setHintDialogOpen(false)}
                  data-ocid="session.hint.cancel_button"
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={confirmRevealHint}
                  disabled={balance < hintCost}
                  data-ocid="session.hint.confirm_button"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Reveal Hint (₹{hintCost})
                </Button>
              </div>
            </div>
          ) : pendingHintData ? (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-xs font-semibold text-accent mb-2 uppercase tracking-wide">
                  Solution Code
                </p>
                <pre className="code-block text-xs overflow-auto max-h-48">
                  {pendingHintData.code}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Why this works
                </p>
                <p className="text-sm text-foreground/85 leading-relaxed">
                  {pendingHintData.explanation}
                </p>
              </div>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setHintDialogOpen(false)}
                data-ocid="session.hint.close_button"
              >
                Got it
              </Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
