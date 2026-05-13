import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, MapPin, Clock, LogOut, Search, Inbox } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

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

const statusColor = (s: string | null) => {
  switch (s) {
    case "valide": return "bg-[hsl(var(--success))]/15 text-[hsl(var(--success))]";
    case "refuse": return "bg-destructive/15 text-destructive";
    case "en_cours": return "bg-[hsl(var(--warning))]/15 text-[hsl(var(--warning))]";
    default: return "bg-accent text-accent-foreground";
  }
};

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
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
      .select("id, created_at, space_title, city, organization_name, user_type, desired_date, desired_start_time, desired_end_time, statut")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setLeads((data as Lead[]) || []);
        setLoading(false);
      });
  }, [user?.id]);

  if (authLoading || !user) {
    return (
      <Layout>
        <div className="container py-20">
          <Skeleton className="h-10 w-64" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container py-12">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mon espace</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild className="rounded-2xl">
              <Link to="/explorer"><Search className="mr-2 h-4 w-4" /> Nouvelle demande</Link>
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={() => { signOut(); navigate("/"); }}>
              <LogOut className="mr-2 h-4 w-4" /> Déconnexion
            </Button>
          </div>
        </div>

        <h2 className="mb-4 text-xl font-bold">Mes demandes ({leads.length})</h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full rounded-2xl" />)}
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <Inbox className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <p className="mb-1 text-lg font-medium">Aucune demande pour le moment</p>
            <p className="mb-6 text-sm text-muted-foreground">Explorez nos espaces et faites votre première demande</p>
            <Button asChild className="rounded-2xl">
              <Link to="/explorer">Explorer les espaces</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{lead.space_title || "Demande générale"}</h3>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{lead.city}</span>
                      {lead.desired_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {format(new Date(lead.desired_date), "d MMM yyyy", { locale: fr })}
                        </span>
                      )}
                      {lead.desired_start_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {lead.desired_start_time.slice(0, 5)}
                          {lead.desired_end_time && ` – ${lead.desired_end_time.slice(0, 5)}`}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Envoyée le {format(new Date(lead.created_at), "d MMMM yyyy", { locale: fr })}
                    </p>
                  </div>
                  <Badge className={`rounded-xl ${statusColor(lead.statut)}`} variant="outline">
                    {lead.statut === "nouveau" ? "En attente" : lead.statut === "valide" ? "Validée" : lead.statut === "refuse" ? "Refusée" : lead.statut === "en_cours" ? "En cours" : lead.statut || "En attente"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </Layout>
  );
};

export default Dashboard;
