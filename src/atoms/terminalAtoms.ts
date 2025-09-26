import { atom } from "jotai";

import type { AppOutput } from "@/ipc/ipc_types";

export type TerminalSessionType = "system" | "user" | "process";

export interface TerminalSession {
  id: string;
  name: string;
  type: TerminalSessionType;
  output: AppOutput[];
  isActive: boolean;
  processId?: number;
  workingDirectory?: string;
  createdAt: number;
  lastActivity: number;
}

export interface TerminalTab {
  id: string;
  name: string;
  sessionId: string;
  isClosable: boolean;
  hasUnreadOutput: boolean;
  isActive: boolean;
}

export const SYSTEM_MESSAGES_SESSION_ID = "system-messages";
export const SYSTEM_MESSAGES_TAB_ID = "tab-system-messages";
export const SYSTEM_MESSAGES_TAB_NAME = "System Messages";

const now = () => Date.now();

export const createSystemMessagesSession = (
  output: AppOutput[] = [],
): TerminalSession => {
  const timestamp = output.length > 0 ? output[output.length - 1]?.timestamp : now();
  return {
    id: SYSTEM_MESSAGES_SESSION_ID,
    name: SYSTEM_MESSAGES_TAB_NAME,
    type: "system",
    output,
    isActive: true,
    createdAt: timestamp ?? now(),
    lastActivity: timestamp ?? now(),
  };
};

export const createSystemMessagesTab = (): TerminalTab => ({
  id: SYSTEM_MESSAGES_TAB_ID,
  name: SYSTEM_MESSAGES_TAB_NAME,
  sessionId: SYSTEM_MESSAGES_SESSION_ID,
  isClosable: false,
  hasUnreadOutput: false,
  isActive: true,
});

export const createInitialSessionState = () =>
  new Map<string, TerminalSession>([
    [SYSTEM_MESSAGES_SESSION_ID, createSystemMessagesSession()],
  ]);

export const terminalSessionsAtom = atom<Map<string, TerminalSession>>(
  createInitialSessionState(),
);

export const terminalTabsAtom = atom<TerminalTab[]>([createSystemMessagesTab()]);

export const activeTerminalIdAtom = atom<string | null>(SYSTEM_MESSAGES_SESSION_ID);

export const activeTerminalSessionAtom = atom((get) => {
  const activeId = get(activeTerminalIdAtom);
  const sessions = get(terminalSessionsAtom);
  if (!activeId) {
    return null;
  }

  return sessions.get(activeId) ?? null;
});

export const activeTerminalOutputAtom = atom((get) => {
  const activeSession = get(activeTerminalSessionAtom);
  return activeSession?.output ?? [];
});

export interface TerminalStateMigrationResult {
  sessions: Map<string, TerminalSession>;
  tabs: TerminalTab[];
  activeSessionId: string;
}

export const migrateAppOutputToTerminalState = (
  appOutput: AppOutput[],
): TerminalStateMigrationResult => ({
  sessions: new Map<string, TerminalSession>([
    [SYSTEM_MESSAGES_SESSION_ID, createSystemMessagesSession(appOutput)],
  ]),
  tabs: [createSystemMessagesTab()],
  activeSessionId: SYSTEM_MESSAGES_SESSION_ID,
});
