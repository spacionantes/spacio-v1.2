import { Link } from "react-router-dom";
import { Linkedin } from "lucide-react";
import logo from "@/assets/logo.png";

const footerLinks = {
  Plateforme: [
    { label: "Trouver un espace", href: "/explorer" },
    { label: "Commencer", href: "/commencer" },
    { label: "Blog", href: "/blog" },
  ],
  Entreprise: [
    { label: "Équipe", href: "/equipe" },
  ],
  Ressources: [
    { label: "FAQ", href: "/faq" },
    { label: "Réseau", href: "/reseau" },
  ],
  Légal: [
    { label: "CGU", href: "/legal#cgu" },
    { label: "Politique de confidentialité", href: "/legal#confidentialite" },
    { label: "Mentions légales", href: "/legal#mentions" },
    { label: "Cookies", href: "/legal#cookies" },
  ],
};

const Footer = () => (
  <footer className="relative overflow-hidden bg-[hsl(230,50%,6%)] text-white/80">
    {/* Gradient orbs */}
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,hsl(25,80%,60%,0.35),hsl(0,70%,55%,0.15),transparent_70%)] blur-3xl" />
      <div className="absolute -right-32 bottom-1/4 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,hsl(220,60%,60%,0.3),hsl(270,50%,50%,0.15),transparent_70%)] blur-3xl" />
      <div className="absolute left-1/2 bottom-1/3 -translate-x-1/2 h-[250px] w-[250px] rounded-full bg-[radial-gradient(circle,hsl(330,50%,60%,0.2),transparent_70%)] blur-3xl" />
    </div>

    <div className="container relative py-16">
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <img src={logo} alt="Spacio logo" className="h-9 w-9 rounded-xl object-contain" />
            <span className="text-xl font-bold text-white">Spacio</span>
          </div>
          <p className="text-sm leading-relaxed opacity-70">
            La marketplace d'espaces pour les associations. Trouvez ou proposez des lieux adaptés.
          </p>
          <a
            href="https://www.linkedin.com/company/spacio-nantes"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors hover:bg-white/10"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="mb-4 text-sm font-semibold text-white">{title}</h4>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm opacity-60 transition-opacity hover:opacity-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs opacity-50">
        © {new Date().getFullYear()} Spacio. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
