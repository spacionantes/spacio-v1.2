import { useEffect, useState, type ComponentType } from "react";
import { ClipboardCheck, Lightbulb, Handshake, ArrowRight, Building2, Heart, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const SplineScene = () => {
  const [SplineComponent, setSplineComponent] = useState<ComponentType<{scene: string;}> | null>(null);

  useEffect(() => {
    let mounted = true;

    import("@splinetool/react-spline").
    then((mod) => {
      if (mounted) {
        setSplineComponent(() => mod.default as ComponentType<{scene: string;}>);
      }
    }).
    catch(() => {
      if (mounted) {
        setSplineComponent(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!SplineComponent) {
    return null;
  }

  return <SplineComponent scene="https://prod.spline.design/P521XWBOsGLegwiX/scene.splinecode" />;
};

const steps = [
{
  icon: ClipboardCheck,
  title: "État des lieux",
  description: "Nous analysons vos besoins et votre situation pour identifier les espaces adaptés à votre activité.",
  color: "bg-pastel-blue",
  number: "01"
},
{
  icon: Lightbulb,
  title: "Conseil",
  description: "Nos experts vous accompagnent avec des recommandations personnalisées pour optimiser votre recherche.",
  color: "bg-pastel-orange",
  number: "02"
},
{
  icon: Handshake,
  title: "Mise en relation",
  description: "Nous vous connectons directement avec les propriétaires d'espaces qui correspondent à vos critères.",
  color: "bg-pastel-green",
  number: "03"
}];




const spaceTypes = [
{ label: "Tout voir", value: "" },
{ label: "Salle de réunion", value: "Salle de réunion" },
{ label: "Amphithéâtre", value: "Amphithéâtre" },
{ label: "Cour d'école", value: "Cour d'école" },
{ label: "Salle polyvalente", value: "Salle polyvalente" },
{ label: "Terrain sportif", value: "Terrain sportif" },
{ label: "Espace de coworking", value: "Coworking" },
{ label: "Salle de spectacle", value: "Salle de spectacle" },
{ label: "Gymnase", value: "Gymnase" },
{ label: "Local associatif", value: "Local associatif" },
{ label: "Salle de formation", value: "Salle de formation" },
{ label: "Espace extérieur", value: "Espace extérieur" }];


const Index = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <Layout>
    {/* Hero */}
    <section className="relative z-10 bg-[rgb(10,10,40)] py-20 border-0 mx-0 lg:py-0">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] items-center gap-4">
          {/* Left column — Text + dropdown */}
          <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left py-0 px-0">
              
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trouvez l'espace <span className="text-gradient-primary italic font-serif">parfait</span> pour votre association
            </h1>
            <p className="mb-10 max-w-xl text-lg text-white/70">
              Spacio connecte les associations avec des espaces adaptés à leurs activités. Réservation simple, paiement sécurisé.
            </p>

            {/* Space type selector */}
            <div className="relative max-w-md">
              <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-6 py-4 text-left text-white shadow-lg transition-colors hover:bg-white/15">
                  
                <span className="text-base font-medium text-white/80">Quel type d'espace cherchez-vous ?</span>
                <ChevronDown className={`h-5 w-5 text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/15 bg-[hsl(230,50%,8%)]/95 shadow-2xl">
                  
                  {spaceTypes.map((type) =>
                  <button
                    key={type.value}
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate(type.value ? `/explorer?type=${encodeURIComponent(type.value)}` : "/explorer");
                    }}
                    className="flex w-full items-center gap-3 px-6 py-3.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white">
                    
                      <Building2 className="h-4 w-4 text-primary/80" />
                      {type.label}
                    </button>
                  )}
                </motion.div>
                }
            </div>
          </motion.div>

          {/* Right column — Spline 3D */}
          <div className="h-[400px] lg:h-[650px] pointer-events-none bg-[rgb(10,10,40)]">
            <SplineScene />
          </div>
        </div>
      </div>
    </section>

    {/* How it works */}
    <section id="how-it-works" className="bg-surface-alt py-20 lg:py-28">
      <div className="container">
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center">
            
          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Comment ça marche ?</h2>
          <p className="text-muted-foreground">Un accompagnement en 3 étapes clés</p>
        </motion.div>

        <div className="relative flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:gap-0">
          {steps.map((step, i) =>
            <div key={step.title} className="relative flex flex-1 flex-col items-center lg:flex-row">
              {/* Card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.12 }}
                className="group relative w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 lg:max-w-none">
                
                {/* Step number */}
                <span className="absolute -top-4 left-6 inline-flex h-8 items-center rounded-full bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm">
                  {step.number}
                </span>

                <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl ${step.color}`}>
                  <step.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>

              {/* Arrow connector */}
              {i < steps.length - 1 &&
              <>
                  {/* Desktop arrow */}
                  <div className="hidden lg:flex items-center justify-center px-4 shrink-0">
                    <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.12 }}
                    className="flex items-center gap-1">
                    
                      <div className="h-px w-8 bg-gradient-to-r from-border to-primary/40" />
                      <ArrowRight className="h-5 w-5 text-primary/60" />
                    </motion.div>
                  </div>
                  {/* Mobile arrow */}
                  <div className="flex lg:hidden items-center justify-center py-2">
                    <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: 0.2 + i * 0.12 }}
                    className="flex flex-col items-center gap-1">
                    
                      <div className="w-px h-6 bg-gradient-to-b from-border to-primary/40" />
                      <ArrowRight className="h-5 w-5 text-primary/60 rotate-90" />
                    </motion.div>
                  </div>
                </>
              }
            </div>
            )}
        </div>
      </div>
    </section>

    {/* Solution for all */}
    <section className="py-20">
      <div className="container">
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center">

          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Une solution pour tous</h2>
          <p className="text-muted-foreground">Que vous soyez propriétaire ou association</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Owners card */}
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-orange">
              <Building2 className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Propriétaires</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Rentabilisez vos espaces inutilisés en les mettant à disposition d'associations. Gérez vos réservations, fixez vos prix et contribuez à la vie locale.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Publication gratuite</li>
              <li className="flex items-center gap-2">✓ Calendrier intégré</li>
              <li className="flex items-center gap-2">✓ Paiement sécurisé</li>
            </ul>
          </motion.div>

          {/* Associations card */}
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-purple">
              <Heart className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Associations</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Trouvez des espaces abordables et adaptés pour vos réunions, ateliers, événements. Réservez en quelques clics et concentrez-vous sur l'essentiel.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Recherche par critères</li>
              <li className="flex items-center gap-2">✓ Réservation instantanée</li>
              <li className="flex items-center gap-2">✓ Tarifs associatifs</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>);

};


export default Index;