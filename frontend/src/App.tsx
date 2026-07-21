import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "@/context/AuthContext";
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
import Progress from "./pages/Progress";
import { Conversation } from "./components/conversation/Conversation";
import ConversationList from "./pages/ConversationList";
import NewConversation from "./components/conversation/NewConversation";

function App() {
  return (
    <ToastProvider position="top-right">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/oauth-success" element={<OAuthSuccess />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppShell />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/scenarios" element={<Scenarios />} />
                <Route path="/conversations" element={<ConversationList />} />
                <Route
                  path="/conversation/new?"
                  element={<NewConversation />}
                />
                <Route
                  path="/conversation/:sessionId?"
                  element={<Conversation />}
                />
                <Route path="/progress" element={<Progress />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
