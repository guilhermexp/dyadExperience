import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useSettings } from "@/hooks/useSettings";
import { useTemplates } from "@/hooks/useTemplates";
import { TemplateCard } from "@/components/TemplateCard";
import { CreateAppDialog } from "@/components/CreateAppDialog";
import { NeonConnector } from "@/components/NeonConnector";

const HubPage: React.FC = () => {
  const router = useRouter();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { templates, isLoading } = useTemplates();
  const { settings, updateSettings } = useSettings();
  const selectedTemplateId = settings?.selectedTemplateId;

  const handleTemplateSelect = (templateId: string) => {
    updateSettings({ selectedTemplateId: templateId });
  };

  const handleCreateApp = () => {
    setIsCreateDialogOpen(true);
  };
  // Separate templates into official and community
  const officialTemplates =
    templates?.filter((template) => template.isOfficial) || [];
  const communityTemplates =
    templates?.filter((template) => !template.isOfficial) || [];

  return (
    <div className="h-screen overflow-y-auto px-6 py-6">
      <div className="max-w-6xl mx-auto pb-12">
        <Button
          onClick={() => router.history.back()}
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 mb-6 text-muted-foreground dark:text-white/70 hover:text-foreground dark:hover:text-white hover:bg-muted dark:hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm">Go Back</span>
        </Button>
        <header className="mb-10 text-left">
          <h1 className="text-2xl font-light text-foreground dark:text-white mb-2">
            Pick your default template
          </h1>
          <p className="text-sm text-muted-foreground dark:text-white/50">
            Choose a starting point for your new project.
            {isLoading && " Loading additional templates..."}
          </p>
        </header>

        {/* Official Templates Section */}
        {officialTemplates.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-foreground dark:text-white mb-4">
              Official templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {officialTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={handleTemplateSelect}
                  onCreateApp={handleCreateApp}
                />
              ))}
            </div>
          </section>
        )}

        {/* Community Templates Section */}
        {communityTemplates.length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-medium text-foreground dark:text-white mb-4">
              Community templates
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {communityTemplates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={template.id === selectedTemplateId}
                  onSelect={handleTemplateSelect}
                  onCreateApp={handleCreateApp}
                />
              ))}
            </div>
          </section>
        )}

        <BackendSection />
      </div>

      <CreateAppDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        template={templates.find((t) => t.id === settings?.selectedTemplateId)}
      />
    </div>
  );
};

function BackendSection() {
  return (
    <div className="">
      <header className="mb-4 text-left">
        <h1 className="text-lg font-medium text-foreground dark:text-white mb-2">
          Backend Services
        </h1>
        <p className="text-sm text-muted-foreground dark:text-white/50">
          Connect to backend services for your projects.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <NeonConnector />
      </div>
    </div>
  );
}

export default HubPage;
