
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TabNavigation from "./components/TabNavigation";
import Index from "./pages/Index";
import Vehicles from "./pages/Vehicles";
import Inspections from "./pages/Inspections";
import Settings from "./pages/Settings";
import VehicleDetail from "./pages/VehicleDetail";
import InspectionForm from "./pages/InspectionForm";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <TabNavigation />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/inspections" element={<Inspections />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/inspect/:id" element={<InspectionForm />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
