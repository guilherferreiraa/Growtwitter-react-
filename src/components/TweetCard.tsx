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
  onReply?: (id: string) => void;
  isReply?: boolean;
  hasReply?: boolean;
}

export function TweetCard({
  tweet,
  theme,
  onLike,
  onReply,
  isReply,
  hasReply,
}: TweetCardProps) {
  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  return (
    <div
      style={{
        padding: "15px",
        borderBottom: hasReply ? "none" : `1px solid ${theme.border}`,
        position: "relative",
        paddingLeft: isReply ? "45px" : "15px",
      }}
    >
      {}
      {hasReply && (
        <div
          style={{
            position: "absolute",
            left: isReply ? "65px" : "35px",
            top: "60px",
            bottom: "0px",
            width: "2px",
            backgroundColor: theme.border,
            zIndex: 0,
          }}
        />
      )}

      <div style={{ display: "flex", gap: "12px", position: "relative", zIndex: 1 }}>
        <img
          src={`https://github.com/${tweet.arroba.replace("@", "").trim().toLowerCase()}.png`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            objectFit: "cover",
            border: `1px solid ${theme.border}`,
          }}
          onError={(e) => (e.currentTarget.src = FOTO_PADRAO)}
          alt="Avatar"
        />

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "5px" }}>
            <strong style={{ fontSize: "15px" }}>{tweet.nome}</strong>
            <span style={{ color: "#71767b" }}>@{tweet.arroba}</span>
          </div>

          <p style={{ margin: "4px 0", fontSize: "15px", lineHeight: "20px" }}>
            {tweet.texto}
          </p>

          <div style={{ display: "flex", gap: "40px", marginTop: "12px" }}>
            {}
            <div
              onClick={() => onReply?.(tweet.id)}
              style={{
                cursor: "pointer",
                color: "#71767b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💬</span>
              <span style={{ fontSize: "13px" }}>0</span>
            </div>

            {}
            <div
              onClick={() => onLike(tweet.id)}
              style={{
                cursor: "pointer",
                color: tweet.euCurti ? "#f91880" : "#71767b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>{tweet.euCurti ? "❤️" : "🤍"}</span>
              <span style={{ fontSize: "13px" }}>{tweet.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}