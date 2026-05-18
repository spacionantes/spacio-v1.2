import { useEffect, useState, type ComponentType, Component, type ReactNode } from "react";
import { ClipboardCheck, Lightbulb, Handshake, ArrowRight, Building2, Heart, ChevronDown, Users } from "lucide-react";
import { Typewriter } from "@/components/ui/typewriter-text";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { useListings } from "@/hooks/useListings";
import FeaturedSpaces from "@/components/FeaturedSpaces";
import { ParallaxRichContent } from "@/components/ui/text-parallax-content-scroll";
import Seo from "@/components/Seo";

class SplineErrorBoundary extends Component<{ children: ReactNode; onError?: () => void }, { hasError: boolean }> {
  constructor(props: { children: ReactNode; onError?: () => void }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

const SplineScene = () => {
  const [SplineComponent, setSplineComponent] = useState<ComponentType<{ scene: string }> | null>(null);
  const [failed, setFailed] = useState(false);
  const [visible, setVisible] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    // Skip Spline entirely on mobile, low-end devices, reduced-motion, or data-saver
    if (typeof window === "undefined") return;
    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // @ts-expect-error - non-standard
    const saveData = navigator.connection?.saveData;
    // @ts-expect-error - non-standard
    const lowMem = (navigator.deviceMemory ?? 8) < 4;
    if (isMobile || reducedMotion || saveData || lowMem) return;

    // Wait for the page to be fully idle before even thinking about Spline
    const idle = (cb: () => void) => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback;
      if (ric) ric(cb, { timeout: 3000 });
      else setTimeout(cb, 1500);
    };
    const t = setTimeout(() => idle(() => setShouldLoad(true)), 800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;
    let mounted = true;
    import("@splinetool/react-spline")
      .then((mod) => {
        if (!mounted) return;
        setSplineComponent(() => mod.default as ComponentType<{ scene: string }>);
        setTimeout(() => mounted && setVisible(true), 100);
      })
      .catch(() => mounted && setFailed(true));
    return () => { mounted = false; };
  }, [shouldLoad]);

  if (failed || !SplineComponent) return null;

  return (
    <SplineErrorBoundary onError={() => setFailed(true)}>
      <div style={{ opacity: visible ? 1 : 0, transition: "opacity 0.5s ease" }} className="w-full h-full">
        <SplineComponent scene="https://prod.spline.design/P521XWBOsGLegwiX/scene.splinecode" />
      </div>
    </SplineErrorBoundary>
  );
};

const steps = [
  {
    icon: ClipboardCheck,
    title: "Explorez les espaces",
    description: "Parcourez nos offres. Un espace vous plaît ? Envoyer une demande, nous vous recontacterons dans les 24h.",
    color: "bg-pastel-blue",
    number: "01",
    tint: "from-indigo/25 via-indigo/5 to-transparent",
    border: "border-indigo/30 hover:border-indigo/60",
    glow: "hover:shadow-[0_20px_60px_-15px_hsl(var(--indigo)/0.6)]",
    numberColor: "text-indigo/50",
  },
  {
    icon: Lightbulb,
    title: "Faites vous conseiller",
    description: "Spacio prend le relais : nous vérifions la compatibilité d'usage, et nous nous occupons de tous les détails.",
    color: "bg-pastel-orange",
    number: "02",
    tint: "from-amber/30 via-amber/5 to-transparent",
    border: "border-amber/30 hover:border-amber/60",
    glow: "hover:shadow-[0_20px_60px_-15px_hsl(var(--amber)/0.6)]",
    numberColor: "text-amber/60",
  },
  {
    icon: Handshake,
    title: "Rencontrez vous ! ",
    description: "Nous organisons la mise en relation avec le propriétaire de l'espace. Une fois la rencontre validée, tout est prêt pour accueillir vos activités !",
    color: "bg-pastel-green",
    number: "03",
    tint: "from-emerald-400/25 via-emerald-400/5 to-transparent",
    border: "border-emerald-400/30 hover:border-emerald-400/60",
    glow: "hover:shadow-[0_20px_60px_-15px_rgba(52,211,153,0.5)]",
    numberColor: "text-emerald-400/50",
  },
];




const Index = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { data: spaces = [] } = useListings();

  const spaceTypes = [
    { label: "Tout voir", value: "" },
    ...[...new Set(spaces.map((s) => s.type))].sort().map((t) => ({ label: t, value: t })),
  ];

  return (
    <Layout>
    <Seo
      title="Spacio – Mutualisation d'espaces solidaires à Nantes"
      description="Spacio met en relation associations de l'ESS et propriétaires d'espaces inutilisés à Nantes. Trouvez ou proposez un local en quelques clics."
      path="/"
    />
    {/* Hero */}
    <section className="relative z-10 overflow-hidden bg-[#0B0D19] py-20 border-0 mx-0 lg:py-0">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-[10%] -right-[10%] h-[600px] w-[600px] rounded-full bg-[#5D69D6]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-[10%] -left-[5%] h-[400px] w-[400px] rounded-full bg-orange-500/10 blur-[100px]" />

      <div className="container relative">
        <div className="relative">
          {/* Spline 3D — full background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -right-[5%] top-1/2 -translate-y-1/2 w-[65%] h-[100%] lg:w-[55%] lg:h-[120%]">
              <SplineScene />
            </div>
          </div>

          {/* Text + dropdown — foreground */}
          <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10 text-left py-16 lg:py-24 max-w-2xl ml-4 lg:ml-16 space-y-7">


            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trouvez l'espace{" "}
              <span className="relative inline-block whitespace-nowrap align-bottom" style={{ minWidth: "6em" }}>
                <Typewriter
                  text={["parfait", "idéal", "adapté"]}
                  speed={120}
                  deleteSpeed={60}
                  delay={2000}
                  loop={true}
                  cursor="|"
                  className="text-gradient-primary italic font-serif"
                />
              </span>
              <br className="hidden lg:block" />
              pour votre <span className="text-gradient-vibrant text-amber-400 font-serif italic">association</span>
            </h1>

            <p className="max-w-xl text-lg text-justify font-light text-slate-300/90">
              Spacio est un service clé en main qui met à disposition les locaux inutilisés de propriétaires d'espaces à destination des structures qui œuvrent pour le bien commun.
            </p>

            {/* Space type selector — glowing */}
            <div className="group relative max-w-md">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#5D69D6] to-orange-500 opacity-25 blur transition duration-700 group-hover:opacity-40" />
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative flex w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#161930] px-5 py-3 text-left text-white shadow-2xl transition-colors hover:bg-[#1a1e3a]">
                <div className="flex-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-500">Recherche</span>
                  <span className="block text-base font-medium text-white/90">Quel type d'espace cherchez-vous ?</span>
                </div>
                <ChevronDown className={`h-5 w-5 text-white/60 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {dropdownOpen &&
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-white/15 bg-[hsl(230,50%,8%)]/95 shadow-2xl scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/20">

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

            {/* Social proof */}
            <div className="flex items-center gap-3 border-t border-white/10 pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber/20 text-amber ring-1 ring-amber/40 shadow-[0_0_20px_hsl(var(--amber)/0.4)]">
                <Users className="h-5 w-5" />
              </div>
              <div className="text-sm leading-tight">
                <p className="font-bold text-white">Un réseau d'associations</p>
                <p className="text-slate-400">déjà engagées via Spacio</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Featured spaces */}
    <FeaturedSpaces />

    {/* How it works — animated scroll timeline */}
    <section id="how-it-works" className="relative bg-[#0B0D19] py-20 lg:py-28 overflow-hidden">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute top-1/4 -left-20 h-[500px] w-[500px] rounded-full bg-indigo/20 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-20 h-[500px] w-[500px] rounded-full bg-amber/15 blur-[140px]" />

      <div className="container relative">
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          className="mb-20 text-center">

          <h2 className="mb-3 text-3xl font-bold text-white sm:text-4xl lg:text-5xl" style={{ color: 'white' }}>Comment ça marche ?</h2>
          <p className="text-slate-400">Un accompagnement en 3 étapes clés</p>
        </motion.div>

        {/* Vertical timeline */}
        <div className="relative mx-auto max-w-4xl">
          {/* Animated vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px -translate-x-1/2 bg-border lg:left-1/2" aria-hidden="true">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              style={{ originY: 0 }}
              className="h-full w-full bg-gradient-to-b from-[#5D69D6] via-amber-400 to-orange-500"
            />
          </div>

          <div className="space-y-16 lg:space-y-24">
            {steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex items-start gap-6 lg:gap-0 ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"}`}>

                  {/* Dot on timeline */}
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: 0.3, type: "spring", stiffness: 200 }}
                    className="absolute left-8 top-2 -translate-x-1/2 lg:left-1/2 z-10">
                    <div className="relative flex h-6 w-6 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#5D69D6] opacity-40" />
                      <span className="relative inline-flex h-6 w-6 items-center justify-center rounded-full bg-indigo ring-4 ring-[#0B0D19] shadow-[0_0_20px_hsl(var(--indigo)/0.8)]">
                        <span className="h-2 w-2 rounded-full bg-white" />
                      </span>
                    </div>
                  </motion.div>

                  {/* Card */}
                  <div className={`ml-16 lg:ml-0 lg:w-[calc(50%-3rem)] ${isLeft ? "lg:pr-12 lg:text-right" : "lg:pl-12"}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.08] backdrop-blur-sm p-6 shadow-2xl transition-all hover:bg-white/[0.11] lg:p-8 ${step.border} ${step.glow}`}>

                      {/* Colored tint gradient */}
                      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${step.tint} opacity-80`} />

                      <div className={`relative mb-4 flex items-center gap-3 ${isLeft ? "lg:flex-row-reverse" : ""}`}>
                        <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${step.color} shrink-0 shadow-lg`}>
                          <step.icon className="h-6 w-6 text-foreground" />
                        </div>
                        <span className={`text-3xl font-black ${step.numberColor}`}>{step.number}</span>
                      </div>
                      <h3 className="relative mb-2 text-lg font-bold text-white lg:text-xl">{step.title}</h3>
                      <p className="relative text-sm leading-relaxed text-slate-300 text-justify">{step.description}</p>
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side on desktop */}
                  <div className="hidden lg:block lg:w-[calc(50%-3rem)]" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>

    {/* Solution for all */}
    <section className="relative overflow-hidden bg-background py-20">
      {/* Ambient glows: indigo (hosts) left, amber (associations) right */}
      <div className="pointer-events-none absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-indigo/10 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-1/4 -right-32 h-[500px] w-[500px] rounded-full bg-amber/15 blur-[140px]" />

      <div className="container relative">
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center">

          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Une solution pour tous</h2>
          <p className="text-muted-foreground">
            <span className="font-semibold text-indigo">Propriétaires</span>
            {" "}&{" "}
            <span className="font-semibold text-amber-dark">Associations</span>
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Owners card — INDIGO */}
          <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative">

            <div className="pointer-events-none absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-indigo/40 to-indigo-glow/40 opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />

            <div className="relative h-full overflow-hidden rounded-3xl border border-indigo/20 bg-card p-8 shadow-sm transition-shadow group-hover:shadow-elegant lg:p-10">
              {/* Corner glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-indigo/20 blur-3xl" />

              <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo to-indigo-glow text-primary-foreground shadow-[0_8px_24px_-4px_hsl(var(--indigo)/0.5)]">
                <Building2 className="h-6 w-6" />
              </div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-indigo/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo">
                <span className="h-1 w-1 rounded-full bg-indigo" />
                Hôtes
              </div>
              <h3 className="mb-3 text-2xl font-bold">Propriétaires</h3>
              <p className="mb-6 leading-relaxed text-muted-foreground text-base text-justify">
                Valorisez vos espaces inutilisés en les mettant à disposition d'acteurs de l'ESS. Gérez vos réservations, fixez vos prix et contribuez à la vie locale.
              </p>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-indigo">✓</span> Renforcez concrètement vos engagements RSE</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-indigo">✓</span> Faites rayonner votre établissement</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-indigo">✓</span> Optimisez vos coûts en mutualisant vos charges</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-indigo">✓</span> Créez des synergies entre collaborateurs et bénéficiaires</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-indigo">✓</span> Donnez vie à vos espaces inoccupés</li>
              </ul>
            </div>
          </motion.div>

          {/* Associations card — AMBER */}
          <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative">

            <div className="pointer-events-none absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-amber/40 to-amber-light/40 opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60" />

            <div className="relative h-full overflow-hidden rounded-3xl border border-amber/30 bg-card p-8 shadow-sm transition-shadow group-hover:shadow-warm lg:p-10">
              {/* Corner glow */}
              <div className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full bg-amber/25 blur-3xl" />

              <div className="relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber to-amber-light text-white shadow-[0_8px_24px_-4px_hsl(var(--amber)/0.5)]">
                <Heart className="h-6 w-6" />
              </div>
              <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-amber/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-amber-dark">
                <span className="h-1 w-1 rounded-full bg-amber" />
                Associations
              </div>
              <h3 className="mb-3 text-2xl font-bold">Associations</h3>
              <p className="mb-6 leading-relaxed text-muted-foreground text-base text-justify">
                Trouvez des espaces abordables et adaptés pour vos réunions, activités… Réservez en quelques clics et concentrez-vous sur l'essentiel.
              </p>
              <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-dark">✓</span> Trouvez rapidement un espace adapté à vos besoins</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-dark">✓</span> Réservez simplement, en quelques clics</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-dark">✓</span> Accédez à des tarifs solidaires et avantageux</li>
                <li className="flex items-start gap-2"><span className="mt-0.5 text-amber-dark">✓</span> Créez des synergies entre bénéficiaires et acteurs locaux</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>);

};


export default Index;