import React, { useState } from "react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";
import { useMcp } from "@/hooks/useMcp";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function McpToolsPicker() {
  const [isOpen, setIsOpen] = useState(false);
  const { servers, toolsByServer, consentsMap, setToolConsent } = useMcp();

  // Removed activation toggling – consent governs execution time behavior

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                className="p-2 hover:bg-accent/50 rounded-lg transition-colors"
                size="sm"
                data-testid="mcp-tools-button"
              >
                <Wrench className="size-4" />
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent>Tools</TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <PopoverContent
        className="w-80 max-h-96 overflow-y-auto p-3"
        align="start"
      >
        <div className="space-y-3">
          <div>
            <h3 className="text-xs font-medium text-white">Tools (MCP)</h3>
            <p className="text-[10px] text-white/50 mt-0.5">
              Enable tools from your configured MCP servers.
            </p>
          </div>
          {servers.length === 0 ? (
            <div className="rounded-md border border-white/15 border-dashed p-3 text-center text-xs text-white/50">
              No MCP servers configured. Configure them in Settings → Tools
              (MCP).
            </div>
          ) : (
            <div className="space-y-2">
              {servers.map((s) => (
                <div key={s.id} className="border border-white/15 rounded-md p-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-xs text-white truncate">{s.name}</div>
                    {s.enabled ? (
                      <Badge variant="secondary">Enabled</Badge>
                    ) : (
                      <Badge variant="outline">Disabled</Badge>
                    )}
                  </div>
                  <div className="mt-1.5 space-y-1">
                    {(toolsByServer[s.id] || []).map((t) => (
                      <div
                        key={t.name}
                        className="flex items-center justify-between gap-2 rounded border border-white/10 p-1.5"
                      >
                        <div className="min-w-0">
                          <div className="font-mono text-[10px] text-white/90 truncate">
                            {t.name}
                          </div>
                          {t.description && (
                            <div className="text-[9px] text-white/50 truncate">
                              {t.description}
                            </div>
                          )}
                        </div>
                        <Select
                          value={
                            consentsMap[`${s.id}:${t.name}`] ||
                            t.consent ||
                            "ask"
                          }
                          onValueChange={(v) =>
                            setToolConsent(s.id, t.name, v as any)
                          }
                        >
                          <SelectTrigger className="w-[100px] h-6">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ask">Ask</SelectItem>
                            <SelectItem value="always">Always allow</SelectItem>
                            <SelectItem value="denied">Deny</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                    {(toolsByServer[s.id] || []).length === 0 && (
                      <div className="text-[10px] text-white/50">
                        No tools discovered.
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
