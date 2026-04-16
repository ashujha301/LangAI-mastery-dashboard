import { Link, useRouterState } from "@tanstack/react-router";
import { KeyRound, Layers, LayoutDashboard } from "lucide-react";

const tabs = [
  {
    to: "/dashboard" as const,
    label: "Home",
    icon: LayoutDashboard,
    ocid: "mobile_nav.home",
    matchPrefix: "/dashboard",
  },
  {
    to: "/phase/$phaseId" as const,
    params: { phaseId: "phase-1" },
    label: "Phases",
    icon: Layers,
    ocid: "mobile_nav.phases",
    matchPrefix: "/phase/",
  },
  {
    to: "/langsmith" as const,
    label: "LangSmith",
    icon: KeyRound,
    ocid: "mobile_nav.langsmith",
    matchPrefix: "/langsmith",
  },
];

export default function MobileBottomNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  const isActive = (matchPrefix: string) => pathname.startsWith(matchPrefix);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
      <div className="grid grid-cols-3 h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.matchPrefix);
          const linkProps =
            "params" in tab
              ? { to: tab.to, params: tab.params }
              : { to: tab.to };
          return (
            <Link
              key={tab.to}
              {...linkProps}
              data-ocid={tab.ocid}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                active
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
