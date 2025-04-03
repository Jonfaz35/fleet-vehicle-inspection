
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TabNavigation from "./components/TabNavigation";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Inspections from "./pages/Inspections";
import Settings from "./pages/Settings";
import VehicleDetail from "./pages/VehicleDetail";
import InspectionForm from "./pages/InspectionForm";
import InspectionDetail from "./pages/InspectionDetail";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import { UserProvider, useUser } from "./contexts/UserContext";
import UpdateCredentialsModal from "./components/UpdateCredentialsModal";

const queryClient = new QueryClient();

// Protected route component that checks for admin access
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, isAdmin } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <div className="container py-8">
      <h2 className="text-2xl font-semibold mb-4">Access Denied</h2>
      <p>You don't have permission to access this page.</p>
    </div>;
  }
  
  return <>{children}</>;
};

// Protected route component that checks for authenticated user
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth wrapper component
const AuthenticatedApp = () => {
  const { currentUser } = useUser();
  
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <TabNavigation />
      <UpdateCredentialsModal />
      
      <Routes>
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
        <Route path="/inspections" element={<ProtectedRoute><Inspections /></ProtectedRoute>} />
        <Route path="/inspection/:id" element={<ProtectedRoute><InspectionDetail /></ProtectedRoute>} />
        <Route path="/settings" element={
          <AdminRoute>
            <Settings />
          </AdminRoute>
        } />
        <Route path="/vehicle/:id" element={<ProtectedRoute><VehicleDetail /></ProtectedRoute>} />
        <Route path="/inspect/:id" element={<ProtectedRoute><InspectionForm /></ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthenticatedApp />
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
