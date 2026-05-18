import Layout from "@/components/Layout";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import Seo from "@/components/Seo";
import { useListings } from "@/hooks/useListings";

const Reseau = () => {
  const { data: listings } = useListings();
  const listingsCount = listings?.length ?? 0;
  return (
    <Layout>
      <Seo
        title="Notre réseau – Associations partenaires de Spacio"
        description="Un écosystème de plus de 50 associations et partenaires engagés qui font confiance à Spacio pour mutualiser leurs espaces."
        path="/reseau"
      />
      <section className="container py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Notre réseau</h1>
          <p className="mb-12 text-muted-foreground">
            Un écosystème d'associations et de partenaires engagés à travers toute la France.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <div className="inline-block rounded-2xl border border-border bg-card px-12 py-10 shadow-sm">
              <p className="text-5xl font-extrabold text-primary md:text-6xl">+50</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                associations nous font confiance
              </p>
            </div>
            <div className="inline-block rounded-2xl border border-border bg-card px-12 py-10 shadow-sm">
              <p className="text-5xl font-extrabold text-primary md:text-6xl">{listingsCount}</p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">
                locaux disponibles
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default Reseau;
