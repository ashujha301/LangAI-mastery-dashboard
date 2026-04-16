// ─── Theory Step ─────────────────────────────────────────────────────────────
export interface TheoryStep {
  id: string;
  title: string;
  content: string; // markdown
}

// ─── Code Step ───────────────────────────────────────────────────────────────
export interface CodeStep {
  id: string;
  title: string;
  instructions: string; // markdown — what the user should do
  starterCode: string;
  expectedOutput: string;
  hint: {
    code: string; // exact solution code
    explanation: string; // why this code works
  };
}

// ─── Quiz ─────────────────────────────────────────────────────────────────────
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number; // 0-based index into options
  explanation: string; // shown after answering
}

// ─── Q&A ─────────────────────────────────────────────────────────────────────
export interface QnAItem {
  id: string;
  question: string;
  answer: string; // markdown
}

// ─── Coding Problem ──────────────────────────────────────────────────────────
export interface CodingProblem {
  id: string;
  title: string;
  prompt: string; // markdown description
  starterCode: string;
  expectedOutput: string;
  hint: {
    code: string;
    explanation: string;
  };
}

// ─── Session ─────────────────────────────────────────────────────────────────
export type SessionType = "theory" | "code";

export interface Session {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  type: SessionType;
  estimatedMinutes: number;
  theorySteps: TheoryStep[];
  codeSteps: CodeStep[]; // empty array for theory-only sessions
  quiz: QuizQuestion[];
  qna: QnAItem[];
  codingProblem: CodingProblem | null; // null for theory-only sessions
}

// ─── Phase ───────────────────────────────────────────────────────────────────
export interface Phase {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  color: string; // tailwind gradient class pair e.g. "from-blue-500 to-cyan-400"
  icon: string; // emoji
  order: number;
  sessions: Session[];
}

// ─── User State ───────────────────────────────────────────────────────────────
export interface UserState {
  currentPhaseId: string;
  currentSessionId: string;
  completedSessionIds: string[];
  balance: number; // in rupees — hints cost 10 rupees each
  langsmithApiKey: string | null;
  useLangsmith: boolean;
}
