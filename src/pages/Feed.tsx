import { useEffect, useState, useCallback } from "react";
import api from "../services/apiService";

import { SideBar } from "../components/SideBar";
import { TweetCard } from "../components/TweetCard";
import { Input } from "../components/input";
import { Button } from "../components/button";

interface Tweet {
  id: string;
  nome: string;
  arroba: string;
  texto: string;
  likes: number;
  euCurti: boolean;
  respostas: any[];
}

export function Feed() {
  const [content, setContent] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const carregarTweets = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/auth/tweets");
      const tweetsBanco = res.data.data || res.data;

      if (!Array.isArray(tweetsBanco)) return;

      const formatados: Tweet[] = tweetsBanco
        .filter((t: any) => !t.parentTweetId)
        .map((t: any) => ({
          id: t.id,
          nome: t.user?.name || "Usuário",
          arroba: (t.user?.username || "user").trim(),
          texto: t.content,
          likes: t.likes ? t.likes.length : 0,
          euCurti: t.likes
            ? t.likes.some((l: any) => l.userId === loggedUser.id)
            : false,
          respostas: t.replies || [],
        }));

      setTweets(formatados);
    } catch (e) {
      console.error("Erro ao carregar:", e);
    }
  }, [token, loggedUser.id]);

useEffect(() => {

    if (!token) return;

    const inicializarFeed = async () => {

      try {

        await carregarTweets();

      } catch (err) {

        console.error("Erro ao carregar dados iniciais", err);

      }

    };

    inicializarFeed();

  }, [carregarTweets, token]);

const handleLike = async (tweetId: string) => {
  const tweetAlvo = tweets.find((t) => t.id === tweetId);
  if (!tweetAlvo) return;
  try {
    if (tweetAlvo.euCurti) {
      await api.delete(`/auth/unlike/${tweetId}`); 
    } else {
      await api.post(`/auth/like/${tweetId}`);
    }
    await carregarTweets();
  } catch (e) {
    console.error("Erro ao curtir/descurtir:", e);
  }
};

  const handleTweet = async () => {
    if (!content.trim()) return;
    try {
      await api.post("/auth/tweets", { content });
      setContent("");
      await carregarTweets();
    } catch {
      alert("Erro ao publicar");
    }
  };

  const theme = {
    bg: isDarkMode ? "#000" : "#fff",
    text: isDarkMode ? "#e7e9ea" : "#0f1419",
    border: isDarkMode ? "#2f3336" : "#eff3f4",
    card: isDarkMode ? "#16181c" : "#f7f9f9",
  };

  return (
    <div
      style={{
        ...containerStyle,
        backgroundColor: theme.bg,
        color: theme.text,
      }}
    >
      {}
      <SideBar loggedUser={loggedUser} theme={theme} />

      {}
      <main
        style={{
          width: "600px",
          borderRight: `1px solid ${theme.border}`,
        }}
      >
        <header
          style={{
            padding: "15px",
            borderBottom: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontWeight: "bold" }}>Página Inicial</span>
          <span
            onClick={() => setIsDarkMode(!isDarkMode)}
            style={{ cursor: "pointer" }}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </span>
        </header>

        <section
          style={{
            padding: "15px",
            borderBottom: `1px solid ${theme.border}`,
          }}
        >
          <Input 
            value={content} 
            onChange={(e: any) => setContent(e.target.value)} 
            theme={theme} 
            placeholder="O que está acontecendo?" 
          />
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleTweet}>Tweetar</Button>
          </div>
        </section>

        <section>
          {tweets.map((tweet) => (
            <TweetCard 
              key={tweet.id} 
              tweet={tweet} 
              theme={theme} 
              onLike={handleLike} 
            />
          ))}
        </section>
      </main>

      {}
      <aside style={{ width: "350px", padding: "20px" }}>
        <div
          style={{
            backgroundColor: theme.card,
            borderRadius: "16px",
            padding: "15px",
          }}
        >
          <h3 style={{ marginBottom: "20px" }}>O que está acontecendo</h3>

          <div style={{ marginBottom: "20px" }}>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>Tecnologia · Em alta</span>
            <div style={{ fontWeight: "bold", margin: "2px 0" }}>Prisma 7</div>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>1.200 Tweets</span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>Educação · Em alta</span>
            <div style={{ fontWeight: "bold", margin: "2px 0" }}>Growdev</div>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>tecnologia</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  minHeight: "100vh",
  fontFamily: "sans-serif",
};