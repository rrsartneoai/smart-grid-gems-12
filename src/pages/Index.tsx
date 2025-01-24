import { motion, useScroll, useTransform } from "framer-motion";
import { EnergyChart } from "@/components/dashboard/EnergyChart";
import { PowerStats } from "@/components/dashboard/PowerStats";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import { FileUpload } from "@/components/FileUpload";
import { ApiKeySettings } from "@/components/settings/ApiKeySettings";
import { CompanySidebar } from "@/components/CompanySidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import SensorsPanel from "@/components/sensors/SensorsPanel";
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import { useEffect, useRef } from "react";
import { FloatingChatbot } from "@/components/FloatingChatbot";
import { Chatbot } from "@/components/Chatbot";
import { NotificationCenter } from "@/components/ui/notifications/NotificationCenter";
import { Tutorial } from "@/components/Tutorial";
import { useHotkeys } from "react-hotkeys-hook";
import { useToast } from "@/hooks/use-toast";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from 'react-i18next';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ExperimentsPanel } from "@/components/experiments/ExperimentsPanel";
import '../i18n/config';

// ... keep existing code (imports and initial setup)

const Index = () => {
  const { toast } = useToast();
  const { t } = useTranslation();
  const spacesRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0]);
  const headerTranslateY = useTransform(scrollY, [0, 100], [0, -100]);

  const handleExport = async (format: 'pdf' | 'jpg') => {
    if (!spacesRef.current) return;

    try {
      const canvas = await html2canvas(spacesRef.current);
      
      if (format === 'pdf') {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('przestrzenie-export.pdf');
        
        toast({
          title: "Eksport zakończony",
          description: "Plik PDF został pobrany",
        });
      } else {
        const link = document.createElement('a');
        link.download = 'przestrzenie-export.jpg';
        link.href = canvas.toDataURL('image/jpeg');
        link.click();
        
        toast({
          title: "Eksport zakończony",
          description: "Plik JPG został pobrany",
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Błąd eksportu",
        description: "Nie udało się wyeksportować sekcji",
        variant: "destructive",
      });
    }
  };

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
      <motion.div 
        className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        style={{
          opacity: headerOpacity,
          y: headerTranslateY
        }}
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
                  <p>{t('changeLanguage', 'Change language')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <NotificationCenter />
            <DarkModeToggle />
          </div>
        </div>
      </motion.div>
      
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
                <Tabs defaultValue="sensors" className="w-full">
                  <TabsList className="w-full justify-start overflow-x-auto flex-wrap">
                    <TabsTrigger value="sensors">{t('sensors')}</TabsTrigger>
                    <TabsTrigger value="experiments">Eksperymenty</TabsTrigger>
                  </TabsList>

                  <TabsContent value="sensors">
                    <SensorsPanel />
                  </TabsContent>

                  <TabsContent value="experiments">
                    <ExperimentsPanel />
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
