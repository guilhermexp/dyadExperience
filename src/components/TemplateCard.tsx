import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { IpcClient } from "@/ipc/ipc_client";
import { useSettings } from "@/hooks/useSettings";
import { CommunityCodeConsentDialog } from "./CommunityCodeConsentDialog";
import type { Template } from "@/shared/templates";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { showWarning } from "@/lib/toast";

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onSelect: (templateId: string) => void;
  onCreateApp: () => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  isSelected,
  onSelect,
  onCreateApp,
}) => {
  const { settings, updateSettings } = useSettings();
  const [showConsentDialog, setShowConsentDialog] = useState(false);

  const handleCardClick = () => {
    // If it's a community template and user hasn't accepted community code yet, show dialog
    if (!template.isOfficial && !settings?.acceptedCommunityCode) {
      setShowConsentDialog(true);
      return;
    }

    if (template.requiresNeon && !settings?.neon?.accessToken) {
      showWarning("Please connect your Neon account to use this template.");
      return;
    }

    // Otherwise, proceed with selection
    onSelect(template.id);
  };

  const handleConsentAccept = () => {
    // Update settings to accept community code
    updateSettings({ acceptedCommunityCode: true });

    // Select the template
    onSelect(template.id);

    // Close dialog
    setShowConsentDialog(false);
  };

  const handleConsentCancel = () => {
    // Just close dialog, don't update settings or select template
    setShowConsentDialog(false);
  };

  const handleGithubClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (template.githubUrl) {
      IpcClient.getInstance().openExternalUrl(template.githubUrl);
    }
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`
          bg-card dark:bg-white/5 backdrop-blur-md rounded-lg border overflow-hidden
          transform transition-all duration-200 ease-in-out
          cursor-pointer group relative
          ${
            isSelected
              ? "border-primary dark:border-white/30 shadow-xl scale-[1.02]"
              : "border-border dark:border-white/15 hover:border-primary/50 dark:hover:border-white/25 hover:shadow-lg hover:scale-[1.01]"
          }
        `}
      >
        <div className="relative">
          <img
            src={template.imageUrl}
            alt={template.title}
            className={`w-full h-32 object-cover transition-opacity duration-300 group-hover:opacity-90 ${
              isSelected ? "opacity-90" : "opacity-80"
            }`}
          />
          {isSelected && (
            <span className="absolute top-2 right-2 bg-primary/20 dark:bg-white/20 backdrop-blur-md border border-primary/30 dark:border-white/30 text-primary-foreground dark:text-white text-[10px] font-medium px-2 py-1 rounded-md shadow-lg">
              Selected
            </span>
          )}
        </div>
        <div className="p-2.5">
          <div className="flex justify-between items-center mb-0.5">
            <h2
              className={`text-xs font-medium ${
                isSelected
                  ? "text-foreground dark:text-white"
                  : "text-foreground dark:text-white/90"
              }`}
            >
              {template.title}
            </h2>
            {template.isOfficial && !template.isExperimental && (
              <span
                className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${
                  isSelected
                    ? "bg-primary/20 dark:bg-white/20 text-primary dark:text-white border border-primary/30 dark:border-white/30"
                    : "bg-green-50 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/30"
                }`}
              >
                Official
              </span>
            )}
            {template.isExperimental && (
              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30">
                Experimental
              </span>
            )}
          </div>
          <p className="text-[10px] text-muted-foreground dark:text-white/50 mb-2 h-6 overflow-hidden line-clamp-2 leading-3">
            {template.description}
          </p>
          {template.githubUrl && (
            <a
              className={`inline-flex items-center text-[10px] font-medium transition-colors duration-200 ${
                isSelected
                  ? "text-foreground dark:text-white/90 hover:text-foreground dark:hover:text-white"
                  : "text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white/90"
              }`}
              onClick={handleGithubClick}
            >
              View on GitHub{" "}
              <ArrowLeft className="w-3 h-3 ml-0.5 transform rotate-180" />
            </a>
          )}

          <Button
            onClick={(e) => {
              e.stopPropagation();
              onCreateApp();
            }}
            size="sm"
            className={cn(
              "w-full h-7 bg-muted dark:bg-white/10 hover:bg-muted/80 dark:hover:bg-white/15 border border-border dark:border-white/20 text-foreground dark:text-white text-[10px] font-medium mt-1.5 transition-all",
              settings?.selectedTemplateId !== template.id && "invisible",
            )}
          >
            Create App
          </Button>
        </div>
      </div>

      <CommunityCodeConsentDialog
        isOpen={showConsentDialog}
        onAccept={handleConsentAccept}
        onCancel={handleConsentCancel}
      />
    </>
  );
};
