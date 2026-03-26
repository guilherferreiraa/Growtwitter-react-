interface TweetCardProps {
  tweet: {
    id: string;
    nome: string;
    arroba: string;
    texto: string;
    likes: number;
    euCurti: boolean;
  };
  theme: {
    border: string;
  };
  onLike: (id: string) => void; 
}

export function TweetCard({ tweet, theme, onLike }: TweetCardProps) {
  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div style={{ padding: "15px", borderBottom: "1px solid", borderBottomColor: theme.border }}>
      <div style={{ display: "flex", gap: "12px" }}>
<img
  src={`https://github.com/${tweet.arroba.replace("@", "").trim().toLowerCase()}.png`}
  style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }}
  onError={(e) => (e.currentTarget.src = FOTO_PADRAO)}
  alt="Avatar"
/>
        <div style={{ flex: 1 }}>
          <strong>{tweet.nome}</strong>{" "}
          <span style={{ color: "#71767b" }}>@{tweet.arroba}</span>
          <p style={{ margin: "5px 0" }}>{tweet.texto}</p>
          
          <div
            onClick={() => onLike(tweet.id)}
            style={{ 
              cursor: "pointer", 
              color: tweet.euCurti ? "#f91880" : "#71767b",
              display: "inline-block" 
            }}
          >
            {tweet.euCurti ? "❤️" : "🤍"} {tweet.likes}
          </div>
        </div>
      </div>
    </div>
  );
}