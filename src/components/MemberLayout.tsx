import { Outlet, NavLink, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  CalendarDays,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/logo.png";

const MemberSidebar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const items = [
    { title: "Mes demandes", url: "/dashboard", icon: LayoutDashboard },
    { title: "Mon agenda", url: "/agenda", icon: CalendarDays },
    { title: "Mon profil", url: "/profil", icon: User },
  ];

  const { pathname } = useLocation();
  const isActive = (path: string) => pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 text-foreground">
            <img src={logo} alt="Spacio" className="h-6 w-6 rounded-lg object-contain" />
            <span className="font-bold">Espace membre</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="Paramètres">
                  <NavLink to="/profil" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Paramètres</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => { signOut(); navigate("/"); }}
                  tooltip="Déconnexion"
                  className="text-destructive"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Déconnexion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="px-3 py-2 text-xs text-muted-foreground">
          {user?.email}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const MemberLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <MemberSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center border-b border-border bg-background/80 backdrop-blur-lg px-4">
            <SidebarTrigger className="mr-2" />
            <span className="text-sm font-medium text-muted-foreground">Espace membre</span>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MemberLayout;
