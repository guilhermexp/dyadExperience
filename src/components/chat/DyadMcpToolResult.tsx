import React, { useMemo, useState } from "react";
import { CheckCircle, ChevronsUpDown, ChevronsDownUp } from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";

interface DyadMcpToolResultProps {
  node?: any;
  children?: React.ReactNode;
}

export const DyadMcpToolResult: React.FC<DyadMcpToolResultProps> = ({
  node,
  children,
}) => {
  const serverName: string = node?.properties?.serverName || "";
  const toolName: string = node?.properties?.toolName || "";
  const [expanded, setExpanded] = useState(false);

  const raw = typeof children === "string" ? children : String(children ?? "");

  const prettyJson = useMemo(() => {
    if (!expanded) return "";
    try {
      const parsed = JSON.parse(raw);
      return JSON.stringify(parsed, null, 2);
    } catch (e) {
      console.error("Error parsing JSON for dyad-mcp-tool-result", e);
      return raw;
    }
  }, [expanded, raw]);

  return (
    <div
      className="relative bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-lg px-3 py-2 border border-white/10 my-2 cursor-pointer transition-all"
      onClick={() => setExpanded((v) => !v)}
    >
      {/* Top-left label badge */}
      <div
        className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 backdrop-blur-sm border border-emerald-500/20"
        style={{ zIndex: 1 }}
      >
        <CheckCircle size={12} className="text-emerald-400" />
        <span>Tool Result</span>
      </div>

      {/* Right chevron */}
      <div className="absolute top-2 right-2 p-1 text-white/40">
        {expanded ? <ChevronsDownUp size={14} /> : <ChevronsUpDown size={14} />}
      </div>

      {/* Header content */}
      <div className="flex items-start gap-2 pl-20 pr-8 py-0.5">
        {serverName ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            {serverName}
          </span>
        ) : null}
        {toolName ? (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
            {toolName}
          </span>
        ) : null}
        {/* Intentionally no preview or content when collapsed */}
      </div>

      {/* JSON content */}
      {expanded ? (
        <div className="mt-2 pr-4 pb-2">
          <CodeHighlight className="language-json">{prettyJson}</CodeHighlight>
        </div>
      ) : null}
    </div>
  );
};
