
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TabNavigation from "./components/TabNavigation";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Inspections from "./pages/Inspections";
import Settings from "./pages/Settings";
import VehicleDetail from "./pages/VehicleDetail";
import InspectionForm from "./pages/InspectionForm";
import NotFound from "./pages/NotFound";
import { UserProvider, useUser } from "./contexts/UserContext";
import UserManagement from "./components/UserManagement";

const queryClient = new QueryClient();

// Protected route component that checks for admin access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }
  
  if (!isAdmin) {
    return <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>;
  }
  
  return <>{children}</>;
};

// Auth wrapper component
const AuthenticatedApp = () => {
  const { currentUser } = useUser();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <TabNavigation />
        <UserManagement />
      </div>
      
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/inspections" element={<Inspections />} />
        <Route path="/settings" element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        } />
        <Route path="/vehicle/:id" element={<VehicleDetail />} />
        <Route path="/inspect/:id" element={<InspectionForm />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthenticatedApp />
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
