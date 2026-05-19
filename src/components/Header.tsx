import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavTab, NavCursor } from "@/components/ui/nav-header";
import logo from "@/assets/logo.png";

const navLinkClass = (active: boolean) =>
  `inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
    active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
  }`;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Spacio logo" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-xl font-bold text-navy">Spacio</span>
        </Link>

        {/* Desktop nav — centered */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
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

          <Link to="/explorer" className={navLinkClass(isActive("/explorer"))}>
            Trouver un espace
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={navLinkClass(isActive("/diagnostic") || isActive("/devenir-hote"))}>
                Propriétaire d'espace <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/diagnostic" className="w-full">Diagnostic</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/devenir-hote" className="w-full">Devenir hôte</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/blog" className={navLinkClass(isActive("/blog"))}>
            Blog
          </Link>
        </nav>

        {/* Account button */}
        <Link
          to={user ? "/dashboard" : "/auth"}
          className="hidden md:inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
        >
          <UserIcon className="h-4 w-4" />
          {user ? "Mon espace" : "Connexion"}
        </Link>

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

            <Link to="/explorer" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Trouver un espace
            </Link>

            <div className="my-1 border-t border-border" />

            <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Propriétaire d'espace</p>
            <Link to="/diagnostic" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Diagnostic
            </Link>
            <Link to="/devenir-hote" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Devenir hôte
            </Link>

            <div className="my-1 border-t border-border" />

            <Link to="/blog" className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Blog
            </Link>

            <div className="my-1 border-t border-border" />

            <Link to={user ? "/dashboard" : "/auth"} className="rounded-xl px-4 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              {user ? "Mon espace" : "Connexion"}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
