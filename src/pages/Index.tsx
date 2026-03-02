import { Search, CalendarCheck, CreditCard, MapPin, Star, Shield, Users, MessageCircle, Zap, Building2, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import { howItWorksSteps } from "@/data/mockData";
import { motion } from "framer-motion";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import PartnerMarquee from "@/components/PartnerMarquee";

const iconMap: Record<string, React.ElementType> = {
  Search, CalendarCheck, CreditCard, MapPin, Star, Shield, Users, MessageCircle, Zap
};

const pastelBgMap: Record<string, string> = {
  "pastel-blue": "bg-pastel-blue",
  "pastel-green": "bg-pastel-green",
  "pastel-orange": "bg-pastel-orange",
  "pastel-pink": "bg-pastel-pink",
  "pastel-purple": "bg-pastel-purple",
  "pastel-yellow": "bg-pastel-yellow",
  "pastel-teal": "bg-pastel-teal",
  "pastel-red": "bg-pastel-red",
  "pastel-indigo": "bg-pastel-indigo"
};

const stats = [
{ value: "500+", label: "Espaces disponibles" },
{ value: "1 200", label: "Associations inscrites" },
{ value: "3 000m²", label: "Réservés ce mois" }];


const Index = () =>
<Layout>
    {/* Hero */}
    <section className="relative overflow-hidden">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(10, 10, 40)"
        gradientBackgroundEnd="rgb(20, 20, 80)"
        firstColor="220, 130, 50"
        secondColor="100, 80, 220"
        thirdColor="180, 60, 180"
        fourthColor="50, 100, 220"
        fifthColor="200, 100, 50"
        pointerColor="140, 100, 255"
        containerClassName="min-h-[auto] py-20 lg:py-32"
      >
        <div className="container relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Trouvez l'espace <span className="text-gradient-primary italic font-serif">parfait</span> pour votre association
            </h1>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/70">
              Spacio connecte les associations avec des espaces adaptés à leurs activités. Réservation simple, paiement sécurisé.
            </p>

            {/* Search bar */}
            <div className="mx-auto flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md p-2 shadow-sm">
              <div className="flex flex-1 items-center gap-2 pl-3">
                <Search className="h-5 w-5 shrink-0 text-white/60" />
                <Input
                  placeholder="Ville, type d'espace..."
                  className="border-0 bg-transparent shadow-none focus-visible:ring-0 text-white placeholder:text-white/50"
                />
              </div>
              <Link to="/explorer">
                <Button className="rounded-xl px-6 font-semibold">Rechercher</Button>
              </Link>
            </div>

            {/* Stats badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <span className="text-2xl font-extrabold text-primary-foreground">{stat.value}</span>
                  <span className="text-sm text-white/60">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </BackgroundGradientAnimation>
    </section>

    {/* Partner marquee */}
    <PartnerMarquee />

    {/* How it works */}
    <section id="how-it-works" className="bg-surface-alt py-20">
      <div className="container">
        <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center">

          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Comment ça marche</h2>
          <p className="text-muted-foreground">Un processus simple en quelques étapes</p>
        </motion.div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {howItWorksSteps.map((step, i) => {
          const Icon = iconMap[step.icon] || Search;
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">

                <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl ${pastelBgMap[step.color]}`}>
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mb-1 font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </motion.div>);

        })}
        </div>
      </div>
    </section>

    {/* Solution for all */}
    <section className="py-20">
      <div className="container">
        <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-12 text-center">

          <h2 className="mb-3 text-3xl font-bold sm:text-4xl">Une solution pour tous</h2>
          <p className="text-muted-foreground">Que vous soyez propriétaire ou association</p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Owners card */}
          <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-orange">
              <Building2 className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Propriétaires</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Rentabilisez vos espaces inutilisés en les mettant à disposition d'associations. Gérez vos réservations, fixez vos prix et contribuez à la vie locale.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Publication gratuite</li>
              <li className="flex items-center gap-2">✓ Calendrier intégré</li>
              <li className="flex items-center gap-2">✓ Paiement sécurisé</li>
            </ul>
          </motion.div>

          {/* Associations card */}
          <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-sm lg:p-10">

            <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pastel-purple">
              <Heart className="h-6 w-6 text-foreground" />
            </div>
            <h3 className="mb-3 text-2xl font-bold">Associations</h3>
            <p className="mb-6 leading-relaxed text-muted-foreground">
              Trouvez des espaces abordables et adaptés pour vos réunions, ateliers, événements. Réservez en quelques clics et concentrez-vous sur l'essentiel.
            </p>
            <ul className="mb-6 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">✓ Recherche par critères</li>
              <li className="flex items-center gap-2">✓ Réservation instantanée</li>
              <li className="flex items-center gap-2">✓ Tarifs associatifs</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>;


export default Index;