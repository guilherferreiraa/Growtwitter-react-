import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface SideBarProps {
  loggedUser: any;
  theme: any;
}

export function SideBar({ loggedUser, theme }: SideBarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const isHome = location.pathname === "/home";
  const isExplore = location.pathname === "/explore";
  const isProfile = location.pathname === "/profile";

  return (
    <aside style={{ ...sidebarStyle, borderRightColor: theme.border }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ color: "#1D9BF0", marginBottom: "30px" }}>growtweet</h2>
        <nav style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <div
            onClick={() => navigate("/home")}
            style={{
              fontWeight: isHome ? "bold" : "normal",
              color: isHome ? "#1D9BF0" : theme.text,
              cursor: "pointer",
            }}
          >
            🏠 Página Inicial
          </div>

          <div
            onClick={() => navigate("/explore")}
            style={{
              fontWeight: isExplore ? "bold" : "normal",
              color: isExplore ? "#1D9BF0" : theme.text,
              cursor: "pointer",
            }}
          >
            🔍 Explorar
          </div>

          <div
            onClick={() => navigate("/profile")}
            style={{
              fontWeight: isProfile ? "bold" : "normal",
              color: isProfile ? "#1D9BF0" : theme.text,
              cursor: "pointer",
            }}
          >
            👤 Perfil
          </div>
        </nav>
      </div>

      <div style={{ padding: "10px", marginBottom: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <img
            src={`https://github.com/${loggedUser.username}.png`}
            style={avatarStyle}
            onError={(e) => (e.currentTarget.src = FOTO_PADRAO)}
          />
          <div>
            <div style={{ fontSize: "0.9rem", fontWeight: "bold" }}>
              {loggedUser.name}
            </div>
            <div style={{ fontSize: "0.8rem", color: "#71767b" }}>
              @{loggedUser.username}
            </div>
          </div>
        </div>
        <button onClick={handleLogout} style={logoutButtonStyle}>
          Sair
        </button>
      </div>
    </aside>
  );
}

const sidebarStyle: React.CSSProperties = {
  width: "250px",
  padding: "20px",
  borderRight: "1px solid",
  display: "flex",
  flexDirection: "column",
};

const avatarStyle: React.CSSProperties = {
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
};

const logoutButtonStyle: React.CSSProperties = {
  background: "none",
  border: "1px solid #71767b",
  color: "#ff0000",
  padding: "5px 15px",
  borderRadius: "20px",
  cursor: "pointer",
  fontSize: "0.8rem",
  width: "100%",
};
