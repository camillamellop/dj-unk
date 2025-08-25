import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/Layout';

// Páginas públicas
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Páginas principais com Layout (Header + BottomNavigation)
import Home from './pages/Home';
import Index from './pages/Index';

// Páginas de usuário independentes (sem Layout padrão)
import AgendaImproved from './pages/AgendaImproved';
import ProjetosImproved from './pages/ProjetosImproved';
import BrandingUser from './pages/BrandingUser';
import Unkash from './pages/Unkash';
import UNK from './pages/UNK';
import SelfCare from './pages/SelfCare';
import Perfil from './pages/Perfil';

// Páginas Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import CentralAdmin from './pages/admin/CentralAdmin';
import CadastroDJs from './pages/admin/CadastroDJs';
import AgendaGeral from './pages/admin/AgendaGeral';
import ProspeccaoDatas from './pages/admin/ProspeccaoDatas';
import DJsManagement from './pages/admin/DJsManagement';
import Relatorios from './pages/admin/Relatorios';
import BrandingAdmin from './pages/BrandingAdmin';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <Routes>
            {/* Rota pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Páginas principais com Layout compartilhado */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="index" element={<Index />} />
              <Route path="unkash" element={<Unkash />} />
              <Route path="unk" element={<UNK />} />
              <Route path="selfcare" element={<SelfCare />} />
            </Route>
            
            {/* Páginas de usuário independentes (própria navegação/layout) */}
            <Route path="/perfil" element={<Perfil />} />
            
            {/* Páginas de Agenda */}
            <Route path="/agenda" element={<AgendaImproved />} />
            
            
            {/* Páginas de Projetos */}
            <Route path="/projetos" element={<ProjetosImproved />} />
            
          
            {/* Páginas de Branding */}
            <Route path="/branding" element={<BrandingUser />} />
                      
            {/* Rotas Admin */}
            <Route path="/admin">
              <Route index element={<AdminDashboard />} />
              <Route path="central" element={<CentralAdmin />} />
              <Route path="cadastro-djs" element={<CadastroDJs />} />
              <Route path="agenda-geral" element={<AgendaGeral />} />
              <Route path="prospeccao" element={<ProspeccaoDatas />} />
              <Route path="djs" element={<DJsManagement />} />
              <Route path="relatorios" element={<Relatorios />} />
              <Route path="branding" element={<BrandingAdmin />} />
            </Route>
            
            {/* Rota 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;