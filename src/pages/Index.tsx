import { motion } from "framer-motion";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { PowerStats } from "@/components/dashboard/PowerStats";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { FileUpload } from "@/components/FileUpload";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyAnalysis } from "@/components/analysis/CompanyAnalysis";
import { IoTStatus } from "@/components/status/IoTStatus";
import SensorsPanel from "@/components/sensors/SensorsPanel";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useState } from "react";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { Chatbot } from "@/components/Chatbot";
import { NotificationCenter } from "@/components/ui/notifications/NotificationCenter";
import { Tutorial } from "@/components/Tutorial";
import { useHotkeys } from "react-hotkeys-hook";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import EnergyMap from "@/components/map/EnergyMap";
import { DeviceStatus } from "@/components/network/DeviceStatus";
import { NetworkMap } from "@/components/network/NetworkMap";
import { FailureAnalysis } from "@/components/network/FailureAnalysis";
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import '../i18n/config';

const Index = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useHotkeys("?", () => {
    toast({
      title: t("availableShortcuts", "Available keyboard shortcuts"),
      description: "Ctrl+K: Search\nCtrl+/: Help\nCtrl+B: Side menu",
    });
  });

  useHotkeys("ctrl+k", (e) => {
    e.preventDefault();
    toast({
      title: t("search", "Search"),
      description: t("searchComingSoon", "Search functionality coming soon"),
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <Tutorial />
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-transform duration-300 ${
          isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-b">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-4 sm:mb-0">
            <ApiKeySettings />
            <div className="flex flex-col items-center sm:items-start gap-1">
              <h1 className="text-xl font-semibold text-center sm:text-left">
                {t('monitoringPanel')}
              </h1>
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                {t('smartgridDescription')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <LanguageSelector />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('changeLanguage')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <NotificationCenter />
            <DarkModeToggle />
          </div>
        </div>
      </div>

      <div className="pt-28">
        <SidebarProvider>
          <div className="min-h-screen flex w-full flex-col lg:flex-row">
            <CompanySidebar />
            <main className="flex-1 p-4 lg:pl-[320px] transition-all duration-300">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="flex flex-col gap-6"
              >
                <Tabs defaultValue="spaces" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
                    <TabsTrigger value="spaces">{t('spaces')}</TabsTrigger>
                    <TabsTrigger value="insights">{t('analysis')}</TabsTrigger>
                    <TabsTrigger value="status">{t('status')}</TabsTrigger>
                    <TabsTrigger value="sensors">{t('sensors')}</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="spaces" className="space-y-6">
                    <DndContext collisionDetection={closestCenter}>
                      <SortableContext items={[]} strategy={rectSortingStrategy}>
                        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                          <PowerStats />
                        </div>
                      </SortableContext>
                    </DndContext>

                    <div className="grid gap-6">
                      <EnergyChart />
                    </div>

                    <div className="grid gap-6">
                      <DeviceStatus />
                    </div>

                    <div className="grid gap-6">
                      <NetworkMap />
                    </div>

                    <div className="grid gap-6">
                      <FailureAnalysis />
                    </div>

                    <div className="grid gap-6">
                      <EnergyMap />
                    </div>

                    <div className="mt-8 grid gap-8 md:grid-cols-2">
                      <div className="w-full">
                        <h2 className="text-2xl font-bold mb-4">{t('uploadFile')}</h2>
                        <FileUpload />
                      </div>
                      <div className="w-full">
                        <h2 className="text-2xl font-bold mb-4">{t('aiAssistant')}</h2>
                        <Chatbot />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="insights">
                    <CompanyAnalysis />
                  </TabsContent>

                  <TabsContent value="status">
                    <IoTStatus />
                  </TabsContent>

                  <TabsContent value="sensors">
                    <SensorsPanel />
                  </TabsContent>
                </Tabs>
              </motion.div>
            </main>
          </div>
        </SidebarProvider>
        <FloatingChatbot />
      </div>
    </div>
  );
};

export default Index;