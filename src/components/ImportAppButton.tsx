import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useState } from "react";
import { ImportAppDialog } from "./ImportAppDialog";
import { cn } from "@/lib/utils";

interface ImportAppButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function ImportAppButton({
  variant = "default",
  size = "default",
  className,
  children,
}: ImportAppButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={cn(className)}
        onClick={() => setIsDialogOpen(true)}
      >
        {children || (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Import App
          </>
        )}
      </Button>
      <ImportAppDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </>
  );
}
