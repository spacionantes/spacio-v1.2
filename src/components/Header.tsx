import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, Home, ChevronDown, Mail, MessageSquare, HelpCircle, Bug, Handshake } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const navItems = [
  { label: "Trouver un espace", href: "/explorer" },
  { label: "Diagnostic", href: "/diagnostic" },
  { label: "Blog", href: "/blog" },
];

const contactReasons = [
  { label: "Question générale", icon: HelpCircle, href: "/commencer" },
  { label: "Proposer un espace", icon: Home, href: "/commencer?type=owner" },
  { label: "Partenariat", icon: Handshake, href: "/commencer" },
  { label: "Signaler un problème", icon: Bug, href: "/commencer" },
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
          {/* À propos dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="inline-flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
                À propos <ChevronDown className="h-3.5 w-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44">
              <DropdownMenuItem asChild>
                <Link to="/#how-it-works" className="w-full">Missions</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/equipe" className="w-full">L'équipe</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          {/* Contactez-nous dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-2xl gap-1.5 text-muted-foreground hover:text-foreground">
                <Mail className="h-4 w-4" /> Contactez-nous
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              {contactReasons.map((reason) => (
                <DropdownMenuItem key={reason.label} asChild>
                  <Link to={reason.href} className="flex items-center gap-2 w-full">
                    <reason.icon className="h-4 w-4 text-muted-foreground" />
                    {reason.label}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Devenir hôte */}
          <Link to="/commencer?type=owner">
            <Button variant="outline" size="sm" className="rounded-2xl gap-1.5 border-primary/30 text-primary hover:bg-primary/5">
              <Home className="h-4 w-4" /> Devenir hôte
            </Button>
          </Link>

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
            {/* À propos section */}
            <p className="px-4 pt-2 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">À propos</p>
            <Link to="/#how-it-works" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              Missions
            </Link>
            <Link to="/equipe" className="rounded-xl px-6 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent" onClick={() => setMobileOpen(false)}>
              L'équipe
            </Link>

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

            <div className="my-2 border-t border-border" />

            <Link to="/commencer?type=owner" onClick={() => setMobileOpen(false)}>
              <Button variant="outline" className="w-full justify-start gap-2 rounded-xl border-primary/30 text-primary">
                <Home className="h-4 w-4" /> Devenir hôte
              </Button>
            </Link>

            {/* Contact reasons */}
            <p className="px-4 pt-3 pb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contactez-nous</p>
            {contactReasons.map((reason) => (
              <Link key={reason.label} to={reason.href} className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm text-muted-foreground hover:bg-accent" onClick={() => setMobileOpen(false)}>
                <reason.icon className="h-4 w-4" /> {reason.label}
              </Link>
            ))}

            <div className="my-2 border-t border-border" />

            {!loading && !user ? (
              <Link to="/connexion" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-2xl gap-2">
                  <LogIn className="h-4 w-4" /> Connexion / Inscription
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
