import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Eye, Heart, Target } from "lucide-react";

const sections = [
  {
    icon: Eye,
    title: "Notre Vision",
    content:
      "Nous imaginons un monde où chaque association, quelle que soit sa taille ou ses moyens, accède facilement à des espaces adaptés pour mener à bien ses projets. Un écosystème où les surfaces sous-utilisées trouvent une seconde vie au service de l'intérêt général.",
  },
  {
    icon: Heart,
    title: "Notre Raison d'Être",
    content:
      "Trop d'associations peinent à trouver des locaux abordables et adaptés. En parallèle, des milliers de mètres carrés restent vacants dans nos villes. Spacio existe pour créer le lien entre ces deux réalités et transformer un problème immobilier en opportunité sociale.",
  },
  {
    icon: Target,
    title: "Notre Mission",
    content:
      "Faciliter la mise en relation entre propriétaires d'espaces disponibles et associations en recherche de locaux. Nous accompagnons chaque partie avec un diagnostic personnalisé, des conseils adaptés et un suivi humain pour garantir des collaborations durables et vertueuses.",
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
                <p className="leading-relaxed text-muted-foreground">{s.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Missions;
