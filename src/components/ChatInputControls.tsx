import { ContextFilesPicker } from "./ContextFilesPicker";
import { ModelPicker } from "./ModelPicker";
import { ProModeSelector } from "./ProModeSelector";
import { ChatModeSelector } from "./ChatModeSelector";

export function ChatInputControls({
  showContextFilesPicker = false,
}: {
  showContextFilesPicker?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <ChatModeSelector />
      <ModelPicker />
      <ProModeSelector />
      {showContextFilesPicker && (
        <ContextFilesPicker />
      )}
    </div>
  );
}
