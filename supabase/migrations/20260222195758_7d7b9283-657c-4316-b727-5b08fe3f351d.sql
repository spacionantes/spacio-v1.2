
INSERT INTO public.listings (title, address, city, price_per_hour, surface_m2, capacity, image_url, type, amenities, rating, reviews_count)
VALUES 
  ('Salle Lumière - Espace de réunion', '12 rue de la Paix', 'Paris', 25, 45, 20, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop', 'Salle de réunion', ARRAY['WiFi', 'Vidéoprojecteur', 'Tableau blanc'], 4.8, 24),
  ('Atelier Créatif du Marais', '8 rue des Archives', 'Paris', 35, 80, 40, 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop', 'Atelier', ARRAY['WiFi', 'Cuisine', 'Parking'], 4.6, 18),
  ('Grand Hall Bastille', '45 boulevard Voltaire', 'Paris', 60, 200, 150, 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop', 'Salle événementielle', ARRAY['WiFi', 'Sono', 'Scène', 'Vestiaire'], 4.9, 42),
  ('Espace Coworking Nation', '22 avenue Daumesnil', 'Paris', 15, 30, 10, 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop', 'Coworking', ARRAY['WiFi', 'Imprimante', 'Café'], 4.5, 31),
  ('Studio Danse République', '5 place de la République', 'Paris', 40, 120, 30, 'https://images.unsplash.com/photo-1594737625785-a6cbdabd333c?w=600&h=400&fit=crop', 'Studio', ARRAY['Miroirs', 'Sono', 'Vestiaire'], 4.7, 15),
  ('Salle Polyvalente Montmartre', '18 rue Lepic', 'Paris', 30, 90, 60, 'https://images.unsplash.com/photo-1517502884422-41eae6c63f6e?w=600&h=400&fit=crop', 'Salle polyvalente', ARRAY['WiFi', 'Cuisine', 'Tables', 'Chaises'], 4.4, 28);
