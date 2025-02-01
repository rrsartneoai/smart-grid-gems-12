import { Button } from "@/components/ui/button";

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
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="text-sm"
          onClick={() => onSuggestionClick(suggestion)}
        >
          {suggestion}
        </Button>
      ))}
    </div>
  );
}