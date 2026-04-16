import { useCallback } from "react";
import { useUserState } from "../context/UserStateContext";
import {
  getAllSessions,
  getNextSession,
  getPhaseById,
  getPrevSession,
  getSessionById,
  phases,
} from "../data/learningContent";
import type { Phase, Session } from "../types/learning";

// ─── Phase queries ─────────────────────────────────────────────────────────────

export function usePhases(): Phase[] {
  return phases;
}

export function usePhase(phaseId: string): Phase | undefined {
  return getPhaseById(phaseId);
}

// ─── Session queries ────────────────────────────────────────────────────────────

export function useSession(sessionId: string): Session | undefined {
  return getSessionById(sessionId);
}

export function useSessionNavigation(phaseId: string, sessionId: string) {
  const next = getNextSession(sessionId);
  const prev = getPrevSession(sessionId);
  const current = getSessionById(sessionId);
  const phase = getPhaseById(phaseId);

  return { current, next, prev, phase };
}

export function useAllSessions(): Session[] {
  return getAllSessions();
}

// ─── User progress ─────────────────────────────────────────────────────────────

export function useCurrentProgress() {
  const { userState } = useUserState();
  const currentPhase = getPhaseById(userState.currentPhaseId);
  const currentSession = userState.currentSessionId
    ? getSessionById(userState.currentSessionId)
    : undefined;

  const totalCompleted = userState.completedSessionIds.length;
  const totalSessions = getAllSessions().length;
  const progressPct =
    totalSessions > 0 ? Math.round((totalCompleted / totalSessions) * 100) : 0;

  return {
    currentPhase,
    currentSession,
    completedSessionIds: userState.completedSessionIds,
    totalCompleted,
    totalSessions,
    progressPct,
  };
}

export function useIsSessionComplete(sessionId: string): boolean {
  const { userState } = useUserState();
  return userState.completedSessionIds.includes(sessionId);
}

// ─── Progress actions ───────────────────────────────────────────────────────────

export function useProgressActions() {
  const { updateProgress, markSessionComplete } = useUserState();

  const navigateToSession = useCallback(
    (phaseId: string, sessionId: string) => {
      updateProgress(phaseId, sessionId);
    },
    [updateProgress],
  );

  const completeSession = useCallback(
    (_phaseId: string, sessionId: string) => {
      markSessionComplete(sessionId);
      // Auto-advance to next session
      const next = getNextSession(sessionId);
      if (next) {
        updateProgress(next.phaseId, next.id);
      }
    },
    [markSessionComplete, updateProgress],
  );

  return { navigateToSession, completeSession };
}

// ─── Legacy hooks (kept for compatibility, return null/empty) ──────────────────

export function useMyProfile() {
  return { data: null, isLoading: false };
}
