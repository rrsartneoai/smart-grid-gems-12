import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Message } from "@/types/chat";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  messages: Message[];
}

export const ChatHeader = ({ messages }: ChatHeaderProps) => {
  const { toast } = useToast();

  const handleExport = async (format: 'pdf' | 'txt') => {
    const content = messages
      .map((msg) => `${msg.role === 'assistant' ? 'Asystent' : 'Użytkownik'}: ${msg.content}`)
      .join('\n\n');

    if (format === 'txt') {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'rozmowa-asystent.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sukces",
        description: "Rozmowa została zapisana w formacie TXT",
      });
    } else if (format === 'pdf') {
      try {
        const doc = new jsPDF();
        doc.setFont("helvetica");
        doc.setLanguage("pl");
        
        const splitText = doc.splitTextToSize(content, 180);
        let yPosition = 20;
        
        for (let i = 0; i < splitText.length; i++) {
          if (yPosition > 280) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(splitText[i], 15, yPosition);
          yPosition += 7;
        }
        
        doc.save("rozmowa-asystent.pdf");
        
        toast({
          title: "Sukces",
          description: "Rozmowa została zapisana w formacie PDF",
        });
      } catch (error) {
        console.error('Error exporting to PDF:', error);
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie udało się wyeksportować do PDF. Spróbuj ponownie.",
        });
      }
    }
  };

  return (
    <div className="flex items-center justify-between border-b px-4 py-2">
      <div className="flex items-center gap-2">
        <h2 className="text-lg font-semibold">Asystent AI</h2>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleExport('pdf')}
          title="Eksportuj do PDF"
        >
          <FileText className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => handleExport('txt')}
          title="Eksportuj do TXT"
        >
          <FileText className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};