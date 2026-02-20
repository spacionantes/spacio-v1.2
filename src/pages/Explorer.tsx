import { useState } from "react";
import { Search, SlidersHorizontal, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Layout from "@/components/Layout";
import SpaceCard from "@/components/SpaceCard";
import SpaceDetailDialog from "@/components/SpaceDetailDialog";
import { mockSpaces, type Space } from "@/data/mockData";

const Explorer = () => {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);

  const filtered = mockSpaces.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || s.type === typeFilter;
    return matchSearch && matchType;
  });

  const types = [...new Set(mockSpaces.map((s) => s.type))];

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)]">
        <div className="border-b border-border bg-background px-4 py-4">
          <div className="container flex flex-wrap items-center gap-3">
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-card px-3 py-1.5 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom, ville..."
                className="border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 rounded-2xl">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Type d'espace" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {types.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-4 lg:max-h-[calc(100vh-8rem)]">
            <p className="mb-4 text-sm text-muted-foreground">{filtered.length} espace{filtered.length > 1 ? "s" : ""} trouvé{filtered.length > 1 ? "s" : ""}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((space) => (
                <div key={space.id} className="cursor-pointer" onClick={() => setSelectedSpace(space)}>
                  <SpaceCard space={space} />
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="flex flex-col items-center py-16 text-center">
                <MapPin className="mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-lg font-medium">Aucun espace trouvé</p>
                <p className="text-sm text-muted-foreground">Essayez de modifier vos critères de recherche</p>
              </div>
            )}
          </div>

          {/* Map placeholder */}
          <div className="hidden border-l border-border lg:block lg:w-1/2">
            <div className="flex h-full min-h-[calc(100vh-8rem)] items-center justify-center bg-surface-alt">
              <div className="text-center">
                <MapPin className="mx-auto mb-3 h-10 w-10 text-muted-foreground/30" />
                <p className="font-medium text-muted-foreground/50">Carte interactive</p>
                <p className="text-sm text-muted-foreground/30">Bientôt disponible</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <SpaceDetailDialog space={selectedSpace} open={!!selectedSpace} onOpenChange={(v) => !v && setSelectedSpace(null)} />
    </Layout>
  );
};

export default Explorer;
