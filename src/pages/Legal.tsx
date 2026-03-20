import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { motion } from "framer-motion";

const sections = [
  {
    id: "cgu",
    title: "Conditions Générales d'Utilisation",
    content: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme Spacio. En utilisant nos services, vous acceptez ces conditions dans leur intégralité.\n\nSpacio est une plateforme de mise en relation entre propriétaires d'espaces et associations. Nous ne sommes pas partie aux contrats conclus entre les utilisateurs.\n\nTout utilisateur s'engage à fournir des informations exactes lors de son inscription et à ne pas utiliser la plateforme à des fins illicites. Spacio se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU.`,
  },
  {
    id: "confidentialite",
    title: "Politique de Confidentialité",
    content: `Spacio s'engage à protéger la vie privée de ses utilisateurs conformément au Règlement Général sur la Protection des Données (RGPD).\n\nNous collectons uniquement les données nécessaires au fonctionnement du service : nom, email, ville, type d'organisation. Ces données ne sont jamais vendues à des tiers.\n\nVous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour exercer ces droits, contactez-nous à l'adresse : contact@spacio.fr.`,
  },
  {
    id: "mentions",
    title: "Mentions Légales",
    content: `Éditeur : Spacio SAS\nSiège social : Nantes, France\nEmail : contact@spacio.fr\n\nDirecteur de la publication : Équipe Spacio\n\nHébergement : Supabase Inc. — 970 Toa Payoh North, Singapour\n\nConformément à la loi n°2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique, les informations ci-dessus sont portées à la connaissance des utilisateurs et visiteurs du site.`,
  },
];

const Legal = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace("#", ""));
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash]);

  return (
    <Layout>
      <section className="container py-12 md:py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center text-3xl font-extrabold md:text-4xl"
        >
          Informations légales
        </motion.h1>

        <div className="mx-auto max-w-3xl space-y-12">
          {sections.map((s, i) => (
            <motion.div
              key={s.id}
              id={s.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="scroll-mt-24"
            >
              <h2 className="mb-4 text-2xl font-bold">{s.title}</h2>
              <div className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                {s.content}
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Legal;
