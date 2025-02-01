import { Button } from "@/components/ui/button";
import { FileText, Image, FileJson } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

interface ExportDataProps {
  onExport: () => void;
}

export const ExportData = ({ onExport }: ExportDataProps) => {
  const { toast } = useToast();

  const handleExportPDF = async () => {
    try {
      const element = document.querySelector('.sensors-panel');
      if (!element) {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie znaleziono danych do eksportu",
        });
        return;
      }
      
      const canvas = await html2canvas(element as HTMLElement);
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save('dane-czujnikow.pdf');
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do PDF",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych",
      });
    }
  };

  const handleExportJPG = async () => {
    try {
      const element = document.querySelector('.sensors-panel');
      if (!element) {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie znaleziono danych do eksportu",
        });
        return;
      }
      
      const canvas = await html2canvas(element as HTMLElement);
      const link = document.createElement('a');
      link.download = 'dane-czujnikow.jpg';
      link.href = canvas.toDataURL('image/jpeg');
      link.click();
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do JPG",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych",
      });
    }
  };

  const handleExportTXT = () => {
    try {
      const element = document.querySelector('.sensors-panel');
      if (!element) {
        toast({
          variant: "destructive",
          title: "Błąd",
          description: "Nie znaleziono danych do eksportu",
        });
        return;
      }
      
      const text = element.textContent || '';
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'dane-czujnikow.txt';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do TXT",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych",
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2 p-4">
      <Button onClick={handleExportPDF} variant="outline" className="flex items-center gap-2">
        <FileText className="w-4 h-4" />
        Eksportuj do PDF
      </Button>
      <Button onClick={handleExportJPG} variant="outline" className="flex items-center gap-2">
        <Image className="w-4 h-4" />
        Eksportuj do JPG
      </Button>
      <Button onClick={handleExportTXT} variant="outline" className="flex items-center gap-2">
        <FileJson className="w-4 h-4" />
        Eksportuj do TXT
      </Button>
    </div>
  );
};