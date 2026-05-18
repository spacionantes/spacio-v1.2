import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import type { LucideIcon } from "lucide-react";

const IMG_PADDING = 12;

interface TextParallaxContentProps {
  imgUrl: string;
  subheading: string;
  heading: string;
  children?: ReactNode;
}

export const TextParallaxContent = ({ imgUrl, subheading, heading, children }: TextParallaxContentProps) => {
  return (
    <div style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[150vh]">
        <StickyImage imgUrl={imgUrl} />
        <OverlayCopy subheading={subheading} heading={heading} />
      </div>
      {children}
    </div>
  );
};

const StickyImage = ({ imgUrl, dim = 0.7 }: { imgUrl: string; dim?: number }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["end end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: `calc(100vh - ${IMG_PADDING * 2}px)`,
        top: IMG_PADDING,
        scale,
      }}
      className="sticky z-0 overflow-hidden rounded-3xl"
    >
      <motion.div
        className="absolute inset-0"
        style={{ opacity, backgroundColor: `rgba(10, 12, 25, ${dim})` }}
      />
    </motion.div>
  );
};

const OverlayCopy = ({ subheading, heading }: { subheading: string; heading: string }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [250, -250]);
  const opacity = useTransform(scrollYProgress, [0.25, 0.5, 0.75], [0, 1, 0]);

  return (
    <motion.div
      ref={targetRef}
      style={{ y, opacity }}
      className="absolute left-0 top-0 flex h-screen w-full flex-col items-center justify-center text-white"
    >
      <p className="mb-2 text-center text-xl md:mb-4 md:text-3xl">{subheading}</p>
      <p className="text-center text-4xl font-bold md:text-7xl">{heading}</p>
    </motion.div>
  );
};

/* ---------------------------------------------------------------------------
 * Variante riche : carte de contenu détaillée ancrée à gauche ou à droite,
 * avec animation parallax synchronisée au scroll. Garde l'identité couleur
 * (indigo / amber) via les props `accent` et `icon`.
 * ------------------------------------------------------------------------- */

interface ParallaxRichContentProps {
  imgUrl: string;
  accent: "indigo" | "amber";
  icon: LucideIcon;
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  align?: "left" | "right";
}

const ACCENTS = {
  indigo: {
    border: "border-indigo/40",
    glow: "shadow-[0_20px_80px_-20px_hsl(var(--indigo)/0.6)]",
    badgeBg: "bg-indigo/15 text-indigo",
    badgeDot: "bg-indigo",
    iconBg: "from-indigo to-indigo-glow",
    check: "text-indigo",
  },
  amber: {
    border: "border-amber/40",
    glow: "shadow-[0_20px_80px_-20px_hsl(var(--amber)/0.5)]",
    badgeBg: "bg-amber/20 text-amber-dark",
    badgeDot: "bg-amber",
    iconBg: "from-amber to-amber-light",
    check: "text-amber-dark",
  },
} as const;

export const ParallaxRichContent = ({
  imgUrl,
  accent,
  icon: Icon,
  badge,
  title,
  description,
  bullets,
  align = "left",
}: ParallaxRichContentProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Carte : apparaît au milieu du scroll, disparaît à la sortie
  const cardOpacity = useTransform(scrollYProgress, [0.15, 0.4, 0.7, 0.9], [0, 1, 1, 0]);
  const cardY = useTransform(scrollYProgress, [0.15, 0.5, 0.9], [80, 0, -80]);

  const a = ACCENTS[accent];

  return (
    <div ref={sectionRef} style={{ paddingLeft: IMG_PADDING, paddingRight: IMG_PADDING }}>
      <div className="relative h-[180vh]">
        <StickyImage imgUrl={imgUrl} dim={0.55} />
        <motion.div
          style={{ opacity: cardOpacity, y: cardY }}
          className={`absolute left-0 top-0 flex h-screen w-full items-center px-4 sm:px-8 lg:px-16 ${
            align === "right" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`relative w-full max-w-xl overflow-hidden rounded-3xl border ${a.border} bg-white/[0.08] backdrop-blur-xl p-6 sm:p-8 lg:p-10 ${a.glow}`}
          >
            <div
              className={`relative mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${a.iconBg} text-white shadow-lg`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div
              className={`mb-3 inline-flex items-center gap-1.5 rounded-full ${a.badgeBg} px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider`}
            >
              <span className={`h-1 w-1 rounded-full ${a.badgeDot}`} />
              {badge}
            </div>
            <h3 className="mb-3 text-2xl font-bold text-white sm:text-3xl">{title}</h3>
            <p className="mb-6 leading-relaxed text-white/85 text-base text-justify">
              {description}
            </p>
            <ul className="space-y-2 text-sm text-white/90">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <span className={`mt-0.5 ${a.check}`}>✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
