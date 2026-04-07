import { useNavigate } from "react-router-dom";
interface TweetCardProps {
  tweet: {
    id: string;
    userId?: string;
    nome: string;
    arroba: string;
    texto: string;
    likes: number;
    euCurti: boolean;
    respostas?: any[];
    quantidadeRespostas?: number;
  };
  theme: {
    border: string;
  };
  onLike: (id: string) => void;
  onReply?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCommentSuccess?: () => void;
  isReply?: boolean;
  hasReply?: boolean;
}

export function TweetCard({
  tweet,
  theme,
  onLike,
  onReply,
  onDelete,
  onCommentSuccess,
  isReply,
  hasReply,
}: TweetCardProps) {
  const FOTO_PADRAO = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const navigate = useNavigate();

  const handleNavigateToProfile = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (tweet.userId) {
      navigate(`/profile/${tweet.userId}`);
    }
  };

  return (
    <div
      style={{
        padding: "12px 16px",
        borderBottom: hasReply ? "none" : `1px solid ${theme.border}`,
        position: "relative",
      }}
    >
      <div style={{ display: "flex", gap: "12px" }}>
        {}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            minWidth: "40px",
          }}
        >
          <div
            style={{
              width: "2px",
              height: "15px",
              backgroundColor: isReply ? theme.border : "transparent",
              marginTop: "-15px",
              marginBottom: "4px",
              cursor:"pointer",
            }}
          />

          <img
          onClick={handleNavigateToProfile}
            src={`https://github.com/${tweet.arroba.replace("@", "").trim().toLowerCase()}.png`}
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              borderRadius: "50%",
              objectFit: "cover",
              border: `1px solid ${theme.border}`,
              backgroundColor: "white",
              zIndex: 1,
            }}
            onError={(e) => (e.currentTarget.src = FOTO_PADRAO)}
            alt="Avatar"
          />

          {hasReply && (
            <div
              style={{
                width: "2px",
                flexGrow: 1,
                backgroundColor: theme.border,
                marginTop: "4px",
                marginBottom: "-15px",
              }}
            />
          )}
        </div>

        {}
        <div style={{ flex: 1 }}>
          {}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
              <strong style={{ fontSize: "15px" }}>{tweet.nome}</strong>
              <span style={{ color: "#71767b" }}>@{tweet.arroba}</span>
            </div>

            {}
            {onDelete && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete(tweet.id);
                }}
                style={{
                  cursor: "pointer",
                  fontSize: "14px",
                  padding: "10px",
                  marginTop: "-10px",
                  marginRight: "-10px",
                  opacity: 0.6,
                  position: "relative",
                  zIndex: 999,
                }}
              >
                🗑️
              </div>
            )}
          </div>

          <p style={{ margin: "4px 0", fontSize: "15px", lineHeight: "20px" }}>
            {tweet.texto}
          </p>

          {}
          <div style={{ display: "flex", gap: "40px", marginTop: "12px" }}>
            <div
              onClick={async () => {
                if (onReply) {
                  await Promise.resolve(onReply(tweet.id));
                  if (onCommentSuccess) {
                    onCommentSuccess();
                  }
                }
              }}
              style={{
                cursor: "pointer",
                color: "#71767b",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "18px" }}>💬</span>
              <span style={{ fontSize: "13px" }}>
                {tweet.quantidadeRespostas || 0}
              </span>
            </div>

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
              <span style={{ fontSize: "18px" }}>
                {tweet.euCurti ? "❤️" : "🤍"}
              </span>
              <span style={{ fontSize: "13px" }}>{tweet.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
