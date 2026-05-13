import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  MapPin,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
} from "lucide-react";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  isSameDay,
  parseISO,
  isToday,
} from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Lead {
  id: string;
  space_title: string | null;
  city: string;
  desired_date: string | null;
  desired_start_time: string | null;
  desired_end_time: string | null;
  statut: string | null;
}

const statusConfig: Record<
  string,
  { label: string; bg: string; bar: string; text: string; icon: React.ElementType }
> = {
  nouveau: {
    label: "En attente",
    bg: "bg-primary/15 hover:bg-primary/25",
    bar: "bg-primary",
    text: "text-primary",
    icon: ClipboardList,
  },
  valide: {
    label: "Validée",
    bg: "bg-emerald-100 hover:bg-emerald-200",
    bar: "bg-emerald-500",
    text: "text-emerald-700",
    icon: CheckCircle2,
  },
  refuse: {
    label: "Refusée",
    bg: "bg-red-100 hover:bg-red-200",
    bar: "bg-red-500",
    text: "text-red-700",
    icon: XCircle,
  },
  en_cours: {
    label: "En cours",
    bg: "bg-amber-100 hover:bg-amber-200",
    bar: "bg-amber-500",
    text: "text-amber-700",
    icon: Loader2,
  },
};
const getStatus = (s: string | null) => statusConfig[s || "nouveau"] || statusConfig.nouveau;

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7h → 19h
const HOUR_HEIGHT = 56; // px per hour
const DAY_START_MIN = HOURS[0] * 60;

const timeToMin = (t: string | null) => {
  if (!t) return null;
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m || 0);
};

const Agenda = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("leads")
      .select(
        "id, space_title, city, desired_date, desired_start_time, desired_end_time, statut"
      )
      .eq("user_id", user.id)
      .not("desired_date", "is", null)
      .order("desired_date", { ascending: true })
      .then(({ data }) => {
        setLeads((data as Lead[]) || []);
        setLoading(false);
      });
  }, [user?.id]);

  const days = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const leadsByDay = useMemo(() => {
    const map: Record<string, Lead[]> = {};
    for (const d of days) map[format(d, "yyyy-MM-dd")] = [];
    for (const l of leads) {
      if (!l.desired_date) continue;
      const key = l.desired_date.slice(0, 10);
      if (map[key]) map[key].push(l);
    }
    return map;
  }, [leads, days]);

  const monthLabel = useMemo(() => {
    const end = addDays(weekStart, 6);
    if (weekStart.getMonth() === end.getMonth())
      return format(weekStart, "MMMM yyyy", { locale: fr });
    return `${format(weekStart, "MMM", { locale: fr })} – ${format(end, "MMM yyyy", { locale: fr })}`;
  }, [weekStart]);

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-6xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-[600px] w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mon agenda</h1>
          <p className="text-sm text-muted-foreground">
            Vue hebdomadaire de vos créneaux de réservation
          </p>
        </div>
        <Button asChild className="rounded-2xl">
          <Link to="/explorer">
            <Search className="mr-2 h-4 w-4" /> Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Aujourd&apos;hui
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setWeekStart(addWeeks(weekStart, -1))}
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => setWeekStart(addWeeks(weekStart, 1))}
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <span className="ml-2 text-base font-semibold capitalize">{monthLabel}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          {Object.entries(statusConfig).map(([k, s]) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className={cn("h-2 w-2 rounded-full", s.bar)} />
              {s.label}
            </span>
          ))}
        </div>
      </div>

      {/* Calendar grid */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Day headers */}
        <div className="grid border-b border-border bg-muted/30" style={{ gridTemplateColumns: "60px repeat(7, 1fr)" }}>
          <div className="border-r border-border" />
          {days.map((d) => {
            const today = isToday(d);
            return (
              <div
                key={d.toISOString()}
                className="flex flex-col items-center border-r border-border py-3 last:border-r-0"
              >
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {format(d, "EEE", { locale: fr })}
                </span>
                <span
                  className={cn(
                    "mt-1 flex h-9 w-9 items-center justify-center rounded-full text-base font-semibold",
                    today ? "bg-primary text-primary-foreground" : "text-foreground"
                  )}
                >
                  {format(d, "d")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="relative overflow-x-auto">
          <div
            className="relative grid"
            style={{
              gridTemplateColumns: "60px repeat(7, 1fr)",
              height: HOURS.length * HOUR_HEIGHT,
            }}
          >
            {/* Hours column */}
            <div className="relative border-r border-border">
              {HOURS.map((h) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 -translate-y-1/2 pr-2 text-right text-[11px] font-medium text-muted-foreground"
                  style={{ top: (h - HOURS[0]) * HOUR_HEIGHT }}
                >
                  {h.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {/* Day columns */}
            {days.map((d) => {
              const key = format(d, "yyyy-MM-dd");
              const dayLeads = leadsByDay[key] || [];
              return (
                <div key={key} className="relative border-r border-border last:border-r-0">
                  {/* Hour gridlines */}
                  {HOURS.map((h, i) => (
                    <div
                      key={h}
                      className={cn(
                        "absolute left-0 right-0 border-t",
                        i === 0 ? "border-transparent" : "border-border/60"
                      )}
                      style={{ top: i * HOUR_HEIGHT }}
                    />
                  ))}

                  {/* Today highlight */}
                  {isToday(d) && (
                    <div className="absolute inset-0 bg-primary/[0.03] pointer-events-none" />
                  )}

                  {/* Events */}
                  {loading
                    ? null
                    : dayLeads.map((lead) => {
                        const startMin = timeToMin(lead.desired_start_time) ?? DAY_START_MIN;
                        const endMin =
                          timeToMin(lead.desired_end_time) ?? startMin + 60;
                        const top =
                          ((startMin - DAY_START_MIN) / 60) * HOUR_HEIGHT;
                        const height = Math.max(
                          ((endMin - startMin) / 60) * HOUR_HEIGHT - 2,
                          24
                        );
                        const status = getStatus(lead.statut);
                        return (
                          <TooltipProvider key={lead.id} delayDuration={150}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className={cn(
                                    "absolute left-1 right-1 overflow-hidden rounded-lg border border-transparent text-left transition-all hover:shadow-md hover:-translate-y-px",
                                    status.bg
                                  )}
                                  style={{ top, height }}
                                >
                                  <div className="flex h-full">
                                    <div className={cn("w-1 shrink-0", status.bar)} />
                                    <div className="min-w-0 flex-1 px-2 py-1">
                                      <div
                                        className={cn(
                                          "truncate text-xs font-semibold",
                                          status.text
                                        )}
                                      >
                                        {lead.space_title || "Demande"}
                                      </div>
                                      {height > 36 && (
                                        <div className="truncate text-[11px] text-muted-foreground">
                                          {lead.desired_start_time?.slice(0, 5)}
                                          {lead.desired_end_time &&
                                            ` – ${lead.desired_end_time.slice(0, 5)}`}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="rounded-xl">
                                <div className="space-y-1.5">
                                  <p className="font-semibold">
                                    {lead.space_title || "Demande générale"}
                                  </p>
                                  <p className="flex items-center gap-1.5 text-xs">
                                    <MapPin className="h-3 w-3" /> {lead.city}
                                  </p>
                                  <p className="text-xs">
                                    {lead.desired_start_time?.slice(0, 5)}
                                    {lead.desired_end_time &&
                                      ` – ${lead.desired_end_time.slice(0, 5)}`}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="rounded-lg text-[10px]"
                                  >
                                    {status.label}
                                  </Badge>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        );
                      })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {leads.length === 0 && !loading && (
        <p className="text-center text-sm text-muted-foreground">
          Aucune réservation pour le moment.{" "}
          <Link to="/explorer" className="text-primary underline-offset-4 hover:underline">
            Explorer les espaces
          </Link>
        </p>
      )}
    </div>
  );
};

export default Agenda;
