import { Link, useRouterState } from "@tanstack/react-router";
import {
  Brain,
  ChevronDown,
  LogIn,
  LogOut,
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { useUserState } from "../../context/UserStateContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/phases": "All Phases",
  "/settings": "Settings",
  "/langsmith": "LangSmith Guide",
};

function getPageTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.match(/^\/phase\/[^/]+\/session\//)) return "Session";
  if (pathname.match(/^\/phase\//)) return "Learning Path";
  return "";
}

export default function TopNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { userState } = useUserState();
  const pageTitle = getPageTitle(pathname);
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }
    if (profileOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [profileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full bg-card border-b border-border shadow-xs">
      <div className="flex h-14 items-center px-4 lg:px-6 gap-4">
        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 shrink-0"
          data-ocid="topnav.logo_link"
        >
          <div className="w-7 h-7 rounded-md bg-accent flex items-center justify-center">
            <Brain className="h-4 w-4 text-accent-foreground" />
          </div>
          <span className="font-display font-bold text-base text-foreground tracking-tight hidden sm:block">
            LangAI <span className="text-accent">Mastery</span>
          </span>
        </Link>

        {/* Page title */}
        <span className="text-sm font-medium text-muted-foreground flex-1 text-center sm:text-left">
          {pageTitle}
        </span>

        {/* Balance pill */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary border border-border text-sm font-medium font-mono"
          data-ocid="topnav.balance_pill"
        >
          <span className="text-accent">₹</span>
          <span className="text-foreground">{userState.balance}</span>
        </div>

        {/* Theme toggle */}
        <button
          type="button"
          onClick={() => setTheme(isDark ? "light" : "dark")}
          data-ocid="topnav.theme_toggle"
          aria-label="Toggle theme"
          className="w-8 h-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            data-ocid="topnav.profile.open_modal_button"
            aria-label="Profile menu"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
              <User className="h-3.5 w-3.5 text-accent" />
            </div>
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
            />
          </button>

          {profileOpen && (
            <div
              data-ocid="topnav.profile.dropdown_menu"
              className="absolute right-0 top-full mt-1.5 w-44 rounded-md border border-border bg-popover shadow-md py-1 z-50"
            >
              <button
                type="button"
                data-ocid="topnav.profile.signin.button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <LogIn className="h-4 w-4 text-muted-foreground" />
                Sign In
              </button>
              <button
                type="button"
                data-ocid="topnav.profile.signout.button"
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <LogOut className="h-4 w-4 text-muted-foreground" />
                Sign Out
              </button>
              <div className="my-1 h-px bg-border" />
              <Link
                to="/settings"
                data-ocid="topnav.profile.settings.link"
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-popover-foreground hover:bg-muted transition-colors"
                onClick={() => setProfileOpen(false)}
              >
                <Settings className="h-4 w-4 text-muted-foreground" />
                Profile Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
