import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";

const partners = [
  { name: "Maison des Associations de Nantes", city: "Nantes", description: "Accompagnement et ressources pour les associations nantaises." },
  { name: "France Active Pays de la Loire", city: "Nantes", description: "Financement et accompagnement des structures de l'ESS." },
  { name: "Le Solilab", city: "Nantes", description: "Lieu d'innovation sociale et solidaire sur l'île de Nantes." },
  { name: "Ligue de l'Enseignement 44", city: "Nantes", description: "Mouvement d'éducation populaire et réseau associatif." },
  { name: "Ecossolies", city: "Nantes", description: "Pôle de coopération des acteurs de l'ESS en Loire-Atlantique." },
  { name: "La Cantine Numérique", city: "Nantes", description: "Espace de coworking et d'événements pour l'innovation." },
];

const Reseau = () => (
  <Layout>
    <section className="container py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Notre réseau</h1>
        <p className="mb-12 text-muted-foreground">Les associations et partenaires qui font confiance à Spacio.</p>
      </motion.div>

      <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partners.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="mb-1 font-semibold text-sm">{p.name}</h3>
            <p className="text-xs text-muted-foreground">{p.city}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  </Layout>
);

export default Reseau;
