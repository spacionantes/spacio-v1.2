import { motion } from "framer-motion";

const partners = [
  "Mairie de Paris",
  "Fondation Agir",
  "Croix-Rouge",
  "SNCF Foundation",
  "BPI France",
  "Caisse des Dépôts",
  "La Poste",
  "Région Île-de-France",
  "France Active",
  "Harmonie Mutuelle",
];

const PartnerMarquee = () => {
  const doubled = [...partners, ...partners];

  return (
    <section className="overflow-hidden border-b border-border bg-background py-5">
      <p className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Ils nous font confiance
      </p>
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-background to-transparent" />
        <motion.div
          className="flex w-max items-center gap-12"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        >
          {doubled.map((name, i) => (
            <div
              key={i}
              className="flex h-10 shrink-0 items-center rounded-lg border border-border bg-muted/50 px-6"
            >
              <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground">
                {name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PartnerMarquee;
