import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Explorer from "./pages/Explorer";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import GetStarted from "./pages/GetStarted";
import Diagnostic from "./pages/Diagnostic";
import Legal from "./pages/Legal";
import Equipe from "./pages/Equipe";
import FAQ from "./pages/FAQ";
import Reseau from "./pages/Reseau";
import DevenirHote from "./pages/DevenirHote";
import Missions from "./pages/Missions";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Agenda from "./pages/Agenda";
import NotFound from "./pages/NotFound";
import LouerLocalAssociation from "./pages/LouerLocalAssociation";
import ScrollToTop from "./components/ScrollToTop";
import MemberLayout from "./components/MemberLayout";
import { AuthProvider } from "./hooks/useAuth";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/explorer" element={<Explorer />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogArticle />} />
            <Route path="/commencer" element={<GetStarted />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/louer-local-association-nantes" element={<LouerLocalAssociation />} />
            <Route path="/equipe" element={<Equipe />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/reseau" element={<Reseau />} />
            <Route path="/devenir-hote" element={<DevenirHote />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<MemberLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/agenda" element={<Agenda />} />
              <Route path="/profil" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
