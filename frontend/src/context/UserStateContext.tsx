import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { defaultUserState } from "../data/learningContent";
import type { UserState } from "../types/learning";

const STORAGE_KEY = "langgraph_user_state";

interface UserStateContextValue {
  userState: UserState;
  updateBalance: (newBalance: number) => void;
  updateProgress: (phaseId: string, sessionId: string) => void;
  markSessionComplete: (sessionId: string) => void;
  updateLangsmithKey: (key: string | null) => void;
  toggleLangsmith: (enabled: boolean) => void;
}

const UserStateContext = createContext<UserStateContextValue | null>(null);

function loadFromStorage(): UserState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as UserState;
  } catch {
    // ignore
  }
  return defaultUserState;
}

function saveToStorage(state: UserState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function UserStateProvider({ children }: { children: React.ReactNode }) {
  const [userState, setUserState] = useState<UserState>(loadFromStorage);

  useEffect(() => {
    saveToStorage(userState);
  }, [userState]);

  const updateBalance = useCallback((newBalance: number) => {
    setUserState((prev) => ({ ...prev, balance: newBalance }));
  }, []);

  const updateProgress = useCallback((phaseId: string, sessionId: string) => {
    setUserState((prev) => ({
      ...prev,
      currentPhaseId: phaseId,
      currentSessionId: sessionId,
    }));
  }, []);

  const markSessionComplete = useCallback((sessionId: string) => {
    setUserState((prev) => ({
      ...prev,
      completedSessionIds: prev.completedSessionIds.includes(sessionId)
        ? prev.completedSessionIds
        : [...prev.completedSessionIds, sessionId],
    }));
  }, []);

  const updateLangsmithKey = useCallback((key: string | null) => {
    setUserState((prev) => ({ ...prev, langsmithApiKey: key }));
  }, []);

  const toggleLangsmith = useCallback((enabled: boolean) => {
    setUserState((prev) => ({ ...prev, useLangsmith: enabled }));
  }, []);

  return (
    <UserStateContext.Provider
      value={{
        userState,
        updateBalance,
        updateProgress,
        markSessionComplete,
        updateLangsmithKey,
        toggleLangsmith,
      }}
    >
      {children}
    </UserStateContext.Provider>
  );
}

export function useUserState() {
  const ctx = useContext(UserStateContext);
  if (!ctx)
    throw new Error("useUserState must be used inside UserStateProvider");
  return ctx;
}
