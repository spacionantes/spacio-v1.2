import { useState } from "react";
import { MapPin, Star, Users, Ruler, Wifi, Car, Coffee, Monitor, Music, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthRequiredDialog from "@/components/AuthRequiredDialog";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import type { Space } from "@/data/mockData";
import type { CarouselApi } from "@/components/ui/carousel";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Café: <Coffee className="h-4 w-4" />,
  Vidéoprojecteur: <Monitor className="h-4 w-4" />,
  Sono: <Music className="h-4 w-4" />,
};

const SpaceDetailDialog = ({ space, open, onOpenChange }: { space: Space | null; open: boolean; onOpenChange: (v: boolean) => void }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!space) return null;

  const images = space.images && space.images.length > 0 ? space.images : [space.image_url];
  const hasMultiple = images.length > 1;

  const handleReserve = () => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    navigate(`/commencer?space=${space.id}`);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl p-0">
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            {hasMultiple ? (
              <Carousel
                className="h-full w-full"
                setApi={(api) => {
                  setCarouselApi(api);
                  api?.on("select", () => setCurrentSlide(api.selectedScrollSnap()));
                }}
              >
                <CarouselContent className="ml-0 h-full">
                  {images.map((url, i) => (
                    <CarouselItem key={i} className="pl-0">
                      <img src={url} alt={`${space.title} - ${i + 1}`} className="h-full w-full object-cover aspect-[16/9]" />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Nav arrows */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 hover:bg-background/90 shadow"
                  onClick={() => carouselApi?.scrollPrev()}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 hover:bg-background/90 shadow"
                  onClick={() => carouselApi?.scrollNext()}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>

                {/* Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? "bg-primary-foreground" : "bg-primary-foreground/40"}`}
                      onClick={() => carouselApi?.scrollTo(i)}
                    />
                  ))}
                </div>
              </Carousel>
            ) : (
              <img src={space.image_url} alt={space.title} className="h-full w-full object-cover" />
            )}
            <Badge className="absolute right-4 top-4 rounded-xl bg-primary px-3 py-1.5 text-base font-bold text-primary-foreground shadow-lg z-10">
              {space.price_per_hour}€/h
            </Badge>
          </div>

          <div className="space-y-4 p-6">
            <DialogHeader className="space-y-1">
              <DialogTitle className="text-xl">{space.title}</DialogTitle>
              <DialogDescription className="flex items-center gap-1.5 text-sm">
                <MapPin className="h-4 w-4" />
                {space.address}, {space.city}
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> {space.capacity} pers.</span>
              <span className="flex items-center gap-1.5"><Ruler className="h-4 w-4" /> {space.surface_m2} m²</span>
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <Star className="h-4 w-4 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
                {space.rating} <span className="font-normal text-muted-foreground">({space.reviews_count} avis)</span>
              </span>
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-foreground">Équipements</p>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map((a) => (
                  <Badge key={a} variant="secondary" className="gap-1.5 rounded-xl px-3 py-1">
                    {amenityIcons[a] || <ShieldCheck className="h-4 w-4" />}
                    {a}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              className="w-full rounded-2xl py-6 text-base font-semibold"
              onClick={handleReserve}
            >
              Réserver cet espace
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              L'équipe Spacio vous recontactera sous 24h pour étudier votre demande.
            </p>
          </div>
        </DialogContent>
      </Dialog>
      <AuthRequiredDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} returnTo={location.pathname} />
    </>
  );
};

export default SpaceDetailDialog;
