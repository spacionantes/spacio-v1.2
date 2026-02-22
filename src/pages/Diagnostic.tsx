import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Zap, Star } from "lucide-react";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const DAYS = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] as const;
const PERIODS = ["Matin", "Midi", "Après-midi", "Soir", "Nuit"] as const;

type OccupancyValue = 0 | 0.5 | 1;

const OPTIONS: { label: string; short: string; value: OccupancyValue; style: string; activeStyle: string }[] = [
  { label: "Inoccupé", short: "0", value: 0, style: "border-border text-muted-foreground", activeStyle: "bg-muted border-muted-foreground/40 text-foreground font-semibold" },
  { label: "Partiel", short: "½", value: 0.5, style: "border-border text-muted-foreground", activeStyle: "bg-[hsl(var(--pastel-orange))] border-[hsl(var(--warning))] text-foreground font-semibold" },
  { label: "Intensif", short: "1", value: 1, style: "border-border text-muted-foreground", activeStyle: "bg-[hsl(var(--pastel-green))] border-[hsl(var(--success))] text-foreground font-semibold" },
];

type Grid = Record<string, Record<string, OccupancyValue>>;

const initGrid = (): Grid => {
  const g: Grid = {};
  DAYS.forEach((d) => {
    g[d] = {};
    PERIODS.forEach((p) => { g[d][p] = 0; });
  });
  return g;
};

const Diagnostic = () => {
  const [grid, setGrid] = useState<Grid>(initGrid);

  const set = (day: string, period: string, val: OccupancyValue) =>
    setGrid((prev) => ({ ...prev, [day]: { ...prev[day], [period]: val } }));

  const { score, ratio } = useMemo(() => {
    const sum = DAYS.reduce((s, d) => s + PERIODS.reduce((ps, p) => ps + grid[d][p], 0), 0);
    const r = sum / 35;
    return { score: Math.round(Math.pow(r, 0.25) * 100), ratio: r };
  }, [grid]);

  const gaugeColor = score < 30 ? "hsl(0 84% 60%)" : score < 60 ? "hsl(var(--warning))" : "hsl(var(--success))";

  return (
    <Layout>
      <section className="container py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-extrabold md:text-4xl">
            Diagnostic <span className="text-gradient-primary">Intensi'Score</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Évaluez l'intensité d'usage de votre espace en renseignant l'occupation pour chaque créneau de la semaine.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mx-auto mt-10 max-w-4xl overflow-x-auto rounded-2xl border border-border bg-card p-4 shadow-sm">
          <table className="w-full min-w-[640px] border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-xs font-semibold text-muted-foreground" />
                {PERIODS.map((p) => (
                  <th key={p} className="p-2 text-center text-xs font-semibold text-muted-foreground">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DAYS.map((day) => (
                <tr key={day} className="border-t border-border/50">
                  <td className="whitespace-nowrap p-2 text-sm font-medium">{day}</td>
                  {PERIODS.map((period) => (
                    <td key={period} className="p-1.5">
                      <div className="flex items-center justify-center gap-1">
                        {OPTIONS.map((opt) => {
                          const active = grid[day][period] === opt.value;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => set(day, period, opt.value)}
                              className={cn(
                                "rounded-lg border px-2 py-1 text-[11px] transition-all duration-150",
                                active ? opt.activeStyle : opt.style,
                                "hover:opacity-80"
                              )}
                              title={opt.label}
                            >
                              {opt.short}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* Gauge */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mx-auto mt-10 max-w-md">
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
              <span className="text-xs text-muted-foreground">Occupation : {Math.round(ratio * 100)}%</span>
            </CardContent>
          </Card>
        </motion.div>

        {/* Conseils */}
        <AnimatePresence mode="wait">
          <motion.div
            key={score < 30 ? "low" : score < 60 ? "mid" : "high"}
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
      </section>
    </Layout>
  );
};

export default Diagnostic;
