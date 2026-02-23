import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Star, Save, CheckCircle, Mail, Building2, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;
const SLOT_LABELS = ["Matin", "Midi", "Après-midi", "Soir"] as const;
const SLOT_DURATIONS = [4, 2, 4, 6]; // heures par créneau
const INTENSITY_LABELS = ["Vide", "Partiel", "Plein"] as const;

type Slot = { duration: number; intensity: 0 | 1 | 2 };

const calculateIntensiScore = (slots: Slot[]) => {
  const actualUsage = slots.reduce((acc, slot) => acc + slot.duration * slot.intensity, 0);
  const maxTheoretical = 24 * 2;
  const ratio = actualUsage / maxTheoretical;
  const scoreRaw = Math.pow(ratio, 0.25);
  return { score: Math.round(scoreRaw * 100), ratio };
};

const Diagnostic = () => {
  // 7 days × 4 slots, all starting at 0
  const [grid, setGrid] = useState<(0 | 1 | 2)[][]>(
    DAYS.map(() => [0, 0, 0, 0])
  );
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const setIntensity = (dayIndex: number, slotIndex: number, val: number) => {
    setSaved(false);
    setGrid((prev) => {
      const next = prev.map((d) => [...d]);
      next[dayIndex][slotIndex] = val as 0 | 1 | 2;
      return next;
    });
  };

  // Flatten all 28 slots for score calculation
  const allSlots: Slot[] = useMemo(
    () =>
      grid.flatMap((day) =>
        day.map((intensity, i) => ({ duration: SLOT_DURATIONS[i], intensity }))
      ),
    [grid]
  );

  // Average across 7 days: we compute per-day score then average
  const { score, ratio } = useMemo(() => {
    const dayScores = grid.map((day) => {
      const slots = day.map((intensity, i) => ({ duration: SLOT_DURATIONS[i], intensity }));
      return calculateIntensiScore(slots);
    });
    const avgScore = Math.round(dayScores.reduce((a, d) => a + d.score, 0) / 7);
    const avgRatio = dayScores.reduce((a, d) => a + d.ratio, 0) / 7;
    return { score: avgScore, ratio: avgRatio };
  }, [grid]);

  const adviceCategory = score < 30 ? "mutualisation" : score < 60 ? "hybridation" : "optimal";
  const gaugeColor = score < 30 ? "hsl(0 84% 60%)" : score < 60 ? "hsl(var(--warning))" : "hsl(var(--success))";

  const isFormValid = email.trim() !== "" && organization.trim() !== "" && city.trim() !== "";

  const handleReveal = () => {
    if (!isFormValid) {
      toast({ title: "Champs requis", description: "Veuillez remplir votre email, organisation et ville.", variant: "destructive" });
      return;
    }
    setShowResult(true);
  };

  const handleSave = async () => {
    setSaving(true);
    // Insert lead
    const { error: leadError } = await supabase.from("leads").insert({
      email: email.trim(),
      organization_name: organization.trim(),
      city: city.trim(),
      user_type: "diagnostic",
    });
    // Insert diagnostic result
    const { error: diagError } = await supabase.from("diagnostic_results").insert({
      score,
      ratio,
      grid: { days: grid } as any,
      advice_category: adviceCategory,
      email: email.trim(),
    });
    setSaving(false);
    if (leadError || diagError) {
      toast({ title: "Erreur", description: "Impossible d'enregistrer le diagnostic.", variant: "destructive" });
    } else {
      setSaved(true);
      toast({ title: "Enregistré !", description: "Votre diagnostic a bien été sauvegardé." });
    }
  };

  const [activeDay, setActiveDay] = useState(0);

  return (
    <Layout>
      <section className="container py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Diagnostic <span className="text-gradient-primary">Intensi'Score</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Réglez l'intensité d'occupation de votre espace pour chaque jour et créneau de la semaine.
          </p>
        </motion.div>

        {/* Day tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-8 max-w-2xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {DAYS.map((day, i) => (
              <Button
                key={day}
                variant={activeDay === i ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveDay(i)}
                className="rounded-full text-xs"
              >
                {day}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Sliders for active day */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDay}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-6 max-w-xl space-y-4"
          >
            {SLOT_LABELS.map((label, slotIdx) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-semibold">{label}</span>
                    <span
                      className={cn(
                        "rounded-full px-3 py-0.5 text-xs font-medium",
                        grid[activeDay][slotIdx] === 0 && "bg-muted text-muted-foreground",
                        grid[activeDay][slotIdx] === 1 && "bg-[hsl(var(--pastel-orange))] text-foreground",
                        grid[activeDay][slotIdx] === 2 && "bg-[hsl(var(--pastel-green))] text-foreground"
                      )}
                    >
                      {INTENSITY_LABELS[grid[activeDay][slotIdx]]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="w-12 text-xs text-muted-foreground">{SLOT_DURATIONS[slotIdx]}h</span>
                    <Slider
                      min={0}
                      max={2}
                      step={1}
                      value={[grid[activeDay][slotIdx]]}
                      onValueChange={([v]) => setIntensity(activeDay, slotIdx, v)}
                      className="flex-1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Lead capture form */}
        {!showResult && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mt-10 max-w-md">
            <Card>
              <CardContent className="space-y-4 p-6">
                <p className="text-center text-sm font-medium text-muted-foreground">
                  Renseignez vos coordonnées pour découvrir votre score
                </p>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="Votre email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nom de l'organisation *"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Ville *"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button onClick={handleReveal} className="w-full rounded-2xl" disabled={!isFormValid}>
                  Découvrir mon Intensi'Score
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result section - only visible after form submission */}
        {showResult && (
          <>
            {/* Gauge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-md">
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <span className="text-sm font-medium text-muted-foreground">Votre Intensi'Score</span>
                  <div className="relative h-5 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="absolute inset-y-0 left-0 rounded-full"
                      style={{ background: `linear-gradient(90deg, hsl(0 84% 60%), hsl(var(--warning)), hsl(var(--success)))` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${score}%` }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    />
                  </div>
                  <motion.span
                    key={score}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl font-extrabold"
                    style={{ color: gaugeColor }}
                  >
                    {score}
                  </motion.span>
                  <span className="text-xs text-muted-foreground">Occupation moyenne : {Math.round(ratio * 100)}%</span>
                  <Button onClick={handleSave} disabled={saving || saved} className="mt-2 rounded-2xl px-6">
                    {saved ? <><CheckCircle className="h-4 w-4" /> Enregistré</> : saving ? "Enregistrement…" : <><Save className="h-4 w-4" /> Enregistrer mon diagnostic</>}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Conseils */}
            <AnimatePresence mode="wait">
              <motion.div
                key={adviceCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-8 max-w-lg"
              >
                {score < 30 ? (
                  <Card className="border-[hsl(var(--pastel-blue))] bg-[hsl(var(--pastel-blue))]">
                    <CardContent className="flex items-start gap-4 p-6">
                      <Users className="mt-0.5 h-6 w-6 shrink-0 text-primary" />
                      <div>
                        <h3 className="font-bold">Mutualisation d'espaces</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Votre espace est peu utilisé. Pensez à le mutualiser avec d'autres organisations pour optimiser son occupation et réduire vos coûts.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : score < 60 ? (
                  <Card className="border-[hsl(var(--pastel-orange))] bg-[hsl(var(--pastel-orange))]">
                    <CardContent className="flex items-start gap-4 p-6">
                      <Zap className="mt-0.5 h-6 w-6 shrink-0 text-[hsl(var(--warning))]" />
                      <div>
                        <h3 className="font-bold">Hybridation d'usages</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Votre espace a un potentiel d'optimisation. Envisagez de diversifier ses usages sur les créneaux libres pour maximiser sa valeur.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border-[hsl(var(--pastel-green))] bg-[hsl(var(--pastel-green))]">
                    <CardContent className="flex items-start gap-4 p-6">
                      <Star className="mt-0.5 h-6 w-6 shrink-0 text-[hsl(var(--success))]" />
                      <div>
                        <h3 className="font-bold">Utilisation optimale</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Félicitations ! Votre espace est bien utilisé. Continuez à optimiser vos créneaux pour maintenir cette performance.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </AnimatePresence>
          </>
        )}
      </section>
    </Layout>
  );
};

export default Diagnostic;
