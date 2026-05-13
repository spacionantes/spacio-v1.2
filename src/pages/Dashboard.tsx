import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  MapPin,
  Clock,
  Search,
  Inbox,
  ClipboardList,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Building2,
  Sparkles,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  created_at: string;
  space_title: string | null;
  city: string;
  organization_name: string;
  user_type: string;
  desired_date: string | null;
  desired_start_time: string | null;
  desired_end_time: string | null;
  statut: string | null;
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  nouveau: { label: "En attente", color: "bg-muted text-muted-foreground", icon: ClipboardList },
  valide: { label: "Validée", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  refuse: { label: "Refusée", color: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  en_cours: { label: "En cours", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Loader2 },
};

const getStatus = (s: string | null) =>
  statusConfig[s || "nouveau"] || statusConfig.nouveau;

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    supabase
      .from("leads")
      .select(
        "id, created_at, space_title, city, organization_name, user_type, desired_date, desired_start_time, desired_end_time, statut"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLeads((data as Lead[]) || []);
        setLoading(false);
      });
  }, [user?.id]);

  const stats = {
    total: leads.length,
    pending: leads.filter((l) => !l.statut || l.statut === "nouveau").length,
    validated: leads.filter((l) => l.statut === "valide").length,
    refused: leads.filter((l) => l.statut === "refuse").length,
  };

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-5xl space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Mes demandes</h1>
          <p className="text-sm text-muted-foreground">
            Suivez l&apos;avancement de vos réservations d&apos;espaces
          </p>
        </div>
        <Button asChild className="rounded-2xl">
          <Link to="/explorer">
            <Search className="mr-2 h-4 w-4" /> Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: stats.total, icon: ClipboardList, color: "bg-primary/10 text-primary" },
          { label: "En attente", value: stats.pending, icon: Loader2, color: "bg-amber-50 text-amber-600" },
          { label: "Validées", value: stats.validated, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-600" },
          { label: "Refusées", value: stats.refused, icon: XCircle, color: "bg-red-50 text-red-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Leads list */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Historique</h2>
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-16 text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="mb-1 text-lg font-medium">Aucune demande pour le moment</p>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              Explorez nos espaces et faites votre première demande en quelques clics
            </p>
            <Button asChild className="rounded-2xl">
              <Link to="/explorer">Explorer les espaces</Link>
            </Button>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-3">
              {leads.map((lead, idx) => {
                const status = getStatus(lead.statut);
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {lead.user_type === "owner" ? (
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                          ) : lead.user_type === "diagnostic" ? (
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <Search className="h-4 w-4 text-muted-foreground" />
                          )}
                          <h3 className="font-semibold">
                            {lead.space_title || "Demande générale"}
                          </h3>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {lead.city}
                          </span>
                          {lead.desired_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {format(new Date(lead.desired_date), "d MMM yyyy", {
                                locale: fr,
                              })}
                            </span>
                          )}
                          {lead.desired_start_time && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {lead.desired_start_time.slice(0, 5)}
                              {lead.desired_end_time &&
                                ` – ${lead.desired_end_time.slice(0, 5)}`}
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {lead.organization_name} · Envoyée le{" "}
                          {format(new Date(lead.created_at), "d MMMM yyyy", {
                            locale: fr,
                          })}
                        </p>
                      </div>
                      <Badge className={`rounded-xl ${status.color}`} variant="outline">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
