import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Lock, User, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Inscription = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, { full_name: fullName, organization });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Compte créé !", description: "Vérifiez votre email pour confirmer votre inscription." });
      navigate(returnTo);
    }
  };

  return (
    <Layout>
      <section className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md rounded-2xl">
          <CardContent className="space-y-6 p-8">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold">Créer un compte</h1>
              <p className="mt-1 text-sm text-muted-foreground">Rejoignez la communauté Spacio</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Nom complet" value={fullName} onChange={(e) => setFullName(e.target.value)} className="pl-10" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input type="password" placeholder="Mot de passe (min. 6 caractères)" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10" required minLength={6} />
              </div>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Organisation" value={organization} onChange={(e) => setOrganization(e.target.value)} className="pl-10" />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} className="pl-10" />
              </div>
              <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
                {loading ? "Création…" : "Créer mon compte"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              Déjà un compte ?{" "}
              <Link to={`/connexion${returnTo !== "/" ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`} className="font-medium text-primary hover:underline">
                Se connecter
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </Layout>
  );
};

export default Inscription;
