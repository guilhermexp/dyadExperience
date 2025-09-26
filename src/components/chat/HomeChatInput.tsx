import { SendIcon, StopCircleIcon } from "lucide-react";

import { useSettings } from "@/hooks/useSettings";
import { homeChatInputValueAtom } from "@/atoms/chatAtoms"; // Use a different atom for home input
import { useAtom } from "jotai";
import { useStreamChat } from "@/hooks/useStreamChat";
import { useAttachments } from "@/hooks/useAttachments";
import { AttachmentsList } from "./AttachmentsList";
import { DragDropOverlay } from "./DragDropOverlay";
import { FileAttachmentDropdown } from "./FileAttachmentDropdown";
import { usePostHog } from "posthog-js/react";
import { HomeSubmitOptions } from "@/pages/home";
import { ChatInputControls } from "../ChatInputControls";
import { LexicalChatInput } from "./LexicalChatInput";
export function HomeChatInput({
  onSubmit,
}: {
  onSubmit: (options?: HomeSubmitOptions) => void;
}) {
  const posthog = usePostHog();
  const [inputValue, setInputValue] = useAtom(homeChatInputValueAtom);
  const { settings } = useSettings();
  const { isStreaming } = useStreamChat({
    hasChatId: false,
  }); // eslint-disable-line @typescript-eslint/no-unused-vars

  // Use the attachments hook
  const {
    attachments,
    isDraggingOver,
    handleFileSelect,
    removeAttachment,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    clearAttachments,
    handlePaste,
  } = useAttachments();

  // Custom submit function that wraps the provided onSubmit
  const handleCustomSubmit = () => {
    if ((!inputValue.trim() && attachments.length === 0) || isStreaming) {
      return;
    }

    // Call the parent's onSubmit handler with attachments
    onSubmit({ attachments });

    // Clear attachments as part of submission process
    clearAttachments();
    posthog.capture("chat:home_submit");
  };

  if (!settings) {
    return null; // Or loading state
  }

  return (
    <>
      <div className="p-6" data-testid="home-chat-input-container">
        <div
          className={`relative flex flex-col space-y-3 border border-border/50 rounded-2xl bg-card/50 backdrop-blur-sm shadow-lg min-h-[80px] ${
            isDraggingOver ? "ring-2 ring-primary border-primary" : ""
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Attachments list */}
          <AttachmentsList
            attachments={attachments}
            onRemove={removeAttachment}
          />

          {/* Drag and drop overlay */}
          <DragDropOverlay isDraggingOver={isDraggingOver} />

          <div className="flex items-start space-x-3 p-2">
            <LexicalChatInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleCustomSubmit}
              onPaste={handlePaste}
              placeholder="What would you like to create today?"
              disabled={isStreaming}
              excludeCurrentApp={false}
            />

            {/* File attachment dropdown */}
            <FileAttachmentDropdown
              className="mt-2 mr-2"
              onFileSelect={handleFileSelect}
              disabled={isStreaming}
            />

            {isStreaming ? (
              <button
                className="px-3 py-3 mt-2 mr-3 text-muted-foreground rounded-xl opacity-50 cursor-not-allowed" // Indicate disabled state
                title="Cancel generation (unavailable here)"
              >
                <StopCircleIcon size={20} />
              </button>
            ) : (
              <button
                onClick={handleCustomSubmit}
                disabled={!inputValue.trim() && attachments.length === 0}
                className="px-3 py-3 mt-2 mr-3 hover:bg-accent text-foreground rounded-xl disabled:opacity-50 transition-colors"
                title="Send message"
              >
                <SendIcon size={20} />
              </button>
            )}
          </div>
          <div className="px-3 pb-3">
            <ChatInputControls />
          </div>
        </div>
      </div>
    </>
  );
}
