import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/apiService";
import { SideBar } from "../components/SideBar";
import { TweetCard } from "../components/TweetCard";

export function Profile() {
  const navigate = useNavigate();
  const { id } = useParams(); // Pega o ID da URL se existir
  const [userTweets, setUserTweets] = useState<any[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);

  const userRaw = localStorage.getItem("user");
  const loggedUser = userRaw ? JSON.parse(userRaw) : null;

  const isDarkMode = true;
  const theme = {
    bg: isDarkMode ? "#000" : "#fff",
    text: isDarkMode ? "#e7e9ea" : "#0f1419",
    border: isDarkMode ? "#2f3336" : "#eff3f4",
    card: isDarkMode ? "#16181c" : "#f7f9f9",
  };

useEffect(() => {
  const carregarDadosDoPerfil = async () => {
    // Usamos o id da URL ou o id do usuário logado
    const targetId = id || loggedUser?.id;
    if (!targetId) return;

    try {
      // 1. Busca os tweets do usuário (Ajustado para bater com o router)
      // Removi o "/auth" da frente porque no seu router a rota começa com "/tweets"
      const tweetRes = await api.get(`/tweets/user/${targetId}`);
      
      const dadosVindos = tweetRes.data.data || tweetRes.data;
      setUserTweets(Array.isArray(dadosVindos) ? dadosVindos : []);

      const userRes = await api.get(`/users`); 
      const todosUsuarios = userRes.data.data || userRes.data;
      const usuarioEncontrado = todosUsuarios.find((u: any) => u.id === targetId);
      
      if (usuarioEncontrado) {
        setProfileUser(usuarioEncontrado);
      }
    } catch (e) {
      console.error("Erro ao carregar perfil:", e);
    }
  };

  carregarDadosDoPerfil();
}, [id, loggedUser?.id]);

  const displayUser = profileUser || loggedUser;
  if (!displayUser) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      <SideBar loggedUser={loggedUser} theme={theme} />

      <main
        style={{
          width: "600px",
          borderRight: `1px solid ${theme.border}`,
          borderLeft: `1px solid ${theme.border}`,
        }}
      >
        <header
          style={{
            padding: "10px 15px",
            display: "flex",
            alignItems: "center",
            gap: "30px",
            position: "sticky",
            top: 0,
            backgroundColor: theme.bg,
            zIndex: 999,
          }}
        >
          <div
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer", fontSize: "22px", padding: "10px" }}
          >
            ←
          </div>
          <div>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>
              {displayUser.name}
            </div>
            <div style={{ fontSize: "13px", color: "#71767b" }}>
              {userTweets.length} Tweets
            </div>
          </div>
        </header>

        <section>
          <div style={{ height: "150px", backgroundColor: "#333" }}></div>
          <div style={{ padding: "15px", marginTop: "-50px" }}>
            <img
              src={`https://github.com/${displayUser.username}.png`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `4px solid ${theme.bg}`,
                objectFit: "cover",
              }}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png")
              }
            />
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {displayUser.name}
              </div>
              <div style={{ color: "#71767b" }}>@{displayUser.username}</div>
            </div>
          </div>
        </section>

        <section
          style={{ borderTop: `1px solid ${theme.border}`, marginTop: "10px" }}
        >
          {userTweets.length > 0 ? (
            userTweets.map((tweet: any) => (
              <TweetCard
                key={tweet.id}
                theme={theme}
                onLike={() => {}}
                tweet={{
                  id: tweet.id,
                  nome: displayUser.name,
                  arroba: displayUser.username,
                  texto: tweet.content || tweet.texto,
                  likes: 0, // Removido conforme pedido
                  euCurti: false,
                  quantidadeRespostas: 0,
                }}
              />
            ))
          ) : (
            <div
              style={{ padding: "40px", textAlign: "center", color: "#71767b" }}
            >
              Este usuário ainda não possui tweets.
            </div>
          )}
        </section>
      </main>
      <aside style={{ width: "350px" }} />
    </div>
  );
}
