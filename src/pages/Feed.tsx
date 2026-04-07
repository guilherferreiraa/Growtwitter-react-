import { useEffect, useState, useCallback } from "react";
import api from "../services/apiService";

import { SideBar } from "../components/SideBar";
import { TweetCard } from "../components/TweetCard";
import { Input } from "../components/input";
import { Button } from "../components/button";

interface Tweet {
  id: string;
  userId?: string;
  nome: string;
  arroba: string;
  texto: string;
  likes: number;
  euCurti: boolean;
  respostas?: any[];
  quantidadeRespostas?: number;
}

export function Feed() {
  const [content, setContent] = useState("");
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const token = localStorage.getItem("token");
  const loggedUser = JSON.parse(localStorage.getItem("user") || "{}");

    const buscarRespostas = async (tweetId: string) => {
    try {
      const res = await api.get(`/auth/tweets/${tweetId}/replies`);
      const listaDeRespostas = res.data.data || res.data;

      if (Array.isArray(listaDeRespostas)) {
        setTweets((prev) =>
          prev.map((t) =>
            t.id === tweetId ? { ...t, respostas: listaDeRespostas } : t,
          ),
        );
      }
    } catch (e) {
      console.error("Erro ao buscar respostas:", e);
    }
  };

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
          userId: t.userId || t.user?.id,
          texto: t.content || t.texto,
          likes: t.likes ? t.likes.length : 0,
          euCurti:
            t.likes?.some((l: any) => l.userId === loggedUser.id) || false,
          quantidadeRespostas: t._count?.replies || 0,
          respostas: [],
        }));

      setTweets(formatados);
      formatados.forEach((tweet) => {
        buscarRespostas(tweet.id);
      });
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

const handleReply = async (tweetId: string) => {
  const texto = prompt("Digite sua resposta:");
  if (!texto || !texto.trim()) return;

  try {
    await api.post(`/auth/tweets/${tweetId}/reply`, { content: texto });
    await carregarTweets(); 
  } catch (error) {
    console.error("Erro ao responder:", error);
  }
};
  const handleDelete = async (tweetId: string) => {
  if (!window.confirm("Deseja realmente excluir?")) return;

  try {
    await api.delete(`/auth/tweets/${tweetId}`);
   
    await carregarTweets();
  } catch (e) {
    console.error("Erro ao deletar:", e);
    alert("Erro ao excluir o tweet.");
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
      <SideBar loggedUser={loggedUser} theme={theme} />

      <main
        style={{ width: "600px", borderRight: `1px solid ${theme.border}` }}
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
          style={{ padding: "15px", borderBottom: `1px solid ${theme.border}` }}
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
        {}
<section>
  {tweets.map((tweet) => {
    const respostasArray = tweet.respostas || [];
    const temRespostas = respostasArray.length > 0;
    const ehMeuTweetPrincipal = tweet.userId === loggedUser.id;

    return (
      <div
        key={tweet.id}
        style={{ borderBottom: temRespostas ? "none" : `1px solid ${theme.border}` }}
      >
        <TweetCard
          tweet={{
            ...tweet,
            userId: tweet.userId
          }}
          theme={theme}
          onLike={handleLike}
          onReply={handleReply}
          onDelete={ehMeuTweetPrincipal ? handleDelete : undefined}
          hasReply={temRespostas} 
        />

        {temRespostas &&
          respostasArray.map((reply: any, index: number) => {
            const donoDaRespostaId = reply.userId || reply.user?.id;
            const ehMinhaResposta = donoDaRespostaId === loggedUser.id;

            return (
              <TweetCard
                key={reply.id}
                tweet={{
                  id: reply.id,
                  nome: reply.user?.name || "Usuário",
                  arroba: reply.user?.username || "user",
                  texto: reply.content || reply.texto,
                  userId: donoDaRespostaId, 
                  likes: reply.likes ? reply.likes.length : 0,
                  euCurti: reply.likes?.some((l: any) => l.userId === loggedUser.id) || false,
                  respostas: [],
                  quantidadeRespostas: reply._count?.replies || 0, 
                }}
                theme={theme}
                onLike={handleLike}
                onDelete={ehMinhaResposta ? handleDelete : undefined}
                onReply={handleReply}
                isReply={true}          
                hasReply={index !== respostasArray.length - 1} 
              />
            );
          })}
      </div>
    );
  })}
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
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
              Tecnologia · Em alta
            </span>
            <div style={{ fontWeight: "bold", margin: "2px 0" }}>Prisma 7</div>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
              1.200 Tweets
            </span>
          </div>

          <div style={{ marginBottom: "10px" }}>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
              Educação · Em alta
            </span>
            <div style={{ fontWeight: "bold", margin: "2px 0" }}>Growdev</div>
            <span style={{ fontSize: "0.8rem", color: "#71767b" }}>
              tecnologia
            </span>
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
