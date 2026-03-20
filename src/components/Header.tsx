import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navLinkClass = (active: boolean) =>
  `inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
    active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
  }`;


const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Spacio logo" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-xl font-bold text-navy">Spacio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {/* À propos dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={navLinkClass(isActive("/missions") || isActive("/equipe"))}>
                À propos <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/missions" className="w-full">Missions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/equipe" className="w-full">L'équipe</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/diagnostic" className={navLinkClass(isActive("/diagnostic"))}>
            Diagnostic
          </Link>
          <Link to="/explorer" className={navLinkClass(isActive("/explorer"))}>
            Trouver un espace
          </Link>
          <Link to="/devenir-hote" className={navLinkClass(isActive("/devenir-hote"))}>
            Devenir hôte
          </Link>
          <Link to="/blog" className={navLinkClass(isActive("/blog"))}>
            Blog
          </Link>
        </nav>

        {/* Auth */}
        <div className="hidden items-center gap-2 md:flex">
          {!loading && !user ? (
            <Link to="/connexion">
              <Button size="sm" className="rounded-2xl gap-2 px-5">
                <LogIn className="h-4 w-4" /> Connexion
              </Button>
            </Link>
          ) : !loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={signOut} className="gap-2 text-destructive">
                  <LogOut className="h-4 w-4" /> Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">À propos</p>
            <Link to="/missions" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Missions
            </Link>
            <Link to="/equipe" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              L'équipe
            </Link>

            <div className="my-1 border-t border-border" />

            <Link to="/diagnostic" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Diagnostic
            </Link>
            <Link to="/explorer" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Trouver un espace
            </Link>
            <Link to="/devenir-hote" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Devenir hôte
            </Link>
            <Link to="/blog" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>

            <div className="my-1 border-t border-border" />

            {!loading && !user ? (
              <Link to="/connexion" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-2xl gap-2">
                  <LogIn className="h-4 w-4" /> Connexion
                </Button>
              </Link>
            ) : !loading && user ? (
              <>
                <p className="px-4 py-2 text-xs text-muted-foreground">{user.email}</p>
                <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl text-destructive" onClick={() => { signOut(); setMobileOpen(false); }}>
                  <LogOut className="h-4 w-4" /> Déconnexion
                </Button>
              </>
            ) : null}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
