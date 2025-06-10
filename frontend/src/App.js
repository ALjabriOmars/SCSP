import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ForgotPassword from "./pages/ForgotPassword";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ResidentDashboard from "./pages/ResidentDashboard";
import CityAuthorityDashboard from "./pages/CityAuthorityDashboard";
import ServiceProviderDashboard from "./pages/ServiceProviderDashboard";
import BookingPage from "./pages/BookingPage";
import FacilitiesPage from "./pages/FacilitiesPage";
import ReportIssuePage from "./pages/ReportIssuePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/resident-dashboard" element={<ResidentDashboard />} />
        <Route path="/dashboard/authority" element={<CityAuthorityDashboard />} />
        <Route path="/authority" element={<CityAuthorityDashboard />} />
        <Route path="/dashboard/provider" element={<ServiceProviderDashboard />} />
        <Route path="/book-facility" element={<BookingPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/report-issue" element={<ReportIssuePage />} />
      </Routes>
    </Router>
  );
}

export default App;
