import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { AuthProvider } from "@/context/AuthProvider";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ToastProvider } from "@/components/ui/toast";
import AppShell from "./layouts/AppShell";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import OAuthSuccess from "./pages/OAuthSuccess";
import { Landing } from "./pages/Landing";
import Scenarios from "./pages/Scenarios";
import { Conversation } from "./components/conversation/Conversation";
import ConversationList from "./pages/ConversationList";
import AllScoresPage from "./pages/AllScores";
import AllBadgesPage from "./pages/AllBadges";
import VerifyEmailChange from "./components/settings/VerifyEmailChange";
import Pricing from "./pages/Pricing";
import NotFound from "./pages/NotFound";

function AuthProviderRoute() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function App() {
  return (
    <ToastProvider position="top-right">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />

          <Route element={<AuthProviderRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route
              path="/settings/verify-email"
              element={<VerifyEmailChange />}
            />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route path="/conversations" element={<ConversationList />} />
                <Route
                  path="/conversation/:sessionId?"
                  element={<Conversation />}
                />
                <Route path="/settings" element={<Settings />} />
                <Route path="/scores/me" element={<AllScoresPage />} />
                <Route path="/badges/me" element={<AllBadgesPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
