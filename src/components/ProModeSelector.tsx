import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sparkles, Info } from "lucide-react";
import { useSettings } from "@/hooks/useSettings";
import { IpcClient } from "@/ipc/ipc_client";
import { hasDyadProKey, type UserSettings } from "@/lib/schemas";

export function ProModeSelector() {
  const { settings, updateSettings } = useSettings();

  const toggleWebSearch = () => {
    updateSettings({
      enableProWebSearch: !settings?.enableProWebSearch,
    });
  };

  const toggleLazyEdits = () => {
    updateSettings({
      enableProLazyEditsMode: !settings?.enableProLazyEditsMode,
    });
  };

  const handleSmartContextChange = (
    newValue: "off" | "conservative" | "balanced",
  ) => {
    if (newValue === "off") {
      updateSettings({
        enableProSmartFilesContextMode: false,
        proSmartContextOption: undefined,
      });
    } else if (newValue === "conservative") {
      updateSettings({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: "conservative",
      });
    } else if (newValue === "balanced") {
      updateSettings({
        enableProSmartFilesContextMode: true,
        proSmartContextOption: "balanced",
      });
    }
  };

  const toggleProEnabled = () => {
    updateSettings({
      enableDyadPro: !settings?.enableDyadPro,
    });
  };

  const hasProKey = settings ? hasDyadProKey(settings) : false;
  const proModeTogglable = hasProKey && Boolean(settings?.enableDyadPro);

  return (
    <Popover>
      <Tooltip>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="has-[>svg]:px-2 flex items-center gap-1.5 h-7 border-border/50 hover:bg-muted/50 font-normal transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-foreground font-normal text-xs">Pro</span>
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent>Configure Dyad Pro settings</TooltipContent>
      </Tooltip>
      <PopoverContent className="w-64 p-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="text-xs font-medium flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-white/70" />
              <span className="text-white">Dyad Pro</span>
            </h4>
            <div className="h-px bg-white/10" />
          </div>
          {/* Unlock Pro modes button removed for self-hosting */}
          <div className="flex flex-col gap-3">
            <SelectorRow
              id="pro-enabled"
              label="Enable Dyad Pro"
              description="Use Dyad Pro AI credits"
              tooltip="Uses Dyad Pro AI credits for the main AI model and Pro modes."
              isTogglable={hasProKey}
              settingEnabled={Boolean(settings?.enableDyadPro)}
              toggle={toggleProEnabled}
            />
            <SelectorRow
              id="web-search"
              label="Web Search"
              description="Search the web for information"
              tooltip="Uses the web to search for information"
              isTogglable={proModeTogglable}
              settingEnabled={Boolean(settings?.enableProWebSearch)}
              toggle={toggleWebSearch}
            />
            <SelectorRow
              id="lazy-edits"
              label="Turbo Edits"
              description="Makes file edits faster and cheaper"
              tooltip="Uses a faster, cheaper model to generate full file updates."
              isTogglable={proModeTogglable}
              settingEnabled={Boolean(settings?.enableProLazyEditsMode)}
              toggle={toggleLazyEdits}
            />
            <SmartContextSelector
              isTogglable={proModeTogglable}
              settings={settings}
              onValueChange={handleSmartContextChange}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SelectorRow({
  id,
  label,
  description,
  tooltip,
  isTogglable,
  settingEnabled,
  toggle,
}: {
  id: string;
  label: string;
  description: string;
  tooltip: string;
  isTogglable: boolean;
  settingEnabled: boolean;
  toggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="space-y-0.5 flex-1">
        <Label
          htmlFor={id}
          className={`text-xs ${!isTogglable ? "text-white/30" : "text-white/90"}`}
        >
          {label}
        </Label>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                className={`h-3 w-3 cursor-help ${!isTogglable ? "text-white/30" : "text-white/50"}`}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-60">
              {tooltip}
            </TooltipContent>
          </Tooltip>
          <p
            className={`text-[10px] ${!isTogglable ? "text-white/30" : "text-white/50"} max-w-44`}
          >
            {description}
          </p>
        </div>
      </div>
      <Switch
        id={id}
        checked={isTogglable ? settingEnabled : false}
        onCheckedChange={toggle}
        disabled={!isTogglable}
      />
    </div>
  );
}

function SmartContextSelector({
  isTogglable,
  settings,
  onValueChange,
}: {
  isTogglable: boolean;
  settings: UserSettings | null;
  onValueChange: (value: "off" | "conservative" | "balanced") => void;
}) {
  // Determine current value based on settings
  const getCurrentValue = (): "off" | "conservative" | "balanced" => {
    if (!settings?.enableProSmartFilesContextMode) {
      return "off";
    }
    if (settings?.proSmartContextOption === "balanced") {
      return "balanced";
    }
    if (settings?.proSmartContextOption === "conservative") {
      return "conservative";
    }
    // Keep in sync with getModelClient in get_model_client.ts
    // If enabled but no option set (undefined/falsey), it's balanced
    return "balanced";
  };

  const currentValue = getCurrentValue();

  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <Label className={`text-xs ${!isTogglable ? "text-white/30" : "text-white/90"}`}>
          Smart Context
        </Label>
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Info
                className={`h-3 w-3 cursor-help ${!isTogglable ? "text-white/30" : "text-white/50"}`}
              />
            </TooltipTrigger>
            <TooltipContent side="right" className="max-w-60">
              Improve efficiency and save credits working on large codebases.
            </TooltipContent>
          </Tooltip>
          <p
            className={`text-[10px] ${!isTogglable ? "text-white/30" : "text-white/50"}`}
          >
            Optimizes your AI's code context
          </p>
        </div>
      </div>
      <div className="inline-flex rounded-md border border-white/15">
        <Button
          variant={currentValue === "off" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("off")}
          disabled={!isTogglable}
          className="rounded-r-none border-r border-white/15 h-6 px-2 text-[10px] flex-shrink-0 bg-transparent hover:bg-white/10"
        >
          Off
        </Button>
        <Button
          variant={currentValue === "conservative" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("conservative")}
          disabled={!isTogglable}
          className="rounded-none border-r border-white/15 h-6 px-2 text-[10px] flex-shrink-0 bg-transparent hover:bg-white/10"
        >
          Conservative
        </Button>
        <Button
          variant={currentValue === "balanced" ? "default" : "ghost"}
          size="sm"
          onClick={() => onValueChange("balanced")}
          disabled={!isTogglable}
          className="rounded-l-none h-6 px-2 text-[10px] flex-shrink-0 bg-transparent hover:bg-white/10"
        >
          Balanced
        </Button>
      </div>
    </div>
  );
}
