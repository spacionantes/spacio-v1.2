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
      const next = searchParams.get("next") || "/auth?verified=1";

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
        toast.error("Le lien de confirmation est invalide ou expiré.");
        navigate("/auth", { replace: true });
        return;
      }

      navigate(next, { replace: true });
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