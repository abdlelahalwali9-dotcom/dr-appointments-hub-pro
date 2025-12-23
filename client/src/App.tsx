import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import Home from "@/pages/Home";
import Patients from "@/pages/Patients";
import Doctors from "@/pages/Doctors";
import Appointments from "@/pages/Appointments";
import Services from "@/pages/Services";
import Users from "@/pages/Users";
import WaitingQueue from "@/pages/WaitingQueue";
import Invoices from "@/pages/Invoices";
import MedicalRecords from "@/pages/MedicalRecords";
import Chat from "@/pages/Chat";
import Permissions from "@/pages/Permissions";
import AuditLog from "@/pages/AuditLog";
import Settings from "@/pages/Settings";
import Reports from "@/pages/Reports";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/patients"} component={Patients} />
      <Route path={"/doctors"} component={Doctors} />
      <Route path={"/appointments"} component={Appointments} />
      <Route path={"/services"} component={Services} />
      <Route path={"/users"} component={Users} />
      <Route path={"/waiting-queue"} component={WaitingQueue} />
      <Route path={"/invoices"} component={Invoices} />
      <Route path={"/medical-records"} component={MedicalRecords} />
      <Route path={"/chat"} component={Chat} />
      <Route path={"/permissions"} component={Permissions} />
      <Route path={"/audit-log"} component={AuditLog} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/reports"} component={Reports} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
