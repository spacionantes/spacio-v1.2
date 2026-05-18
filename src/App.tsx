import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import { AuthProvider } from "./hooks/useAuth";

// Lazy-loaded routes — keep landing eager for fast LCP, defer the rest
const Explorer = lazy(() => import("./pages/Explorer"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogArticle = lazy(() => import("./pages/BlogArticle"));
const GetStarted = lazy(() => import("./pages/GetStarted"));
const Diagnostic = lazy(() => import("./pages/Diagnostic"));
const Legal = lazy(() => import("./pages/Legal"));
const Equipe = lazy(() => import("./pages/Equipe"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Reseau = lazy(() => import("./pages/Reseau"));
const DevenirHote = lazy(() => import("./pages/DevenirHote"));
const Missions = lazy(() => import("./pages/Missions"));
const Contact = lazy(() => import("./pages/Contact"));
const Auth = lazy(() => import("./pages/Auth"));
const AuthConfirm = lazy(() => import("./pages/AuthConfirm"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Agenda = lazy(() => import("./pages/Agenda"));
const NotFound = lazy(() => import("./pages/NotFound"));
const LouerLocalAssociation = lazy(() => import("./pages/LouerLocalAssociation"));
const LocationSalleReunionNantes = lazy(() => import("./pages/LocationSalleReunionNantes"));
const MemberLayout = lazy(() => import("./components/MemberLayout"));

const queryClient = new QueryClient();

const RouteFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/explorer" element={<Explorer />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogArticle />} />
              <Route path="/commencer" element={<GetStarted />} />
              <Route path="/diagnostic" element={<Diagnostic />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/louer-local-association-nantes" element={<LouerLocalAssociation />} />
              <Route path="/location-salle-reunion-nantes" element={<LocationSalleReunionNantes />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/reseau" element={<Reseau />} />
              <Route path="/devenir-hote" element={<DevenirHote />} />
              <Route path="/missions" element={<Missions />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/auth/confirm" element={<AuthConfirm />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route element={<MemberLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agenda" element={<Agenda />} />
                <Route path="/profil" element={<Profile />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
