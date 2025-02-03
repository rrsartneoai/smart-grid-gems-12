import { Button } from "@/components/ui/button";
import { FileText, Image } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";

export const ExportData = () => {
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
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('raport-czujnikow.pdf');
      
      toast({
        title: "Sukces",
        description: "Raport został wyeksportowany do PDF",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować raportu do PDF",
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
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = 'raport-czujnikow.jpg';
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Sukces",
        description: "Raport został wyeksportowany do JPG",
      });
    } catch (error) {
      console.error('Error exporting to JPG:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować raportu do JPG",
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
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'raport-czujnikow.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sukces",
        description: "Raport został wyeksportowany do TXT",
      });
    } catch (error) {
      console.error('Error exporting to TXT:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować raportu do TXT",
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
        <FileText className="w-4 h-4" />
        Eksportuj do TXT
      </Button>
    </div>
  );
};