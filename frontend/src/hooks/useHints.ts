import { useCallback, useState } from "react";
import { useUserState } from "../context/UserStateContext";

const HINT_COST = 10; // rupees

interface HintState {
  revealed: boolean;
  canAfford: boolean;
}

/**
 * Manages hint usage for a given session.
 * Each hint costs HINT_COST rupees. Once revealed, the hint stays visible
 * for the lifetime of the component (no persistence across sessions needed).
 */
export function useHints(sessionId: string) {
  const { userState, updateBalance } = useUserState();

  // Track which hint IDs have been revealed this session
  const [revealedHints, setRevealedHints] = useState<Set<string>>(new Set());

  const getHintState = useCallback(
    (hintId: string): HintState => ({
      revealed: revealedHints.has(`${sessionId}:${hintId}`),
      canAfford: userState.balance >= HINT_COST,
    }),
    [revealedHints, sessionId, userState.balance],
  );

  /**
   * Returns true if hint was successfully revealed (had enough balance).
   * Returns false if insufficient balance.
   */
  const revealHint = useCallback(
    (hintId: string): boolean => {
      const key = `${sessionId}:${hintId}`;
      if (revealedHints.has(key)) return true; // already revealed, free
      if (userState.balance < HINT_COST) return false;

      updateBalance(userState.balance - HINT_COST);
      setRevealedHints((prev) => new Set([...prev, key]));
      return true;
    },
    [revealedHints, sessionId, userState.balance, updateBalance],
  );

  const isRevealed = useCallback(
    (hintId: string) => revealedHints.has(`${sessionId}:${hintId}`),
    [revealedHints, sessionId],
  );

  return {
    revealHint,
    isRevealed,
    getHintState,
    hintCost: HINT_COST,
    balance: userState.balance,
  };
}
