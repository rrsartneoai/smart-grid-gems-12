import { Button } from "@/components/ui/button";
import { useAirQualityData } from "@/services/airQualityService";

const suggestions = [
  "Jaka jest jakość powietrza w okolicy?",
  "Pokaż poziom PM2.5 i PM10",
  "Sprawdź stężenie substancji rakotwórczych",
  "Analiza trendu zanieczyszczeń powietrza",
  "Porównaj jakość powietrza między lokalizacjami"
];

interface ChatSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionsProps) {
  const { data: airQualityData } = useAirQualityData();

  const handleSuggestionClick = (suggestion: string) => {
    if (airQualityData) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}