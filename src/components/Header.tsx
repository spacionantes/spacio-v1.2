import { useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User as UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavCursor } from "@/components/ui/nav-header";
import logo from "@/assets/logo.png";

const tabClass =
  "relative z-10 inline-flex items-center gap-1 cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-sm bg-transparent border-0 outline-none";

const navLinkClass = (active: boolean) =>
  `inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
    active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
  }`;

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cursor, setCursor] = useState({ left: 0, width: 0, opacity: 0 });
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const aboutRef = useRef<HTMLButtonElement>(null);
  const ownerRef = useRef<HTMLButtonElement>(null);
  const explorerRef = useRef<HTMLButtonElement>(null);
  const blogRef = useRef<HTMLButtonElement>(null);

  const onEnter = (el: HTMLElement | null) => {
    if (!el) return;
    setCursor({ width: el.getBoundingClientRect().width, left: el.offsetLeft, opacity: 1 });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Spacio logo" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-xl font-bold text-navy">Spacio</span>
        </Link>

        {/* Desktop nav — centered, animated pill cursor */}
        <ul
          onMouseLeave={() => setCursor((pv) => ({ ...pv, opacity: 0 }))}
          className="absolute left-1/2 hidden -translate-x-1/2 rounded-full border-2 border-foreground bg-background p-1 md:flex"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                ref={aboutRef}
                onMouseEnter={() => onEnter(aboutRef.current)}
                className={tabClass}
              >
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

          <button
            ref={explorerRef}
            onMouseEnter={() => onEnter(explorerRef.current)}
            onClick={() => navigate("/explorer")}
            className={tabClass}
          >
            Trouver un espace
          </button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                ref={ownerRef}
                onMouseEnter={() => onEnter(ownerRef.current)}
                className={tabClass}
              >
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

          <button
            ref={blogRef}
            onMouseEnter={() => onEnter(blogRef.current)}
            onClick={() => navigate("/blog")}
            className={tabClass}
          >
            Blog
          </button>

          <NavCursor position={cursor} />
        </ul>

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
