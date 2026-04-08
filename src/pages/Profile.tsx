import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/apiService";
import { SideBar } from "../components/SideBar";
import { TweetCard } from "../components/TweetCard";

export function Profile() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [userTweets, setUserTweets] = useState<any[]>([]);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  const userRaw = localStorage.getItem("user");
  const loggedUser = userRaw ? JSON.parse(userRaw) : null;

  const isDarkMode = true;
  const theme = {
    bg: isDarkMode ? "#000" : "#fff",
    text: isDarkMode ? "#e7e9ea" : "#0f1419",
    border: isDarkMode ? "#2f3336" : "#eff3f4",
    card: isDarkMode ? "#16181c" : "#f7f9f9",
  };
  const ehMeuPerfil = !id || id === loggedUser?.id;
  const displayUser = ehMeuPerfil ? loggedUser || profileUser : profileUser;
const fetchDados = useCallback(async () => {
    const targetId = id || loggedUser?.id;
    if (!targetId) return;
    try {
      setLoading(true);
      const [tweetRes, userRes] = await Promise.all([
        api.get(`/auth/tweets/user/${targetId}`),
        api.get(`/auth/users/${targetId}`),
      ]);
      const userData = userRes.data;

      const listaSeguidores = userData.followers || [];
      const seguindo = listaSeguidores.some((f: any) => {
        const idSeguidor = typeof f === 'string' ? f : (f.followerId || f.id);
        return idSeguidor === loggedUser?.id;
      });

      setIsFollowing(!!seguindo);
      setProfileUser(userData);
      setUserTweets(tweetRes.data.data || tweetRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [id, loggedUser?.id]);

  useEffect(() => {
    fetchDados();
  }, [fetchDados]);

  const handleFollowToggle = async () => {
    if (!profileUser?.id) return;
    try {
      if (isFollowing) {
        await api.delete(`/auth/users/${profileUser.id}/unfollow`);
        setIsFollowing(false);
      } else {
        await api.post(`/auth/users/${profileUser.id}/follow`);
        setIsFollowing(true);
      }
    } catch (e) {
      console.error("Erro na sincronia do botão:", e);
      fetchDados();
    }
  };
  const handleLike = async (tweetId: string) => {
    try {
      const t = userTweets.find((item) => item.id === tweetId);
      const jaCurtiu = t?.likes?.some((l: any) => l.userId === loggedUser?.id);
      if (jaCurtiu) await api.delete(`/auth/unlike/${tweetId}`);
      else await api.post(`/auth/like/${tweetId}`);
      setUserTweets((prev) =>
        prev.map((tw) =>
          tw.id === tweetId
            ? {
                ...tw,
                likes: jaCurtiu
                  ? tw.likes.filter((l: any) => l.userId !== loggedUser.id)
                  : [...(tw.likes || []), { userId: loggedUser.id }],
              }
            : tw,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (!displayUser && !loading) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Usuário não encontrado.
      </div>
    );
  }

  if (!displayUser) {
    return <div style={{ backgroundColor: theme.bg, minHeight: "100vh" }} />;
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: theme.bg,
        color: theme.text,
        fontFamily: "sans-serif",
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
            style={{ cursor: "pointer", fontSize: "22px" }}
          >
            {" "}
            ←{" "}
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
          <div
            style={{
              padding: "15px",
              marginTop: "-50px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <img
              src={`https://github.com/${displayUser.username?.replace("@", "").trim()}.png`}
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                border: `4px solid ${theme.bg}`,
                objectFit: "cover",
                backgroundColor: "#fff",
              }}
              onError={(e) =>
                (e.currentTarget.src =
                  "https://cdn-icons-png.flaticon.com/512/149/149071.png")
              }
            />

            {!ehMeuPerfil && (
              <button
                onClick={handleFollowToggle}
                style={{
                  padding: "8px 20px",
                  borderRadius: "20px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  backgroundColor: isFollowing ? "transparent" : theme.text,
                  color: isFollowing ? theme.text : theme.bg,
                  border: isFollowing ? `1px solid ${theme.border}` : "none",
                }}
              >
                {isFollowing ? "Seguindo" : "Seguir"}
              </button>
            )}
          </div>
          <div style={{ padding: "10px 15px" }}>
            <div style={{ fontWeight: "bold", fontSize: "20px" }}>
              {displayUser.name}
            </div>
            <div style={{ color: "#71767b" }}>@{displayUser.username}</div>
          </div>
        </section>

        <section
          style={{ borderTop: `1px solid ${theme.border}`, marginTop: "10px" }}
        >
          {userTweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              theme={theme}
              onLike={() => handleLike(tweet.id)}
              onCommentSuccess={() => fetchDados()}
              onReply={() => {}}
              onDelete={
                ehMeuPerfil
                  ? async (tweetId) => {
                      if (window.confirm("Excluir?")) {
                        await api.delete(`/auth/tweets/${tweetId}`);
                        setUserTweets((prev) =>
                          prev.filter((t) => t.id !== tweetId),
                        );
                      }
                    }
                  : undefined
              }
              tweet={{
                id: tweet.id,
                nome: displayUser.name,
                arroba: displayUser.username,
                texto: tweet.content || tweet.texto,
                likes: tweet.likes?.length || 0,
                euCurti:
                  tweet.likes?.some((l: any) => l.userId === loggedUser?.id) ||
                  false,
                quantidadeRespostas: tweet._count?.replies || 0,
              }}
            />
          ))}
        </section>
      </main>
      <aside style={{ width: "350px" }} />
    </div>
  );
}
