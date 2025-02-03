import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bot, Save, FileText, FilePdf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { pl } from "date-fns/locale";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  messages: Array<{ role: string; content: string; timestamp: Date }>;
}

export function ChatHeader({ messages }: ChatHeaderProps) {
  const { toast } = useToast();

  const handleSaveAsPDF = () => {
    try {
      const doc = new jsPDF();
      
      doc.setFont("helvetica");
      doc.setFontSize(16);
      doc.text("Historia rozmowy z Asystentem Smart Grid", 20, 20);
      
      let yPosition = 40;
      messages.forEach((msg) => {
        const time = format(msg.timestamp, "HH:mm", { locale: pl });
        const role = msg.role === "user" ? "Użytkownik" : "Asystent";
        const lines = doc.splitTextToSize(`[${time}] ${role}: ${msg.content}`, 170);
        
        if (yPosition + (lines.length * 10) > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        lines.forEach((line: string) => {
          doc.setFontSize(10);
          doc.text(line, 20, yPosition);
          yPosition += 7;
        });
        yPosition += 5;
      });
      
      doc.save(`chat-history-${format(new Date(), "yyyy-MM-dd-HH-mm")}.pdf`);
      
      toast({
        title: "Sukces",
        description: "Historia rozmowy została zapisana do pliku PDF",
      });
    } catch (error) {
      console.error('Error saving as PDF:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się zapisać historii do PDF",
      });
    }
  };

  const handleSaveAsTXT = () => {
    try {
      const historyText = messages
        .map((msg) => {
          const time = format(msg.timestamp, "HH:mm", { locale: pl });
          return `[${time}] ${msg.role === "user" ? "Użytkownik" : "Asystent"}: ${msg.content}`;
        })
        .join("\n\n");

      const blob = new Blob([historyText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `chat-history-${format(new Date(), "yyyy-MM-dd-HH-mm")}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Sukces",
        description: "Historia rozmowy została zapisana do pliku TXT",
      });
    } catch (error) {
      console.error('Error saving as TXT:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się zapisać historii do TXT",
      });
    }
  };

  return (
    <div className="p-4 border-b flex items-center justify-between bg-card">
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 shadow-sm">
          <AvatarImage src="/lovable-uploads/045f69f0-5424-4c58-a887-6e9e984d428b.png" />
          <AvatarFallback><Bot className="h-6 w-6" /></AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold tracking-tight">Asystent Smart Grid</h3>
          <p className="text-sm text-muted-foreground">Monitorowanie jakości powietrza</p>
        </div>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="shadow-sm">
            <Save className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSaveAsPDF} className="flex items-center gap-2">
            <FilePdf className="h-4 w-4" />
            Zapisz jako PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSaveAsTXT} className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Zapisz jako TXT
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}