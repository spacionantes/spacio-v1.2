import { useState } from "react";
import { Search, Building2, CheckCircle2, ArrowLeft, MapPin, Users, Ruler, CalendarIcon } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import Layout from "@/components/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { mockSpaces } from "@/data/mockData";
import { useListings } from "@/hooks/useListings";
import { format, startOfDay, parseISO, getDay } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";

type UserType = "seeker" | "owner" | null;

interface LeadData {
  user_type: UserType;
  organization_name: string;
  activity_type: string;
  space_type: string;
  city: string;
  email: string;
  phone: string;
  space_id: string;
  space_title: string;
  desired_date?: string;
  desired_start_time?: string;
  desired_end_time?: string;
}

const initialData: LeadData = {
  user_type: null,
  organization_name: "",
  activity_type: "",
  space_type: "",
  city: "",
  email: "",
  phone: "",
  space_id: "",
  space_title: "",
};

const activityTypes = [
  { value: "reunion", label: "Réunion" },
  { value: "atelier", label: "Atelier" },
  { value: "evenement", label: "Événement" },
  { value: "sport", label: "Sport" },
  { value: "autre", label: "Autre" },
];

const spaceTypes = [
  { value: "salle-reunion", label: "Salle de réunion" },
  { value: "atelier", label: "Atelier" },
  { value: "salle-evenementielle", label: "Salle événementielle" },
  { value: "coworking", label: "Coworking" },
  { value: "studio", label: "Studio" },
  { value: "autre", label: "Autre" },
];

const timeOptions = Array.from({ length: 33 }, (_, i) => {
  const totalMinutes = i * 30 + 480;
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const label = `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
  return { value: label, label };
});

const SpaceBookingForm = ({ space, onSubmit }: { space: typeof mockSpaces[0]; onSubmit: (data: LeadData) => void }) => {
  const [data, setData] = useState<LeadData>({
    ...initialData,
    user_type: "seeker",
    city: space.city,
    space_id: space.id,
    space_title: space.title,
  });
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const update = (field: keyof LeadData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canSubmit = !!data.email && !!data.organization_name;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
      {/* Hero image card with overlay */}
      <div className="relative overflow-hidden rounded-3xl shadow-xl">
        <div className="relative aspect-[16/7] w-full overflow-hidden">
          <img src={space.image_url} alt={space.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--navy))] via-[hsl(var(--navy)/0.4)] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-white drop-shadow-md">{space.title}</h2>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-white/80">
                  <MapPin className="h-3.5 w-3.5" /> {space.address}, {space.city}
                </p>
              </div>
              <Badge className="rounded-full bg-white px-4 py-2 text-lg font-extrabold text-[hsl(var(--indigo))] shadow-lg">
                {space.price_per_hour}€/h
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Users className="h-3.5 w-3.5" /> {space.capacity} pers.
              </span>
              <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <Ruler className="h-3.5 w-3.5" /> {space.surface_m2} m²
              </span>
            </div>
          </div>
        </div>

        {/* Form section with indigo accent */}
        <div className="bg-card p-6 pt-5">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[hsl(var(--indigo))]" />
            <h3 className="text-base font-bold tracking-tight text-[hsl(var(--navy))]">Vos coordonnées</h3>
          </div>

          <div className="space-y-3.5">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Association *</Label>
              <Input
                value={data.organization_name}
                onChange={(e) => update("organization_name", e.target.value)}
                placeholder="Ex : Les Amis du Quartier"
                className="rounded-xl border-input bg-muted/50 transition-colors focus:bg-card"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email *</Label>
                <Input
                  type="email"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="vous@exemple.com"
                  className="rounded-xl border-input bg-muted/50 transition-colors focus:bg-card"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Téléphone</Label>
                <Input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="06 00 00 00 00"
                  className="rounded-xl border-input bg-muted/50 transition-colors focus:bg-card"
                />
              </div>
            </div>

            {/* Date & Time row */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <Label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <CalendarIcon className="mr-1.5 inline h-3.5 w-3.5" />Créneau souhaité <span className="normal-case font-normal">(optionnel)</span>
              </Label>
              <div className="grid gap-3 sm:grid-cols-3">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal rounded-xl bg-card",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-[hsl(var(--indigo))]" />
                      {selectedDate ? format(selectedDate, "d MMM", { locale: fr }) : "Date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <Select value={startTime} onValueChange={setStartTime}>
                  <SelectTrigger className="rounded-xl bg-card"><SelectValue placeholder="Début" /></SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={endTime} onValueChange={setEndTime}>
                  <SelectTrigger className="rounded-xl bg-card"><SelectValue placeholder="Fin" /></SelectTrigger>
                  <SelectContent>
                    {timeOptions.filter((t) => !startTime || t.value > startTime).map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Button
            className="mt-5 w-full rounded-2xl bg-[hsl(var(--indigo))] py-6 text-base font-bold text-primary-foreground shadow-lg shadow-[hsl(var(--indigo)/0.3)] transition-all hover:shadow-xl hover:shadow-[hsl(var(--indigo)/0.4)] hover:brightness-110"
            disabled={!canSubmit}
            onClick={() => onSubmit({
              ...data,
              desired_date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
              desired_start_time: startTime || undefined,
              desired_end_time: endTime || undefined,
            })}
          >
            Envoyer ma demande
          </Button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            L'équipe Spacio vous recontactera sous 24h.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const GetStarted = () => {
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get("space");
  const { data: listings = [] } = useListings();
  const selectedSpace = spaceId ? listings.find((s) => s.id === spaceId) || mockSpaces.find((s) => s.id === spaceId) : null;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<LeadData>(initialData);
  const [submitted, setSubmitted] = useState(false);

  const update = (field: keyof LeadData, value: string) =>
    setData((prev) => ({ ...prev, [field]: value }));

  const canSubmitStep2 = () => {
    if (data.user_type === "seeker") {
      return data.organization_name && data.activity_type && data.city;
    }
    return data.organization_name && data.space_type && data.city;
  };

  const canSubmitStep3 = () => !!data.email;

  const handleSubmit = async (leadData?: LeadData) => {
    const finalData = leadData || data;
    
    const { error } = await supabase.from("leads").insert({
      user_type: finalData.user_type || "seeker",
      organization_name: finalData.organization_name,
      activity_type: finalData.activity_type || null,
      space_type: finalData.space_type || null,
      city: finalData.city,
      email: finalData.email,
      phone: finalData.phone || null,
      space_id: finalData.space_id || null,
      space_title: finalData.space_title || null,
      desired_date: finalData.desired_date || null,
      desired_start_time: finalData.desired_start_time || null,
      desired_end_time: finalData.desired_end_time || null,
    });

    if (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
      console.error("Lead insert error:", error);
      return;
    }

    // Send confirmation email
    supabase.functions.invoke("send-email", {
      body: {
        type: "space_confirmation",
        to: finalData.email,
        data: {
          organization_name: finalData.organization_name,
          space_title: finalData.space_title || null,
        },
      },
    }).catch((err) => console.error("Email send error:", err));

    if (leadData) {
      setSubmitted(true);
    } else {
      setStep(4);
    }
  };

  // Pre-filled space flow
  if (selectedSpace) {
    return (
      <Layout>
        <section className="flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-lg px-4">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <SpaceBookingForm key="form" space={selectedSpace} onSubmit={handleSubmit} />
              ) : (
                <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle2 className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold">Merci !</h2>
                  <p className="text-muted-foreground">Nous avons bien reçu votre demande pour <strong>{selectedSpace.title}</strong>.<br />Nous vous recontacterons sous 24h.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </Layout>
    );
  }

  // Standard flow (unchanged)
  const stepIndicator = (
    <div className="mb-8 flex items-center justify-center gap-2">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-2.5 rounded-full transition-all ${
            s === step ? "w-8 bg-primary" : s < step ? "w-2.5 bg-primary/40" : "w-2.5 bg-muted"
          }`}
        />
      ))}
    </div>
  );

  return (
    <Layout>
      <section className="flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-lg px-4">
          <AnimatePresence mode="wait">
            {/* Step 1 – Profile */}
            {step === 1 && (
              <motion.div key="s1" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                {stepIndicator}
                <h1 className="mb-2 text-center text-2xl font-bold">Vous êtes…</h1>
                <p className="mb-8 text-center text-sm text-muted-foreground">Sélectionnez votre profil pour commencer</p>
                <div className="grid gap-4 sm:grid-cols-2">
                  {[
                    { type: "seeker" as const, icon: Search, title: "Je cherche un espace", desc: "Association ou organisme" },
                    { type: "owner" as const, icon: Building2, title: "Je propose un espace", desc: "Propriétaire ou gestionnaire" },
                  ].map(({ type, icon: Icon, title, desc }) => (
                    <button
                      key={type}
                      onClick={() => { update("user_type", type); setStep(2); }}
                      className={`group flex flex-col items-center gap-3 rounded-2xl border-2 border-border bg-card p-6 text-center shadow-sm transition-all hover:border-primary hover:shadow-md`}
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <span className="font-semibold">{title}</span>
                      <span className="text-xs text-muted-foreground">{desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2 – Details */}
            {step === 2 && (
              <motion.div key="s2" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                {stepIndicator}
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-lg font-bold">
                      {data.user_type === "seeker" ? "Votre association" : "Votre espace"}
                    </h2>

                    <div className="space-y-1.5">
                      <Label>{data.user_type === "seeker" ? "Nom de l'association" : "Nom / Société"}</Label>
                      <Input
                        value={data.organization_name}
                        onChange={(e) => update("organization_name", e.target.value)}
                        placeholder={data.user_type === "seeker" ? "Ex : Les Amis du Quartier" : "Ex : SCI Martin"}
                      />
                    </div>

                    {data.user_type === "seeker" ? (
                      <div className="space-y-1.5">
                        <Label>Type d'activité</Label>
                        <Select value={data.activity_type} onValueChange={(v) => update("activity_type", v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {activityTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <Label>Type d'espace</Label>
                        <Select value={data.space_type} onValueChange={(v) => update("space_type", v)}>
                          <SelectTrigger><SelectValue placeholder="Sélectionner" /></SelectTrigger>
                          <SelectContent>
                            {spaceTypes.map((t) => (
                              <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <Label>Ville</Label>
                      <Input value={data.city} onChange={(e) => update("city", e.target.value)} placeholder="Ex : Lyon" />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="rounded-2xl" onClick={() => setStep(1)}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Retour
                      </Button>
                      <Button className="flex-1 rounded-2xl font-semibold" disabled={!canSubmitStep2()} onClick={() => setStep(3)}>
                        Continuer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3 – Contact */}
            {step === 3 && (
              <motion.div key="s3" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
                {stepIndicator}
                <Card className="rounded-2xl shadow-sm">
                  <CardContent className="space-y-4 p-6">
                    <h2 className="text-lg font-bold">Vos coordonnées</h2>

                    <div className="space-y-1.5">
                      <Label>Email *</Label>
                      <Input type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="vous@exemple.com" />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Téléphone <span className="text-muted-foreground">(optionnel)</span></Label>
                      <Input type="tel" value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="06 00 00 00 00" />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button variant="outline" className="rounded-2xl" onClick={() => setStep(2)}>
                        <ArrowLeft className="mr-1 h-4 w-4" /> Retour
                      </Button>
                      <Button className="flex-1 rounded-2xl font-semibold" disabled={!canSubmitStep3()} onClick={() => handleSubmit()}>
                        Envoyer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 4 – Confirmation */}
            {step === 4 && (
              <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="text-center">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <h2 className="mb-2 text-2xl font-bold">Merci !</h2>
                <p className="text-muted-foreground">Nous avons bien reçu votre demande.<br />Nous vous recontacterons sous 24h.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </Layout>
  );
};

export default GetStarted;
