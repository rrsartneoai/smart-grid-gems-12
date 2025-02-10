
import { Button } from "@/components/ui/button";
import { useAirQualityData } from "@/services/airQualityService";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const suggestions = [
  {
    text: "Jaka jest jakość powietrza w okolicy?",
    tooltip: "Sprawdź aktualny stan jakości powietrza w Twojej lokalizacji, w tym indeks jakości powietrza i główne zanieczyszczenia"
  },
  {
    text: "Pokaż poziom PM2.5 i PM10",
    tooltip: "Zobacz szczegółowe pomiary pyłów zawieszonych PM2.5 i PM10, które są głównymi wskaźnikami zanieczyszczenia powietrza"
  },
  {
    text: "Sprawdź poziomy substancji szczególnie niebezpiecznych dla zdrowia, w tym NO₂, SO₂, O₃ i CO",
    tooltip: "Sprawdź poziomy substancji szczególnie niebezpiecznych dla zdrowia, w tym NO₂, SO₂, O₃ i CO"
  },
  {
    text: "Analiza trendu zanieczyszczeń powietrza",
    tooltip: "Zobacz jak zmieniają się poziomy zanieczyszczeń w czasie i poznaj prognozy na najbliższe godziny"
  },
  {
    text: "Opowiedz mi o wpływie zanieczyszczeń na środowisko i zdrowie",
    tooltip: "Dowiedz się więcej o wpływie zanieczyszczeń powietrza na ekosystem i zdrowie człowieka"
  }
];

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const { data: airQualityData } = useAirQualityData();
  const { toast } = useToast();

  const handleSuggestionClick = (suggestion: string) => {
    if (!airQualityData) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie można pobrać danych o jakości powietrza. Spróbuj ponownie później.",
      });
      return;
    }
    onSuggestionClick(suggestion);
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {suggestions.map((suggestion, index) => (
        <TooltipProvider key={index}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative inline-flex items-center w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-sm pr-8 whitespace-normal text-left h-auto py-2 min-h-[2.5rem]"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                >
                  {suggestion.text}
                  <Info className="w-4 h-4 ml-2 absolute right-2 text-muted-foreground" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start">
              <p className="max-w-xs">{suggestion.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
