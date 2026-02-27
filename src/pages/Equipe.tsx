import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Linkedin } from "lucide-react";

const team = [
  { name: "Max Doyer", role: "Co-fondateur & CEO", linkedin: "#" },
  { name: "Gilles Lainé", role: "Co-fondateur & CFO", linkedin: "#" },
  { name: "Simon Thenaisy", role: "Business Development", linkedin: "#" },
];

const Equipe = () => (
  <Layout>
    <section className="container py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Notre équipe</h1>
        <p className="mb-12 text-muted-foreground">Les personnes derrière Spacio, engagées pour rendre les espaces accessibles aux associations.</p>
      </motion.div>

      <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
        {team.map((m, i) => (
          <motion.div
            key={m.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
          >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {m.name.charAt(0)}
            </div>
            <h3 className="font-semibold">{m.name}</h3>
            <p className="text-sm text-muted-foreground">{m.role}</p>
            <a href={m.linkedin} className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <Linkedin className="h-4 w-4" />
            </a>
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Equipe;
