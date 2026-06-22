import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AppShell from "./layouts/AppShell";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import { Landing } from "./pages/Landing";
import Scenarios from "./pages/Scenarios";
import Progress from "./pages/Progress";
import Conversation from "./pages/Conversation";
import Draft from "./pages/Draft";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          {/* Protected routes — redirect to /login if not authenticated */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/conversation" element={<Conversation />} />
              <Route path="/draft" element={<Draft />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
