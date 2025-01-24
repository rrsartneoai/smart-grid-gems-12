import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, ChevronLeft, ChevronRight, Plus, Archive, RefreshCcw, Search } from "lucide-react";
import { companiesData } from "@/data/companies";
import { create } from "zustand";
import { Button } from "@/components/ui/button";
import { CompanyStoreState } from "@/types/company";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const useCompanyStore = create<CompanyStoreState>((set) => ({
  selectedCompanyId: "1",
  companies: companiesData,
  setSelectedCompanyId: (id: string) => set({ selectedCompanyId: id }),
  addCompany: (company) => set((state) => ({
    companies: [...state.companies, { 
      ...company, 
      id: String(state.companies.length + 1),
      stats: [],
      energyData: [],
      archived: false
    }]
  })),
  archiveCompany: (id: string) => set((state) => ({
    companies: state.companies.map(company => 
      company.id === id ? { ...company, archived: true } : company
    )
  })),
  restoreCompany: (id: string) => set((state) => ({
    companies: state.companies.map(company => 
      company.id === id ? { ...company, archived: false } : company
    )
  })),
}));

export function CompanySidebar() {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { companies, selectedCompanyId, setSelectedCompanyId, addCompany, archiveCompany, restoreCompany } = useCompanyStore();
  const { toast } = useToast();

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleAddCompany = () => {
    if (!newProjectName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa projektu nie może być pusta",
        variant: "destructive"
      });
      return;
    }

    addCompany({
      name: newProjectName,
    });

    setNewProjectName("");
    setIsAddDialogOpen(false);
    toast({
      title: "Sukces",
      description: "Projekt został dodany pomyślnie",
    });
  };

  const handleArchiveCompany = (id: string) => {
    archiveCompany(id);
    toast({
      title: "Zarchiwizowano",
      description: "Projekt został zarchiwizowany",
    });
  };

  const handleRestoreCompany = (id: string) => {
    restoreCompany(id);
    toast({
      title: "Przywrócono",
      description: "Projekt został przywrócony",
    });
  };

  const filteredCompanies = companies.filter(company => 
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    company.archived === showArchived
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] p-0">
        <SidebarContent 
          collapsed={false}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          filteredCompanies={filteredCompanies}
          handleArchiveCompany={handleArchiveCompany}
          handleRestoreCompany={handleRestoreCompany}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          handleAddCompany={handleAddCompany}
        />
      </SheetContent>
      <aside className={`fixed left-0 top-0 z-30 h-screen transition-all duration-300 bg-background border-r ${collapsed ? "w-[60px]" : "w-[300px]"} hidden lg:block`}>
        <Button
          variant="ghost"
          onClick={toggleCollapse}
          className="absolute -right-4 top-4 z-50 flex items-center gap-2"
        >
          {collapsed ? (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="text-sm">Rozwiń</span>
            </>
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span className="text-sm">Zwiń</span>
            </>
          )}
        </Button>
        <SidebarContent 
          collapsed={collapsed}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showArchived={showArchived}
          setShowArchived={setShowArchived}
          filteredCompanies={filteredCompanies}
          handleArchiveCompany={handleArchiveCompany}
          handleRestoreCompany={handleRestoreCompany}
          isAddDialogOpen={isAddDialogOpen}
          setIsAddDialogOpen={setIsAddDialogOpen}
          newProjectName={newProjectName}
          setNewProjectName={setNewProjectName}
          handleAddCompany={handleAddCompany}
        />
      </aside>
    </Sheet>
  );
}

interface SidebarContentProps {
  collapsed: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
  filteredCompanies: typeof companiesData;
  handleArchiveCompany: (id: string) => void;
  handleRestoreCompany: (id: string) => void;
  isAddDialogOpen: boolean;
  setIsAddDialogOpen: (open: boolean) => void;
  newProjectName: string;
  setNewProjectName: (name: string) => void;
  handleAddCompany: () => void;
}

function SidebarContent({ 
  collapsed,
  searchQuery,
  setSearchQuery,
  showArchived,
  setShowArchived,
  filteredCompanies,
  handleArchiveCompany,
  handleRestoreCompany,
  isAddDialogOpen,
  setIsAddDialogOpen,
  newProjectName,
  setNewProjectName,
  handleAddCompany
}: SidebarContentProps) {
  const { selectedCompanyId, setSelectedCompanyId } = useCompanyStore();

  return (
    <div className="flex h-full flex-col gap-4">
      {!collapsed && (
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Projekty</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? <RefreshCcw className="h-4 w-4" /> : <Archive className="h-4 w-4" />}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            {showArchived ? "Zarchiwizowane projekty" : "Aktywne projekty"}
          </p>
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Szukaj projektów..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      )}
      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {filteredCompanies.map((company) => (
            <div key={company.id} className="space-y-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={selectedCompanyId === company.id ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedCompanyId(company.id)}
                >
                  <span>{company.name}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => 
                    company.archived 
                      ? handleRestoreCompany(company.id)
                      : handleArchiveCompany(company.id)
                  }
                >
                  {company.archived ? (
                    <RefreshCcw className="h-4 w-4" />
                  ) : (
                    <Archive className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
          {!showArchived && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className={`${collapsed ? "w-10 p-2" : "w-full"} mt-2`}
                >
                  <Plus className="h-4 w-4" />
                  {!collapsed && <span className="ml-2">Dodaj projekt</span>}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dodaj nowy projekt</DialogTitle>
                  <DialogDescription>
                    Wprowadź nazwę nowego projektu poniżej.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nazwa projektu</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Wprowadź nazwę projektu"
                    />
                  </div>
                </div>
                <Button onClick={handleAddCompany}>Dodaj projekt</Button>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </ScrollArea>
      {!collapsed && (
        <>
          <Separator />
          <div className="p-4">
            <p className="text-xs text-muted-foreground">
              Ostatnia aktualizacja: {new Date().toLocaleString()}
            </p>
          </div>
        </>
      )}
    </div>
  );
}