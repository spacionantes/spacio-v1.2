import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockSpaces, type Space } from "@/data/mockData";

export const useListings = () => {
  return useQuery<Space[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        return mockSpaces;
      }

      return data.map((l) => ({
        id: l.id,
        title: l.title,
        address: l.address,
        city: l.city,
        price_per_hour: Number(l.price_per_hour),
        surface_m2: l.surface_m2,
        capacity: l.capacity,
        image_url: l.image_url || "",
        type: l.type,
        amenities: l.amenities || [],
        rating: Number(l.rating),
        reviews_count: l.reviews_count || 0,
        lat: (l as any).lat ?? undefined,
        lng: (l as any).lng ?? undefined,
      }));
    },
  });
};
