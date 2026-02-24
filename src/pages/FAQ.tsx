import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Comment fonctionne Spacio ?", a: "Spacio met en relation des associations à la recherche d'espaces avec des propriétaires souhaitant rentabiliser leurs locaux inoccupés. Vous cherchez, réservez et payez directement sur la plateforme." },
  { q: "Combien coûte l'utilisation de Spacio ?", a: "L'inscription et la recherche sont entièrement gratuites pour les associations. Spacio prélève une commission de service uniquement lors d'une réservation confirmée." },
  { q: "Quels types d'espaces sont disponibles ?", a: "Salles de réunion, ateliers, espaces événementiels, coworking, studios… Tous types de locaux adaptés aux besoins associatifs." },
  { q: "Comment proposer un espace ?", a: "Rendez-vous sur la page « Commencer » et sélectionnez « Je propose un espace ». Renseignez les informations de votre local et notre équipe vous recontactera sous 24h." },
  { q: "Qu'est-ce que l'Intensi'Score ?", a: "C'est un outil de diagnostic gratuit qui évalue le taux d'occupation de votre espace sur une semaine type. Il vous fournit des conseils personnalisés (mutualisation, hybridation) pour optimiser l'usage de vos locaux." },
  { q: "Comment contacter l'équipe Spacio ?", a: "Vous pouvez nous joindre via notre page LinkedIn (Spacio Nantes) ou par email à contact@spacio.fr." },
];

const FAQ = () => (
  <Layout>
    <section className="container py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Questions fréquentes</h1>
        <p className="mb-10 text-muted-foreground">Trouvez rapidement les réponses à vos questions.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto max-w-2xl">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="rounded-2xl border border-border bg-card px-5">
              <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">{faq.q}</AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </motion.div>
    </section>
  </Layout>
);

export default FAQ;
