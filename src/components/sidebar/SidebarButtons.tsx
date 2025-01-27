import { Button } from "@/components/ui/button";
import { Plus, Bot, UserCog } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface SidebarButtonsProps {
  collapsed?: boolean;
  handleAddCompany: () => void;
}

export function SidebarButtons({ collapsed, handleAddCompany }: SidebarButtonsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
        onClick={handleAddCompany}
      >
        <Plus className="h-4 w-4 mr-2" />
        {!collapsed && <span>Dodaj projekt</span>}
      </Button>
      <Button
        variant="outline"
        className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
        onClick={() => navigate('/assistant')}
      >
        <Bot className="h-4 w-4 mr-2" />
        {!collapsed && <span>Asystent AI [RAG]</span>}
      </Button>
      <Button
        variant="outline"
        className={`w-full justify-start ${collapsed ? "px-2" : ""}`}
        onClick={() => navigate('/admin')}
      >
        <UserCog className="h-4 w-4 mr-2" />
        {!collapsed && <span>Admin login</span>}
      </Button>
    </div>
  );
}