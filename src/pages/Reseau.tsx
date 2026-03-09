import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const fetchPartners = async () => {
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

const Reseau = () => {
  const { data: partners, isLoading } = useQuery({
    queryKey: ["partners"],
    queryFn: fetchPartners,
  });

  return (
    <Layout>
      <section className="container py-12 md:py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Notre réseau</h1>
          <p className="mb-12 text-muted-foreground">Les associations et partenaires qui font confiance à Spacio.</p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <Skeleton className="mb-3 h-10 w-10 rounded-xl" />
                  <Skeleton className="mb-1 h-4 w-3/4" />
                  <Skeleton className="mb-2 h-3 w-1/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              ))
            : partners?.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                >
                  <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-1 font-semibold text-sm">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">{p.city}</p>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.description}</p>
                </motion.div>
              ))}
        </div>
      </section>
    </Layout>
  );
};

export default Reseau;
