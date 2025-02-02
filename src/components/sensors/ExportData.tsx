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
      
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2,
        useCORS: true,
        logging: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm'
      });
      
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('dane-czujnikow.pdf');
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do PDF",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych do PDF",
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
        logging: true
      });
      
      const link = document.createElement('a');
      link.download = 'dane-czujnikow.jpg';
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do JPG",
      });
    } catch (error) {
      console.error('Error exporting to JPG:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych do JPG",
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
      link.download = 'dane-czujnikow.txt';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Sukces",
        description: "Dane zostały wyeksportowane do TXT",
      });
    } catch (error) {
      console.error('Error exporting to TXT:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować danych do TXT",
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