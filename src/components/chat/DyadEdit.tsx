import type React from "react";
import type { ReactNode } from "react";
import { useState } from "react";
import {
  ChevronsDownUp,
  ChevronsUpDown,
  Loader,
  CircleX,
  Rabbit,
} from "lucide-react";
import { CodeHighlight } from "./CodeHighlight";
import { CustomTagState } from "./stateTypes";

interface DyadEditProps {
  children?: ReactNode;
  node?: any;
  path?: string;
  description?: string;
}

export const DyadEdit: React.FC<DyadEditProps> = ({
  children,
  node,
  path: pathProp,
  description: descriptionProp,
}) => {
  const [isContentVisible, setIsContentVisible] = useState(false);

  // Use props directly if provided, otherwise extract from node
  const path = pathProp || node?.properties?.path || "";
  const description = descriptionProp || node?.properties?.description || "";
  const state = node?.properties?.state as CustomTagState;
  const inProgress = state === "pending";
  const aborted = state === "aborted";

  // Extract filename from path
  const fileName = path ? path.split("/").pop() : "";

  return (
    <div
      className={`bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-lg px-3 py-2 border my-2 cursor-pointer transition-all ${
        inProgress
          ? "border-amber-500/50"
          : aborted
            ? "border-red-500/50"
            : "border-white/10"
      }`}
      onClick={() => setIsContentVisible(!isContentVisible)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Rabbit size={14} className="text-white/60" />
            <span className="bg-blue-500/20 text-blue-400 text-[10px] px-1.5 py-0.5 rounded ml-1 font-medium border border-blue-500/30">
              Turbo Edit
            </span>
          </div>
          {fileName && (
            <span className="text-white/90 font-medium text-xs">
              {fileName}
            </span>
          )}
          {inProgress && (
            <div className="flex items-center text-amber-400 text-[10px]">
              <Loader size={10} className="mr-1 animate-spin" />
              <span>Editing...</span>
            </div>
          )}
          {aborted && (
            <div className="flex items-center text-red-400 text-[10px]">
              <CircleX size={10} className="mr-1" />
              <span>Did not finish</span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {isContentVisible ? (
            <ChevronsDownUp
              size={14}
              className="text-white/40 hover:text-white/60"
            />
          ) : (
            <ChevronsUpDown
              size={14}
              className="text-white/40 hover:text-white/60"
            />
          )}
        </div>
      </div>
      {path && (
        <div className="text-[10px] text-white/50 font-medium mb-1">
          {path}
        </div>
      )}
      {description && (
        <div className="text-xs text-white/70">
          <span className="font-medium">Summary: </span>
          {description}
        </div>
      )}
      {isContentVisible && (
        <div
          className="text-xs cursor-text"
          onClick={(e) => e.stopPropagation()}
        >
          <CodeHighlight className="language-typescript">
            {children}
          </CodeHighlight>
        </div>
      )}
    </div>
  );
};
