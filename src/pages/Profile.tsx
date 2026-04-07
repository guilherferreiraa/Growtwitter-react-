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
    const carregarDados = async () => {
      // Se não tiver ID na URL, usa o ID do usuário logado (Meu Perfil)
      const targetId = id || loggedUser?.id;

      if (!targetId || targetId === "undefined") return;

      try {
        const [tweetRes, userRes] = await Promise.all([
          api.get(`/auth/tweets/user/${targetId}`),
          api.get(`/auth/users/${targetId}`),
        ]);
        
        // Garante que pegamos o array de dados corretamente
        const tweetsData = tweetRes.data.data || tweetRes.data;
        setUserTweets(Array.isArray(tweetsData) ? tweetsData : []);
        setProfileUser(userRes.data);
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    };

    carregarDados();
  }, [id, loggedUser?.id]);

  const handleLike = async (tweetId: string) => {
    try {
      const t = userTweets.find((item) => item.id === tweetId);
      const jaCurtiu = t?.likes?.some((l: any) => l.userId === loggedUser?.id);

      if (jaCurtiu) {
        await api.delete(`/auth/unlike/${tweetId}`);
      } else {
        await api.post(`/auth/like/${tweetId}`);
      }
      
      // Atualização otimista da UI
      setUserTweets((prev) =>
        prev.map((tweet) => {
          if (tweet.id === tweetId) {
            const novosLikes = jaCurtiu
              ? tweet.likes.filter((l: any) => l.userId !== loggedUser?.id)
              : [...(tweet.likes || []), { userId: loggedUser?.id }]; 
            return { ...tweet, likes: novosLikes };
          }
          return tweet;
        }),
      );
    } catch (err) {
      console.error("Erro ao curtir:", err);
    }
  };

  const handleCommentSync = (tweetId: string) => {
    setUserTweets((prev) =>
      prev.map((tweet) => {
        if (tweet.id === tweetId) {
          return { 
            ...tweet, 
            quantidadeRespostas: (tweet.quantidadeRespostas || 0) + 1 
          };
        }
        return tweet;
      })
    );
  };

  const displayUser = profileUser || loggedUser;
  if (!displayUser) return null;

  // Verifica se o perfil visualizado pertence ao usuário logado
  const ehMeuPerfil = !id || id === loggedUser?.id;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "sans-serif"
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
            borderBottom: `1px solid ${theme.border}`
          }}
        >
          <div
            onClick={() => navigate("/home")}
            style={{ cursor: "pointer", fontSize: "22px", padding: "5px" }}
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
              src={`https://github.com/${displayUser.username?.replace("@", "").trim().toLowerCase()}.png`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `4px solid ${theme.bg}`,
                objectFit: "cover",
                backgroundColor: "#fff"
              }}
              onError={(e) => (e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png")}
            />
            <div style={{ marginTop: "10px" }}>
              <div style={{ fontWeight: "bold", fontSize: "20px" }}>
                {displayUser.name}
              </div>
              <div style={{ color: "#71767b" }}>@{displayUser.username}</div>
            </div>
          </div>
        </section>

        <section style={{ borderTop: `1px solid ${theme.border}`, marginTop: "10px" }}>
          {userTweets.length > 0 ? (
            userTweets.map((tweet: any) => (
              <TweetCard
                key={tweet.id}
                theme={theme}
                onLike={() => handleLike(tweet.id)}
                onCommentSuccess={() => handleCommentSync(tweet.id)}
                // Resposta ativa no perfil
                onReply={async (tweetId) => {
                  const texto = prompt("Digite sua resposta:");
                  if (!texto || !texto.trim()) return;
                  try {
                    await api.post(`/auth/tweets/${tweetId}/reply`, { content: texto });
                    handleCommentSync(tweetId);
                  } catch (e) { console.error(e); }
                }}
                onDelete={ehMeuPerfil ? async (tweetId) => {
                  if (!window.confirm("Deseja excluir?")) return;
                  try {
                    await api.delete(`/auth/tweets/${tweetId}`);
                    setUserTweets(prev => prev.filter(t => t.id !== tweetId));
                  } catch { alert("Erro ao excluir"); }
                } : undefined}
                tweet={{
                  id: tweet.id,
                  userId: displayUser.id,
                  nome: displayUser.name,
                  arroba: displayUser.username,
                  texto: tweet.content || tweet.texto,
                  likes: tweet.likes?.length || 0,
                  euCurti: tweet.likes?.some((l: any) => l.userId === loggedUser?.id) || false,
                  quantidadeRespostas: tweet.quantidadeRespostas ?? (tweet._count?.replies || 0),
                }}
              />
            ))
          ) : (
            <div style={{ padding: "40px", textAlign: "center", color: "#71767b" }}>
              Nenhum tweet encontrado.
            </div>
          )}
        </section>
      </main>
      <aside style={{ width: "350px", padding: "20px" }} />
    </div>
  );
}