import { BookOpen, GraduationCap } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { vocabularySets } from "@/data/vocabulary";

interface AppSidebarProps {
  selectedSet: number;
  onSelectSet: (id: number) => void;
}

export function AppSidebar({ selectedSet, onSelectSet }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-sidebar-foreground leading-tight">مُفْرَدَات</h2>
            <p className="text-[11px] text-muted-foreground leading-tight">Vocabulaire Arabe</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-80px)]">
          <SidebarGroup>
            <SidebarGroupLabel className="text-[11px] uppercase tracking-wider">
              Séries de vocabulaire
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {vocabularySets.map((set) => (
                  <SidebarMenuItem key={set.id}>
                    <SidebarMenuButton
                      onClick={() => onSelectSet(set.id)}
                      data-active={selectedSet === set.id}
                      className="data-[active=true]:bg-sidebar-accent"
                      data-testid={`sidebar-set-${set.id}`}
                    >
                      <BookOpen className="h-3.5 w-3.5" />
                      <div className="flex items-center justify-between w-full gap-1">
                        <span className="text-xs truncate">N°{set.id}</span>
                        <span className="font-arabic text-xs text-muted-foreground truncate">{set.titleAr}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}
