import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import SpaceCard from "@/components/SpaceCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useListings } from "@/hooks/useListings";
import type { Space } from "@/data/mockData";

const FeaturedSpaces = () => {
  const { data: spaces = [], isLoading } = useListings();
  const navigate = useNavigate();

  // Top-rated 4 spaces
  const featured: Space[] = [...spaces]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4);

  return (
    <section className="relative overflow-hidden bg-background py-20 lg:py-24">
      {/* Ambient glows: indigo + amber */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-indigo/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-amber/10 blur-[120px]" />
      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-wrap items-end justify-between gap-4"
        >
          <div>
            <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Espaces en vedette</h2>
            <p className="text-muted-foreground">Une sélection de nos meilleurs espaces</p>
          </div>
          <Button asChild variant="outline" className="rounded-2xl">
            <Link to="/explorer">
              Voir tout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((space, i) => (
              <motion.div
                key={space.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="cursor-pointer"
                onClick={() => navigate("/explorer")}
              >
                <SpaceCard space={space} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedSpaces;
