import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { IpcClient } from "@/ipc/ipc_client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AppUpgrade } from "@/ipc/ipc_types";

export function AppUpgrades({ appId }: { appId: number | null }) {
  const queryClient = useQueryClient();

  const {
    data: upgrades,
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["app-upgrades", appId],
    queryFn: () => {
      if (!appId) {
        return Promise.resolve([]);
      }
      return IpcClient.getInstance().getAppUpgrades({ appId });
    },
    enabled: !!appId,
  });

  const {
    mutate: executeUpgrade,
    isPending: isUpgrading,
    error: mutationError,
    variables: upgradingVariables,
  } = useMutation({
    mutationFn: (upgradeId: string) => {
      if (!appId) {
        throw new Error("appId is not set");
      }
      return IpcClient.getInstance().executeAppUpgrade({
        appId,
        upgradeId,
      });
    },
    onSuccess: (_, upgradeId) => {
      queryClient.invalidateQueries({ queryKey: ["app-upgrades", appId] });
      if (upgradeId === "capacitor") {
        // Capacitor upgrade is done, so we need to invalidate the Capacitor
        // query to show the new status.
        queryClient.invalidateQueries({ queryKey: ["is-capacitor", appId] });
      }
    },
  });

  const handleUpgrade = (upgradeId: string) => {
    executeUpgrade(upgradeId);
  };

  if (!appId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2 text-white">
          App Upgrades
        </h3>
        <Loader2 className="h-4 w-4 animate-spin text-white/60" />
      </div>
    );
  }

  if (queryError) {
    return (
      <div className="mt-4">
        <h3 className="text-sm font-semibold mb-2 text-white">
          App Upgrades
        </h3>
        <Alert variant="destructive">
          <AlertTitle>Error loading upgrades</AlertTitle>
          <AlertDescription>{queryError.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const currentUpgrades = upgrades?.filter((u) => u.isNeeded) ?? [];

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold mb-2 text-white">
        App Upgrades
      </h3>
      {currentUpgrades.length === 0 ? (
        <div
          data-testid="no-app-upgrades-needed"
          className="p-3 bg-green-500/10 border border-green-500/20 backdrop-blur-sm rounded-lg text-xs text-green-400"
        >
          App is up-to-date and has all Dyad capabilities enabled
        </div>
      ) : (
        <div className="space-y-4">
          {currentUpgrades.map((upgrade: AppUpgrade) => (
            <div
              key={upgrade.id}
              className="p-3 border border-white/10 bg-white/5 backdrop-blur-sm rounded-lg flex justify-between items-start"
            >
              <div className="flex-grow">
                <h4 className="font-semibold text-white text-xs">
                  {upgrade.title}
                </h4>
                <p className="text-[10px] text-white/60 mt-1">
                  {upgrade.description}
                </p>
                {mutationError && upgradingVariables === upgrade.id && (
                  <Alert
                    variant="destructive"
                    className="mt-2"
                  >
                    <Terminal className="h-3 w-3" />
                    <AlertTitle className="text-red-400 text-xs">
                      Upgrade Failed
                    </AlertTitle>
                    <AlertDescription className="text-[10px] text-red-400">
                      {(mutationError as Error).message}{" "}
                      <a
                        onClick={(e) => {
                          e.stopPropagation();
                          IpcClient.getInstance().openExternalUrl(
                            upgrade.manualUpgradeUrl ?? "https://dyad.sh/docs",
                          );
                        }}
                        className="underline font-medium hover:text-red-300"
                      >
                        Manual Upgrade Instructions
                      </a>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              <Button
                onClick={() => handleUpgrade(upgrade.id)}
                disabled={isUpgrading && upgradingVariables === upgrade.id}
                className="ml-3 flex-shrink-0 h-7 text-xs bg-white/10 border-white/15 hover:bg-white/20 text-white"
                size="sm"
                data-testid={`app-upgrade-${upgrade.id}`}
              >
                {isUpgrading && upgradingVariables === upgrade.id ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : null}
                Upgrade
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
