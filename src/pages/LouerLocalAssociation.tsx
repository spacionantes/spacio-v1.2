import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Building2, MapPin, Users, ArrowRight, Search } from "lucide-react";

const reasons = [
  {
    icon: MapPin,
    title: "Tous les quartiers de Nantes",
    description:
      "Du centre-ville à la périphérie, explorez des espaces situés dans les quartiers les plus dynamiques de Nantes et de sa métropole.",
  },
  {
    icon: Building2,
    title: "Tous types d'espaces",
    description:
      "Salles de réunion, ateliers, studios, espaces événementiels ou coworking : trouvez le local qui correspond exactement à vos activités.",
  },
  {
    icon: Users,
    title: "Tarifs solidaires",
    description:
      "Accédez à des tarifs préférentiels réservés aux associations et structures de l'ESS, sans engagement et sans surprise.",
  },
];

const spaceTypes = [
  "Salle de réunion",
  "Atelier",
  "Espace événementiel",
  "Coworking",
  "Studio",
  "Salle de formation",
];

const LouerLocalAssociation = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Seo
        title="Louer un local pour association à Nantes – Spacio"
        description="Trouvez facilement un local à louer pour votre association à Nantes. Salles, ateliers, espaces événementiels et coworking à tarifs solidaires."
        path="/louer-local-association-nantes"
      />

      {/* Hero */}
      <section className="container py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
            Louer un local pour votre association à Nantes
          </h1>
          <p className="mb-10 text-lg leading-relaxed text-muted-foreground text-justify">
            Votre association a besoin d'un espace pour ses réunions, ateliers ou événements ?
            Spacio référence les locaux disponibles à Nantes et vous permet de les louer à des tarifs
            solidaires adaptés au monde associatif. Que vous cherchiez une salle de réunion en centre-ville,
            un atelier en périphérie ou un espace événementiel pour une soirée, notre plateforme met
            à votre disposition une sélection d'espaces vérifiés et prêts à accueillir vos activités.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-semibold"
              onClick={() => navigate("/explorer")}
            >
              <Search className="mr-2 h-5 w-5" />
              Explorer les espaces
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-semibold"
              onClick={() => navigate("/commencer")}
            >
              Décrire mon besoin
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Types d'espaces */}
      <section className="bg-surface-alt py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              Quels locaux peut-on louer ?
            </h2>
            <p className="text-muted-foreground">
              Des espaces variés pour toutes les activités associatives
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {spaceTypes.map((type, i) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-semibold">{type}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pourquoi Spacio */}
      <section className="py-16 lg:py-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-3 text-3xl font-bold sm:text-4xl">
              Pourquoi louer via Spacio ?
            </h2>
            <p className="text-muted-foreground">
              Une solution pensée pour les associations nantaises
            </p>
          </motion.div>

          <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
            {reasons.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.45 }}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-purple">
                  <r.icon className="h-6 w-6 text-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{r.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground text-justify">
                  {r.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA finale */}
      <section className="bg-surface-alt py-16">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-8 text-center shadow-sm md:p-12"
          >
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              Prêt à trouver votre local ?
            </h2>
            <p className="mb-8 text-muted-foreground text-justify">
              Parcourez dès maintenant les espaces disponibles à Nantes et envoyez une demande en quelques clics.
              Notre équipe vous recontacte sous 24h pour finaliser votre location.
            </p>
            <Button
              size="lg"
              className="rounded-2xl px-8 py-6 text-base font-semibold"
              onClick={() => navigate("/explorer")}
            >
              <Search className="mr-2 h-5 w-5" />
              Voir les locaux disponibles
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default LouerLocalAssociation;
