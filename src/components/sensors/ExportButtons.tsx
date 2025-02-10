import { Button } from "@/components/ui/button";
import { FileText, Image } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

interface ExportButtonsProps {
  containerClassName: string;
}

export const ExportButtons = ({ containerClassName }: ExportButtonsProps) => {
  const { toast } = useToast();

  const getCurrentDateTime = () => {
    return format(new Date(), "dd-MM-yyyy_HH-mm", { locale: pl });
  };

  const handleExportPDF = async () => {
    try {
      const element = document.querySelector(`.${containerClassName}`);
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
        logging: true,
        allowTaint: true,
        foreignObjectRendering: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (document) => {
          const element = document.querySelector(`.${containerClassName}`);
          if (element) {
            element.classList.add('pdf-export');
          }
        }
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
        compress: true,
        putOnlyUsedFonts: true,
        floatPrecision: 16
      });

      pdf.addFont("https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf", "Roboto", "normal");
      pdf.setFont("Roboto");
      pdf.setLanguage("pl");
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      const x = (pdfWidth - finalWidth) / 2;
      const y = (pdfHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`raport-czujnikow_${containerClassName}_${getCurrentDateTime()}.pdf`);
      
      toast({
        title: "Sukces",
        description: "Raport został wyeksportowany do PDF",
      });
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      toast({
        variant: "destructive",
        title: "Błąd",
        description: "Nie udało się wyeksportować raportu do PDF: " + error.message,
      });
    }
  };

  const handleExportJPG = async () => {
    try {
      const element = document.querySelector(`.${containerClassName}`);
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
        logging: false,
        allowTaint: true,
        foreignObjectRendering: true
      });
      
      const link = document.createElement('a');
      link.download = `raport-czujnikow_${containerClassName}_${getCurrentDateTime()}.jpg`;
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
      const element = document.querySelector(`.${containerClassName}`);
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
      link.download = `raport-czujnikow_${containerClassName}_${getCurrentDateTime()}.txt`;
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
      <Button 
        onClick={handleExportPDF} 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-primary/10"
      >
        <FileText className="w-4 h-4" />
        Eksportuj do PDF
      </Button>
      <Button 
        onClick={handleExportJPG} 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-primary/10"
      >
        <Image className="w-4 h-4" />
        Eksportuj do JPG
      </Button>
      <Button 
        onClick={handleExportTXT} 
        variant="outline" 
        className="flex items-center gap-2 hover:bg-primary/10"
      >
        <FileText className="w-4 h-4" />
        Eksportuj do TXT
      </Button>
    </div>
  );
};
