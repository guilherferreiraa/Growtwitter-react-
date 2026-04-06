import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/apiService";
import { SideBar } from "../components/SideBar";
import { TweetCard } from "../components/TweetCard";

export function Profile() {
  const navigate = useNavigate();
  const { id } = useParams(); 
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
    const targetId = id || JSON.parse(localStorage.getItem("user") || "{}")?.id;

    if (!targetId || targetId === "undefined") return;

    try {
      const [tweetRes, userRes] = await Promise.all([
        api.get(`/auth/tweets/user/${targetId}`),
        api.get(`/auth/users/${targetId}`)
      ]);
      setUserTweets(tweetRes.data.data || tweetRes.data);
      setProfileUser(userRes.data);
    } catch (e) {
      console.error("Erro ao carregar perfil:", e);
    }
  };

  carregarDados();
}, [id]);

  const handleLike = async (tweetId: string) => {
  try {
    const t = userTweets.find(item => item.id === tweetId);
    const jaCurtiu = t?.likes?.some((l: any) => l.userId === loggedUser?.id);

    if (jaCurtiu) {
      await api.delete(`/auth/unlike/${tweetId}`);
    } else {
      await api.post(`/auth/like/${tweetId}`);
    }

  } catch (err) {
    console.error("Erro ao curtir:", err);
  }
};

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
  userTweets
    .filter((t: any) => !t.tweet_original_id) 
    .map((tweet: any) => (
      
      <TweetCard
        key={tweet.id}
        theme={theme}
        onLike={() => handleLike(tweet.id)} 
        tweet={{
          id: tweet.id,
          nome: profileUser?.name || loggedUser?.name,
          arroba: profileUser?.username || loggedUser?.username,
          texto: tweet.content || tweet.texto,
          likes: tweet.likes?.length || 0,
          euCurti: tweet.likes?.some((l: any) => l.userId === loggedUser?.id) || false,
          quantidadeRespostas: tweet.replies?.length || 0,
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
      <aside style={{ width: "350px" }} />
    </div>
  );
  
}
