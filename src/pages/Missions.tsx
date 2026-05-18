import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Eye, Heart, Target } from "lucide-react";
import Seo from "@/components/Seo";

const sections = [
  {
    icon: Target,
    title: "Mission",
    content:
      "Trouver des locaux pour nos associations.",
  },
  {
    icon: Heart,
    title: "Raison d'être",
    content:
      "Les associations répondent à des besoins que les collectivités et l'État peinent parfois à adresser. Les aider c'est soutenir la culture, le lien social et l'ouverture.\n\nSpacio leur permet d'accéder à des espaces adaptés pour pratiquer leurs activités.",
  },
  {
    icon: Eye,
    title: "Vision",
    content:
      "Spacio propose des espaces à chaque association qui en a besoin.\n\nEn mutualisant les lieux de nos partenaires, nous voulons créer un réflexe de partage et rompre avec la monofonction des bâtiments.\n\nNotre initiative promeut un monde plus durable, où l'existant est mieux optimisé.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: "easeOut" as const },
  }),
};

const Missions = () => (
  <Layout>
    <Seo
      title="Mission, vision et raison d'être – Spacio"
      description="La mission de Spacio : trouver des locaux pour les associations. Notre vision : un réflexe de partage et la fin de la monofonction des bâtiments."
      path="/missions"
    />
    <section className="py-20 lg:py-28">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
            Vision, Raison d'être &amp; Mission
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ce qui nous anime au quotidien et pourquoi Spacio existe.
          </p>
        </motion.div>

        <div className="space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className="flex gap-6 rounded-2xl border border-border bg-card p-8 shadow-sm"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <s.icon className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="mb-2 text-xl font-semibold text-foreground">{s.title}</h2>
                <p className="leading-relaxed text-muted-foreground text-justify">{s.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Missions;
