import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const tutorialSteps = [
  {
    title: "Witaj w Systemie Monitorowania Jakości Powietrza",
    description: "Ten panel pomoże Ci monitorować i analizować jakość powietrza w regionie pomorskim. Przeprowadzimy Cię przez najważniejsze funkcje systemu."
  },
  {
    title: "Asystent Smart Grid",
    description: "Kliknij w przycisk 'Asystent Smart Grid' aby zadać pytania dotyczące jakości powietrza w Twojej okolicy. Asystent pomoże Ci zinterpretować dane i udzieli szczegółowych informacji."
  },
  {
    title: "Mapa Jakości Powietrza",
    description: "Sprawdź interaktywną mapę pokazującą poziomy zanieczyszczeń w różnych lokalizacjach. Możesz porównać dane między miastami i zobaczyć trendy czasowe."
  },
  {
    title: "Czujniki i Pomiary",
    description: "Panel czujników pokazuje aktualne odczyty PM2.5, PM10, oraz innych substancji w powietrzu. Kliknij w poszczególne kafelki, aby zobaczyć szczegółowe statystyki."
  },
  {
    title: "Analiza Danych",
    description: "W sekcji 'Dane z Pomorskiego' znajdziesz szczegółowe analizy jakości powietrza dla każdego miasta, historyczne trendy i prognozy."
  },
  {
    title: "Alerty i Powiadomienia",
    description: "System automatycznie powiadomi Cię o przekroczeniu norm jakości powietrza lub wysokim stężeniu substancji szkodliwych."
  }
];

export function Tutorial() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem("hasSeenTutorial");
    if (!hasSeenTutorial) {
      setIsOpen(true);
    }
  }, []);

  const handleNext = () => {
    if (currentStep < tutorialSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsOpen(false);
      localStorage.setItem("hasSeenTutorial", "true");
    }
  };

  const handleSkip = () => {
    setIsOpen(false);
    localStorage.setItem("hasSeenTutorial", "true");
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {tutorialSteps[currentStep].title}
            </DialogTitle>
            <DialogDescription className="mt-4 text-base leading-relaxed">
              {tutorialSteps[currentStep].description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between mt-8">
            <Button variant="ghost" onClick={handleSkip} className="hover:bg-secondary">
              Pomiń
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentStep + 1} z {tutorialSteps.length}
              </span>
              <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                {currentStep === tutorialSteps.length - 1 ? "Zakończ" : "Dalej"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Button
        variant="outline"
        onClick={handleRestart}
        className="fixed bottom-4 right-4 z-50"
      >
        Pokaż samouczek
      </Button>
    </>
  );
}