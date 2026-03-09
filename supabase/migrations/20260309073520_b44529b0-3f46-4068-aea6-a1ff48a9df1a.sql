
CREATE TABLE public.partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  city text NOT NULL,
  description text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Public read access
CREATE POLICY "Partners are publicly readable"
  ON public.partners FOR SELECT
  USING (true);

-- Only service role can manage
CREATE POLICY "Only service role can insert partners"
  ON public.partners FOR INSERT
  WITH CHECK (false);

CREATE POLICY "Only service role can update partners"
  ON public.partners FOR UPDATE
  USING (false);

CREATE POLICY "Only service role can delete partners"
  ON public.partners FOR DELETE
  USING (false);

-- Seed with existing data
INSERT INTO public.partners (name, city, description) VALUES
  ('Maison des Associations de Nantes', 'Nantes', 'Accompagnement et ressources pour les associations nantaises.'),
  ('France Active Pays de la Loire', 'Nantes', 'Financement et accompagnement des structures de l''ESS.'),
  ('Le Solilab', 'Nantes', 'Lieu d''innovation sociale et solidaire sur l''île de Nantes.'),
  ('Ligue de l''Enseignement 44', 'Nantes', 'Mouvement d''éducation populaire et réseau associatif.'),
  ('Ecossolies', 'Nantes', 'Pôle de coopération des acteurs de l''ESS en Loire-Atlantique.'),
  ('La Cantine Numérique', 'Nantes', 'Espace de coworking et d''événements pour l''innovation.');
