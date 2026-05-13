import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { User, Building2, MapPin, Save, Mail } from "lucide-react";

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  organization: string | null;
  city: string | null;
  created_at: string | null;
}

const ProfilePage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", organization: "", city: "" });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!user?.id) return;
    supabase
      .from("profiles")
      .select("id, user_id, full_name, organization, city, created_at")
      .eq("user_id", user.id)
      .single()
      .then(({ data, error }) => {
        if (data) {
          setProfile(data as Profile);
          setForm({
            full_name: data.full_name || "",
            organization: data.organization || "",
            city: data.city || "",
          });
        }
        setLoading(false);
      });
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        full_name: form.full_name.trim() || null,
        organization: form.organization.trim() || null,
        city: form.city.trim() || null,
      }, { onConflict: "user_id" });

    if (error) {
      toast.error("Erreur lors de la sauvegarde");
      console.error(error);
    } else {
      toast.success("Profil mis à jour");
    }
    setSaving(false);
  };

  const initials = (form.full_name || user?.email?.split("@")[0] || "?")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-48 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <p className="text-sm text-muted-foreground">Gérez vos informations personnelles</p>
      </div>

      {/* Avatar + Email */}
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold">
          {initials}
        </div>
        <div>
          <p className="font-semibold">{form.full_name || "Utilisateur"}</p>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            {user.email}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5 rounded-2xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold">Informations</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full_name" className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" /> Nom complet
            </Label>
            <Input
              id="full_name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Votre nom"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="organization" className="flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" /> Organisation
            </Label>
            <Input
              id="organization"
              value={form.organization}
              onChange={(e) => setForm((f) => ({ ...f, organization: e.target.value }))}
              placeholder="Nom de votre structure"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="city" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" /> Ville
            </Label>
            <Input
              id="city"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              placeholder="Votre ville"
              className="rounded-xl"
            />
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving} className="rounded-2xl">
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
