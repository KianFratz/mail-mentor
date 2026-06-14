import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import AppShell from "./layouts/AppShell";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import { Login } from "./pages/Login";

import { Landing } from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
