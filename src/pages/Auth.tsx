import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, MailCheck, ArrowLeft, KeyRound } from "lucide-react";
import Seo from "@/components/Seo";

type View = "auth" | "check-email" | "forgot";

// Utilise l'origine courante (Netlify preview, custom domain, localhost…)
// On retombe sur le domaine de prod uniquement en SSR/build (jamais en runtime).
const PUBLIC_SITE_URL =
  typeof window !== "undefined"
    ? window.location.origin
    : "https://www.spacionantes.fr";

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [view, setView] = useState<View>("auth");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle email-link errors (expired token, etc.)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("error")) {
      const params = new URLSearchParams(hash.replace("#", ""));
      const desc = params.get("error_description");
      if (desc) toast.error(decodeURIComponent(desc.replace(/\+/g, " ")));
      window.history.replaceState(null, "", window.location.pathname);
    }
    if (searchParams.get("verified") === "1") {
      toast.success("Email confirmé. Vous pouvez vous connecter.");
    }
  }, [searchParams]);

  useEffect(() => {
    if (user && view === "auth") navigate("/dashboard", { replace: true });
  }, [user, navigate, view]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (error.message.toLowerCase().includes("email not confirmed")) {
        toast.error("Votre email n'est pas encore confirmé. Vérifiez votre boîte de réception.");
        setView("check-email");
      } else {
        toast.error("Identifiants incorrects");
      }
      return;
    }
    navigate("/dashboard");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${PUBLIC_SITE_URL}/?auth_action=email-confirmed`,
        data: { full_name: fullName },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    // If session is null, email confirmation is required
    if (!data.session) {
      setView("check-email");
    } else {
      // Email confirmation disabled — user is logged in immediately
      toast.success("Compte créé !");
      navigate("/dashboard");
    }
  };

  const handleResend = async () => {
    if (!email) return toast.error("Entrez d'abord votre email");
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${PUBLIC_SITE_URL}/?auth_action=email-confirmed` },
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else toast.success("Email de confirmation renvoyé");
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${PUBLIC_SITE_URL}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Email de réinitialisation envoyé");
      setView("auth");
    }
  };

  return (
    <Layout>
      <Seo
        title="Connexion / Inscription – Spacio"
        description="Accédez à votre espace membre Spacio pour gérer vos demandes, réservations et profil."
        path="/auth"
      />
      <section className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
          {view === "check-email" ? (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <MailCheck className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Vérifiez votre boîte mail</h1>
              <p className="text-sm text-muted-foreground">
                Nous avons envoyé un lien de confirmation à{" "}
                <span className="font-medium text-foreground">{email}</span>.
                Cliquez sur le lien pour activer votre compte.
              </p>
              <p className="text-xs text-muted-foreground">
                Pas reçu ? Vérifiez vos spams ou renvoyez le lien.
              </p>
              <Button
                onClick={handleResend}
                variant="outline"
                className="w-full rounded-2xl"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Renvoyer l'email
              </Button>
              <button
                onClick={() => setView("auth")}
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
            </div>
          ) : view === "forgot" ? (
            <form onSubmit={handleForgot} className="space-y-4">
              <div className="mb-2 text-center">
                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                  <KeyRound className="h-7 w-7 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Mot de passe oublié</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Entrez votre email pour recevoir un lien de réinitialisation.
                </p>
              </div>
              <div>
                <Label htmlFor="forgot-email">Email</Label>
                <Input
                  id="forgot-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer le lien
              </Button>
              <button
                type="button"
                onClick={() => setView("auth")}
                className="mx-auto flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Retour
              </button>
            </form>
          ) : (
            <>
              <h1 className="mb-2 text-2xl font-bold">Espace membre</h1>
              <p className="mb-6 text-sm text-muted-foreground">
                Connectez-vous pour suivre vos demandes
              </p>

              <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
                <TabsList className="mb-4 grid w-full grid-cols-2 rounded-2xl">
                  <TabsTrigger value="signin" className="rounded-2xl">Connexion</TabsTrigger>
                  <TabsTrigger value="signup" className="rounded-2xl">Inscription</TabsTrigger>
                </TabsList>

                <TabsContent value="signin">
                  <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                      <Label htmlFor="signin-email">Email</Label>
                      <Input id="signin-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="signin-password">Mot de passe</Label>
                      <Input id="signin-password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-primary hover:underline"
                    >
                      Mot de passe oublié ?
                    </button>
                    <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Se connecter
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div>
                      <Label htmlFor="signup-name">Nom complet</Label>
                      <Input
                        id="signup-name"
                        type="text"
                        autoComplete="name"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="signup-email">Email</Label>
                      <Input id="signup-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                      <Label htmlFor="signup-password">Mot de passe</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        autoComplete="new-password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <p className="mt-1 text-xs text-muted-foreground">
                        Minimum 8 caractères
                      </p>
                    </div>
                    <Button type="submit" className="w-full rounded-2xl" disabled={loading}>
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Créer mon compte
                    </Button>
                    <p className="text-center text-xs text-muted-foreground">
                      Un email de confirmation vous sera envoyé.
                    </p>
                  </form>
                </TabsContent>
              </Tabs>

              <p className="mt-6 text-center text-xs text-muted-foreground">
                <Link to="/" className="hover:underline">Retour à l'accueil</Link>
              </p>
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Auth;
