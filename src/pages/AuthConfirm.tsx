import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { supabase } from "@/integrations/supabase/client";

const AuthConfirm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const tokenHash = searchParams.get("token_hash");
      const type = searchParams.get("type");
      const nextParam = searchParams.get("next");

      if (!tokenHash || !type) {
        toast.error("Lien de confirmation invalide ou incomplet.");
        navigate("/auth", { replace: true });
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as "signup" | "invite" | "magiclink" | "recovery" | "email_change" | "email",
      });

      if (error) {
        toast.error("Le lien est invalide ou a expiré. Veuillez en demander un nouveau.");
        navigate(type === "recovery" ? "/auth?view=forgot" : "/auth", { replace: true });
        return;
      }

      // Pour la récupération de mot de passe : toujours rediriger vers la page de réinitialisation
      if (type === "recovery") {
        navigate("/reset-password", { replace: true });
        return;
      }

      // Pour la confirmation d'inscription / changement d'email
      if (type === "signup" || type === "email" || type === "email_change") {
        toast.success("Email confirmé avec succès !");
        navigate("/dashboard", { replace: true });
        return;
      }

      // Magic link ou autres
      navigate(nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard", { replace: true });
    };

    void confirmEmail();
  }, [navigate, searchParams]);

  return (
    <Layout>
      <Seo
        title="Confirmation d'email – Spacio"
        description="Validation de votre adresse email pour accéder à votre espace membre Spacio."
        path="/auth/confirm"
      />
      <section className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <h1 className="text-2xl font-bold">Confirmation en cours</h1>
          <p className="text-sm text-muted-foreground">
            Nous validons votre adresse email et vous redirigeons.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default AuthConfirm;