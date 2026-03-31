import { MapPin, Star, Users, User } from "lucide-react";
import type { Space } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";

const SpaceCard = ({ space }: { space: Space }) => (
  <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md">
    <div className="relative aspect-[4/3] overflow-hidden">
      <img
        src={space.image_url}
        alt={space.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        loading="lazy"
      />
      <Badge className="absolute right-3 top-3 rounded-xl bg-primary font-semibold text-primary-foreground shadow-md">
        {space.price_per_hour}€/h
      </Badge>
    </div>
    <div className="p-4">
      <h3 className="mb-1 font-semibold leading-snug text-foreground">{space.title}</h3>
      <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
        <MapPin className="h-3.5 w-3.5" />
        <span>{space.address}, {space.city}</span>
      </div>
      {space.host_name && (
        <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
          <User className="h-3.5 w-3.5" />
          <span>Hôte : {space.host_name}</span>
        </div>
      )}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3 text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" /> {space.capacity}
          </span>
          <span>{space.surface_m2}m²</span>
        </div>
        <div className="flex items-center gap-1 font-medium text-foreground">
          <Star className="h-3.5 w-3.5 fill-[hsl(var(--warning))] text-[hsl(var(--warning))]" />
          {space.rating}
          <span className="text-xs text-muted-foreground">({space.reviews_count})</span>
        </div>
      </div>
    </div>
  </div>
);

export default SpaceCard;
