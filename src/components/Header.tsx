import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Comment ça marche", href: "/#how-it-works" },
  { label: "Trouver un espace", href: "/explorer" },
  { label: "Diagnostic", href: "/diagnostic" },
  { label: "Blog", href: "/blog" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, loading, signOut } = useAuth();

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "?";

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Spacio logo" className="h-9 w-9 rounded-xl object-contain" />
          <span className="text-xl font-bold text-navy">Spacio</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                location.pathname === item.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {!loading && !user ? (
            <>
              <Link to="/connexion">
                <Button variant="ghost" size="sm" className="rounded-2xl gap-2 text-muted-foreground hover:text-foreground">
                  <LogIn className="h-4 w-4" /> Connexion
                </Button>
              </Link>
              <Link to="/inscription">
                <Button size="sm" className="rounded-2xl gap-2 shadow-sm px-5">
                  <UserPlus className="h-4 w-4" /> Créer un compte
                </Button>
              </Link>
              <Link to="/commencer">
                <Button className="rounded-2xl px-6 font-semibold">Commencer</Button>
              </Link>
            </>
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
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {!loading && !user ? (
              <>
                <Link to="/connexion" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2 rounded-xl">
                    <LogIn className="h-4 w-4" /> Connexion
                  </Button>
                </Link>
                <Link to="/inscription" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full justify-start gap-2 rounded-xl">
                    <UserPlus className="h-4 w-4" /> Créer un compte
                  </Button>
                </Link>
                <Link to="/commencer" onClick={() => setMobileOpen(false)}>
                  <Button className="mt-2 w-full rounded-2xl font-semibold">Commencer</Button>
                </Link>
              </>
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
