import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/apiService";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        localStorage.setItem("user", JSON.stringify(response.data.data));

        if (response.data.data.token) {
          localStorage.setItem("token", response.data.data.token);
        }

        alert("Bem-vindo ao GrowTwitter!");
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Erro detalhado da API:", error.response?.data);
      const msg =
        error.response?.data?.message || "E-mail ou senha incorretos.";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={leftPanelStyle}>
        <h2 style={titleStyle}>Bem-vindo ao GrowTwitter</h2>
      </div>

      <div style={rightPanelStyle}>
        <h1 style={formTitleStyle}>Entrar no GrowTwitter</h1>
        <p style={subtitleStyle}>Digite seus dados de acesso</p>

        <form onSubmit={handleLogin} style={formStyle}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              ...buttonStyle,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
};

const leftPanelStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: "#1D9BF0",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "40px",
};

const titleStyle: React.CSSProperties = {
  color: "white",
  fontSize: "3.5rem",
  fontWeight: "bold",
  fontFamily: "sans-serif",
  textAlign: "center",
};

const rightPanelStyle: React.CSSProperties = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "0 10%",
  backgroundColor: "#fff",
};

const formTitleStyle: React.CSSProperties = {
  fontSize: "2.5rem",
  fontWeight: "bold",
  marginBottom: "10px",
  fontFamily: "sans-serif",
};

const subtitleStyle: React.CSSProperties = {
  marginBottom: "20px",
  color: "#666",
  fontFamily: "sans-serif",
};

const formStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "15px",
  maxWidth: "400px",
};

const inputStyle: React.CSSProperties = {
  padding: "15px",
  borderRadius: "4px",
  border: "1px solid #ddd",
  fontSize: "1rem",
  fontFamily: "sans-serif",
};

const buttonStyle: React.CSSProperties = {
  padding: "15px",
  backgroundColor: "#1D9BF0",
  color: "white",
  border: "none",
  borderRadius: "30px",
  fontWeight: "bold",
  fontSize: "1rem",
  transition: "0.3s",
};

export default Login;
