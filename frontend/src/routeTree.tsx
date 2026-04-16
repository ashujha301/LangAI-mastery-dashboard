import { Outlet, createRootRoute, createRoute } from "@tanstack/react-router";
import AppLayout from "./components/layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import LandingPage from "./pages/LandingPage";
import LangSmithPage from "./pages/LangSmithPage";
import NotFoundPage from "./pages/NotFoundPage";
import PhasePage from "./pages/PhasePage";
import PhasesPage from "./pages/PhasesPage";
import SessionPage from "./pages/SessionPage";
import SettingsPage from "./pages/SettingsPage";

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
  notFoundComponent: NotFoundPage,
});

// Landing (no layout)
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LandingPage,
});

// Layout wrapper
const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: AppLayout,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/dashboard",
  component: DashboardPage,
});

const phasesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/phases",
  component: PhasesPage,
});

const phaseRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/phase/$phaseId",
  component: PhasePage,
});

const sessionRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/phase/$phaseId/session/$sessionId",
  component: SessionPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/settings",
  component: SettingsPage,
});

const langsmithRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/langsmith",
  component: LangSmithPage,
});

export const routeTree = rootRoute.addChildren([
  landingRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    phasesRoute,
    phaseRoute,
    sessionRoute,
    settingsRoute,
    langsmithRoute,
  ]),
]);
