import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Star, Send, CheckCircle, Mail, Building2, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SnappySlider } from "@/components/ui/snappy-slider";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PERIODS = ["Semaine", "Weekend"] as const;
const SLOT_LABELS = ["Matin", "Midi", "Après-midi", "Soir"] as const;
const SLOT_RANGES = ["8h–12h", "12h–14h", "14h–18h", "18h–00h"];
const SLOT_DURATIONS = [4, 2, 4, 6];
const INTENSITY_LABELS = ["Vide", "Peu occupé", "Modéré", "Bien occupé", "Plein"] as const;
type Intensity = 0 | 1 | 2 | 3 | 4;

type Slot = { duration: number; intensity: Intensity };

const calculateIntensiScore = (slots: Slot[]) => {
  const actualUsage = slots.reduce((acc, slot) => acc + slot.duration * slot.intensity, 0);
  const maxTheoretical = 16 * 4; // 16h utiles × intensité max 4
  const ratio = actualUsage / maxTheoretical;
  const scoreRaw = ratio;
  return { score: Math.round(scoreRaw * 100), ratio };
};

const Diagnostic = () => {
  // 2 periods × 4 slots, all starting at 0
  const [grid, setGrid] = useState<Intensity[][]>(
    PERIODS.map(() => [0, 0, 0, 0])
  );
  const [email, setEmail] = useState("");
  const [organization, setOrganization] = useState("");
  const [city, setCity] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const [activePeriod, setActivePeriod] = useState(0);

  const setIntensity = (periodIndex: number, slotIndex: number, val: number) => {
    setSaved(false);
    setGrid((prev) => {
      const next = prev.map((d) => [...d]);
      next[periodIndex][slotIndex] = val as Intensity;
      return next;
    });
  };

  // Weighted average: semaine = 5/7, weekend = 2/7
  const { score, ratio } = useMemo(() => {
    const periodScores = grid.map((period) => {
      const slots = period.map((intensity, i) => ({ duration: SLOT_DURATIONS[i], intensity }));
      return calculateIntensiScore(slots);
    });
    const weights = [5 / 7, 2 / 7];
    const avgScore = Math.round(periodScores.reduce((a, d, i) => a + d.score * weights[i], 0));
    const avgRatio = periodScores.reduce((a, d, i) => a + d.ratio * weights[i], 0);
    return { score: avgScore, ratio: avgRatio };
  }, [grid]);

  const adviceCategory = score < 30 ? "mutualisation" : score < 60 ? "hybridation" : "optimal";
  const gaugeColor = score < 30 ? "hsl(0 84% 60%)" : score < 60 ? "hsl(var(--warning))" : "hsl(var(--success))";

  const isFormValid = email.trim() !== "" && organization.trim() !== "" && city.trim() !== "";

  const handleReveal = async () => {
    if (!isFormValid) {
      toast({ title: "Champs requis", description: "Veuillez remplir votre email, organisation et ville.", variant: "destructive" });
      return;
    }
    setShowResult(true);
    // Save lead + diagnostic in background
    const { error: leadError } = await supabase.from("leads").insert({
      email: email.trim(),
      organization_name: organization.trim(),
      city: city.trim(),
      user_type: "diagnostic",
    });
    const { error: diagError } = await supabase.from("diagnostic_results").insert({
      score,
      ratio,
      grid: { periods: grid } as any,
      advice_category: adviceCategory,
    });
    if (leadError || diagError) {
      console.error("Save error:", leadError, diagError);
    }
  };

  return (
    <Layout>
      <section className="container py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Diagnostic <span className="text-gradient-primary">d'intensité d'usage</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Évaluez l'occupation de votre espace en semaine et le weekend, créneau par créneau.
          </p>
        </motion.div>

        {/* Period tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mx-auto mt-8 max-w-2xl">
          <div className="flex gap-3 justify-center">
            {PERIODS.map((period, i) => (
              <Button
                key={period}
                variant={activePeriod === i ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePeriod(i)}
                className="rounded-full px-6 text-sm"
              >
                {period}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Sliders for active period */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePeriod}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-6 max-w-xl space-y-4"
          >
            {SLOT_LABELS.map((label, slotIdx) => (
              <Card key={label}>
                <CardContent className="p-5">
                  <SnappySlider
                    label={`${label} (${SLOT_RANGES[slotIdx]})`}
                    values={[0, 1, 2, 3, 4]}
                    defaultValue={0}
                    value={grid[activePeriod][slotIdx]}
                    min={0}
                    max={4}
                    step={1}
                    onChange={(v) => setIntensity(activePeriod, slotIdx, v)}
                    config={{
                      labelFormatter: (v) => INTENSITY_LABELS[v as Intensity],
                    }}
                  />
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
                  <Input type="email" placeholder="Votre email *" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" />
                </div>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Nom de l'organisation *" value={organization} onChange={(e) => setOrganization(e.target.value)} className="pl-10" />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Ville *" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
                </div>
                <Button onClick={handleReveal} className="w-full rounded-2xl" disabled={!isFormValid}>
                  Découvrir mon score d'intensité
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Result section */}
        {showResult && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-10 max-w-md">
              <Card>
                <CardContent className="flex flex-col items-center gap-4 p-6">
                  <span className="text-sm font-medium text-muted-foreground">Votre score d'intensité</span>
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
                </CardContent>
              </Card>
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.div
                key={adviceCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mx-auto mt-8 max-w-lg"
              >
                {score < 30 ? (
                  <Card className="border-pastel-blue bg-pastel-blue">
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
                  <Card className="border-pastel-orange bg-pastel-orange">
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
                  <Card className="border-pastel-green bg-pastel-green">
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

