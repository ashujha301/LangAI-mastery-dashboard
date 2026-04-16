import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  CheckCircle2,
  Cookie,
  ExternalLink,
  Eye,
  EyeOff,
  Info,
  Key,
  Play,
  Settings,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/layout/Footer";

// ── Cookie helpers ────────────────────────────────────────────────────────────

const COOKIE_NAME = "langsmith_api_key";

function getCookieValue(): string | null {
  const entry = document.cookie
    .split(";")
    .find((c) => c.trim().startsWith(`${COOKIE_NAME}=`));
  if (!entry) return null;
  const value = entry.trim().split("=").slice(1).join("=");
  return value ? decodeURIComponent(value) : null;
}

function saveCookieValue(value: string) {
  const isSecure = window.location.protocol === "https:";
  const secureFlag = isSecure ? "; Secure" : "";
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=2592000; SameSite=Strict${secureFlag}`;
}

function clearCookieValue() {
  document.cookie = `${COOKIE_NAME}=; path=/; max-age=0; SameSite=Strict`;
}

function maskKey(key: string): string {
  if (key.length <= 12) return "••••••••••••";
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

// ── Setup steps ───────────────────────────────────────────────────────────────

const SETUP_STEPS = [
  {
    icon: UserPlus,
    title: "Create Account",
    description:
      "Go to smith.langchain.com and create a free account. No credit card required.",
    href: "https://smith.langchain.com",
  },
  {
    icon: Key,
    title: "Get API Key",
    description:
      "In your LangSmith dashboard, go to Settings → API Keys → Create API Key. Copy the key.",
    href: "https://smith.langchain.com/settings/keys",
  },
  {
    icon: Cookie,
    title: "Save Key Here",
    description:
      "Paste your API key in the field above and click Save. It's stored securely as a browser cookie and never sent to any server.",
  },
  {
    icon: Play,
    title: "Run Code",
    description:
      "When you run code in sessions, your runs will automatically appear in LangSmith.",
  },
  {
    icon: Activity,
    title: "View Traces",
    description:
      "In LangSmith dashboard, go to Projects → langgraph-mastery to see all your traces and inspect inputs, outputs, and latency.",
    href: "https://smith.langchain.com/projects",
  },
];

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LangSmithPage() {
  const [keyInput, setKeyInput] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  // Read existing cookie on mount
  useEffect(() => {
    setSavedKey(getCookieValue());
  }, []);

  const handleSaveKey = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      toast.error("Please enter a valid API key.");
      return;
    }
    saveCookieValue(trimmed);
    setSavedKey(trimmed);
    setKeyInput("");
    setShowKey(false);
    toast.success("LangSmith API key saved securely.");
  };

  const handleClearKey = () => {
    clearCookieValue();
    setSavedKey(null);
    setKeyInput("");
    toast.success("LangSmith API key removed.");
  };

  const isConnected = Boolean(savedKey);

  return (
    <div
      className="max-w-2xl mx-auto px-4 lg:px-6 py-10 space-y-8"
      data-ocid="langsmith.page"
    >
      {/* ─── Header ───────────────────────────────────────────────── */}
      <div
        className="opacity-0 animate-fade-up"
        style={{ animationFillMode: "forwards" }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/15 border border-accent/25">
            <Activity className="h-4 w-4 text-accent" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            LangSmith Integration
          </h1>
          {isConnected && (
            <Badge
              variant="outline"
              className="ml-auto border-accent/40 text-accent bg-accent/10"
              data-ocid="langsmith.connected_badge"
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Connected
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm pl-12">
          Connect your LangSmith account to track your learning runs and inspect
          traces.
        </p>
      </div>

      {/* ─── API Key Section ──────────────────────────────────────── */}
      <Card
        className="opacity-0 animate-fade-up animate-stagger-1"
        style={{ animationFillMode: "forwards" }}
        data-ocid="langsmith.key_card"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Key className="h-4 w-4 text-accent" />
            <CardTitle className="font-display text-base">API Key</CardTitle>
          </div>
          <CardDescription>
            Stored as a secure browser cookie. Injected as{" "}
            <code className="text-xs bg-muted px-1 py-0.5 rounded">
              LANGCHAIN_API_KEY
            </code>{" "}
            only when your code runs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Cookie security notice */}
          <div className="flex items-start gap-2.5 p-3 rounded-md bg-accent/8 border border-accent/20">
            <Cookie className="h-4 w-4 text-accent shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your key is stored as a{" "}
              <span className="text-foreground font-medium">
                secure browser cookie
              </span>{" "}
              and is{" "}
              <span className="text-foreground font-medium">
                never sent to any server
              </span>
              . It is only accessible to this origin with{" "}
              <code className="text-xs bg-muted px-1 rounded">
                SameSite=Strict
              </code>{" "}
              protection.
            </p>
          </div>

          {/* Status banner */}
          {isConnected && savedKey ? (
            <div
              className="flex items-center justify-between p-3 rounded-md bg-accent/10 border border-accent/25"
              data-ocid="langsmith.key.success_state"
            >
              <div className="flex items-center gap-2 min-w-0">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-accent">
                    Key saved (from cookie)
                  </p>
                  <code className="text-xs text-muted-foreground font-mono">
                    {maskKey(savedKey)}
                  </code>
                </div>
              </div>
              <a
                href="https://smith.langchain.com/projects"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent hover:underline shrink-0 ml-2"
                data-ocid="langsmith.view_runs.link"
              >
                View runs
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 p-3 rounded-md bg-muted/40 border border-border"
              data-ocid="langsmith.key.empty_state"
            >
              <Info className="h-4 w-4 text-muted-foreground shrink-0" />
              <span className="text-sm text-muted-foreground">
                No key saved
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                Not connected
              </Badge>
            </div>
          )}

          <Separator />

          {/* Input field */}
          <div className="space-y-1.5">
            <Label htmlFor="langsmith-key-input" className="text-xs">
              {isConnected ? "Replace API Key" : "Enter API Key"}
            </Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="langsmith-key-input"
                  type={showKey ? "text" : "password"}
                  placeholder="lsv2_pt_..."
                  value={keyInput}
                  onChange={(e) => setKeyInput(e.target.value)}
                  className="font-mono text-sm pr-12"
                  data-ocid="langsmith.key.input"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveKey();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowKey((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showKey ? "Hide key" : "Show key"}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <Button
                onClick={handleSaveKey}
                className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"
                data-ocid="langsmith.key.save_button"
              >
                Save
              </Button>
            </div>
          </div>

          {/* Clear key */}
          {isConnected && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearKey}
                className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5"
                data-ocid="langsmith.key.delete_button"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Key
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ─── What is LangSmith ────────────────────────────────────── */}
      <Card
        className="opacity-0 animate-fade-up animate-stagger-2"
        style={{ animationFillMode: "forwards" }}
        data-ocid="langsmith.about_card"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-accent" />
            <CardTitle className="font-display text-base">
              What is LangSmith?
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            LangSmith is a platform for{" "}
            <span className="text-foreground font-medium">
              debugging, testing, and monitoring
            </span>{" "}
            your LangChain/LangGraph applications. As you practice code in
            sessions, your runs will be logged to LangSmith so you can inspect
            inputs, outputs, and traces in real time.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: "Debug", desc: "Inspect every step of your chain" },
              { label: "Test", desc: "Compare runs across experiments" },
              { label: "Monitor", desc: "Track latency, cost, and errors" },
            ].map(({ label, desc }) => (
              <div
                key={label}
                className="p-3 rounded-md bg-secondary/40 border border-border text-center"
              >
                <p className="text-sm font-semibold text-accent font-display">
                  {label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
              </div>
            ))}
          </div>
          <a
            href="https://smith.langchain.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline"
            data-ocid="langsmith.about.open_link"
          >
            Open LangSmith Dashboard
            <ExternalLink className="h-3 w-3" />
          </a>
        </CardContent>
      </Card>

      {/* ─── Step-by-step Guide ───────────────────────────────────── */}
      <Card
        className="opacity-0 animate-fade-up animate-stagger-3"
        style={{ animationFillMode: "forwards" }}
        data-ocid="langsmith.guide_card"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-accent" />
            <CardTitle className="font-display text-base">
              How to set up LangSmith
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <ol className="space-y-0">
            {SETUP_STEPS.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === SETUP_STEPS.length - 1;
              return (
                <li
                  key={step.title}
                  className="flex items-start gap-4"
                  data-ocid={`langsmith.guide.item.${i + 1}`}
                >
                  {/* Number badge + connector */}
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-8 h-8 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                      <span className="text-xs font-bold font-display text-accent">
                        {i + 1}
                      </span>
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 min-h-[20px] bg-border my-1" />
                    )}
                  </div>
                  {/* Content */}
                  <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
                    <div className="flex items-center gap-2 mb-1 pt-1">
                      <Icon className="h-3.5 w-3.5 text-accent shrink-0" />
                      <span className="text-sm font-semibold text-foreground font-display">
                        {step.title}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {step.href && (
                      <a
                        href={step.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-accent hover:underline mt-1.5"
                      >
                        Open link
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </CardContent>
      </Card>

      {/* Back link */}
      <div
        className="text-center opacity-0 animate-fade-up animate-stagger-4"
        style={{ animationFillMode: "forwards" }}
      >
        <Link
          to="/dashboard"
          className="text-sm text-muted-foreground hover:text-accent transition-colors"
          data-ocid="langsmith.back_dashboard.link"
        >
          ← Back to Dashboard
        </Link>
      </div>

      <Footer />
    </div>
  );
}
