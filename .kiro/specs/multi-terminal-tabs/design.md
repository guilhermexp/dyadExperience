# Design Document

## Overview

This design document outlines the implementation of a multi-tab terminal system for Dyad, transforming the current single "System Messages" console into a flexible, VS Code-like terminal interface. The system will maintain backward compatibility while adding powerful multi-terminal capabilities.

## Architecture

### Current System Analysis

The current terminal system consists of:
- `PreviewPanel.tsx`: Main container with console toggle functionality
- `Console.tsx`: Simple output display component consuming `appOutputAtom`
- `appOutputAtom`: Jotai atom storing `AppOutput[]` for a single terminal session
- `AppOutput` interface: Defines terminal output structure with type, message, timestamp, and appId

### New Architecture Overview

The new system will implement a layered architecture:

```
┌─────────────────────────────────────────┐
│           PreviewPanel                  │
│  ┌───────────────────────────────────┐  │
│  │        TerminalTabs               │  │
│  │  ┌─────┬─────┬─────┬─────┬─────┐  │  │
│  │  │Tab1 │Tab2 │Tab3 │ ... │  +  │  │  │
│  │  └─────┴─────┴─────┴─────┴─────┘  │  │
│  │  ┌───────────────────────────────┐  │  │
│  │  │      ActiveTerminal           │  │  │
│  │  │                               │  │  │
│  │  └───────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## Components and Interfaces

### 1. Core Data Models

#### TerminalSession Interface
```typescript
interface TerminalSession {
  id: string;
  name: string;
  type: 'system' | 'user' | 'process';
  output: AppOutput[];
  isActive: boolean;
  processId?: number;
  workingDirectory?: string;
  createdAt: number;
  lastActivity: number;
}
```

#### TerminalTab Interface
```typescript
interface TerminalTab {
  id: string;
  name: string;
  sessionId: string;
  isClosable: boolean;
  hasUnreadOutput: boolean;
  isActive: boolean;
}
```

### 2. State Management

#### New Atoms
```typescript
// Replace single appOutputAtom with session-based management
export const terminalSessionsAtom = atom<Map<string, TerminalSession>>(new Map());
export const activeTerminalIdAtom = atom<string | null>(null);
export const terminalTabsAtom = atom<TerminalTab[]>([]);

// Derived atoms
export const activeTerminalSessionAtom = atom((get) => {
  const activeId = get(activeTerminalIdAtom);
  const sessions = get(terminalSessionsAtom);
  return activeId ? sessions.get(activeId) : null;
});

export const activeTerminalOutputAtom = atom((get) => {
  const activeSession = get(activeTerminalSessionAtom);
  return activeSession?.output || [];
});
```

### 3. Component Architecture

#### TerminalTabs Component
```typescript
interface TerminalTabsProps {
  isOpen: boolean;
  onToggle: () => void;
  latestMessage?: string;
}

export const TerminalTabs: React.FC<TerminalTabsProps> = ({
  isOpen,
  onToggle,
  latestMessage
}) => {
  // Tab management logic
  // Keyboard shortcuts handling
  // Tab creation/deletion
  // Tab switching
};
```

#### TerminalTabBar Component
```typescript
interface TerminalTabBarProps {
  tabs: TerminalTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabCreate: () => void;
  onTabRename: (tabId: string, newName: string) => void;
}
```

#### MultiTerminalConsole Component
```typescript
interface MultiTerminalConsoleProps {
  activeSessionId: string | null;
}

export const MultiTerminalConsole: React.FC<MultiTerminalConsoleProps> = ({
  activeSessionId
}) => {
  // Renders output for active terminal session
  // Handles input for interactive terminals
  // Manages scrolling and output formatting
};
```

### 4. Terminal Management Service

#### TerminalManager Class
```typescript
class TerminalManager {
  private sessions: Map<string, TerminalSession> = new Map();
  private processes: Map<string, ChildProcess> = new Map();

  createSession(type: 'system' | 'user' | 'process', name?: string): string;
  destroySession(sessionId: string): void;
  switchToSession(sessionId: string): void;
  sendCommand(sessionId: string, command: string): void;
  getSessionOutput(sessionId: string): AppOutput[];
  renameSession(sessionId: string, newName: string): void;
}
```

## Data Models

### Enhanced AppOutput
The existing `AppOutput` interface will be extended to support session identification:

```typescript
interface AppOutput {
  type: "stdout" | "stderr" | "info" | "client-error" | "input-requested";
  message: string;
  timestamp: number;
  appId: number;
  sessionId?: string; // New field for multi-terminal support
}
```

### Terminal Configuration
```typescript
interface TerminalConfig {
  defaultShell: string;
  maxOutputLines: number;
  fontSize: number;
  theme: 'dark' | 'light' | 'auto';
  keyboardShortcuts: {
    newTab: string;
    closeTab: string;
    nextTab: string;
    prevTab: string;
  };
}
```

## Error Handling

### Session Isolation
- Each terminal session runs in isolation
- Process crashes only affect the specific session
- Failed sessions show error state without affecting other tabs
- Automatic cleanup of orphaned processes

### Error Recovery
```typescript
interface TerminalError {
  sessionId: string;
  type: 'process_crash' | 'connection_lost' | 'permission_denied';
  message: string;
  timestamp: number;
  recoverable: boolean;
}
```

### Graceful Degradation
- If terminal backend fails, fall back to read-only mode
- System Messages tab always remains functional
- Error notifications don't block other terminal operations

## Testing Strategy

### Unit Tests
1. **TerminalManager Tests**
   - Session creation and destruction
   - Process management
   - Output routing
   - Error handling

2. **Component Tests**
   - Tab switching behavior
   - Keyboard shortcuts
   - Tab creation/deletion
   - Rename functionality

3. **State Management Tests**
   - Atom updates and derivations
   - Session state persistence
   - Active terminal switching

### Integration Tests
1. **Multi-Terminal Workflow**
   - Create multiple terminals
   - Run different processes simultaneously
   - Switch between terminals
   - Close terminals with running processes

2. **Backward Compatibility**
   - System Messages functionality preserved
   - Existing app output routing works
   - No breaking changes to current API

### E2E Tests
1. **User Workflows**
   - Complete terminal management workflow
   - Keyboard shortcut functionality
   - Tab persistence across app restarts
   - Error scenarios and recovery

## Implementation Phases

### Phase 1: Core Infrastructure
- Implement new state management atoms
- Create TerminalManager service
- Build basic TerminalTabs component
- Maintain backward compatibility

### Phase 2: UI Components
- Implement TerminalTabBar with full functionality
- Create MultiTerminalConsole component
- Add keyboard shortcuts
- Implement tab context menus

### Phase 3: Advanced Features
- Process management for user terminals
- Tab persistence
- Terminal configuration options
- Performance optimizations

### Phase 4: Polish and Testing
- Comprehensive testing suite
- Error handling improvements
- Accessibility features
- Documentation updates

## Migration Strategy

### Backward Compatibility
1. **Preserve System Messages**: The first tab will always be "System Messages" showing app output
2. **Gradual Migration**: Existing `appOutputAtom` will be mapped to the system messages session
3. **API Compatibility**: No changes to existing IPC interfaces initially

### Data Migration
```typescript
// Migration function to convert existing app output
function migrateExistingOutput(appOutput: AppOutput[]): TerminalSession {
  return {
    id: 'system-messages',
    name: 'System Messages',
    type: 'system',
    output: appOutput,
    isActive: true,
    createdAt: Date.now(),
    lastActivity: Date.now()
  };
}
```

## Performance Considerations

### Output Management
- Implement circular buffer for terminal output (max 10,000 lines per session)
- Lazy loading for inactive terminal content
- Efficient re-rendering using React.memo and useMemo

### Memory Management
- Automatic cleanup of closed terminal sessions
- Process monitoring and cleanup
- Garbage collection for old output data

### Rendering Optimization
- Virtual scrolling for large output
- Debounced updates for high-frequency output
- Efficient diff algorithms for output updates

## Security Considerations

### Process Isolation
- Each terminal session runs with appropriate permissions
- No cross-session data leakage
- Secure process cleanup on session termination

### Input Validation
- Sanitize all terminal input/output
- Prevent command injection
- Validate session IDs and commands

### Resource Limits
- Maximum number of concurrent terminals (default: 10)
- CPU and memory limits per terminal process
- Timeout for unresponsive processes