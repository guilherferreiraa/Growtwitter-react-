import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/Login";
import { Feed } from "./pages/Feed";
import { Search } from "./pages/search";
import { Profile } from "./pages/perfil";
import type { ReactNode } from "react";

function PrivateRoute({ children }: { children: ReactNode }) {
  const user = localStorage.getItem("user");
  return user ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <Feed />
          </PrivateRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <PrivateRoute>
            <Search />
          </PrivateRoute>
        }
      />

<Route
  path="/profile/:id?" 
  element={
    <PrivateRoute>
      <Profile />
    </PrivateRoute>
  }
/>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;
