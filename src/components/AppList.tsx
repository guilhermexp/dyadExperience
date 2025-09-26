import { useNavigate } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { PlusCircle, Search } from "lucide-react";
import { useAtom, useSetAtom } from "jotai";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useMemo, useState } from "react";
import { AppSearchDialog } from "./AppSearchDialog";

export function AppList({ show }: { show?: boolean }) {
  const navigate = useNavigate();
  const [selectedAppId, setSelectedAppId] = useAtom(selectedAppIdAtom);
  const setSelectedChatId = useSetAtom(selectedChatIdAtom);
  const { apps, loading, error } = useLoadApps();
  // search dialog state
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const allApps = useMemo(
    () =>
      apps.map((a) => ({
        id: a.id,
        name: a.name,
        createdAt: a.createdAt,
        matchedChatTitle: null,
        matchedChatMessage: null,
      })),
    [apps],
  );
  if (!show) {
    return null;
  }

  const handleAppClick = (id: number) => {
    setSelectedAppId(id);
    setSelectedChatId(null);
    setIsSearchDialogOpen(false);
    navigate({
      to: "/",
      search: { appId: id },
    });
  };

  const handleNewApp = () => {
    navigate({ to: "/" });
    // We'll eventually need a create app workflow
  };

  return (
    <>
      <SidebarGroup
        className="overflow-y-auto h-[calc(100vh-112px)]"
        data-testid="app-list-container"
      >
        <SidebarGroupLabel className="text-white/70 px-4 mb-3">Your Apps</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col space-y-2 px-3">
            <Button
              onClick={handleNewApp}
              variant="ghost"
              className="flex items-center justify-start gap-2 h-9 px-3 hover:bg-white/10 text-white/90 hover:text-white transition-colors rounded-lg"
            >
              <PlusCircle className="h-4 w-4" />
              <span className="text-sm">New App</span>
            </Button>
            <Button
              onClick={() => setIsSearchDialogOpen(!isSearchDialogOpen)}
              variant="ghost"
              className="flex items-center justify-start gap-2 h-9 px-3 hover:bg-white/10 text-white/90 hover:text-white transition-colors rounded-lg"
              data-testid="search-apps-button"
            >
              <Search className="h-4 w-4" />
              <span className="text-sm">Search Apps</span>
            </Button>

            {loading ? (
              <div className="py-2 px-4 text-sm text-gray-500">
                Loading apps...
              </div>
            ) : error ? (
              <div className="py-2 px-4 text-sm text-red-500">
                Error loading apps
              </div>
            ) : apps.length === 0 ? (
              <div className="py-2 px-4 text-sm text-gray-500">
                No apps found
              </div>
            ) : (
              <div className="space-y-1 mt-3" data-testid="app-list">
                {apps.map((app) => (
                  <div key={app.id}>
                    <Button
                      variant="ghost"
                      onClick={() => handleAppClick(app.id)}
                      className={`justify-start w-full text-left px-3 py-2 hover:bg-white/10 transition-colors rounded-lg ${
                        selectedAppId === app.id
                          ? "bg-white/10 text-white border-l-2 border-white/50"
                          : "text-white/80 hover:text-white"
                      }`}
                      data-testid={`app-list-item-${app.name}`}
                    >
                      <div className="flex flex-col w-full">
                        <span className="truncate text-sm font-medium">{app.name}</span>
                        <span className="text-xs text-white/50">
                          {formatDistanceToNow(new Date(app.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </SidebarGroupContent>
      </SidebarGroup>
      <AppSearchDialog
        open={isSearchDialogOpen}
        onOpenChange={setIsSearchDialogOpen}
        onSelectApp={handleAppClick}
        allApps={allApps}
      />
    </>
  );
}
