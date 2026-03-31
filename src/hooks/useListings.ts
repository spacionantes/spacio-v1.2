import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { mockSpaces, type Space } from "@/data/mockData";

export const useListings = () => {
  return useQuery<Space[]>({
    queryKey: ["listings"],
    queryFn: async () => {
      const [{ data, error }, { data: imagesData }] = await Promise.all([
        supabase
          .from("listings")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("listing_images")
          .select("listing_id, image_url, position")
          .order("position", { ascending: true }),
      ]);

      if (error) throw error;

      if (!data || data.length === 0) {
        return mockSpaces;
      }

      // Group images by listing_id
      const imagesByListing: Record<string, string[]> = {};
      if (imagesData) {
        for (const img of imagesData) {
          if (!imagesByListing[img.listing_id]) {
            imagesByListing[img.listing_id] = [];
          }
          imagesByListing[img.listing_id].push(img.image_url);
        }
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
        images: imagesByListing[l.id] || (l.image_url ? [l.image_url] : []),
        type: l.type,
        amenities: l.amenities || [],
        host_name: l.host_name || undefined,
        rating: Number(l.rating),
        reviews_count: l.reviews_count || 0,
        lat: l.lat ?? undefined,
        lng: l.lng ?? undefined,
      }));
    },
  });
};
