import { MapPin, Star, Users, Ruler, Wifi, Car, Coffee, Monitor, Music, ShieldCheck } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import type { Space } from "@/data/mockData";

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-4 w-4" />,
  Parking: <Car className="h-4 w-4" />,
  Café: <Coffee className="h-4 w-4" />,
  Vidéoprojecteur: <Monitor className="h-4 w-4" />,
  Sono: <Music className="h-4 w-4" />,
};

const SpaceDetailDialog = ({ space, open, onOpenChange }: { space: Space | null; open: boolean; onOpenChange: (v: boolean) => void }) => {
  const navigate = useNavigate();

  if (!space) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl gap-0 overflow-hidden rounded-2xl p-0">
        <div className="relative aspect-[16/9] w-full overflow-hidden">
          <img src={space.image_url} alt={space.title} className="h-full w-full object-cover" />
          <Badge className="absolute right-4 top-4 rounded-xl bg-primary px-3 py-1.5 text-base font-bold text-primary-foreground shadow-lg">
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
            onClick={() => navigate(`/commencer?space=${space.id}`)}
          >
            Réserver cet espace
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            L'équipe Spacio vous recontactera sous 24h pour étudier votre demande.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SpaceDetailDialog;
