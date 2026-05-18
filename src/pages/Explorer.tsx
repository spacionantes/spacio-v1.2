import { useState, useCallback, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Layout from "@/components/Layout";
import SpaceCard from "@/components/SpaceCard";
import SpaceMap from "@/components/SpaceMap";
import SpaceDetailDialog from "@/components/SpaceDetailDialog";
import { useListings } from "@/hooks/useListings";
import type { Space } from "@/data/mockData";
import Seo from "@/components/Seo";

const Explorer = () => {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [quartierFilter, setQuartierFilter] = useState("all");
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const { data: spaces = [], isLoading } = useListings();
  const handleMapSpaceClick = useCallback((space: Space) => setSelectedSpace(space), []);

  // Compute bounds from data
  const { maxPrice, maxCapacity } = useMemo(() => {
    const prices = spaces.map((s) => s.price_per_hour);
    const caps = spaces.map((s) => s.capacity);
    return {
      maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : 100,
      maxCapacity: caps.length ? Math.max(...caps) : 100,
    };
  }, [spaces]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [capacityRange, setCapacityRange] = useState<[number, number]>([0, 100]);
  const [boundsInit, setBoundsInit] = useState(false);

  useEffect(() => {
    if (!boundsInit && spaces.length > 0) {
      setPriceRange([0, maxPrice]);
      setCapacityRange([0, maxCapacity]);
      setBoundsInit(true);
    }
  }, [spaces.length, maxPrice, maxCapacity, boundsInit]);

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam) setTypeFilter(typeParam);
  }, [searchParams]);

  const filtered = spaces.filter((s) => {
    const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || s.type === typeFilter;
    const matchQuartier = quartierFilter === "all" || s.quartier === quartierFilter;
    const matchPrice = s.price_per_hour >= priceRange[0] && s.price_per_hour <= priceRange[1];
    const matchCapacity = s.capacity >= capacityRange[0] && s.capacity <= capacityRange[1];
    return matchSearch && matchType && matchQuartier && matchPrice && matchCapacity;
  });

  const types = [...new Set(spaces.map((s) => s.type))];
  const quartiers = [...new Set(spaces.map((s) => s.quartier).filter(Boolean))].sort() as string[];

  const priceActive = priceRange[0] > 0 || priceRange[1] < maxPrice;
  const capActive = capacityRange[0] > 0 || capacityRange[1] < maxCapacity;
  const activeAdvanced = (priceActive ? 1 : 0) + (capActive ? 1 : 0);

  const resetAdvanced = () => {
    setPriceRange([0, maxPrice]);
    setCapacityRange([0, maxCapacity]);
  };

  return (
    <Layout>
      <Seo
        title="Explorer les espaces solidaires – Spacio Nantes"
        description="Parcourez les espaces disponibles à Nantes : salles, ateliers, coworking. Filtrez par type, quartier, capacité et prix pour trouver le lieu idéal."
        path="/explorer"
      />
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
                {types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={quartierFilter} onValueChange={setQuartierFilter}>
              <SelectTrigger className="w-48 rounded-2xl">
                <MapPin className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Quartier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les quartiers</SelectItem>
                {quartiers.map((q) => <SelectItem key={q} value={q}>{q}</SelectItem>)}
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="rounded-2xl">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Plus de filtres
                  {activeAdvanced > 0 && (
                    <span className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-bold text-primary-foreground">
                      {activeAdvanced}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 rounded-2xl p-5" align="end">
                <div className="space-y-5">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">Prix par heure</label>
                      <span className="text-xs text-muted-foreground">{priceRange[0]}€ – {priceRange[1]}€</span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={(v) => setPriceRange(v as [number, number])}
                      min={0}
                      max={maxPrice}
                      step={1}
                    />
                  </div>
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label className="text-sm font-medium">Capacité (personnes)</label>
                      <span className="text-xs text-muted-foreground">{capacityRange[0]} – {capacityRange[1]}</span>
                    </div>
                    <Slider
                      value={capacityRange}
                      onValueChange={(v) => setCapacityRange(v as [number, number])}
                      min={0}
                      max={maxCapacity}
                      step={1}
                    />
                  </div>
                  {activeAdvanced > 0 && (
                    <Button variant="ghost" size="sm" onClick={resetAdvanced} className="w-full rounded-xl">
                      <X className="mr-2 h-3.5 w-3.5" /> Réinitialiser
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 overflow-y-auto p-4 lg:max-h-[calc(100vh-8rem)]">
            <p className="mb-4 text-sm text-muted-foreground">
              {isLoading ? "Chargement…" : `${filtered.length} espace${filtered.length > 1 ? "s" : ""} trouvé${filtered.length > 1 ? "s" : ""}`}
            </p>
            {isLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>

          <div className="hidden border-l border-border lg:block lg:w-1/2">
            <div className="h-full min-h-[calc(100vh-8rem)]">
              <SpaceMap
                spaces={filtered}
                selectedSpaceId={selectedSpace?.id}
                onSpaceClick={handleMapSpaceClick}
              />
            </div>
          </div>
        </div>
      </section>
      <SpaceDetailDialog space={selectedSpace} open={!!selectedSpace} onOpenChange={(v) => !v && setSelectedSpace(null)} />
    </Layout>
  );
};

export default Explorer;
