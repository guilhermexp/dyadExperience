import { appOutputAtom } from "@/atoms/appAtoms";
import { useAtomValue } from "jotai";

// Console component
export const Console = () => {
  const appOutput = useAtomValue(appOutputAtom);
  return (
    <div className="font-mono text-xs px-4 py-2 h-full overflow-auto bg-black/20 dark:bg-black/40">
      {appOutput.map((output, index) => (
        <div key={index} className="py-0.5 leading-relaxed opacity-90">
          {output.message}
        </div>
      ))}
    </div>
  );
};
