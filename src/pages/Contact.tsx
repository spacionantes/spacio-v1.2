import { useState } from "react";
import { CheckCircle2, Search, Building2, MessageSquare, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";

const userTypes = [
  { value: "seeker", label: "Demandeur d'espace", icon: Search },
  { value: "owner", label: "Propriétaire d'espace", icon: Building2 },
];

const benefits = [
  {
    icon: Search,
    title: "Trouvez l'espace idéal",
    description: "Décrivez votre besoin et nous vous orientons vers les espaces les plus adaptés à votre activité.",
  },
  {
    icon: Building2,
    title: "Proposez votre espace",
    description: "Vous disposez d'un local sous-utilisé ? Valorisez-le en le rendant accessible aux associations.",
  },
  {
    icon: MessageSquare,
    title: "Un accompagnement dédié",
    description: "Notre équipe vous recontacte sous 24h pour comprendre votre besoin et vous accompagner.",
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    user_type: "",
    organization_name: "",
    email: "",
    phone: "",
    reason: "",
  });

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const canSubmit =
    !!formData.user_type && !!formData.organization_name && !!formData.email;

  const handleSubmit = async () => {
    const { error } = await supabase.from("leads").insert({
      user_type: formData.user_type,
      organization_name: formData.organization_name,
      city: "—",
      email: formData.email,
      phone: formData.phone || null,
      activity_type: formData.reason || null,
    });

    if (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Lead insert error:", error);
      return;
    }

    supabase.functions
      .invoke("send-email", {
        body: {
          type: "contact_confirmation",
          to: formData.email,
          data: { organization_name: formData.organization_name },
        },
      })
      .catch((err) => console.error("Email send error:", err));

    setSubmitted(true);
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-start"
              >
                {/* Left – Pitch */}
                <div className="space-y-8">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight lg:text-4xl">
                      Contactez-nous
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                      Que vous cherchiez un espace pour votre association ou que
                      vous souhaitiez proposer un lieu, notre équipe est là pour
                      vous accompagner.
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 text-primary" />
                      <a href="mailto:spacionantes@gmail.com" className="hover:text-primary transition-colors">
                        spacionantes@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {benefits.map((benefit, i) => (
                      <motion.div
                        key={benefit.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i, duration: 0.4 }}
                        className="flex gap-4"
                      >
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                          <benefit.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{benefit.title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                            {benefit.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right – Form */}
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="space-y-5 p-6 lg:p-8">
                    <div>
                      <h2 className="text-xl font-bold">Envoyez-nous un message</h2>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Remplissez ce formulaire et nous vous recontacterons sous
                        24h.
                      </p>
                    </div>

                    {/* User type selector */}
                    <div className="space-y-2">
                      <Label>Qui êtes-vous ? *</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {userTypes.map((type) => (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() => update("user_type", type.value)}
                            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 text-sm font-medium transition-all ${
                              formData.user_type === type.value
                                ? "border-primary bg-primary/5 text-primary"
                                : "border-border text-muted-foreground hover:border-primary/40"
                            }`}
                          >
                            <type.icon className="h-5 w-5" />
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Nom / Organisation *</Label>
                      <Input
                        value={formData.organization_name}
                        onChange={(e) =>
                          update("organization_name", e.target.value)
                        }
                        placeholder="Ex : Association Horizon"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => update("email", e.target.value)}
                        placeholder="vous@exemple.com"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>
                        Téléphone{" "}
                        <span className="text-muted-foreground">(optionnel)</span>
                      </Label>
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="06 00 00 00 00"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>
                        Raison du contact{" "}
                        <span className="text-muted-foreground">(optionnel)</span>
                      </Label>
                      <Textarea
                        value={formData.reason}
                        onChange={(e) => update("reason", e.target.value)}
                        placeholder="Décrivez votre besoin, votre projet, ou posez-nous simplement une question…"
                        rows={4}
                      />
                    </div>

                    <Button
                      className="w-full rounded-2xl py-6 text-base font-semibold"
                      disabled={!canSubmit}
                      onClick={handleSubmit}
                    >
                      Envoyer
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Vos données ne sont utilisées que pour vous recontacter.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="mx-auto max-w-md text-center py-16"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Merci !</h2>
                <p className="text-muted-foreground">
                  Nous avons bien reçu votre message.
                  <br />
                  Notre équipe vous recontactera sous 24h.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
